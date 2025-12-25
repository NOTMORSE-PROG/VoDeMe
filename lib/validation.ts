/**
 * Form Validation Schemas
 * Using Zod for runtime type validation and form validation
 */

import { z } from 'zod';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Sign up schema
export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: passwordSchema,
});

export type SignUpInput = z.infer<typeof signUpSchema>;

// Sign in schema
export const signInSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

export type SignInInput = z.infer<typeof signInSchema>;

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional(),
  profilePicture: z.string().url('Invalid profile picture URL').optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Password change schema
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

// Video Lesson Progress Update Schema
export const lessonProgressUpdateSchema = z.object({
  watchedDuration: z.number().min(0, 'Watched duration must be positive'),
  completed: z.boolean().optional(),
});

export type LessonProgressUpdateInput = z.infer<typeof lessonProgressUpdateSchema>;

// Quiz Answer Schema
export const quizAnswerSchema = z.object({
  questionId: z.string(),
  selectedAnswer: z.string(),
  timeTaken: z.number().min(0).max(60).optional(), // Time taken in seconds (0-60)
});

export type QuizAnswerInput = z.infer<typeof quizAnswerSchema>;

// Quiz Submission Schema
export const quizSubmissionSchema = z.object({
  quizId: z.string(),
  answers: z.array(quizAnswerSchema).min(1, 'At least one answer is required'),
});

export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>;

// Learning Wall Post Schema
export const learningWallPostSchema = z.object({
  content: z
    .string()
    .min(10, 'Reflection must be at least 10 characters')
    .max(500, 'Reflection must be less than 500 characters')
    .trim(),
});

export type LearningWallPostInput = z.infer<typeof learningWallPostSchema>;
