import Image from "next/image";
import styles from "./components.jogo.item.module.css";

export function JogoItem(props: JogoItemProps) {
  const listTags = props.tags.join(", ");
  const avaliacaoNota = props.avaliacao + "/10";

  return (
    <div className={styles.container}>
      <Image
        src={props.imagem}
        alt={props.imagem_alt}
        width={180}
        height={220}
        className={styles.imagem}
      />

      <p className={styles.preco}>{props.preco} R$</p>

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

type JogoItemProps = {
  imagem: string;
  imagem_alt: string;
  avaliacao: string;
  preco: string;
  tags: string[];
};
