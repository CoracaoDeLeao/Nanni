"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import styles from "./AgeSelector.module.css";

const ageRatings = [
  {
    id: "L",
    label: "Livre",
    name: "LIVRE PARA TODAS AS IDADES",
    image: "/classind/CI_L.png",
    color: "#00A650",
  },
  {
    id: "10",
    label: "10",
    name: "NÃO RECOMENDADO PARA MENORES DE 10 ANOS",
    image: "/classind/CI_10.png",
    color: "#0070C0",
  },
  {
    id: "12",
    label: "12",
    name: "NÃO RECOMENDADO PARA MENORES DE 12 ANOS",
    image: "/classind/CI_12.png",
    color: "#FFD700",
  },
  {
    id: "14",
    label: "14",
    name: "NÃO RECOMENDADO PARA MENORES DE 14 ANOS",
    image: "/classind/CI_14.png",
    color: "#FF6B00",
  },
  {
    id: "16",
    label: "16",
    name: "NÃO RECOMENDADO PARA MENORES DE 16 ANOS",
    image: "/classind/CI_16.png",
    color: "#E53935",
  },
  {
    id: "18",
    label: "18",
    name: "NÃO RECOMENDADO PARA MENORES DE 18 ANOS",
    image: "/classind/CI_18.png",
    color: "#000000",
  },
];

type AgeSelectorProps = {
  onChange?: (id: string) => void;
  value?: string;
};

export default function AgeSelector({ onChange, value }: AgeSelectorProps) {
  // Obter o índice inicial baseado no valor passado
  const initialIndex = value ? ageRatings.findIndex((r) => r.id === value) : 3;

  // Estado para armazenar apenas o índice
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Atualizar o índice apenas quando o valor externo mudar
  useEffect(() => {
    if (value) {
      const newIndex = ageRatings.findIndex((r) => r.id === value);
      if (newIndex >= 0 && newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  }, [currentIndex, value]);

  const increaseRating = () => {
    if (currentIndex < ageRatings.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onChange?.(ageRatings[newIndex].id);
    }
  };

  const decreaseRating = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onChange?.(ageRatings[newIndex].id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <div className={styles.imageWrapper}>
          <Image
            src={ageRatings[currentIndex].image}
            alt={ageRatings[currentIndex].name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.ratingImage}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      <div className={styles.warnText}>
        <p>{ageRatings[currentIndex].name}</p>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.controlButton}
          onClick={increaseRating}
          disabled={currentIndex === ageRatings.length - 1}
        >
          <FiArrowUp />
        </button>
        <button
          className={styles.controlButton}
          onClick={decreaseRating}
          disabled={currentIndex === 0}
        >
          <FiArrowDown />
        </button>
      </div>
    </div>
  );
}
