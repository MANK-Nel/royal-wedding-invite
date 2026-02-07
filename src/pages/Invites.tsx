import { useState, useEffect } from "react";
import { ArrowLeft, Search, MapPin } from "lucide-react";
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 hover:bg-primary-light/20 rounded-lg transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl tracking-wide">Faire-Part</h1>
      </header>

      {/* Slideshow */}
      <div className="relative w-full bg-secondary/30 flex items-center justify-center overflow-hidden"
           style={{ minHeight: "50vh" }}>
        {faireParts.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Faire-part ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
              currentImage === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {faireParts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImage === index ? "bg-gold w-6" : "bg-muted-foreground/40"
              }`}
              aria-label={`Voir faire-part ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="flex-1 p-4">
        <div className="card-elegant max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Search className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl text-primary">
              Trouvez votre table
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Nom
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Votre nom de famille"
                className="input-elegant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Prénom
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Votre prénom"
                className="input-elegant"
              />
            </div>

            <button
              onClick={rechercherInvite}
              disabled={recherche}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              {recherche ? "Recherche..." : "Rechercher"}
            </button>
          </div>

          {/* Result */}
          {resultat && (
            <div className="mt-6 p-5 bg-accent/30 rounded-xl text-center animate-fade-in border border-gold/20">
              <p className="text-lg font-medium text-foreground mb-3">
                {resultat.prenom} {resultat.nom}
              </p>
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-primary/10 rounded-lg border border-primary/20">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-display text-2xl text-primary">
                  Table {resultat.table ?? "Non attribuée"}
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {erreur && (
            <div className="mt-6 p-4 bg-destructive/10 rounded-lg text-center border border-destructive/20">
              <p className="text-destructive text-sm">{erreur}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invites;
