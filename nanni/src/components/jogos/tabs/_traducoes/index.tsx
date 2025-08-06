"use client";

import styles from "./JogosTabsTraducoes.module.css";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";

export function JogosTabsTraducoes({
  texto,
  audio,
}: {
  texto: string[];
  audio: string[];
}) {
  const [elements, setElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Comprime as traduções a um único Set
    const traducoes = Array.from(new Set([...texto, ...audio]));

    async function run() {
      if (traducoes.length > 0) {
        const paises = new Map<string, PaisesProps>(
          (await Promise.all(traducoes.map((loc) => fetchPais({ loc }))))
            .filter(
              (map): map is Map<string, PaisesProps> => map instanceof Map,
            )
            .flatMap((map) => Array.from(map.entries())),
        );

        if (paises.size > 0) {
          const tmpElements: JSX.Element[] = [];

          for (let i = 0; i < traducoes.length; i++) {
            tmpElements.push(
              <tr key={i}>
                <td className={styles["td"]}>
                  {texto[i] ? traducaoCell(paises.get(texto[i])) : ""}
                </td>
                <td className={styles["td"]}>
                  {audio[i] ? traducaoCell(paises.get(audio[i])) : ""}
                </td>
              </tr>,
            );
          }

          setElements(tmpElements);
          return;
        }
      }

      setElements([
        <tr key={0}>
          <td className={`g-desativado ${styles["td"]}`}>Não Informado</td>
          <td className={`g-desativado ${styles["td"]}`}>Não Informado</td>
        </tr>,
      ]);
    }

    run();
  }, [texto, audio]);

  return (
    <table className={styles["table"]}>
      <thead>
        <tr>
          <th className={styles["th"]}>Texto</th>
          <th className={styles["th"]}>Aúdio</th>
        </tr>
      </thead>
      <tbody className={styles["tbody"]}>{elements}</tbody>
    </table>
  );
}

function traducaoCell({ nome, link_svg }: PaisesProps) {
  return (
    <span className={styles["span"]}>
      <Image
        alt={`Bandeira do ${nome}`}
        src={link_svg}
        width={24}
        height={24}
      />
      <p>{nome}</p>
    </span>
  );
}

async function fetchPais({
  loc,
}: {
  loc: string;
}): Promise<Map<string, PaisesProps> | undefined> {
  if (!loc) return;

  try {
    const resp = await fetch(
      `https://restcountries.com/v3.1/alpha/${loc}?fields=name,flags`,
    );
    if (!resp.ok) return;

    const data = await resp.json();
    if (data.status) return;

    const nomePais = Object.values(data.name.nativeName)[0].common;
    if (!nomePais) return;

    const obj: PaisesProps = {
      nome: nomePais,
      link_svg: data.flags.svg,
    };

    return new Map([[loc, obj]]);
  } catch (err) {
    console.error(err);
    return;
  }
}

type PaisesProps = {
  nome: string;
  link_svg: string;
};
