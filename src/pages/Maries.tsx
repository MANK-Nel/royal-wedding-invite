import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import GestionInvites from "@/components/GestionInvites";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Maries = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground p-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
            aria-label="Retour"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-display text-2xl tracking-wider font-light">Espace Mariés</h1>
            <p className="text-primary-foreground/70 text-sm tracking-wide">Gestion des invitations</p>
          </div>
        </div>

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-white/15 hover:bg-white/25 rounded-lg transition-all duration-300 backdrop-blur-sm font-medium"
          >
            Déconnexion
          </button>
        )}
      </header>

      {/* Contenu principal */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        {isAuthenticated ? (
          <div className="animate-fade-slide-up">
            <GestionInvites />
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoginForm onSuccess={() => setIsAuthenticated(true)} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Maries;
