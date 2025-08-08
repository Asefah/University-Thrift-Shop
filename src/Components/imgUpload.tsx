import React, { useState, useEffect, type JSX } from "react";
import { supabase } from "../supabaseClient";

interface ImageRow {
  id?: number;
  url: string;
  created_at?: string;
}

export default function ImgUpload(): JSX.Element {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [gallery, setGallery] = useState<ImageRow[]>([]);

  const fetchImages = async (): Promise<void> => {
    const { data, error } = await supabase
      .from("images")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching images:", error.message);
      return;
    }
    setGallery(data || []);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage("");

    const fileName = `${Date.now()}-${file.name}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) {
        console.error('Upload error details:', uploadError);
        setErrorMessage(uploadError.message);
        setUploading(false);
        return;
    }


    // Get public URL
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;
    setImageUrl(publicUrl);

    // Save URL to database
    const { error: insertError } = await supabase
      .from("images")
      .insert<ImageRow>({ url: publicUrl });

    if (insertError) {
      setErrorMessage(insertError.message);
    } else {
      await fetchImages(); // Refresh gallery
    }

    setUploading(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Upload Image to Supabase</h2>
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

