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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-primary-light rounded-lg transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-display text-2xl">Espace Mariés</h1>
        </div>
        
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-primary-light hover:bg-primary-dark rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        )}
      </header>

      {/* Contenu principal */}
      <main className="p-4">
        {isAuthenticated ? (
          <GestionInvites />
        ) : (
          <LoginForm onSuccess={() => setIsAuthenticated(true)} />
        )}
      </main>
    </div>
  );
};

export default Maries;
