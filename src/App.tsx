import React, { useState, useEffect, type JSX } from "react";
import { supabase } from "./supabaseClient";
import Login from "./Components/login";
import type { Session } from "@supabase/supabase-js";
import Homepage from "./Components/homePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App(): JSX.Element {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, get session & listen for changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      {session ? (
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* You can add more routes later, e.g.: */}
          {/* <Route path="/category/:id" element={<CategoryPage />} /> */}
        </Routes>
      ) : (
        <Login />
      )}
    </BrowserRouter>
  );
}
