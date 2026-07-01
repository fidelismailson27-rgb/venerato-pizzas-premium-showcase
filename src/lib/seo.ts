// Central SEO constant. Change this single value when the definitive
// domain is configured (e.g. https://veneratopizzas.com.br).
export const SITE_URL = "https://id-preview--23af066a-a8d5-4e5b-bbaf-63428717cb42.lovable.app";

export const absoluteUrl = (path: string = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
