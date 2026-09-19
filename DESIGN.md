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
| `display` | clamp(2.75rem, 8vw, 7.5rem) | 0.9 | −0.035em | Título de página de sección (Estudio) |
| `title` | clamp(2.25rem, 5.5vw, 5rem) | 0.96 | −0.03em | Nombre de proyecto, título de listado, menú móvil, numerales de etapas |
| `heading` | clamp(1.75rem, 4.2vw, 4rem) | 1.05 | −0.015em | Títulos de sección y frases (statements) |
| `subheading` | clamp(1.15rem, 1.9vw, 1.6rem) | 1.15 | −0.01em | Filas del índice, equipo, datos grandes, CTA "+" |
| `lead` | clamp(1.05rem, 1.3vw, 1.25rem) | 1.3 | 0 | Intros, nombres en tarjetas, filtros |
| `body` | 1rem | 1.6 | 0 | *450* | Texto de proyecto y estudio (máx. 60ch) |
| `meta` | 0.875rem | 1.4 | 0 | *500* | Datos: programa, lugar, enlaces chicos |
| `label` | 0.75rem | 1.3 | 0.02em | *500* | Rótulos de datos, encabezados de tabla |

- Los tokens viven en `src/app/globals.css` (`@theme`). Prohibido `text-[clamp(...)]` suelto; la única excepción es el wordmark SVG y el "+" gráfico.
- Saltos obvios entre pasos: display ≈ 1.9× title ≈ 1.25× heading ≈ 2.5× subheading.
- **Peso:** los textos grandes van en 400; los chicos (`body` 450, `meta` y `label` 500) van más negros. En tamaño chico el regular se deshilacha y pierde el carácter editorial.
- **Mayúsculas:** solo en `label` (rótulos, eyebrows del spread). Los textos grandes van siempre en caja baja.
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
- **Ningún texto pasa por encima de una línea.** En mobile la cruz de Contacto, del pie y del 404 pierde la vertical (los textos ocupan todo el ancho) y el correo va de margen a margen; en el pie la horizontal entra en el flujo, entre la frase y el correo.
- Regla de 4 [L08]: 4 destacados, 4 ítems de nav, 3 filtros + Todos, 4 etapas, 4 datos por proyecto.
- Palancas coherentes: lo más grande es siempre lo más oscuro; los datos secundarios bajan a `graphite`.

### Nota editorial (`EditorialNote`)
Banda `fog` **compacta**: rótulo en mayúscula en las columnas 1–3, foto chica debajo en esas mismas columnas y texto en las 5–9, hombro con hombro y los dos arrancando arriba. Cierra una foto a sangre de `62svh`, pegada a la banda. El bloque entra casi entero en una pantalla.
- Los separadores van en **rem o clamp con tope en rem**, nunca en `vh` suelto: con `vh` la banda se estira en monitores altos y el bloque pierde la compacidad, que es lo que le da el aire de página impresa.
- El carácter lo da el **contraste de cuerpos**: una línea en `heading` y el resto en `body`, sin tamaños intermedios.
- Se usa en el detalle de proyecto. En la home ya no va: se sacó la sección "El oficio".

### Cómo trabajamos (`HowWeWork`, página propia)
Vista entera en `/como-trabajamos`, cuarto ítem de la nav. **No abre con título:** abre con una frase
de marca en `heading` (columnas 1–9), como la última línea de una tapa. El título de la página vive
solo en los metadatos y en la nav.

Debajo, las cuatro etapas: cada una ocupa una fila de la grilla con el rótulo en las columnas 1–3, el
texto en las 4–6 y la obra en las 8–12, a `100svh` y pegada a la de arriba y a la de abajo.
- **Las obras no se mueven**: nada de parallax ni de cruces, se scrollean como una foto.
- **El texto es lo que se fija:** el rótulo de cada etapa se clava arriba y se queda, de manera que
  los cuatro se van apilando (cada uno un escalón más abajo); el párrafo acompaña a su obra y se
  suelta cuando entra la siguiente.
- Rótulo en `meta` y `graphite` (`Etapa 01`), título de etapa en `lead` a **500** y en `ink`: la
  columna es un índice, no un titular, y en ese cuerpo el regular se deshilacha (misma razón que
  `body` 450 y `meta` 500 en §2).
- Se hace con pines de ScrollTrigger (`motion.work`), **no** con `position: sticky`: con
  ScrollSmoother la página no scrollea de verdad y el sticky nunca se dispara.
- Solo en escritorio. En mobile no se fija nada: rótulo, texto y obra, uno debajo del otro.
- Cada etapa se ilustra con una obra distinta, siempre de las carpetas en alta (≥ 2400 px).

### Doble página (`Spread`)
Patrón editorial de catálogo, usado en Estudio y en Proyectos: obra a sangre en la mitad izquierda, índice numerado a la derecha con guía punteada y numeral tabular, y una foto chica que cierra abajo alineada al borde derecho. Los dos rótulos (sobre la foto y sobre el índice) van en `label` y en mayúscula; todo lo demás, en caja baja.

## 6. Imágenes
- Toda foto es **obra real del estudio**. Nada de renders genéricos ni IA (se eliminó `villa.png`).
- **Wireframe:** mientras falte la foto, `Media` dibuja un bloque liso en el tono del proyecto con el rótulo encima. Cuando exista, la reemplaza sola. Sin rectángulo cruzado: el aspa competía con la composición y ensuciaba el hero.
- **Parallax:** las capas con `speed="auto"` sobresalen 22% en el eje del movimiento (`bleed`). Con menos, el recorrido destapa el borde del marco y las marcas "+" quedan separadas del vértice visible.
- **Importar fotos** desde el repo de la web anterior (`bmtarq`): `node scripts/import-photos.mjs ../bmtarq`. Copia originales sin recomprimir a `public/obras/<slug>/NN.jpg`, regenera `src/components/site/photos.ts` y avisa las fotos de menos de 1600 px de ancho.
- **Grano:** `Media` con `grain` pone una capa de ruido finísima sobre la foto (`overlay`, 7%), para
  sacarle el brillo digital. Si se llega a *ver* el grano, está mal calibrada. Hoy se usa en las
  obras de "Cómo trabajamos".
- **Nitidez:** portada y hero ≥ 2400 px de ancho; galería ≥ 1600 px. Si la web anterior solo tiene versiones chicas, pedir originales al estudio antes de publicar.

## 7. Responsive [L10]
Desktop desde 1500 px, escalado fijo hasta el breakpoint `md` (768 px), donde la nav colapsa a "Menú". En mobile, la foto del hero espera a la mitad del alto de pantalla (ancho del card menos márgenes) y el botón "Menú" entra recién con el logo chico, al abrirse la foto. Mobile a 4 columnas, todo en una columna. Textos chicos y nav no crecen sin límite en pantallas grandes (tokens con `clamp`).

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
- [ ] Solo tokens `text-*`; ningún `font-light`; mayúsculas solo en `label`.
- [ ] Ningún gris fuera de la paleta.
- [ ] Cada sección tiene rótulo o borde y el ritmo alterna contenido y corte.
- [ ] Máximo 4 ítems por grupo visible.
- [ ] Revisado a 1500, 1024, 768 y 390 px.
