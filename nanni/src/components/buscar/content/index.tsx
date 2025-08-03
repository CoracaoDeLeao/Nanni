"use client";

import styles from "@/styles/buscar.module.css";
import BuscarFilter from "../_filter";
import { BuscarItem } from "../_item";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FilterSearchJogo } from "@/lib/service/BuscarJogoService";
import { JogoItemProps } from "@/types/JogoItemProps";
import { BuscarFiltros } from "@/types/BuscarFiltros";

export default function BuscarContent() {
  // > Rota
  const router = useRouter();
  const searchParams = useSearchParams();

  // > Lista de Itens
  const [listItem, setListItem] = useState<JogoItemProps[]>([]);

  // > Pesquisa Nome
  const queryNome = useRef<string>("");

  // Atualiza URI com os filtros
  const aplicarFiltro = useCallback(
    (filtroQuery: BuscarFiltros) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(filtroQuery).forEach(([k, v]) => params.set(k, v));

      const strParams = params.toString();
      if (strParams !== searchParams.toString()) {
        router.push(`/buscar?${strParams}`);
      }
    },
    [router, searchParams],
  );

  // Faz a requisição
  const fetchJogo = useCallback(
    async (params: string, queryParams: BuscarFiltros) => {
      const q = queryParams.q ?? "";

      const items = await FilterSearchJogo({
        qLimit: 10,
        qPrimeiraLetra: q.charAt(0) ?? "",
        qNome: q?.length > 1 ? q : "",
        qPrecoRange: [Number(queryParams.min), Number(queryParams.max)],
      });

      if (items) {
        setListItem(items);
      }
    },
    [],
  );

  // Atualiza a página
  useEffect(() => {
    const params = searchParams.toString();

    if (params && params.length > 1) {
      const params_Q = searchParams.get("q") ?? "";

      const queryParams: BuscarFiltros = {
        q: params_Q?.toLowerCase() ?? "",
        min: searchParams.get("min") ?? "",
        max: searchParams.get("max") ?? "",
      };

      queryNome.current = params_Q;
      fetchJogo(params, queryParams);
    }
  }, [fetchJogo, searchParams]);

  return (
    <>
      <div
        className={`g-padding shadow-2 ${styles["header"]} ${!queryNome.current ? styles["header-semparams"] : ""}`}
      >
        {queryNome.current && (
          <span className={styles["resultado"]}>
            <p>Resultado da Pesquisa:</p>
            <p className={styles["resultado__query"]}>{queryNome.current}</p>
          </span>
        )}
        <BuscarFilter onSubmit={aplicarFiltro} />
      </div>
      <div className={`g-padding ${styles["list"]}`}>
        {listItem.length > 0 &&
          listItem.map((item) => <BuscarItem key={item.id} item={item} />)}
      </div>
    </>
  );
}
