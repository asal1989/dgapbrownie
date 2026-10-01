import { Link } from "react-router-dom";
import PageContent from "./PageContent.jsx";

export default function Home() {
  return (
    <>
      <PageContent slug="home" />
      <Link className="btn" to="/menu">See our menu</Link>
    </>
  );
}
