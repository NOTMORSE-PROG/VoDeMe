'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface VideoLessonCardProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    duration: number;
    completed: boolean;
    watchedDuration: number;
    progress: number;
  };
  videoUrl: string;
}

export function VideoLessonCard({ lesson, videoUrl }: VideoLessonCardProps) {
  const [actualDuration, setActualDuration] = useState(lesson.duration);
  const [actualProgress, setActualProgress] = useState(lesson.progress);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoUrl;

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        const videoDuration = Math.floor(video.duration);
        setActualDuration(videoDuration);

        // Recalculate progress percentage based on actual video duration
        if (lesson.watchedDuration > 0 && videoDuration > 0) {
          const recalculatedProgress = Math.round((lesson.watchedDuration / videoDuration) * 100);
          setActualProgress(Math.min(recalculatedProgress, 100));
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.src = '';
    };
  }, [videoUrl, lesson.watchedDuration]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="block bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
            {lesson.completed && <span className="text-green-500 text-2xl">✓</span>}
          </div>
          <p className="text-gray-600 text-sm mb-3">{lesson.description}</p>

          {actualProgress > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{lesson.completed ? '100' : actualProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    lesson.completed ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${lesson.completed ? 100 : actualProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span>⏱️</span>
            <span>{formatDuration(actualDuration)}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href={`/lessons/${lesson.id}`}
              className={`px-6 py-2 rounded-lg font-semibold transition text-center ${
                lesson.completed
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : actualProgress > 0
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {lesson.completed
                ? 'Review'
                : actualProgress > 0
                ? 'Continue'
                : 'Start'}
            </Link>
            {lesson.completed && (
              <Link
                href={`/lessons/${lesson.id}/quiz?from=dashboard`}
                className="px-6 py-2 rounded-lg font-semibold transition text-center bg-purple-500 hover:bg-purple-600 text-white whitespace-nowrap"
              >
                Take Quiz
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
