import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";

const blank = { name: "", category: "", description: "", price: "", image: "", available: true };

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || "");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editing, setEditing] = useState(blank);
  const [pages, setPages] = useState({ home: null, about: null });

  const logout = () => { sessionStorage.removeItem("token"); setToken(""); };

  const load = useCallback(async () => {
    try {
      setProducts(await api("/admin/products", { token }));
      setMessages(await api("/admin/messages", { token }));
      const [home, about] = await Promise.all([api("/pages/home"), api("/pages/about")]);
      setPages({ home, about });
    } catch (e) {
      setError(e.message);
      if (e.message === "Unauthorized") logout();
    }
  }, [token]);

  useEffect(() => { if (token) load(); }, [token, load]);

  const doLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await api("/admin/login", { method: "POST", body: login });
      sessionStorage.setItem("token", token);
      setToken(token);
      setError("");
    } catch (err) { setError(err.message); }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      const body = { ...editing, price: Number(editing.price) };
      if (editing.id) await api(`/admin/products/${editing.id}`, { method: "PUT", body, token });
      else await api("/admin/products", { method: "POST", body, token });
      setEditing(blank);
      load();
    } catch (err) { setError(err.message); }
  };

  const removeProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api(`/admin/products/${id}`, { method: "DELETE", token });
    load();
  };

  const savePage = async (slug) => {
    const p = pages[slug];
    try {
      await api(`/admin/pages/${slug}`, { method: "PUT", body: { title: p.title, body: p.body }, token });
      setError("");
    } catch (err) { setError(err.message); }
  };

  if (!token)
    return (
      <form onSubmit={doLogin} className="form">
        <h1>Admin login</h1>
        <input placeholder="Username" value={login.username} onChange={(e) => setLogin({ ...login, username: e.target.value })} />
        <input type="password" placeholder="Password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
        <button className="btn">Log in</button>
        {error && <p className="error">{error}</p>}
      </form>
    );

  const f = (k) => (e) => setEditing({ ...editing, [k]: e.target.value });

  return (
    <section>
      <h1>Admin <button onClick={logout}>Log out</button></h1>
      {error && <p className="error">{error}</p>}

      <h2>{editing.id ? "Edit product" : "Add product"}</h2>
      <form onSubmit={saveProduct} className="form">
        <input placeholder="Name" value={editing.name} onChange={f("name")} required />
        <input placeholder="Category" value={editing.category} onChange={f("category")} required />
        <textarea placeholder="Description" value={editing.description} onChange={f("description")} />
        <input type="number" min="0" step="0.01" placeholder="Price" value={editing.price} onChange={f("price")} required />
        <input placeholder="Image URL" value={editing.image} onChange={f("image")} />
        <label><input type="checkbox" checked={!!editing.available} onChange={(e) => setEditing({ ...editing, available: e.target.checked })} /> Available</label>
        <div>
          <button className="btn">{editing.id ? "Update" : "Add"}</button>
          {editing.id && <button type="button" onClick={() => setEditing(blank)}>Cancel</button>}
        </div>
      </form>

      <h2>Products</h2>
      <table>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}{!p.available && " (hidden)"}</td><td>{p.category}</td><td>₹{p.price}</td>
              <td><button onClick={() => setEditing({ ...p, available: !!p.available })}>Edit</button>
                  <button onClick={() => removeProduct(p.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Pages</h2>
      {["home", "about"].map((slug) => pages[slug] && (
        <div className="form" key={slug}>
          <h3>{slug}</h3>
          <input value={pages[slug].title} onChange={(e) => setPages({ ...pages, [slug]: { ...pages[slug], title: e.target.value } })} />
          <textarea rows="6" value={pages[slug].body} onChange={(e) => setPages({ ...pages, [slug]: { ...pages[slug], body: e.target.value } })} />
          <button onClick={() => savePage(slug)}>Save {slug}</button>
        </div>
      ))}

      <h2>Messages</h2>
      {messages.map((m) => (
        <article className="card" key={m.id}>
          <strong>{m.name}</strong> · {m.email} {m.phone && `· ${m.phone}`} · <small>{m.created_at}</small>
          <p>{m.message}</p>
        </article>
      ))}
    </section>
  );
}
