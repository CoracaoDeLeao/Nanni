"use client";

import styles from "./BuscarFilter.module.css";
import { FaFilter } from "react-icons/fa6";
import SliderTwoThumbs from "../_slider/twothumbs";
import { useState } from "react";
import { BuscarFiltros } from "@/types/BuscarFiltros";

export default function BuscarFilter({
  onSubmit,
}: {
  onSubmit: (filtroQuery: BuscarFiltros) => void;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState([0, 100]);

  function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data: FormData = new FormData(e.currentTarget);

    // Raio de preço
    const min = data.get("min")?.toString() ?? "";
    const max = data.get("max")?.toString() ?? "";

    //
    onSubmit({
      min,
      max,
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
