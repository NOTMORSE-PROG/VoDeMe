'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface VideoLessonPlayerProps {
  lessonId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  initialProgress: number;
  hasQuiz: boolean;
  onComplete?: () => void;
}

export function VideoLessonPlayer({
  lessonId,
  title,
  description,
  videoUrl,
  duration,
  initialProgress,
  hasQuiz,
  onComplete,
}: VideoLessonPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [watchedDuration, setWatchedDuration] = useState(initialProgress);
  const [completed, setCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actualDuration, setActualDuration] = useState(duration);
  const progressPercentage = Math.round((watchedDuration / actualDuration) * 100);

  // Auto-save progress every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const currentTime = Math.floor(videoRef.current.currentTime);
        saveProgress(currentTime);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [lessonId]);

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      const videoDuration = Math.floor(videoRef.current.duration);
      setActualDuration(videoDuration);
    }
  };

  // Handle video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      setWatchedDuration(Math.max(watchedDuration, currentTime));

      // Auto-complete if 95% watched
      if (currentTime >= actualDuration * 0.95 && !completed) {
        setCompleted(true);
        saveProgress(currentTime, true);
      }
    }
  };

  // Save progress to server
  const saveProgress = async (currentTime: number, isCompleted = false) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          watchedDuration: currentTime,
          completed: isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }

      if (isCompleted) {
        toast.success('Lesson completed! You can now take the quiz.');
        onComplete?.();
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    if (videoRef.current) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      setCompleted(true);
      saveProgress(currentTime, true);
    }
  };

  // Resume from last position
  useEffect(() => {
    if (videoRef.current && initialProgress > 0) {
      videoRef.current.currentTime = initialProgress;
    }
  }, [initialProgress]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {completed && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full h-full"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Progress: {progressPercentage}%
            </span>
            <span className="text-muted-foreground">
              {Math.floor(watchedDuration / 60)}:{(watchedDuration % 60).toString().padStart(2, '0')} / {Math.floor(actualDuration / 60)}:{(actualDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {hasQuiz && (
          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
            {completed ? (
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-medium">Quiz unlocked! Test your knowledge.</span>
                <Button asChild>
                  <a href={`/lessons/${lessonId}/quiz`}>Take Quiz</a>
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Complete the video to unlock the quiz
                </span>
              </div>
            )}
          </div>
        )}

        {isSaving && (
          <p className="text-xs text-muted-foreground text-center">
            Saving progress...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
