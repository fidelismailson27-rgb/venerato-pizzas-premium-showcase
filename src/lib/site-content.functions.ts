import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "./site-content";
import { formatSiteContentValidationError, siteContentSchema } from "./site-content.schema";

// Public read — uses publishable key + anon SELECT policy.
export const getSiteContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  try {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", "main")
      .maybeSingle();
    if (error) {
      console.error("[site-content] read error", error);
      return DEFAULT_CONTENT;
    }
    const merged = mergeContent(data?.content as Partial<SiteContent> | null);
    const parsed = siteContentSchema.safeParse(merged);
    if (!parsed.success) {
      console.error("[site-content] invalid content", formatSiteContentValidationError(parsed.error));
      return DEFAULT_CONTENT;
    }
    return parsed.data;
  } catch (e) {
    console.error("[site-content] unexpected", e);
    return DEFAULT_CONTENT;
  }
});

// Admin-only write — verifies caller is admin via RLS + has_role.
export const updateSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { content: unknown }) => {
    const parsed = siteContentSchema.safeParse(data.content);
    if (!parsed.success) {
      throw new Error(`Conteúdo inválido: ${formatSiteContentValidationError(parsed.error)}`);
    }
    return { content: parsed.data };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Defense in depth: check role before write (RLS would also block it).
    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) {
      throw new Error("Forbidden: admin role required");
    }

    const { error } = await supabase
      .from("site_content")
      .update({
        content: data.content as never,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      })
      .eq("id", "main");
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
