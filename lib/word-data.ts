/**
 * Word of the Day Data
 * Contains all 52 vocabulary words (A-Z, 2 per letter) with daily rotation logic
 */

export interface WordEntry {
  word: string;
  pronunciation: string;
  wordClass: string;
  meaning: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
}

export const words: WordEntry[] = [
  // A
  {
    word: "Avert",
    pronunciation: "/əˈvərt/",
    wordClass: "Verb",
    meaning: "to turn away or aside (the eyes, one's gaze, etc.) in avoidance",
    example: "I had to avert my eyes when my crush saw me looking at him.",
    synonyms: ["prevent", "avoid", "ward off", "fend off", "deflect"],
    antonyms: ["allow", "confront", "facilitate", "invite", "permit"],
  },
  {
    word: "Abide",
    pronunciation: "/əˈbīd/",
    wordClass: "Verb",
    meaning: "to accept without objection",
    example: "We must always abide by the rules.",
    synonyms: ["follow", "obey", "uphold", "heed"],
    antonyms: ["flout", "reject"],
  },
  // B
  {
    word: "Boycott",
    pronunciation: "/ˈboiˌkät/",
    wordClass: "Verb",
    meaning: "to engage in a concerted refusal to have dealings with (a person, a store, an organization, etc.) usually to express disapproval or to force acceptance of certain conditions",
    example: "We should all boycott the companies that use animal testing.",
    synonyms: ["avoid", "ban", "reject", "blacklist"],
    antonyms: ["support"],
  },
  {
    word: "Barren",
    pronunciation: "/ˈberən/",
    wordClass: "Adjective",
    meaning: "producing little or no vegetation",
    example: "The land became barren after months without rain.",
    synonyms: ["unproductive", "infertile", "unfruitful"],
    antonyms: ["fertile", "productive", "fruitful"],
  },
  // C
  {
    word: "Comprehensive",
    pronunciation: "/ˌkämprəˈhen(t)siv/",
    wordClass: "Adjective",
    meaning: "covering completely or broadly",
    example: "My classmate gave a comprehensive reflection on the story.",
    synonyms: ["thorough", "complete", "full"],
    antonyms: ["incomplete", "limited", "narrow"],
  },
  {
    word: "Crucial",
    pronunciation: "/ˈkro͞oSH(ə)l/",
    wordClass: "Adjective",
    meaning: "very important or essential",
    example: "Education is very crucial for our future.",
    synonyms: ["vital", "necessary", "essential"],
    antonyms: ["unimportant", "insignificant"],
  },
  // D
  {
    word: "Diminish",
    pronunciation: "/dəˈminiSH/",
    wordClass: "Verb",
    meaning: "to make less or cause to appear less",
    example: "They must diminish the fare because it's too expensive.",
    synonyms: ["reduce", "lessen", "decrease"],
    antonyms: ["increase", "boost"],
  },
  {
    word: "Distinctive",
    pronunciation: "/dəˈstiNG(k)tiv/",
    wordClass: "Adjective",
    meaning: "having or giving an uncommon and appealing quality: having or giving style or distinction",
    example: "Her penmanship is quite distinctive from mine.",
    synonyms: ["unique", "remarkable", "unusual"],
    antonyms: ["ordinary", "common", "plain"],
  },
  // E
  {
    word: "Efficacious",
    pronunciation: "/ˌefəˈkāSHəs/",
    wordClass: "Adjective",
    meaning: "having the power to produce a desired effect",
    example: "The medicine was highly efficacious in relieving her headaches.",
    synonyms: ["effective", "potent", "beneficial"],
    antonyms: ["ineffective", "futile"],
  },
  {
    word: "Excessive",
    pronunciation: "/ikˈsesiv/",
    wordClass: "Adjective",
    meaning: "exceeding what is usual, proper, necessary, or normal",
    example: "She bought an excessive amount of food, more than anyone could eat.",
    synonyms: ["extreme", "a bit much", "extravagant"],
    antonyms: ["insufficient", "low"],
  },
  // F
  {
    word: "Fervor",
    pronunciation: "/ˈfərvər/",
    wordClass: "Noun",
    meaning: "intensity of feeling or expression",
    example: "The fans cheered with great fervor as their team scored the winning goal.",
    synonyms: ["eagerness", "passion", "excitement"],
    antonyms: ["disinterest", "indifference"],
  },
  {
    word: "Fatigue",
    pronunciation: "/fəˈtēɡ/",
    wordClass: "Noun",
    meaning: "weariness or exhaustion from labor, exertion, or stress",
    example: "The long night of studying caused him fatigue.",
    synonyms: ["tiredness", "weariness", "drowsiness"],
    antonyms: ["rested", "relaxed", "energized"],
  },
  // G
  {
    word: "Glamorous",
    pronunciation: "/ˈɡlam(ə)rəs/",
    wordClass: "Adjective",
    meaning: "full of glamour: excitingly attractive",
    example: "The actress looked glamorous in her sparkling evening gown.",
    synonyms: ["attractive", "elegant", "gorgeous"],
    antonyms: ["unattractive", "plain", "simple"],
  },
  {
    word: "Gaze",
    pronunciation: "/ɡāz/",
    wordClass: "Verb",
    meaning: "to fix the eyes in a steady intent look often with eagerness or studious attention",
    example: "He couldn't help but gaze at the stars, captivated by their beauty.",
    synonyms: ["stare", "look"],
    antonyms: ["look away", "glance away"],
  },
  // H
  {
    word: "Handy",
    pronunciation: "/ˈhandē/",
    wordClass: "Adjective",
    meaning: "convenient for use",
    example: "Her survival skills came in handy when they were trapped in the cave.",
    synonyms: ["useful", "helpful", "convenient"],
    antonyms: ["inconvenient", "useless", "unhelpful"],
  },
  {
    word: "Hubris",
    pronunciation: "/ˈ(h)yo͞obrəs/",
    wordClass: "Noun",
    meaning: "exaggerated pride or self-confidence",
    example: "His hubris made him believe he could win the race without training.",
    synonyms: ["arrogance", "pride", "ego"],
    antonyms: ["modesty", "humbleness", "humility"],
  },
  // I
  {
    word: "Innate",
    pronunciation: "/iˈnāt/",
    wordClass: "Adjective",
    meaning: "existing in, belonging to, or determined by factors present in an individual from birth",
    example: "Her beautiful features were innate.",
    synonyms: ["inborn", "natural", "inherent"],
    antonyms: ["acquired", "developed"],
  },
  {
    word: "Indigent",
    pronunciation: "/ˈindəjənt/",
    wordClass: "Adjective",
    meaning: "suffering from extreme poverty",
    example: "The indigent family received financial aid from the government.",
    synonyms: ["poor", "impoverished"],
    antonyms: ["rich", "wealthy"],
  },
  // J
  {
    word: "Justify",
    pronunciation: "/ˈjəstəˌfī/",
    wordClass: "Verb",
    meaning: "to prove or show to be just, right, or reasonable",
    example: "I shouldn't have to justify myself to them.",
    synonyms: ["defend", "uphold", "maintain"],
    antonyms: ["withdraw", "forsake", "abandon", "retract"],
  },
  {
    word: "Judgment",
    pronunciation: "/ˈjəjmənt/",
    wordClass: "Noun",
    meaning: "the act or process of forming an opinion or evaluation by discerning and comparing",
    example: "It's too soon to pass judgment on the effectiveness of the new program.",
    synonyms: ["ruling", "sentence", "verdict", "decision"],
    antonyms: ["tie", "halt", "draw", "deadlock"],
  },
  // K
  {
    word: "Knowledge",
    pronunciation: "/ˈnälij/",
    wordClass: "Noun",
    meaning: "a body of facts learned by study or experience",
    example: "The forest ranger shared some of his vast knowledge of the woods with us.",
    synonyms: ["wisdom", "intelligence", "expertise", "lore"],
    antonyms: ["ignorance", "inexperience", "innocence", "unfamiliarity"],
  },
  {
    word: "Known",
    pronunciation: "/ˈnōn/",
    wordClass: "Adjective",
    meaning: "generally recognized",
    example: "A known authority on art.",
    synonyms: ["named", "specified"],
    antonyms: ["certain", "anonymous", "unidentified", "unspecified"],
  },
  // L
  {
    word: "Likely",
    pronunciation: "/ˈlīklē/",
    wordClass: "Adjective",
    meaning: "having a high probability of occurring or being true: very probable",
    example: "That seems to be the most likely explanation.",
    synonyms: ["probable", "inevitable", "possible"],
    antonyms: ["unlikely", "doubtful", "questionable"],
  },
  {
    word: "Lack",
    pronunciation: "/ˈlak/",
    wordClass: "Noun",
    meaning: "the fact or state of being wanting or deficient",
    example: "A lack of evidence.",
    synonyms: ["absence", "dearth"],
    antonyms: ["presence", "plenty", "adequacy"],
  },
  // M
  {
    word: "Movement",
    pronunciation: "/ˈmo͞ovmənt/",
    wordClass: "Noun",
    meaning: "the act or process of moving especially: change of place or position or posture",
    example: "A sudden movement in the far corner of the room made her turn in that direction.",
    synonyms: ["shifting", "move", "relocation", "motion"],
    antonyms: ["immobility", "inertia", "stillness", "motionless"],
  },
  {
    word: "Model",
    pronunciation: "/ˈmädᵊl/",
    wordClass: "Noun",
    meaning: "a usually miniature representation of something; a pattern of something to be made",
    example: "A plastic model of the human heart.",
    synonyms: ["reproduction", "replica", "miniature", "imitation"],
    antonyms: ["prototype", "archetype", "original"],
  },
  // N
  {
    word: "Need",
    pronunciation: "/ˈnēd/",
    wordClass: "Noun",
    meaning: "a state of being without something necessary, desirable, or useful",
    example: "When it came time to wrap the presents, he found he was in need of adhesive tape.",
    synonyms: ["lack", "needfulness"],
    antonyms: ["supply", "adequacy", "stock", "enough"],
  },
  {
    word: "Natural",
    pronunciation: "/ˈnaCH(ə)rəl/",
    wordClass: "Adjective",
    meaning: "closely resembling the object imitated",
    example: "The diorama featuring stuffed birds and plastic plants actually looked very natural.",
    synonyms: ["realistic", "lifelike", "naturalistic"],
    antonyms: ["unnatural", "unlike", "unrealistic", "dissimilar"],
  },
  // O
  {
    word: "Observe",
    pronunciation: "/əbˈzərv/",
    wordClass: "Verb",
    meaning: "to act according to the commands of",
    example: "You must observe all the rules of this school, not simply the ones that meet with your personal approval.",
    synonyms: ["obey", "follow"],
    antonyms: ["defy", "disobey", "dare", "refuse"],
  },
  {
    word: "Outcome",
    pronunciation: "/ˈautˌkəm/",
    wordClass: "Noun",
    meaning: "something that follows as a result or consequence",
    example: "We are still awaiting the final outcome of the trial.",
    synonyms: ["result", "consequence", "product"],
    antonyms: ["cause", "consideration", "reason", "factor"],
  },
  // P
  {
    word: "Provide",
    pronunciation: "/prəˈvīd/",
    wordClass: "Verb",
    meaning: "to supply or make available (something wanted or needed)",
    example: "This luxury hotel provides all the comforts of home to well-heeled vacationers.",
    synonyms: ["give", "supply", "deliver", "hand"],
    antonyms: ["retain", "hold (back)", "maintain"],
  },
  {
    word: "Process",
    pronunciation: "/ˈpräˌses/",
    wordClass: "Noun",
    meaning: "forward movement in time or place",
    example: "In the process of doing this project, we all learned a lot.",
    synonyms: ["progress", "advance", "progression", "advancement"],
    antonyms: ["regression", "recession", "retreat"],
  },
  // Q
  {
    word: "Quality",
    pronunciation: "/ˈkwälətē/",
    wordClass: "Noun",
    meaning: "high position within society",
    example: "A glamorous invitation-only party for all the people of quality in the summer resort.",
    synonyms: ["dignity", "rank"],
    antonyms: ["degradation", "debasement", "inferiority"],
  },
  {
    word: "Query",
    pronunciation: "/ˈkwirē/",
    wordClass: "Verb",
    meaning: "to ask questions of especially with a desire for authoritative information; to ask questions about especially in order to resolve a doubt",
    example: "It seems odd that someone would want two stoves, so you'd better query that order.",
    synonyms: ["question", "challenge"],
    antonyms: ["believe", "accept", "support"],
  },
  // R
  {
    word: "Require",
    pronunciation: "/riˈkwī(ə)r/",
    wordClass: "Verb",
    meaning: "to demand as necessary or essential: have a compelling need for",
    example: "All living beings require food.",
    synonyms: ["need", "want", "take"],
    antonyms: ["have", "hold"],
  },
  {
    word: "Relationship",
    pronunciation: "/riˈlāSHənˌship/",
    wordClass: "Noun",
    meaning: "the way in which two or more things or people are connected: the state of being related or interrelated",
    example: "The relationship between physical and mental health.",
    synonyms: ["association", "relation", "connection"],
    antonyms: ["variance", "variability", "dissociation"],
  },
  // S
  {
    word: "Succumb",
    pronunciation: "/səˈkəm/",
    wordClass: "Intransitive Verb",
    meaning: "to yield to superior strength or force or overpowering appeal or desire",
    example: "This is still a guy who hasn't done television, doesn't succumb to the paychecks of streaming movies, and genuinely believes in the theatrical experience.",
    synonyms: ["yield", "submit", "capitulate", "relent"],
    antonyms: ["resist", "contend", "confront"],
  },
  {
    word: "Simultaneously",
    pronunciation: "/saɪməlˈteɪniəsli/",
    wordClass: "Adverb",
    meaning: "existing or occurring at the same time: exactly coincident",
    example: "How can you be simultaneously happy and sad?",
    synonyms: ["contemporary", "contemporaneous", "coeval"],
    antonyms: ["asynchronous", "nonsimultaneous"],
  },
  // T
  {
    word: "Tremendous",
    pronunciation: "/trɪˈmendəs/",
    wordClass: "Adjective",
    meaning: "notable by reason of extreme size, power, greatness, or excellence",
    example: "She is a writer of tremendous talent.",
    synonyms: ["huge", "vast", "massive", "giant", "enormous", "colossal"],
    antonyms: ["tiny", "infinitesimal", "diminutive"],
  },
  {
    word: "Testimony",
    pronunciation: "/ˈtestəmōnē/",
    wordClass: "Noun",
    meaning: "a solemn declaration usually made orally by a witness under oath in response to interrogation by a lawyer or authorized public official",
    example: "It is testimony to her courage and persistence that she worked for so long in the face of such adversity.",
    synonyms: ["evidence", "testimonial", "proof", "witness"],
    antonyms: ["rebuttal", "allegation", "assumption"],
  },
  // U
  {
    word: "Utilize",
    pronunciation: "/yo͞otəˌlīz/",
    wordClass: "Verb",
    meaning: "to make use of: turn to practical use or account",
    example: "We must utilize all the tools at our disposal.",
    synonyms: ["use", "exploit", "apply", "employ"],
    antonyms: ["ignore", "misuse", "neglect"],
  },
  {
    word: "Undergo",
    pronunciation: "/ˌəndərˈɡō/",
    wordClass: "Verb",
    meaning: "to submit to: to go through",
    example: "The patient will undergo surgery tomorrow.",
    synonyms: ["endure", "have", "experience", "see"],
    antonyms: ["evade", "escape"],
  },
  // V
  {
    word: "Vulnerable",
    pronunciation: "/ˈvəln(ə)rəbəl/",
    wordClass: "Adjective",
    meaning: "capable of being easily hurt or harmed physically, mentally, or emotionally",
    example: "The patient may be more vulnerable to infection immediately after surgery.",
    synonyms: ["exposed", "prone", "sensitive", "susceptible"],
    antonyms: ["protected", "covered", "secured"],
  },
  {
    word: "Viable",
    pronunciation: "/ˈvīəbəl/",
    wordClass: "Adjective",
    meaning: "capable of working, functioning, or developing adequately",
    example: "China's most viable pathway to becoming an AI power is to stockpile these chipmaking tools and the critical components needed to build them.",
    synonyms: ["possible", "feasible", "achievable", "attainable"],
    antonyms: ["impossible", "infeasible", "unworkable"],
  },
  // W
  {
    word: "Waft",
    pronunciation: "/wɑft/",
    wordClass: "Intransitive Verb",
    meaning: "to move or go lightly on or as if on a buoyant medium",
    example: "Conversations waft up the streets and the click of dog toenails can be heard on sidewalks as residents walk their good boys and girls.",
    synonyms: ["float", "hover", "drift", "sail"],
    antonyms: ["settle", "sink"],
  },
  {
    word: "Wander",
    pronunciation: "/ˈwändər/",
    wordClass: "Intransitive Verb",
    meaning: "to move about without a fixed course, aim, or goal",
    example: "Max and Holly also wander the maze of Henry's memories, which includes Hawkins High School circa 1959, where the Broadway play is largely set.",
    synonyms: ["roam", "stroll", "drift", "rove"],
    antonyms: ["stay", "remain", "settle"],
  },
  // X
  {
    word: "Xenophobic",
    pronunciation: "/ziːnəˈfoʊbɪk/",
    wordClass: "Adjective",
    meaning: "one unduly fearful of what is foreign and especially of people of foreign origin",
    example: "Social media has also been flooded with racist and xenophobic comments, especially about Indians, amid fears that an influx of foreigners could erode national identity in China.",
    synonyms: ["nativist", "anti-immigrant", "patriotic", "anti-foreign"],
    antonyms: ["internationalist"],
  },
  {
    word: "Xenophobia",
    pronunciation: "/zēnəˈfōbēə/",
    wordClass: "Noun",
    meaning: "fear and hatred of strangers or foreigners or of anything that is strange or foreign",
    example: "The xenophobia is now amplified, many believe, because of rhetoric related to where the virus first took hold.",
    synonyms: ["nativist", "prejudice", "nationalism"],
    antonyms: ["tolerance", "acceptance"],
  },
  // Y
  {
    word: "Yearn",
    pronunciation: "/ˈyərn/",
    wordClass: "Intransitive Verb",
    meaning: "to long persistently, wistfully, or sadly",
    example: "The people yearn for '80s graphic design!",
    synonyms: ["crave", "die (for)", "long (for)", "thirst (for)", "yen (for)", "wish (for)"],
    antonyms: ["accept", "take", "endure"],
  },
  {
    word: "Yield",
    pronunciation: "/ˈyēld/",
    wordClass: "Transitive Verb",
    meaning: "to bear or bring forth as a natural product especially as a result of cultivation",
    example: "This soil should yield good crops.",
    synonyms: ["succumb", "submit", "surrender", "concede (to)"],
    antonyms: ["resist", "object", "confront"],
  },
  // Z
  {
    word: "Zenith",
    pronunciation: "/ˈzēnəth/",
    wordClass: "Noun",
    meaning: "the point of the celestial sphere that is directly opposite the nadir and vertically above the observer",
    example: "Even by the standards of recent Ashes series, the war of words has reached a new nadir — or zenith, depending on your pantomime tolerance levels.",
    synonyms: ["pinnacle", "peak", "height", "top", "apex"],
    antonyms: ["bottom", "foot", "base"],
  },
  {
    word: "Zeal",
    pronunciation: "/zēl/",
    wordClass: "Noun",
    meaning: "eagerness and enthusiastic interest in pursuit of something",
    example: "The young musicians played with … exuberant zeal.",
    synonyms: ["passion", "fervor", "ardor", "enthusiasm"],
    antonyms: ["indifference", "disinterestedness", "apathy"],
  },
];

/**
 * Get the word of the day based on current date
 * Uses modulo arithmetic to cycle through all 52 words
 */
export function getWordOfDay(): WordEntry & { index: number } {
  const now = new Date();
  // Calculate days since epoch (Jan 1, 1970)
  const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  // Get word index (0-51)
  const wordIndex = daysSinceEpoch % words.length;
  
  return {
    ...words[wordIndex],
    index: wordIndex + 1, // 1-indexed for display
  };
}
