"use client";

import { useAuth } from "@/context/AuthContextProvider";
import { useState } from "react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { IconContext } from "react-icons";
import { setAvaliacao } from "@/lib/service/JogoService";

export function JogosAvaliacao({
  id,
  paddingRight,
  styleButton,
}: {
  id: string;
  paddingRight: number;
  styleButton: string;
}) {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const { user } = useAuth();

  async function handleAvaliar() {
    const uid: string = user?.id ?? "nC0vCtHHKWaHNm3gA3ZR1l6MCJq2";

    setLoading(true);

    await setAvaliacao(uid, id, rating * 2);

    setLoading(false);
  }

  const colorEstrela = "#EDED18";

  return (
    <div
      className={loading ? "g-desativado" : ""}
      style={{
        pointerEvents: loading ? "none" : "auto",
        paddingRight,
        textAlign: "center",
      }}
    >
      <button
        className={`g-button-image ${styleButton}`}
        onClick={handleAvaliar}
      >
        Avaliar
      </button>
      <div>
        <IconContext.Provider value={{ size: "24px", color: colorEstrela }}>
          {Array.from({ length: 5 }, (_, index) => {
            if (index + 1 <= rating) {
              return (
                <BsStarFill onClick={() => setRating(index + 1)} key={index} />
              );
            }
            if (index + 0.5 <= rating) {
              return (
                <BsStarHalf onClick={() => setRating(index + 1)} key={index} />
              );
            } else {
              return (
                <BsStar onClick={() => setRating(index + 0.5)} key={index} />
              );
            }
          })}
        </IconContext.Provider>
        <p style={{ userSelect: "none", marginTop: 5 }}>{rating * 2}</p>
      </div>
    </div>
  );
}
