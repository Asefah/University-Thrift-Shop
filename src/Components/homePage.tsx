import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function Homepage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Categories</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg p-6 cursor-pointer transition"
            onClick={() => navigate(`/category/${cat.id}`)}
          >
            <h2 className="text-xl font-semibold">{cat.name}</h2>
            {cat.description && (
              <p className="text-gray-500 text-sm mt-2">{cat.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
