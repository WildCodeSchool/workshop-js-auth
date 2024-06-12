import { Link, Outlet } from "react-router-dom";

import "./App.css";
import { useState } from "react";

function App() {
  const [auth, setAuth] = useState();

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
