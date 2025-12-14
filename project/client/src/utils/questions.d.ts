export type Question = {
  id: number
  questionFull: string
  answer: string
  category: string
  parts: string[]
}

export declare function parseQuestions(filePath: string): Promise<Question[]>

