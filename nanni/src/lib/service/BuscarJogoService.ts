import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Firebase";
import { COLLECTIONS } from "@/constants/FirebaseCollections";
import { JogoItemProps } from "@/types/JogoItemProps";

export type SearchJogoProps = {
  qNome?: string;
  qLimit: number;
};

type FilterJogoProps = {
  qPriceRange?: number[];
  searchProps: SearchJogoProps;
};

export async function SearchJogo(
  values: SearchJogoProps,
): Promise<JogoItemProps[] | undefined> {
  try {
    const jogoDoc = collection(db, COLLECTIONS.JOGOS);
    const args = [];
    args.push(orderBy("_primeiraLetra"));
    args.push(limit(values.qLimit));

    if (typeof values.qNome === "string") {
      args.push(where("_primeiraLetra", "==", values.qNome.charAt(0)));
    }

    const jogoQuery = query(jogoDoc, ...args);
    const snap = await getDocs(jogoQuery);

    return snap.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as JogoItemProps,
    );
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function filterSearchJogo({
  qPriceRange,
  searchProps,
}: FilterJogoProps): Promise<JogoItemProps[] | undefined> {
  const raw: JogoItemProps[] | undefined = await SearchJogo(searchProps);

  if (!raw) return;
  if (raw.length === 1) return raw;
  if (typeof qNome !== "string") return raw;

  const filteredData: JogoItemProps[] = raw.filter((item) => {
    let passou = true;

    if (qPriceRange && qPriceRange.length === 2) {
      if (item.preco < qPriceRange[0] || item.preco > qPriceRange[1]) {
        passou = false;
      }
    }

    if (qNome && qNome.length > 1) {
      if (!item.nome.toLowerCase().includes(qNome)) {
        passou = false;
      }
    }

    return passou;
  });

  return filteredData;
}
