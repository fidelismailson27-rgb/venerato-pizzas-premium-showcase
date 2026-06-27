import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/venerato-logo.png.asset.json";
import heroPizza from "@/assets/hero-pizza.jpg";
import { getSiteContent } from "@/lib/site-content.functions";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Venerato Pizzas — Pizzaria Premium em São Paulo e Taboão da Serra" },
      {
        name: "description",
        content:
          "Muito recheio, ingredientes selecionados e sabor de verdade. Peça sua pizza Venerato em Campo Limpo e Taboão da Serra.",
      },
      { property: "og:title", content: "Venerato Pizzas — Sabor que conquista" },
      { property: "og:description", content: "Pizzaria premium em São Paulo e Taboão. Faça seu pedido agora." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: logoAsset.url },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0F1115" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "icon", href: logoAsset.url },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;800;900&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "preload", as: "image", href: heroPizza, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Venerato Pizzas",
          servesCuisine: "Pizza",
          image: logoAsset.url,
          url: "/",
          sameAs: ["https://instagram.com/veneratopizzas"],
          address: [
            {
              "@type": "PostalAddress",
              streetAddress: "Rua Eliane de Araújo Neves, 90",
              addressLocality: "São Paulo",
              addressRegion: "SP",
              addressCountry: "BR",
            },
            {
              "@type": "PostalAddress",
              streetAddress: "Avenida Embaixador Assis Chateaubriand, 437",
              addressLocality: "Taboão da Serra",
              addressRegion: "SP",
              addressCountry: "BR",
            },
          ],
        }),
      },
    ],
  }),
  loader: () => getSiteContent(),
  component: Home,
});

function ExtLink({ href, className, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
    </a>
  );
}

function Home() {
  const initial = Route.useLoaderData() as SiteContent;
  const [c, setC] = useState<SiteContent>(initial ?? DEFAULT_CONTENT);

  // Re-fetch on client mount so admins see edits without a hard refresh.
  useEffect(() => { setC(initial); }, [initial]);

  return (
    <div className="relative">
      <Navbar c={c} />
      <Hero c={c} />
      {c.banner.enabled && <BannerPromo c={c} />}
      <Destaques c={c} />
      <Sobre c={c} />
      <Unidades c={c} />
      <CtaFinal c={c} />
      <Footer c={c} />
    </div>
  );
}

function Navbar({ c }: { c: SiteContent }) {
  return (
    <header className="fixed top-3 left-1/2 z-50 w-[min(96%,1100px)] -translate-x-1/2">
      <nav className="glass-strong flex items-center justify-between gap-3 rounded-full px-3 py-2 sm:px-5">
        <a href="#top" className="flex items-center gap-2 pl-1">
          <img src={c.logoUrl} alt="Venerato Pizzas" className="h-9 w-auto sm:h-10" />
        </a>
        <div className="hidden items-center gap-7 text-sm text-foreground/80 md:flex">
          <a href="#destaques" className="hover:text-gold transition-colors">Destaques</a>
          <a href="#sobre" className="hover:text-gold transition-colors">Sobre</a>
          <a href="#unidades" className="hover:text-gold transition-colors">Unidades</a>
          <ExtLink href={c.instagramUrl} className="hover:text-gold transition-colors">Instagram</ExtLink>
        </div>
        <ExtLink href={c.wabizUrl} className="btn-primary !px-4 !py-2 text-sm">
          Pedir agora
        </ExtLink>
      </nav>
    </header>
  );
}

function HeroMedia({ c }: { c: SiteContent }) {
  const [videoFailed, setVideoFailed] = useState(false);
  if (c.hero.mediaType === "video" && !videoFailed) {
    return (
      <video
        src={c.hero.mediaUrl}
        autoPlay
        muted
        loop
        playsInline
        poster={c.hero.fallbackImageUrl}
        onError={() => setVideoFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  const src = videoFailed ? c.hero.fallbackImageUrl : c.hero.mediaUrl;
  return (
    <img
      src={src}
      alt="Pizza artesanal Venerato"
      width={1920}
      height={1280}
      fetchPriority="high"
      onError={(e) => { (e.currentTarget as HTMLImageElement).src = c.hero.fallbackImageUrl; }}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

function Hero({ c }: { c: SiteContent }) {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <HeroMedia c={c} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(15,17,21,0.55) 0%, rgba(15,17,21,0.85) 60%, rgba(15,17,21,0.96) 100%)",
        }}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 text-center">
        <img src={c.logoUrl} alt="Venerato Pizzas" className="mb-6 h-28 w-auto drop-shadow-2xl sm:h-40 md:h-48" />
        <span className="mb-4 inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.2em] text-gold backdrop-blur">
          {c.hero.badge}
        </span>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] text-brand-cream sm:text-6xl md:text-7xl">
          {c.hero.title}{" "}
          <span className="bg-gradient-to-r from-[oklch(0.85_0.14_75)] to-[oklch(0.7_0.18_50)] bg-clip-text text-transparent">
            {c.hero.titleHighlight}
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-foreground/80 sm:text-lg">{c.hero.subtitle}</p>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
          <ExtLink href={c.wabizUrl} className="btn-primary">🍕 Fazer Pedido</ExtLink>
          <a href="#destaques" className="btn-secondary">Ver Cardápio</a>
          <ExtLink href={c.wabizUrl} className="btn-whatsapp">Pedir pelo WhatsApp</ExtLink>
        </div>
        <a href="#destaques" className="mt-14 text-xs uppercase tracking-[0.3em] text-foreground/50 hover:text-gold transition-colors">
          ↓ Veja os destaques
        </a>
      </div>
    </section>
  );
}

function BannerPromo({ c }: { c: SiteContent }) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-5xl px-5">
        <div
          className="glass-strong flex flex-col items-center gap-4 rounded-3xl p-8 text-center sm:flex-row sm:justify-between sm:text-left"
          style={{
            backgroundImage:
              "linear-gradient(135deg, color-mix(in oklab, var(--brand-red) 25%, transparent), color-mix(in oklab, var(--brand-gold) 20%, transparent))",
          }}
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">{c.banner.eyebrow}</span>
            <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">{c.banner.title}</h3>
            <p className="mt-1 text-foreground/80">{c.banner.subtitle}</p>
          </div>
          <ExtLink href={c.wabizUrl} className="btn-primary shrink-0">{c.banner.ctaText}</ExtLink>
        </div>
      </div>
    </section>
  );
}

function Destaques({ c }: { c: SiteContent }) {
  return (
    <section id="destaques" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Cardápio</span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">Nossos destaques</h2>
          <p className="mt-3 text-foreground/70">O que sai mais — e por que volta sempre.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.destaques.map((d) => (
            <article key={d.id} className="glass group overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={d.imgUrl}
                  alt={d.nome}
                  loading="lazy"
                  width={800}
                  height={600}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/__l5e/assets-v1/30e663a8-c85f-4a05-be3e-73f9c3126621/venerato-logo.png"; }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-brand-cream">{d.nome}</h3>
                <p className="mt-1 text-sm text-foreground/70">{d.desc}</p>
                <ExtLink href={c.wabizUrl} className="btn-primary mt-4 w-full !py-3 text-sm">
                  Peça Agora no WAbiz
                </ExtLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sobre({ c }: { c: SiteContent }) {
  return (
    <section id="sobre" className="section-pad relative">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        <div className="relative">
          <div className="glass-strong overflow-hidden rounded-[2rem]">
            <img src={c.about.imageUrl} alt="Pizza artesanal saindo do forno" loading="lazy" width={1200} height={900} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden h-24 w-24 rounded-2xl bg-gradient-to-br from-[var(--brand-gold)] to-[var(--brand-red)] sm:block" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{c.about.eyebrow}</span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">{c.about.title}</h2>
          <p className="mt-5 text-foreground/80">{c.about.paragraph1}</p>
          <p className="mt-4 text-foreground/70">{c.about.paragraph2}</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {c.about.stats.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-center">
                <div className="font-display text-2xl font-extrabold text-gold sm:text-3xl">{s.n}</div>
                <div className="mt-1 text-xs text-foreground/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Unidades({ c }: { c: SiteContent }) {
  return (
    <section id="unidades" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Onde estamos</span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">Nossas unidades</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {c.unidades.map((u) => (
            <article key={u.id} className="glass-strong flex flex-col rounded-3xl p-7">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[var(--brand-red)] to-[var(--brand-green)] text-xl">📍</div>
                <h3 className="min-w-0 truncate text-2xl font-bold">{u.nome}</h3>
              </div>
              <p className="mt-5 flex-1 text-foreground/75">{u.endereco}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ExtLink href={u.mapsUrl} className="btn-secondary flex-1">Como chegar</ExtLink>
                <ExtLink href={c.wabizUrl} className="btn-primary flex-1">Pedir nessa unidade</ExtLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaFinal({ c }: { c: SiteContent }) {
  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-4xl px-5">
        <div
          className="glass-strong relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-center sm:py-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 20%, color-mix(in oklab, var(--brand-red) 30%, transparent), transparent 60%), radial-gradient(ellipse at 80% 80%, color-mix(in oklab, var(--brand-green) 30%, transparent), transparent 60%)",
          }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Sem enrolação</span>
          <h2 className="mt-3 text-4xl font-extrabold sm:text-6xl">Bateu fome?</h2>
          <p className="mx-auto mt-4 max-w-lg text-foreground/80">
            Em poucos cliques sua Venerato já está a caminho. Pedido direto no WAbiz.
          </p>
          <ExtLink href={c.wabizUrl} className="btn-primary mt-8 !px-10 !py-4 text-base">🍕 Fazer Pedido</ExtLink>
        </div>
      </div>
    </section>
  );
}

function Footer({ c }: { c: SiteContent }) {
  return (
    <footer className="border-t border-white/5 pt-16 pb-10">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={c.logoUrl} alt="Venerato Pizzas" className="h-16 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-foreground/65">
            Pizzaria premium em São Paulo e Taboão da Serra. Sabor de verdade, direto do nosso forno até a sua mesa.
          </p>
          <ExtLink href={c.instagramUrl} className="mt-5 inline-flex items-center gap-2 text-sm text-gold hover:underline">
            <span>📷</span> @veneratopizzas
          </ExtLink>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Links</h4>
          <ul className="space-y-2 text-sm text-foreground/75">
            <li><a href="#destaques" className="hover:text-gold">Destaques</a></li>
            <li><a href="#sobre" className="hover:text-gold">Sobre</a></li>
            <li><a href="#unidades" className="hover:text-gold">Unidades</a></li>
            <li><ExtLink href={c.wabizUrl} className="hover:text-gold">Fazer pedido</ExtLink></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Unidades</h4>
          <ul className="space-y-3 text-sm text-foreground/75">
            {c.unidades.map((u) => (
              <li key={u.id}>
                <div className="font-semibold text-foreground">{u.nome}</div>
                <div className="text-xs">{u.endereco}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/5 px-5 pt-6 text-center text-xs text-foreground/50">
        <p>
          Os pedidos são processados pela plataforma{" "}
          <ExtLink href={c.wabizUrl} className="text-gold hover:underline">WAbiz</ExtLink>.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} Venerato Pizzas. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

function useRouterUnused() { return useRouter(); }
void useRouterUnused;
