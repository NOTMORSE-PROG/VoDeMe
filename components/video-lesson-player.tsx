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
  isCompleted?: boolean;
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
  isCompleted = false,
  onComplete,
}: VideoLessonPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [watchedDuration, setWatchedDuration] = useState(initialProgress);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(initialProgress);
  const [completed, setCompleted] = useState(isCompleted);
  const [isSaving, setIsSaving] = useState(false);
  const [actualDuration, setActualDuration] = useState(duration);

  // In review mode, show current playback; otherwise show progress
  const displayTime = completed ? currentPlaybackTime : watchedDuration;
  const progressPercentage = completed
    ? 100
    : Math.round((watchedDuration / actualDuration) * 100);

  // Auto-save progress every 3 seconds (only when not in review mode)
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused && !completed) {
        const currentTime = Math.floor(videoRef.current.currentTime);
        saveProgress(currentTime);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [lessonId, completed]);

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

      if (completed) {
        // In review mode, just track current playback time
        setCurrentPlaybackTime(currentTime);
      } else {
        // Track progress when not in review mode - use functional setState to avoid stale closures
        setWatchedDuration(prev => Math.max(prev, currentTime));

        // Update max watched time
        setMaxWatchedTime(prev => {
          const newMax = Math.max(prev, currentTime);
          return newMax;
        });

        // Auto-complete if 95% watched
        if (currentTime >= actualDuration * 0.95) {
          setCompleted(true);
          saveProgress(currentTime, true);
        }
      }
    }
  };

  // Prevent seeking forward beyond max watched time (only when not in review mode)
  const handleSeeking = () => {
    if (videoRef.current && !completed) {
      const currentTime = videoRef.current.currentTime;

      // If user tries to seek beyond their max watched point, bring them back
      // Using a smaller buffer (0.5s) to be more strict
      if (currentTime > maxWatchedTime + 0.5) {
        videoRef.current.currentTime = maxWatchedTime;
        toast.error('You cannot skip ahead. Please watch the video to continue.');
      }
    }
  };

  // Additional check during seeking (event fires while user is dragging)
  const handleSeeked = () => {
    if (videoRef.current && !completed) {
      const currentTime = videoRef.current.currentTime;

      // Double-check after seek completes
      if (currentTime > maxWatchedTime + 0.5) {
        videoRef.current.currentTime = maxWatchedTime;
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
    if (videoRef.current && !completed) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      setCompleted(true);
      saveProgress(currentTime, true);
    }
  };

  // Resume from last position (or start from beginning if reviewing)
  useEffect(() => {
    if (videoRef.current) {
      if (completed) {
        // If in review mode, start from beginning
        videoRef.current.currentTime = 0;
      } else if (initialProgress > 0) {
        // Otherwise, resume from last position
        videoRef.current.currentTime = initialProgress;
      }
    }
  }, [initialProgress, completed]);

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
            onSeeking={handleSeeking}
            onSeeked={handleSeeked}
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
              {Math.floor(displayTime / 60)}:{(displayTime % 60).toString().padStart(2, '0')} / {Math.floor(actualDuration / 60)}:{(actualDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className={`h-2 ${completed ? '[&>div]:bg-green-500' : ''}`}
          />
          {completed && (
            <p className="text-xs text-green-600 font-medium">
              Review Mode: You can freely navigate through the video
            </p>
          )}
          {!completed && maxWatchedTime > 0 && (
            <p className="text-xs text-orange-600 font-medium">
              You can only rewind. Watch the video to unlock forward seeking.
            </p>
          )}
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
