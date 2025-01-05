import { useState } from 'react';
import { QuizData, APIResponse } from '../types/quiz';
import { QUIZ_API_URL } from '../configs/apiConfig';

export const useQuiz = () => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [currentStep, setCurrentStep] = useState<'prompt' | 'quiz'>('prompt');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const generateQuiz = async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic for your quiz!');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();

    if(selectedFiles){
      selectedFiles.forEach((currentFile :File) => {
        formData.append('files', currentFile)
      });
    }
    formData.append('prompt', prompt);

    try {
      console.log("URL:" + QUIZ_API_URL);
      const response = await fetch(QUIZ_API_URL, {
        method: 'POST',
        body: formData
      });

      const data: APIResponse = await response.json();
      
      if (data.status === 'success' && data.data) {
        setQuiz(data.data);
        setCurrentStep('quiz');
        setCurrentQuestion(0);
        setScore(0);
        setShowResults(false);
      } else {
        setError(data.message || 'Failed to generate quiz');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selectedOption: number) => {
    if (!quiz) return;

    const correct = quiz.questions[currentQuestion].answer === selectedOption;
    if (correct) setScore(score + 1);

    const option = document.querySelector(`[data-index="${selectedOption}"]`);
    option?.classList.add(correct ? 'correct' : 'incorrect');

    setTimeout(() => {
      option?.classList.remove('correct', 'incorrect');
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentStep('prompt');
    setQuiz(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setPrompt('');
  };

  return {
    quiz,
    loading,
    error,
    prompt,
    currentStep,
    currentQuestion,
    score,
    showResults,
    selectedFiles,
    setPrompt,
    setSelectedFiles,
    generateQuiz,
    handleAnswer,
    resetQuiz
  };
};