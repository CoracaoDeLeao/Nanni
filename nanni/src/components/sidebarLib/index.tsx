// components/Sidebar.tsx
import React, { useState } from "react";
import { FiSearch, FiX, FiDownload, FiArrowLeft } from "react-icons/fi";
import Image from "next/image";
import { FaBook } from "react-icons/fa";
import styles from "./SideBarLib.module.css";

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const games = [
    { id: 1, name: "The Witcher 3", icon: "⚔️" },
    { id: 2, name: "Cyberpunk 2077", icon: "🤖" },
    { id: 3, name: "Red Dead Redemption 2", icon: "🤠" },
    { id: 4, name: "Stardew Valley", icon: "🌾" },
    { id: 5, name: "Hades", icon: "🔥" },
    { id: 6, name: "Elden Ring", icon: "💍" },
  ];

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
    >
      <div className={styles.sidebarHeader}>
        <div className={styles.logoWrapper}>
          <Image
            src={"logo.svg"}
            alt={"Logo"}
            quality={100}
            width={110}
            height={41}
            style={{ height: "auto" }}
          />
        </div>
        <button
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Recolher sidebar"
        >
          <span className={styles.collapseIcon}>
            <FiArrowLeft />
          </span>
        </button>
      </div>
      <div>
        <h1 className={styles.title}>
          <FaBook />
          Biblioteca
        </h1>
      </div>
      <div className={styles.searchContainer}>
        <span className={styles.searchIcon}>
          <FiSearch />
        </span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar jogos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar jogos"
        />
        {searchTerm && (
          <button
            className={styles.clearButton}
            onClick={() => setSearchTerm("")}
            aria-label="Limpar busca"
          >
            <FiX />
          </button>
        )}
      </div>

      <div className={styles.gamesHeader}>
        <h2 className={styles.subtitle}>Seus Jogos</h2>
        <span className={styles.gameCount}>{filteredGames.length} jogos</span>
      </div>

      <nav className={styles.gamesList}>
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div key={game.id} className={styles.gameItem}>
              <div className={styles.gameIcon}>{game.icon}</div>
              <div className={styles.gameInfo}>
                <h3 className={styles.gameName}>{game.name}</h3>
              </div>
              <button
                className={styles.downloadButton}
                onClick={() => {}}
                aria-label={`Baixar ${game.name}`}
              >
                <FiDownload />
              </button>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>😕</div>
            <p>Nenhum jogo encontrado</p>
            <button
              className={styles.clearSearchButton}
              onClick={() => setSearchTerm("")}
            >
              Limpar busca
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
