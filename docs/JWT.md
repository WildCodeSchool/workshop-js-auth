[revoir l'épisode précédent](HASHING-PASSWORD)

## Sécuriser les requêtes

Lors de l'interaction avec un serveur, garantir que les requêtes proviennent d'utilisateurs authentifiés et autorisés est une étape cruciale pour assurer la sécurité de votre application.

Dans notre exemple, une vulnérabilité potentielle existe dans le fichier `server/src/modules/item/itemActions.ts`. Actuellement, la vérification de l'authentification se fonde sur la présence de `req.body.userId` :

```js
// Rappel : router.post("/api/items", itemActions.add);

const add: RequestHandler = async (req, res, next) => {
  // Autorisé uniquement si authentifié... mais est-ce vraiment le cas ?
  if (req.body.userId == null) {
    res.sendStatus(401);
    return;
  }

  // ...
};
```

Cette approche est vulnérable à des manipulations côté client.
Dans le code suivant (`frontend/src/pages/Home.tsx`), toute personne malveillante peut modifier la requête pour y injecter un ID de son choix :

```js
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
  method: "post",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: titleRef.current.value,
    userId: 42, // Le serveur pense que je suis le user 42
  }),
});
```

Pour renforcer la sécurité, nous adopterons une approche basée sur l'utilisation de JSON Web Tokens (JWT) côté serveur.
L'idée est de générer un jeton JWT côté serveur après l'authentification réussie d'un utilisateur, puis d'exiger ce jeton dans les en-têtes de toutes les requêtes ultérieures.

Changez de branche dans votre projet avec la commande Git :

```bash
git switch jwt
```

Relancez le projet :

```bash
npm install
npm run dev
```

Après ces étapes, connectez vous sur [http://localhost:3000/login](http://localhost:3000/login) (adaptez le port au besoin).
Vous pouvez créer un nouvel utilisateur depuis la page [http://localhost:3000/register](http://localhost:3000/register) si vous avez oublié votre mot de passe 😉.

Rien n'a changé en apparence, mais vous pouvez voir quelques modifications avec le [diff GitHub](https://github.com/WildCodeSchool/workshop-js-auth/compare/hash-password...jwt). Nous allons regarder en détail quelques points en repartant du login.

## Login 2.0

Côté serveur, la modification que nous avons apporté est de générer un jeton JWT lors du processus de connexion, plutôt que de renvoyer simplement les informations de l'utilisateur.

Avant la modification dans `server/src/modules/auth/authActions.ts` :

```js
const login: RequestHandler = async (req, res, next) => {
  // ... (votre code pour la validation de l'utilisateur)

  res.json(user);

  // ...
};
```

Après la modification :

```js
import jwt from "jsonwebtoken";

const login: Requesthandler = async (req, res, next) => {
  // ... (votre code pour la validation de l'utilisateur)

  const myPayload: MyPayload = {
    sub: user.id.toString(),
    isAdmin: user.is_admin,
  };

  const token = await jwt.sign(
    myPayload,
    process.env.APP_SECRET as string,
    {
      expiresIn: "1h",
    },
  );

  res.json({
    token,
    user: userWithoutHashedPassword,
  });

  // ...
};
```

Avec cette modification, au lieu de simplement renvoyer les informations de l'utilisateur (`res.json(user)`), vous générez un jeton JWT en utilisant une clé secrète (`APP_SECRET`) et les données pertinentes.
Dans cet exemple, l'identifiant de l'utilisateur et s'il est administrateur.
Le jeton est ensuite renvoyé au client avec les informations de l'utilisateur.

Vous pouvez ajuster les données incluses dans le jeton selon vos besoins, mais le but est de le garder minimaliste.
Il sera envoyé avec chaque requête, et doit être le plus léger possible.
Vous devez y intégrer le minimum d'information qui seront utiles ensuite à votre serveur.
{: .alert-warning }

Et le type `MyPayload` ? Nous y reviendrons un peu après (si tu es pressé, regarde `server/src/types/express/index.d.ts`... à tes risques et périls).

## Client 2.0

```js
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.token}`, // Inclusion du jeton JWT
  },
  body: JSON.stringify({
    title: titleRef.current.value,
  }),
});
```

Avec cette mise à jour côté client, chaque requête est désormais accompagnée du jeton JWT, renforçant ainsi la sécurité du processus d'authentification.
Le jeton ne peut être modifé sans la clé secrète pour le signer : le client ne peut plus usurper une identité sans casser l'authenticité du jeton.

## Authentication & Authorization

Pour sécuriser vos routes et garantir que seuls les utilisateurs authentifiés et autorisés accèdent à certaines fonctionnalités, vous pouvez créer des services d'authentification personnalisés.

```js
// Importation des services d'authentification pour les opérations de sécurité
import authActions from "./modules/auth/authActions";

// ...

// Cette route est protégée
router.post("/items", authActions.verifyToken, itemActions.add);
```

Dans cet extrait, le middleware `verifyToken` est utilisé pour s'assurer que seuls les utilisateurs authentifiés peuvent faire une requête POST à la route `/items`.
Le middleware `verifyToken` est responsable de la vérification de l'authenticité et de la validité du jeton d'authentification.

Dans `server/src/modules/auth/authActions.ts` :

```js
const verifyToken: RequestHandler = (req, res, next) => {
  try {
    // Vérifier la présence de l'en-tête "Authorization" dans la requête
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    // Vérifier que l'en-tête a la forme "Bearer <token>"
    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    // Vérifier la validité du token (son authenticité et sa date d'expériation)
    // En cas de succès, le payload est extrait et décodé
    req.auth = jwt.verify(token, process.env.APP_SECRET as string) as MyPayload;

    next();
  } catch (err) {
    console.error(err);

    res.sendStatus(401);
  }
};
```

Ce middleware `verifyToken` vérifie la présence de l'en-tête d'autorisation dans la requête, valide le format du jeton, et s'assure de l'authenticité et de la validité du jeton à l'aide de la clé secrète (`APP_SECRET`).

Si le jeton est valide, le "payload" est extrait et décodé, puis attaché à l'objet de requête (`req.auth`) pour une utilisation ultérieure. Par exemple, dans `itemActions.add` qui vient "après" (`next` en anglais) `authActions.verifyToken` sur la déclaration de la route :

```js
// Rappel : router.post("/api/items", authActions.verifyToken, itemActions.add);

const add: RequestHandler = async (req, res, next) => {
  // Nous savons qu'un utilisateur est authentifié
  // Autorisé uniquement si administrateur
  if (req.auth.isAdmin === false) {
    res.sendStatus(403);
    return;
  }

  // ...
};
```

Dans `itemActions.add`, la présence de l'objet `req.auth` (attaché par le middleware `verifyToken`) est utilisée pour autoriser uniquement les utilisateurs administrateurs à accéder à cette fonctionnalité.

Note que pour expliquer à TypeScript l'existence d'une clé `auth` sur `req`, nous avons du l'expliciter dans un fichier de déclaration de type en surchargeant les types d'Express (à voir dans `server/src/types/express/index.d.ts`). Cette partie est imposé par le fonctionnement du système, et nous avons "simplement" suivi la contrainte (après quelques heures de recherches sur les forums et les documentations d'Express et de TypeScript).

## Mur d'authentification

Reprenons le fichier `server/src/router.ts` :

```js
// Importation des services d'authentification pour les opérations de sécurité
import authActions from "./modules/auth/authActions";

// ...

// Cette route est protégée
router.post("/items", authActions.verifyToken, itemActions.add);
```

Dans cet exemple, le middleware `verifyToken` est utilisé sur une seule route.
Il existe un moyen simple de l'utiliser sur un ensemble de routes :

```js
// Importation des services d'authentification pour les opérations de sécurité
import authActions from "./modules/auth/authActions";

// Avant le mur
// Cette route n'est pas protégée
router.get("/items", itemActions.browse);

// ...

router.use(authActions.verifyToken); // Mur d'authentification

// Après le mur
// Cette route est protégée
router.post("/items", itemActions.add);
```

Dans cet exemple, le middleware `verifyToken` est utilisé comme un "mur d'authentification".
Avant ce mur, les routes sont accessibles sans authentification.
Après le mur, les routes sont protégées et nécessitent une authentification valide.

## Et le reste ?

Si vous souhaitez explorer les détails du code lié à la gestion des tokens JWT dans cette branche, les modifications apportées sont visibles dans le [diff GitHub](https://github.com/WildCodeSchool/workshop-js-auth/compare/hash-password...jwt).
