import { readFileSync } from "node:fs";
import path from "node:path";
import type { WordSvg } from "./Word";

/** Lee un SVG de /public en el build y devuelve su viewBox y contenido, para dibujarlo inline con currentColor. */
function load(name: string): WordSvg {
  const raw = readFileSync(path.join(process.cwd(), "public", `${name}.svg`), "utf8");
  const svg = raw.slice(raw.indexOf("<svg"));
  const [, , w, h] = /viewBox="([^"]+)"/.exec(svg)![1].trim().split(/[\s,]+/).map(Number);
  const inner = svg.slice(svg.indexOf(">") + 1, svg.lastIndexOf("</svg>")).trim();
  return { w, h, inner: wrapGlyphs(inner) };
}

/**
 * Envuelve cada letra (los <g> hijos del grupo principal) en un <g data-glyph> sin transform.
 * Así GSAP puede moverlas sin reescribir las matrices que trae el SVG exportado.
 */
function wrapGlyphs(markup: string) {
  let depth = 0;
  return markup.replace(/<g(?:\s[^>]*)?>|<\/g>/g, (tag) => {
    if (tag === "</g>") {
      depth--;
      return depth === 1 ? "</g></g>" : tag;
    }
    depth++;
    return depth === 2 ? `<g data-glyph>${tag}` : tag;
  });
}

export const wordmark = {
  berthet: load("BERTHET"),
  taranto: load("TARANTO"),
  arquitectas: load("ARQUITECTAS"),
};
