/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [logged, setLogged] = useState(
    localStorage.getItem("accessToken") ? true : false
  );
  const [user, setUser] = useState(
    localStorage.getItem("user") ? localStorage.getItem("user") : ""
  );
  function storeTokens(accessToken, refreshToken, username) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", username);
  }
  function logout() {
    setLogged(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser("");
    navigate("/");
  }

  async function logUser({ username, password }) {
    const res = await fetch("http://localhost:8000/auth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      const { access, refresh } = data;
      storeTokens(access, refresh, username);
      setLogged(true);
      navigate("/");
      setUser(username);
      toast.success("Successfully logged in");
    }
    console.log(username, password);
  }

  async function registerUser({
    username,
    firstname,
    lastname,
    password,
    email,
  }) {
    const res = await fetch("http://localhost:8000/auth/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        first_name: firstname,
        last_name: lastname,
        topics_selected: "",
        profile_pic: "",
      }),
    });
    if (res.status === 201) {
      toast.success("User saved Successfully!");
      navigate("/login");
      setLogged(true);
    }
  }
  return (
    <AuthContext.Provider
      value={{
        name: "Fekadu",
        logUser,
        registerUser,
        logged,
        logout,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside of the AuthProvider");
  return context;
}

export { AuthProvider, useAuth };