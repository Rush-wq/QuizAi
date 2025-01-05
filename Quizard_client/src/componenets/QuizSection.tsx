import React from 'react';
import { Quiz } from './Quiz';
import { Results } from './Results';
import { QuizData } from '../types/quiz';

interface QuizSectionProps {
  quiz: QuizData | null;
  currentQuestion: number;
  score: number;
  showResults: boolean;
  onAnswerSelect: (index: number) => void;
  onReset: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  quiz,
  currentQuestion,
  score,
  showResults,
  onAnswerSelect,
  onReset
}) => {
  if (!quiz) return null;

  return (
    <div className="quiz-section">
      {!showResults ? (
        <Quiz
          quiz={quiz}
          currentQuestion={currentQuestion}
          onAnswerSelect={onAnswerSelect}
        />
      ) : (
        <Results
          score={score}
          totalQuestions={quiz.questions.length}
          onReset={onReset}
        />
      )}
    </div>
  );
};