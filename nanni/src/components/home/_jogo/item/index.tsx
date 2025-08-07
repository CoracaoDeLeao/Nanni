import Image from "next/image";
import styles from "./JogoItem.module.css";
import { JogoItemProps } from "@/types/JogoItemProps";
import { BsStarFill } from "react-icons/bs";

export default function JogoItem({
  nome,
  preco,
  tags,
  avaliacao = "--",
  banner,
}: JogoItemProps) {
  const listTags =
    Array.isArray(tags) && tags.length > 0
      ? tags.flatMap((item) => `#${item}`).join(", ")
      : "...";
  const avaliacaoNota = String(avaliacao)?.padStart(2, "0") + "/10";
  const formatPreco = Number(preco).toFixed(2) ?? "--";

  return (
    <div className={styles["container"]}>
      <div className={styles["banner"]}>
        {banner ? (
          <Image
            src={banner}
            alt={`Banner de ${nome}`}
            fill
            className={styles["banner-image"]}
          />
        ) : (
          <p>{nome}</p>
        )}
      </div>

      <p className={styles["preco"]}>
        {formatPreco !== "--"
          ? preco === 0
            ? "Gratuito"
            : `${formatPreco} R$`
          : `${formatPreco} R$`}
      </p>

      <div className={styles["avaliacao"]}>
        <BsStarFill size={16} />
        <p>{avaliacaoNota}</p>
      </div>
      <div className={styles["tags"]}>
        <p>{listTags}</p>
      </div>
    </div>
  );
}
