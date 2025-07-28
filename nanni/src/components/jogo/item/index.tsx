import Image from "next/image";
import styles from "./components.jogo.item.module.css";
import { JogoItemProps } from "@/types/JogoItemProps";

export function JogoItem(props: {data: JogoItemProps}) {
  const item = props.data;
  const listTags = item.tags.join(", ");
  const avaliacaoNota = item.avaliacao + "/10";

  return (
    <div className={styles.container}>
      <Image
        src={item.imagem}
        alt={item.imagem_alt}
        width={180}
        height={220}
        className={styles.imagem}
      />

      <p className={styles.preco}>{item.preco} R$</p>

      <div className={styles.avaliacao}>
        <Image
          src={"/ic/star.png"}
          alt={"Imagem de avaliação"}
          width={20}
          height={20}
          className={styles.avaliacaoImage}
        />
        <p>{avaliacaoNota}</p>
      </div>
      <div className={styles.info}>
        <p>{listTags}</p>
      </div>
    </div>
  );
}