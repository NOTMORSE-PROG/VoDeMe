'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Lock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { LearningWallModal } from '@/components/learning-wall-modal';

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
  const [showLearningWall, setShowLearningWall] = useState(false);
  const hasShownLearningWall = useRef(false);

  // In review mode, show current playback; otherwise show progress
  const displayTime = completed ? currentPlaybackTime : watchedDuration;
  const progressPercentage = completed
    ? 100
    : Math.round((watchedDuration / actualDuration) * 100);

  // Load actual video duration in background (like VideoLessonCard)
  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoUrl;

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        const videoDuration = Math.floor(video.duration);
        setActualDuration(videoDuration);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.src = '';
    };
  }, [videoUrl]);

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

  // Handle video metadata loaded (backup if background load doesn't work)
  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration && !isNaN(videoRef.current.duration) && isFinite(videoRef.current.duration)) {
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
      // No buffer allowed - strictly enforce the limit
      if (currentTime > maxWatchedTime) {
        videoRef.current.currentTime = maxWatchedTime;
        toast.error('You cannot skip ahead. Please watch the video to continue.');
      }
    }
  };

  // Additional check during seeking (event fires while user is dragging)
  const handleSeeked = () => {
    if (videoRef.current && !completed) {
      const currentTime = videoRef.current.currentTime;

      // Double-check after seek completes - strictly enforce the limit
      if (currentTime > maxWatchedTime) {
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

        // Show Learning Wall modal on first completion in this session
        if (!hasShownLearningWall.current) {
          hasShownLearningWall.current = true;
          setShowLearningWall(true);
        }
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
    <div className="space-y-6">
      {/* Status Badge */}
      {completed && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl w-fit">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm font-semibold text-green-700">Lesson Completed!</span>
        </div>
      )}

      {/* Main Video Card */}
      <Card className="overflow-hidden border-2 shadow-xl">
        <CardHeader className="bg-gradient-to-br from-orange-50 via-white to-purple-50 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                {description}
              </CardDescription>
            </div>
            {completed && (
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            )}
          </div>

          {/* Lesson Info Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
              <span>⏱️</span>
              <span>{Math.floor(actualDuration / 60)}:{(actualDuration % 60).toString().padStart(2, '0')} min</span>
            </div>
            {completed ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 border border-green-200 rounded-full text-xs font-medium text-green-700">
                <span>🎉</span>
                <span>Review Mode</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 border border-orange-200 rounded-full text-xs font-medium text-orange-700">
                <span>📚</span>
                <span>Learning Mode</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-6">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-4 ring-gray-100">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              preload="metadata"
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

          {/* Progress Section */}
          <div className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${completed ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
                <span className="text-sm font-semibold text-gray-700">
                  Progress: {progressPercentage}%
                </span>
              </div>
              <span className="text-sm font-mono font-medium text-gray-600 bg-white px-3 py-1 rounded-full border">
                {Math.floor(displayTime / 60)}:{(displayTime % 60).toString().padStart(2, '0')} / {Math.floor(actualDuration / 60)}:{(actualDuration % 60).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="relative">
              <Progress
                value={progressPercentage}
                className={`h-3 ${completed ? '[&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500' : '[&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-amber-500'}`}
              />
              {!completed && progressPercentage >= 95 && (
                <div className="absolute -top-1 right-0 flex items-center gap-1 text-xs font-medium text-orange-600">
                  <span className="animate-bounce">🎯</span>
                  <span>Almost done!</span>
                </div>
              )}
            </div>

            {completed && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700 font-medium">
                  🎉 Review Mode Active: You can freely navigate through the video
                </p>
              </div>
            )}

            {!completed && maxWatchedTime > 0 && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Lock className="h-4 w-4 text-orange-600 flex-shrink-0" />
                <p className="text-xs text-orange-700 font-medium">
                  🔒 You can only rewind. Watch the video to unlock forward seeking.
                </p>
              </div>
            )}
          </div>

          {/* Learning Wall Section - Shows when completed */}
          {completed && (
            <div className="relative overflow-hidden rounded-xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="p-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">VoDeMe Learning Wall</h3>
                      <p className="text-sm text-gray-600">Share what you learned with your classmates</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowLearningWall(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 text-base shadow-lg"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Open Learning Wall
                  </Button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 -z-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-200 rounded-full blur-3xl opacity-30 -z-10" />
            </div>
          )}

          {/* Quiz Section */}
          {hasQuiz && (
            <div className={`relative overflow-hidden rounded-xl border-2 ${completed ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="p-5">
                {completed ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Quiz Unlocked!</h3>
                        <p className="text-sm text-gray-600">Test your knowledge and earn your completion badge</p>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-base shadow-lg"
                    >
                      <a href={`/lessons/${lessonId}/quiz`}>
                        Take Quiz Now →
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-shrink-0 bg-gray-200 p-3 rounded-full">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-0.5">Quiz Locked</h3>
                      <p className="text-xs text-gray-500">
                        Complete the video lesson to unlock the quiz
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Decorative elements for completed state */}
              {completed && (
                <>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 -z-10" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-30 -z-10" />
                </>
              )}
            </div>
          )}

          {/* Saving Indicator */}
          {isSaving && (
            <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <p className="text-xs text-blue-700 font-medium">
                Saving your progress...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Wall Modal */}
      <LearningWallModal
        lessonId={lessonId}
        lessonTitle={title}
        open={showLearningWall}
        onOpenChange={setShowLearningWall}
      />
    </div>
  );
}
