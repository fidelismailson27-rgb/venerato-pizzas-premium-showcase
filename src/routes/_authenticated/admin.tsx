import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSiteContent, updateSiteContent } from "@/lib/site-content.functions";
import {
  DEFAULT_CONTENT,
  type Destaque,
  type GaleriaImagem,
  type MenuCategoria,
  type MenuItem,
  type SiteContent,
  type Unidade,
} from "@/lib/site-content";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel — Venerato" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

// Limits (advisory)
const IMG_LIMIT = 8 * 1024 * 1024; // 8 MB
const VID_LIMIT = 25 * 1024 * 1024; // 25 MB
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // ~10 years

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

// Convert any browser-decodable image to WebP via canvas.
async function imageToWebP(file: File, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.drawImage(bitmap, 0, 0);
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Falha ao gerar WebP"))), "image/webp", quality),
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const fetchContent = useServerFn(getSiteContent);
  const saveContent = useServerFn(updateSiteContent);

  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setUserEmail(u.user?.email ?? null);
      if (u.user) {
        const { data: roleData } = await supabase.rpc("has_role", {
          _user_id: u.user.id,
          _role: "admin",
        });
        setIsAdmin(Boolean(roleData));
      }
      const c = await fetchContent();
      setContent(c);
      setLoading(false);
    })();
  }, [fetchContent]);

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      await saveContent({ data: { content } });
      setStatus("✓ Alterações salvas. O site já está atualizado.");
    } catch (e) {
      setStatus("Erro: " + (e instanceof Error ? e.message : "tente novamente"));
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (loading) {
    return <main className="grid min-h-screen place-items-center">Carregando painel…</main>;
  }

  if (isAdmin === false) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="glass-strong max-w-md rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-bold">Sem permissão</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Sua conta ({userEmail}) não tem acesso de administrador.
          </p>
          <button onClick={handleSignOut} className="btn-secondary mt-6">Sair</button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 pt-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-gold">← ver site</Link>
          <h1 className="mt-2 text-3xl font-extrabold">Painel Venerato</h1>
          <p className="text-sm text-foreground/60">{userEmail}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSignOut} className="btn-secondary !py-2 !px-4 text-sm">Sair</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary !py-3 !px-6 text-sm">
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </header>

      {status && (
        <div className="glass mb-6 rounded-2xl p-4 text-sm">{status}</div>
      )}

      <div className="space-y-8">
        <Section title="Marca & links">
          <MediaField
            label="Logo"
            value={content.logoUrl}
            accept="image/*"
            onChange={(url) => setContent({ ...content, logoUrl: url })}
          />
          <TextField
            label="Link do WAbiz (botões de pedido)"
            value={content.wabizUrl}
            onChange={(v) => setContent({ ...content, wabizUrl: v })}
          />
          <TextField
            label="Link do WhatsApp (wa.me)"
            value={content.whatsappUrl}
            onChange={(v) => setContent({ ...content, whatsappUrl: v })}
          />
          <TextField
            label="Instagram"
            value={content.instagramUrl}
            onChange={(v) => setContent({ ...content, instagramUrl: v })}
          />
        </Section>

        <Section title="Hero (capa)">
          <TextField label="Selo (acima do título)" value={content.hero.badge} onChange={(v) => setContent({ ...content, hero: { ...content.hero, badge: v } })} />
          <TextField label="Título" value={content.hero.title} onChange={(v) => setContent({ ...content, hero: { ...content.hero, title: v } })} />
          <TextField label="Destaque dourado" value={content.hero.titleHighlight} onChange={(v) => setContent({ ...content, hero: { ...content.hero, titleHighlight: v } })} />
          <TextField label="Subtítulo" value={content.hero.subtitle} onChange={(v) => setContent({ ...content, hero: { ...content.hero, subtitle: v } })} />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs uppercase tracking-wider text-foreground/70">
              Tipo de mídia
              <select
                value={content.hero.mediaType}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, mediaType: e.target.value as "image" | "video" } })}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-foreground"
              >
                <option value="image">Imagem</option>
                <option value="video">Vídeo</option>
              </select>
            </label>
          </div>

          <MediaField
            label={content.hero.mediaType === "video" ? "Vídeo do hero (.mp4 recomendado)" : "Imagem do hero"}
            value={content.hero.mediaUrl}
            accept={content.hero.mediaType === "video" ? "video/*" : "image/*"}
            onChange={(url) => setContent({ ...content, hero: { ...content.hero, mediaUrl: url } })}
          />

          <MediaField
            label="Imagem de fallback (exibida se o vídeo falhar)"
            value={content.hero.fallbackImageUrl}
            accept="image/*"
            onChange={(url) => setContent({ ...content, hero: { ...content.hero, fallbackImageUrl: url } })}
          />
        </Section>

        <Section title="Sobre">
          <TextField label="Olho (linha pequena dourada)" value={content.about.eyebrow} onChange={(v) => setContent({ ...content, about: { ...content.about, eyebrow: v } })} />
          <TextField label="Título" value={content.about.title} onChange={(v) => setContent({ ...content, about: { ...content.about, title: v } })} />
          <TextArea label="Parágrafo 1" value={content.about.paragraph1} onChange={(v) => setContent({ ...content, about: { ...content.about, paragraph1: v } })} />
          <TextArea label="Parágrafo 2" value={content.about.paragraph2} onChange={(v) => setContent({ ...content, about: { ...content.about, paragraph2: v } })} />
          <MediaField label="Imagem do bloco Sobre" value={content.about.imageUrl} accept="image/*" onChange={(url) => setContent({ ...content, about: { ...content.about, imageUrl: url } })} />

          <div className="grid grid-cols-3 gap-3">
            {content.about.stats.map((s, i) => (
              <div key={i} className="space-y-2">
                <input
                  value={s.n}
                  onChange={(e) => {
                    const stats = [...content.about.stats];
                    stats[i] = { ...stats[i], n: e.target.value };
                    setContent({ ...content, about: { ...content.about, stats } });
                  }}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm"
                  placeholder="+10"
                />
                <input
                  value={s.l}
                  onChange={(e) => {
                    const stats = [...content.about.stats];
                    stats[i] = { ...stats[i], l: e.target.value };
                    setContent({ ...content, about: { ...content.about, stats } });
                  }}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs"
                  placeholder="anos de forno"
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Destaques (cardápio)">
          <ListEditor<Destaque>
            items={content.destaques}
            onChange={(items) => setContent({ ...content, destaques: items })}
            newItem={() => ({ id: crypto.randomUUID(), nome: "Novo item", desc: "", imgUrl: "" })}
            renderItem={(d, update) => (
              <>
                <TextField label="Nome" value={d.nome} onChange={(v) => update({ ...d, nome: v })} />
                <TextField label="Descrição" value={d.desc} onChange={(v) => update({ ...d, desc: v })} />
                <MediaField label="Imagem" value={d.imgUrl} accept="image/*" onChange={(url) => update({ ...d, imgUrl: url })} />
              </>
            )}
          />
        </Section>

        <Section title="Banner promocional">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={content.banner.enabled}
              onChange={(e) => setContent({ ...content, banner: { ...content.banner, enabled: e.target.checked } })}
            />
            Exibir banner no site
          </label>
          <TextField label="Olho" value={content.banner.eyebrow} onChange={(v) => setContent({ ...content, banner: { ...content.banner, eyebrow: v } })} />
          <TextField label="Título" value={content.banner.title} onChange={(v) => setContent({ ...content, banner: { ...content.banner, title: v } })} />
          <TextField label="Subtítulo" value={content.banner.subtitle} onChange={(v) => setContent({ ...content, banner: { ...content.banner, subtitle: v } })} />
          <TextField label="Texto do botão" value={content.banner.ctaText} onChange={(v) => setContent({ ...content, banner: { ...content.banner, ctaText: v } })} />
        </Section>

        <Section title="Unidades">
          <ListEditor<Unidade>
            items={content.unidades}
            onChange={(items) => setContent({ ...content, unidades: items })}
            newItem={() => ({ id: crypto.randomUUID(), nome: "Nova unidade", cidade: "", endereco: "", mapsUrl: "" })}
            renderItem={(u, update) => (
              <>
                <TextField label="Nome" value={u.nome} onChange={(v) => update({ ...u, nome: v })} />
                <TextField label="Cidade / Estado" value={u.cidade ?? ""} onChange={(v) => update({ ...u, cidade: v })} />
                <TextField label="Endereço completo" value={u.endereco} onChange={(v) => update({ ...u, endereco: v })} />
                <TextField label="Link Google Maps" value={u.mapsUrl} onChange={(v) => update({ ...u, mapsUrl: v })} />
              </>
            )}
          />
        </Section>

        <Section title="Cardápio (categorias e itens)">
          <p className="text-xs text-foreground/60">
            Cada categoria aparece como uma seção em <code>/cardapio</code>. Os itens são exibidos em grade.
          </p>
          <ListEditor<MenuCategoria>
            items={content.cardapio}
            onChange={(items) => setContent({ ...content, cardapio: items })}
            newItem={() => ({ id: crypto.randomUUID(), nome: "Nova categoria", itens: [] })}
            renderItem={(cat, update) => (
              <>
                <TextField label="Nome da categoria" value={cat.nome} onChange={(v) => update({ ...cat, nome: v })} />
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="mb-2 text-xs uppercase tracking-wider text-foreground/60">Itens</div>
                  <ListEditor<MenuItem>
                    items={cat.itens}
                    onChange={(itens) => update({ ...cat, itens })}
                    newItem={() => ({ id: crypto.randomUUID(), nome: "Novo item", desc: "", imgUrl: "" })}
                    renderItem={(it, upd) => (
                      <>
                        <TextField label="Nome" value={it.nome} onChange={(v) => upd({ ...it, nome: v })} />
                        <TextField label="Descrição curta" value={it.desc} onChange={(v) => upd({ ...it, desc: v })} />
                        <MediaField label="Imagem" value={it.imgUrl} accept="image/*" onChange={(url) => upd({ ...it, imgUrl: url })} />
                      </>
                    )}
                  />
                </div>
              </>
            )}
          />
        </Section>

        <Section title="Galeria (página Sobre)">
          <ListEditor<GaleriaImagem>
            items={content.galeria}
            onChange={(items) => setContent({ ...content, galeria: items })}
            newItem={() => ({ id: crypto.randomUUID(), url: "", alt: "" })}
            renderItem={(g, update) => (
              <>
                <MediaField label="Imagem" value={g.url} accept="image/*" onChange={(url) => update({ ...g, url })} />
                <TextField label="Descrição (alt)" value={g.alt ?? ""} onChange={(v) => update({ ...g, alt: v })} />
              </>
            )}
          />
        </Section>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-6">
      <h2 className="mb-4 text-xl font-bold text-gold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-foreground/70">{label}</span>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--brand-gold)]"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-foreground/70">{label}</span>
      <textarea
        value={value ?? ""}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--brand-gold)]"
      />
    </label>
  );
}

function MediaField({
  label,
  value,
  accept,
  onChange,
}: {
  label: string;
  value: string;
  accept: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setInfo(`${file.name} · ${formatBytes(file.size)}`);

    const isVideo = file.type.startsWith("video/");
    const limit = isVideo ? VID_LIMIT : IMG_LIMIT;
    if (file.size > limit) {
      setError(
        `Arquivo muito grande (${formatBytes(file.size)}). Limite: ${formatBytes(limit)} para ${
          isVideo ? "vídeos" : "imagens"
        }. Envie um arquivo menor.`,
      );
      setProgress(null);
      return;
    }

    try {
      setProgress(5);
      let blob: Blob = file;
      let ext = file.name.split(".").pop() || "bin";
      let contentType = file.type;

      if (!isVideo && file.type !== "image/svg+xml" && file.type.startsWith("image/")) {
        // Convert to WebP for smaller payloads
        setProgress(20);
        blob = await imageToWebP(file);
        ext = "webp";
        contentType = "image/webp";
        setInfo(`${file.name} → WebP · ${formatBytes(blob.size)}`);
      }

      setProgress(50);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, blob, { contentType, upsert: false });
      if (upErr) throw upErr;

      setProgress(80);
      const { data: signed, error: signErr } = await supabase.storage
        .from("media")
        .createSignedUrl(path, SIGNED_URL_TTL);
      if (signErr) throw signErr;

      onChange(signed.signedUrl);
      setProgress(100);
      setTimeout(() => setProgress(null), 800);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao enviar arquivo");
      setProgress(null);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-2 text-xs uppercase tracking-wider text-foreground/70">{label}</div>

      {value && (
        <div className="mb-3 flex items-start gap-3">
          {value.match(/\.(mp4|webm|mov)(\?|$)/i) ? (
            <video src={value} className="h-20 w-32 rounded-lg object-cover" muted />
          ) : (
            <img src={value} alt="" className="h-20 w-20 rounded-lg object-cover" />
          )}
          <div className="flex-1">
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-foreground/70"
            />
            <button onClick={() => onChange("")} className="mt-1 text-xs text-destructive-foreground/80 hover:underline">
              Remover
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => inputRef.current?.click()} className="btn-secondary !py-2 !px-4 text-xs">
          {value ? "Trocar arquivo" : "Enviar arquivo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
        {info && <span className="text-xs text-foreground/60">{info}</span>}
      </div>

      {progress !== null && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-[var(--brand-gold)] transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <p className="mt-2 text-xs text-destructive-foreground/90">{error}</p>}
    </div>
  );
}

function ListEditor<T extends { id: string }>({
  items,
  onChange,
  newItem,
  renderItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (next: T) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-foreground/60">Item {idx + 1}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (idx === 0) return;
                  const next = [...items];
                  [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                  onChange(next);
                }}
                className="text-xs text-foreground/60 hover:text-gold"
              >↑</button>
              <button
                onClick={() => {
                  if (idx === items.length - 1) return;
                  const next = [...items];
                  [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                  onChange(next);
                }}
                className="text-xs text-foreground/60 hover:text-gold"
              >↓</button>
              <button
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                className="text-xs text-destructive-foreground/80 hover:underline"
              >Remover</button>
            </div>
          </div>
          <div className="space-y-3">
            {renderItem(item, (next) => {
              const arr = [...items];
              arr[idx] = next;
              onChange(arr);
            })}
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, newItem()])}
        className="btn-secondary !py-2 !px-4 text-xs"
      >
        + Adicionar item
      </button>
    </div>
  );
}
