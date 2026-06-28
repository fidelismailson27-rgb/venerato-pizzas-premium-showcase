import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { SiteContent } from "@/lib/site-content";

export function ExtLink({
  href,
  className,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
    </a>
  );
}

export function SiteNav({ c }: { c: SiteContent }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="fixed top-3 left-1/2 z-50 w-[min(96%,1100px)] -translate-x-1/2">
      <nav className="glass-strong flex items-center justify-between gap-3 rounded-full px-3 py-2 sm:px-5">
        <Link to="/" className="flex items-center gap-2 pl-1" onClick={close}>
          <img src={c.logoUrl} alt="Venerato Pizzas" className="h-9 w-auto sm:h-10" />
        </Link>
        <div className="hidden items-center gap-6 text-sm text-foreground/80 md:flex">
          <Link to="/" className="hover:text-gold transition-colors">Início</Link>
          <Link to="/cardapio" className="hover:text-gold transition-colors">Cardápio</Link>
          <Link to="/sobre" className="hover:text-gold transition-colors">Sobre</Link>
          <Link to="/localizacao" className="hover:text-gold transition-colors">Localização</Link>
          <ExtLink href={c.instagramUrl} className="hover:text-gold transition-colors">Instagram</ExtLink>
        </div>
        <div className="flex items-center gap-2">
          <ExtLink href={c.wabizUrl} className="btn-primary !px-4 !py-2 text-sm">
            Pedir agora
          </ExtLink>
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 text-foreground/90 md:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>
              ) : (
                <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>
              )}
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="glass-strong mt-2 rounded-3xl px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-1 text-sm text-foreground/85">
            <li><Link to="/" onClick={close} className="block rounded-xl px-3 py-2 hover:bg-white/5 hover:text-gold">Início</Link></li>
            <li><Link to="/cardapio" onClick={close} className="block rounded-xl px-3 py-2 hover:bg-white/5 hover:text-gold">Cardápio</Link></li>
            <li><Link to="/sobre" onClick={close} className="block rounded-xl px-3 py-2 hover:bg-white/5 hover:text-gold">Sobre</Link></li>
            <li><Link to="/localizacao" onClick={close} className="block rounded-xl px-3 py-2 hover:bg-white/5 hover:text-gold">Localização</Link></li>
            <li><ExtLink href={c.instagramUrl} onClick={close} className="block rounded-xl px-3 py-2 hover:bg-white/5 hover:text-gold">Instagram</ExtLink></li>
          </ul>
        </div>
      )}
    </header>
  );
}

export function SiteFooter({ c }: { c: SiteContent }) {
  return (
    <footer className="border-t border-white/5 pt-16 pb-10">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={c.logoUrl} alt="Venerato Pizzas" className="h-16 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-foreground/65">
            Pizzaria premium em São Paulo e Taboão da Serra. Sabor de verdade, direto do nosso forno até a sua mesa.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ExtLink href={c.instagramUrl} className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
              <span>📷</span> @veneratopizzas
            </ExtLink>
            <ExtLink href={c.whatsappUrl} className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
              <span>💬</span> WhatsApp
            </ExtLink>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Navegação</h4>
          <ul className="space-y-2 text-sm text-foreground/75">
            <li><Link to="/" className="hover:text-gold">Início</Link></li>
            <li><Link to="/cardapio" className="hover:text-gold">Cardápio</Link></li>
            <li><Link to="/sobre" className="hover:text-gold">Sobre</Link></li>
            <li><Link to="/localizacao" className="hover:text-gold">Localização</Link></li>
            <li><ExtLink href={c.wabizUrl} className="hover:text-gold">Fazer pedido</ExtLink></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Unidades</h4>
          <ul className="space-y-3 text-sm text-foreground/75">
            {c.unidades.map((u) => (
              <li key={u.id}>
                <div className="font-semibold text-foreground">{u.nome}</div>
                <div className="text-xs">{u.endereco}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/5 px-5 pt-6 text-center text-xs text-foreground/50">
        <p>
          Os pedidos são processados pela plataforma{" "}
          <ExtLink href={c.wabizUrl} className="text-gold hover:underline">WAbiz</ExtLink>.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} Venerato Pizzas. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
