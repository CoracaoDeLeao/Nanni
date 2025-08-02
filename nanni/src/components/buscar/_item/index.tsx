import Image from "next/image";
import styles from "./BuscarItem.module.css";
import { BsStarFill } from "react-icons/bs";
import { JogoItemProps } from "@/types/JogoItemProps";

export function BuscarItem({ item }: { item: JogoItemProps }) {
  return (
    <div className={styles["item"]}>
      {item.banner && (
        <div className={styles["banner"]}>
          <Image
            alt={`Banner de ${item.nome}`}
            src={item.banner}
            width={100}
            height={60}
            className={styles["banner__image"]}
          />
        </div>
      )}

      <div className={styles["body"]}>
        <p className={styles["body-nome"]}>{item.nome ?? ""}</p>
        <p className={styles["body-desc"]}>{item.sobre ?? ""}</p>
        <div className={styles["body-line"]}>
          <span className={styles["body-line__avaliacao"]}>
            <BsStarFill size={12} />
            <p>{"09"}/10</p>
          </span>
          <button className={`g-button-image ${styles["body-line__btn"]}`}>
            {item.preco || item.preco === 0
              ? `R$ ${item.preco.toFixed(2)}`
              : "Gratuito"}
          </button>
        </div>
        <p className={styles["body-tags"]}>
          {item.tags?.map((tag) => `#${tag}`).join(", ") || ""}
        </p>
      </div>
    </div>
  );
}
