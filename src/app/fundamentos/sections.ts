/**
 * Las secciones del documento, en orden y agrupadas como los capítulos de un manual.
 * El índice lateral las lista con su numeral; el grupo es solo un rótulo, no un ítem navegable.
 */
export const sections = [
  { id: "principio", title: "Principio", group: "El sistema" },
  { id: "tipografia", title: "Tipografía", group: "El sistema" },
  { id: "escala", title: "Escala y roles", group: "El sistema" },
  { id: "color", title: "Color", group: "El sistema" },
  { id: "grilla", title: "Grilla", group: "El sistema" },
  { id: "ritmo", title: "Ritmo y cortes", group: "El sistema" },
  { id: "signo", title: "El signo +", group: "La marca" },
  { id: "movimiento", title: "Movimiento", group: "La marca" },
  { id: "responsive", title: "Celular", group: "La marca" },
  { id: "aplicaciones", title: "Aplicaciones", group: "El estado" },
  { id: "estado", title: "Estado y pendientes", group: "El estado" },
] as const;

export type Section = (typeof sections)[number];

export const num = (i: number) => String(i + 1).padStart(2, "0");

/** Las secciones agrupadas, preservando el índice global de cada una (para el numeral). */
export const grouped = sections.reduce<{ group: string; items: { section: Section; index: number }[] }[]>(
  (acc, section, index) => {
    const last = acc[acc.length - 1];
    if (last && last.group === section.group) last.items.push({ section, index });
    else acc.push({ group: section.group, items: [{ section, index }] });
    return acc;
  },
  [],
);
