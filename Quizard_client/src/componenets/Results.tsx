import React from 'react';

interface ResultsProps {
  score: number;
  totalQuestions: number;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ score, totalQuestions, onReset }) => (
  <div className="results-card">
    <h2>Quiz Complete! 🎉</h2>
    <div className="score-display">
      <div className="score-circle">
        <span className="score-number">{score}</span>
        <span className="score-total">/{totalQuestions}</span>
      </div>
      <p className="score-text">
        You got {score} out of {totalQuestions} questions correct!
      </p>
    </div>
    <button onClick={onReset} className="primary-button">
      Create New Quiz
    </button>
  </div>
);