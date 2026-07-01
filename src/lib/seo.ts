import logoAsset from "@/assets/venerato-logo.png.asset.json";

// Central SEO constant. Change this single value when the definitive
// domain is configured (e.g. https://veneratopizzas.com.br).
export const SITE_URL = "https://id-preview--23af066a-a8d5-4e5b-bbaf-63428717cb42.lovable.app";

export const absoluteUrl = (path: string = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const SITE_NAME = "Venerato Pizzas";
export const SITE_TITLE = "Venerato Pizzas - Pizzaria Premium em São Paulo e Taboão da Serra";
export const SITE_DESCRIPTION =
  "Muito recheio, ingredientes selecionados e sabor de verdade. Peça sua pizza Venerato em Campo Limpo e Taboão da Serra.";
export const INSTAGRAM_URL = "https://instagram.com/veneratopizzas";
export const WABIZ_URL = "https://veneratopizzas.wabiz.delivery/";

export function absoluteAssetUrl(path: string) {
  return path.startsWith("http://") || path.startsWith("https://") ? path : absoluteUrl(path);
}

export const DEFAULT_OG_IMAGE = absoluteAssetUrl(logoAsset.url);

const LOCATIONS = [
  {
    id: "campo-limpo",
    name: "Venerato Pizzas - Campo Limpo",
    streetAddress: "Rua Eliane de Araújo Neves, 90",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Rua+Eliane+de+Ara%C3%BAjo+Neves+90+Campo+Limpo+S%C3%A3o+Paulo",
  },
  {
    id: "taboao-jd-dracena",
    name: "Venerato Pizzas - Taboão da Serra",
    streetAddress: "Avenida Embaixador Assis Chateaubriand, 437",
    addressLocality: "Taboão da Serra",
    addressRegion: "SP",
    addressCountry: "BR",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Av+Embaixador+Assis+Chateaubriand+437+Tabo%C3%A3o+da+Serra",
  },
] as const;

export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: SITE_NAME,
        url: absoluteUrl("/"),
        logo: DEFAULT_OG_IMAGE,
        image: DEFAULT_OG_IMAGE,
        sameAs: [INSTAGRAM_URL],
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: SITE_NAME,
        url: absoluteUrl("/"),
        publisher: {
          "@id": absoluteUrl("/#organization"),
        },
        inLanguage: "pt-BR",
      },
      ...LOCATIONS.map((location) => ({
        "@type": "Restaurant",
        "@id": absoluteUrl(`/#${location.id}`),
        name: location.name,
        url: absoluteUrl("/"),
        image: DEFAULT_OG_IMAGE,
        logo: DEFAULT_OG_IMAGE,
        telephone: "+55 11 94744-5932",
        priceRange: "$$",
        servesCuisine: "Pizza",
        acceptsReservations: false,
        parentOrganization: {
          "@id": absoluteUrl("/#organization"),
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: location.streetAddress,
          addressLocality: location.addressLocality,
          addressRegion: location.addressRegion,
          addressCountry: location.addressCountry,
        },
        hasMap: location.mapUrl,
        sameAs: [INSTAGRAM_URL],
        potentialAction: {
          "@type": "OrderAction",
          target: WABIZ_URL,
        },
      })),
    ],
  };
}
