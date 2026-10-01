import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api("/products").then(setProducts).catch((e) => setError(e.message));
  }, []);

  const groups = products.reduce((acc, p) => {
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {});

  return (
    <section>
      <h1>Menu</h1>
      {error && <p className="error">{error}</p>}
      {Object.entries(groups).map(([cat, items]) => (
        <div key={cat}>
          <h2>{cat}</h2>
          <div className="grid">
            {items.map((p) => (
              <article className="card" key={p.id}>
                {p.image && <img src={p.image} alt={p.name} loading="lazy" />}
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <strong>₹{p.price}</strong>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
