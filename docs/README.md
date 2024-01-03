## Dans les épisodes précédents

![](/assets/web.png/)
{: .text-center }

Intro pour rappeler qui fait quoi et expliquer les requêtes de l'authentification :

- React envoie une requête POST "register" pour qu'Express demande la création d'un utilisateur dans la base de données
- React envoie une requête POST "login" pour qu'Express compare les valeurs envoyées dans la requête et celles de la base de données

Commençons par la création d'un compte utilisateur.

Clone ce dépôt grâce au lien donné au début de cette page ⬆ à la section <a href="#input-clone"><i class="bi bi-code-slash"></i> Code</a>
{: .alert-info }

Créé ensuite les fichiers `backend/.env` et `frontend/.env`, et lance ensuite les commandes habituelles (dans le bon répertoire 😉) :

```bash
npm install
npm run db:migrate
npm run dev
```

La page [http://localhost:3000/register](http://localhost:3000/register) devrait être fonctionnelle (adapte le port au besoin).
Tu peux la tester en créant un compte utilisateur.

Le code complet de la partie React est disponible dans [Register.jsx](https://github.com/WildCodeSchool/workshop-js-auth/blob/main/frontend/src/pages/Register.jsx).
Tu peux étudier le code par toi-même, et en discuter avec d'autres personnes.

Mais si tu le souhaites, je peux te montrer comment je l'ai construit étape par étape.

## Envoyer la requête

```jsx
function Register() {
  // détails du composant
}

export default Register;
```

Dans notre première étape, nous avons créé le composant `Register` sans aucune fonctionnalité spécifique.
C'est simplement un squelette pour commencer notre voyage.

```jsx
function Register() {
  return (
    <form>
      <div>
        <label htmlFor="email">email</label>
        <input type="email" id="email" />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input type="password" id="password" />
      </div>
      <div>
        <label htmlFor="confirm-password">confirm password</label>
        <input type="password" id="confirm-password" />
      </div>
      <button type="submit">Send</button>
    </form>
  );
}

export default Register;
```

Dans notre deuxième étape, nous avons ajouté un formulaire de base avec des champs pour l'email, le mot de passe et la confirmation du mot de passe.

Cependant, il n'y a pas encore de gestion des données ou de soumission.

```jsx
function Register() {
  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Appel à l'API pour créer un nouvel utilisateur
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: /* ??? */,
          password: /* ??? */,
        }),
      });

      // Gérer la réponse
      // ...
    } catch (err) {
      // Log des erreurs possibles
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">email</label>
        <input type="email" id="email" />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input type="password" id="password" />
      </div>
      <div>
        <label htmlFor="confirm-password">confirm password</label>
        <input type="password" id="confirm-password" />
      </div>
      <button type="submit">Send</button>
    </form>
  );
}

export default Register;
```

Dans cette 3e version, nous avons introduit la gestion de la soumission du formulaire.
Lorsque l'utilisateur soumet le formulaire, nous essayons de créer un nouvel utilisateur en envoyant une requête à une API.

Cependant, nous ne transmettons pas encore les données du formulaire dans cette requête.

```jsx
import { useRef } from "react";

function Register() {
  // Référence pour le champ email
  const emailRef = useRef();

  // ...

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">email</label>
        <input ref={emailRef} type="email" id="email" />
      </div>
      {/* ... */}
    </form>
  );
}

export default Register;
```

Dans notre quatrième étape, nous avons ajouté une référence pour capturer la valeur du champ email.

Tu as peut-être plutôt l'habitude d'utiliser un state.
Une référence permet de récupérer plus facilement la valeur du champ lors de la soumission du formulaire.
Mais nous verrons plus loin avec le mot de passe que le state présente d'autres avantages.
{: .alert-info }

Nous pouvons déjà compléter l'appel d'API en intégrant la valeur courante du champ email au moment de la soumission :

```jsx
// Appel à l'API pour créer un nouvel utilisateur
const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: emailRef.current.value,
    password: /* ??? */,
  }),
});
```

Ici, nous avons utilisé la référence pour obtenir la valeur de l'email, mais nous n'avons pas encore géré le mot de passe.
Cette fois, le moment est bien choisi pour utiliser un state :

```jsx
import { useRef, useState } from "react";

function Register() {
  // Référence pour le champ email
  const emailRef = useRef();

  // États pour le mot de passe et la confirmation du mot de passe
  const [password, setPassword] = useState("");

  // Gestionnaire de changement du mot de passe
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // ...

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">email</label>
        <input ref={emailRef} type="email" id="email" />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      {/* ... */}
    </form>
  );
}

export default Register;
```

Dans cette étape, nous avons introduit un état local pour le mot de passe et un gestionnaire de changement associé.
Cela nous permet de stocker la valeur du mot de passe et de l'actualiser en temps réel lorsqu'elle est modifiée dans le champ.
Tu peux gérer le champ de confirmation du mot de passe de manière similaire.

Le code est plus complexe qu'avec une référence, mais permet d'envisager des fonctionnalités supplémentaires pour le mot de passe :

```jsx
import { useRef, useState } from "react";

function Register() {
  // ...

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      <div>
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
        {/* Indicateur de force du mot de passe */}
        {password.length >= 8 ? "✅" : "❌"} {`length: ${password.length} >= 8`}
      </div>
      <div>
        <label htmlFor="confirm-password">confirm password</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {/* Indicateur de correspondance avec le mot de passe */}
        {password === confirmPassword ? "✅" : "❌"}
      </div>
    </form>
  );
}

export default Register;
```

Dans cet exemple, nous avons inclus un indicateur de force du mot de passe et un indicateur de correspondance entre le mot de passe et la confirmation du mot de passe.
Ce sont des exemples "simples" : tu pourrais envisager des indicateurs beaucoup plus avancés (présence de majuscules, de nombre...), et toujours mis à jour en temps réel à chaque frappe du clavier.

L'intégration du state password nous permet de finaliser l'appel à l'API.
Cela complète le composant de création d'un nouvel utilisateur :

```jsx
// Appel à l'API pour créer un nouvel utilisateur
const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: emailRef.current.value,
    password,
  }),
});
```

## Répondre à la requête

Détailler la partie express/sql

## À toi de jouer

Créé la page "login" dans l'application React.
Uniquement la partie React dans un premier temps : la partie Express/SQL viendra dans une 2e partie.

Le formulaire a besoin uniquement d'un email et d'un mot de passe, sans vérification avant la soumission.
{: .alert-info }

<style>
    details + * {
        display: none;
    }
    details[open] + * {
        display: initial;
    }
</style>

<details>
<summary>
Un peu d'aide ?
</summary>
</details>

```jsx
// Login.jsx

import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  // Références pour les champs email et mot de passe
  const emailRef = useRef();
  const passwordRef = useRef();

  // Hook pour la navigation
  const navigate = useNavigate();

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Appel à l'API pour demander une connexion
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailRef.current.value,
            password: passwordRef.current.value,
          }),
        }
      );

      // Redirection vers la page de connexion si la création réussit
      if (response.status === 200) {
        navigate("/");
      } else {
        // Log des détails de la réponse en cas d'échec
        console.info(response);
      }
    } catch (err) {
      // Log des erreurs possibles
      console.error(err);
    }
  };

  // Rendu du composant formulaire
  return (
    <form onSubmit={handleSubmit}>
      <div>
        {/* Champ pour l'email */}
        <label htmlFor="email">email</label> <input ref={emailRef} type="email" id="email" />
      </div>
      <div>
        {/* Champ pour le mot de passe */}
        <label htmlFor="password">password</label> <input type="password" id="password" ref={passwordRef} />
      </div>
      {/* Bouton de soumission du formulaire */}
      <button type="submit">Send</button>
    </form>
  );
}

export default Login;
```
