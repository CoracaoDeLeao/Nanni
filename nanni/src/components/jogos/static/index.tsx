import styles from "@/styles/jogos.module.css";
import JogosGaleria from "../carrossel";
import Image from "next/image";
import { colorStatusDev } from "../cores_status";
import { BsStarFill } from "react-icons/bs";
import { JogoPreco } from "../events/preco";
import { StaticJogoTabs } from "./_tabs";

export function DetailJogoStatic({
  nomeJogo = "",
  bannerImage = null,
  iconImage = null,
  images = [],
  devStatus = "",
  ageRating = "",
  text = "",
  textTranslations = [],
  audioTranslations = [],
  sensitiveContents = [],
  genres = [],
  tags = [],
  plataforma = "",
  principalFile = null,
  demoFile = null,
  currencyValue = "",
  isFree = false,
  noDemo = false,
  bannerSize = 100,
}) {
  const galeriasUrls =
    images?.length > 0 && images[0]?.url
      ? images.map((item) => item?.url ?? "/file.svg")
      : [];

  const galeriaImages =
    typeof bannerImage?.url === "string"
      ? [bannerImage.url, ...galeriasUrls]
      : [galeriasUrls];

  const backgroundStatusDev: string | undefined =
    devStatus in colorStatusDev
      ? colorStatusDev[devStatus as keyof typeof colorStatusDev]
      : undefined;

  const precoValue = Number(currencyValue) ?? 0;

  return (
    <>
      <div className={styles["div"]}>
        {false && <JogosGaleria galeria={galeriaImages} />}
        <div className={styles["jogo-titulo-div"]}>
          <Image
            src={iconImage?.url ?? "/file.svg"}
            alt={"Icone do Jogo"}
            width={bannerSize}
            height={bannerSize}
            className={styles["jogo-titulo-icone"]}
          />
          <div className={styles["jogo-principal"]}>
            <span
              className={styles["jogo-titulo"]}
              style={{ paddingLeft: bannerSize + 10 }}
            >
              <p className={styles["jogo-titulo-texto"]}>{nomeJogo ?? ""}</p>
              {backgroundStatusDev && (
                <p
                  className={styles["jogo-titulo-status"]}
                  style={{ backgroundColor: backgroundStatusDev }}
                >
                  {devStatus}
                </p>
              )}
              <span className={styles["jogo-avaliacao"]}>
                <BsStarFill />
                <p>--/10</p>
              </span>
            </span>
            <div className={styles["jogo-botoes"]}>
              <JogoPreco
                preco={precoValue}
                isFree={isFree || precoValue === 0}
                hasDemo={noDemo}
              />
            </div>
          </div>
        </div>
      </div>

      <StaticJogoTabs
        ageRating={ageRating}
        text={text}
        textTranslations={textTranslations}
        audioTranslations={audioTranslations}
        genres={genres}
        tags={tags}
        principalFile={principalFile}
        demoFile={demoFile}
      />
    </>
  );
}
