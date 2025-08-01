"use client";

import styles from "./Searchbar.module.css";
import { useRef, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

export function DesejosSearchBar({
  setQuery,
}: {
  setQuery: (value: string) => void;
}) {
  const refSearchbar = useRef<HTMLInputElement>(null);
  const [inputFocused, setInputFocused] = useState(false);

  function handleQuery() {
    if (refSearchbar.current) {
      setQuery(refSearchbar.current.value);
    }
  }

  function isInputClear(value: string) {
    if (value.trim() === "") {
      setQuery("");
    }
  }

  return (
    <span
      className={`${styles["searchbar"]} ${inputFocused ? styles["searchbar--focused"] : ""} `}
    >
      <FaMagnifyingGlass
        onClick={handleQuery}
        className={styles["searchbar__icon"]}
      />
      <input
        ref={refSearchbar}
        className={styles["searchbar__input"]}
        placeholder={"Buscar por nome"}
        onChange={(e) => isInputClear(e.currentTarget.value)}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      />
    </span>
  );
}
