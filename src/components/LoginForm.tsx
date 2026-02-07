import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;
        setMessage("Vérifiez votre email pour confirmer votre inscription.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === "Invalid login credentials") {
        setError("Email ou mot de passe incorrect.");
      } else if (err.message === "Email not confirmed") {
        setError("Veuillez confirmer votre email avant de vous connecter.");
      } else {
        setError(err.message || "Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-fade-slide">
      <div className="card-elegant">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-3xl text-primary">
            {mode === "login" ? "Connexion" : "Inscription"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {mode === "login"
              ? "Accédez à la gestion des invités"
              : "Créez votre compte"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="input-elegant pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="input-elegant pl-10"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {message && (
            <div className="p-3 bg-accent rounded-lg">
              <p className="text-primary text-sm">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading
              ? "Chargement..."
              : mode === "login"
              ? "Se connecter"
              : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
              setMessage("");
            }}
            className="text-primary hover:underline text-sm"
          >
            {mode === "login"
              ? "Pas encore de compte ? S'inscrire"
              : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
