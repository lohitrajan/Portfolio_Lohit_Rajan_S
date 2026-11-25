import type { ResumeContent } from "./types";

/**
 * Resume. To publish: add the PDF to /public/resume/ and set `fileUrl`
 * (e.g. "/resume/lohit-rajan-s.pdf"), `lastUpdated` and `version`.
 * Add an entry to `history` each time you replace it.
 */
export const resume: ResumeContent = {
  fileUrl: "",
  lastUpdated: "",
  version: "",
  history: [],
};
