import { useNavigate } from "react-router-dom";
import { Users, Heart, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      
      {/* Main content */}
      <div className="w-full max-w-md text-center animate-fade-slide">
        {/* Logo / Title */}
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <Heart className="w-7 h-7 text-gold" fill="currentColor" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-3 tracking-wide">
            Anne & Alain-Gray
          </h1>
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <span className="w-8 h-px bg-gold/40" />
            <p className="text-base tracking-widest uppercase">
              14 Février 2026
            </p>
            <span className="w-8 h-px bg-gold/40" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Port-Gentil</p>
        </div>

        {/* Elegant divider */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="w-16 h-px bg-gradient-to-r from-transparent to-gold/60" />
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="w-16 h-px bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        {/* Navigation buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/maries")}
            className="btn-primary w-full flex items-center justify-center gap-3 min-h-[56px]"
          >
            <Users className="w-5 h-5" />
            <span>Espace Mariés</span>
          </button>

          <button
            onClick={() => navigate("/invites")}
            className="btn-gold w-full flex items-center justify-center gap-3 min-h-[56px]"
          >
            <Heart className="w-5 h-5" />
            <span>Espace Invités</span>
          </button>
        </div>

        {/* Quote */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-muted-foreground text-sm italic leading-relaxed max-w-xs mx-auto">
            "C'est pourquoi l'homme quittera son père et sa mère, et s'attachera à sa femme, 
            et ils deviendront une seule chair."
          </p>
          <p className="text-gold-dark font-medium text-xs mt-3 tracking-wider uppercase">
            Genèse 2:24
          </p>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    </div>
  );
};

export default Index;
