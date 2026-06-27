// Shared site content shape used by the home page and admin panel.
// Default values match the original landing assets so the site keeps working
// even before any admin edit (fallback when DB is empty / fetch fails).

export type HeroMediaType = "image" | "video";

export type Destaque = {
  id: string;
  nome: string;
  desc: string;
  imgUrl: string;
};

export type Unidade = {
  id: string;
  nome: string;
  endereco: string;
  mapsUrl: string;
};

export type SiteContent = {
  logoUrl: string;
  wabizUrl: string;
  instagramUrl: string;
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    mediaType: HeroMediaType;
    mediaUrl: string;
    fallbackImageUrl: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    imageUrl: string;
    stats: { n: string; l: string }[];
  };
  destaques: Destaque[];
  banner: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaText: string;
  };
  unidades: Unidade[];
};

// Stable CDN URLs from src/assets/*.asset.json — safe as defaults.
const LOGO = "/__l5e/assets-v1/30e663a8-c85f-4a05-be3e-73f9c3126621/venerato-logo.png";
const HERO = "/src/assets/hero-pizza.jpg";

export const DEFAULT_CONTENT: SiteContent = {
  logoUrl: LOGO,
  wabizUrl: "https://veneratopizzas.wabiz.delivery/",
  instagramUrl: "https://instagram.com/veneratopizzas",
  hero: {
    badge: "Pizzaria Premium · SP & Taboão",
    title: "A pizza que conquistou",
    titleHighlight: "Taboão da Serra",
    subtitle: "Muito recheio, ingredientes selecionados e sabor de verdade.",
    mediaType: "image",
    mediaUrl: HERO,
    fallbackImageUrl: HERO,
  },
  about: {
    eyebrow: "Quem somos",
    title: "Do bairro para a sua mesa",
    paragraph1:
      "A Venerato nasceu da paixão por uma pizza honesta — massa fermentada com paciência, molho feito do zero e ingredientes que a gente escolheria pra comer em casa.",
    paragraph2:
      "Crescemos em Taboão da Serra atendendo cliente por cliente, mesa por mesa. Hoje, com unidades em Campo Limpo e Jd. Dracena, levamos esse mesmo cuidado direto até você.",
    imageUrl: HERO,
    stats: [
      { n: "+10", l: "anos de forno" },
      { n: "2", l: "unidades" },
      { n: "100%", l: "artesanal" },
    ],
  },
  destaques: [
    { id: "1", nome: "Pudim no Copo", desc: "Cremoso, na medida certa.", imgUrl: "/src/assets/destaque-pudim.jpg" },
    { id: "2", nome: "Empadas Artesanais", desc: "Massa amanteigada, recheio generoso.", imgUrl: "/src/assets/destaque-empadas.jpg" },
    { id: "3", nome: "Venerato do Dia", desc: "A pizza que todo mundo pede de novo.", imgUrl: "/src/assets/destaque-pizza-dia.jpg" },
    { id: "4", nome: "Combos", desc: "Pizza + bebida + sobremesa.", imgUrl: "/src/assets/destaque-combos.jpg" },
    { id: "5", nome: "Bebidas", desc: "Geladinhas pra acompanhar.", imgUrl: "/src/assets/destaque-bebidas.jpg" },
  ],
  banner: {
    enabled: false,
    eyebrow: "Promo da semana",
    title: "2 pizzas grandes por R$ 89",
    subtitle: "Válido de segunda a quarta. Peça pelo WAbiz.",
    ctaText: "Aproveitar agora",
  },
  unidades: [
    {
      id: "1",
      nome: "Campo Limpo",
      endereco: "Rua Eliane de Araújo Neves, 90 — Campo Limpo, São Paulo - SP",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Eliane+de+Araújo+Neves+90+Campo+Limpo+São+Paulo",
    },
    {
      id: "2",
      nome: "Taboão — Jd. Dracena",
      endereco: "Avenida Embaixador Assis Chateaubriand, 437 — Taboão da Serra - SP",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av+Embaixador+Assis+Chateaubriand+437+Taboão+da+Serra",
    },
  ],
};

// Deep-merge a partial DB payload over defaults so partial admin edits never
// blank out the site. Top-level arrays from DB replace defaults entirely.
export function mergeContent(partial: Partial<SiteContent> | null | undefined): SiteContent {
  if (!partial) return DEFAULT_CONTENT;
  return {
    ...DEFAULT_CONTENT,
    ...partial,
    hero: { ...DEFAULT_CONTENT.hero, ...(partial.hero ?? {}) },
    about: {
      ...DEFAULT_CONTENT.about,
      ...(partial.about ?? {}),
      stats: partial.about?.stats ?? DEFAULT_CONTENT.about.stats,
    },
    banner: { ...DEFAULT_CONTENT.banner, ...(partial.banner ?? {}) },
    destaques: partial.destaques ?? DEFAULT_CONTENT.destaques,
    unidades: partial.unidades ?? DEFAULT_CONTENT.unidades,
  };
}
