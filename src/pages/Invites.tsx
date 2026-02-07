import { useState, useEffect } from "react";
import { ArrowLeft, Search, MapPin, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import fairepart1 from "@/assets/fairepart1.jpg";
import fairepart2 from "@/assets/fairepart2.jpg";

const Invites = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [resultat, setResultat] = useState<{ nom: string; prenom: string; table: number | null } | null>(null);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState(false);

  const faireParts = [fairepart1, fairepart2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % faireParts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const rechercherInvite = async () => {
    setRecherche(true);
    setErreur("");
    setResultat(null);

    const nomNormalise = nom.trim().toLowerCase();
    const prenomNormalise = prenom.trim().toLowerCase();

    if (!nomNormalise || !prenomNormalise) {
      setErreur("Veuillez remplir le nom et le prénom.");
      setRecherche(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("invites")
        .select("nom, prenom, numero_table")
        .ilike("nom", nomNormalise)
        .ilike("prenom", prenomNormalise)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setResultat({
          nom: data[0].nom,
          prenom: data[0].prenom,
          table: data[0].numero_table,
        });
      } else {
        setErreur("Aucun invité trouvé avec ce nom et prénom.");
      }
    } catch (err) {
      console.error(err);
      setErreur("Erreur lors de la recherche. Réessayez.");
    } finally {
      setRecherche(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background flex flex-col">
      {/* Header avec gradient élégant */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground p-6 flex items-center gap-4 shadow-lg">
        <button
          onClick={() => navigate("/")}
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
          aria-label="Retour"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl tracking-wider font-light">Faire-Part</h1>
          <p className="text-primary-foreground/70 text-sm tracking-wide">Anne & Alain-Gray</p>
        </div>
      </header>

      {/* Slideshow avec animations élégantes */}
      <div className="relative w-full bg-gradient-to-b from-secondary/40 to-secondary/20 flex items-center justify-center overflow-hidden" style={{ minHeight: "45vh" }}>
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

        {/* Images */}
        {faireParts.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Faire-part ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out ${
              currentImage === index ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          />
        ))}

        {/* Indicators - Enhanced */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {faireParts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`transition-all duration-300 rounded-full ${
                currentImage === index 
                  ? "bg-gold w-3 h-3 shadow-gold"
                  : "bg-muted-foreground/30 w-2 h-2 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Voir faire-part ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Search Section - Enhanced Design */}
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="card-elegant max-w-md w-full shadow-elegant hover:shadow-lg transition-all duration-300 animate-fade-slide-up">
          {/* Header de la carte */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 border-2 border-gold/40 animate-float">
              <Search className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-display text-2xl text-primary tracking-wide">Votre Place</h2>
            <p className="text-muted-foreground text-sm">Découvrez votre table</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground tracking-wide">
                Nom
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && rechercherInvite()}
                placeholder="Votre nom de famille"
                className="input-elegant"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground tracking-wide">
                Prénom
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && rechercherInvite()}
                placeholder="Votre prénom"
                className="input-elegant"
              />
            </div>

            <button
              onClick={rechercherInvite}
              disabled={recherche}
              className="btn-primary w-full flex items-center justify-center gap-2 group"
            >
              <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {recherche ? "Recherche en cours..." : "Trouver ma table"}
            </button>
          </div>

          {/* Result - Enhanced display */}
          {resultat && (
            <div className="mt-8 p-6 rounded-xl text-center animate-scale-in space-y-4" style={{ background: "linear-gradient(135deg, rgba(194, 165, 82, 0.1) 0%, rgba(45, 30, 250, 0.05) 100%)" }}>
              <div className="flex justify-center">
                <Sparkles className="w-5 h-5 text-gold animate-bounce-subtle" />
              </div>
              <p className="text-lg font-medium text-foreground">
                {resultat.prenom} {resultat.nom}
              </p>
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary/10 to-gold/10 rounded-lg border border-primary/20">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Table</p>
                  <p className="font-display text-3xl text-primary font-light">
                    {resultat.table ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {erreur && (
            <div className="mt-8 p-4 rounded-lg text-center animate-scale-in" style={{ background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)" }}>
              <p className="text-destructive text-sm flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                {erreur}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invites;
