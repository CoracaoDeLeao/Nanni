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

type SearchJogoProps = {
  qLimit: number;
  qPrimeiraLetra?: string;
  qNome?: string;
  qPrecoRange?: number[];
  qTags?: string[];
};

export async function SearchJogo({
  qLimit,
  qPrimeiraLetra,
  qPrecoRange,
  qTags,
}: SearchJogoProps): Promise<JogoItemProps[] | undefined> {
  try {
    const jogoDoc = collection(db, COLLECTIONS.JOGOS);
    const args = [];
    args.push(orderBy("_primeiraLetra"));
    args.push(limit(qLimit));

    if (qPrimeiraLetra && qPrimeiraLetra.length > 0) {
      args.push(where("_primeiraLetra", "==", qPrimeiraLetra));
    }

    if (qPrecoRange) {
      if (qPrecoRange[0]) args.push(where("preco", ">=", qPrecoRange[0]));
      if (qPrecoRange[1]) args.push(where("preco", "<=", qPrecoRange[1]));
    }

    if (qTags && qTags.length > 0 && qTags[0]) {
      args.push(where("tags", "array-contains-any", qTags));
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

export async function FilterSearchJogo({
  qLimit,
  qPrimeiraLetra,
  qNome,
  qPrecoRange,
  qTags,
}: SearchJogoProps): Promise<JogoItemProps[] | undefined> {
  const data = await SearchJogo({ qLimit, qPrecoRange, qPrimeiraLetra, qTags });
  console.log(data);
  if (!data) return;

  let filteredData: JogoItemProps[] = data;
  if (qNome) {
    const lowerQNome = qNome.toLowerCase();
    const arrNome: string[] = lowerQNome.split(" ");

    filteredData = filteredData.filter((item) => {
      const arrItemNome = item.nome.toLowerCase().split(" ");

      if (arrNome.length > 1) {
        return arrNome.some((str) => arrItemNome.includes(str));
      }

      return item.nome.toLowerCase().includes(lowerQNome);
    });
  }

  return filteredData;
}
