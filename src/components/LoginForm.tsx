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
    } catch (err: unknown) {
      console.error(err);
      const msg = (err as { message?: string })?.message ?? "";
      if (msg === "Invalid login credentials") {
        setError("Email ou mot de passe incorrect.");
      } else if (msg === "Email not confirmed") {
        setError("Veuillez confirmer votre email avant de vous connecter.");
      } else {
        setError(msg || "Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto animate-fade-slide-up">
      <div className="card-elegant shadow-elegant hover:shadow-lg transition-all duration-300">
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border-2 border-gold/40 animate-float">
            <Lock className="w-7 h-7 text-gold" />
          </div>
          <div>
            <h2 className="font-display text-3xl text-primary tracking-wide">
              {mode === "login" ? "Connexion" : "Inscription"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {mode === "login"
                ? "Accédez à votre espace personnalisé"
                : "Créez votre compte sécurisé"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground tracking-wide">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gold/60" />
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground tracking-wide">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gold/60" />
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full font-medium tracking-wide"
          >
            {loading
              ? "Chargement..."
              : mode === "login"
              ? "Se connecter"
              : "S'inscrire"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-lg text-center animate-scale-in" style={{ background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)" }}>
            <p className="text-destructive text-sm font-medium">{error}</p>
          </div>
        )}

        {message && (
          <div className="mt-6 p-4 rounded-lg text-center animate-scale-in" style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
            <p className="text-green-600 text-sm font-medium">{message}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm mb-3">
            {mode === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}
          </p>
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
              setMessage("");
            }}
            className="text-gold hover:text-gold-light transition-colors text-sm font-medium tracking-wide"
          >
            {mode === "login" ? "Créer un compte" : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
