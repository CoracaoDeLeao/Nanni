"use client";

import styles from "@/styles/page.module.css";
import { useEffect, useState } from "react";
import { JogoItemProps } from "@/types/JogoItemProps";
import JogoItem from "@/components/home/_jogo/item";
import { fetchJogosDestaque, fetchJogosNovos } from "@/lib/service/HomeService";
import { fetchJogosAvaliacoes } from "@/lib/service/JogoService";
import HomeLancados from "../_lancados";
import { PaginatorFetchProps } from "../paginator";

export default function HomeContent() {
  const [jogoDestaque, setJogoDestaque] = useState<JogoItemProps[] | undefined>(
    [],
  );
  const [lancadosList, setLancadosList] = useState<JogoItemProps[]>([]);

  async function fetchNovos({
    lastItem,
  }: PaginatorFetchProps<JogoItemProps | undefined>) {
    const lancados = await fetchJogosNovos(lastItem?.id);

    if (lancados && lancados.length > 0) {
      const lancadosComAvaliacao = await fetchJogosAvaliacoes(lancados);

      setLancadosList((prev) =>
        prev && prev.length > 0
          ? [...prev, ...lancadosComAvaliacao]
          : lancadosComAvaliacao,
      );
    }
  }

  useEffect(() => {
    async function run() {
      const [destaque, lancados] = await Promise.all([
        fetchJogosDestaque(),
        fetchJogosNovos(),
      ]);

      if (destaque && destaque.length > 0) {
        setJogoDestaque(await fetchJogosAvaliacoes(destaque));
      }

      if (lancados && lancados.length > 0) {
        const lancadosComAvaliacao = await fetchJogosAvaliacoes(lancados);

        setLancadosList(lancadosComAvaliacao);
      }
    }

    run();
  }, []);

  return (
    <>
      {/* DESTAQUES */}
      <div className={styles["destaque"]}>
        <div className={styles["destaque-list"]}>
          {jogoDestaque &&
            jogoDestaque.map((item) => <JogoItem key={item.id} {...item} />)}
        </div>
        <h3>Em Destaque</h3>
      </div>

      {/* RECEM-LANCHADOS */}
      <HomeLancados list={lancadosList} fetchFunction={fetchNovos} />
    </>
  );
}
