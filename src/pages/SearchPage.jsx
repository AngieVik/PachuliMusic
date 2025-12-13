import UniversalHeader from "./UniversalHeader";
import BottomNavBar from "./BottomNavBar";
import { SearchBar } from "../components/UIBasicComponents";

const SearchPage = () => {
  const recentSearches = [
    {
      title: "Bohemian Rhapsody",
      subtitle: "Canción • Queen",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzOjh2oWGy7ZqF3XYwdB9Y36Iz9wWbYrt_uuXAq9-SW_UzRWcE931-D_9kcgYMVfGgTlDiENlepoLwID3SEojEL8-a2pksC9mJzffqYw06vrm_9ABSkhMYFv6OWSCCir-OVZQ1Qpfa38xr6sro6Za-rjnKPBT53IT6Su7jrdKscq3SgRUXOPOKYssZegNEGbHzuKg77Fnf1v4c2Zyrl43IPSuS_gXi11LTsULvkiFTHJ2NjJvWq7Vx9yY9uZB8_ipQQvKS81NjlrY",
      rounded: false,
    },
    {
      title: "Queen",
      subtitle: "Artista",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-KNmOm1RU682Q8E8XgMlFvqIhHRrWjRYbirN6fSMMokjBa911vNbNa1c0roAfE6v0eax7LtExF1W9Vvck1TF0SZ7_pXMsbCdctjURlW3NHbsfHU-_d3Oswe1Z2XzsoQR7X5Lw98wkAMh4x7JeRZkzOqFb6QI7BOpvB8gqJzbm09STxa7vaMgfMh5Sv3Md0cltu4_qraSUe-6rQZwWAA3kNZ1FyCSh9x5GELADkAo2BeIHyekDqFzNG9e8_GMWJTRC4z1hGA4U3J0",
      rounded: true,
    },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      <UniversalHeader title="Búsqueda" />
      <SearchBar placeholder="Canciones, artistas o álbumes" />
      <div className="flex flex-col gap-4 px-4 pt-4">
        <h2 className="px-2 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Explorar
        </h2>
        <div className="flex flex-col gap-3">
          {[
            { icon: "folder", text: "Almacenamiento interno" },
            { icon: "cloud", text: "Google Drive" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl px-2 py-1"
            >
              <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-2xl">
                {item.icon}
              </span>
              <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pt-8 pb-4 flex-grow">
        <div className="flex items-baseline justify-between px-2">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Búsquedas recientes
          </h2>
          <a className="text-sm font-semibold text-primary" href="#">
            Borrar
          </a>
        </div>
        <ul className="flex flex-col">
          {recentSearches.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900/50"
            >
              <img
                alt={item.title}
                className={`h-12 w-12 object-cover ${
                  item.rounded ? "rounded-full" : "rounded-lg"
                }`}
                src={item.img}
              />
              <div className="flex flex-1 flex-col truncate">
                <p className="truncate font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {item.title}
                </p>
                <p className="truncate text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {item.subtitle}
                </p>
              </div>
              <button className="flex size-10 items-center justify-center rounded-full bg-card-light text-text-secondary-light shadow-sm dark:bg-card-dark dark:text-text-secondary-dark">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <BottomNavBar active="search" />
    </div>
  );
};

export default SearchPage;
