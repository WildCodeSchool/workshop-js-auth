import { useRef, useState } from "react";

import type { ChangeEventHandler, FormEventHandler } from "react";

import { useNavigate } from "react-router-dom";

function Register() {
  // Référence pour le champ email
  const emailRef = useRef<HTMLInputElement>(null);

  // États pour le mot de passe et la confirmation du mot de passe
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Hook pour la navigation
  const navigate = useNavigate();

  // Gestionnaire de changement du mot de passe
  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setPassword(event.target.value);
  };

  // Gestionnaire de changement de la confirmation du mot de passe
  const handleConfirmPasswordChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setConfirmPassword(event.target.value);
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      // Appel à l'API pour créer un nouvel utilisateur
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email:
              /* rendering process ensures the ref is defined before the form is submitted */
              (emailRef.current as HTMLInputElement).value,
            password,
          }),
        },
      );

      // Redirection vers la page de connexion si la création réussit
      if (response.status === 201) {
        navigate("/login");
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
        <label htmlFor="email">email</label>{" "}
        <input ref={emailRef} type="email" id="email" />
      </div>
      <div>
        {/* Champ pour le mot de passe */}
        <label htmlFor="password">password</label>{" "}
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />{" "}
        {/* Indicateur de force du mot de passe */}
        {password.length >= 8 ? "✅" : "❌"} {`length: ${password.length} >= 8`}
      </div>
      <div>
        {/* Champ pour la confirmation du mot de passe */}
        <label htmlFor="confirm-password">confirm password</label>{" "}
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />{" "}
        {/* Indicateur de correspondance avec le mot de passe */}
        {password === confirmPassword ? "✅" : "❌"}
      </div>
      {/* Bouton de soumission du formulaire */}
      <button type="submit">Send</button>
    </form>
  );
}

export default Register;
