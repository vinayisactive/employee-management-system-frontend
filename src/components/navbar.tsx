import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Logoutbtn from "./logout-btn";

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:8080/api/v1/auth", {
          withCredentials: true,
        });
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <nav className="w-full h-[50px] bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-blue-400 font-semibold" : "hover:text-blue-300"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/list"
            className={({ isActive }) =>
              isActive ? "text-blue-400 font-semibold" : "hover:text-blue-300"
            }
          >
            Employees
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? "text-blue-400 font-semibold" : "hover:text-blue-300"
            }
          >
            Create
          </NavLink>
        </div>

        {isAuth && <Logoutbtn />}
      </div>
    </nav>
  );
};

export default Navbar;
