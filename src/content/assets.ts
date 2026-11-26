import aboutArtwork from "@/assets/about-artwork.jpg";
import collageHardware from "@/assets/collage-hardware.jpg";
import collageInterface from "@/assets/collage-interface.jpg";
import collageMonogram from "@/assets/collage-monogram.jpg";
import collageWorkspace from "@/assets/collage-workspace.jpg";
import projectCampusmate from "@/assets/project-campusmate.jpg";
import projectCarnot from "@/assets/project-carnot.jpg";
import projectEmbedded from "@/assets/project-embedded.jpg";
import projectSkillbridge from "@/assets/project-skillbridge.jpg";
import scenicBg from "@/assets/scenic-bg.jpg";

/**
 * Images shipped with the site. Stored content refers to them as "asset:<name>";
 * anything uploaded through the admin dashboard is a storage path instead.
 */
export const bundledAssets: Record<string, string> = {
  "about-artwork": aboutArtwork,
  "collage-hardware": collageHardware,
  "collage-interface": collageInterface,
  "collage-monogram": collageMonogram,
  "collage-workspace": collageWorkspace,
  "project-campusmate": projectCampusmate,
  "project-carnot": projectCarnot,
  "project-embedded": projectEmbedded,
  "project-skillbridge": projectSkillbridge,
  "scenic-bg": scenicBg,
};

export const BUNDLED_PREFIX = "asset:";

export function bundledAsset(path: string | null | undefined): string | undefined {
  if (!path || !path.startsWith(BUNDLED_PREFIX)) return undefined;
  return bundledAssets[path.slice(BUNDLED_PREFIX.length)];
}
