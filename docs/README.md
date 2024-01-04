## Vers l'infini et au-delà

Dans cet atelier sur l'authentification (auth), plongez dans l'architecture d'une application web existante. Explorez la création de compte utilisateur et la requête de connexion en utilisant comme grille de lecture le schéma ci-dessous, illustrant l'interaction entre le client (React et fetch), le serveur web (Express et un client de base de données), le serveur de base de données.

![Architecture Web](/assets/web.png/)
{: .text-center }

Clonez ce dépôt grâce au lien fourni au début de cette page ⬆, dans la section <a href="#input-clone"><i class="bi bi-code-slash"></i> Code</a>
{: .alert-info }

Créez ensuite les fichiers `backend/.env` et `frontend/.env`, puis exécutez les commandes habituelles (dans le bon répertoire 😉) :

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

Dans cette première partie, explorez la création de compte utilisateur. Consultez le schéma ci-dessus, représentant l'architecture de l'application web. Remplissez la grille ci-dessous en indiquant les fichiers associés à chaque composant du schéma.

| Composant   | Fichier associé |
| ----------- | --------------- |
| React       |                 |
| fetch       |                 |
| Express     |                 |
| requête SQL |                 |

<details markdown=block>
<summary markdown=span>
La solution ?
</summary>

| Composant   | Fichier associé                            |
| ----------- | ------------------------------------------ |
| React       | frontend/src/pages/Register.jsx            |
| fetch       | frontend/src/pages/Register.jsx (ligne 31) |
| Express     | backend/controllers/userControllers.js     |
| requête SQL | backend/models/UserManager.js (create)     |

</details>

## Se connecter

![Architecture Web](/assets/web.png/)
{: .text-center }

Dans cette seconde partie, concentrez-vous sur la requête de connexion. Utilisez le schéma ci-dessus comme référence et remplissez la grille ci-dessous en identifiant les fichiers associés à chaque composant.

| Composant   | Fichier associé |
| ----------- | --------------- |
| React       |                 |
| fetch       |                 |
| Express     |                 |
| requête SQL |                 |

<details markdown=block>
<summary markdown=span>
La solution ?
</summary>

| Composant   | Fichier associé                             |
| ----------- | ------------------------------------------- |
| React       | frontend/src/pages/Login.jsx                |
| fetch       | frontend/src/pages/Login.jsx (ligne 20)     |
| Express     | backend/controllers/authControllers.js      |
| requête SQL | backend/models/UserManager.js (readByEmail) |

</details>
