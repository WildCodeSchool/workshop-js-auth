import { Link, Outlet } from "react-router-dom";

import "./App.css";
import { useState } from "react";

function App() {
  const [user, setUser] = useState();

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {user == null ? (
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
                  setUser(null);
                }}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
      {user && <p>Hello {user.email}</p>}
      <main>
        <Outlet context={{ user, setUser }} />
      </main>
    </>
  );
}

export default App;
