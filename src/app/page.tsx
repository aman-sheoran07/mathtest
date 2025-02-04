'use client'

import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => (
  <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center">
    <div className="max-w-2xl text-center">
      <h1 className="text-4xl font-bold text-black mb-4">Welcome to Mathematics Quiz</h1>
      <p className="text-lg text-gray-700 mb-8">
        You are about to start a 20-minute algebra quiz covering various topics including 
        progressions, equations, and functions. The quiz consists of 15 questions, each carrying 1 mark.
      </p>
      <button
        onClick={onStart}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
      >
        Start Quiz
      </button>
    </div>
  </div>
);

const Timer = ({ timeLeft }: { timeLeft: number }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`fixed top-4 right-4 bg-white border border-gray-200 p-4 rounded-lg shadow text-center ${
      timeLeft <= 300 ? 'text-red-600' : 'text-black'
    }`}>
      <div className="text-lg font-bold">Time Remaining</div>
      <div className="text-2xl">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

interface QuestionNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({ 
  currentQuestion, 
  totalQuestions, 
  onPrevious, 
  onNext 
}) => (
  <div className="fixed bottom-4 left-4 bg-white border border-gray-200 p-4 rounded-lg shadow flex gap-4">
    <button
      onClick={onPrevious}
      disabled={currentQuestion === 1}
      className={`px-4 py-2 rounded ${
        currentQuestion === 1 
          ? 'bg-gray-300 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      Previous
    </button>
    <span className="flex items-center text-black">
      Question {currentQuestion} of {totalQuestions}
    </span>
    <button
      onClick={onNext}
      disabled={currentQuestion === totalQuestions}
      className={`px-4 py-2 rounded ${
        currentQuestion === totalQuestions 
          ? 'bg-gray-300 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      Next
    </button>
  </div>
);

export default function Page() {
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach(q => {
      if (userAnswers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowResults(true);
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentQuestion(prev => Math.min(questions.length, prev + 1));
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started && !showResults) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, showResults]);
  const questions = [
    {
      id: 1,
      question: "If f(1) = 1 and f(n) = 3n - f(n - 1) for all integers n > 1, then the value of f(2023) is:",
      type: "text",
      correctAnswer: "4047",
      explanation: "This is a recursive function. The pattern follows: f(2) = 6 - 1 = 5, f(3) = 9 - 5 = 4, f(4) = 12 - 4 = 8. The sequence alternates between increasing and decreasing values."
    },
    {
      id: 2,
      question: "If the harmonic mean of the roots of the equation (5 + √2)x² − bx + 8 + 2√5 = 0 is 4, then the value of b is:",
      type: "mcq",
      options: [
        { label: "4 − √5", value: "a" },
        { label: "2", value: "b" },
        { label: "4 + √5", value: "c" },
        { label: "3", value: "d" }
      ],
      correctAnswer: "c",
      explanation: "For a quadratic equation ax² + bx + c = 0, if H is the harmonic mean of roots, then H = -2a/b. Using this and substituting H = 4, we get b = 4 + √5."
    },
    // Add the rest of your questions here...
    {
      id: 3,
      question: "The sum of the first 15 terms in an arithmetic progression is 200, while the sum of the next 15 terms is 350. Then the common difference is:",
      type: "mcq",
      options: [
        { label: "7/9", value: "a" },
        { label: "1/3", value: "b" },
        { label: "4/9", value: "c" },
        { label: "2/3", value: "d" }
      ],
      correctAnswer: "d",
      explanation: "Using the formula for sum of AP and the difference between the two sums, we can derive that d = 2/3."
    },
    {
      id: 4,
      question: "A set of all possible values the function f(x) = x/|x|, where x ≠ 0, takes is:",
      type: "mcq",
      options: [
        { label: "{1,−1}", value: "a" },
        { label: "{1,0}", value: "b" },
        { label: "{1,0,−1}", value: "c" },
        { label: "{1}", value: "d" }
      ],
      correctAnswer: "a",
      explanation: "Since x ≠ 0, |x| will always be positive. Therefore, x/|x| will be 1 when x is positive and -1 when x is negative."
    },
    {
      id: 5,
      question: "Let a, b, c, d be positive integers such that a + b + c + d = 2023. If a : b = 2 : 5 and c : d = 5 : 2, then the maximum possible value of a + c is:",
      type: "text",
      correctAnswer: "7",
      explanation: "Given the ratios and constraints, we can solve to find that the maximum value of a + c is 7."
    },
    {
      id: 6,
      question: "If f(x) = |x - 1| + |x + 1|, then the minimum value of f(x) is:",
      type: "mcq",
      options: [
        { label: "0", value: "a" },
        { label: "1", value: "b" },
        { label: "2", value: "c" },
        { label: "4", value: "d" }
      ],
      correctAnswer: "c",
      explanation: "The minimum value occurs at x = 0, giving f(0) = |0-1| + |0+1| = 1 + 1 = 2"
    },
    {
      id: 7,
      question: "The value of x satisfying the inequality (x-3)/(x+2) < 0 is:",
      type: "mcq",
      options: [
        { label: "x < -2", value: "a" },
        { label: "-2 < x < 3", value: "b" },
        { label: "x > 3", value: "c" },
        { label: "x < -2 or x > 3", value: "d" }
      ],
      correctAnswer: "b",
      explanation: "For a fraction to be negative, one term must be positive and the other negative. So either -2 < x < 3."
    },
    {
      id: 8,
      question: "If the quadratic equation x² + px + q = 0 has roots whose sum is 6 and product is 5, then the values of p and q are:",
      type: "mcq",
      options: [
        { label: "p = -6, q = 5", value: "a" },
        { label: "p = 6, q = 5", value: "b" },
        { label: "p = -6, q = -5", value: "c" },
        { label: "p = 6, q = -5", value: "d" }
      ],
      correctAnswer: "a",
      explanation: "For a quadratic equation, sum of roots = -p/1 = 6 and product of roots = q = 5."
    },
    {
      id: 9,
      question: "The sum of infinite geometric series 1 + 1/3 + 1/9 + 1/27 + ... is:",
      type: "mcq",
      options: [
        { label: "3/2", value: "a" },
        { label: "2/3", value: "b" },
        { label: "3/4", value: "c" },
        { label: "4/3", value: "d" }
      ],
      correctAnswer: "a",
      explanation: "For infinite GP with first term a=1 and ratio r=1/3, sum = a/(1-r) = 1/(1-1/3) = 3/2"
    },
    {
      id: 10,
      question: "The domain of the function f(x) = √(x² - 4x + 3) is:",
      type: "mcq",
      options: [
        { label: "[1, 3]", value: "a" },
        { label: "(-∞, 1] ∪ [3, ∞)", value: "b" },
        { label: "[3, ∞)", value: "c" },
        { label: "(-∞, 1]", value: "d" }
      ],
      correctAnswer: "b",
      explanation: "For square root, expression inside must be ≥ 0. Solving x² - 4x + 3 ≥ 0 gives x ≤ 1 or x ≥ 3."
    },
    {
      id: 11,
      question: "If aₙ = n² + 2n, then the sum of first 10 terms of this sequence is:",
      type: "mcq",
      options: [
        { label: "385", value: "a" },
        { label: "395", value: "b" },
        { label: "495", value: "c" },
        { label: "415", value: "d" }
      ],
      correctAnswer: "c",
      explanation: "Sum the sequence for n=1 to 10: Σ(n² + 2n) = Σn² + 2Σn = 385 + 110 = 495"
    },
    {
      id: 12,
      question: "The value of x that satisfies the equation |2x - 1| = 3 is:",
      type: "mcq",
      options: [
        { label: "{2, -1}", value: "a" },
        { label: "{-1, 2}", value: "b" },
        { label: "{-1/2, 2}", value: "c" },
        { label: "{2, -2}", value: "d" }
      ],
      correctAnswer: "c",
      explanation: "Solve |2x - 1| = 3 gives 2x - 1 = 3 or 2x - 1 = -3, leading to x = 2 or x = -1/2"
    },
    {
      id: 13,
      question: "The range of the function f(x) = x²/(x² + 1) is:",
      type: "mcq",
      options: [
        { label: "[0, 1]", value: "a" },
        { label: "(0, 1)", value: "b" },
        { label: "[0, ∞)", value: "c" },
        { label: "(-∞, ∞)", value: "d" }
      ],
      correctAnswer: "b",
      explanation: "As x approaches ∞, f(x) approaches 1 but never reaches it. At x=0, f(x)=0 but is positive for all other x."
    },
    {
      id: 14,
      question: "In an arithmetic sequence, if a₅ = 11 and a₁₀ = 21, then the common difference is:",
      type: "mcq",
      options: [
        { label: "2", value: "a" },
        { label: "3", value: "b" },
        { label: "4", value: "c" },
        { label: "5", value: "d" }
      ],
      correctAnswer: "a",
      explanation: "Using a₁₀ - a₅ = 5d where d is common difference: 21 - 11 = 5d, so d = 2"
    },
    {
      id: 15,
      question: "If f(x) = x³ - 3x, then the local maximum of f(x) occurs at:",
      type: "mcq",
      options: [
        { label: "x = -1", value: "a" },
        { label: "x = 0", value: "b" },
        { label: "x = 1", value: "c" },
        { label: "x = 2", value: "d" }
      ],
      correctAnswer: "a",
      explanation: "f'(x) = 3x² - 3 = 0 gives x = ±1. Checking second derivative shows x = -1 is maximum."
    }
  ];

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach(q => {
      if (userAnswers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowResults(true);
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentQuestion(prev => Math.min(questions.length, prev + 1));
  };

  if (!started) {
    return <WelcomeScreen onStart={() => setStarted(true)} />;
  }

  const currentQ = questions[currentQuestion - 1];

  return (
      <div className="min-h-screen bg-white p-4">
        <Timer timeLeft={timeLeft} />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-black mb-2">Mathematics Quiz - Algebra</h1>
            <div className="text-gray-700">Time allowed: 20 minutes | Total marks: {questions.length}</div>
          </div>

          {!showResults ? (
              // Quiz questions view
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="mb-4 text-black">
                  <strong>{currentQ.id}. {currentQ.question}</strong>
                </div>

                {currentQ.type === 'mcq' ? (
                    <div className="space-y-2">
                      {currentQ.options.map((option) => (
                          <div key={option.value} className="flex items-center">
                            <input
                                type="radio"
                                id={`${currentQ.id}-${option.value}`}
                                name={`question-${currentQ.id}`}
                                value={option.value}
                                checked={userAnswers[currentQ.id] === option.value}
                                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                                className="mr-2"
                            />
                            <label htmlFor={`${currentQ.id}-${option.value}`} className="text-black">
                              {option.label}
                            </label>
                          </div>
                      ))}
                    </div>
                ) : (
                    <input
                        type="text"
                        value={userAnswers[currentQ.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full text-black"
                        placeholder="Enter your answer"
                    />
                )}
              </div>
          ) : (
              // Results view
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-black">Quiz Results</h2>
                <p className="text-lg mb-4 text-black">Your score: {score}/{questions.length}</p>
                {questions.map((q) => (
                    <div key={q.id} className="mb-4 p-4 border rounded">
                      <p className="font-bold text-black">{q.id}. {q.question}</p>
                      <p className="text-black">Your answer: {userAnswers[q.id] || 'Not answered'}</p>
                      <p className="text-black">Correct answer: {q.correctAnswer}</p>
                      <p className="mt-2 text-black"><strong>Explanation:</strong> {q.explanation}</p>
                    </div>
                ))}
                <button
                    onClick={() => {
                      setStarted(false);
                      setCurrentQuestion(1);
                      setUserAnswers({});
                      setShowResults(false);
                      setScore(0);
                      setTimeLeft(20 * 60);
                    }}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Retry Quiz
                </button>
              </div>
          )}

          {!showResults && (
              <>
                <QuestionNavigation
                    currentQuestion={currentQuestion}
                    totalQuestions={questions.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                />
                <div className="fixed bottom-4 right-4">
                  <button
                      onClick={handleSubmit}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Submit Quiz
                  </button>
                </div>
              </>
          )}
        </div>
      </div>
  );
};

export default Quiz;
