import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // your initialized Supabase client

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Sign up new user
  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    setMessage(error ? error.message : "Sign-up successful! Check your email.");
  };

  // Log in existing user
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setMessage(error ? error.message : "Logged in!");
  };

  // Log out
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    setMessage(error ? error.message : "Logged out.");
  };

  return (
    <div style={{ textAlign: "center", maxWidth: "300px", margin: "auto" }}>
      <h2>Login / Sign Up</h2>

      {/* Email input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", margin: "5px 0", padding: "8px" }}
      />

      {/* Password input */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", margin: "5px 0", padding: "8px" }}
      />

      {/* Auth buttons */}
      <div style={{ margin: "10px 0" }}>
        <button onClick={handleSignUp} style={{ marginRight: "5px" }}>
          Sign Up
        </button>
        <button onClick={handleSignIn}>Log In</button>
      </div>

      {/* Logout button */}
      <button onClick={handleSignOut} style={{ marginTop: "5px" }}>
        Log Out
      </button>

      {/* Status / error messages */}
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
