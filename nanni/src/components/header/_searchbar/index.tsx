"use client";

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

    const strParams = searchParams.toString();
    if (pathname === "/buscar" && strParams === value) return;

    const query = new URLSearchParams(searchParams.toString());
    query.set("q", value);

    router.push(`/buscar?${query.toString()}`);
  };

  return (
    <SearchBar
      inputRef={inputRef}
      placeholder={"Buscar jogo"}
      onButtonClick={handlePesquisa}
    />
  );
}
