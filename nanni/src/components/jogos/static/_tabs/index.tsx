"use client";

import "../../tabs/JogosTabs.react-tabs.css";
import styles from "../../tabs/JogosTabs.module.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { JogosClassificaoIndicativa } from "../../classificao_indicativa";
import { JogosTabsTraducoes } from "../../tabs/_traducoes";

export function StaticJogoTabs({
  ageRating = "",
  text = "",
  textTranslations = [],
  audioTranslations = [],
  genres = [],
  sensitiveContents = [],
  tags = [],
  principalFile = null,
  demoFile = null,
}) {
  const allTags = tags?.length > 0
    ? tags.map((item) => `#${item}`).join(", ") 
    : [];

  return (
    <Tabs>
      <TabList>
        <Tab>Sobre</Tab>
        <Tab disabled={true}>Changelog</Tab>
      </TabList>

      <TabPanel>
        <div className={styles["sobre-div"]} style={{ maxHeight: "100%"}}>
          <div className={styles["sobre-div__descricao"]}>
            {text ? (
              <p>{text}</p>
            ) : (
              <p className={"g-desativado"}>Não informado</p>
            )}
            <div className={styles["sobre-div__extra"]}>
              {ageRating && (
                <JogosClassificaoIndicativa clsIndicativa={ageRating} />
              )}
              <div className={styles["sobre-div__extra-info"]}>
                {principalFile &&
                  principalFile?.name &&
                  principalFile?.size && (
                    <span>
                      <h4>Informações do Arquivo</h4>
                      <p>
                        {principalFile.name} | {principalFile.size}
                      </p>
                    </span>
                  )}

                {demoFile && demoFile?.name && demoFile?.size && (
                  <span>
                    <h4>Informações da Demo</h4>
                    <p>
                      {demoFile.name} | {demoFile.size}
                    </p>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={styles["sobre-div__outros"]}>
            <h3 className={styles["sobre-div__outros-titulo"]}>Tradução</h3>
            <JogosTabsTraducoes
              texto={textTranslations ?? []}
              audio={audioTranslations ?? []}
            />

            <h3 className={styles["sobre-div__outros-titulo"]}>Gênero</h3>
              {genres && genres.length > 0 ? (
                <ul className={styles["sobre-div__genero"]}>
                  {genres.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className={"g-desativado"}>Não Informado</p>
              )}

            <h3 className={styles["sobre-div__outros-titulo"]}>Tags</h3>
              {allTags.length > 0 ? (
                <p className={styles["sobre-div__tags"]}>{allTags}</p>
              ) : (
                <p className={"g-desativado"}>Não Informado</p>
              )}
          </div>
        </div>
      </TabPanel>

      <TabPanel /> {/*Painel de Changelog */}
    </Tabs>
  );
}
