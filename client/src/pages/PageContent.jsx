import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function PageContent({ slug }) {
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api(`/pages/${slug}`).then(setPage).catch((e) => setError(e.message));
  }, [slug]);
  if (error) return <p>{error}</p>;
  if (!page) return <p>Loading…</p>;
  return (
    <section>
      <h1>{page.title}</h1>
      {page.body.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
    </section>
  );
}
