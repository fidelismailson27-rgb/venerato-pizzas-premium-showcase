import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSiteContent } from "@/lib/site-content.functions";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";
import { SiteNav, SiteFooter, ExtLink } from "@/components/site-chrome";
import logoAsset from "@/assets/venerato-logo.png.asset.json";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/localizacao")({
  head: () => ({
    meta: [
      { title: "Localização — Venerato Pizzas" },
      {
        name: "description",
        content:
          "Nossas unidades em Campo Limpo (São Paulo) e Taboão da Serra. Veja o endereço, abra no Google Maps ou peça direto pelo WAbiz.",
      },
      { property: "og:title", content: "Onde estamos — Venerato Pizzas" },
      { property: "og:description", content: "Unidades em Campo Limpo e Taboão da Serra." },
      { property: "og:image", content: logoAsset.url },
    ],
    links: [{ rel: "canonical", href: "/localizacao" }],
  }),
  loader: () => getSiteContent(),
  component: LocalizacaoPage,
});

function LocalizacaoPage() {
  const initial = Route.useLoaderData() as SiteContent;
  const [c, setC] = useState<SiteContent>(initial ?? DEFAULT_CONTENT);
  useEffect(() => { setC(initial); }, [initial]);

  return (
    <div className="relative">
      <SiteNav c={c} />
      <main className="pt-28 pb-16">
        <header className="mx-auto max-w-6xl px-5 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Localização</span>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-6xl">Nossas Unidades</h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/70">
            Estamos pertinho de você. Escolha a unidade e peça direto pelo WAbiz.
          </p>
        </header>

        <section className="section-pad">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-6 md:grid-cols-2">
              {c.unidades.map((u) => (
                <article key={u.id} className="glass-strong flex flex-col rounded-3xl p-7">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[var(--brand-red)] to-[var(--brand-green)] text-xl">📍</div>
                    <div className="min-w-0">
                      <h2 className="truncate text-2xl font-bold">{u.nome}</h2>
                      {u.cidade && <p className="text-xs uppercase tracking-wider text-gold">{u.cidade}</p>}
                    </div>
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
      </main>
      <SiteFooter c={c} />
    </div>
  );
}
