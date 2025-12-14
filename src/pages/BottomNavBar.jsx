import { Link } from "react-router-dom";

const BottomNavBar = ({ active }) => {
  const navItems = [
    { id: "home", icon: "home", label: "Inicio", path: "/" },
    { id: "search", icon: "search", label: "Buscar", path: "/search" },
    {
      id: "library",
      icon: "library_music",
      label: "Biblioteca",
      path: "/library",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background-light dark:bg-background-dark border-t border-black/5 dark:border-white/5">
      <div className="flex items-center justify-around px-4 py-2 pb-safe">
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.id}
            className={`flex flex-col items-center gap-1 ${
              active === item.id
                ? "text-primary"
                : "text-on-surface-variant-light dark:text-on-surface-variant-dark"
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                active === item.id ? "filled" : ""
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`text-xs ${active === item.id ? "font-medium" : ""}`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
