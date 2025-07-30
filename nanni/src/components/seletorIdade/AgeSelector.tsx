// components/AgeSelector.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import styles from "./AgeSelector.module.css";

const ageRatings = [
  {
    id: "Livre",
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
};

export default function AgeSelector({ onChange }: AgeSelectorProps) {
  const [currentRating, setCurrentRating] = useState(3); // Começa em 14 anos

  useEffect(() => {
    if (onChange) {
      onChange(ageRatings[currentRating].id);
    }
  }, [currentRating, onChange]);

  const increaseRating = () => {
    if (currentRating < ageRatings.length - 1) {
      setCurrentRating(currentRating + 1);
    }
  };

  const decreaseRating = () => {
    if (currentRating > 0) {
      setCurrentRating(currentRating - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src={ageRatings[currentRating].image}
          alt={ageRatings[currentRating].name}
          width={100}
          height={0}
          style={{ height: "auto" }}
          className={styles.ratingImage}
        />
      </div>

      <div className={styles.warnText}>
        <p>{ageRatings[currentRating].name}</p>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.controlButton}
          onClick={increaseRating}
          disabled={currentRating === ageRatings.length - 1}
        >
          <FiArrowUp />
        </button>
        <button
          className={styles.controlButton}
          onClick={decreaseRating}
          disabled={currentRating === 0}
        >
          <FiArrowDown />
        </button>
      </div>
    </div>
  );
}
