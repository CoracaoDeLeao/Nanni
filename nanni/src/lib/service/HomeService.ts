import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../Firebase";
import { COLLECTIONS } from "@/constants/FirebaseCollections";
import { JogoItemProps } from "@/types/JogoItemProps";
import { HomeCarrosselImagem } from "@/components/home/carrossel/index";

export async function fetchJogosDestaque() {
  try {
    const ref = collection(db, COLLECTIONS.JOGOS);

    const snap = await getDocs(query(ref, orderBy("numViews"), limit(5)));

    if (snap.empty) return undefined;

    return snap.docs.map(
      (item) =>
        ({
          id: item.id,
          ...item.data(),
        }) as JogoItemProps,
    );
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function fetchJogosNovos(qID?: string) {
  try {
    const ref = collection(db, COLLECTIONS.JOGOS);

    const snap = await getDocs(
      query(
        ref,
        orderBy("data"),
        orderBy("__name__"),
        limit(5),
        ...(qID ? [startAfter(qID)] : []),
      ),
    );

    if (snap.empty) return undefined;

    return snap.docs.map(
      (item) =>
        ({
          id: item.id,
          ...item.data(),
        }) as JogoItemProps,
    );
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function fetchJogosCarrossel(
  quantidade = 5,
): Promise<HomeCarrosselImagem[] | undefined> {
  try {
    const ref = collection(db, COLLECTIONS.JOGOS);
    const snap = await getDocs(
      query(ref, orderBy("galeria"), limit(quantidade)),
    );

    if (snap.empty) return [];

    return snap.docs.map((item) => {
      const data = item.data();
      const alt =
        data?.nome && typeof data.nome === "string"
          ? `Imagem de ${data.nome}`
          : "Imagem";

      return {
        id: item.id,
        url: data?.galeria[0]?.url ?? "",
        alt: alt,
        sobre: data?.sobre ?? "",
        numViews: data?.numViews ?? 0,
        tags: data?.tags ?? [],
      } as HomeCarrosselImagem;
    });
  } catch (err) {
    console.error(err);
    return;
  }
}
