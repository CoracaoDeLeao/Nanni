"use client";

import styles from "./BuscarFilter.module.css";
import { FaFilter } from "react-icons/fa6";
import SliderTwoThumbs from "../_slider/twothumbs";
import { useState } from "react";

export default function BuscarFilter() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState([0, 100]);

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
        <div className={`shadow-1 ${styles["filter-list"]}`}>
          <div>
            <h5 className={styles["filter-list__titulo"]}>Escala de Preço</h5>
            <SliderTwoThumbs values={values} setValues={setValues} MAX={100} />
          </div>
          <button className={`g-button-image ${styles["filter-list__submit"]}`}>
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}
