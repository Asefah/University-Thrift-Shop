import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // adjust path if needed

interface AccountSetupProps {
  userEmail: string;
  userId: string; // Must be auth.users.id
}

export default function AccountSetup({ userEmail, userId }: AccountSetupProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      alert("First name is required");
      return;
    }

    if (!userId) {
      alert("No user ID found. Are you logged in?");
      return;
    }

    // Upsert into Supabase profiles table
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId, // primary key linked to auth.users
          first_name: firstName,
          last_name: lastName,
          year,
          major,
        },
        { onConflict: "id" } // update if row already exists
      );

    if (error) {
      console.error("Error saving profile:", error.message);
      alert("There was a problem saving your profile.");
    } else {
      alert("Profile saved successfully!");
      // TODO: optionally redirect to image upload or dashboard
    }
  };

  return (
    <div>
      <h2>Welcome {userEmail}!</h2>
      <p>Finish setting up account details.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name (required):</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <label>Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select year</option>
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div>
          <label>Major:</label>
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          />
        </div>

        <p>
          By clicking continue, you agree to our{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          .
        </p>

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
