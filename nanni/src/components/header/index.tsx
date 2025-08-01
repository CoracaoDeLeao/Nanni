import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import { HeaderPerfil } from "./_perfil";

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
            width={110}
            height={41}
            style={{ height: "auto" }}
          />
        </Link>
      </div>
      <HeaderPerfil />
      <div className={styles["header-inferior"]}>
        <ul>
          <li>Biblioteca</li>
          <li>Lista de Desejos</li>
        </ul>
      </div>
    </header>
  );
}
