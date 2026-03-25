import { useState } from "react";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // simple check (for now)
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login 🔐</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "10px", margin: "10px" }}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", margin: "10px" }}
      />

      <br />

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          backgroundColor: "green",
          color: "white",
          border: "none",
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;