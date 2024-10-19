import React, { useState } from "react";
import { FaHome, FaCreditCard, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (state: boolean) => {
    setIsOpen(state);
  }

  const routes = [
    { path: "/", name: "Inicio", icon: <FaHome size={24} /> },
    { path: "/card", name: "Cartão", icon: <FaCreditCard size={24} /> },
    { path: "/enterprise", name: "Empresas", icon: <FaUsers size={24} /> },
  ];

  return (
    <div
      onMouseEnter={() => handleOpen(true)}
      onMouseLeave={() => handleOpen(false)}
      className={`flex flex-col h-screen bg-zinc-800 text-white transition-width duration-300 ${isOpen ? "w-60" : "w-20"
        }`}
    >
      <div className="flex-grow">
        {routes.map((route, index) => (
          <Link
            key={index}
            to={route.path}
            className={`flex  py-4 hover:bg-indigo-600 hover:bg-opacity-50 cursor-pointer transition duration-150 ease-in-out
              ${isOpen ? "justify-start p-2" : "justify-center"}`
            }
          >
            {route.icon}
            {isOpen && <span className="pl-4">{route.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
