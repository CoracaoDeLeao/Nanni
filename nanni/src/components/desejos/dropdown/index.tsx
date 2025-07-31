"use client";

import styles from "./components.desejosdropdown.module.css";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useMemo } from "react";
import { FaChevronDown, FaCircle } from "react-icons/fa6";

export type DesejosDropdownItemProps = {
  selected: number;
  items: {
    id: number;
    titulo: string;
  }[];
};

type DesejosDropdownProps = {
  listItems: DesejosDropdownItemProps;
  setListItems: React.Dispatch<React.SetStateAction<DesejosDropdownItemProps>>;
};

export function DesejosDropdown({
  listItems,
  setListItems,
}: DesejosDropdownProps) {
  const selectedTitulo = useMemo(() => {
    return [...listItems.items].find((item) => item.id === listItems.selected)
      ?.titulo;
  }, [listItems.selected, listItems.items]);

  function handleSelection(value: number) {
    setListItems((prev) => ({ ...prev, selected: value }));
  }

  if (!(listItems || setListItems)) {
    return;
  }

  return (
    <div>
      <Listbox value={listItems.selected} onChange={handleSelection}>
        <ListboxButton
          className={styles["boxButton"]}
          aria-label={`Ordenar por ${selectedTitulo}`}
        >
          <p className={styles["boxButton__desc"]}>Ordernar por: </p>
          <p>{selectedTitulo}</p>
          <FaChevronDown aria-hidden="true" />
        </ListboxButton>
        <ListboxOptions anchor="bottom end" className={styles["boxListOption"]}>
          {listItems.items.map((item) => (
            <ListboxOption
              key={item.id}
              value={item.id}
              className={`
                                ${styles["boxOption"]}
                                ${item.titulo === selectedTitulo ? styles["boxOption--selected"] : ""}
                            `}
            >
              <p>{item.titulo}</p>
              <FaCircle size={10} />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
