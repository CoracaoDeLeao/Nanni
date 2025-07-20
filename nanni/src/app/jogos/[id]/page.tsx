export default async function DetailJogo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <main className={`container g-margin shadow-1`}></main>;
}
