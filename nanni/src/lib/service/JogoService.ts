import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { COLLECTIONS } from "@/constants/FirebaseCollections";
import { JogoProps } from "@/types/JogoProps";

export async function getJogo(
    id: string
) : Promise<JogoProps | undefined> {
    try {
        const ref = doc(db, COLLECTIONS.JOGOS, id);
        const snap = await getDoc(ref);
        
        if(!snap.exists()) return undefined;
        
        return snap.data() as JogoProps;
    } catch(err) {
        console.error(err);
        return undefined;
    }
}

export async function getAvaliacoes(
    jogo_id: string,
    numViews: number,
) {
    try {
        const ref = collection(db, COLLECTIONS.JOGOS, jogo_id, COLLECTIONS.AVALIACOES);
        const snap = await getDocs(ref);

        if(snap.empty) return undefined;
        const sumAvaliacoes = snap.docs.reduce((acc, cur) => acc + (cur.data().avaliacao ?? 0), 0);
        const notaFinal = Math.round((sumAvaliacoes/numViews) * 100);

        return notaFinal;
    } catch(err) {
        console.error(err);

        return undefined;
    }
}

export async function setAvaliacao(
    uid: string,
    jogo_id: string,
    avaliacao: number,
) {
    try {
        const userRef = `/${COLLECTIONS.USERS}/${uid}`;
        const ref = doc(db, COLLECTIONS.JOGOS, jogo_id, COLLECTIONS.AVALIACOES, uid);
        await setDoc(ref, {
            avaliacao,
            userRef
        });

        return true;
    } catch(err) {
        console.error(err);

        return false;
    }
}