## Vers l'infini et au-delà

Dans cet atelier sur l'authentification (auth), plongez dans l'architecture d'une application web existante. Explorez la création de compte utilisateur et la requête de connexion en utilisant comme grille de lecture le schéma ci-dessous, illustrant l'interaction entre le client (React et fetch), le serveur web (Express et un client de base de données), le serveur de base de données.

![Architecture Web](/assets/web.png/)
{: .text-center }

Clonez ce dépôt grâce au lien fourni au début de cette page ⬆, dans la section <a href="#input-clone"><i class="bi bi-code-slash"></i> Code</a>
{: .alert-info }

Créez ensuite les fichiers `server/.env` et `client/.env`, puis exécutez les commandes habituelles (dans le bon répertoire 😉) :

```bash
npm install
npm run db:migrate
npm run dev
```

Les pages [http://localhost:3000/register](http://localhost:3000/register) et [http://localhost:3000/login](http://localhost:3000/login) devraient être fonctionnelles (adaptez le port au besoin).
Vous pouvez les tester en créant un compte utilisateur, et en vous connectant.

## Créer un compte utilisateur

![Architecture Web](/assets/web.png/)
{: .text-center }

Dans cette première partie, explorez la création de compte utilisateur.
Consultez le schéma ci-dessus, représentant l'architecture de l'application web. Remplissez la grille ci-dessous en indiquant les éléments clés pour chaque étape du schéma.

| Étape           | Réponse |
| --------------- | ------- |
| Composant React |         |
| body du fetch   |         |
| Action          |         |
| Repository      |         |

<details markdown=block>
<summary markdown=span>
La solution ?
</summary>

| Étape           | Réponse                                            |
| --------------- | -------------------------------------------------- |
| Composant React | client/src/pages/Register.tsx                      |
| body du fetch   | { email, password }                                |
| Action          | server/src/modules/user/userActions.ts             |
| Repository      | server/src/modules/user/userRepository.ts (create) |

</details>

## Se connecter

![Architecture Web](/assets/web.png/)
{: .text-center }

Dans cette seconde partie, concentrez-vous sur la requête de connexion.
Utilisez le schéma ci-dessus comme référence et remplissez la grille ci-dessous en identifiant les éléments associés à chaque étape.

| Étape           | Réponse |
| --------------- | ------- |
| Composant React |         |
| body du fetch   |         |
| Action          |         |
| Repository      |         |

<details markdown=block>
<summary markdown=span>
La solution ?
</summary>

| Composant       | Réponse                                                 |
| --------------- | ------------------------------------------------------- |
| Composant React | client/src/pages/Login.tsx                              |
| body du fetch   | { email, password }                                     |
| Action          | server/src/modules/auth/authActions.ts                  |
| Repository      | server/src/modules/user/userRepository.ts (readByEmail) |

</details>

## Sécurité

Si cette version du login est fonctionnelle, elle n'est pas du tout sécurisée.

Plusieurs étapes clés sont importantes à mettre en place, comme [hacher les mots de passes](HASHING-PASSWORD).
