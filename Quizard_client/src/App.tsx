// App.tsx
import { useState, useEffect } from 'react';
import './App.css';

interface QuizQuestion {
  title: string;
  options: string[];
  answer: number;
}

interface QuizData {
  questions: QuizQuestion[];
}

interface APIResponse {
  status: 'success' | 'error';
  data?: QuizData;
  message?: string;
}

// Add ThemeToggle component
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};

function App() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [currentStep, setCurrentStep] = useState<'prompt' | 'quiz'>('prompt');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const generateQuiz = async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic for your quiz!');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();

    if(selectedFile){
      formData.append('file', selectedFile)
    }
    formData.append('prompt', prompt);

    try {

      const response = await fetch('http://localhost:5000/api/v1/quiz/generate_quiz', {
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

  if (currentStep === 'prompt') {
    return (
      <div className="app-container">
        <ThemeToggle />
        <div className="prompt-section">
          <div className="prompt-header">
            <h1>Quizard AI</h1>
            <p className="subtitle">Create custom quizzes instantly with AI</p>
          </div>
          <div className="prompt-card">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your quiz topic (e.g., 'Create a quiz about Ancient Egypt focusing on the pyramids and pharaohs')"
              className="prompt-input"
            />
            {error && <p className="error-message">{error}</p>}
            <button 
              onClick={generateQuiz}
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
            <input type='file' className='file-input' onChange={handleFileChange}></input>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <ThemeToggle />
      <div className="quiz-section">
        {!showResults ? (
          quiz && (
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
                      onClick={() => handleAnswer(index)}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                      <span className="option-text">{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="results-card">
            <h2>Quiz Complete! 🎉</h2>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-total">/{quiz?.questions.length}</span>
              </div>
              <p className="score-text">
                You got {score} out of {quiz?.questions.length} questions correct!
              </p>
            </div>
            <button onClick={resetQuiz} className="primary-button">
              Create New Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;