export const parseQuestions = async (filePath) => {
    try {
        const response = await fetch(filePath);
        const text = await response.text();

        const lines = text.split('\n');

        const data = lines
            .filter(line => line.trim() !== '')
            .map((line, index) => {
                const parts = line.split('|');
                if (parts.length < 2) return null;

                // Cắt câu hỏi dựa trên dấu "___"
                const questionParts = parts[0].split('___');
                // -----------------------------

                return {
                    id: index,
                    questionFull: parts[0],
                    answer: parts[1].trim(),
                    category: parts[2] ? parts[2].trim() : 'Tổng hợp',
                    parts: questionParts // Trả về mảng đã cắt
                };
            })
            .filter(item => item !== null);

        return data;
    } catch (error) {
        console.error("Lỗi đọc file:", error);
        return [];
    }
};