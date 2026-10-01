import { useState } from "react";
import { api } from "../api.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Sending…");
    try {
      await api("/contact", { method: "POST", body: form });
      setStatus("Thanks! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <section>
      <h1>Contact Us</h1>
      <form onSubmit={submit} className="form">
        <input placeholder="Name" value={form.name} onChange={set("name")} required />
        <input type="email" placeholder="Email" value={form.email} onChange={set("email")} required />
        <input placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} />
        <textarea placeholder="Message" rows="5" value={form.message} onChange={set("message")} required />
        <button className="btn">Send</button>
        {status && <p>{status}</p>}
      </form>
    </section>
  );
}
