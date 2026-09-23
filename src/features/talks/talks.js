import { siteContent } from "../../content/site.mdx";

export const { talks } = siteContent;

export function findTalkSlug(path) {
  return Object.keys(talks).find((slug) => talks[slug].path === path);
}
