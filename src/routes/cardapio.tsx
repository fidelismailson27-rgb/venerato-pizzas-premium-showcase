import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSiteContent } from "@/lib/site-content.functions";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";
import { SiteNav, SiteFooter, ExtLink } from "@/components/site-chrome";
import logoAsset from "@/assets/venerato-logo.png.asset.json";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/cardapio")({
  head: () => ({
    meta: [
      { title: "Cardápio — Venerato Pizzas" },
      {
        name: "description",
        content:
          "Conheça o cardápio Venerato: Pizzas grandes e broto, combos, empadas artesanais, pudim no copo e bebidas. Peça pelo WAbiz.",
      },
      { property: "og:title", content: "Cardápio Venerato Pizzas" },
      { property: "og:description", content: "Pizzas, combos, empadas, pudim e bebidas." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: logoAsset.url },
    ],
    links: [{ rel: "canonical", href: "/cardapio" }],
  }),
  loader: () => getSiteContent(),
  component: CardapioPage,
});

function CardapioPage() {
  const initial = Route.useLoaderData() as SiteContent;
  const [c, setC] = useState<SiteContent>(initial ?? DEFAULT_CONTENT);
  useEffect(() => { setC(initial); }, [initial]);

  return (
    <div className="relative">
      <SiteNav c={c} />
      <main className="pt-28 pb-10">
        <header className="mx-auto max-w-6xl px-5 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Cardápio</span>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-6xl">Nosso Cardápio</h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/70">
            Escolha o que quiser e peça direto pelo WAbiz. Sem cadastro, sem complicação.
          </p>
        </header>

        {c.cardapio.map((cat) => (
          <section key={cat.id} className="section-pad">
            <div className="mx-auto max-w-6xl px-5">
              <h2 className="mb-8 text-2xl font-extrabold sm:text-3xl">
                <span className="text-gold">·</span> {cat.nome}
              </h2>
              {cat.itens.length === 0 ? (
                <p className="text-sm text-foreground/60">Em breve.</p>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.itens.map((it) => (
                    <article
                      key={it.id}
                      className="glass group overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                        {it.imgUrl ? (
                          <img
                            src={it.imgUrl}
                            alt={it.nome}
                            loading="lazy"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = c.logoUrl; }}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-foreground/40">Sem imagem</div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-brand-cream">{it.nome}</h3>
                        {it.desc && <p className="mt-1 text-sm text-foreground/70">{it.desc}</p>}
                        <ExtLink href={c.wabizUrl} className="btn-primary mt-4 w-full !py-3 text-sm">
                          Pedir no WAbiz
                        </ExtLink>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter c={c} />
    </div>
  );
}
