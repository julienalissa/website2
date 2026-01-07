# 🔍 Guide de Débogage - Problèmes RLS

Ce guide vous explique comment collecter les informations nécessaires pour déboguer les problèmes de modification/suppression.

## 📋 Informations à Collecter

### 1. Erreur Exacte dans la Console du Navigateur

1. Allez sur `https://vraisavore.vercel.app/admin`
2. **Ouvrez la console du navigateur** :
   - **Chrome/Edge** : Appuyez sur `F12` ou `Ctrl+Shift+I`
   - **Firefox** : Appuyez sur `F12` ou `Ctrl+Shift+K`
3. Allez dans l'onglet **Console**
4. **Essayez de modifier un élément**
5. **Copiez l'erreur complète** qui apparaît (elle devrait être en rouge)

**Exemple de ce qu'il faut copier :**
```
Error: new row violates row-level security policy for table "menu_items"
    at updateMenuItem (supabase-admin.ts:124)
    ...
```

---

### 2. Détails de la Session Supabase

Dans la console du navigateur, exécutez cette commande :

```javascript
// Copiez-collez ce code dans la console du navigateur
const { data: { session }, error } = await supabase.auth.getSession();
console.log('=== SESSION INFO ===');
console.log('Email:', session?.user?.email);
console.log('User ID:', session?.user?.id);
console.log('Expires At:', session?.expires_at);
console.log('Access Token (premiers caractères):', session?.access_token?.substring(0, 20));
console.log('Session complète:', session);
console.log('Erreur:', error);
```

**Copiez tout ce qui s'affiche** après avoir exécuté cette commande.

---

### 3. Vérifier les Politiques RLS dans Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous et sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Exécutez cette requête :

```sql
-- Vérifier les politiques sur menu_items
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'menu_items'
ORDER BY cmd, policyname;
```

5. **Copiez le résultat** (faites une capture d'écran ou copiez le texte)

6. Faites la même chose pour `drink_items` :

```sql
-- Vérifier les politiques sur drink_items
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'drink_items'
ORDER BY cmd, policyname;
```

---

### 4. Vérifier votre Email dans admin_users

Dans SQL Editor, exécutez :

```sql
-- Vérifier les admins
SELECT * FROM admin_users;
```

**Copiez le résultat** (vous devriez voir votre email `Lesavorech@gmail.com`)

---

### 5. Tester la Fonction is_admin()

Dans SQL Editor, exécutez :

```sql
-- Vérifier que la fonction existe
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'is_admin';
```

**Copiez le résultat**

---

### 6. Tester avec votre Email

Dans SQL Editor, exécutez cette requête pour simuler ce que fait la fonction `is_admin()` :

```sql
-- Simuler la vérification admin (remplacez par votre email si différent)
SELECT 
  'Lesavorech@gmail.com' as email_test,
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = 'Lesavorech@gmail.com'
  ) as email_exists_in_admin_users;
```

**Copiez le résultat**

---

### 7. Vérifier le JWT Token (Optionnel - Avancé)

Dans la console du navigateur, exécutez :

```javascript
// Décoder le JWT pour voir son contenu
const { data: { session } } = await supabase.auth.getSession();
if (session?.access_token) {
  const payload = JSON.parse(atob(session.access_token.split('.')[1]));
  console.log('=== JWT PAYLOAD ===');
  console.log('Email dans JWT:', payload.email);
  console.log('Exp:', payload.exp);
  console.log('Payload complet:', payload);
}
```

**Copiez tout ce qui s'affiche**

---

### 8. Logs Supabase (Si disponible)

1. Dans Supabase, allez dans **Logs** > **Postgres Logs**
2. Essayez de modifier un élément
3. Regardez les logs qui apparaissent
4. **Copiez les erreurs** liées à RLS

---

## 📤 Comment Me Donner Ces Informations

Une fois que vous avez collecté toutes ces informations, donnez-moi :

1. **L'erreur exacte** de la console (Étape 1)
2. **Les détails de la session** (Étape 2)
3. **Les politiques RLS** (Étape 3) - capture d'écran ou texte
4. **La liste des admins** (Étape 4)
5. **Le résultat du test is_admin()** (Étape 6)

Vous pouvez me donner ces informations dans votre prochain message, et je pourrai identifier exactement le problème !

---

## 🚀 Alternative : Script de Diagnostic Automatique

Si vous préférez, je peux créer un script qui collecte automatiquement toutes ces informations. Dites-moi si vous voulez que je le crée !
