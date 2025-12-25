import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { LessonQuiz } from '@/components/lesson-quiz';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const auth = await verifyAuth();
  if (!auth) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  const { from } = await searchParams;

  // Determine return URL based on where user came from
  const returnUrl = from === 'dashboard' ? '/dashboard?tab=lessons' : `/lessons/${id}`;

  // Fetch lesson with quiz and user progress
  const lesson = await db.videoLesson.findUnique({
    where: { id },
    include: {
      quiz: {
        include: {
          attempts: {
            where: {
              userId: auth.userId,
            },
            orderBy: {
              completedAt: 'desc',
            },
          },
        },
      },
      progress: {
        where: {
          userId: auth.userId,
        },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  if (!lesson.quiz) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <Button variant="ghost" asChild>
            <Link href={returnUrl}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {from === 'dashboard' ? 'Back to Dashboard' : 'Back to Lesson'}
            </Link>
          </Button>

          <Alert>
            <AlertDescription>
              No quiz available for this lesson.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const userProgress = lesson.progress[0];

  // Check if lesson is completed
  if (!userProgress || !userProgress.completed) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <Button variant="ghost" asChild>
            <Link href={returnUrl}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {from === 'dashboard' ? 'Back to Dashboard' : 'Back to Lesson'}
            </Link>
          </Button>

          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              You must complete the lesson before accessing the quiz.
            </AlertDescription>
          </Alert>

          <Button asChild>
            <Link href={`/lessons/${id}`}>Go to Lesson</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check if there's a next lesson
  const nextLesson = await db.videoLesson.findFirst({
    where: {
      level: lesson.level,
      order: { gt: lesson.order },
    },
    orderBy: {
      order: 'asc',
    },
  });

  const quizQuestions = lesson.quiz.questions as any[];

  // Get the most recent attempt with full results
  const mostRecentAttempt = lesson.quiz.attempts[0];
  let initialResults = null;

  if (mostRecentAttempt) {
    // Reconstruct results from stored answers and quiz questions
    const isFirstAttempt = lesson.quiz.attempts.length === 1;
    const storedAnswers = mostRecentAttempt.answers as any[];

    // Time-based scoring rubric (same as in submit API)
    const calculatePointsForTime = (timeTaken: number): number => {
      if (timeTaken <= 15) return 20;
      if (timeTaken <= 30) return 15;
      if (timeTaken <= 45) return 10;
      if (timeTaken <= 60) return 5;
      return 0;
    };

    // Reconstruct detailed results
    const results = quizQuestions.map((question: any) => {
      const userAnswer = storedAnswers.find((a) => a.questionId === question.id);
      const isCorrect = userAnswer?.selectedAnswer === question.correctAnswer;
      const timeTaken = userAnswer?.timeTaken ?? 60;
      const pointsEarned = isCorrect ? calculatePointsForTime(timeTaken) : 0;

      return {
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer?.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timeTaken,
        pointsEarned,
      };
    });

    // Calculate stats from the reconstructed results
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const MAX_POINTS_PER_QUESTION = 20;
    const maxScore = quizQuestions.length * MAX_POINTS_PER_QUESTION;
    const percentage = Math.round((mostRecentAttempt.score / maxScore) * 100);

    initialResults = {
      id: mostRecentAttempt.id,
      score: mostRecentAttempt.score,
      maxScore: maxScore,
      percentage: percentage,
      correctAnswers: correctAnswers,
      totalQuestions: quizQuestions.length,
      passed: mostRecentAttempt.passed,
      isFirstAttempt,
      results,
      // For subsequent attempts, include both current and recorded scores
      currentScore: mostRecentAttempt.score,
      currentPercentage: percentage,
      currentCorrectAnswers: correctAnswers,
      currentResults: results,
      recordedScore: lesson.quiz.attempts[lesson.quiz.attempts.length - 1].score,
    };
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href={returnUrl}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {from === 'dashboard' ? 'Back to Dashboard' : 'Back to Lesson'}
          </Link>
        </Button>

        <LessonQuiz
          lessonId={lesson.id}
          quizId={lesson.quiz.id}
          title={lesson.quiz.title}
          questions={quizQuestions}
          passingScore={lesson.quiz.passingScore}
          previousAttempts={lesson.quiz.attempts.map((a) => ({
            id: a.id,
            score: a.score,
            passed: a.passed,
            completedAt: a.completedAt.toISOString(),
          }))}
          hasNextLesson={!!nextLesson}
          returnUrl={returnUrl}
          initialResults={initialResults}
        />
      </div>
    </div>
  );
}
