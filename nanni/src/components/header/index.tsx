import Image from "next/image";
import Link from "next/link";
import styles from "./components.header.carrossel.module.css";

export function Header() {
  const userNome = "Nome do Usuário";

  return (
    <header className={`${styles["header"]} ${styles["padding-horizontal-global"]}`}>
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
      <div className={styles["header-perfil"]}>
        <p className={styles["header-perfil__nome"]}>
          {userNome}
        </p>
        <div className={styles["header-perfil__imagem"]}>
          <Image
            src={"/file.svg"}
            alt={"Foto de Perfil"}
            width={70}
            height={70}
            style={{ height: "auto" }}
          />
        </div>
      </div>
      <div className={styles["header-inferior"]}>
        <ul>
          <li>Biblioteca</li>
          <li>Lista de Desejos</li>
        </ul>
      </div>
    </header>
  );
}
