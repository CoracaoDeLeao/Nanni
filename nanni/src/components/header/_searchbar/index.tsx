"use client";

import styles from "../Header.module.css";
import { SearchBar } from "@/components/searchbar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useRef } from "react";

export default function HeaderSearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePesquisa = () => {
    const value = inputRef.current?.value.trim();
    if (!value) return;

    const query = searchParams.get("q") ?? "";

    if (pathname === "/buscar" && query === value) return;

    router.push(`/buscar?q=${encodeURIComponent(value)}`);
  };

  return (
    <SearchBar
      inputRef={inputRef}
      placeholder={"Buscar jogo"}
      containerStyle={styles["header-superior__searchbar"]}
      onButtonClick={handlePesquisa}
    />
  );
}
