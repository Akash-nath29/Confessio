import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./css/Hero.css";

const Hero = () => {
  const [confessions, setTodos] = useState([]);
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("confession")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Error fetching todos:", error);
      else setTodos(data);
    };
    fetchTodos();
  }, []);
  return (
    <>
      <div>
        <h1 className="hero-brand">Confessions</h1>
      </div>
      <ul className="list-group">
        {confessions.map((confession) => (
          <li
            className="list-group-item d-flex align-items-center justify-content-between"
            key={confession.uid}
          >
            <p>{confession.content}</p>
          </li>
        ))}
        <li>Demo Confession</li>
      </ul>
    </>
  );
};

export default Hero;
