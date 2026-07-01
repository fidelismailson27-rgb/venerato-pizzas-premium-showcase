import { z } from "zod";

const LOCAL_ASSET_PREFIXES = ["/assets/", "/__l5e/assets-v1/"];
const MAX_URL_LENGTH = 2048;

function isLocalAssetUrl(value: string) {
  return (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    LOCAL_ASSET_PREFIXES.some((prefix) => value.startsWith(prefix))
  );
}

function isAllowedSupabaseStorageUrl(url: URL) {
  return (
    url.hostname.endsWith(".supabase.co") &&
    (url.pathname.startsWith("/storage/v1/object/public/media/") ||
      url.pathname.startsWith("/storage/v1/object/sign/media/"))
  );
}

function isAllowedMapsUrl(url: URL) {
  const host = url.hostname.replace(/^www\./, "");
  return (
    (host === "google.com" && url.pathname.startsWith("/maps")) ||
    url.hostname === "maps.app.goo.gl"
  );
}

function isAllowedUrl(value: string) {
  const trimmed = value.trim();
  if (isLocalAssetUrl(trimmed)) return true;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return false;

    const host = url.hostname.replace(/^www\./, "");
    return (
      host === "wa.me" ||
      host === "instagram.com" ||
      host === "veneratopizzas.wabiz.delivery" ||
      isAllowedMapsUrl(url) ||
      isAllowedSupabaseStorageUrl(url)
    );
  } catch {
    return false;
  }
}

const requiredText = z.string().trim().min(1, "Campo obrigatório").max(500);
const longText = z.string().trim().min(1, "Campo obrigatório").max(2000);
const optionalText = z.string().trim().max(1000);

export const safeUrlSchema = z
  .string()
  .trim()
  .min(1, "URL obrigatória")
  .max(MAX_URL_LENGTH, "URL muito longa")
  .refine(isAllowedUrl, "URL inválida ou domínio não permitido");

const idSchema = z.string().trim().min(1).max(120);

const destaqueSchema = z
  .object({
    id: idSchema,
    nome: requiredText,
    desc: optionalText,
    imgUrl: safeUrlSchema,
  })
  .strict();

const unidadeSchema = z
  .object({
    id: idSchema,
    nome: requiredText,
    cidade: optionalText.optional(),
    endereco: requiredText.max(1000),
    mapsUrl: safeUrlSchema,
  })
  .strict();

const menuItemSchema = z
  .object({
    id: idSchema,
    nome: requiredText,
    desc: optionalText,
    imgUrl: safeUrlSchema,
  })
  .strict();

const menuCategoriaSchema = z
  .object({
    id: idSchema,
    nome: requiredText,
    itens: z.array(menuItemSchema).max(120, "Categoria com itens demais"),
  })
  .strict();

const galeriaImagemSchema = z
  .object({
    id: idSchema,
    url: safeUrlSchema,
    alt: optionalText.optional(),
  })
  .strict();

export const siteContentSchema = z
  .object({
    logoUrl: safeUrlSchema,
    wabizUrl: safeUrlSchema,
    whatsappUrl: safeUrlSchema,
    instagramUrl: safeUrlSchema,
    hero: z
      .object({
        badge: requiredText,
        title: requiredText,
        titleHighlight: requiredText,
        subtitle: longText,
        mediaType: z.enum(["image", "video"]),
        mediaUrl: safeUrlSchema,
        fallbackImageUrl: safeUrlSchema,
      })
      .strict(),
    about: z
      .object({
        eyebrow: requiredText,
        title: requiredText,
        paragraph1: longText,
        paragraph2: longText,
        imageUrl: safeUrlSchema,
        stats: z
          .array(
            z
              .object({
                n: requiredText.max(40),
                l: requiredText.max(80),
              })
              .strict(),
          )
          .min(1, "Informe ao menos uma estatística")
          .max(6, "Máximo de 6 estatísticas"),
      })
      .strict(),
    destaques: z.array(destaqueSchema).min(1, "Informe ao menos um destaque").max(30),
    banner: z
      .object({
        enabled: z.boolean(),
        eyebrow: requiredText,
        title: requiredText,
        subtitle: longText,
        ctaText: requiredText,
      })
      .strict(),
    unidades: z.array(unidadeSchema).min(1, "Informe ao menos uma unidade").max(10),
    cardapio: z.array(menuCategoriaSchema).min(1, "Informe ao menos uma categoria").max(40),
    galeria: z.array(galeriaImagemSchema).max(80),
  })
  .strict();

export function formatSiteContentValidationError(error: z.ZodError) {
  return error.issues
    .slice(0, 5)
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "conteúdo";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}
