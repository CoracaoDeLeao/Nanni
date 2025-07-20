import styles from "@/styles/page.module.css";

import Image from "next/image";
import { JogoItem } from "@/components/jogo/item";
import Carrossel from "@/components/home/carrossel";

export default function Home() {
  const tst_novos: JogoItemProps[] = [
    {
      imagem: "file.svg",
      imagem_alt: "Valorant",
      avaliacao: "8.5",
      preco: "0.00",
      tags: ["FPS", "Online", "Competitivo", "Free-to-play"],
    },
    {
      imagem: "file.svg",
      imagem_alt: "Elden Ring",
      avaliacao: "9.8",
      preco: "249.99",
      tags: ["RPG", "Aventura", "Desafiador", "Mundo Aberto"],
    },
    {
      imagem: "file.svg",
      imagem_alt: "Minecraft",
      avaliacao: "9.5",
      preco: "129.99",
      tags: ["Criativo", "Sandbox", "Multiplayer", "Sobrevivência"],
    },
    {
      imagem: "file.svg",
      imagem_alt: "FIFA 24",
      avaliacao: "7.9",
      preco: "299.90",
      tags: ["Esporte", "Futebol", "Multiplayer", "Competitivo"],
    },
    {
      imagem: "file.svg",
      imagem_alt: "Among Us",
      avaliacao: "8.2",
      preco: "12.99",
      tags: ["Multiplayer", "Party Game", "Traição", "Online"],
    },
    {
      imagem: "file.svg",
      imagem_alt: "GTA V",
      avaliacao: "9.0",
      preco: "89.90",
      tags: ["Ação", "Mundo Aberto", "Crime", "Sandbox"],
    },
  ];

  const novosNextBtn_ativo: boolean = false;

  return (
    <div className={styles["div-central"]}>
      <div className={styles["inner-div"]}>
        <div className={styles["carrossel-div"]}>
          <Carrossel />
        </div>
        <main className={`container shadow-1 g-margin ${styles["main"]}`}>
          {/* DESTAQUES */}
          <div className={styles["destaque-container"]}>
            <div className={styles["destaque-list"]}>
              {tst_novos.map((data, index) => (
                <JogoItem key={index} data={data} />
              ))}
            </div>
            <h3>Em Destaque</h3>
          </div>

          {/* RECEM-LANCHADOS */}
          <div className={styles["novos-container"]}>
            <h2 className={styles["novos-titulo"]}>Recém-Lançados</h2>

            <div className={styles["novos-div"]}>
              <div
                className={`${styles["novos-button-div"]} ${!novosNextBtn_ativo ? "" : styles["novos-button-prev-desativado"]}`}
              >
                <button className={`g-button-image`}>
                  <Image
                    src={"/ic/caret-left-solid.svg"}
                    alt={"Voltar lista de novos"}
                    height={40}
                    width={40}
                  />
                </button>
              </div>
              <div className={styles["novos-list"]}>
                {tst_novos.map((data, index) => (
                  <JogoItem key={index} data={data} />
                ))}
              </div>
              <div
                className={`${styles["novos-button-div"]} ${novosNextBtn_ativo ? "" : styles["novos-button-next-desativado"]}`}
              >
                <button className={`g-button-image`}>
                  <Image
                    src={"/ic/caret-right-solid.svg"}
                    alt={"Avançar lista de novos"}
                    height={40}
                    width={40}
                  />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

type JogoItemProps = {
  imagem: string;
  imagem_alt: string;
  avaliacao: string;
  preco: string;
  tags: string[];
};