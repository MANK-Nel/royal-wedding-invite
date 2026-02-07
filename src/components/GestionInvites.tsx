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
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Chargement des invités...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-slide-up">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 border-2 border-gold/40 animate-float">
            <Users className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-primary tracking-wide">Gestion des Invités</h2>
            <p className="text-muted-foreground text-sm font-light">{invites.length} invité(s) enregistré(s)</p>
          </div>
        </div>
        
        {!showForm && !editingId && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-gold flex items-center gap-2 py-3 px-6 group hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" />
            <span>Ajouter un invité</span>
          </button>
        )}
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="card-elegant border-2 border-gold/20 bg-gradient-to-br from-card via-card to-secondary/5 shadow-lg animate-scale-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
              <Plus className="w-4 h-4 text-gold" />
            </div>
            <h3 className="font-display text-xl text-primary">Nouvel invité</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Nom *"
                  className="w-full px-4 py-2.5 rounded-lg border border-border/50 bg-background/50 focus:bg-background focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  placeholder="Prénom *"
                  className="w-full px-4 py-2.5 rounded-lg border border-border/50 bg-background/50 focus:bg-background focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={formData.numero_table}
                  onChange={(e) => setFormData({ ...formData, numero_table: e.target.value })}
                  placeholder="N° Table"
                  className="w-full px-4 py-2.5 rounded-lg border border-border/50 bg-background/50 focus:bg-background focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  min="1"
                />
              </div>
            </div>
            
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-light">
                {error}
              </div>
            )}
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={ajouterInvite}
                disabled={saving}
                className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-gold to-gold/80 text-white font-medium hover:shadow-lg hover:from-gold/90 hover:to-gold/70 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
              >
                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                onClick={cancelEdit}
                className="py-2.5 px-4 rounded-lg border border-border text-muted-foreground hover:bg-secondary/50 hover:border-border/80 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des invités */}
      {invites.length === 0 ? (
        <div className="card-elegant text-center py-16 border-2 border-dashed border-gold/20 animate-fade-slide-up">
          <Users className="w-16 h-16 text-muted/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-light">Aucun invité pour le moment.</p>
          <p className="text-muted-foreground text-sm mt-2 font-light">
            Cliquez sur "Ajouter un invité" pour commencer.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {invites.map((invite, index) => (
            <div
              key={invite.id}
              className="card-elegant border border-border/50 hover:border-gold/30 hover:shadow-lg hover:bg-gradient-to-r hover:from-card hover:to-gold/5 transition-all group animate-fade-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {editingId === invite.id ? (
                // Mode édition
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-light text-muted-foreground mb-1">Nom *</label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        placeholder="Nom"
                        className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background/50 focus:bg-background focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-muted-foreground mb-1">Prénom *</label>
                      <input
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        placeholder="Prénom"
                        className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background/50 focus:bg-background focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-muted-foreground mb-1">N° Table</label>
                      <input
                        type="number"
                        value={formData.numero_table}
                        onChange={(e) => setFormData({ ...formData, numero_table: e.target.value })}
                        placeholder="Table"
                        className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background/50 focus:bg-background focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-sm"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-light">
                      {error}
                    </div>
                  )}
                  
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => modifierInvite(invite.id)}
                      disabled={saving}
                      className="py-2 px-4 rounded-lg bg-gradient-to-r from-gold to-gold/80 text-white text-sm font-medium hover:shadow-md hover:from-gold/90 hover:to-gold/70 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      {saving ? "..." : "Sauvegarder"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="py-2 px-4 rounded-lg border border-border text-muted-foreground hover:bg-secondary/50 text-sm transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                // Mode affichage
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {invite.prenom} <span className="font-light">{invite.nom}</span>
                    </p>
                    <p className="text-muted-foreground text-sm font-light mt-1">
                      <span className="inline-flex items-center gap-1">
                        Table : <span className="font-medium text-primary">{invite.numero_table ?? "—"}</span>
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(invite)}
                      className="p-2 hover:bg-gold/10 rounded-lg transition-colors text-primary hover:text-gold"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => supprimerInvite(invite.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive/70 hover:text-destructive"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
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
