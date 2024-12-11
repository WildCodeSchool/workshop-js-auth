[revoir l'épisode précédent](./)

## La vie en clair

Lorsque vous interagissez avec une application, celle-ci stocke souvent vos informations dans une base de données.
Parmi ces informations, les mots de passe jouent un rôle crucial pour sécuriser l'accès aux comptes utilisateur.

Jetez un coup d'œil à la table utilisateur (user) ci-dessous, où les informations sont stockées de manière lisible :

```sql
select * from user;
```

Vous devriez obtenir un tableau semblable à celui-ci :

| id  | email         | password | is_admin |
| --- | ------------- | -------- | -------- |
| 1   | jdoe@mail.com | 12345678 | 0        |

Ces informations comprennent l'identifiant (`id`), l'adresse e-mail (`email`), le mot de passe (`password`), et une indication du statut administrateur (`is_admin`). Cependant, stocker les mots de passe de cette manière n'est pas sûr.

Changez de branche dans votre projet avec la commande Git :

```bash
git switch hash-password
```

Relancez le projet en effectuant les migrations de base de données :

```bash
npm install
npm run db:migrate
npm run dev
```

Relancer la migration (`npm run db:migrate`) supprimera tous les utilisateurs précédemment créés, car nous effectuons une mise à jour dans la manière dont les mots de passe sont stockés.
{: .alert-warning }

Après ces étapes, créez un nouvel utilisateur depuis la page [http://localhost:3000/register](http://localhost:3000/register) (adaptez le port au besoin).

Explorez à nouveau le contenu de la table user. Vous remarquerez que le mot de passe n'est plus stocké en texte brut, mais plutôt sous la forme d'un haché généré par Argon2. La nouvelle configuration ressemble à ceci :

| id  | email         | hashed_password                                                                                   | is_admin |
| --- | ------------- | ------------------------------------------------------------------------------------------------- | -------- |
| 1   | jdoe@mail.com | $argon2id$v=19$m=19456,t=2,p=1$nz6t40CzCcijUhj3Ntpz9A$4DW+9sqLdKvj27E3JYbImIIfZAadyDGXHFiwpBHli4s | 0        |

Cette transformation offre une sécurité renforcée en empêchant la récupération facile des mots de passe originaux, même en cas d'accès non autorisé à la base de données.
Dans la prochaine section, nous explorerons plus en détail la structure des hachés de mots de passe générés avec Argon2.

## Hacher les mots de passe

Dans la nouvelle configuration, vous avez probablement remarqué le changement dans la manière dont les mots de passe sont stockés dans la base de données.
Auparavant, ils étaient stockés en texte brut, mais maintenant, ils sont hachés à l'aide de l'algorithme Argon2.

### Qu'est-ce que le hachage de mot de passe ?

Le hachage de mot de passe est une technique de sécurité essentielle pour protéger les informations sensibles, telles que les mots de passe, stockées dans une base de données.
Plutôt que de stocker les mots de passe en texte brut, on utilise des fonctions de hachage pour les transformer en chaînes de caractères apparemment aléatoires, appelées hachés.

Contrairement à l'encodage ou au cryptage, le hachage est une opération à sens unique :

| Opération | Opération inverse |
| --------- | ----------------- |
| encoder   | décoder           |
| crypter   | décrypter         |
| hacher    | ~~déhacher~~      |

### Avantages du hachage de mot de passe :

- Sécurité améliorée : En cas d'accès non autorisé à la base de données, les attaquants ne peuvent pas récupérer les mots de passe d'origine car seuls les hachés sont stockés.
- Protection contre les attaques par force brute : Les fonctions de hachage, en particulier celles comme Argon2, sont conçues pour ralentir les attaques par force brute en rendant le processus de hachage intensif en ressources.
- Confidentialité accrue : Même les administrateurs du système ne peuvent pas connaître les mots de passe réels des utilisateurs, renforçant ainsi la confidentialité.

### Structure d'un mot de passe haché avec Argon2

Un mot de passe haché avec Argon2 est structuré comme suit :

```
$argon2id$v=19$m=19456,t=2,p=1$nz6t40CzCcijUhj3Ntpz9A$4DW+9sqLdKvj27E3JYbImIIfZAadyDGXHFiwpBHli4s
```

- `argon2id` : Indique l'utilisation de l'algorithme Argon2 avec la variante `id`.
- `v=19` : Version du format de hachage.
- `m=19456,t=2,p=1` : Paramètres de coût, indiquant la mémoire (en kilooctets), le temps et le parallélisme utilisés lors du hachage.
- `nz6t40CzCcijUhj3Ntpz9A` : Sel (une "perturbation") généré de manière aléatoire.
- `4DW+9sqLdKvj27E3JYbImIIfZAadyDGXHFiwpBHli4s` : Haché proprement dit.

Il est important de noter que comprendre tous les détails de cette structure n'est pas nécessaire pour les utilisateurs réguliers. Cependant, la présence de ces informations dans le haché permet de générer un haché avec la même configuration. Cette propriété est cruciale lors de la vérification des mots de passe pendant le processus d'authentification.

Lorsque vous vous connectez avec votre mot de passe, le système utilise ces détails pour recréer le même haché et le compare à celui stocké en base de données. Si les hachés correspondent, cela signifie que le mot de passe fourni est correct, tout en évitant de stocker le mot de passe réel. C'est une pratique essentielle pour assurer la sécurité des mots de passe des utilisateurs.

## Comment ça se code ?

Si vous souhaitez explorer les détails du code lié à la gestion des mots de passe hachés dans cette branche, voici un aperçu des modifications apportées dans le [diff GitHub](https://github.com/WildCodeSchool/workshop-js-auth/compare/hash-password).

### Modifications sur la création d'utilisateurs

- Middleware de hachage :

  - J'ai introduit un nouveau middleware, appelé `hashPassword`.
  - Ce middleware utilise la bibliothèque `argon2` pour hacher le mot de passe fourni lors de la création d'un nouvel utilisateur.
  - Le mot de passe haché est ensuite stocké dans la requête à la place du mot de passe en texte brut.

```js
const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    // Extraction du mot de passe de la requête
    const { password } = req.body;

    // Hachage du mot de passe avec les options spécifiées
    const hashedPassword = await argon2.hash(password, hashingOptions);

    // Remplacement du mot de passe non haché par le mot de passe haché dans la requête
    req.body.hashed_password = hashedPassword;

    // Oubli du mot de passe non haché de la requête : il restera un secret même pour notre code dans les autres actions
    req.body.password = undefined;

    next();
  } catch (err) {
    next(err);
  }
};
```

- Utilisation du middleware :

  - Ce middleware est utilisé dans le fichier des routes.
  - Lorsqu'un nouvel utilisateur est enregistré, le middleware est appelé pour hacher le mot de passe avant de le stocker en base de données.

```js
router.post("/api/users", authActions.hashPassword, userActions.add);
```

### Modifications sur la connexion

- Vérification du mot de passe :

  - Lorsqu'un utilisateur tente de se connecter, le mot de passe fourni est comparé au mot de passe haché stocké en base de données.
  - La bibliothèque `argon2` est utilisée pour effectuer cette comparaison de manière sécurisée.

```js
const verified = await argon2.verify(user.hashed_password, req.body.password);
```

- Gestion des erreurs :

  - J'ai mis en place des mécanismes de gestion d'erreurs pour gérer les cas où l'utilisateur fournit un mot de passe incorrect.

```js
if (verified) {
  // Respond with the user in JSON format (but without the hashed password)
  const { hashed_password, ...userWithoutHashedPassword } = user;

  res.json(userWithoutHashedPassword);
} else {
  res.sendStatus(422);
}
```

En explorant le [diff GitHub](https://github.com/WildCodeSchool/workshop-js-auth/compare/hash-password), vous pourrez voir plus en détail les lignes de code modifiées dans les fichiers concernés. Cela vous permettra de comprendre comment la gestion des mots de passe a été implémentée dans cette branche du projet.

## Next

Ces modifications apportent une couche supplémentaire de sécurité en adoptant le hachage de mots de passe avec l'algorithme Argon2.

Cependant, la sécurité ne s'arrête pas là.
Dans la prochaine étape passionnante, nous explorerons la sécurisation du processus de connexion en utilisant JSON Web Tokens (JWT).

[GO 🚀](JWT)
