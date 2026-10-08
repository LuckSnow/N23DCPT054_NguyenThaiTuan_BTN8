import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="auth-shell">
      <section className="auth-visual" aria-label="Nexus Social Network">
        <Image
          className="auth-background-image"
          src="/background.png"
          alt="Nexus Social Network"
          fill
          priority
          sizes="(max-width: 760px) 100vw, 64vw"
        />

        <div className="auth-logo" aria-hidden="true">
          <Image
            className="auth-logo-image"
            src="/icon.png"
            alt=""
            fill
            priority
            sizes="72px"
          />
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card" aria-labelledby="auth-title">
          {children}
        </div>
      </section>
    </main>
  );
}
