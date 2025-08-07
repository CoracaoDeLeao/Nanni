import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import { HeaderPerfil } from "./_perfil";
import HeaderSearchBar from "./_searchbar";
import { IoClipboard, IoLibrary } from "react-icons/io5";

export function Header() {
  return (
    <header
      className={`${styles["header"]} ${styles["padding-horizontal-global"]}`}
    >
      <div className={styles["header-superior"]}>
        <Link href="/">
          <Image
            src={"/logo.svg"}
            alt={"Logo"}
            quality={100}
            priority={1}
            width={110}
            height={41}
            style={{ height: "auto" }}
          />
        </Link>
        <div className={styles["searchbar"]}>
          <HeaderSearchBar />
        </div>
      </div>
      <HeaderPerfil />
      <div className={styles["header-inferior"]}>
        <ul>
          <li className={styles["nav-item"]}>
            <IoLibrary size={16} />
            <p>Biblioteca</p>
          </li>
          <li className={styles["nav-item"]}>
            <IoClipboard size={16} />
            <p>Lista de Desejos</p>
          </li>
        </ul>
      </div>
    </header>
  );
}
