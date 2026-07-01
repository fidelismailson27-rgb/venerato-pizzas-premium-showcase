import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSiteContent } from "@/lib/site-content.functions";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";
import { SiteNav, SiteFooter, ExtLink } from "@/components/site-chrome";
import logoAsset from "@/assets/venerato-logo.png.asset.json";
import { absoluteAssetUrl, absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Venerato — Pizzaria Premium em SP e Taboão" },
      {
        name: "description",
        content:
          "A história da Venerato Pizzas: massa fermentada com paciência, ingredientes selecionados e atendimento local em Campo Limpo e Taboão da Serra.",
      },
      { property: "og:title", content: "Sobre a Venerato Pizzas" },
      { property: "og:description", content: "Nossa história, diferenciais e ingredientes." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: absoluteAssetUrl(logoAsset.url) },
      { property: "og:url", content: absoluteUrl("/sobre") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/sobre") }],
  }),
  loader: () => getSiteContent(),
  component: SobrePage,
});

const DIFERENCIAIS = [
  { icon: "🔥", title: "Forno artesanal", desc: "Cada pizza assada com tempo e atenção." },
  { icon: "🌿", title: "Ingredientes selecionados", desc: "Queijo, molho e recheios escolhidos a dedo." },
  { icon: "🤝", title: "Atendimento local", desc: "Gente do bairro, atendendo gente do bairro." },
  { icon: "⏱️", title: "Entrega ágil", desc: "Pedido direto no WAbiz, sem complicação." },
];

function SobrePage() {
  const initial = Route.useLoaderData() as SiteContent;
  const [c, setC] = useState<SiteContent>(initial ?? DEFAULT_CONTENT);
  useEffect(() => { setC(initial); }, [initial]);

  return (
    <div className="relative">
      <SiteNav c={c} />
      <main className="pt-28 pb-16">
        <header className="mx-auto max-w-4xl px-5 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{c.about.eyebrow}</span>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-6xl">{c.about.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-foreground/80">{c.about.paragraph1}</p>
          <p className="mx-auto mt-3 max-w-2xl text-foreground/70">{c.about.paragraph2}</p>
        </header>

        <section className="section-pad">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="mb-8 text-center text-2xl font-extrabold sm:text-3xl">Nossos diferenciais</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DIFERENCIAIS.map((d) => (
                <div key={d.title} className="glass rounded-2xl p-5 text-center">
                  <div className="text-3xl">{d.icon}</div>
                  <h3 className="mt-3 font-bold">{d.title}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="mb-8 text-center text-2xl font-extrabold sm:text-3xl">Galeria</h2>
            {c.galeria.length === 0 ? (
              <p className="text-center text-sm text-foreground/60">Em breve.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {c.galeria.map((g) => (
                  <a
                    key={g.id}
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-2xl bg-white/5"
                  >
                    <img
                      src={g.url}
                      alt={g.alt ?? "Foto Venerato"}
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = c.logoUrl; }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section-pad">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Vai uma Venerato?</h2>
            <p className="mx-auto mt-3 max-w-md text-foreground/70">
              Peça pelo WAbiz ou fale com a gente direto no WhatsApp.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ExtLink href={c.wabizUrl} className="btn-primary">🍕 Fazer Pedido</ExtLink>
              <ExtLink href={c.whatsappUrl} className="btn-whatsapp">WhatsApp</ExtLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter c={c} />
    </div>
  );
}
