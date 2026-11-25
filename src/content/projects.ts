import skillbridgeCover from "@/assets/project-skillbridge.jpg";
import campusmateCover from "@/assets/project-campusmate.jpg";
import carnotCover from "@/assets/project-carnot.jpg";
import embeddedCover from "@/assets/project-embedded.jpg";
import type { Project } from "./types";

/**
 * Projects. Add a new object to this array to publish a new project —
 * the gallery, filters, terminal and detail page all read from here.
 *
 * Rules: set `status` honestly (Concept / In Progress / Completed / Published),
 * leave `githubUrl` / `liveUrl` empty until they exist, and replace concept visuals
 * with real screenshots when you have them.
 */
export const projects: Project[] = [
  {
    slug: "skillbridge",
    number: "01",
    title: "SkillBridge",
    category: "Web Application / Career Technology",
    status: "In Progress",
    summary:
      "A skill-matching and career opportunity platform designed to connect students, recruiters and colleges.",
    tags: ["Web Application", "Career Tech", "Skill Mapping", "Multi-portal"],
    cover: { src: skillbridgeCover, alt: "Concept dashboard for SkillBridge showing a skill profile and opportunity list", isConceptVisual: true },
    overview:
      "SkillBridge is a platform concept that brings students, recruiters and colleges into one place, matching students to internships and jobs based on the skills they can demonstrate.",
    problem:
      "Students often struggle to show what they can actually do, recruiters find it hard to discover the right early-career talent, and colleges lack a clear view of how their students' skills line up with industry needs.",
    objective:
      "Create a shared space where skills are assessed, mapped and matched to real opportunities — giving each group a portal designed for its own needs.",
    solution:
      "Three dedicated portals (student, recruiter, college) built around a common skill model. Students take assessments and build a skill map; recruiters post opportunities that are matched against those skills; colleges track readiness and run industry learning programs.",
    features: [
      "Student portal",
      "Recruiter portal",
      "College portal",
      "Skill assessment",
      "Skill mapping",
      "Internship and job opportunities",
      "Industry learning programs",
    ],
    stack: [],
    architecture: [
      "Role-based portals for students, recruiters and colleges",
      "Shared skill model linking assessments, profiles and opportunities",
      "Matching layer comparing student skill maps with opportunity requirements",
    ],
    contribution: "",
    challenges: [],
    futureImprovements: [],
    screenshots: [],
    githubUrl: "",
    liveUrl: "",
  },
  {
    slug: "campusmate",
    number: "02",
    title: "CampusMate",
    category: "Academic Management Platform",
    status: "Concept",
    summary:
      "A centralised academic life management platform concept designed to improve coordination between students, faculty and management.",
    tags: ["Platform Concept", "Education", "Multi-portal"],
    cover: { src: campusmateCover, alt: "Concept interface for CampusMate with a timetable and assignment tracker", isConceptVisual: true },
    overview:
      "CampusMate is a concept for one central place where the day-to-day academic life of a campus is organised — schedules, assignments and coordination between everyone involved.",
    problem:
      "Academic information is usually scattered across notice boards, messaging groups and separate tools, which makes coordination between students, faculty and management slow and error-prone.",
    objective:
      "Design a single platform that keeps students, faculty and management aligned on academic activities and deadlines.",
    solution:
      "Separate portals for students, faculty and management on top of shared academic data, with assignment tracking and activity management connecting them.",
    features: [
      "Student portal",
      "Faculty portal",
      "Management portal",
      "Academic activity management",
      "Assignment tracking",
      "Academic coordination",
    ],
    stack: [],
    architecture: [
      "Three role-based portals: student, faculty and management",
      "Shared academic data for activities, assignments and schedules",
    ],
    contribution: "",
    challenges: [],
    futureImprovements: [],
    screenshots: [],
    githubUrl: "",
    liveUrl: "",
  },
  {
    slug: "carnot-engine",
    number: "03",
    title: "Carnot Engine Interactive Website",
    category: "Educational Technology / Web Development",
    status: "In Progress",
    summary:
      "An interactive thermodynamics learning website that explains the Carnot engine through visual simulations.",
    tags: ["HTML", "CSS", "JavaScript", "Simulation", "EdTech"],
    cover: { src: carnotCover, alt: "Concept interface showing a Carnot engine animation and P-V diagram", isConceptVisual: true },
    overview:
      "A learning website that turns the Carnot cycle from a static textbook diagram into something you can watch and control.",
    problem:
      "Thermodynamic cycles are hard to picture from equations and static diagrams alone — it is not obvious how pressure, volume and temperature change through each stage.",
    objective:
      "Explain the Carnot engine visually, so each stage of the cycle and its effect on efficiency can be explored interactively.",
    solution:
      "An animated engine paired with a live P-V diagram, stage-by-stage explanations of isothermal and adiabatic processes, and an efficiency calculator driven by interactive controls.",
    features: [
      "Carnot engine animation",
      "P-V diagram",
      "Isothermal expansion",
      "Adiabatic expansion",
      "Thermodynamic cycle visualisation",
      "Efficiency calculator",
      "Interactive controls",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    architecture: [
      "Animation layer for the piston and cycle stages",
      "Diagram layer plotting the P-V cycle",
      "Calculator computing efficiency from reservoir temperatures (η = 1 − Tc / Th)",
    ],
    contribution: "",
    challenges: [],
    futureImprovements: [],
    screenshots: [],
    githubUrl: "",
    liveUrl: "",
  },
  {
    slug: "embedded-systems",
    number: "04",
    title: "Embedded Systems & Electronics",
    category: "Hardware / Embedded Systems",
    status: "In Progress",
    summary:
      "A collection of electronics and microcontroller experiments involving Arduino and Raspberry Pi Pico.",
    tags: ["Arduino UNO", "Raspberry Pi Pico", "I2C", "PWM"],
    cover: { src: embeddedCover, alt: "Electronics workbench with microcontroller boards, an LCD and a DC motor", isConceptVisual: true },
    overview:
      "A growing set of hands-on experiments exploring how software controls physical hardware through microcontrollers.",
    problem:
      "Understanding embedded systems requires going beyond theory — wiring real components and seeing how code drives them.",
    objective:
      "Build practical familiarity with common peripherals, communication protocols and motor control.",
    solution:
      "Individual experiments, each focused on one interfacing technique, using Arduino UNO and Raspberry Pi Pico.",
    features: [
      "LCD interfacing",
      "Servo motor control",
      "IR remote interfacing",
      "DC motor PWM control",
      "I2C communication",
    ],
    stack: ["Arduino UNO", "Raspberry Pi Pico"],
    architecture: [],
    contribution: "",
    challenges: [],
    futureImprovements: [],
    screenshots: [],
    githubUrl: "",
    liveUrl: "",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
