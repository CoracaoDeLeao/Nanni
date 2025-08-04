"use client";

import styles from "./BuscarFilter.module.css";
import { FaFilter } from "react-icons/fa6";
import SliderTwoThumbs from "../_slider/twothumbs";
import { useState } from "react";
import { BuscarFiltros } from "@/types/BuscarFiltros";
import { MdOutlineClose } from "react-icons/md";

export default function BuscarFilter({
  onSubmit,
  tags,
}: {
  onSubmit: (filtroQuery: BuscarFiltros) => void,
  tags: Set<string>,
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState([0, 100]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);

  const formatTags = tags && tags.size > 0 
    ? Array.from(tags).filter(tag => !tagsSelecionadas.includes(tag))
    : [];

  function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data: FormData = new FormData(e.currentTarget);

    // Raio de preço
    const min = data.get("min")?.toString() ?? "";
    const max = data.get("max")?.toString() ?? "";
    const tags = data.get("tags")?.toString()?.split(",") ?? [];

    //
    onSubmit({
      min,
      max,
      tags,
    } as BuscarFiltros);
  }

  return (
    <div className={styles["filter"]}>
      <span
        className={`
                ${styles["filter__icon"]}
                ${open ? styles["filter__icon--open"] : styles["filter__icon--closed"]}
            `}
        onClick={() => setOpen(!open)}
      >
        {open && <p>Fechar</p>}
        <FaFilter size={20} />
      </span>
      {open && (
        <form
          className={`shadow-1 ${styles["filter-list"]}`}
          onSubmit={handleForm}
        >
          <div>
            <h5 className={styles["filter-list__titulo"]}>Escala de Preço</h5>
            <SliderTwoThumbs values={values} setValues={setValues} MAX={100} />

            <input name="min" type="hidden" value={values[0]} />
            <input name="max" type="hidden" value={values[1]} />
          </div>
          <div>
            <h5 className={styles["filter-list__titulo"]}>Tags</h5>
            <div className={styles["filter-list__chiplist"]}>
              {tagsSelecionadas.length > 0 ? (
                tagsSelecionadas.map((item, index) => (
                  <button 
                    key={item + index}
                    type="button"
                    onClick={() => setTagsSelecionadas(prev => prev.filter(tag => tag !== item))}
                    className={`g-button-image ${styles["filter-list__chip"]} ${styles["filter-list__chip-selecionados"]}`}>
                      {item}
                      <MdOutlineClose />
                  </button>
                ))
              ) : (
                <p className={"g-desativado"}>Nada selecionado</p>
              )
              }
            </div>
            <div className={styles["separador"]} />
            <div className={styles["filter-list__chiplist"]}>
              {formatTags.length > 0 ? (
                formatTags.map((item, index) => (
                  <button 
                    key={item + index}
                    type="button"
                    onClick={() => setTagsSelecionadas(prev => 
                      prev.includes(item) ? prev : [...prev, item]
                    )}
                    className={`g-button-image ${styles["filter-list__chip"]} ${styles["filter-list__chip-todos"]}`}>
                      {item}
                  </button>
                ))
              ) : (
                <p className={"g-desativado"}>Nada informado</p>
              )}
            </div>

            <input name="tags" type="hidden" value={tagsSelecionadas} />
          </div>
          <button
            type="submit"
            className={`g-button-image ${styles["filter-list__submit"]}`}
          >
            Aplicar
          </button>
        </form>
      )}
    </div>
  );
}
