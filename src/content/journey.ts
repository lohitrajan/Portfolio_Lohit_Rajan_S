import type { CodingProfile, CodingTopicGroup, EducationEntry, ExperienceEntry } from "./types";

/** Problem-solving topics practised so far. */
export const codingTopics: CodingTopicGroup[] = [
  { label: "Foundations", topics: ["Array manipulation", "String manipulation", "Matrix problems", "Time and space complexity"] },
  { label: "Algorithms", topics: ["Sorting algorithms", "Searching algorithms", "Recursion", "Sliding window", "Dynamic programming"] },
  { label: "Data structures", topics: ["Linked lists", "Stacks and queues", "Binary search trees", "AVL trees", "Graph algorithms"] },
];

/**
 * Coding profiles. Add your username + URL when ready. Stats are manually maintained:
 * only add numbers you have verified on the platform.
 */
export const codingProfiles: CodingProfile[] = [
  { platform: "GitHub", username: "", url: "", stats: [] },
  { platform: "LeetCode", username: "", url: "", stats: [] },
  { platform: "HackerRank", username: "", url: "", stats: [] },
  { platform: "CodeChef", username: "", url: "", stats: [] },
  { platform: "GeeksforGeeks", username: "", url: "", stats: [] },
];

/** Academic record. Only confirmed details — empty fields are shown as "To be added". */
export const education: EducationEntry[] = [
  {
    institution: "Amrita Vishwa Vidyapeetham",
    degree: "",
    department: "Computer Science",
    academicYear: "",
    startYear: "",
    graduationYear: "",
    cgpa: "",
    coursework: [
      "Programming",
      "Data Structures",
      "Algorithms",
      "Database Management Systems",
      "Computer Vision",
      "Electronics",
      "Mathematics",
      "Computer Science fundamentals",
    ],
    achievements: [],
    certifications: [],
  },
];

/** Experience timeline. Leave empty until there is real experience to list. */
export const experience: ExperienceEntry[] = [];

export const experienceFallback =
  "Currently building experience through academic projects, hands-on technical work and continuous learning.";
