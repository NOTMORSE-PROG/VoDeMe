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
          question: "What does the Greek root 'syn' mean?",
          options: [
            { label: 'A', text: 'name' },
            { label: 'B', text: 'separate' },
            { label: 'C', text: 'nickname' },
            { label: 'D', text: 'alike' },
          ],
          correctAnswer: 'D',
        },
        {
          id: 'q2',
          question: "What does the Greek root 'onym' mean?",
          options: [
            { label: 'A', text: 'name' },
            { label: 'B', text: 'nickname' },
            { label: 'C', text: 'alike' },
            { label: 'D', text: 'different' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q3',
          question: '________ is a word or phrase that resembles (completely or partially) another word or phrase in meaning.',
          options: [
            { label: 'A', text: 'antonym' },
            { label: 'B', text: 'synonym' },
            { label: 'C', text: 'collocation' },
            { label: 'D', text: 'affixes' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q4',
          question: 'A synonym is basically a word that implies something similar to the provided word.',
          options: [
            { label: 'A', text: 'true' },
            { label: 'B', text: 'false' },
            { label: 'C', text: 'maybe' },
            { label: 'D', text: 'all of the above' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q5',
          question: 'Synonyms make our text less appealing.',
          options: [
            { label: 'A', text: 'false' },
            { label: 'B', text: 'true' },
            { label: 'C', text: 'maybe' },
            { label: 'D', text: 'all of the above' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q6',
          question: 'Synonyms help evade uninteresting and monotonous text.',
          options: [
            { label: 'A', text: 'false' },
            { label: 'B', text: 'true' },
            { label: 'C', text: 'maybe' },
            { label: 'D', text: 'none of the above' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q7',
          question: 'What is the importance of using synonyms?',
          options: [
            { label: 'A', text: 'To confuse readers with too many word choices' },
            { label: 'B', text: 'To make writing longer and more complicated' },
            { label: 'C', text: 'To improve vocabulary, avoid repetition, and make text more engaging' },
            { label: 'D', text: 'To replace all simple words with difficult ones' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q8',
          question: 'Which of the following statements about synonyms is NOT correct?',
          options: [
            { label: 'A', text: 'Synonym allows language to become more expressive and appealing.' },
            { label: 'B', text: 'Synonym helps prevent text from being monotonous.' },
            { label: 'C', text: 'Synonym helps learners expand their vocabulary and understanding.' },
            { label: 'D', text: 'Synonyms always make sentences shorter and simpler.' },
          ],
          correctAnswer: 'D',
        },
        {
          id: 'q9',
          question: 'Which of the following words is a synonym of disorder?',
          options: [
            { label: 'A', text: 'chaos' },
            { label: 'B', text: 'peace' },
            { label: 'C', text: 'organized' },
            { label: 'D', text: 'calm' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q10',
          question: 'Which of the following words is a synonym of gullible?',
          options: [
            { label: 'A', text: 'suspicious' },
            { label: 'B', text: 'cynical' },
            { label: 'C', text: 'trustful' },
            { label: 'D', text: 'all of the above' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q11',
          question: 'Which of the following synonym pairs is NOT correct?',
          options: [
            { label: 'A', text: 'Provide / supply' },
            { label: 'B', text: 'Close/near' },
            { label: 'C', text: 'Instinct/intuition' },
            { label: 'D', text: 'Chaos/peace' },
          ],
          correctAnswer: 'D',
        },
        {
          id: 'q12',
          question: '"Peter is a very handsome man, so a lot of people admire him." What is the synonym for the underlined word?',
          options: [
            { label: 'A', text: 'few' },
            { label: 'B', text: 'many' },
            { label: 'C', text: 'minimal' },
            { label: 'D', text: 'seldom' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q13',
          question: 'Which sentence uses synonyms correctly?',
          options: [
            { label: 'A', text: 'I like to eat large and several meals.' },
            { label: 'B', text: 'She is sad and happy at the same time.' },
            { label: 'C', text: 'Their house is very cozy and comfortable to live in.' },
            { label: 'D', text: 'All of the above' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q14',
          question: 'Which sentence uses synonyms correctly?',
          options: [
            { label: 'A', text: 'The movie was exciting and thrilling from start to finish.' },
            { label: 'B', text: 'The juice was sweet and bitter, but everyone liked it.' },
            { label: 'C', text: 'She was tired and sad after the long walk.' },
            { label: 'D', text: 'All of the above' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q15',
          question: 'Which sentence uses synonyms correctly?',
          options: [
            { label: 'A', text: 'The book was interesting and boring at the same time.' },
            { label: 'B', text: 'His explanation was clear and understandable to everyone.' },
            { label: 'C', text: 'The road was narrow and bumpy, making it hard to drive.' },
            { label: 'D', text: 'None of the above' },
          ],
          correctAnswer: 'B',
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
          question: 'According to Cambridge Dictionary, collocations are word pairs that…',
          options: [
            { label: 'A', text: 'are only used in academic English.' },
            { label: 'B', text: 'sound correct to native speakers when used together.' },
            { label: 'C', text: 'always have the same meaning.' },
            { label: 'D', text: 'must follow strict grammar rules.' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q2',
          question: "Why can collocations improve a learner's writing style?",
          options: [
            { label: 'A', text: 'They make English sentences longer and more complex.' },
            { label: 'B', text: 'They remove the need to learn grammar.' },
            { label: 'C', text: 'They help create smoother, clearer, and more professional writing.' },
            { label: 'D', text: 'They replace basic vocabulary entirely.' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q3',
          question: 'Which sentence shows how collocations make writing more precise or expressive?',
          options: [
            { label: 'A', text: 'It was very cold and very dark outside.' },
            { label: 'B', text: 'It was coldly cold and darkly dark outside.' },
            { label: 'C', text: 'It was bitterly cold and pitch dark outside.' },
            { label: 'D', text: 'It was cold, dark, and confusing to describe.' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q4',
          question: 'What is the best simple definition of a collocation?',
          options: [
            { label: 'A', text: 'Two words that rhyme with each other.' },
            { label: 'B', text: 'A fixed phrase whose meaning cannot be guessed from the separate words.' },
            { label: 'C', text: 'Words that can replace each other without changing the meaning.' },
            { label: 'D', text: 'Words that often go together naturally in English.' },
          ],
          correctAnswer: 'D',
        },
        {
          id: 'q5',
          question: 'What happens when learners know many collocations?',
          options: [
            { label: 'A', text: 'They can understand and produce English more naturally because they recognize common word combinations.' },
            { label: 'B', text: 'They begin to memorize individual words instead of meaningful chunks.' },
            { label: 'C', text: 'They rely mainly on grammar rules rather than vocabulary patterns.' },
            { label: 'D', text: 'They often create unusual word pairings that sound less natural.' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q6',
          question: 'The collocation "make a decision" is an example of which type?',
          options: [
            { label: 'A', text: 'Verb + Noun' },
            { label: 'B', text: 'Noun + Noun' },
            { label: 'C', text: 'Verb + Adverb' },
            { label: 'D', text: 'Adjective + Adverb' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q7',
          question: 'The collocation "deeply disappointed" is an example of which type?',
          options: [
            { label: 'A', text: 'Verb + Noun' },
            { label: 'B', text: 'Noun + Noun' },
            { label: 'C', text: 'Verb + Adverb' },
            { label: 'D', text: 'Adjective + Adverb' },
          ],
          correctAnswer: 'D',
        },
        {
          id: 'q8',
          question: 'The collocation "family member" is an example of which type?',
          options: [
            { label: 'A', text: 'Verb + Noun' },
            { label: 'B', text: 'Noun + Noun' },
            { label: 'C', text: 'Verb + Adverb' },
            { label: 'D', text: 'Adjective + Adverb' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q9',
          question: 'The collocation "tread carefully" is an example of which type?',
          options: [
            { label: 'A', text: 'Adjective + Noun' },
            { label: 'B', text: 'Noun + Noun' },
            { label: 'C', text: 'Verb + Adverb' },
            { label: 'D', text: 'Adjective + Adverb' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q10',
          question: 'The collocation "a key factor" is an example of which type?',
          options: [
            { label: 'A', text: 'Adjective + Noun' },
            { label: 'B', text: 'Noun + Noun' },
            { label: 'C', text: 'Verb + Adverb' },
            { label: 'D', text: 'Adjective + Adverb' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q11',
          question: 'Ilor and his friends must focus _____ improving their vocabulary.',
          options: [
            { label: 'A', text: 'under' },
            { label: 'B', text: 'for' },
            { label: 'C', text: 'in' },
            { label: 'D', text: 'on' },
          ],
          correctAnswer: 'D',
        },
        {
          id: 'q12',
          question: 'The new learning website is highly _____ by many teachers and schools.',
          options: [
            { label: 'A', text: 'broken' },
            { label: 'B', text: 'recommended' },
            { label: 'C', text: 'asleep' },
            { label: 'D', text: 'wooden' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q13',
          question: 'Rommel believes that hard work is _____ in achieving success.',
          options: [
            { label: 'A', text: 'a key facts' },
            { label: 'B', text: 'key factor' },
            { label: 'C', text: 'a key factor' },
            { label: 'D', text: 'key facts' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q14',
          question: 'During Christmas, _____ quickly in tourist spots.',
          options: [
            { label: 'A', text: 'prices rise' },
            { label: 'B', text: 'prices rising' },
            { label: 'C', text: 'priced rise' },
            { label: 'D', text: 'prices are risen' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q15',
          question: "The audience began to _____ at the comedian's joke.",
          options: [
            { label: 'A', text: 'roar with laughter' },
            { label: 'B', text: 'roar of laughter' },
            { label: 'C', text: 'roar in laugh' },
            { label: 'D', text: 'roar with laugh' },
          ],
          correctAnswer: 'A',
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
          question: 'Which statement best describes a base (root) in a word?',
          options: [
            { label: 'A', text: 'A word part added before the stem' },
            { label: 'B', text: 'A form to which an affix is attached' },
            { label: 'C', text: "A suffix that changes the word's class" },
            { label: 'D', text: 'A grammatical marker at the end of a word' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q2',
          question: 'Which of the following contains a prefix?',
          options: [
            { label: 'A', text: 'happiness' },
            { label: 'B', text: 'worker' },
            { label: 'C', text: 'incomplete' },
            { label: 'D', text: 'kindness' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q3',
          question: "Which sentence correctly uses the meaning of a prefix to infer the word's meaning?",
          options: [
            { label: 'A', text: 'He rewrote the essay, meaning he wrote it for the first time.' },
            { label: 'B', text: 'The preview was confusing because it came after the full film.' },
            { label: 'C', text: 'The subway travels under the city.' },
            { label: 'D', text: 'She misheard the instructions, meaning she heard them correctly.' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q4',
          question: 'Which option shows a word formed through derivation?',
          options: [
            { label: 'A', text: 'jump → jumping' },
            { label: 'B', text: 'quick → quicker' },
            { label: 'C', text: 'child → children' },
            { label: 'D', text: 'help → helpful' },
          ],
          correctAnswer: 'D',
        },
        {
          id: 'q5',
          question: 'Which item shows an inflectional change?',
          options: [
            { label: 'A', text: 'nation → national' },
            { label: 'B', text: 'read → reader' },
            { label: 'C', text: 'hope → hopeful' },
            { label: 'D', text: 'walk → walked' },
          ],
          correctAnswer: 'D',
        },
        {
          id: 'q6',
          question: 'Which word uses one of the four most common prefixes in English (un-, re-, dis-, in-/im-/il-/ir-)?',
          options: [
            { label: 'A', text: 'semicircle' },
            { label: 'B', text: 'untidy' },
            { label: 'C', text: 'hyperactive' },
            { label: 'D', text: 'postgraduate' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q7',
          question: 'Which suffix forms a noun from an adjective?',
          options: [
            { label: 'A', text: '-ing' },
            { label: 'B', text: '-ness' },
            { label: 'C', text: '-er' },
            { label: 'D', text: '-est' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q8',
          question: 'Which of the following contains two affixes (a prefix and a suffix)?',
          options: [
            { label: 'A', text: 'unhappiness' },
            { label: 'B', text: 'asking' },
            { label: 'C', text: 'workable' },
            { label: 'D', text: 'joyful' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q9',
          question: 'Which word demonstrates that prefixes usually do NOT change part of speech?',
          options: [
            { label: 'A', text: 'anti-war' },
            { label: 'B', text: 'joyful' },
            { label: 'C', text: 'sadness' },
            { label: 'D', text: 'teacher' },
          ],
          correctAnswer: 'A',
        },
        {
          id: 'q10',
          question: 'Which pair shows correct identification of the base word?',
          options: [
            { label: 'A', text: 'unstoppable → stop' },
            { label: 'B', text: 'disagreement → agree' },
            { label: 'C', text: 'running → run' },
            { label: 'D', text: 'All of the above' },
          ],
          correctAnswer: 'D',
        },
        {
          id: 'q11',
          question: 'Which explains why word parts help with vocabulary retention?',
          options: [
            { label: 'A', text: 'Because all affixes have identical meanings' },
            { label: 'B', text: 'Because seeing related word forms counts as repeated exposure' },
            { label: 'C', text: 'Because every word with a suffix becomes a new word' },
            { label: 'D', text: 'Because prefixes always change part of speech' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q12',
          question: 'Which example shows a past participle inflection?',
          options: [
            { label: 'A', text: 'studying' },
            { label: 'B', text: 'eaten' },
            { label: 'C', text: 'studies' },
            { label: 'D', text: 'happiest' },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'q13',
          question: 'Which sentence shows correct understanding of derivation?',
          options: [
            { label: 'A', text: 'The runner runs faster every day.' },
            { label: 'B', text: 'The unhappy child smiled.' },
            { label: 'C', text: 'Adding -er to teach creates a noun meaning a person who teaches.' },
            { label: 'D', text: 'The boxes is heavy.' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q14',
          question: 'Which of the following is an example of a word made only through inflection, not derivation?',
          options: [
            { label: 'A', text: 'darkness' },
            { label: 'B', text: 'rewritten' },
            { label: 'C', text: 'dogs' },
            { label: 'D', text: 'enjoyable' },
          ],
          correctAnswer: 'C',
        },
        {
          id: 'q15',
          question: 'A student encounters the word irresponsible. Based on word-part knowledge, what can the student infer?',
          options: [
            { label: 'A', text: 'The word means "able to respond."' },
            { label: 'B', text: 'The prefix makes the meaning opposite or negative.' },
            { label: 'C', text: 'The suffix changes the verb into a noun.' },
            { label: 'D', text: 'The word refers to repeated action.' },
          ],
          correctAnswer: 'B',
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
