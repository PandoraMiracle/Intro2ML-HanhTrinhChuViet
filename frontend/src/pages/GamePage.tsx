import { useState } from 'react'
import DrawingBoard from '../components/DrawingBoard'

function GamePage() {
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

    return (
        <div style={{ padding: '20px 0' }}>
            <section className="section">
                <div className="section-head">
                    <p className="eyebrow">Hành trình của bạn</p>
                    <h2>Luyện viết chữ Việt</h2>
                    <p className="section-lede">
                        Vẽ lại các chữ cái tiếng Việt để luyện tập và ghi nhớ. Sau khi hoàn thành, bạn có thể lưu và chia sẻ.
                    </p>
                </div>
            </section>

            <section style={{ margin: '24px 0' }}>
                <DrawingBoard
                    onUploaded={(url) => {
                        setUploadedUrl(url)
                    }}
                />
            </section>

            {uploadedUrl && (
                <section className="section">
                    <div className="auth-card">
                        <div>
                            <p className="eyebrow">Thành công</p>
                            <h3>Ảnh đã được lưu</h3>
                            <p className="section-lede">
                                Bạn có thể xem ảnh tại:{' '}
                                <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                                    {uploadedUrl}
                                </a>
                            </p>
                            <img
                                src={uploadedUrl}
                                alt="Drawing"
                                style={{
                                    maxWidth: '100%',
                                    borderRadius: 12,
                                    marginTop: 12,
                                    border: '1px solid #e0ecd7',
                                }}
                            />
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default GamePage

