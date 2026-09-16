# DESIGN.md — Berthet + Taranto Arquitectas

Sistema de diseño del sitio. Aplica el curso *Typography in Web Design* (skills `tfs-editorial-design`, `tfs-editorial-review`, `tfs-editorial-project`). Toda UI nueva usa estos tokens y patrones; si algo no encaja, se discute y se actualiza este archivo, no se improvisa en el componente.

## 1. Historia de la página
Tres décadas de obra construida en Uruguay, contadas con la calma de un catálogo de arquitectura: la obra habla, el texto acompaña. **Periodismo visual:** cada página narra obras concretas, no promete estilo.

- **Marca:** Berthet + Taranto Arquitectas. Estudio desde 1995, Montevideo.
- **Personalidad:** sobria, precisa, cálida sin decoración, segura de su trayectoria. *Somos un estudio con obra, no una agencia de tendencias.*
- **Audiencia:** familias y empresas que encargan vivienda, reformas u oficinas de alto nivel en Montevideo y la costa.

## 2. Tipografía [L02]
Una sola familia, **ABC Areal** (variable 400–700). Rol único para cada estilo; no se agrega otra fuente sin rol nuevo y justificado. No existe peso light: nunca `font-light`.

| Token (`text-*`) | Tamaño | LH | Tracking | Uso |
|---|---|---|---|---|
| `display` | clamp(3.25rem, 12.5vw, 15rem) | 0.9 | −0.035em | Título de página de sección (Estudio) |
| `title` | clamp(2.5rem, 7.5vw, 9.5rem) | 0.96 | −0.03em | Nombre de proyecto, título de listado, menú móvil, numerales de etapas |
| `heading` | clamp(1.75rem, 4.2vw, 4.25rem) | 1.05 | −0.015em | Títulos de sección y frases (statements) |
| `subheading` | clamp(1.3rem, 2.4vw, 2.25rem) | 1.15 | −0.01em | Filas del índice, equipo, datos grandes, CTA "+" |
| `lead` | clamp(1.1rem, 1.6vw, 1.45rem) | 1.3 | 0 | Intros, nombres en tarjetas, filtros |
| `body` | 1rem | 1.6 | 0 | Texto de proyecto y estudio (máx. 60ch) |
| `meta` | 0.875rem | 1.4 | 0 | Datos: programa, lugar, enlaces chicos |
| `label` | 0.75rem | 1.3 | 0.02em | Rótulos de datos, encabezados de tabla |

- Los tokens viven en `src/app/globals.css` (`@theme`). Prohibido `text-[clamp(...)]` suelto; la única excepción es el wordmark SVG y el "+" gráfico.
- Saltos obvios entre pasos: display ≈ 1.7× title ≈ 1.8× heading ≈ 1.9× subheading.
- **Recursos editoriales:** paréntesis para información secundaria sin cambiar color: `(Estudio)`, `(04)`, `(11 fotos)`. Numerales tabulares `01 … 23` como sistema de índice.

## 3. Grilla [L03]
- 12 columnas en desktop, 4 en mobile; margen y gutter = `--gutter` (clamp(1rem, 3vw, 2.75rem)).
- Rótulo de sección en columnas 1–3 y contenido en columnas 4–12 (patrón *label + cuerpo*).
- Composiciones asimétricas deliberadas (Featured, galería): se permiten desfasajes verticales y salidas del grid en imágenes full-bleed.

## 4. Color
`paper #fff` · `ink #000` · `fog #ebeae6` · `concrete #cfcdc7` · `graphite #5e5d59` · `shadow #3b3a37`.
Dos tonos más neutros cálidos, **sin acento**: la jerarquía se consigue con escala, espacio y posición [L04, L05]. No hay más grises que estos; un gris nuevo es un error.

## 5. Jerarquía, ritmo y cortes [L01, L05]
Secuencia de la home: **Hero** (obra + marca) → **Proyectos seleccionados (4)** → **corte de banda `fog` a ancho completo** (estudio en una frase + datos) → **Índice numerado (8 + ver todos)** → **Contacto negro** (corte final).
- Cada cambio de sección tiene un borde: línea `border-ink`, banda de color o bloque negro.
- Regla de 4 [L08]: 4 destacados, 3 ítems de nav, 3 filtros + Todos, 3 etapas, 4 datos por proyecto.
- Palancas coherentes: lo más grande es siempre lo más oscuro; los datos secundarios bajan a `graphite`.

## 6. Imágenes
- Toda foto es **obra real del estudio**. Nada de renders genéricos ni IA (se eliminó `villa.png`).
- **Wireframe:** mientras falte la foto, `Media` dibuja el rectángulo cruzado con el rótulo, en el tono del proyecto. Cuando exista, la reemplaza sola.
- **Importar fotos** desde el repo de la web anterior (`bmtarq`): `node scripts/import-photos.mjs ../bmtarq`. Copia originales sin recomprimir a `public/obras/<slug>/NN.jpg`, regenera `src/components/site/photos.ts` y avisa las fotos de menos de 1600 px de ancho.
- **Nitidez:** portada y hero ≥ 2400 px de ancho; galería ≥ 1600 px. Si la web anterior solo tiene versiones chicas, pedir originales al estudio antes de publicar.

## 7. Responsive [L10]
Desktop desde 1500 px, escalado fijo hasta el breakpoint `md` (768 px), donde la nav colapsa a "Menú". Mobile a 4 columnas, todo en una columna. Textos chicos y nav no crecen sin límite en pantallas grandes (tokens con `clamp`).

## 8. Movimiento
Lo gestiona `SiteMotion` (GSAP + ScrollSmoother). Respeta `prefers-reduced-motion`. No agregar animaciones fuera de `motion.ts`.

## 9. Contenido
Fuente: web anterior `bmtarquitectas.uy` (archivo 2023) en `src/components/site/content.ts`. Los campos `null` se muestran como **pendientes** (borde punteado) y deben completarse antes de publicar.

### Pendientes para el cliente
- [ ] Fotos originales en alta de las 23 obras (o acceso a `bmtarq`).
- [ ] Textos de 11 obras sin descripción recuperada.
- [ ] Años de cada obra (la web anterior no los publicaba).
- [ ] Confirmar teléfono 2622 0558 y dirección en Edificio Yacht Club.
- [ ] Confirmar usuario de Instagram (hoy `berthet-taranto`; el anterior era `berthet_mendez_taranto`).
- [ ] Confirmar cómo contar la historia de 1995 (el estudio nació con tres socias).
- [ ] Retratos de las socias y foto del edificio para la tarjeta de ubicación.

## 10. Checklist antes de dar por terminada una página
Correr `tfs-editorial-review`, más:
- [ ] Solo tokens `text-*`; ningún `font-light`.
- [ ] Ningún gris fuera de la paleta.
- [ ] Cada sección tiene rótulo o borde y el ritmo alterna contenido y corte.
- [ ] Máximo 4 ítems por grupo visible.
- [ ] Revisado a 1500, 1024, 768 y 390 px.
