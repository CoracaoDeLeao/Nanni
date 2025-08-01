"use client";


import "./JogosTabs.react-tabs.css";
import styles from "./JogosTabs.module.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { JogosTabsTraducoes } from "./_traducoes";
import { JogosClassificaoIndicativa } from "../classificao_indicativa";

export function JogosTabs({
  params,
}: {
  params: {
    sobre: string;
    plataforma: string;
    traducaoTexto: string[];
    traducaoAudio: string[];
    tags: string[];
    genero: string[];
    changelog: string[];
    classificacaoIndicativa: string;
  };
}) {
  const hasChangelog = params.changelog && params.changelog.length > 0;
  const allTags =
    params.tags && params.tags.length > 0
      ? params.tags.map((item) => `#${item}`).join(", ")
      : [];

  return (
    <Tabs>
      <TabList>
        <Tab>Sobre</Tab>
        <Tab disabled={!hasChangelog}>Changelog</Tab>
      </TabList>

      <TabPanel>
        <div className={styles["sobre-div"]}>
          <div className={styles["sobre-div__descricao"]}>
            <p>{params.sobre}</p>
            <div className={styles["sobre-div__extra"]}>
              <JogosClassificaoIndicativa
                clsIndicativa={params.classificacaoIndicativa}
              />
              <div className={styles["sobre-div__extra-info"]}>
                <span>
                  <h4>Informações do Arquivo</h4>
                  <p>teste.exe | 280 mb</p>
                </span>

                <span>
                  <h4>Informações da Demo</h4>
                  <p>demo-teste.exe | 280 mb</p>
                </span>
              </div>
            </div>
          </div>
          <div className={styles["sobre-div__outros"]}>
            <h3 className={styles["sobre-div__outros-titulo"]}>Tradução</h3>
            <JogosTabsTraducoes
              texto={params.traducaoTexto || []}
              audio={params.traducaoAudio || []}
            />

            <h3 className={styles["sobre-div__outros-titulo"]}>Gênero</h3>
            {params.genero && params.genero.length > 0 ? (
              <ul className={styles["sobre-div__genero"]}>
                {params.genero.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>Não Informado</p>
            )}

            <h3 className={styles["sobre-div__outros-titulo"]}>Tags</h3>
            {allTags.length > 0 ? (
              <p className={styles["sobre-div__tags"]}>{allTags}</p>
            ) : (
              <p>Não Informado</p>
            )}
          </div>
        </div>
      </TabPanel>

      <TabPanel>
        {hasChangelog &&
          params.changelog.map((item, index) => (
            <div key={index} className={styles["sobre-div__changelog"]}>
              {item}
            </div>
          ))}
      </TabPanel>
    </Tabs>
  );
}
