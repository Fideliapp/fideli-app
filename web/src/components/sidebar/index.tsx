import { useState, useRef, useEffect } from "react";
import { FaChartBar, FaCreditCard, FaUsers, FaArrowLeft, FaArrowRight, FaSignOutAlt, FaUserAlt, FaShoppingBag, FaPercentage, FaCog, FaBarcode } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const { isAdmin, name } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const togglePopup = () => setPopupOpen(!popupOpen);

  interface Route {
    path: string;
    name: string;
    icon: JSX.Element;
    adminOnly?: boolean;
  }

  const routes: Route[] = [
    { path: "/", name: "Graficos", icon: <FaChartBar color="#552D7F" size={24} /> },
    { path: "/card", name: "Cartão", icon: <FaCreditCard color="#552D7F" size={24} /> },
    { path: "/enterprise", name: "Empresas", icon: <FaUsers color="#552D7F" size={24} />, adminOnly: true },
    { path: "/buys", name: "Compras", icon: <FaShoppingBag color="#552D7F" size={24} /> },
    { path: "/promotions", name: "Promoções", icon: <FaPercentage color="#552D7F" size={24} /> },
    { path: "/nf", name: "Nota Fiscal", icon: <FaBarcode color="#552D7F" size={24} />, adminOnly: true },
  ];

  const settings: Route[] = [
    { path: "/reports", name: "Config", icon: <FaCog color="#552D7F" size={24} />, adminOnly: true },
  ];

  const renderRoute = (route: Route, index: number) => (
    <Link
      key={index}
      to={route.path}
      className={`flex py-4 cursor-pointer w-full transition-all duration-150 ease-in-out transform
        ${isOpen ? "justify-start p-2" : "justify-center"}`}
    >
      {route.icon}
      {isOpen && <span className="pl-4">{route.name}</span>}
    </Link>
  );

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/auth/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && !sidebarRef.current.contains(event.target as Node) &&
        popupRef.current && !popupRef.current.contains(event.target as Node)
      ) {
        setPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`flex flex-col h-screen shadow-xl text-zinc-800 transition-width duration-300 ${isOpen ? "w-60" : "w-20"}`}
    >
      <div className="flex flex-col flex-grow justify-between">
        <div className="p-2">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img src={logo} className={`overflow-hidden transition-all ${isOpen ? "w-32 mr-2" : "w-0"}`} />
            <button onClick={toggleSidebar} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
              {isOpen ? <FaArrowLeft color="#552D7F" size={24} /> : <FaArrowRight color="#552D7F" size={24} />}
            </button>
          </div>
          {routes
            .filter(route => !route.adminOnly || isAdmin)
            .map(renderRoute)}
        </div>
      </div>
      <div>
        <div className="flex flex-col items-center p-4">
          {settings
            .filter(route => !route.adminOnly || isAdmin)
            .map(renderRoute)}          <button onClick={togglePopup} className="flex flex-row items-center w-full p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
            <FaUserAlt color="#552D7F" size={24} />
            {isOpen && <span className="pl-4">Conta</span>}
          </button>
        </div>
      </div>

      {popupOpen && (
        <div
          ref={popupRef}
          className="absolute bottom-14 left-0 bg-white shadow-lg rounded-md p-4 z-50 w-48"
        >
          <p className="text-gray-700 font-medium">{isAdmin ? `${name} [ADM]` : name}</p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full text-left text-red-500 hover:text-red-700"
          >
            <FaSignOutAlt size={20} className="inline mr-2" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
