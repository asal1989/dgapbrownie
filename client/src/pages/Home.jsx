import { Link } from "react-router-dom";
import MantraBox from "../components/MantraBox.jsx";
import PageContent from "./PageContent.jsx";

export default function Home() {
  return (
    <>
      <MantraBox />
      <PageContent slug="home" />
      <Link className="btn" to="/menu">See our menu</Link>
    </>
  );
}
