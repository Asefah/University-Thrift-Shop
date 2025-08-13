import React, { useState, useEffect, type JSX } from "react";
import { supabase } from "./supabaseClient";
import ImgUpload from "./Components/imgUpload";
import Login from "./Components/login";
import type { Session } from "@supabase/supabase-js";

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
    <div>
      {session ? <ImgUpload /> : <Login />}
    </div>
  );
}
