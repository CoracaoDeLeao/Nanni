import { db } from "@/lib/Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import axios from "axios";
import { COLLECTIONS } from "@/constants/FirebaseCollections";
import { GameDoc, GameVersion } from "@/types/NovoJogo";

// Manter interface para os dados de entrada
interface PublishGameData {
  nomeJogo: string;
  bannerImage: File | null;
  iconImage: File | null;
  images: { file: File }[];
  devStatus: string;
  ageRating: string;
  descrição: string;
  textTranslations: { lingua: string }[];
  audioTranslations: { lingua: string }[];
  sensitiveContents: string[];
  generos: string[];
  tags: string[];
  plataforma: string;
  principalFile: { name: string; size: number; version: string } | null;
  demoFile: { name: string; size: number; version: string } | null;
  isFree: boolean;
  price: string;
}

// Função para fazer upload de imagens para o ImageBB
const uploadImageToImageBB = async (file: File): Promise<string> => {
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
  });

  const response = await axios.post("/api/upload", {
    imageBase64: base64,
  });

  return response.data.link;
};

// Função principal para publicar o jogo
export const publishGame = async (gameData: PublishGameData) => {
  try {
    // 1. Upload de imagens para o ImageBB
    const [bannerUrl, iconUrl, ...galleryUrls] = await Promise.all([
      gameData.bannerImage
        ? uploadImageToImageBB(gameData.bannerImage)
        : Promise.resolve(""),
      gameData.iconImage
        ? uploadImageToImageBB(gameData.iconImage)
        : Promise.resolve(""),
      ...gameData.images.map((img) => uploadImageToImageBB(img.file)),
    ]);

    // 2. Preparar as versões (apenas metadados)
    const versoes: GameVersion[] = [];

    if (gameData.principalFile) {
      versoes.push({
        nomeArquivo: gameData.principalFile.name,
        tamanho: gameData.principalFile.size,
        versao: gameData.principalFile.version,
        eDemo: false,
        data: serverTimestamp(),
      });
    }

    if (gameData.demoFile) {
      versoes.push({
        nomeArquivo: gameData.demoFile.name,
        tamanho: gameData.demoFile.size,
        versao: gameData.demoFile.version,
        eDemo: true,
        data: serverTimestamp(),
      });
    }

    // 3. Criar documento no Firestore
    const gameDoc: GameDoc = {
      nome: gameData.nomeJogo,
      banner: bannerUrl,
      icone: iconUrl,
      galeria: galleryUrls.map((url) => ({ url })),
      statusDev: gameData.devStatus,
      classificacaoIndicativa: gameData.ageRating,
      sobre: gameData.descrição,
      traducaoTexto: gameData.textTranslations.map(t => t.lingua),
      traducaoAudio: gameData.audioTranslations.map(a => a.lingua),
      contSensivel: gameData.sensitiveContents,
      generos: gameData.generos,
      tags: gameData.tags,
      plataforma: gameData.plataforma,
      versoes,
      preco: gameData.isFree ? "Gratis" : gameData.price,
      data: serverTimestamp(),
    };

    // Adicionar ao Firestore
    const docRef = await addDoc(collection(db, COLLECTIONS.JOGOS), gameDoc);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao publicar jogo:", error);
    throw new Error("Falha na publicação do jogo");
  }
};
