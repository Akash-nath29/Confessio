import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./css/Hero.css";

const Hero = () => {
  const [confessions, setConfessions] = useState([]);

  useEffect(() => {
    const fetchConfessions = async () => {
      const { data, error } = await supabase
        .from("confession")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Error fetching confessions:", error);
      else setConfessions(data);
    };
    fetchConfessions();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="hero-brand text-center mb-4">Confessions</h1>
      <ul className="confession-list">
        {confessions.map((confession) => (
          <li className="confession-item mb-3" key={confession.uid}>
            <p className="confession-content">{confession.content}</p>
            <p className="confession-timestamp">
              {new Date(confession.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Hero;
