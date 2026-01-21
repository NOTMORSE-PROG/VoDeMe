"use client";

import { useState, useRef, useEffect } from "react";
import WordStudyTutorial from "./word-study-tutorial";

interface Level1Item {
  target: string;
  prefix: string;
  base: string;
  suffix: string;
}

interface Level2Item {
  word: string;
  isDerived: boolean;
}

interface Level3Item {
  sentence: string;
  blank: string;
  options: string[];
  correct: number;
}

const gameData = {
  level1: [
    { target: "indefinitely", prefix: "in-", base: "definite", suffix: "-ly" },
    { target: "commitment", prefix: "none", base: "commit", suffix: "-ment" },
    { target: "dealer", prefix: "none", base: "deal", suffix: "-er" },
    { target: "wanted", prefix: "none", base: "want", suffix: "-ed" },
    { target: "imprisonment", prefix: "im-", base: "prison", suffix: "-ment" },
    { target: "appearing", prefix: "none", base: "appear", suffix: "-ing" },
    {
      target: "unfortunately",
      prefix: "un-",
      base: "fortunate",
      suffix: "-ly",
    },
    { target: "benches", prefix: "none", base: "bench", suffix: "-es" },
    { target: "bottomless", prefix: "none", base: "bottom", suffix: "-less" },
    { target: "counters", prefix: "none", base: "counter", suffix: "-s" },
  ],
  level2: [
    { word: "taken", isDerived: false },
    { word: "childlike", isDerived: true },
    { word: "ninth", isDerived: false },
    { word: "doors", isDerived: false },
    { word: "easiest", isDerived: false },
    { word: "looking", isDerived: false },
    { word: "Chomy's mother", isDerived: false },
    { word: "dealer", isDerived: true },
    { word: "nonhuman", isDerived: true },
    { word: "clearer", isDerived: false },
  ],
  level3: [
    {
      sentence:
        "There was a clear ________ between the students' skills and the difficulty of the test.",
      blank: "proportion",
      options: ["disproportion", "proportional", "proportions"],
      correct: 0,
    },
    {
      sentence:
        "The student was ________ her answer when the teacher asked for clarification.",
      blank: "justify",
      options: ["unjustified", "justifiable", "justifying"],
      correct: 2,
    },
    {
      sentence: "Alex found a ________ friend to help him fix his bike.",
      blank: "rely",
      options: ["reliable", "reliance", "relied"],
      correct: 0,
    },
    {
      sentence:
        "Francine ________ for the online workshop before the deadline.",
      blank: "register",
      options: ["registration", "deregister", "registered"],
      correct: 2,
    },
    {
      sentence:
        "There was an excellent ________ between the students which made their dance performance look seamless.",
      blank: "coordinate",
      options: ["coordination", "coordinator", "coordinating"],
      correct: 0,
    },
    {
      sentence:
        "The professor ________ that most students would finish the activity on time but they didn't.",
      blank: "predict",
      options: ["predictions", "predictable", "predicted"],
      correct: 2,
    },
    {
      sentence: "The team is ________ their new product on social media.",
      blank: "promote",
      options: ["promotion", "promoters", "promoting"],
      correct: 2,
    },
    {
      sentence:
        "The rooftop of the building was ________ due to safety regulations.",
      blank: "access",
      options: ["inaccessible", "accessible", "accessed"],
      correct: 0,
    },
    {
      sentence:
        "The argument between the neighbors was ________ after a calm discussion.",
      blank: "resolve",
      options: ["resolution", "unresolved", "resolved"],
      correct: 2,
    },
    {
      sentence:
        "The park ________ its natural beauty despite urban development nearby.",
      blank: "retain",
      options: ["retention", "retentive", "retains"],
      correct: 2,
    },
  ],
};

export default function WordStudyJournal() {
  const [level, setLevel] = useState<"start" | 1 | 2 | 3 | "complete">("start");
  const [itemIndex, setItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [levelScores, setLevelScores] = useState({ 1: 0, 2: 0, 3: 0 });
  const [showTutorial, setShowTutorial] = useState(false);

  // Level 1 specific states
  const [splitPoints, setSplitPoints] = useState<number[]>([]);
  const [segments, setSegments] = useState<{
    prefix: string;
    base: string;
    suffix: string;
  } | null>(null);
  const [placements, setPlacements] = useState<{
    prefix: string | null;
    base: string | null;
    suffix: string | null;
  }>({
    prefix: null,
    base: null,
    suffix: null,
  });
  const [draggingSegment, setDraggingSegment] = useState<string | null>(null);
  const [wrongNotebook, setWrongNotebook] = useState<
    "prefix" | "base" | "suffix" | null
  >(null);
  const [touchStartPos, setTouchStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const notebookRefs = useRef<{
    prefix: HTMLDivElement | null;
    base: HTMLDivElement | null;
    suffix: HTMLDivElement | null;
  }>({
    prefix: null,
    base: null,
    suffix: null,
  });

  // Level 2 specific states
  const [level2Placement, setLevel2Placement] = useState<boolean | null>(null);
  const [level2DraggingWord, setLevel2DraggingWord] = useState<string | null>(
    null,
  );
  const [level2WrongNotebook, setLevel2WrongNotebook] = useState<
    "derived" | "inflected" | null
  >(null);
  const [level2DragPosition, setLevel2DragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const level2NotebookRefs = useRef<{
    derived: HTMLDivElement | null;
    inflected: HTMLDivElement | null;
  }>({
    derived: null,
    inflected: null,
  });

  // Level 3 specific states
  const [level3SelectedOption, setLevel3SelectedOption] = useState<
    string | null
  >(null);
  const [level3DraggingOption, setLevel3DraggingOption] = useState<
    string | null
  >(null);
  const [level3DroppedInBlank, setLevel3DroppedInBlank] = useState(false);
  const [level3DragPosition, setLevel3DragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const level3BlankRef = useRef<HTMLDivElement | null>(null);

  const handleStartLevel = (lvl: 1 | 2 | 3) => {
    setLevel(lvl);
    setItemIndex(0);
    setScore(0);
    setAnswered(false);
    // Reset Level 1 states
    setSplitPoints([]);
    setSegments(null);
    setPlacements({ prefix: null, base: null, suffix: null });
    setDraggingSegment(null);
    setWrongNotebook(null);
    setDragPosition(null);
    setTouchStartPos(null);
    // Reset Level 2 states
    setLevel2Placement(null);
    setLevel2DraggingWord(null);
    setLevel2WrongNotebook(null);
    setLevel2DragPosition(null);
    // Reset Level 3 states
    setLevel3SelectedOption(null);
    setLevel3DraggingOption(null);
    setLevel3DroppedInBlank(false);
    setLevel3DragPosition(null);
  };

  const handleAnswerLevel1 = (prefix: string, base: string, suffix: string) => {
    const item = gameData.level1[itemIndex];
    if (
      prefix === item.prefix &&
      base === item.base &&
      suffix === item.suffix
    ) {
      setScore(score + 1);
    }
    handleNext();
  };

  // Level 1 interactive split and drag functions
  const handleSplitClick = (index: number) => {
    if (segments) return;

    if (splitPoints.includes(index)) {
      setSplitPoints((prev) => prev.filter((p) => p !== index));
      return;
    }

    const newSplits = [...splitPoints, index].sort((a, b) => a - b);
    setSplitPoints(newSplits);

    const item = gameData.level1[itemIndex];
    const hasPrefix = item.prefix !== "none";
    const hasSuffix = item.suffix !== "none";
    const maxSplits = (hasPrefix ? 1 : 0) + (hasSuffix ? 1 : 0);

    if (newSplits.length === maxSplits) {
      const word = item.target;
      let createdSegments: { prefix: string; base: string; suffix: string };

      if (hasPrefix && hasSuffix) {
        createdSegments = {
          prefix: word.substring(0, newSplits[0]),
          base: word.substring(newSplits[0], newSplits[1]),
          suffix: word.substring(newSplits[1]),
        };
      } else if (hasPrefix && !hasSuffix) {
        createdSegments = {
          prefix: word.substring(0, newSplits[0]),
          base: word.substring(newSplits[0]),
          suffix: "",
        };
      } else if (!hasPrefix && hasSuffix) {
        createdSegments = {
          prefix: "",
          base: word.substring(0, newSplits[0]),
          suffix: word.substring(newSplits[0]),
        };
      } else {
        createdSegments = { prefix: "", base: word, suffix: "" };
      }

      setSegments(createdSegments);
    }
  };

  const handleDrop = (
    notebook: "prefix" | "base" | "suffix",
    segmentValue: string,
  ) => {
    if (!segments) return;

    const item = gameData.level1[itemIndex];
    let isCorrectPlacement = false;
    if (notebook === "prefix") {
      isCorrectPlacement = segmentValue === segments.prefix;
    } else if (notebook === "base") {
      isCorrectPlacement = segmentValue === segments.base;
    } else if (notebook === "suffix") {
      isCorrectPlacement = segmentValue === segments.suffix;
    }

    if (!isCorrectPlacement) {
      setWrongNotebook(notebook);
      setDraggingSegment(null);
      setTimeout(() => {
        setWrongNotebook(null);
      }, 500);
      return;
    }

    setPlacements((prev) => ({ ...prev, [notebook]: segmentValue }));
    setDraggingSegment(null);

    setTimeout(() => {
      const hasPrefix = item.prefix !== "none";
      const hasSuffix = item.suffix !== "none";

      const newPrefixCorrect =
        !hasPrefix ||
        (notebook === "prefix"
          ? segmentValue === segments.prefix
          : placements.prefix === segments.prefix);
      const newBaseCorrect =
        notebook === "base"
          ? segmentValue === segments.base
          : placements.base === segments.base;
      const newSuffixCorrect =
        !hasSuffix ||
        (notebook === "suffix"
          ? segmentValue === segments.suffix
          : placements.suffix === segments.suffix);

      if (newPrefixCorrect && newBaseCorrect && newSuffixCorrect) {
        // Check if answer is correct
        const correct =
          segments.prefix === item.prefix &&
          segments.base === item.base &&
          segments.suffix === item.suffix;

        if (correct) {
          setScore(score + 1);
        }

        setTimeout(() => {
          handleNext();
        }, 1000);
      }
    }, 100);
  };

  const handlePointerDown = (e: React.PointerEvent, segmentValue: string) => {
    if (Object.values(placements).includes(segmentValue)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // iOS compatibility: check touches array first
    const touch = (e as any).touches?.[0] || e;
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setDragPosition({ x: touch.clientX, y: touch.clientY });
    setDraggingSegment(segmentValue);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingSegment) return;
    e.preventDefault();
    // iOS compatibility: check touches array first
    const touch = (e as any).touches?.[0] || e;
    setDragPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingSegment) return;

    // iOS compatibility: check touches array first (changedTouches for touchend)
    const touch = (e as any).changedTouches?.[0] || (e as any).touches?.[0] || e;
    const x = touch.clientX;
    const y = touch.clientY;

    let targetNotebook: "prefix" | "base" | "suffix" | null = null;

    Object.entries(notebookRefs.current).forEach(([key, ref]) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          targetNotebook = key as "prefix" | "base" | "suffix";
        }
      }
    });

    if (targetNotebook) {
      handleDrop(targetNotebook, draggingSegment);
    } else {
      setDraggingSegment(null);
    }

    setTouchStartPos(null);
    setDragPosition(null);
  };

  // Global pointer listeners for Level 1 to improve iOS reliability
  useEffect(() => {
    if (!draggingSegment) return;

    const handleGlobalPointerMove = (e: PointerEvent) => {
      e.preventDefault();
      // iOS compatibility: check touches array first
      const touch = (e as any).touches?.[0] || e;
      setDragPosition({ x: touch.clientX, y: touch.clientY });
    };

    const handleGlobalPointerUp = (e: PointerEvent) => {
      e.preventDefault();

      // iOS compatibility: check touches array first (changedTouches for touchend)
      const touch = (e as any).changedTouches?.[0] || (e as any).touches?.[0] || e;
      const x = touch.clientX;
      const y = touch.clientY;

      let targetNotebook: "prefix" | "base" | "suffix" | null = null;

      Object.entries(notebookRefs.current).forEach(([key, ref]) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
          ) {
            targetNotebook = key as "prefix" | "base" | "suffix";
          }
        }
      });

      if (targetNotebook) {
        handleDrop(targetNotebook, draggingSegment);
      } else {
        setDraggingSegment(null);
      }

      setTouchStartPos(null);
      setDragPosition(null);
    };

    window.addEventListener("pointermove", handleGlobalPointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", handleGlobalPointerUp, {
      passive: false,
    });

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [draggingSegment, placements]);

  // Level 2 drag and drop handlers
  const handleLevel2Drop = (notebook: "derived" | "inflected") => {
    if (!level2DraggingWord) return;

    const item = gameData.level2[itemIndex];
    const isCorrect =
      (notebook === "derived" && item.isDerived) ||
      (notebook === "inflected" && !item.isDerived);

    if (!isCorrect) {
      setLevel2WrongNotebook(notebook);
      setLevel2DraggingWord(null);
      setTimeout(() => {
        setLevel2WrongNotebook(null);
      }, 500);
      return;
    }

    setLevel2Placement(notebook === "derived");
    setLevel2DraggingWord(null);
  };

  const handleLevel2PointerDown = (e: React.PointerEvent, word: string) => {
    if (level2Placement !== null) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // iOS compatibility: check touches array first
    const touch = (e as any).touches?.[0] || e;
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setLevel2DragPosition({ x: touch.clientX, y: touch.clientY });
    setLevel2DraggingWord(word);
  };

  const handleLevel2PointerMove = (e: React.PointerEvent) => {
    if (!level2DraggingWord) return;
    e.preventDefault();
    // iOS compatibility: check touches array first
    const touch = (e as any).touches?.[0] || e;
    setLevel2DragPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleLevel2PointerUp = (e: React.PointerEvent) => {
    if (!level2DraggingWord) return;

    // iOS compatibility: check touches array first (changedTouches for touchend)
    const touch = (e as any).changedTouches?.[0] || (e as any).touches?.[0] || e;
    const x = touch.clientX;
    const y = touch.clientY;

    let targetNotebook: "derived" | "inflected" | null = null;

    Object.entries(level2NotebookRefs.current).forEach(([key, ref]) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          targetNotebook = key as "derived" | "inflected";
        }
      }
    });

    if (targetNotebook) {
      handleLevel2Drop(targetNotebook);
    } else {
      setLevel2DraggingWord(null);
    }

    setTouchStartPos(null);
    setLevel2DragPosition(null);
  };

  // Global pointer listeners for Level 2 (iOS reliability)
  useEffect(() => {
    if (!level2DraggingWord) return;

    const handleGlobalPointerMove = (e: PointerEvent) => {
      e.preventDefault();
      // iOS compatibility: check touches array first
      const touch = (e as any).touches?.[0] || e;
      setLevel2DragPosition({ x: touch.clientX, y: touch.clientY });
    };

    const handleGlobalPointerUp = (e: PointerEvent) => {
      e.preventDefault();

      // iOS compatibility: check touches array first (changedTouches for touchend)
      const touch = (e as any).changedTouches?.[0] || (e as any).touches?.[0] || e;
      const x = touch.clientX;
      const y = touch.clientY;

      let targetNotebook: "derived" | "inflected" | null = null;

      Object.entries(level2NotebookRefs.current).forEach(([key, ref]) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
          ) {
            targetNotebook = key as "derived" | "inflected";
          }
        }
      });

      if (targetNotebook) {
        handleLevel2Drop(targetNotebook);
      } else {
        setLevel2DraggingWord(null);
      }

      setTouchStartPos(null);
      setLevel2DragPosition(null);
    };

    window.addEventListener("pointermove", handleGlobalPointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", handleGlobalPointerUp, {
      passive: false,
    });

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [level2DraggingWord]);

  const handleLevel2Submit = () => {
    if (level2Placement === null) return;

    const item = gameData.level2[itemIndex];
    if (level2Placement === item.isDerived) {
      setScore(score + 1);
    }
    handleNext();
  };

  // Level 3 drag and drop handlers
  const handleLevel3Drop = (option: string) => {
    setLevel3SelectedOption(option);
    setLevel3DraggingOption(null);
    setLevel3DroppedInBlank(true);
  };

  const handleLevel3PointerDown = (e: React.PointerEvent, option: string) => {
    if (level3DroppedInBlank) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // iOS compatibility: check touches array first
    const touch = (e as any).touches?.[0] || e;
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setLevel3DragPosition({ x: touch.clientX, y: touch.clientY });
    setLevel3DraggingOption(option);
  };

  const handleLevel3PointerMove = (e: React.PointerEvent) => {
    if (!level3DraggingOption) return;
    e.preventDefault();
    // iOS compatibility: check touches array first
    const touch = (e as any).touches?.[0] || e;
    setLevel3DragPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleLevel3PointerUp = (e: React.PointerEvent) => {
    if (!level3DraggingOption) return;

    // iOS compatibility: check touches array first (changedTouches for touchend)
    const touch = (e as any).changedTouches?.[0] || (e as any).touches?.[0] || e;
    const x = touch.clientX;
    const y = touch.clientY;

    if (level3BlankRef.current) {
      const rect = level3BlankRef.current.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        handleLevel3Drop(level3DraggingOption);
      } else {
        setLevel3DraggingOption(null);
      }
    } else {
      setLevel3DraggingOption(null);
    }

    setTouchStartPos(null);
    setLevel3DragPosition(null);
  };

  // Global pointer listeners for Level 3 (iOS reliability)
  useEffect(() => {
    if (!level3DraggingOption) return;

    const handleGlobalPointerMove = (e: PointerEvent) => {
      e.preventDefault();
      // iOS compatibility: check touches array first
      const touch = (e as any).touches?.[0] || e;
      setLevel3DragPosition({ x: touch.clientX, y: touch.clientY });
    };

    const handleGlobalPointerUp = (e: PointerEvent) => {
      e.preventDefault();

      // iOS compatibility: check touches array first (changedTouches for touchend)
      const touch = (e as any).changedTouches?.[0] || (e as any).touches?.[0] || e;
      const x = touch.clientX;
      const y = touch.clientY;

      if (level3BlankRef.current) {
        const rect = level3BlankRef.current.getBoundingClientRect();
        const isInsideBlank =
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom;

        if (isInsideBlank) {
          handleLevel3Drop(level3DraggingOption);
        } else {
          setLevel3DraggingOption(null);
        }
      }

      setTouchStartPos(null);
      setLevel3DragPosition(null);
    };

    window.addEventListener("pointermove", handleGlobalPointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", handleGlobalPointerUp, {
      passive: false,
    });

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [level3DraggingOption]);

  const handleLevel3Submit = () => {
    if (!level3SelectedOption) return;

    const item = gameData.level3[itemIndex];
    const selectedIndex = item.options.indexOf(level3SelectedOption);
    if (selectedIndex === item.correct) {
      setScore(score + 1);
    }
    handleNext();
  };

  const handleAnswerLevel2 = (isDerived: boolean) => {
    const item = gameData.level2[itemIndex];
    if (isDerived === item.isDerived) {
      setScore(score + 1);
    }
    handleNext();
  };

  const handleAnswerLevel3 = (index: number) => {
    const item = gameData.level3[itemIndex];
    if (index === item.correct) {
      setScore(score + 1);
    }
    handleNext();
  };

  const handleNext = () => {
    if (itemIndex < 9) {
      setItemIndex(itemIndex + 1);
      setAnswered(false);
      // Reset Level 1 states for next item
      setSplitPoints([]);
      setSegments(null);
      setPlacements({ prefix: null, base: null, suffix: null });
      setDraggingSegment(null);
      setWrongNotebook(null);
      // Reset Level 2 states for next item
      setLevel2Placement(null);
      setLevel2DraggingWord(null);
      setLevel2WrongNotebook(null);
      // Reset Level 3 states for next item
      setLevel3SelectedOption(null);
      setLevel3DraggingOption(null);
      setLevel3DroppedInBlank(false);
    } else {
      setLevelScores({ ...levelScores, [level]: score });
      setLevel("complete");
    }
  };

  if (level === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-orange-600 mb-4">
            The Word Study Journal
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Master Word Parts & Affixes!
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Select Your Level
          </h2>

          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => handleStartLevel(1)}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
              >
                Level 1: Deconstruct Words
              </button>
              <button
                onClick={() => setShowTutorial(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg whitespace-nowrap"
                title="Interactive Tutorial for Level 1"
              >
                📖 Tutorial
              </button>
            </div>
            <button
              onClick={() => handleStartLevel(2)}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              Level 2: Classify Forms
            </button>
            <button
              onClick={() => handleStartLevel(3)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              Level 3: Complete Sentences
            </button>
          </div>
        </div>

        <div className="bg-orange-50 border-2 border-orange-300 p-6 rounded-lg max-w-2xl">
          <h3 className="font-bold text-lg mb-4">How to Play</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              ✓ Level 1: Split words into their components (Prefix, Base,
              Suffix)
            </li>
            <li>✓ Level 2: Classify words as Derived or Inflected Forms</li>
            <li>
              ✓ Level 3: Choose the correct word form to complete sentences
            </li>
            <li>✓ Score points for correct answers</li>
          </ul>
        </div>
      </div>
    );
  }

  if (level === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-4xl font-bold mb-6">Level Complete! 🎉</h2>
          <p className="text-7xl font-bold text-orange-600 mb-6">{score}/10</p>
          <p className="text-xl text-gray-600 mb-8">Excellent word study!</p>
          <button
            onClick={() => setLevel("start")}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
          >
            Select Another Level
          </button>
        </div>
      </div>
    );
  }

  if (level === 1) {
    const item = gameData.level1[itemIndex];
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            Word Study Journal - Level 1
          </h1>
          <div className="flex justify-center gap-8">
            <span className="text-lg font-semibold">
              Item: {itemIndex + 1}/10
            </span>
            <span className="text-lg font-semibold">Score: {score}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg touch-none">
          <div className="text-center mb-12">
            <div className="bg-purple-100 border-4 border-purple-300 rounded-lg p-6 inline-block mb-4">
              <p className="text-sm text-gray-600 mb-2">Target Word</p>
              <p className="text-5xl font-bold text-purple-600 mb-4">
                {item.target}
              </p>

              {/* Clickable Word */}
              {!segments && (
                <div>
                  <div className="flex items-center justify-center flex-wrap gap-0 mb-2">
                    {item.target.split("").map((letter, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center relative"
                      >
                        <span className="text-3xl font-bold text-gray-800 px-1">
                          {letter}
                        </span>
                        {index < item.target.length - 1 && (
                          <button
                            onClick={() => handleSplitClick(index + 1)}
                            className={`relative w-2 h-12 mx-1 transition-all rounded ${
                              splitPoints.includes(index + 1)
                                ? "bg-orange-500 scale-x-150 shadow-lg animate-pulse cursor-pointer"
                                : "bg-blue-400 hover:bg-amber-400 hover:scale-x-150 shadow cursor-pointer"
                            }`}
                          >
                            {splitPoints.includes(index + 1) && (
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-orange-500 text-2xl animate-bounce">
                                ✂️
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    👆 Click between letters to split the word!
                  </p>
                </div>
              )}

              {/* Segments after split */}
              {segments && (
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {item.prefix !== "none" && segments.prefix && (
                    <div
                      draggable={
                        !Object.values(placements).includes(segments.prefix)
                      }
                      onDragStart={() => setDraggingSegment(segments.prefix)}
                      onDragEnd={() => setDraggingSegment(null)}
                      onPointerDown={(e) =>
                        handlePointerDown(e, segments.prefix)
                      }
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className={`draggable-no-callout px-4 py-2 rounded-lg border-2 font-bold text-lg bg-amber-50 border-amber-300 text-gray-800 cursor-grab active:cursor-grabbing hover:scale-105 transition touch-none ${
                        Object.values(placements).includes(segments.prefix)
                          ? "opacity-30"
                          : ""
                      } ${draggingSegment === segments.prefix ? "opacity-50 scale-95" : ""}`}
                    >
                      {segments.prefix}
                    </div>
                  )}
                  <div
                    draggable={
                      !Object.values(placements).includes(segments.base)
                    }
                    onDragStart={() => setDraggingSegment(segments.base)}
                    onDragEnd={() => setDraggingSegment(null)}
                    onPointerDown={(e) => handlePointerDown(e, segments.base)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className={`draggable-no-callout px-4 py-2 rounded-lg border-2 font-bold text-lg bg-amber-50 border-amber-300 text-gray-800 cursor-grab active:cursor-grabbing hover:scale-105 transition touch-none ${
                      Object.values(placements).includes(segments.base)
                        ? "opacity-30"
                        : ""
                    } ${draggingSegment === segments.base ? "opacity-50 scale-95" : ""}`}
                  >
                    {segments.base}
                  </div>
                  {item.suffix !== "none" && segments.suffix && (
                    <div
                      draggable={
                        !Object.values(placements).includes(segments.suffix)
                      }
                      onDragStart={() => setDraggingSegment(segments.suffix)}
                      onDragEnd={() => setDraggingSegment(null)}
                      onPointerDown={(e) =>
                        handlePointerDown(e, segments.suffix)
                      }
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className={`draggable-no-callout px-4 py-2 rounded-lg border-2 font-bold text-lg bg-amber-50 border-amber-300 text-gray-800 cursor-grab active:cursor-grabbing hover:scale-105 transition touch-none ${
                        Object.values(placements).includes(segments.suffix)
                          ? "opacity-30"
                          : ""
                      } ${draggingSegment === segments.suffix ? "opacity-50 scale-95" : ""}`}
                    >
                      {segments.suffix}
                    </div>
                  )}
                </div>
              )}
            </div>
            {segments && (
              <p className="text-sm text-gray-500">
                Drag each part to the correct notebook below
              </p>
            )}
          </div>

          {/* Notebooks */}
          {segments && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {/* Prefix Notebook */}
              {item.prefix !== "none" && (
                <div
                  ref={(el) => {
                    notebookRefs.current.prefix = el;
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggingSegment) handleDrop("prefix", draggingSegment);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className={`relative w-32 h-40 rounded-lg shadow-xl transition-all bg-yellow-100 border-4 ${
                    wrongNotebook === "prefix"
                      ? "border-red-500 animate-shake"
                      : "border-yellow-500"
                  } ${draggingSegment && !placements.prefix ? "scale-105 ring-4 ring-yellow-400 animate-pulse" : ""}`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-t-lg bg-yellow-100 border-2 border-yellow-500">
                    <span className="text-xs font-bold text-yellow-700">
                      Prefix
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center px-2">
                    {placements.prefix ? (
                      <div className="text-yellow-700 font-bold text-xl">
                        {placements.prefix}
                      </div>
                    ) : (
                      <div className="text-3xl opacity-30">📝</div>
                    )}
                  </div>
                </div>
              )}

              {/* Base Notebook */}
              <div
                ref={(el) => {
                  notebookRefs.current.base = el;
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggingSegment) handleDrop("base", draggingSegment);
                }}
                onDragOver={(e) => e.preventDefault()}
                className={`relative w-32 h-40 rounded-lg shadow-xl transition-all bg-green-100 border-4 ${
                  wrongNotebook === "base"
                    ? "border-red-500 animate-shake"
                    : "border-green-500"
                } ${draggingSegment && !placements.base ? "scale-105 ring-4 ring-green-400 animate-pulse" : ""}`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-t-lg bg-green-100 border-2 border-green-500">
                  <span className="text-xs font-bold text-green-700">
                    Base Word
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center px-2">
                  {placements.base ? (
                    <div className="text-green-700 font-bold text-xl">
                      {placements.base}
                    </div>
                  ) : (
                    <div className="text-3xl opacity-30">📝</div>
                  )}
                </div>
              </div>

              {/* Suffix Notebook */}
              {item.suffix !== "none" && (
                <div
                  ref={(el) => {
                    notebookRefs.current.suffix = el;
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggingSegment) handleDrop("suffix", draggingSegment);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className={`relative w-32 h-40 rounded-lg shadow-xl transition-all bg-blue-100 border-4 ${
                    wrongNotebook === "suffix"
                      ? "border-red-500 animate-shake"
                      : "border-blue-500"
                  } ${draggingSegment && !placements.suffix ? "scale-105 ring-4 ring-blue-400 animate-pulse" : ""}`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-t-lg bg-blue-100 border-2 border-blue-500">
                    <span className="text-xs font-bold text-blue-700">
                      Suffix
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center px-2">
                    {placements.suffix ? (
                      <div className="text-blue-700 font-bold text-xl">
                        {placements.suffix}
                      </div>
                    ) : (
                      <div className="text-3xl opacity-30">📝</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visual overlay for dragging on touch devices */}
        {dragPosition && draggingSegment && (
          <div
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: dragPosition.x,
              top: dragPosition.y,
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          >
            <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-400 shadow-lg opacity-90">
              <span className="text-2xl font-bold text-gray-800">
                {draggingSegment}
              </span>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            10%,
            30%,
            50%,
            70%,
            90% {
              transform: translateX(-10px);
            }
            20%,
            40%,
            60%,
            80% {
              transform: translateX(10px);
            }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  if (level === 2) {
    const item = gameData.level2[itemIndex];
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">
            Word Study Journal - Level 2
          </h1>
          <div className="flex justify-center gap-8">
            <span className="text-lg font-semibold">
              Item: {itemIndex + 1}/10
            </span>
            <span className="text-lg font-semibold">Score: {score}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg touch-none">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-600 mb-4">
              Drag the sticky note to the correct notebook
            </p>

            {/* Sticky Note with Word */}
            {level2Placement === null && (
              <div
                draggable={true}
                onDragStart={() => setLevel2DraggingWord(item.word)}
                onDragEnd={() => setLevel2DraggingWord(null)}
                onPointerDown={(e) => handleLevel2PointerDown(e, item.word)}
                onPointerMove={handleLevel2PointerMove}
                onPointerUp={handleLevel2PointerUp}
                className={`draggable-no-callout inline-block bg-yellow-200 border-4 border-yellow-400 rounded-lg p-6 shadow-lg cursor-grab active:cursor-grabbing hover:scale-105 transition touch-none ${
                  level2DraggingWord ? "opacity-50 scale-95" : ""
                }`}
              >
                <p className="text-4xl font-bold text-gray-800">{item.word}</p>
              </div>
            )}

            {level2Placement !== null && (
              <div className="inline-block bg-gray-200 border-4 border-gray-400 rounded-lg p-6 shadow-lg opacity-50">
                <p className="text-4xl font-bold text-gray-600">{item.word}</p>
              </div>
            )}
          </div>

          {/* Notebooks */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Derived Form Notebook */}
            <div
              ref={(el) => {
                level2NotebookRefs.current.derived = el;
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (level2DraggingWord) handleLevel2Drop("derived");
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`relative h-48 rounded-lg shadow-xl transition-all bg-green-100 border-4 ${
                level2WrongNotebook === "derived"
                  ? "border-red-500 animate-shake"
                  : "border-green-500"
              } ${level2DraggingWord && level2Placement === null ? "scale-105 ring-4 ring-green-400 animate-pulse" : ""} ${
                level2Placement === true ? "ring-4 ring-green-500" : ""
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-t-lg bg-green-100 border-2 border-green-500">
                <span className="text-sm font-bold text-green-700">
                  Derived Form
                </span>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                {level2Placement === true ? (
                  <div className="text-green-700 font-bold text-2xl text-center">
                    {item.word}
                  </div>
                ) : (
                  <>
                    <div className="text-4xl opacity-30 mb-2">📚</div>
                    <p className="text-xs text-gray-600 text-center">
                      New word/meaning
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Inflected Form Notebook */}
            <div
              ref={(el) => {
                level2NotebookRefs.current.inflected = el;
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (level2DraggingWord) handleLevel2Drop("inflected");
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`relative h-48 rounded-lg shadow-xl transition-all bg-blue-100 border-4 ${
                level2WrongNotebook === "inflected"
                  ? "border-red-500 animate-shake"
                  : "border-blue-500"
              } ${level2DraggingWord && level2Placement === null ? "scale-105 ring-4 ring-blue-400 animate-pulse" : ""} ${
                level2Placement === false ? "ring-4 ring-blue-500" : ""
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-t-lg bg-blue-100 border-2 border-blue-500">
                <span className="text-sm font-bold text-blue-700">
                  Inflected Form
                </span>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                {level2Placement === false ? (
                  <div className="text-blue-700 font-bold text-2xl text-center">
                    {item.word}
                  </div>
                ) : (
                  <>
                    <div className="text-4xl opacity-30 mb-2">📚</div>
                    <p className="text-xs text-gray-600 text-center">
                      Grammatical change only
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {level2Placement !== null && (
            <div className="text-center">
              <button
                onClick={handleLevel2Submit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition animate-bounce"
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>

        {/* Dragging overlay for touch devices - Level 2 */}
        {level2DragPosition && level2DraggingWord && (
          <div
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: level2DragPosition.x,
              top: level2DragPosition.y,
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          >
            <div className="inline-block bg-yellow-200 border-4 border-yellow-400 rounded-lg p-6 shadow-2xl opacity-90">
              <p className="text-4xl font-bold text-gray-800">
                {level2DraggingWord}
              </p>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            10%,
            30%,
            50%,
            70%,
            90% {
              transform: translateX(-10px);
            }
            20%,
            40%,
            60%,
            80% {
              transform: translateX(10px);
            }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  if (level === 3) {
    const item = gameData.level3[itemIndex];

    // Split sentence by blank position
    const sentenceParts = item.sentence.split("________");

    return (
      <div className="fixed inset-0 bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Word Study Journal - Level 3
          </h1>
          <div className="flex justify-center gap-8">
            <span className="text-lg font-semibold">
              Item: {itemIndex + 1}/10
            </span>
            <span className="text-lg font-semibold">Score: {score}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg touch-none">
          {/* Sentence with blank */}
          <div className="text-center mb-8">
            <div className="text-lg text-gray-700 mb-6 leading-relaxed inline">
              {sentenceParts[0]}
              <span
                ref={level3BlankRef}
                onDrop={(e) => {
                  e.preventDefault();
                  if (level3DraggingOption)
                    handleLevel3Drop(level3DraggingOption);
                }}
                onDragOver={(e) => e.preventDefault()}
                className={`inline-block min-w-[120px] mx-2 px-4 py-2 border-b-4 border-dashed transition-all ${
                  level3SelectedOption
                    ? "border-blue-500 bg-blue-50"
                    : level3DraggingOption
                      ? "border-blue-400 bg-blue-100 animate-pulse"
                      : "border-gray-400"
                }`}
              >
                {level3SelectedOption ? (
                  <span className="font-bold text-blue-600">
                    {level3SelectedOption}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">drop here</span>
                )}
              </span>
              {sentenceParts[1]}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Base form:{" "}
              <span className="font-bold text-blue-600">{item.blank}</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              👆 Drag the correct word into the blank
            </p>
          </div>

          {/* Word Options */}
          <div className="space-y-4 mb-8">
            {item.options.map((option, index) => (
              <div
                key={index}
                draggable={
                  !level3DroppedInBlank || level3SelectedOption !== option
                }
                onDragStart={() => setLevel3DraggingOption(option)}
                onDragEnd={() => setLevel3DraggingOption(null)}
                onPointerDown={(e) => handleLevel3PointerDown(e, option)}
                onPointerMove={handleLevel3PointerMove}
                onPointerUp={handleLevel3PointerUp}
                className={`draggable-no-callout w-full bg-amber-50 border-4 border-amber-300 rounded-lg p-4 font-bold text-lg transition cursor-grab active:cursor-grabbing hover:scale-102 hover:border-amber-400 touch-none ${
                  level3SelectedOption === option ? "opacity-30" : ""
                } ${level3DraggingOption === option ? "opacity-50 scale-95" : ""}`}
              >
                {option}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          {level3DroppedInBlank && (
            <div className="text-center">
              <button
                onClick={handleLevel3Submit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition animate-bounce"
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>

        {/* Dragging overlay for touch devices - Level 3 */}
        {level3DragPosition && level3DraggingOption && (
          <div
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: level3DragPosition.x,
              top: level3DragPosition.y,
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          >
            <div className="bg-amber-50 border-4 border-amber-300 rounded-lg p-4 font-bold text-lg shadow-2xl opacity-90">
              {level3DraggingOption}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {showTutorial && (
        <WordStudyTutorial onClose={() => setShowTutorial(false)} />
      )}
    </>
  );
}
