# Guide de Déploiement sur Vercel

## 📋 Prérequis

- Un compte [Vercel](https://vercel.com)
- Git configuré localement
- Repository GitHub poussé

## 🚀 Étapes de déploiement

### 1. **Connecter votre repositorium à Vercel**

Accédez à [Vercel Dashboard](https://vercel.com/dashboard) et cliquez sur "New Project"

### 2. **Importer depuis GitHub**

- Sélectionnez "Import Git Repository"
- Cherchez `royal-wedding-invite`
- Sélectionnez et cliquez "Import"

### 3. **Configurer les variables d'environnement**

Avant le déploiement, ajoutez les variables:

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

**Dans Vercel:**
- Allez à "Settings" > "Environment Variables"
- Ajoutez les variables ci-dessus
- Cliquez "Save"

### 4. **Paramètres de build (si nécessaire)**

Les paramètres par défaut sont déjà configurés dans `vercel.json`:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5. **Déployer**

Cliquez simplement sur "Deploy" et attendez~

## 🔄 Déploiements futurs

Après chaque push vers `main`:

```bash
git add .
git commit -m "votre message"
git push origin main
```

Vercel déploiera automatiquement! ✨

## 🐛 Résolution des problèmes

### "Build échoué"
- Vérifiez que toutes les variables d'environnement sont configurées
- Vérifiez les logs de build dans Vercel Dashboard
- Assurez-vous que `npm run build` fonctionne localement

### Erreurs de dépendances
- Supprimez `node_modules` et `package-lock.json`
- Réinstallez: `npm install`
- Poussez les modifications: `git push origin main`

## 📱 Résultat

Votre site sera accessible à: `https://your-project.vercel.app`

---

**Besoin d'aide?** Consultez la [documentation Vercel](https://vercel.com/docs)
