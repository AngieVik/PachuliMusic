import { Link } from "react-router-dom";
import UniversalHeader from "./UniversalHeader";
import BottomNavBar from "./BottomNavBar";
import { SearchBar } from "../components/UIBasicComponents";

const LibraryTabs = ({ activeTab }) => {
  const tabs = [
    { id: "playlists", label: "Playlists", path: "/library" },
    { id: "favorites", label: "Favoritos", path: "/library/favorites" },
    { id: "albums", label: "Álbums", path: "/library/albums" },
  ];
  return (
    <div className="px-4 pb-4">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Link key={tab.id} to={tab.path}>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-full ${
                activeTab === tab.id
                  ? "bg-primary text-black"
                  : "text-on-surface-variant-light dark:text-on-surface-variant-dark shadow-neumorphic-light dark:shadow-neumorphic-dark active:shadow-neumorphic-inset-light dark:active:shadow-neumorphic-inset-dark"
              }`}
            >
              {tab.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ListItem = ({ img, title, subtitle, icon }) => (
  <div className="flex items-center gap-4">
    {img ? (
      <img
        className="w-16 h-16 rounded-lg object-cover shadow-neumorphic-light dark:shadow-neumorphic-dark"
        src={img}
        alt={title}
      />
    ) : (
      <div className="w-16 h-16 rounded-lg bg-surface-light dark:bg-surface-dark shadow-neumorphic-light dark:shadow-neumorphic-dark flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary">
          {icon}
        </span>
      </div>
    )}
    <div className="flex-1">
      <p className="text-on-surface-light dark:text-on-surface-dark font-semibold">
        {title}
      </p>
      <p className="text-on-surface-variant-light dark:text-on-surface-variant-dark text-sm">
        {subtitle}
      </p>
    </div>
    <button className="text-on-surface-variant-light dark:text-on-surface-variant-dark">
      <span className="material-symbols-outlined">chevron_right</span>
    </button>
  </div>
);

export const LibraryPlaylistsPage = () => {
  const playlists = [
    {
      name: "Chill Vibes",
      author: "Ti",
      songs: 50,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0DUt6lrmQf59n23rk24qJc-v__oPe33abFG0WE9z-91fdgHq_jwaqE7C7F6tizGqWJR80fFsrfkiwG2j9tjpji9swFS6itu2OJq0LxVCxQZ7hilgwAmsnKFiQNXTPoH64n7sg2D_8JIeT9bnAHcP26DNvDF8Th40GGe7qOovogih7eYxFBH5FaIbBpPjraKNOuUEOfmXkxVnzTMlEdZgAHLtZ5SiKQnbiFZPfEQo8LxlfgspnJrjPxfDuzMAE-ZFpVfKD5pklLNs",
    },
    {
      name: "Workout Hits",
      author: "Ti",
      songs: 32,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxcd-_v89qYB029Ms6i96d1pAfzPFENwR7EKil8Q6YiOtI_az-5o2weYoP2A2vKwTycgX_Kc9B2DPi9RRpwQ7m_L5678PHHzVzXOUM6Hg_NJu7PoBygsyfxuvRlFiLduhEBO3kPWCXVLvS9YEQlZIKJoiiuOU_Q6zRk3s2-oE5AKe1mVyySrk-OaJ8pcPa4iSW644uXVAF4JpK0kgJAzd4Wm0vJbNmd5O70lvY0VQqnvJYZXafYlshm2ysdK-vrOygoCVXsABJOBw",
    },
    {
      name: "Noche de estrellas",
      author: "Ti",
      songs: 78,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAh1a4wH1lrNBoNIY5xSl1QfMlG6-CJmWS5uV5CKp4rqXKCypZv_zZlvpln2TxKXdqPKZfNBNkzi-4qSYUXePh9mvP-RbiC4_k98Wnjy4kxrXjjVxs8BN3SD_1Fi6t7ev8a898HFSZJ1Nqe86cspBH30o_YjtAVbhHvFTLFRo10HzG7QsPdt-t526ivu4F5VOwFYRheTqSUjOjAK6FJStjS2aIcc4qe_YAFDCzV8G_UeIpIROMcqaxvtelh37HuGYmMJVIEEw6ySiM",
    },
  ];
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <UniversalHeader title="Mi Biblioteca" />
      <SearchBar placeholder="Buscar en playlists..." />
      <LibraryTabs activeTab="playlists" />
      <div className="flex-grow px-4 overflow-y-auto">
        <div className="space-y-4">
          <ListItem icon="add" title="Crear nueva playlist" subtitle="" />
          {playlists.map((p, i) => (
            <ListItem
              key={i}
              img={p.img}
              title={p.name}
              subtitle={`por ${p.author} • ${p.songs} canciones`}
            />
          ))}
        </div>
      </div>
      <BottomNavBar active="library" />
    </div>
  );
};

export const LibraryFavoritesPage = () => {
  const favoriteSongs = [
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0DUt6lrmQf59n23rk24qJc-v__oPe33abFG0WE9z-91fdgHq_jwaqE7C7F6tizGqWJR80fFsrfkiwG2j9tjpji9swFS6itu2OJq0LxVCxQZ7hilgwAmsnKFiQNXTPoH64n7sg2D_8JIeT9bnAHcP26DNvDF8Th40GGe7qOovogih7eYxFBH5FaIbBpPjraKNOuUEOfmXkxVnzTMlEdZgAHLtZ5SiKQnbiFZPfEQo8LxlfgspnJrjPxfDuzMAE-ZFpVfKD5pklLNs",
    },
    {
      title: "Don't Start Now",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxcd-_v89qYB029Ms6i96d1pAfzPFENwR7EKil8Q6YiOtI_az-5o2weYoP2A2vKwTycgX_Kc9B2DPi9RRpwQ7m_L5678PHHzVzXOUM6Hg_NJu7PoBygsyfxuvRlFiLduhEBO3kPWCXVLvS9YEQlZIKJoiiuOU_Q6zRk3s2-oE5AKe1mVyySrk-OaJ8pcPa4iSW644uXVAF4JpK0kgJAzd4Wm0vJbNmd5O70lvY0VQqnvJYZXafYlshm2ysdK-vrOygoCVXsABJOBw",
    },
  ];
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <UniversalHeader title="Favoritos" />
      <SearchBar placeholder="Buscar en favoritos..." />
      <LibraryTabs activeTab="favorites" />
      <div className="flex-grow px-4 overflow-y-auto pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-neumorphic-light dark:shadow-neumorphic-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-white filled">
                favorite
              </span>
            </div>
            <div className="flex-1">
              <p className="text-on-surface-light dark:text-on-surface-dark font-semibold">
                Canciones que te gustan
              </p>
              <p className="text-on-surface-variant-light dark:text-on-surface-variant-dark text-sm">
                234 canciones
              </p>
            </div>
          </div>
          {favoriteSongs.map((song, i) => (
            <ListItem
              key={i}
              img={song.img}
              title={song.title}
              subtitle={`${song.artist} • ${song.album}`}
            />
          ))}
        </div>
      </div>
      <BottomNavBar active="library" />
    </div>
  );
};

export const LibraryAlbumsPage = () => {
  const albums = [
    {
      title: "After Hours",
      artist: "The Weeknd",
      year: 2020,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0DUt6lrmQf59n23rk24qJc-v__oPe33abFG0WE9z-91fdgHq_jwaqE7C7F6tizGqWJR80fFsrfkiwG2j9tjpji9swFS6itu2OJq0LxVCxQZ7hilgwAmsnKFiQNXTPoH64n7sg2D_8JIeT9bnAHcP26DNvDF8Th40GGe7qOovogih7eYxFBH5FaIbBpPjraKNOuUEOfmXkxVnzTMlEdZgAHLtZ5SiKQnbiFZPfEQo8LxlfgspnJrjPxfDuzMAE-ZFpVfKD5pklLNs",
    },
    {
      title: "MOTOMAMI",
      artist: "ROSALÍA",
      year: 2022,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxcd-_v89qYB029Ms6i96d1pAfzPFENwR7EKil8Q6YiOtI_az-5o2weYoP2A2vKwTycgX_Kc9B2DPi9RRpwQ7m_L5678PHHzVzXOUM6Hg_NJu7PoBygsyfxuvRlFiLduhEBO3kPWCXVLvS9YEQlZIKJoiiuOU_Q6zRk3s2-oE5AKe1mVyySrk-OaJ8pcPa4iSW644uXVAF4JpK0kgJAzd4Wm0vJbNmd5O70lvY0VQqnvJYZXafYlshm2ysdK-vrOygoCVXsABJOBw",
    },
  ];
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <UniversalHeader title="Álbums" />
      <SearchBar placeholder="Buscar álbums..." />
      <LibraryTabs activeTab="albums" />
      <div className="flex-grow px-4 overflow-y-auto">
        <div className="space-y-4">
          {albums.map((album, i) => (
            <ListItem
              key={i}
              img={album.img}
              title={album.title}
              subtitle={`${album.artist} • ${album.year}`}
            />
          ))}
        </div>
      </div>
      <BottomNavBar active="library" />
    </div>
  );
};
