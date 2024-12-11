import { Link, Outlet } from "react-router-dom";

import "./App.css";
import { useState } from "react";

type User = {
  id: number;
  email: string;
  is_admin: boolean;
};

type Auth = {
  user: User;
  token: string;
};

function App() {
  const [auth, setAuth] = useState(null as Auth | null);

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {auth == null ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <li>
              <button
                type="button"
                onClick={() => {
                  setAuth(null);
                }}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
      {auth && <p>Hello {auth.user.email}</p>}
      <main>
        <Outlet context={{ auth, setAuth }} />
      </main>
    </>
  );
}

export default App;
