import { useState } from "react";
import { FaChartBar, FaCreditCard, FaUsers, FaArrowLeft, FaArrowRight, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';

const routes = [
  { path: "/", name: "Graficos", icon: <FaChartBar size={24} /> },
  { path: "/card", name: "Cartão", icon: <FaCreditCard size={24} /> },
  { path: "/enterprise", name: "Empresas", icon: <FaUsers size={24} /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const renderRoute = (route: any, index: number) => (
    <Link
      key={index}
      to={route.path}
      className={`flex py-4 cursor-pointer transition-all duration-150 ease-in-out transform
        ${isOpen ? "justify-start p-2" : "justify-center"}`}
    >
      {route.icon}
      {isOpen && <span className="pl-4">{route.name}</span>}
    </Link>
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/auth/login");
  };

  return (
    <div className={`flex flex-col h-screen shadow-xl text-zinc-800 transition-width duration-300 ${isOpen ? "w-60" : "w-20"}`}>
      <div className="flex flex-col flex-grow justify-between">
        <div className="p-2">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img src={logo} className={`overflow-hidden transition-all ${isOpen ? "w-32 mr-2" : "w-0"}`} />
            <button onClick={() => toggleSidebar()} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
              {isOpen ? <FaArrowLeft size={24} /> : <FaArrowRight size={24} />}
            </button>
          </div>
          {routes.map(renderRoute)}
        </div>
      </div>
      <div>
        <div className="flex justify-center items-center p-4">
          <button onClick={() => handleLogout()} className="flex flex-row items-center w-full p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
            <FaSignOutAlt size={24} />
            {isOpen && <span className="pl-4">Sair</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
