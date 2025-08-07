"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export type PaginationPosTypes = "first" | "last" | "full" | "none";
export type PaginatorFetchProps<T> = {
  lastItem: T | undefined;
  itemsLimit: RefObject<number>;
};

type ItemPaginatorProps<T> = {
  list: Array<T>;
  divRef: RefObject<HTMLDivElement | null | undefined>;
  itemWidth: number;
  itemPosRef: RefObject<string> | undefined;
  fetchFunction: (props: PaginatorFetchProps<T | undefined>) => Promise<void>;
};

export function usePagination<T>({
  list,
  divRef,
  itemWidth,
  itemPosRef,
  fetchFunction,
}: ItemPaginatorProps<T>): [
  elements: Array<T>,
  prevPage: () => void,
  nextPage: () => void,
] {
  const [page, setPage] = useState(0);
  const [elements, setElements] = useState<Array<T>>(list);
  const itemsLimit = useRef(10);

  const voltouPage = useRef(false);
  const posRef = useRef<PaginationPosTypes>("first");

  const prevPage = () => {
    if (list?.length === 0) return;

    if (page !== 0) {
      setPage((prev) => prev - 1);
      voltouPage.current = true;
    }
  };

  const nextPage = () => {
    if (list?.length === 0) return;

    if (posRef.current !== "last" && posRef.current !== "full") {
      setPage((prev) => prev + 1);
      voltouPage.current = false;
    }
  };

  const handleList = useCallback(() => {
    if (!list || list.length === 0 || !divRef.current) return;

    const itemsLimit = Number(divRef.current?.clientWidth)
      ? Math.round(divRef.current?.clientWidth / itemWidth) - 1
      : 10;

    const startIndex = page * itemsLimit;
    const endIndex = startIndex + itemsLimit;
    const items = list.slice(startIndex, endIndex);

    const status =
      items?.length === list?.length
        ? "full"
        : endIndex >= list?.length
          ? "last"
          : startIndex === 0
            ? "first"
            : "none";

    posRef.current = status;
    if (itemPosRef) itemPosRef.current = status;

    setElements(items);
  }, [list, divRef, itemWidth, itemPosRef, page]);

  useEffect(() => {
    async function run() {
      const lastItem = list.at(-1);
      await fetchFunction({
        lastItem,
        itemsLimit,
      });
    }

    if (!voltouPage.current) run();
    handleList();
  }, [list, handleList, fetchFunction, page]);

  useEffect(() => {
    window.addEventListener("resize", handleList);
    handleList();

    return () => window.removeEventListener("resize", handleList);
  }, [handleList]);

  return [elements, prevPage, nextPage];
}
