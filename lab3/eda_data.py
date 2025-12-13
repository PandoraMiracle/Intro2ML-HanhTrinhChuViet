import os
import re
import json
import math
import shutil
import argparse
import unicodedata
from pathlib import Path

import numpy as np
import pandas as pd
from PIL import Image
import matplotlib.pyplot as plt
from tqdm import tqdm


# ----------------------------
# Utils: robust text reading
# ----------------------------
def read_text_robust(path: Path) -> str:
    encodings = ["utf-8-sig", "utf-8", "utf-16", "utf-16le", "utf-16be", "cp1252", "latin-1"]
    data = None
    for enc in encodings:
        try:
            data = path.read_text(encoding=enc)
            break
        except Exception:
            continue
    if data is None:
        # last resort: bytes -> decode with replacement
        data = path.read_bytes().decode("utf-8", errors="replace")
    # normalize unicode (good for Vietnamese + accents)
    data = unicodedata.normalize("NFC", data)
    # strip only line breaks at ends
    return data.strip("\r\n")


def safe_open_image(path: Path):
    try:
        img = Image.open(path)
        img.load()
        return img, None
    except Exception as e:
        return None, str(e)


def to_gray_np(img: Image.Image) -> np.ndarray:
    # Handle alpha by compositing on white
    if img.mode in ("RGBA", "LA"):
        bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        img = Image.alpha_composite(bg, img.convert("RGBA")).convert("RGB")
    if img.mode != "L":
        img = img.convert("L")
    arr = np.array(img, dtype=np.uint8)
    return arr


# ----------------------------
# Simple Otsu threshold
# ----------------------------
def otsu_threshold(gray_u8: np.ndarray) -> int:
    hist = np.bincount(gray_u8.ravel(), minlength=256).astype(np.float64)
    total = gray_u8.size
    if total == 0:
        return 128
    prob = hist / total
    omega = np.cumsum(prob)
    mu = np.cumsum(prob * np.arange(256))
    mu_t = mu[-1]
    sigma_b2 = (mu_t * omega - mu) ** 2 / (omega * (1.0 - omega) + 1e-12)
    t = int(np.argmax(sigma_b2))
    return t


# ----------------------------
# Blur metric: Laplacian variance
# ----------------------------
def laplacian_var(gray_u8: np.ndarray) -> float:
    g = gray_u8.astype(np.float32)
    # kernel:
    #  0  1  0
    #  1 -4  1
    #  0  1  0
    p = np.pad(g, ((1, 1), (1, 1)), mode="edge")
    lap = (
        p[1:-1, 2:] + p[1:-1, :-2] + p[2:, 1:-1] + p[:-2, 1:-1]
        - 4.0 * p[1:-1, 1:-1]
    )
    return float(lap.var())


def text_flags(text: str):
    flags = []
    if text is None:
        return ["missing_label"]
    if len(text.strip()) == 0:
        flags.append("empty_label")
    if "\t" in text:
        flags.append("has_tab")
    if re.search(r"  +", text):
        flags.append("multi_spaces")
    # non-printable (excluding normal whitespace)
    bad = [ch for ch in text if (ord(ch) < 32 and ch not in ("\n", "\r", "\t"))]
    if bad:
        flags.append("nonprintable_ctrl")
    return flags


def image_flags(row, thresholds):
    flags = []
    if row.get("img_error"):
        flags.append("image_open_error")
        return flags

    w, h = row["width"], row["height"]
    if w <= 0 or h <= 0:
        flags.append("bad_size")
        return flags

    if w < thresholds["min_w"] or h < thresholds["min_h"]:
        flags.append("too_small")
    if w > thresholds["max_w"] or h > thresholds["max_h"]:
        flags.append("too_large")

    if row["white_pct"] > thresholds["white_pct_hi"]:
        flags.append("too_white")
    if row["black_pct"] > thresholds["black_pct_hi"]:
        flags.append("too_black")

    if row["std"] < thresholds["std_lo"]:
        flags.append("low_contrast")

    if row["blur_var"] < thresholds["blur_lo"]:
        flags.append("blurry")

    ar = row["aspect"]
    if ar < thresholds["aspect_lo"] or ar > thresholds["aspect_hi"]:
        flags.append("weird_aspect")

    return flags


def make_plots(df: pd.DataFrame, out_dir: Path):
    plots = out_dir / "plots"
    plots.mkdir(parents=True, exist_ok=True)

    def hist(series, title, filename, bins=50, log=False):
        x = series.dropna().values
        if len(x) == 0:
            return
        plt.figure()
        plt.hist(x, bins=bins)
        plt.title(title)
        if log:
            plt.yscale("log")
        plt.tight_layout()
        plt.savefig(plots / filename, dpi=160)
        plt.close()

    hist(df["label_len"], "Label length distribution", "label_len.png", bins=60, log=True)
    hist(df["width"], "Image width distribution", "width.png", bins=60, log=True)
    hist(df["height"], "Image height distribution", "height.png", bins=60, log=True)
    hist(df["aspect"], "Aspect ratio (W/H)", "aspect.png", bins=60, log=True)
    hist(df["width_per_char"], "Width per char (W / max(1,len))", "width_per_char.png", bins=60, log=True)
    hist(df["mean"], "Mean intensity (0-255)", "mean_intensity.png", bins=60)
    hist(df["std"], "Std intensity", "std_intensity.png", bins=60, log=True)
    hist(df["blur_var"], "Laplacian variance (blur metric)", "blur_var.png", bins=60, log=True)


def copy_suspects(df: pd.DataFrame, out_dir: Path, max_copy: int = 300):
    sus_dir = out_dir / "suspects"
    sus_dir.mkdir(parents=True, exist_ok=True)

    suspects = df[df["flags"].astype(str).str.len() > 2].copy()
    suspects = suspects.sort_values(by=["flags", "label_len"], ascending=[True, False])

    n = 0
    for _, r in suspects.iterrows():
        if n >= max_copy:
            break
        src = Path(r["image_path"])
        if not src.exists():
            continue
        # filename: flags + original
        flags = r["flags"].replace("|", "_")[:120]
        dst = sus_dir / f"{flags}__{src.name}"
        try:
            shutil.copy2(src, dst)
            n += 1
        except Exception:
            continue


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=str, required=True, help="Folder containing PNG+TXT pairs")
    ap.add_argument("--out", type=str, default="eda_out", help="Output folder")
    ap.add_argument("--recursive", action="store_true", help="Scan recursively")
    ap.add_argument("--max_suspects", type=int, default=300, help="Max suspect images to copy")
    args = ap.parse_args()

    root = Path(args.root)
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.recursive:
        png_paths = sorted(root.rglob("*.png"))
        txt_paths = sorted(root.rglob("*.txt"))
    else:
        png_paths = sorted(root.glob("*.png"))
        txt_paths = sorted(root.glob("*.txt"))

    # map stem -> path
    png_map = {p.with_suffix("").name: p for p in png_paths}
    txt_map = {t.with_suffix("").name: t for t in txt_paths}
    print("PNG:", len(png_paths), "TXT:", len(txt_paths))
    print("Example PNG:", png_paths[:3])
    print("Example TXT:", txt_paths[:3])

    all_stems = sorted(set(png_map.keys()) | set(txt_map.keys()))

    rows = []
    char_counter = {}

    for stem in tqdm(all_stems, desc="Scanning"):
        img_path = png_map.get(stem)
        txt_path = txt_map.get(stem)

        text = None
        if txt_path and txt_path.exists():
            try:
                text = read_text_robust(txt_path)
            except Exception:
                text = None

        # image stats
        w = h = None
        mode = None
        mean = std = white_pct = black_pct = fg_pct = blur = None
        img_error = None

        if img_path and img_path.exists():
            img, err = safe_open_image(img_path)
            if err:
                img_error = err
            else:
                mode = img.mode
                w, h = img.size
                gray = to_gray_np(img)

                mean = float(gray.mean())
                std = float(gray.std())
                white_pct = float((gray >= 250).mean())
                black_pct = float((gray <= 5).mean())

                # foreground estimate via Otsu
                t = otsu_threshold(gray)
                # assume background is lighter
                # if mean is dark, invert logic
                if mean < 128:
                    fg = (gray > t)
                else:
                    fg = (gray < t)
                fg_pct = float(fg.mean())

                blur = laplacian_var(gray)

        # text stats
        lbl = text if text is not None else ""
        lbl_len = int(len(lbl))
        for ch in lbl:
            char_counter[ch] = char_counter.get(ch, 0) + 1

        row = {
            "stem": stem,
            "image_path": str(img_path) if img_path else "",
            "txt_path": str(txt_path) if txt_path else "",
            "has_png": bool(img_path),
            "has_txt": bool(txt_path),
            "img_error": img_error or "",
            "mode": mode or "",
            "width": int(w) if w is not None else np.nan,
            "height": int(h) if h is not None else np.nan,
            "aspect": (float(w) / float(h)) if (w and h) else np.nan,
            "label": lbl,
            "label_len": lbl_len,
            "width_per_char": (float(w) / max(1, lbl_len)) if (w and lbl_len is not None) else np.nan,
            "mean": mean if mean is not None else np.nan,
            "std": std if std is not None else np.nan,
            "white_pct": white_pct if white_pct is not None else np.nan,
            "black_pct": black_pct if black_pct is not None else np.nan,
            "fg_pct": fg_pct if fg_pct is not None else np.nan,
            "blur_var": blur if blur is not None else np.nan,
        }

        # preliminary flags
        flags = []
        if not row["has_png"]:
            flags.append("missing_png")
        if not row["has_txt"]:
            flags.append("missing_txt")
        flags += text_flags(text)

        row["flags_pre"] = "|".join(sorted(set(flags)))
        rows.append(row)

    df = pd.DataFrame.from_records(rows)
    print("df shape:", df.shape)
    print("df columns:", list(df.columns))

    if df.empty:
        raise SystemExit("Không có sample nào. Kiểm tra --root và --recursive.")

    if "width" not in df.columns:
        raise SystemExit("Không có cột 'width'. Bạn đang append rows sai kiểu (không phải dict) hoặc df bị ghi đè.")

    if df.empty or "width" not in df.columns:
        print("df is empty:", df.empty)
        print("df columns:", list(df.columns))
        raise SystemExit("EDA dừng: không tạo được cột width. Hãy kiểm tra root/recursive hoặc cách tạo df.")

    # thresholds computed from data (robust percentiles)
    w_valid = df["width"].dropna()
    h_valid = df["height"].dropna()
    aspect_valid = df["aspect"].dropna()
    blur_valid = df["blur_var"].dropna()
    std_valid = df["std"].dropna()

    def q(series, p, default):
        if len(series) == 0:
            return default
        return float(np.quantile(series.values, p))

    thresholds = {
        "min_w": max(16, int(q(w_valid, 0.01, 16))),
        "min_h": max(16, int(q(h_valid, 0.01, 16))),
        "max_w": int(q(w_valid, 0.995, 5000)),
        "max_h": int(q(h_valid, 0.995, 5000)),
        "aspect_lo": q(aspect_valid, 0.005, 0.1),
        "aspect_hi": q(aspect_valid, 0.995, 20.0),
        "white_pct_hi": 0.995,   # >99.5% white: very likely blank
        "black_pct_hi": 0.60,    # >60% black: suspicious (inverted/ink blob)
        "std_lo": q(std_valid, 0.02, 5.0),   # low contrast cutoff
        "blur_lo": q(blur_valid, 0.02, 20.0) # blur cutoff (data-dependent)
    }

    # add final flags
    final_flags = []
    for _, r in df.iterrows():
        flags = []
        if r["flags_pre"]:
            flags.extend(r["flags_pre"].split("|"))
        flags.extend(image_flags(r, thresholds))
        # label length suspicious
        if pd.notna(r["label_len"]):
            # p99 length to spot outliers
            p99 = int(np.quantile(df["label_len"].values, 0.99))
            if r["label_len"] > max(40, int(p99 * 1.2)):
                flags.append("very_long_label")
        final_flags.append("|".join(sorted(set([f for f in flags if f]))))

    df["flags"] = final_flags
    df.drop(columns=["flags_pre"], inplace=True)

    # summary
    total = len(df)

    matched = int(((df["has_png"] == True) & (df["has_txt"] == True) & (df["img_error"] == "")).sum())

    missing_txt = int(((df["has_png"] == True) & (df["has_txt"] == False)).sum())
    missing_png = int(((df["has_png"] == False) & (df["has_txt"] == True)).sum())

    open_err = int((df["img_error"] != "").sum())


    # char stats
    chars_sorted = sorted(char_counter.items(), key=lambda x: x[1], reverse=True)
    top_chars = [{"char": k, "count": v} for k, v in chars_sorted[:80]]

    # suggest params
    label_lens = df["label_len"].values
    p95_len = int(np.quantile(label_lens, 0.95))
    p99_len = int(np.quantile(label_lens, 0.99))
    med_h = int(np.nanmedian(df["height"].values)) if h_valid.size else None

    summary = {
        "root": str(root),
        "total_stems": total,
        "matched_pairs": matched,
        "missing_txt": int(missing_txt),
        "missing_png": int(missing_png),
        "image_open_errors": int(open_err),
        "thresholds": thresholds,
        "label_len": {
            "min": int(label_lens.min()) if total else None,
            "median": float(np.median(label_lens)) if total else None,
            "p95": p95_len,
            "p99": p99_len,
            "max": int(label_lens.max()) if total else None,
        },
        "suggestions": {
            "max_target_length_recommend": int(p99_len),   # Transformer/TrOCR max length
            "image_height_recommend": int(med_h) if med_h is not None else None,
        },
        "charset_size": int(len(char_counter)),
        "top_chars": top_chars,
    }

    # save outputs
    samples_csv = out_dir / "samples.csv"
    df.to_csv(samples_csv, index=False, encoding="utf-8-sig")

    (out_dir / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    # plots + suspects
    make_plots(df, out_dir)
    copy_suspects(df, out_dir, max_copy=args.max_suspects)

    # also save charset list
    charset_path = out_dir / "charset.txt"
    charset = "".join([c for c, _ in chars_sorted])
    charset_path.write_text(charset, encoding="utf-8")

    # print quick summary
    print("\n=== EDA DONE ===")
    print(f"Root: {root}")
    print(f"Total stems: {total}")
    print(f"Matched pairs: {matched}")
    print(f"Missing TXT: {missing_txt}")
    print(f"Missing PNG: {missing_png}")
    print(f"Image open errors: {open_err}")
    print(f"Charset size: {len(char_counter)}")
    print(f"Label len p95={p95_len}, p99={p99_len}")
    print(f"Suggested max_target_length ~ {p99_len}")
    if med_h is not None:
        print(f"Suggested image_height ~ {med_h}")
    print(f"Saved: {samples_csv}")
    print(f"Saved: {out_dir/'summary.json'}")
    print(f"Plots: {out_dir/'plots'}")
    print(f"Suspects: {out_dir/'suspects'}")


if __name__ == "__main__":
    main()
