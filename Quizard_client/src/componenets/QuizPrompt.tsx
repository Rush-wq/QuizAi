import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface QuizPromptProps {
  prompt: string;
  error: string | null;
  loading: boolean;
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
}

export const QuizPrompt: React.FC<QuizPromptProps> = ({
  prompt,
  error,
  loading,
  onPromptChange,
  onFileChange,
  onGenerate
}) => (
  <div className="app-container">
    <ThemeToggle />
    <div className="prompt-section">
      <div className="prompt-header">
        <h1>Quizard AI</h1>
        <p className="subtitle">Create custom quizzes instantly with AI</p>
        <p className="subtitle">*Note Quiz Creation might take a while on you first generation</p>
      </div>
      <div className="prompt-card">
        <textarea
          value={prompt}
          onChange={onPromptChange}
          placeholder="Enter your quiz topic (e.g., 'Create a quiz about Ancient Egypt focusing on the pyramids and pharaohs')"
          className="prompt-input"
        />
        {error && <p className="error-message">{error}</p>}
        <button 
          onClick={onGenerate}
          disabled={loading}
          className="primary-button"
        >
          {loading ? (
            <span className="loading-spinner">
              <span className="spinner"></span>
              Generating Quiz...
            </span>
          ) : (
            'Create Quiz'
          )}
        </button>
        <input 
          type='file' 
          className='file-input' 
          onChange={onFileChange} 
          accept=".pdf, .jpg, .jpeg, .png, .txt"
          multiple
        />
      </div>
    </div>
  </div>
);