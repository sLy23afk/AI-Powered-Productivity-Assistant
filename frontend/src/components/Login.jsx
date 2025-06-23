import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regMessage, setRegMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      console.log("Login response:", response);
      const { access_token } = response.data;
      if (!access_token) {
        alert("Login failed: No access token received");
        return;
      }
      setToken(access_token);
      localStorage.setItem("token", access_token);
      navigate("/"); // Redirect to home after login
    } catch (error) {
      console.error("Login failed", error);
      console.error("Full error object:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        alert(`Login failed: ${error.response.data.message || "Please check your credentials."}`);
      } else {
        alert("Login failed. Please check your credentials.");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setRegMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        username: regUsername,
        email: regEmail,
        password: regPassword,
      });
      setRegMessage(response.data.message || "Registration successful");
      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
    } catch (error) {
      console.error("Registration failed", error);
      if (error.response && error.response.data && error.response.data.message) {
        setRegMessage(error.response.data.message);
      } else {
        setRegMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      <div className="registration-container" style={{ marginTop: "2rem" }}>
        <h2>📝 Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={regUsername}
            required
            onChange={(e) => setRegUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={regEmail}
            required
            onChange={(e) => setRegEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={regPassword}
            required
            onChange={(e) => setRegPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={regConfirmPassword}
            required
            onChange={(e) => setRegConfirmPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
        {regMessage && <p>{regMessage}</p>}
      </div>
    </div>
  );
}

export default Login;
