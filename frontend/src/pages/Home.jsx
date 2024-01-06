import { useRef } from "react";
import {
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router-dom";

function Home() {
  const items = useLoaderData();

  const titleRef = useRef();

  const { user } = useOutletContext();

  const revalidator = useRevalidator();

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Appel à l'API pour demander une connexion
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/items`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: titleRef.current.value,
            userId: user.id,
          }),
        }
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
