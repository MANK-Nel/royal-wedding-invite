import { useNavigate } from "react-router-dom";
import { Users, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background via-secondary/30 to-background">
      {/* Décoration supérieure */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      
      {/* Contenu principal */}
      <div className="w-full max-w-md text-center animate-fade-slide">
        {/* Logo / Titre */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Heart className="w-10 h-10 text-gold" fill="currentColor" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">
            Anne & Alain-Gray
          </h1>
          <p className="text-muted-foreground text-lg">
            14 Février 2026 • Port-Gentil
          </p>
        </div>

        {/* Divider doré */}
        <div className="gold-divider mb-10">
          <span className="text-2xl">💍</span>
        </div>

        {/* Boutons de navigation */}
        <div className="space-y-4">
          {/* Bouton Mariés */}
          <button
            onClick={() => navigate("/maries")}
            className="btn-primary w-full flex items-center justify-center gap-3 min-h-[60px]"
          >
            <Users className="w-6 h-6" />
            <span>👰🤵 Espace Mariés</span>
          </button>

          {/* Bouton Invités */}
          <button
            onClick={() => navigate("/invites")}
            className="btn-gold w-full flex items-center justify-center gap-3 min-h-[60px]"
          >
            <Heart className="w-6 h-6" />
            <span>🎉 Espace Invités</span>
          </button>
        </div>

        {/* Message d'accueil */}
        <p className="mt-10 text-muted-foreground text-sm italic">
          "C'est pourquoi l'homme quittera son père et sa mère, et s'attachera à sa femme, 
          et ils deviendront une seule chair."
        </p>
        <p className="text-gold-dark font-medium text-sm mt-2">Genèse 2:24</p>
      </div>

      {/* Décoration inférieure */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
    </div>
  );
};

export default Index;
