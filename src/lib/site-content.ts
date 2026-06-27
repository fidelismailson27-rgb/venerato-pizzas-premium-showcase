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
  cidade?: string;
  endereco: string;
  mapsUrl: string;
};

export type MenuItem = {
  id: string;
  nome: string;
  desc: string;
  imgUrl: string;
};

export type MenuCategoria = {
  id: string;
  nome: string;
  itens: MenuItem[];
};

export type GaleriaImagem = {
  id: string;
  url: string;
  alt?: string;
};

export type SiteContent = {
  logoUrl: string;
  wabizUrl: string;
  whatsappUrl: string;
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
  cardapio: MenuCategoria[];
  galeria: GaleriaImagem[];
};

// Asset URLs resolved by Vite (works in server + client bundles).
import LOGO_ASSET from "@/assets/venerato-logo.png.asset.json";
import HERO_URL from "@/assets/hero-pizza.jpg";
import PUDIM_URL from "@/assets/destaque-pudim.jpg";
import EMPADAS_URL from "@/assets/destaque-empadas.jpg";
import PIZZA_DIA_URL from "@/assets/destaque-pizza-dia.jpg";
import COMBOS_URL from "@/assets/destaque-combos.jpg";
import BEBIDAS_URL from "@/assets/destaque-bebidas.jpg";

const LOGO = LOGO_ASSET.url;

export const DEFAULT_CONTENT: SiteContent = {
  logoUrl: LOGO,
  wabizUrl: "https://veneratopizzas.wabiz.delivery/",
  whatsappUrl:
    "https://wa.me/5511947445932?text=Ol%C3%A1%21%20Gostaria%20de%20fazer%20um%20pedido%20na%20Venerato%20Pizzas.",
  instagramUrl: "https://instagram.com/veneratopizzas",
  hero: {
    badge: "Pizzaria Premium · SP & Taboão",
    title: "A pizza que conquistou",
    titleHighlight: "Taboão da Serra",
    subtitle: "Muito recheio, ingredientes selecionados e sabor de verdade.",
    mediaType: "image",
    mediaUrl: HERO_URL,
    fallbackImageUrl: HERO_URL,
  },
  about: {
    eyebrow: "Quem somos",
    title: "Do bairro para a sua mesa",
    paragraph1:
      "A Venerato nasceu da paixão por uma pizza honesta — massa fermentada com paciência, molho feito do zero e ingredientes que a gente escolheria pra comer em casa.",
    paragraph2:
      "Crescemos em Taboão da Serra atendendo cliente por cliente, mesa por mesa. Hoje, com unidades em Campo Limpo e Jd. Dracena, levamos esse mesmo cuidado direto até você.",
    imageUrl: HERO_URL,
    stats: [
      { n: "+10", l: "anos de forno" },
      { n: "2", l: "unidades" },
      { n: "100%", l: "artesanal" },
    ],
  },
  destaques: [
    { id: "1", nome: "Pudim no Copo", desc: "Cremoso, na medida certa.", imgUrl: PUDIM_URL },
    { id: "2", nome: "Empadas Artesanais", desc: "Massa amanteigada, recheio generoso.", imgUrl: EMPADAS_URL },
    { id: "3", nome: "Venerato do Dia", desc: "A pizza que todo mundo pede de novo.", imgUrl: PIZZA_DIA_URL },
    { id: "4", nome: "Combos", desc: "Pizza + bebida + sobremesa.", imgUrl: COMBOS_URL },
    { id: "5", nome: "Bebidas", desc: "Geladinhas pra acompanhar.", imgUrl: BEBIDAS_URL },
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
      cidade: "São Paulo - SP",
      endereco: "Rua Eliane de Araújo Neves, 90 — Campo Limpo, São Paulo - SP",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Rua+Eliane+de+Araújo+Neves+90+Campo+Limpo+São+Paulo",
    },
    {
      id: "2",
      nome: "Taboão — Jd. Dracena",
      cidade: "Taboão da Serra - SP",
      endereco:
        "Avenida Embaixador Assis Chateaubriand, 437 — Taboão da Serra - SP",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Av+Embaixador+Assis+Chateaubriand+437+Taboão+da+Serra",
    },
  ],
  cardapio: [
    {
      id: "cat-venerato-dia",
      nome: "Venerato do Dia",
      itens: [
        { id: "v1", nome: "Venerato do Dia", desc: "A pizza que todo mundo pede de novo.", imgUrl: PIZZA_DIA_URL },
      ],
    },
    {
      id: "cat-pudim",
      nome: "Pudim no Copo",
      itens: [
        { id: "p1", nome: "Pudim no Copo", desc: "Cremoso, na medida certa.", imgUrl: PUDIM_URL },
      ],
    },
    {
      id: "cat-empadas",
      nome: "Empadas Artesanais",
      itens: [
        { id: "e1", nome: "Empada de Frango", desc: "Massa amanteigada, recheio generoso.", imgUrl: EMPADAS_URL },
      ],
    },
    {
      id: "cat-combos",
      nome: "Combos",
      itens: [
        { id: "c1", nome: "Combo Família", desc: "Pizza + bebida + sobremesa.", imgUrl: COMBOS_URL },
      ],
    },
    {
      id: "cat-pizzas-grandes",
      nome: "Pizzas Grandes",
      itens: [
        { id: "pg1", nome: "Mussarela", desc: "Clássica, generosa de queijo.", imgUrl: PIZZA_DIA_URL },
      ],
    },
    {
      id: "cat-pizzas-broto",
      nome: "Pizzas Broto",
      itens: [
        { id: "pb1", nome: "Broto Mussarela", desc: "Tamanho individual, sabor inteiro.", imgUrl: PIZZA_DIA_URL },
      ],
    },
    {
      id: "cat-bebidas",
      nome: "Bebidas",
      itens: [
        { id: "b1", nome: "Refrigerantes", desc: "Geladinhos pra acompanhar.", imgUrl: BEBIDAS_URL },
      ],
    },
  ],
  galeria: [
    { id: "g1", url: HERO_URL, alt: "Pizza saindo do forno" },
    { id: "g2", url: PIZZA_DIA_URL, alt: "Venerato do Dia" },
    { id: "g3", url: COMBOS_URL, alt: "Combo Venerato" },
    { id: "g4", url: EMPADAS_URL, alt: "Empadas artesanais" },
    { id: "g5", url: PUDIM_URL, alt: "Pudim no copo" },
    { id: "g6", url: BEBIDAS_URL, alt: "Bebidas geladas" },
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
    cardapio: partial.cardapio ?? DEFAULT_CONTENT.cardapio,
    galeria: partial.galeria ?? DEFAULT_CONTENT.galeria,
  };
}
