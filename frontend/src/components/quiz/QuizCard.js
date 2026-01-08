import React, { useState, useEffect, useRef } from 'react';

// Load quiz data from question_cache.json
const generateQuizData = async (quizSession) => {
  try {
    const response = await fetch('/question_cache.json');
    const data = await response.json();
    
    // Get questions from the sample_topic (you can modify this to use different topics)
    const questions = data.sample_topic.questions;
    
    // Convert the JSON format to match our component's expected format
    const convertedQuestions = questions.map(q => ({
      question: q.question,
      choices: Object.values(q.choices), // Convert object to array
      correct: Object.keys(q.choices).indexOf(q.correct_answer), // Convert letter to index
      explanation: q.explanation,
      hint: q.explanation // Use explanation as hint for now
    }));
    
    // Return appropriate number of questions based on quiz session
    return convertedQuestions.slice(0, quizSession.questions);
  } catch (error) {
    console.error('Error loading quiz data:', error);
    // Fallback to sample questions if loading fails
    return [
      {
        question: 'What is the main purpose of reading comprehension?',
        choices: [
          'To memorize facts',
          'To understand and interpret text',
          'To speed read',
          'To skip difficult words'
        ],
        correct: 1,
        explanation: 'Reading comprehension is about understanding and interpreting the meaning of text, not just memorizing facts or reading quickly.',
        hint: 'Think about what reading comprehension really means.'
      }
    ].slice(0, quizSession.questions);
  }
};

export default function QuizCard({ quizSession, onQuizComplete, onStudySessionComplete, onClose, isLastQuiz, onFinalQuizComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quizSession.timeLimit);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef();

  // Check if this is a single quiz (1 question) or final quiz (3 questions)
  const isSingleQuiz = quizSession.questions === 1;
  const isFinalQuiz = quizSession.questions === 3;

  // Load quiz data when component mounts or quizSession changes
  useEffect(() => {
    const loadQuizData = async () => {
      setLoading(true);
      try {
        const data = await generateQuizData(quizSession);
        setQuizData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load quiz questions');
        console.error('Error loading quiz data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [quizSession]);

  // Local timer for frontend testing
  useEffect(() => {
    if (quizData.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setShowAnswer(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [quizData]);

  // Show hint after 2 minutes (120 seconds) for frontend testing
  useEffect(() => {
    if (timeLeft === 60 && !showHint) { // 2 minutes remaining (180 - 120 = 60)
      setShowHint(true);
    }
  }, [timeLeft, showHint]);

  // Reset state when quiz session changes
  useEffect(() => {
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setAnswers([]);
    setShowResults(false);
    setShowExplanation(null);
    setShowHint(false);
    setShowAnswer(false);
    setTimeLeft(quizSession.timeLimit);
    setError(null);
  }, [quizSession]);

  // Format time as mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const handleSelect = (i) => {
    if (!submitted && !showAnswer) setSelected(i);
  };

  const handleSubmit = async () => {
    try {
      setSubmitted(true);
      setAnswers((prev) => {
        const updated = [...prev];
        updated[current] = selected;
        return updated;
      });
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelected(null);
    if (current < quizData.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleContinueToStudy = async () => {
    try {
      if (quizSession.name === 'Final Quiz') {
        // For Final Quiz, go to dashboard
        onFinalQuizComplete();
      } else {
        // For all other quizzes, close the overlay and return to reading
        onClose();
      }
    } catch (err) {
      console.error('Error completing quiz:', err);
    }
  };

  const handleStudySessionComplete = () => {
    onStudySessionComplete();
  };

  // Loading state
  if (loading) {
    return (
      <div className="quiz-card-container">
        <div className="quiz-loading">
          <div className="quiz-loading-text">Loading quiz questions...</div>
          <div className="quiz-loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="quiz-card-container">
        <div className="quiz-error">
          <div className="quiz-error-text">{error}</div>
          <button
            className="quiz-retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Results UI
  if (showResults) {
    const correctCount = quizData.reduce(
      (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
      0
    );
    return (
      <div className="quiz-results-container">
        <div className="quiz-results-header">
          <div className="quiz-results-title">
            {quizSession.name} Completed — Score: {correctCount} / {quizData.length}
          </div>
        </div>
        <div className="quiz-results-questions">
          {quizData.map((q, i) => (
            <div key={i} className="quiz-result-item">
              <div className="quiz-result-question">
                Q{i + 1}: {q.question}
              </div>
              <div className="quiz-result-answer">
                <span>Your answer:</span>{' '}
                <span className={answers[i] === q.correct ? 'correct' : 'incorrect'}>
                  {typeof answers[i] === 'number'
                    ? q.choices[answers[i]]
                    : <span className="no-answer">No answer</span>}
                </span>
              </div>
              <div className="quiz-result-correct">
                <span>Correct answer:</span>{' '}
                <span className="correct-answer">{q.choices[q.correct]}</span>
              </div>
              <div className="quiz-result-explanation">
                <span>Explanation:</span> {q.explanation}
              </div>
            </div>
          ))}
        </div>
        <button
          className="quiz-continue-button"
          onClick={handleContinueToStudy}
        >
          {quizSession.name === 'Final Quiz' ? 'Go to Dashboard' : 'Go on Reading'}
        </button>
      </div>
    );
  }

  // Main Quiz UI
  return (
    <div className="quiz-main-container">
      <div className="quiz-content-wrapper">
        {/* Large Question Number for final quiz */}
        {isFinalQuiz && (
          <div className="quiz-question-number">
            <span>Q{current + 1}</span>
          </div>
        )}
        
        {/* Quiz Card */}
        <div className="quiz-card">
          {/* Quiz Session Header */}
          <div className="quiz-header">
            <h1 className="quiz-title">{quizSession.name}</h1>
            <p className="quiz-progress">Question {current + 1} of {quizData.length}</p>
          </div>
          
          <h2 className="quiz-question">{quizData[current].question}</h2>
          
          {/* Show Answer if Time Expired */}
          {showAnswer && (
            <div className="quiz-time-up">
              <div className="quiz-time-up-title">Time's Up! Here's the Answer:</div>
              <div className="quiz-time-up-answer">{quizData[current].choices[quizData[current].correct]}</div>
              <div className="quiz-time-up-explanation">{quizData[current].explanation}</div>
            </div>
          )}

          {/* Show Hint if Available */}
          {showHint && !showAnswer && (
            <div className="quiz-hint">
              <div className="quiz-hint-title">💡 Hint:</div>
              <div className="quiz-hint-text">{quizData[current].hint}</div>
            </div>
          )}

          <div className="quiz-choices">
            {quizData[current].choices.map((c, i) => {
              let className = 'quiz-choice';
              
              if (submitted || showAnswer) {
                if (i === quizData[current].correct) {
                  className += ' quiz-choice-correct';
                }
                if (i === selected && i !== quizData[current].correct) {
                  className += ' quiz-choice-incorrect';
                }
              } else if (i === selected) {
                className += ' quiz-choice-selected';
              }
              
              return (
                <label
                  key={i}
                  className={className}
                  onClick={() => handleSelect(i)}
                >
                  <input
                    type="radio"
                    checked={selected === i}
                    onChange={() => handleSelect(i)}
                    disabled={submitted || showAnswer}
                    className="quiz-choice-radio"
                  />
                  <span>{c}</span>
                </label>
              );
            })}
          </div>
          
          {/* Button */}
          {!showAnswer && (
            <button
              className={`quiz-submit-button ${
                !submitted
                  ? selected === null
                    ? 'disabled'
                    : 'enabled'
                  : 'next'
              }`}
              disabled={!submitted && selected === null}
              onClick={!submitted ? handleSubmit : handleNext}
            >
              {!submitted
                ? 'Submit'
                : current < quizData.length - 1
                ? 'Next Question'
                : 'Finish Quiz'}
            </button>
          )}
          
          {/* Continue Button when Time Expired */}
          {showAnswer && (
            <button
              className="quiz-continue-button"
              onClick={handleContinueToStudy}
            >
              {quizSession.name === 'Final Quiz' ? 'Go to Dashboard' : 'Go on Reading'}
            </button>
          )}
        </div>
        
        {/* Persona and Timer */}
        <div className="quiz-persona-section">
          <div className="quiz-persona">
            <img
              src="/cat-persona.png"
              alt="Quiz Persona"
              className="quiz-persona-image"
            />
          </div>
          <div className="quiz-timer">
            <div className="quiz-timer-label">Time Left</div>
            <div className={`quiz-timer-display ${timeLeft <= 30 ? 'warning' : ''}`}>
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar - Only show for Final Quiz */}
      {isFinalQuiz && (
        <div className="quiz-progress-bar">
          <div className="quiz-progress-label">You got this!</div>
          <div className="quiz-progress-container">
            <div className="quiz-progress-track">
              <div
                className="quiz-progress-fill"
                style={{ width: `${((current + 1) / quizData.length) * 100}%` }}
              />
            </div>
            <div className="quiz-progress-text">
              Q{current + 1} / {quizData.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}