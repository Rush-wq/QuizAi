export interface QuizQuestion {
    title: string;
    options: string[];
    answer: number;
}
  
export interface QuizData {
    questions: QuizQuestion[];
}
  
export interface APIResponse {
    status: 'success' | 'error';
    data?: QuizData;
    message?: string;
}