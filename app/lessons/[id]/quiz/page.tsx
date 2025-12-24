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
        />
      </div>
    </div>
  );
}
