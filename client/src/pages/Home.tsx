import { useRef } from "react";

import type { FormEventHandler } from "react";

import {
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router-dom";

type User = {
  id: number;
  email: string;
  is_admin: boolean;
};

type Item = {
  id: number;
  title: string;
  user_id: number;
};

function Home() {
  const items = useLoaderData() as Item[];

  const titleRef = useRef<HTMLInputElement>(null);

  const { user } = useOutletContext() as { user: User | null };

  const revalidator = useRevalidator();

  // Gestionnaire de soumission du formulaire
  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      // Appel à l'API pour demander une connexion
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/items`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title:
              /* rendering process ensures the ref is defined before the form is submitted */
              (titleRef.current as HTMLInputElement).value,
            userId:
              /* conditional rendering ensures user is not null */
              (user as User).id,
          }),
        },
      );

      // Recharge la page si la création réussit
      if (response.status === 201) {
        revalidator.revalidate();
      } else {
        // Log des détails de la réponse en cas d'échec
        console.info(response);
      }
    } catch (err) {
      // Log des erreurs possibles
      console.error(err);
    }
  };

  return (
    <>
      {user != null && (
        <form onSubmit={handleSubmit}>
          <div>
            {/* Champ pour le title */}
            <label htmlFor="title">title</label>{" "}
            <input ref={titleRef} type="text" id="title" />
          </div>
          {/* Bouton de soumission du formulaire */}
          <button type="submit">Send</button>
        </form>
      )}
      <ul>
        {items.map(({ id, title }) => (
          <li key={id}>{title}</li>
        ))}
      </ul>
    </>
  );
}

export default Home;
