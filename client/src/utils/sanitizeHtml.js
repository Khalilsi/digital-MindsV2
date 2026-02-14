/**
 * Lightweight HTML sanitiser.
 *
 * Keeps only safe formatting tags (bold, italic, underline, strike,
 * line‑breaks, paragraphs, lists, links) and removes everything else
 * (script, iframe, style, event attributes, etc.).
 *
 * Usage:
 *   import { sanitizeHtml, stripHtml } from "../utils/sanitizeHtml";
 *   const safe  = sanitizeHtml(dirtyHtml);   // keeps formatting
 *   const plain = stripHtml(dirtyHtml);       // pure text, no tags
 */

const ALLOWED_TAGS = new Set([
  "b",
  "strong",
  "i",
  "em",
  "u",
  "s",
  "strike",
  "br",
  "p",
  "ul",
  "ol",
  "li",
  "a",
  "span",
  "sub",
  "sup",
  "pre",
  "code",
  "blockquote",
  "h1",
  "h2",
  "h3",
]);

const ALLOWED_ATTRS = {
  a: new Set(["href", "target", "rel"]),
  span: new Set(["style"]),
};

/**
 * Remove all HTML tags except the safe formatting ones listed above.
 * Also strips event‑handler attributes (onclick, onerror …) from kept tags.
 */
export function sanitizeHtml(html = "") {
  if (!html) return "";

  // Remove <script>, <style>, <iframe> blocks entirely (tag + content)
  let clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "");

  // Process remaining tags – keep allowed, strip the rest
  clean = clean.replace(
    /<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi,
    (match, tag, attrs) => {
      const lower = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(lower)) return ""; // strip tag entirely

      // Strip dangerous attributes (on*, javascript: …)
      const allowedSet = ALLOWED_ATTRS[lower];
      const safeAttrs = (attrs || "").replace(
        /\s([a-z\-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,
        (attrMatch, name, value) => {
          const n = name.toLowerCase();
          if (n.startsWith("on")) return ""; // event handler
          if (/javascript:/i.test(value)) return ""; // js in attr value
          if (allowedSet && !allowedSet.has(n)) return ""; // not in whitelist
          if (!allowedSet) return ""; // tag has no allowed attrs
          return attrMatch;
        },
      );

      // Rebuild the tag
      const isClosing = match.startsWith("</");
      if (isClosing) return `</${lower}>`;
      const selfClosing = lower === "br" ? " /" : "";
      return `<${lower}${safeAttrs}${selfClosing}>`;
    },
  );

  return clean.trim();
}

/**
 * Strip ALL html tags – returns pure text.
 * Useful for previews, validation length checks, etc.
 */
export function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, "");
}
