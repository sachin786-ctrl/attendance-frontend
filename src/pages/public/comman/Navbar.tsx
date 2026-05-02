import { navItems, type NavItem } from "@/pages/public/publicData/data";
import { Link, useLocation } from "react-router";
import { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src="src/assets/cat.jpg" alt="logo" className="size-10 rounded-full object-cover ring-2 ring-gray-100" />
          </Link>

          {/* Hamburger */}
          <button className="md:hidden text-2xl text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setIsOpen(true)}>
            <IoMdMenu />
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-1 items-center">
            {navItems.map((item: NavItem) => (
              <li key={item.id}>
                <Link
                  to={item.Link}
                  className={
                    item.name === "Login"
                      ? "ml-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                      : `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          location.pathname === item.Link
                            ? "text-violet-600 bg-violet-50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`
                  }
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-white shadow-2xl p-6 py-3 transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <img src="src/assets/cat.jpg" alt="logo" className="size-10 rounded-full object-cover ring-2 ring-gray-100" />
          <button onClick={() => setIsOpen(false)} className="text-xl text-gray-400 hover:text-gray-700 transition-colors">
            <RxCross2 />
          </button>
        </div>

        <ul className="flex flex-col gap-1 text-center ">
          {navItems.map((item: NavItem) => (
            <li key={item.id}>
              <Link
                to={item.Link}
                onClick={() => setIsOpen(false)}
                className={
                  item.name === "Login"
                    ? "block mt-2 bg-gray-900 text-white  px-4 py-2 rounded-lg text-sm font-medium text-center hover:bg-gray-700 transition-colors"
                    : `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === item.Link
                          ? "text-violet-600 bg-violet-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                }
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;