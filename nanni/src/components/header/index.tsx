import Image from "next/image";
import Link from "next/link";

export function Header() {
  const userNome = "Nome do Usuário";

  return (
    <header className="padding-horizontal-global">
      <div className="header-superior">
        <Link href="/">
          <Image
            src={"logo.svg"}
            alt={"Logo"}
            quality={100}
            width={110}
            height={41}
            style={{ height: "auto" }}
          />
        </Link>
      </div>
      <div className="header-perfil">
        <p>{userNome}</p>
        <div className="header-perfil-imagem">
          <Image
            src={"file.svg"}
            alt={"Foto de Perfil"}
            width={70}
            height={70}
            style={{ height: "auto" }}
          />
        </div>
      </div>
      <div className="header-inferior">
        <ul>
          <li>Biblioteca</li>
          <li>Lista de Desejos</li>
        </ul>
      </div>
    </header>
  );
}
