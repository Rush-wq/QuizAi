import React from 'react';
import './App.css';
import { Layout } from './componenets/Layout';
import { QuizPrompt } from './componenets/QuizPrompt';
import { QuizSection } from './componenets/QuizSection';
import { useQuiz } from './hooks/useQuiz';

function App() {
  const {
    quiz,
    loading,
    error,
    prompt,
    currentStep,
    currentQuestion,
    score,
    showResults,
    setPrompt,
    setSelectedFiles,
    generateQuiz,
    handleAnswer,
    resetQuiz
  } = useQuiz();

  //Testign issue

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;  
    if (files) {  
      const filesArray = Array.from(files);  
      setSelectedFiles(filesArray);  
    }
  };

  return (
    <Layout>
      {currentStep === 'prompt' ? (
        <QuizPrompt
          prompt={prompt}
          error={error}
          loading={loading}
          onPromptChange={(e) => setPrompt(e.target.value)}
          onFileChange={handleFileChange}
          onGenerate={generateQuiz}
        />
      ) : (
        <QuizSection
          quiz={quiz}
          currentQuestion={currentQuestion}
          score={score}
          showResults={showResults}
          onAnswerSelect={handleAnswer}
          onReset={resetQuiz}
        />
      )}
    </Layout>
  );
}

export default App;