"use client";

import Image from "next/image";
import styles from "./components.desejositem.module.css";
import { ItemDesejo } from "@/types/ItemDesejo";
import { BsStarFill } from "react-icons/bs";
import { IoCartOutline, IoTrashOutline } from "react-icons/io5";

type DesejosItemProps = {
  item: ItemDesejo;
  onComprar: () => Promise<void>;
  onDeletar: () => Promise<void>;
};

export function DesejosItem({ item, onComprar, onDeletar }: DesejosItemProps) {
  return (
    <div className={`${styles["desejo-item"]} ${styles["text-color"]}`}>
      {item.jogo.banner && (
        <Image
          alt={"Imagem"}
          src={item.jogo.banner}
          width={60}
          height={60}
          className={styles["desejo-item__imagem"]}
        />
      )}

      <div className={styles["desejo-item__titulos"]}>
        <span>
          <h3
            className={`${styles["text-color"]} ${styles["desejo-item__titulos-nome"]}`}
          >
            {item.jogo.nome}
          </h3>
          <h5
            className={`${styles["text-color"]} ${styles["desejo-item__titulos-avaliacao"]}`}
          >
            <BsStarFill />
            {item.jogo.nota_avaliacao.toString().padStart(2, "0")}/10
          </h5>
        </span>
        <p
          className={`${styles["text-color"]} ${styles["desejo-item__titulos-date"]}`}
        >
          Adicionado em {item.dataAdicao.toDate().toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className={styles["desejo-item__button"]}>
        <span className={styles["desejo-item__button__comprar"]}>
          <p className={styles["text-color"]}>
            R$ {item.jogo.preco.toFixed(2)}
          </p>
          <button
            className={`g-button-image ${styles["button"]} ${styles["desejo-item__button__comprar-btn"]}`}
            onClick={onComprar}
          >
            <IoCartOutline size={20} />
            <p>Carrinho</p>
          </button>
        </span>
        <button
          className={`g-button-image ${styles["desejo-item__button__comprar-remover"]}`}
          onClick={onDeletar}
        >
          <IoTrashOutline size={16} />
          <p>Remover</p>
        </button>
      </div>
    </div>
  );
}
