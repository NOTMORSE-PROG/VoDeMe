/**
 * Prisma Database Seeder
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Video URL (temporary)
  const VIDEO_URL = 'https://j3z8y187h5.ufs.sh/f/8QlRmO7DVzRtgmJvjYrtePmGcpKlCr15oHqO78uwTnVQk6fD';

  // Seed Video Lessons
  console.log('Seeding video lessons...');

  // Lesson 1: Synonyms
  const lesson1 = await prisma.videoLesson.upsert({
    where: { level_order: { level: 1, order: 1 } },
    update: {},
    create: {
      title: 'Understanding Synonyms',
      description:
        'Learn how words with similar meanings can be used effectively in different contexts. This lesson demonstrates the importance of choosing the right synonym to convey precise meaning and enhance your vocabulary.',
      videoUrl: VIDEO_URL,
      duration: 180, // 3 minutes
      level: 1,
      order: 1,
    },
  });

  // Quiz for Lesson 1
  await prisma.quiz.upsert({
    where: { lessonId: lesson1.id },
    update: {},
    create: {
      lessonId: lesson1.id,
      title: 'Synonyms Quiz',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          question: 'Which word is the best synonym for "happy" in a formal context?',
          options: [
            { label: 'A', text: 'Glad' },
            { label: 'B', text: 'Joyful' },
            { label: 'C', text: 'Pleased' },
            { label: 'D', text: 'Ecstatic' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q2',
          question: 'What is a synonym for "difficult" that suggests extreme challenge?',
          options: [
            { label: 'A', text: 'Hard' },
            { label: 'B', text: 'Arduous' },
            { label: 'C', text: 'Tough' },
            { label: 'D', text: 'Complex' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q3',
          question: 'Which synonym for "big" best describes something of great importance?',
          options: [
            { label: 'A', text: 'Large' },
            { label: 'B', text: 'Huge' },
            { label: 'C', text: 'Significant' },
            { label: 'D', text: 'Enormous' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q4',
          question: 'Choose the most appropriate synonym for "angry" in a professional email.',
          options: [
            { label: 'A', text: 'Mad' },
            { label: 'B', text: 'Furious' },
            { label: 'C', text: 'Concerned' },
            { label: 'D', text: 'Enraged' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q5',
          question: 'What is the best synonym for "smart" when describing analytical ability?',
          options: [
            { label: 'A', text: 'Clever' },
            { label: 'B', text: 'Intelligent' },
            { label: 'C', text: 'Bright' },
            { label: 'D', text: 'Astute' },
          ],
          correctAnswer: 'D',
        },
      ],
    },
  });

  // Lesson 2: Collocations
  const lesson2 = await prisma.videoLesson.upsert({
    where: { level_order: { level: 1, order: 2 } },
    update: {},
    create: {
      title: 'Mastering Collocations',
      description:
        'Explore common word pairings and their types. This lesson shows how collocations work together naturally in English, helping you sound more fluent and native-like in your language use.',
      videoUrl: VIDEO_URL,
      duration: 240, // 4 minutes
      level: 1,
      order: 2,
    },
  });

  // Quiz for Lesson 2
  await prisma.quiz.upsert({
    where: { lessonId: lesson2.id },
    update: {},
    create: {
      lessonId: lesson2.id,
      title: 'Collocations Quiz',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          question: 'Which verb collocates with "a decision"?',
          options: [
            { label: 'A', text: 'Do' },
            { label: 'B', text: 'Make' },
            { label: 'C', text: 'Take' },
            { label: 'D', text: 'Have' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q2',
          question: 'What adjective commonly collocates with "mistake"?',
          options: [
            { label: 'A', text: 'Big' },
            { label: 'B', text: 'Great' },
            { label: 'C', text: 'Strong' },
            { label: 'D', text: 'Heavy' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q3',
          question: 'Which preposition collocates with "interested"?',
          options: [
            { label: 'A', text: 'on' },
            { label: 'B', text: 'at' },
            { label: 'C', text: 'in' },
            { label: 'D', text: 'for' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q4',
          question: 'What verb collocates with "attention"?',
          options: [
            { label: 'A', text: 'Give' },
            { label: 'B', text: 'Make' },
            { label: 'C', text: 'Pay' },
            { label: 'D', text: 'Do' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q5',
          question: 'Which adjective commonly collocates with "rain"?',
          options: [
            { label: 'A', text: 'Strong' },
            { label: 'B', text: 'Heavy' },
            { label: 'C', text: 'Big' },
            { label: 'D', text: 'Hard' },
          ],
          correctAnswer: 'B',
        },
      ],
    },
  });

  // Lesson 3: Word Parts (Prefixes, Suffixes, and Affixes)
  const lesson3 = await prisma.videoLesson.upsert({
    where: { level_order: { level: 1, order: 3 } },
    update: {},
    create: {
      title: 'Word Parts: Prefixes, Suffixes, and Affixes',
      description:
        'Understand how word parts work together to create meaning. Learn about derivation versus inflection, common affix meanings, and how to build your vocabulary through word analysis.',
      videoUrl: VIDEO_URL,
      duration: 210, // 3.5 minutes
      level: 1,
      order: 3,
    },
  });

  // Quiz for Lesson 3
  await prisma.quiz.upsert({
    where: { lessonId: lesson3.id },
    update: {},
    create: {
      lessonId: lesson3.id,
      title: 'Word Parts Quiz',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          question: 'What does the prefix "pre-" mean?',
          options: [
            { label: 'A', text: 'After' },
            { label: 'B', text: 'Before' },
            { label: 'C', text: 'Against' },
            { label: 'D', text: 'Around' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q2',
          question: 'The suffix "-less" means:',
          options: [
            { label: 'A', text: 'Full of' },
            { label: 'B', text: 'Without' },
            { label: 'C', text: 'More than' },
            { label: 'D', text: 'Related to' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q3',
          question: 'Which prefix means "not" or "opposite of"?',
          options: [
            { label: 'A', text: 'pre-' },
            { label: 'B', text: 'pro-' },
            { label: 'C', text: 'un-' },
            { label: 'D', text: 're-' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q4',
          question: 'The suffix "-tion" typically creates:',
          options: [
            { label: 'A', text: 'A verb' },
            { label: 'B', text: 'A noun' },
            { label: 'C', text: 'An adjective' },
            { label: 'D', text: 'An adverb' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q5',
          question: 'What does the prefix "trans-" mean?',
          options: [
            { label: 'A', text: 'Through or across' },
            { label: 'B', text: 'Under' },
            { label: 'C', text: 'Above' },
            { label: 'D', text: 'Between' },
          ],
          correctAnswer: 'A',
        },
      ],
    },
  });

  console.log('Database seeding completed successfully!');
  console.log('Created lessons:');
  console.log('- Lesson 1: Understanding Synonyms');
  console.log('- Lesson 2: Mastering Collocations');
  console.log('- Lesson 3: Word Parts: Prefixes, Suffixes, and Affixes');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
