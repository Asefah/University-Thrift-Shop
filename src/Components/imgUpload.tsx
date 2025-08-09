import React, { useState, useEffect, type JSX } from "react";
import { supabase } from "../supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

interface ImageRow {
  id?: number;
  url: string;
  created_at?: string;
}

export default function ImgUpload(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [gallery, setGallery] = useState<ImageRow[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fetch images from Supabase
  const fetchImages = async (): Promise<void> => {
    const { data, error } = await supabase
      .from("images")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setGallery(data || []);
    else console.error("Error fetching images:", error.message);
  };

  // Load session on mount + listen for changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (data.session) setUser(data.session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    fetchImages();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Handle login
  const handleLogin = async (): Promise<void> => {
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setErrorMessage(error.message);
  };

  // Handle logout
  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage("");

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) {
      setErrorMessage(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    const { error: insertError } = await supabase
      .from("images")
      .insert({
        url: publicUrl,
        user_id: user?.id,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      setErrorMessage(insertError.message);
    } else {
      setImageUrl(publicUrl);
      await fetchImages();
    }

    setUploading(false);
  };

  // If not logged in, show login form
  if (!user) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Please Log In</h2>
        <input
          type="email"
          placeholder="Your @umass.edu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />
        <button onClick={handleLogin}>Log In</button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    );
  }

  // If logged in, show uploader + gallery
  return (
    <div style={{ textAlign: "center" }}>
      <h2>Upload Image to Supabase</h2>
      <p>
        Welcome, {user.email} <button onClick={handleLogout}>Log Out</button>
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={imageUrl}
            alt="Uploaded Preview"
            style={{ maxWidth: "300px", borderRadius: "10px" }}
          />
        </div>
      )}

      <h3 style={{ marginTop: "40px" }}>Gallery</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {gallery.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt="Gallery"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
