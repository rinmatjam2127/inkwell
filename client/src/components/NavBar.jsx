import { NavLink } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <NavLink to="/" className="font-bold text-lg text-gray-900">
        Inkwell
      </NavLink>
      <div className="flex gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm ${isActive ? "font-semibold text-indigo-600" : "text-gray-600"}`
          }
        >
          Feed
        </NavLink>
        <NavLink
          to="/write"
          className={({ isActive }) =>
            `text-sm ${isActive ? "font-semibold text-indigo-600" : "text-gray-600"}`
          }
        >
          Write
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `text-sm ${isActive ? "font-semibold text-indigo-600" : "text-gray-600"}`
          }
        >
          Log In 
        </NavLink>
      </div>
    </nav>
  );
}