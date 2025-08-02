import styles from "@/styles/jogos.module.css";
import { JogoProps } from "@/types/JogoProps";
import Image from "next/image";
import JogosGaleria from "../carrossel";
import { BsStarFill } from "react-icons/bs";
import { JogosAvaliacao } from "../events/avaliacao";
import { JogosPreco } from "../events/preco";
import { colorStatusDev } from "../cores_status";
import { getAvaliacoes } from "@/lib/service/JogoService";
import { JogosTabs } from "../tabs";

type DetailJogoContentProps = {
  jogo: JogoProps;
  iconSize?: number;
};

export default async function DetailJogoContent({
  jogo,
  iconSize = 100,
}: DetailJogoContentProps) {
  const avalicao: number | undefined = await getAvaliacoes(
    jogo.id,
    jogo?.numViews,
  );

  return (
    <>
      <div>
        <JogosGaleria galeria={jogo.galeria} />
        <div className={styles["jogo-titulo-div"]}>
          <Image
            src={jogo.icone ?? "/file.svg"}
            alt={"Icone do Jogo"}
            width={iconSize}
            height={iconSize}
            className={styles["jogo-titulo-icone"]}
          />
          <div className={styles["jogo-principal"]}>
            <span
              className={styles["jogo-titulo"]}
              style={{ paddingLeft: iconSize + 10 }}
            >
              <p className={styles["jogo-titulo-texto"]}>{jogo.nome}</p>
              {jogo.status ?? (
                <p
                  className={styles["jogo-titulo-status"]}
                  style={{ backgroundColor: colorStatusDev[jogo.status] }}
                >
                  {jogo.status}
                </p>
              )}

              <span className={styles["jogo-avaliacao"]}>
                <BsStarFill />
                <p>{avalicao?.toString().padStart(2, "0") ?? "--"}/10</p>
              </span>
            </span>
            <div className={styles["jogo-botoes"]}>
              <JogosAvaliacao
                id={jogo.id}
                paddingRight={50}
                styleButton={styles["jogos-botoes-avaliacao"]}
              />
              <JogosPreco id={jogo.id} preco={jogo.preco} />
            </div>
          </div>
        </div>
      </div>

      <JogosTabs params={jogo} />
    </>
  );
}
