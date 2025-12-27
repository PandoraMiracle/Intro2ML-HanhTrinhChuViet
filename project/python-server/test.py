# coding: utf-8
import torch
from transformers import AutoConfig, AutoTokenizer, AutoModelForCausalLM

# Model Vietnamese không bị gated - có thể tải ngay
MODEL_ID = "vilm/vinallama-7b-chat"  

# ============================================================
# MÔ HÌNH SỬ DỤNG
# ============================================================
print("=" * 60)
print("MÔ HÌNH SỬ DỤNG: VinaLLaMA-7B-Chat")
print("=" * 60)
print("""
📌 Định nghĩa:
   VinaLLaMA-7B-Chat là một Large Language Model (LLM) được fine-tune 
   từ LLaMA-2 7B cho tiếng Việt, tối ưu cho các tác vụ đối thoại (chat).

📌 Reference:
   - HuggingFace: https://huggingface.co/vilm/vinallama-7b-chat
   - Base model: Meta LLaMA-2 7B
   - Fine-tuned by: VILM Team

📌 Lý do chọn model:
   1. Pretrain/Fine-tune trên dữ liệu tiếng Việt → hiểu ngữ cảnh Việt tốt
   2. Kích thước 7B params → cân bằng giữa hiệu suất và tài nguyên
   3. Không bị gated (public) → dễ dàng tải và sử dụng
   4. Dựa trên LLaMA-2 → kiến trúc hiện đại, hiệu quả
   5. Hỗ trợ chat format → phù hợp cho ứng dụng chatbot
""")

# 1) Load config / tokenizer / model
print("\n⏳ Đang tải model...")
config = AutoConfig.from_pretrained(MODEL_ID, trust_remote_code=True)
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    trust_remote_code=True,
    device_map="auto",     # tự phân bố lên GPU/CPU nếu có
    torch_dtype="auto"
)
print("✅ Tải model thành công!")

# ============================================================
# KIẾN TRÚC CHI TIẾT
# ============================================================
print("\n" + "=" * 60)
print("KIẾN TRÚC CHI TIẾT (LLaMA-2 Architecture)")
print("=" * 60)
print("""
┌─────────────────────────────────────────────────────────────┐
│                    VinaLLaMA-7B-Chat                        │
│                  (LLaMA-2 Architecture)                     │
├─────────────────────────────────────────────────────────────┤
│  Input Text                                                 │
│      ↓                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Tokenizer (BPE - Byte Pair Encoding)               │   │
│  │  vocab_size = 32,000                                │   │
│  └─────────────────────────────────────────────────────┘   │
│      ↓                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Embedding Layer                                     │   │
│  │  (32000 × 4096)                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│      ↓                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Transformer Decoder Blocks × 32             │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  RMSNorm (Root Mean Square Normalization)     │  │   │
│  │  │      ↓                                        │  │   │
│  │  │  Multi-Head Attention (GQA)                   │  │   │
│  │  │  • n_heads = 32                               │  │   │
│  │  │  • n_kv_heads = 32                            │  │   │
│  │  │  • head_dim = 128                             │  │   │
│  │  │  • RoPE (Rotary Position Embedding)           │  │   │
│  │  │      ↓                                        │  │   │
│  │  │  Residual Connection                          │  │   │
│  │  │      ↓                                        │  │   │
│  │  │  RMSNorm                                      │  │   │
│  │  │      ↓                                        │  │   │
│  │  │  FFN (Feed Forward Network) - SwiGLU          │  │   │
│  │  │  • gate_proj: 4096 → 11008                    │  │   │
│  │  │  • up_proj:   4096 → 11008                    │  │   │
│  │  │  • down_proj: 11008 → 4096                    │  │   │
│  │  │  • Activation: SiLU (Swish)                   │  │   │
│  │  │      ↓                                        │  │   │
│  │  │  Residual Connection                          │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│      ↓                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Final RMSNorm                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│      ↓                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  LM Head (Linear: 4096 → 32000)                     │   │
│  └─────────────────────────────────────────────────────┘   │
│      ↓                                                      │
│  Output Logits → Softmax → Next Token Prediction           │
└─────────────────────────────────────────────────────────────┘
""")

# ============================================================
# MÔ TẢ THAM SỐ CẤU HÌNH
# ============================================================
print("=" * 60)
print("THAM SỐ CẤU HÌNH (CONFIG)")
print("=" * 60)
config_params = {
    "model_type": "Loại mô hình",
    "hidden_size": "Kích thước hidden state (d_model)",
    "intermediate_size": "Kích thước FFN intermediate",
    "num_hidden_layers": "Số lớp Transformer",
    "num_attention_heads": "Số attention heads",
    "num_key_value_heads": "Số KV heads (GQA)",
    "vocab_size": "Kích thước vocabulary",
    "max_position_embeddings": "Độ dài context tối đa",
    "rms_norm_eps": "Epsilon cho RMSNorm",
    "rope_theta": "Theta cho RoPE",
    "hidden_act": "Hàm kích hoạt",
}

for key, desc in config_params.items():
    if hasattr(config, key):
        value = getattr(config, key)
        print(f"  {desc:35} │ {key:25} = {value}")

# ============================================================
# SỐ LƯỢNG THAM SỐ
# ============================================================
print("\n" + "=" * 60)
print("SỐ LƯỢNG THAM SỐ (PARAMETERS)")
print("=" * 60)
total_params = sum(p.numel() for p in model.parameters())
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"  Total parameters:      {total_params:>15,}")
print(f"  Trainable parameters:  {trainable_params:>15,}")
print(f"  Non-trainable:         {total_params - trainable_params:>15,}")
print(f"  Model size (float16):  ~{total_params * 2 / 1e9:.2f} GB")
print(f"  Model size (float32):  ~{total_params * 4 / 1e9:.2f} GB")

# Chi tiết từng layer
print("\n📊 Phân bố tham số theo layer:")
param_breakdown = {}
for name, param in model.named_parameters():
    layer_type = name.split('.')[0] if '.' in name else name
    if layer_type not in param_breakdown:
        param_breakdown[layer_type] = 0
    param_breakdown[layer_type] += param.numel()

for layer, count in param_breakdown.items():
    percentage = count / total_params * 100
    print(f"  {layer:20} │ {count:>15,} ({percentage:5.2f}%)")

# ============================================================
# HÀM KÍCH HOẠT
# ============================================================
print("\n" + "=" * 60)
print("HÀM KÍCH HOẠT (ACTIVATION FUNCTION)")
print("=" * 60)
print(f"""
📌 Activation được sử dụng: {config.hidden_act.upper() if hasattr(config, 'hidden_act') else 'N/A'}

📌 Chi tiết về SiLU (Swish):
   • Công thức: SiLU(x) = x * σ(x) = x * (1 / (1 + e^(-x)))
   • Là smooth approximation của ReLU
   • Có đạo hàm mượt → huấn luyện ổn định hơn

📌 SwiGLU (Swish-Gated Linear Unit):
   • Được sử dụng trong FFN layer của LLaMA
   • Công thức: SwiGLU(x) = SiLU(W_gate · x) ⊙ (W_up · x)
   • Hiệu quả hơn GELU/ReLU cho LLM
   
📌 So sánh với các activation khác:
   ┌────────────┬─────────────────────────────────┬─────────────┐
   │ Activation │ Công thức                       │ Đặc điểm    │
   ├────────────┼─────────────────────────────────┼─────────────┤
   │ ReLU       │ max(0, x)                       │ Đơn giản    │
   │ GELU       │ x · Φ(x)                        │ Smooth      │
   │ SiLU/Swish │ x · σ(x)                        │ Smooth      │
   │ SwiGLU     │ SiLU(Wx) ⊙ (W'x)               │ Gated, LLM  │
   └────────────┴─────────────────────────────────┴─────────────┘
""")

# ============================================================
# INFERENCE DEMO
# ============================================================
print("=" * 60)
print("INFERENCE DEMO")
print("=" * 60)
prompt = "Điền từ còn thiếu vào câu \"Hôm nay trời ....\", tui điền từ \"đẹp\" thì có đúng ngữ pháp và cấu trúc câu tiếng việt hay không?"
print(f"📝 Prompt: {prompt}")
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

with torch.no_grad():
    out = model.generate(
        **inputs,
        max_new_tokens=40,
        do_sample=False  # greedy cho ổn định
    )

print(f"🤖 Output: {tokenizer.decode(out[0], skip_special_tokens=True)}")
