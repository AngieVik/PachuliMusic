const UpNextView = () => {
  const songs = [
    {
      title: "Luces de Neón",
      artist: "Valeria Synth",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0KeIJ3evKtZsmi8k3MeFEKVZmd2aUY6707SQI1YxrK9q0bBoh_0MLQ1lunCUN-Xj6BAhQ-z4c6bNrnwKO86ZNxQaisEnp5wZupSGSgzzMAqm3i4kGNIBSq_rXqqed-NBizXefxz3I8ccvk5onmDAcMmte0RgM1BB1iubyxX_KRU6JCLnhLmE7N_yatGGGH2H0zy6Uquw0sQrNFNRW5SQtHikwUxnWR7e4tSgX7z1spTbcSY9ittsjxOA5syC6iw9Nw03ZNsDFOf4",
      current: true,
    },
    {
      title: "Amanecer Digital",
      artist: "Cybernetica",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0KeIJ3evKtZsmi8k3MeFEKVZmd2aUY6707SQI1YxrK9q0bBoh_0MLQ1lunCUN-Xj6BAhQ-z4c6bNrnwKO86ZNxQaisEnp5wZupSGSgzzMAqm3i4kGNIBSq_rXqqed-NBizXefxz3I8ccvk5onmDAcMmte0RgM1BB1iubyxX_KRU6JCLnhLmE7N_yatGGGH2H0zy6Uquw0sQrNFNRW5SQtHikwUxnWR7e4tSgX7z1spTbcSY9ittsjxOA5syC6iw9Nw03ZNsDFOf4",
    },
    {
      title: "Eco Eléctrico",
      artist: "Valeria Synth",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1csw76ZbFQu9ooQYHhzcys-OwBux9OuOB-FBEs2UZ2jLHM1M3_jTmEJR3ngp88ahWWJ5sGXPbkGobrUUb4JbwSRISMv9-errpZvT21tQ6xMi7SeOW8tG1e-OV4tNEfrDgn7XmFeOw4E65goaIYnFk7T0DQ5czxr6jrD2yVXJ0e2nsiUOZt06nF6dDo2Ik-8h3Hf2Yf9_16EBei9xYZJce3zsIdWeTeemxzJC4vf8wh5b6xUB0LPsuXCuHbE_F9LHpDiNUuSCRCk",
    },
  ];

  return (
    <div className="w-full bg-surface-light dark:bg-surface-dark rounded-xl flex-1 flex flex-col p-4 overflow-hidden">
      <h3 className="text-lg font-bold mb-3 px-2 text-on-surface-light dark:text-on-surface-dark">
        A continuación
      </h3>
      <div className="flex-1 overflow-y-auto space-y-2">
        {songs.map((song, index) => (
          <div
            key={index}
            className={`flex items-center p-2 rounded-lg ${
              song.current
                ? "bg-primary/10"
                : "hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <div
              className="w-10 h-10 rounded bg-cover bg-center mr-3"
              style={{
                backgroundImage: song.img ? `url("${song.img}")` : "none",
                backgroundColor: "#e5e7eb",
              }}
            ></div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-on-surface-light dark:text-on-surface-dark">
                {song.title}
              </p>
              <p className="text-xs text-on-surface-variant-light dark:text-on-surface-variant-dark">
                {song.artist}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpNextView;
