import type { SkillCategory } from "./types";

/**
 * Skills grouped by category. No proficiency percentages by design —
 * each `note` describes how the skill has actually been used.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    label: "Programming Languages",
    code: "A",
    description: "The languages I write and practise problems in.",
    items: [
      { name: "C", note: "Core programming fundamentals, pointers and problem-solving practice." },
      { name: "Java", note: "Object-oriented programming and data-structure implementations." },
      { name: "Python", note: "Scripting, problem-solving and computer-vision experiments." },
    ],
  },
  {
    id: "web",
    label: "Web Development",
    code: "B",
    description: "Building interfaces and interactive pages for the browser.",
    items: [
      { name: "HTML", note: "Semantic page structure for web projects." },
      { name: "CSS", note: "Layouts, styling and animation for interactive pages." },
      { name: "JavaScript", note: "Interactivity, simulations and DOM logic — used in the Carnot engine site." },
    ],
  },
  {
    id: "database",
    label: "Database Management",
    code: "C",
    description: "Modelling and querying structured data.",
    items: [{ name: "MySQL", note: "Relational schema design and SQL queries as part of DBMS learning." }],
  },
  {
    id: "tools",
    label: "Development Tools",
    code: "D",
    description: "The everyday workflow behind my code.",
    items: [
      { name: "Visual Studio Code", note: "Primary editor for all coursework and projects." },
      { name: "Git", note: "Version control for tracking project changes." },
      { name: "GitHub", note: "Hosting and sharing code repositories." },
    ],
  },
  {
    id: "hardware",
    label: "Electronics & Hardware",
    code: "E",
    description: "Hands-on microcontroller and interfacing experiments.",
    items: [
      { name: "Arduino UNO", note: "Microcontroller experiments with sensors, displays and motors." },
      { name: "Raspberry Pi Pico", note: "Microcontroller programming and peripheral interfacing." },
      { name: "LCD interfacing", note: "Driving character LCD displays for output." },
      { name: "Servo motor interfacing", note: "Angle control of servo motors." },
      { name: "IR remote interfacing", note: "Decoding IR remote signals as input." },
      { name: "DC motor control", note: "Speed control of DC motors using PWM." },
      { name: "I2C communication", note: "Connecting peripherals over the I2C bus." },
    ],
  },
  {
    id: "software",
    label: "Technical Software",
    code: "F",
    description: "Tools for computation, design and 3D.",
    items: [
      { name: "MATLAB", note: "Numerical computation and technical simulation." },
      { name: "Fusion 360", note: "3D CAD modelling." },
      { name: "Blender", note: "3D modelling and rendering." },
    ],
  },
  {
    id: "core",
    label: "Core Computer Science",
    code: "G",
    description: "The fundamentals I study and apply.",
    items: [
      { name: "Data Structures & Algorithms", note: "Ongoing study and regular problem practice." },
      { name: "Object-Oriented Programming", note: "Classes, inheritance and design in Java." },
      { name: "Database Management Systems", note: "Relational models, normalisation and SQL." },
      { name: "Sorting & Searching", note: "Implementing and comparing classic algorithms." },
      { name: "Recursion", note: "Recursive problem decomposition." },
      { name: "Trees & Graphs", note: "BSTs, AVL trees and graph traversal." },
      { name: "Computer Vision", note: "Exploring image-processing concepts." },
      { name: "Thermodynamic simulation", note: "Visualising thermodynamic cycles — the Carnot engine project." },
    ],
  },
];
