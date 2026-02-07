import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Invite {
  id: string;
  nom: string;
  prenom: string;
  numero_table: number | null;
}

const GestionInvites = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nom: "", prenom: "", numero_table: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Charger les invités
  const chargerInvites = async () => {
    try {
      const { data, error } = await supabase
        .from("invites")
        .select("*")
        .order("nom", { ascending: true });

      if (error) throw error;
      setInvites(data || []);
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerInvites();
  }, []);

  // Ajouter un invité
  const ajouterInvite = async () => {
    if (!formData.nom.trim() || !formData.prenom.trim()) {
      setError("Le nom et le prénom sont obligatoires.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error } = await supabase.from("invites").insert({
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        numero_table: formData.numero_table ? parseInt(formData.numero_table) : null,
      });

      if (error) throw error;

      await chargerInvites();
      setFormData({ nom: "", prenom: "", numero_table: "" });
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de l'ajout.");
    } finally {
      setSaving(false);
    }
  };

  // Modifier un invité
  const modifierInvite = async (id: string) => {
    if (!formData.nom.trim() || !formData.prenom.trim()) {
      setError("Le nom et le prénom sont obligatoires.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error } = await supabase
        .from("invites")
        .update({
          nom: formData.nom.trim(),
          prenom: formData.prenom.trim(),
          numero_table: formData.numero_table ? parseInt(formData.numero_table) : null,
        })
        .eq("id", id);

      if (error) throw error;

      await chargerInvites();
      setEditingId(null);
      setFormData({ nom: "", prenom: "", numero_table: "" });
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de la modification.");
    } finally {
      setSaving(false);
    }
  };

  // Supprimer un invité
  const supprimerInvite = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet invité ?")) return;

    try {
      const { error } = await supabase.from("invites").delete().eq("id", id);
      if (error) throw error;
      await chargerInvites();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  // Préparer l'édition
  const startEdit = (invite: Invite) => {
    setEditingId(invite.id);
    setFormData({
      nom: invite.nom,
      prenom: invite.prenom,
      numero_table: invite.numero_table?.toString() || "",
    });
    setError("");
  };

  // Annuler
  const cancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({ nom: "", prenom: "", numero_table: "" });
    setError("");
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Chargement des invités...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-slide">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h2 className="font-display text-2xl text-primary">Gestion des Invités</h2>
            <p className="text-muted-foreground text-sm">{invites.length} invité(s)</p>
          </div>
        </div>
        
        {!showForm && !editingId && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-gold flex items-center gap-2 py-3 px-5"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        )}
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="card-elegant mb-6">
          <h3 className="font-display text-xl text-primary mb-4">Nouvel invité</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Nom"
              className="input-elegant"
            />
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              placeholder="Prénom"
              className="input-elegant"
            />
            <input
              type="number"
              value={formData.numero_table}
              onChange={(e) => setFormData({ ...formData, numero_table: e.target.value })}
              placeholder="N° Table"
              className="input-elegant"
              min="1"
            />
          </div>
          
          {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={ajouterInvite}
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              onClick={cancelEdit}
              className="btn-outline-gold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Liste des invités */}
      {invites.length === 0 ? (
        <div className="card-elegant text-center py-12">
          <Users className="w-16 h-16 text-muted mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun invité pour le moment.</p>
          <p className="text-muted-foreground text-sm mt-1">
            Cliquez sur "Ajouter" pour commencer.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {invites.map((invite) => (
            <div key={invite.id} className="card-elegant">
              {editingId === invite.id ? (
                // Mode édition
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="Nom"
                      className="input-elegant"
                    />
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      placeholder="Prénom"
                      className="input-elegant"
                    />
                    <input
                      type="number"
                      value={formData.numero_table}
                      onChange={(e) => setFormData({ ...formData, numero_table: e.target.value })}
                      placeholder="N° Table"
                      className="input-elegant"
                      min="1"
                    />
                  </div>
                  
                  {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                  
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => modifierInvite(invite.id)}
                      disabled={saving}
                      className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? "Enregistrement..." : "Sauvegarder"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn-outline-gold px-4"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                // Mode affichage
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {invite.prenom} {invite.nom}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Table : {invite.numero_table ?? "Non attribuée"}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(invite)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                      aria-label="Modifier"
                    >
                      <Edit2 className="w-5 h-5 text-primary" />
                    </button>
                    <button
                      onClick={() => supprimerInvite(invite.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestionInvites;
