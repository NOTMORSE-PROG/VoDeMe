import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { VideoLessonPlayer } from '@/components/video-lesson-player';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await verifyAuth();
  if (!auth) {
    redirect('/auth/signin');
  }

  const { id } = await params;

  // Fetch lesson with user progress
  const lesson = await db.videoLesson.findUnique({
    where: { id },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
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

  const userProgress = lesson.progress[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="container max-w-5xl mx-auto py-6 md:py-10 px-4">
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
            >
              <Link href="/dashboard?tab=lessons" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
            </Button>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-600 font-medium truncate max-w-[300px]">
              {lesson.title}
            </span>
          </div>

          {/* Video Player */}
          <VideoLessonPlayer
            lessonId={lesson.id}
            title={lesson.title}
            description={lesson.description}
            videoUrl={lesson.videoUrl}
            duration={lesson.duration}
            initialProgress={userProgress?.watchedDuration || 0}
            hasQuiz={!!lesson.quiz}
            isCompleted={userProgress?.completed || false}
          />
        </div>
      </div>
    </div>
  );
}
