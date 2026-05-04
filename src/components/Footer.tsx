export default function Footer() {
  return (
    <footer className="py-12 bg-luxury-ink border-t border-white/5 text-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center leading-none mb-8">
            <span className="text-2xl font-serif font-bold tracking-tighter text-white">
              AMAIRA
            </span>
            <span className="text-[10px] font-accent tracking-[0.3em] uppercase text-luxury-gold">
              Interiors
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'].map(link => (
              <a key={link} href="#" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-luxury-gold transition-colors">
                {link}
              </a>
            ))}
            <a href="#admin" className="text-[10px] uppercase tracking-widest text-white/20 hover:text-luxury-gold transition-colors">
              Admin
            </a>
          </div>
          
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-accent">
            &copy; {new Date().getFullYear()} Amaira Interiors. Crafted with Excellence in Karnal.
          </p>
        </div>
      </div>
    </footer>
  );
}
