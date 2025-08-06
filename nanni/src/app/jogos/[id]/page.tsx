import styles from "@/styles/jogos.module.css";
import { JogoProps } from "@/types/JogoProps";
import DetailJogoContent from "@/components/jogos/content";
import { getJogo } from "@/lib/service/JogoService";

export default async function DetailJogoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jogo: JogoProps | undefined = await getJogo(id);

  if (!jogo) {
    return (
      <main className={"g-margin g-padding shadow-2 container"}>
        <p>Não Encontrado</p>
      </main>
    );
  }

  return (
    <main className={`g-margin container shadow-1 ${styles["main"]}`}>
      <DetailJogoContent jogo={jogo} />
    </main>
  );
}
