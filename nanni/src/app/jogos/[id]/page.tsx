import JogosGaleria from "@/components/jogos/carrossel";
import { getAvaliacoes, getJogo } from "@/lib/service/JogoService";
import Image from "next/image";

import styles from "@/styles/jogos.module.css";
import { JogosTabs } from "@/components/jogos/tabs";
import { JogosPreco } from "@/components/jogos/events/preco";
import { JogosAvaliacao } from "@/components/jogos/events/avaliacao";
import { JogoProps } from "@/types/JogoProps";
import { BsStarFill } from "react-icons/bs";
import { colorStatusDev } from "@/components/jogos/cores_status";


export default async function DetailJogo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jogo: JogoProps | undefined = await getJogo(id);
  
  if(!jogo) {
    return (
      <p>Jogo Não Encontrado</p>
    );
  }

  const avalicao: number | undefined = await getAvaliacoes(id, jogo?.numViews);

  if(!avalicao) {
    return (
      <p>Erro ao carregar avaliação</p>
    );
  }
  
  const iconSize = 100;

  return (
    <main className={`g-margin ${styles["main"]}`}>
      {jogo ? (
        <div className={`container shadow-1  ${styles["div"]}`}>
          <div>
            <JogosGaleria galeria={jogo.galeria} />
            <div className={styles["jogo-titulo-div"]}>
              <Image
                src={jogo.icone ?? "/file.svg"} 
                alt={"Icone do Jogo"}
                width={iconSize}
                height={iconSize}
                className={styles["jogo-titulo-icone"]}/>
              <div className={styles["jogo-principal"]}>
                <span className={styles["jogo-titulo"]} style={{ paddingLeft: iconSize+10}}> 
                  <p className={styles["jogo-titulo-texto"]}>
                    {jogo.nome}
                  </p>
                  {jogo.status ?? (
                    <p className={styles["jogo-titulo-status"]} style={{ backgroundColor: colorStatusDev[jogo.status]}}>
                      {jogo.status}
                    </p>
                  )}
                  
                  <span className={styles["jogo-avaliacao"]}>
                    <BsStarFill/>
                    <p>{avalicao.toString().padStart(2, "0")}/10</p>
                  </span>
                </span>
                <div className={styles["jogo-botoes"]}>
                  <JogosAvaliacao id={id} paddingRight={50} styleButton={styles["jogos-botoes-avaliacao"]} />
                  <JogosPreco id={id} preco={jogo.preco} />
                </div>
              </div>
            </div>
          </div>

          <JogosTabs params={jogo} />
        </div>
      ) : (
        <p>CARREGANDO</p>
      )}
    </main>
  );
}
