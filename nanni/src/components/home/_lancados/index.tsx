"use client";

import styles from "@/styles/page.module.css";
import { JogoItemProps } from "@/types/JogoItemProps";
import { useRef } from "react";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import JogoItem from "../_jogo/item";
import {
  PaginationPosTypes,
  PaginatorFetchProps,
  usePagination,
} from "../paginator";

export default function HomeLancados({
  list,
  fetchFunction,
}: {
  list: JogoItemProps[];
  fetchFunction: (
    props: PaginatorFetchProps<JogoItemProps | undefined>,
  ) => Promise<void>;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const itemPosRef = useRef<PaginationPosTypes>("first");
  const [elements, prev, next] = usePagination<JogoItemProps>({
    list: list,
    divRef: divRef,
    itemWidth: 180,
    itemPosRef: itemPosRef,
    fetchFunction: fetchFunction,
  });

  return (
    <div ref={divRef} className={styles["novos"]}>
      <h3>Recém-Lançados</h3>

      <div className={styles["novos-div"]}>
        <TiChevronLeft
          size={45}
          onClick={prev}
          className={`
                        g-button-image
                        ${
                          itemPosRef?.current === "first" ||
                          itemPosRef?.current === "full"
                            ? styles["novos-button--desativado"]
                            : ""
                        }
                    `}
        />
        <div className={styles["novos-list"]}>
          {elements &&
            elements.map((item) => <JogoItem key={item.id} {...item} />)}
        </div>
        <TiChevronRight
          size={45}
          onClick={next}
          className={`
                        g-button-image
                        ${
                          itemPosRef?.current === "last" ||
                          itemPosRef?.current === "full"
                            ? styles["novos-button__next--desativado"]
                            : ""
                        }
                    `}
        />
      </div>
    </div>
  );
}
