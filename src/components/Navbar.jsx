import { navLinks } from "../constants";
import { useEffect, useState } from "react";
import './css/Navbar.css';

const Navbar = () => {
    const [active, setActive] = useState("");
    useEffect(() => {
        const links = document.querySelectorAll(".navbar a");
        links.forEach((link) => {
            link.addEventListener("click", () => {
                links.forEach((item) => item.classList.remove("active"));
                link.classList.add("active");
                setActive(link.textContent);
            });
        });
    }, []);
  return (
    <div>
      <nav className="navbar">
        <ul>
          {navLinks.map((link, index) => (
            <li key={index} className={link.label === active ? "active" : ""}>
              <a href={link.location}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: link.inactive_svg,
                  }}></span>
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
