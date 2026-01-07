# 🔒 Guide de Sécurisation de l'Interface Admin

Ce guide vous explique comment sécuriser votre interface admin en utilisant l'authentification Supabase au lieu d'un simple mot de passe.

## 📋 Options de Sécurisation

### Option 1 : Authentification Supabase (Recommandée) ⭐
- Utilise l'authentification Supabase avec email/mot de passe
- Politiques RLS basées sur les rôles utilisateur
- Plus sécurisé et professionnel

### Option 2 : Authentification par Service Role Key (Avancée)
- Utilise la clé service_role côté serveur uniquement
- Nécessite une API route Next.js
- Très sécurisé mais plus complexe

### Option 3 : Protection par IP + Mot de passe (Simple)
- Limite l'accès à certaines IPs
- Garde le mot de passe simple
- Moins sécurisé mais plus facile

---

## 🚀 Option 1 : Authentification Supabase (Recommandée)

### Étape 1 : Créer un utilisateur admin dans Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous et sélectionnez votre projet
3. Allez dans **Authentication** > **Users**
4. Cliquez sur **"Add user"** > **"Create new user"**
5. Remplissez :
   - **Email** : `admin@lesavore.ch` (ou votre email)
   - **Password** : Choisissez un mot de passe fort
   - **Auto Confirm User** : ✅ Cochez cette case
6. Cliquez sur **"Create user"**
7. **📝 Notez l'email et le mot de passe**, vous en aurez besoin

### Étape 2 : Créer une table pour les admins (optionnel mais recommandé)

1. Allez dans **SQL Editor** dans Supabase
2. Exécutez ce script :

```sql
-- Table pour stocker les utilisateurs admin
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer l'utilisateur admin
INSERT INTO admin_users (email)
VALUES ('admin@lesavore.ch')
ON CONFLICT (email) DO NOTHING;

-- Politique RLS pour la table admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin_users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );
```

### Étape 3 : Mettre à jour les politiques RLS

1. Allez dans **SQL Editor**
2. Exécutez ce script pour remplacer les anciennes politiques :

```sql
-- Supprimer les anciennes politiques publiques
DROP POLICY IF EXISTS "Public insert access" ON menu_items;
DROP POLICY IF EXISTS "Public update access" ON menu_items;
DROP POLICY IF EXISTS "Public delete access" ON menu_items;
DROP POLICY IF EXISTS "Public insert access" ON drink_items;
DROP POLICY IF EXISTS "Public update access" ON drink_items;
DROP POLICY IF EXISTS "Public delete access" ON drink_items;

-- Créer une fonction pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Politiques pour menu_items (écriture uniquement pour les admins)
CREATE POLICY "Admins can insert menu_items" ON menu_items
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update menu_items" ON menu_items
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- Note: La suppression se fait via is_active = false, donc on utilise UPDATE
-- La politique UPDATE ci-dessus couvre déjà la "suppression"

-- Politiques pour drink_items (écriture uniquement pour les admins)
CREATE POLICY "Admins can insert drink_items" ON drink_items
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update drink_items" ON drink_items
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
```

### Étape 4 : Mettre à jour l'interface admin

Le code de l'interface admin doit être mis à jour pour utiliser Supabase Auth. Voir le fichier `app/admin/page.tsx` mis à jour.

---

## 🔐 Option 2 : Protection par IP + Mot de passe (Simple)

Si vous préférez garder le système actuel mais l'améliorer :

### Étape 1 : Ajouter une vérification IP dans Vercel

1. Allez dans Vercel > Votre projet > **Settings** > **Security**
2. Configurez **IP Allowlist** pour limiter l'accès à `/admin`
3. Ajoutez votre/vos IP(s) autorisée(s)

### Étape 2 : Renforcer le mot de passe

1. Utilisez un mot de passe fort (minimum 16 caractères)
2. Changez-le régulièrement
3. Ne le partagez qu'avec les personnes autorisées

---

## 🛡️ Option 3 : Authentification par Service Role (Avancée)

Cette option nécessite de créer une API route Next.js qui utilise la clé service_role.

**⚠️ Attention** : Cette option est plus complexe et nécessite de modifier l'architecture.

---

## ✅ Recommandation

Je recommande **l'Option 1 (Authentification Supabase)** car elle offre :
- ✅ Sécurité professionnelle
- ✅ Gestion des utilisateurs facile
- ✅ Traçabilité des actions
- ✅ Possibilité d'ajouter plusieurs admins
- ✅ Pas de mot de passe en clair dans le code

---

## 📝 Prochaines étapes

1. Choisissez l'option de sécurisation
2. Suivez les étapes correspondantes
3. Testez l'interface admin
4. Vérifiez que tout fonctionne correctement

---

**Besoin d'aide ?** Dites-moi quelle option vous préférez et je vous guiderai étape par étape !
