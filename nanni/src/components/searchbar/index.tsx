"use client";

import styles from "./Searchbar.module.css";
import { RefObject, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

type SearchBarProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  placeholder?: string;
  onButtonClick?: () => void;
  onChange?: () => void;
  containerStyle?: string;
  inputStyle?: string;
};

export function SearchBar({
  inputRef,
  placeholder,
  onButtonClick,
  onChange,
  containerStyle,
  inputStyle,
}: SearchBarProps) {
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <span
      className={`${styles["searchbar"]} ${inputFocused ? styles["searchbar--focused"] : ""} ${containerStyle ?? ""}`}
    >
      <FaMagnifyingGlass
        onClick={onButtonClick}
        className={styles["searchbar__icon"]}
      />
      <input
        ref={inputRef}
        className={`${styles["searchbar__input"]} ${inputStyle ?? ""}`}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      />
    </span>
  );
}
