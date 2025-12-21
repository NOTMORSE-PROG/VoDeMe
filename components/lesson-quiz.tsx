'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Trophy, Home, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; text: string }[];
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
}

export function LessonQuiz({
  lessonId,
  quizId,
  title,
  questions,
  passingScore,
  previousAttempts,
  hasNextLesson,
}: LessonQuizProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length !== questions.length) {
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
          answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit quiz');
      }

      const data = await response.json();
      setResults(data.attempt);

      if (data.attempt.passed) {
        toast.success(`Congratulations! You passed with ${data.attempt.score}%`);
      } else {
        toast.error(`You scored ${data.attempt.score}%. Try again!`);
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      toast.error(error.message || 'Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResults(null);
  };

  const handleGoHome = () => {
    router.push('/dashboard?tab=lessons');
  };

  const handleNextLesson = () => {
    router.push('/dashboard?tab=lessons');
  };

  // Show results view
  if (results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {results.passed ? (
              <>
                <Trophy className="h-6 w-6 text-yellow-500" />
                Quiz Completed!
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                Quiz Results
              </>
            )}
          </CardTitle>
          <CardDescription>
            You scored {results.score}% ({results.correctAnswers}/{results.totalQuestions} correct)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant={results.passed ? 'default' : 'destructive'}>
            <AlertDescription>
              {results.passed
                ? `Congratulations! You passed the quiz with ${results.score}%. You can now continue to the next lesson.`
                : `You need ${passingScore}% to pass. Review the lesson and try again!`}
            </AlertDescription>
          </Alert>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h3 className="font-semibold">Detailed Results</h3>
            {results.results.map((result: any, index: number) => (
              <Card key={result.questionId} className={result.isCorrect ? 'border-green-500' : 'border-red-500'}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">
                      Question {index + 1}
                    </CardTitle>
                    {result.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <CardDescription>{result.question}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Your answer: </span>
                    <Badge variant={result.isCorrect ? 'default' : 'destructive'}>
                      {result.userAnswer || 'No answer'}
                    </Badge>
                  </div>
                  {!result.isCorrect && (
                    <div>
                      <span className="text-sm font-medium">Correct answer: </span>
                      <Badge variant="default">{result.correctAnswer}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleGoHome}>
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            {!results.passed && (
              <Button onClick={handleRetry}>
                Try Again
              </Button>
            )}
            {results.passed && hasNextLesson && (
              <Button onClick={handleNextLesson}>
                Next Lesson
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show quiz form
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Answer all questions to complete the quiz. Passing score: {passingScore}%
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Previous Attempts */}
        {previousAttempts.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Previous Attempts</h3>
            <div className="flex flex-wrap gap-2">
              {previousAttempts.map((attempt, index) => (
                <Badge
                  key={attempt.id}
                  variant={attempt.passed ? 'default' : 'secondary'}
                >
                  Attempt {previousAttempts.length - index}: {attempt.score}%
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Questions */}
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-base">
                Question {index + 1}
              </CardTitle>
              <CardDescription>{question.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                {question.options.map((option) => (
                  <div key={option.label} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.label} id={`${question.id}-${option.label}`} />
                    <Label htmlFor={`${question.id}-${option.label}`} className="cursor-pointer">
                      {option.label}. {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(answers).length !== questions.length}
            size="lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
