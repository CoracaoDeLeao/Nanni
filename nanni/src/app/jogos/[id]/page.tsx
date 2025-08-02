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
    return <p>Jogo Não Encontrado</p>;
  }

  return (
    <main className={`g-margin ${styles["main"]}`}>
      {jogo ? (
        <div className={`container shadow-1  ${styles["div"]}`}>
          <DetailJogoContent jogo={jogo} />
        </div>
      ) : (
        <p>CARREGANDO</p>
      )}
    </main>
  );
}
