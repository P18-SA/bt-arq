import type { ReactNode } from "react";
import { Header } from "./Header";
import SiteMotion from "./SiteMotion";
import { wordmark } from "./wordmark";

type Props = {
  children: ReactNode;
  /** Elementos fijos extra (fuera del scroll suave) */
  fixed?: ReactNode;
  /** Solo la home: el header espera a la intro del hero */
  intro?: boolean;
  smooth?: boolean;
};

/** Estructura común de cada página: header, scroll suave y animaciones. */
export function Shell({ children, fixed, intro = false, smooth = true }: Props) {
  return (
    <SiteMotion
      smooth={smooth}
      fixed={
        <>
          <Header words={wordmark} intro={intro} />
          {fixed}
        </>
      }
    >
      <div className="relative bg-paper">{children}</div>
    </SiteMotion>
  );
}
