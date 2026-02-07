import { useState, useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
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

  // Animation des faire-part
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % faireParts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Recherche d'invité
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
          className="p-2 hover:bg-primary-light rounded-lg transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display text-2xl">Faire-Part</h1>
      </header>

      {/* Diaporama des faire-part */}
      <div className="relative w-full bg-secondary/50 flex items-center justify-center overflow-hidden"
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
        
        {/* Indicateurs */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {faireParts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentImage === index ? "bg-gold" : "bg-muted"
              }`}
              aria-label={`Voir faire-part ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Section Recherche */}
      <div className="flex-1 p-4">
        <div className="card-elegant max-w-md mx-auto">
          <h2 className="font-display text-2xl text-primary text-center mb-6">
            🔍 Trouvez votre table
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
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
              <label className="block text-sm font-medium text-foreground mb-1">
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
              <Search className="w-5 h-5" />
              {recherche ? "Recherche..." : "Rechercher"}
            </button>
          </div>

          {/* Résultat */}
          {resultat && (
            <div className="mt-6 p-4 bg-accent/50 rounded-lg text-center animate-fade-in">
              <p className="text-lg font-medium text-foreground">
                {resultat.prenom} {resultat.nom}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-gold/20 rounded-full">
                <span className="text-2xl">🪑</span>
                <span className="font-display text-3xl text-primary">
                  Table {resultat.table ?? "Non attribuée"}
                </span>
              </div>
            </div>
          )}

          {/* Erreur */}
          {erreur && (
            <div className="mt-6 p-4 bg-destructive/10 rounded-lg text-center">
              <p className="text-destructive">{erreur}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invites;
