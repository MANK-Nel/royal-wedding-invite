import { useState, useEffect } from "react";
import { ArrowLeft, Search, MapPin, Heart, Table } from "lucide-react";
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
            <div className="mt-8 animate-scale-in space-y-6">
              {/* Floating icon */}
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border-2 border-gold/40 animate-float shadow-lg">
                  <Table className="w-8 h-8 text-gold" />
                </div>
              </div>

              {/* Main card */}
              <div className="bg-gradient-to-br from-card via-card to-secondary/5 border-2 border-gold/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 space-y-6">
                {/* Guest name */}
                <div className="text-center space-y-2">
                  <p className="text-sm font-light text-muted-foreground uppercase tracking-widest">Bienvenue,</p>
                  <h2 className="font-display text-4xl md:text-5xl text-primary tracking-wide font-light">
                    {resultat.prenom}
                  </h2>
                  <p className="text-xl text-foreground/70 font-light">{resultat.nom}</p>
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <Heart className="w-4 h-4 text-gold" />
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                </div>

                {/* Table number - prominent display */}
                <div className="bg-gradient-to-r from-primary/5 via-gold/5 to-primary/5 border border-primary/20 rounded-xl p-8 backdrop-blur-sm">
                  <p className="text-xs font-light text-muted-foreground uppercase tracking-widest mb-3">Votre table</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/40">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="font-display text-5xl md:text-6xl text-primary font-light tracking-tight">
                      {resultat.table ?? "—"}
                    </div>
                  </div>
                </div>

                {/* Footer message */}
                <p className="text-center text-sm text-muted-foreground font-light leading-relaxed">
                  Préparez-vous pour une célébration inoubliable le 14 février 2026 à Port-Gentil
                </p>
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
