import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <>
      <header className="nav">
        <NavLink to="/" className="brand">DGAP Brownie</NavLink>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
      <footer>© {new Date().getFullYear()} DGAP Brownie</footer>
    </>
  );
}
