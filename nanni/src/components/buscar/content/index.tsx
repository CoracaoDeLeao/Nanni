"use client";

import styles from "@/styles/buscar.module.css";
import BuscarFilter from "../_filter";
import { BuscarItem } from "../_item";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { filterSearchJogo, SearchJogo } from "@/lib/service/BuscarJogoService";
import { JogoItemProps } from "@/types/JogoItemProps";

export default function BuscarContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [listItem, setListItem] = useState<JogoItemProps[]>([]);

  useEffect(() => {
    async function run() {
      // const items = await filterSearchJogo({
      //     qNome: q.toLowerCase(),
      //     qLimit: 10
      // });
      // if(items) {
      //     setListItem(items);
      // }
    }

    run();
  }, [q]);

  return (
    <>
      <div
        className={`g-padding shadow-2 ${styles["header"]} ${!q ? styles["header-semparams"] : ""}`}
      >
        {q && (
          <span className={styles["resultado"]}>
            <p>Resultado da Pesquisa:</p>
            <p className={styles["resultado__query"]}>
              {q ?? "Nada encontrado"}
            </p>
          </span>
        )}
        <BuscarFilter />
      </div>
      <div className={`g-padding ${styles["list"]}`}>
        {listItem.length > 0 &&
          listItem.map((item) => <BuscarItem key={item.id} item={item} />)}
      </div>
    </>
  );
}
