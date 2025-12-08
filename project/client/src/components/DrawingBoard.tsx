import { useEffect, useRef, useState } from 'react'

type Props = {
    onSave?: (imageData: string) => void
    onUploaded?: (url: string) => void
    uploadUrl?: string
    strokeColor?: string
    strokeWidth?: number
}

const DrawingBoard = ({
    onSave,
    onUploaded,
    uploadUrl = '/api/upload',
    strokeColor = '#1f3c32',
    strokeWidth = 3,
}: Props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const isDrawingRef = useRef(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadMsg, setUploadMsg] = useState<string | null>(null)

    // Fit canvas to parent size
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const resize = () => {
            const parent = canvas.parentElement
            const w = parent?.clientWidth ?? window.innerWidth
            const h = parent?.clientHeight ?? 500
            canvas.width = w
            canvas.height = h
        }

        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [])

    const getCtx = () => {
        const canvas = canvasRef.current
        if (!canvas) return null
        return canvas.getContext('2d')
    }

    const startDraw = (x: number, y: number) => {
        const ctx = getCtx()
        if (!ctx) return
        isDrawingRef.current = true
        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    const draw = (x: number, y: number) => {
        if (!isDrawingRef.current) return
        const ctx = getCtx()
        if (!ctx) return

        ctx.lineWidth = strokeWidth
        ctx.lineCap = 'round'
        ctx.strokeStyle = strokeColor
        ctx.lineTo(x, y)
        ctx.stroke()
    }

    const endDraw = () => {
        isDrawingRef.current = false
    }

    const getPos = (e: TouchEvent | MouseEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }
        const rect = canvas.getBoundingClientRect()

        if (e instanceof TouchEvent) {
            const t = e.touches[0]
            return { x: t.clientX - rect.left, y: t.clientY - rect.top }
        }

        return {
            x: (e as MouseEvent).clientX - rect.left,
            y: (e as MouseEvent).clientY - rect.top,
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        const { x, y } = getPos(e.nativeEvent)
        startDraw(x, y)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        const { x, y } = getPos(e.nativeEvent)
        draw(x, y)
    }

    const handleMouseUp = () => endDraw()

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault()
        const { x, y } = getPos(e.nativeEvent)
        startDraw(x, y)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault()
        const { x, y } = getPos(e.nativeEvent)
        draw(x, y)
    }

    const handleTouchEnd = () => endDraw()

    const handleSave = async () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const imageData = canvas.toDataURL('image/png')
        if (onSave) onSave(imageData)

        if (!uploadUrl) return
        try {
            setIsUploading(true)
            setUploadMsg(null)
            
            // Convert canvas to blob
            canvas.toBlob(async (blob: Blob | null) => {
                if (!blob) {
                    setUploadMsg('Không thể tạo blob từ canvas')
                    setIsUploading(false)
                    return
                }

                // Create FormData and append blob as file
                const formData = new FormData()
                formData.append('image', blob, 'drawing.png')

                const resp = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formData,
                })
                
                if (!resp.ok) throw new Error('Upload không thành công')
                const data = (await resp.json()) as { url?: string; message?: string; success?: boolean }
                if (data.url && onUploaded) onUploaded(data.url)
                setUploadMsg(data.message || 'Đã upload thành công')
                setIsUploading(false)
            }, 'image/png')
        } catch (err) {
            setUploadMsg((err as Error).message || 'Lỗi upload')
            setIsUploading(false)
        }
    }

    const handleClear = () => {
        const ctx = getCtx()
        const canvas = canvasRef.current
        if (!ctx || !canvas) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return (
        <div style={{ width: '100%', height: '500px', position: 'relative' }}>
            <canvas
                ref={canvasRef}
                style={{
                    border: '2px solid #e0ecd7',
                    touchAction: 'none',
                    width: '100%',
                    height: '100%',
                    background: '#fffef6',
                    borderRadius: 12,
                    boxShadow: '0 10px 24px rgba(24, 74, 53, 0.08)',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            />

            <div
                style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                }}
            >
                <button
                    onClick={handleClear}
                    className="cta ghost"
                    style={{ padding: '8px 14px' }}
                    type="button"
                >
                    Xóa
                </button>
                <button
                    onClick={handleSave}
                    className="cta solid"
                    style={{ padding: '8px 14px' }}
                    type="button"
                    disabled={isUploading}
                >
                    {isUploading ? 'Đang lưu...' : 'Lưu'}
                </button>
                {uploadMsg && (
                    <span style={{ fontSize: '0.9rem', color: '#1f3c32' }}>{uploadMsg}</span>
                )}
            </div>
        </div>
    )
}

export default DrawingBoard
