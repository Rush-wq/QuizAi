import React from 'react';
import { QuizData } from '../types/quiz';

interface QuizProps {
  quiz: QuizData;
  currentQuestion: number;
  onAnswerSelect: (index: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ quiz, currentQuestion, onAnswerSelect }) => (
  <div className="quiz-card">
    <div className="quiz-progress">
      <div 
        className="progress-bar" 
        style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
      ></div>
    </div>
    <div className="question-counter">
      Question {currentQuestion + 1} of {quiz.questions.length}
    </div>
    <div className="question-content">
      <h2>{quiz.questions[currentQuestion].title}</h2>
      <div className="options-grid">
        {quiz.questions[currentQuestion].options.map((option, index) => (
          <div
            key={index}
            className="option-card"
            data-index={index}
            onClick={() => onAnswerSelect(index)}
          >
            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
            <span className="option-text">{option}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);