-- Table des invités pour le mariage
CREATE TABLE public.invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    numero_table INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Activer RLS
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les invités (recherche de table)
CREATE POLICY "Lecture publique des invités" 
ON public.invites 
FOR SELECT 
USING (true);

-- Écriture réservée aux utilisateurs authentifiés (mariés)
CREATE POLICY "Mariés peuvent ajouter des invités" 
ON public.invites 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Mariés peuvent modifier les invités" 
ON public.invites 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Mariés peuvent supprimer les invités" 
ON public.invites 
FOR DELETE 
TO authenticated
USING (true);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_invites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_invites_timestamp
BEFORE UPDATE ON public.invites
FOR EACH ROW
EXECUTE FUNCTION public.update_invites_updated_at();