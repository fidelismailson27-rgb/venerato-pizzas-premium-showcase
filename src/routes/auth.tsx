import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Painel Venerato" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setInfo("Cadastro criado. Faça login para entrar no painel.");
        setMode("login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="glass-strong w-full max-w-md rounded-3xl p-8">
        <Link to="/" className="text-xs uppercase tracking-[0.3em] text-gold">← voltar ao site</Link>
        <h1 className="mt-4 text-3xl font-extrabold">Painel Venerato</h1>
        <p className="mt-1 text-sm text-foreground/70">
          {mode === "login" ? "Entre para editar o site." : "Crie seu acesso."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-foreground/70">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-foreground/70">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)]"
            />
          </div>
          {error && <p className="rounded-lg bg-destructive/20 px-3 py-2 text-sm text-destructive-foreground">{error}</p>}
          {info && <p className="rounded-lg bg-emerald-500/20 px-3 py-2 text-sm">{info}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setInfo(null); }}
          className="mt-4 w-full text-center text-sm text-foreground/70 hover:text-gold"
        >
          {mode === "login" ? "Não tenho acesso ainda · Criar conta" : "Já tenho acesso · Entrar"}
        </button>
      </div>
    </main>
  );
}
