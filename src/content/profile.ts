import type { AboutContent, Profile } from "./types";

/** Neutral introductory copy while personal details have not been published. */
export const unpublishedCopy = {
  heroHeadline: { muted: "Curiosity Creates.", strong: "Code Makes It Real." },
  heroDescription: "Projects, ideas and learning — more details coming soon.",
  aboutHeading: "More Than Just Code.",
  exploringHeading: "Currently Exploring.",
  signature: { muted: "Designed with curiosity.", strong: "Built with code." },
} satisfies {
  heroHeadline: Profile["heroHeadline"];
  heroDescription: string;
  aboutHeading: string;
  exploringHeading: string;
  signature: Profile["signature"];
};

/**
 * Personal profile. Edit freely — this is the single source for name, links and intro copy.
 * Fill in `email`, `location` and social URLs when you are ready to publish them.
 */
export const profile: Profile = {
  name: "Lohit Rajan S",
  initials: "LS",
  roles: ["Software Developer", "Computer Science Student", "Problem Solver"],
  institution: "Amrita Vishwa Vidyapeetham",
  tagline: "Turning Ideas Into Meaningful Digital Experiences.",
  shortIntro:
    "I'm Lohit Rajan S, a computer science student passionate about technology, software development, problem-solving and building practical digital solutions.",
  heroPills: ["Software Developer", "Always Building Something"],
  heroHeadline: { muted: "Curiosity Creates.", strong: "Code Makes It Real." },
  heroDescription:
    "I'm Lohit Rajan S, a computer science student exploring software development, technology and creative problem-solving. I enjoy turning ideas into practical digital experiences.",
  availability: { open: true, label: "Open to Internship & Professional Opportunities" },
  location: "",
  email: "",
  socials: [
    { platform: "github", label: "GitHub", url: "" },
    { platform: "linkedin", label: "LinkedIn", url: "" },
  ],
  footerStatement:
    "A computer science student turning curiosity into practical, well-built software — one problem at a time.",
  signature: { muted: "Designed with curiosity.", strong: "Built with code." },
};

export const about: AboutContent = {
  heading: "More Than Just Code.",
  paragraphs: [
    "I'm a computer science student with a strong interest in technology, software development and problem-solving.",
    "My learning journey involves exploring programming languages, understanding core computer science concepts, developing web applications and experimenting with practical technical projects.",
    "I enjoy breaking complex problems into smaller parts, understanding how systems work and transforming concepts into functional implementations.",
    "I'm continuously improving my technical knowledge through hands-on development, coding practice and academic learning.",
  ],
  interests: [
    "Software development",
    "Web development",
    "Practical applications",
    "Problem-solving",
    "Embedded systems",
  ],
  philosophy: [
    "Learn by implementing, not just reading.",
    "Break big problems into small, solvable parts.",
    "Experiment, measure, iterate.",
  ],
  currentFocus: "Data Structures & Algorithms and full-stack web development",
  highlights: [
    { label: "Status", value: "Computer Science Student" },
    { label: "Institution", value: "Amrita Vishwa Vidyapeetham" },
    { label: "Technical interests", value: "Software & web development, DSA, embedded systems" },
    { label: "Career interests", value: "Software engineering" },
    { label: "Location", value: "" },
    { label: "Personal interests", value: "" },
  ],
};
