import { useNavigate } from "react-router-dom";
import { Users, Heart, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Top decoration line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      
      {/* Main content */}
      <div className="w-full max-w-2xl text-center relative z-10 space-y-8">
        {/* Logo / Title Section */}
        <div className="space-y-6 animate-fade-slide">
          {/* Heart icon with glow effect */}
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border-2 border-gold/40 shadow-lg hover:shadow-gold transition-all duration-300 hover:scale-110 animate-float">
              <Heart className="w-10 h-10 text-gold" fill="currentColor" />
            </div>
          </div>

          {/* Names */}
          <div className="space-y-3">
            <h1 className="font-display text-5xl md:text-6xl text-primary tracking-wider font-light">
              Anne & Alain-Gray
            </h1>
          </div>

          {/* Date and location */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/60" />
              <p className="text-sm tracking-widest uppercase font-medium">
                14 Février 2026
              </p>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-2 justify-center">
              <span>📍</span>
              Port-Gentil
            </p>
          </div>
        </div>

        {/* Elegant divider */}
        <div className="flex items-center justify-center gap-4 py-4 animate-fade-slide" style={{ animationDelay: '0.2s' }}>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <Sparkles className="w-5 h-5 text-gold/60 animate-bounce-subtle" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
        </div>

        {/* Navigation buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto pt-4 animate-fade-slide" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => navigate("/maries")}
            className="group btn-primary flex items-center justify-center gap-3 min-h-[52px]"
          >
            <Users className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Mariés</span>
          </button>

          <button
            onClick={() => navigate("/invites")}
            className="group btn-gold flex items-center justify-center gap-3 min-h-[52px]"
          >
            <Heart className="w-5 h-5 group-hover:scale-125 transition-transform" />
            <span>Invités</span>
          </button>
        </div>

        {/* Bible Quote */}
        <div className="mt-12 pt-8 border-t border-border/50 space-y-4 max-w-md mx-auto animate-fade-slide" style={{ animationDelay: '0.6s' }}>
          <p className="text-muted-foreground text-sm italic leading-relaxed font-light">
            « C'est pourquoi l'homme quittera son père et sa mère, 
            et s'attachera à sa femme, 
            et ils deviendront une seule chair. »
          </p>
          <p className="text-gold-dark font-medium text-xs tracking-wider uppercase">
            Genèse 2:24
          </p>
        </div>
      </div>

      {/* Bottom decoration line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </div>
  );
};

export default Index;
