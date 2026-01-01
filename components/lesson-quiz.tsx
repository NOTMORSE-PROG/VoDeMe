'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Trophy, Home, ArrowRight, ChevronLeft, ChevronRight, Award, Brain, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
}

interface QuizAttempt {
  id: string;
  score: number;
  passed: boolean;
  completedAt: string;
}

interface LessonQuizProps {
  lessonId: string;
  quizId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  previousAttempts: QuizAttempt[];
  hasNextLesson?: boolean;
  returnUrl?: string;
  initialResults?: any;
}

export function LessonQuiz({
  lessonId,
  quizId,
  title,
  questions,
  passingScore,
  previousAttempts,
  hasNextLesson,
  returnUrl = '/dashboard?tab=lessons',
  initialResults,
}: LessonQuizProps) {
  const router = useRouter();

  // Shuffle function (Fisher-Yates algorithm) - shuffles text but keeps labels A, B, C, D
  const shuffleOptions = (question: QuizQuestion) => {
    // Find the correct answer text first
    const correctOption = question.options.find(opt => opt.label === question.correctAnswer);
    const correctText = correctOption?.text;

    // Extract all option texts
    const texts = question.options.map(opt => opt.text);

    // Shuffle the texts using Fisher-Yates
    for (let i = texts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [texts[i], texts[j]] = [texts[j], texts[i]];
    }

    // Reassign shuffled texts to A, B, C, D labels
    const shuffledOptions = question.options.map((opt, index) => ({
      label: opt.label, // Keep original labels (A, B, C, D)
      text: texts[index], // Assign shuffled text
    }));

    // Find the new label that has the correct text
    const newCorrectLabel = shuffledOptions.find(opt => opt.text === correctText)?.label || question.correctAnswer;

    return {
      ...question,
      options: shuffledOptions,
      correctAnswer: newCorrectLabel, // Update correct answer to new label
    };
  };

  // Shuffle all questions' options on mount (and allow reshuffling on retry)
  // Start with unshuffled questions to avoid hydration mismatch
  const [shuffledQuestions, setShuffledQuestions] = useState(questions);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Shuffle on client-side mount only (avoids hydration mismatch)
  useEffect(() => {
    setShuffledQuestions(questions.map(shuffleOptions));
  }, []); // Only run once on mount
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answerTimes, setAnswerTimes] = useState<Record<string, number>>({}); // Track time taken per question
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now()); // Track when question was shown
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(initialResults || null);
  const [direction, setDirection] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds per question

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;
  const allQuestionsAnswered = Object.keys(answers).length === shuffledQuestions.length;
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  // Timer countdown effect
  useEffect(() => {
    // Reset timer and start time when question changes
    setTimeRemaining(60);
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  useEffect(() => {
    // Don't run timer if quiz is submitted or if results are showing
    if (results || isSubmitting) return;

    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - record time if not already recorded (use functional update to get latest state)
          setAnswerTimes((prevTimes) => {
            if (!prevTimes[currentQuestion.id]) {
              return { ...prevTimes, [currentQuestion.id]: 60 };
            }
            return prevTimes;
          });

          // Time's up - auto-submit current answer or move to next
          if (!answers[currentQuestion.id]) {
            toast.warning(`Time's up for question ${currentQuestionIndex + 1}!`);
          }

          // Auto-advance to next question or submit
          if (!isLastQuestion) {
            setDirection(1);
            setCurrentQuestionIndex((prev) => prev + 1);
          } else {
            // Last question - auto-submit if all answered
            if (allQuestionsAnswered) {
              handleSubmit();
            }
          }
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, results, isSubmitting, answers, currentQuestion.id, isLastQuestion, allQuestionsAnswered]);

  const getTimerColor = () => {
    if (timeRemaining > 30) return 'text-green-600';
    if (timeRemaining > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

    // Record time taken for this answer (only if not already answered)
    // Use functional update to check the latest state (avoids stale closure issues)
    const timeTaken = Math.max(1, Math.floor((Date.now() - questionStartTime) / 1000)); // Convert to seconds, minimum 1s
    setAnswerTimes((prev) => {
      if (prev[questionId] === undefined) {
        return { ...prev, [questionId]: timeTaken };
      }
      return prev;
    });
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setDirection(1);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setDirection(-1);
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length !== shuffledQuestions.length) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId,
          answers: Object.entries(answers).map(([questionId, selectedAnswer]) => {
            // Find the shuffled question
            const shuffledQ = shuffledQuestions.find(q => q.id === questionId);
            // Find the original question
            const originalQ = questions.find(q => q.id === questionId);

            if (shuffledQ && originalQ) {
              // Get the text of the selected answer from shuffled question
              const selectedText = shuffledQ.options.find(opt => opt.label === selectedAnswer)?.text;
              // Find which original label had this text
              const originalLabel = originalQ.options.find(opt => opt.text === selectedText)?.label;

              return {
                questionId,
                selectedAnswer: originalLabel || selectedAnswer, // Use original label for API
                timeTaken: answerTimes[questionId] ?? 60,
              };
            }

            return {
              questionId,
              selectedAnswer,
              timeTaken: answerTimes[questionId] ?? 60,
            };
          }),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit quiz');
      }

      const data = await response.json();
      setResults(data.attempt);

      if (!data.attempt.isFirstAttempt) {
        toast.info(
          `This is a practice attempt. Your recorded score is ${data.attempt.recordedScore} pts (${Math.round(
            (data.attempt.recordedScore / data.attempt.maxScore) * 100
          )}%). Current score: ${data.attempt.currentScore} pts (${data.attempt.currentPercentage}%)`,
          { duration: 5000 }
        );
      } else {
        toast.success(
          `Quiz complete! You scored ${data.attempt.score} pts (${data.attempt.percentage}%)`
        );
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      toast.error(error.message || 'Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    // Reshuffle the questions for a new attempt
    setShuffledQuestions(questions.map(shuffleOptions));
    setAnswers({});
    setAnswerTimes({});
    setResults(null);
    setCurrentQuestionIndex(0);
    setDirection(0);
    setTimeRemaining(60);
    setQuestionStartTime(Date.now());
  };

  const handleGoHome = () => {
    router.push(returnUrl);
  };

  const handleNextLesson = () => {
    router.push(returnUrl);
  };

  // Show results view
  if (results) {
    const isFirstAttempt = results.isFirstAttempt !== false;
    const score = isFirstAttempt ? results.score : results.currentScore;
    const percentage = isFirstAttempt ? results.percentage : results.currentPercentage;
    const recordedScore = results.recordedScore || results.score;
    const recordedPercentage = Math.round((recordedScore / results.maxScore) * 100);
    const isPerfect = percentage === 100;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center"
            >
              {isPerfect ? (
                <div className="relative">
                  <Award className="h-20 w-20 text-yellow-500" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0"
                  >
                    <Trophy className="h-20 w-20 text-yellow-400 opacity-50" />
                  </motion.div>
                </div>
              ) : (
                <Trophy className="h-20 w-20 text-blue-500" />
              )}
            </motion.div>

            <div>
              <CardTitle className="text-3xl font-bold mb-2">
                {!isFirstAttempt
                  ? '🔄 Practice Attempt'
                  : isPerfect
                  ? '🎉 Perfect Score!'
                  : '📊 Quiz Complete!'}
              </CardTitle>
              <CardDescription className="text-lg">
                {!isFirstAttempt ? (
                  <>
                    <div className="mb-2">
                      <span className="font-bold text-xl text-primary">
                        Current Score: {score} pts ({percentage}%)
                      </span>
                      <span className="text-muted-foreground ml-2">
                        ({results.currentCorrectAnswers}/{results.totalQuestions} correct)
                      </span>
                    </div>
                    <div className="text-yellow-600 font-semibold">
                      ⚠️ Recorded Score: {recordedScore} pts ({recordedPercentage}%){' '}
                      <span className="text-xs">(Only first attempt counts)</span>
                    </div>
                  </>
                ) : (
                  <>
                    You scored{' '}
                    <span className="font-bold text-2xl text-primary">
                      {score} pts ({percentage}%)
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ({results.correctAnswers}/{results.totalQuestions} correct)
                    </span>
                    <div className="text-green-600 font-semibold mt-2 text-sm">
                      ✓ First attempt - Score recorded!
                    </div>
                  </>
                )}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score visualization */}
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full rounded-full ${
                    isPerfect
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                      : 'bg-gradient-to-r from-blue-400 to-purple-600'
                  }`}
                />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Your final score: {percentage}%
              </p>
            </div>

            {/* Detailed Results */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Review Your Answers {!isFirstAttempt && '(Practice)'}
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {(isFirstAttempt ? results.results : results.currentResults)?.map((result: any, index: number) => {
                  // Map the original labels back to what the user saw (shuffled labels)
                  const shuffledQ = shuffledQuestions.find(q => q.id === result.questionId);
                  const originalQ = questions.find(q => q.id === result.questionId);

                  let displayUserAnswer = result.userAnswer;
                  let displayCorrectAnswer = result.correctAnswer;
                  let userAnswerText = '';
                  let correctAnswerText = '';

                  if (shuffledQ && originalQ && result.userAnswer) {
                    // Find the text for the original user answer
                    userAnswerText = originalQ.options.find(opt => opt.label === result.userAnswer)?.text || '';
                    // Find which shuffled label had this text
                    displayUserAnswer = shuffledQ.options.find(opt => opt.text === userAnswerText)?.label || result.userAnswer;

                    // Find the text for the correct answer
                    correctAnswerText = originalQ.options.find(opt => opt.label === result.correctAnswer)?.text || '';
                    // Find which shuffled label had this text
                    displayCorrectAnswer = shuffledQ.options.find(opt => opt.text === correctAnswerText)?.label || result.correctAnswer;
                  }

                  return (
                  <motion.div
                    key={result.questionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`border-l-4 ${
                        result.isCorrect ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="font-mono">
                                Q{index + 1}
                              </Badge>
                              {result.isCorrect ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <Badge
                                variant="secondary"
                                className={`font-mono text-xs ${
                                  result.timeTaken <= 15
                                    ? 'bg-green-100 text-green-700'
                                    : result.timeTaken <= 30
                                    ? 'bg-blue-100 text-blue-700'
                                    : result.timeTaken <= 45
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {result.timeTaken}s
                              </Badge>
                              {result.isCorrect && (
                                <Badge variant="default" className="font-mono text-xs bg-purple-600">
                                  +{result.pointsEarned} pts
                                </Badge>
                              )}
                            </div>
                            <CardDescription
                              className="text-sm font-medium text-foreground [&_u]:underline [&_u]:decoration-2 [&_u]:underline-offset-2"
                              dangerouslySetInnerHTML={{ __html: result.question }}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-medium">Your answer:</span>
                          <Badge variant={result.isCorrect ? 'default' : 'destructive'} className="font-mono">
                            {displayUserAnswer || 'No answer'}
                          </Badge>
                        </div>
                        {!result.isCorrect && (
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium">Correct answer:</span>
                            <Badge variant="default" className="bg-green-600 font-mono">
                              {displayCorrectAnswer}
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" onClick={handleGoHome} className="flex-1 cursor-pointer">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
              {hasNextLesson && (
                <Button onClick={handleNextLesson} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 cursor-pointer">
                  Next Lesson
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // Show quiz form
  return (
    <div className="space-y-6">
      {/* Time-Based Scoring Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Alert className="border-blue-500 bg-blue-50">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="font-semibold mb-1 text-xs sm:text-sm">⏱️ Time-Based Scoring</div>
            <div className="text-xs sm:text-sm mb-2">
              Answer quickly to earn more points! Each correct answer can earn up to 20 points based on your speed:
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
              <Badge className="bg-green-600 text-xs">0-15s: 20 pts</Badge>
              <Badge className="bg-blue-600 text-xs">16-30s: 15 pts</Badge>
              <Badge className="bg-yellow-600 text-xs">31-45s: 10 pts</Badge>
              <Badge className="bg-orange-600 text-xs">46-60s: 5 pts</Badge>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Previous Attempts Warning */}
      {previousAttempts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert className="border-yellow-500 bg-yellow-50">
            <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="font-semibold mb-1 text-xs sm:text-sm">⚠️ Only First Attempt Recorded</div>
              <div className="text-xs sm:text-sm">
                You can retake this quiz for practice, but only your first attempt's score will be saved and count
                towards your progress. This is a practice attempt.
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                <span className="text-xs font-medium">Previous attempts:</span>
                {previousAttempts.map((attempt, index) => (
                  <Badge key={attempt.id} variant={attempt.passed ? 'default' : 'secondary'} className="text-xs">
                    #{previousAttempts.length - index}: {attempt.score} pts
                    {index === previousAttempts.length - 1 && ' (Recorded)'}
                  </Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Progress Bar */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-6">
          <div className="flex items-center justify-between mb-2 gap-2">
            <CardTitle className="text-base sm:text-xl">{title}</CardTitle>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <motion.div
                animate={
                  timeRemaining <= 10
                    ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, -5, 5, -5, 0],
                      }
                    : {}
                }
                transition={
                  timeRemaining <= 10
                    ? {
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      }
                    : {}
                }
              >
                <Badge
                  variant="outline"
                  className={`text-xs sm:text-base font-mono px-2 sm:px-3 py-0.5 sm:py-1 border-2 transition-all ${
                    timeRemaining <= 10
                      ? 'bg-red-50 border-red-500 text-red-700 shadow-lg shadow-red-200'
                      : timeRemaining <= 30
                      ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                      : 'bg-green-50 border-green-500 text-green-700'
                  }`}
                >
                  <Clock className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 ${timeRemaining <= 10 ? 'animate-pulse' : ''}`} />
                  {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </Badge>
              </motion.div>
              <Badge variant="outline" className="text-xs sm:text-base font-mono px-2 sm:px-3 py-0.5 sm:py-1">
                {currentQuestionIndex + 1}/{shuffledQuestions.length}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {Object.keys(answers).length}/{shuffledQuestions.length} answered
              </p>
              <p className="text-xs text-blue-600 font-medium">
                ⓘ Only your first attempt will be recorded for scoring
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Question Card with Animation */}
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentQuestionIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full"
              >
                <Card className="border-2">
                  <CardHeader className="p-3 sm:p-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm sm:text-lg">
                        {currentQuestionIndex + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle
                          className="text-sm sm:text-lg leading-relaxed break-words [&_u]:underline [&_u]:decoration-2 [&_u]:underline-offset-2"
                          dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    <RadioGroup
                      value={answers[currentQuestion.id] || ''}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      {currentQuestion.options.map((option, idx) => (
                        <motion.div
                          key={option.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <label
                            htmlFor={`${currentQuestion.id}-${option.label}`}
                            className={`flex items-start space-x-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              answers[currentQuestion.id] === option.label
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                            }`}
                          >
                            <RadioGroupItem
                              value={option.label}
                              id={`${currentQuestion.id}-${option.label}`}
                              className="flex-shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="font-medium mr-2">{option.label}.</span>
                              <span className="break-words">{option.text}</span>
                            </div>
                          </label>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="flex-1 sm:flex-initial text-sm sm:text-base cursor-pointer"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Previous</span>
              <span className="inline xs:hidden">Prev</span>
            </Button>

            <div className="hidden sm:flex gap-1">
              {shuffledQuestions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentQuestionIndex ? 1 : -1);
                    setCurrentQuestionIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentQuestionIndex
                      ? 'bg-primary w-6'
                      : answers[shuffledQuestions[idx].id]
                      ? 'bg-primary/50'
                      : 'bg-gray-300'
                  }`}
                  title={`Question ${idx + 1}${answers[shuffledQuestions[idx].id] ? ' (answered)' : ''}`}
                />
              ))}
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !allQuestionsAnswered}
                className="flex-1 sm:flex-initial bg-gradient-to-r from-green-600 to-green-700 text-sm sm:text-base cursor-pointer"
                size="default"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!answers[currentQuestion.id]} className="flex-1 sm:flex-initial text-sm sm:text-base cursor-pointer">
                Next
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
              </Button>
            )}
          </div>

          {/* Answer Status */}
          {!allQuestionsAnswered && (
            <Alert>
              <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                Please answer all {shuffledQuestions.length} questions before submitting.
                {Object.keys(answers).length > 0 && (
                  <span className="font-medium ml-1">
                    ({shuffledQuestions.length - Object.keys(answers).length} remaining)
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
