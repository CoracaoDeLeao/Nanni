"use client";

import { useState } from "react";
import styles from "./Publicar.module.css";
import { AnimatePresence, motion } from "framer-motion";
import Frame1 from "./frames/1";
import Frame2 from "./frames/2";
import Frame3 from "./frames/3";
import Frame4 from "./frames/4";
import { FileInfo, GalleryImage, Translation } from "@/types/Publicar";
import { publishGame } from "@/lib/service/PublicarService";

// TODO: Colocar bloqueio de campos vazios
// TODO: Fazer o preview

export default function PublicarJogo() {
  // Frame1
  const [nomeJogo, setNomeJogo] = useState("");
  const [bannerImage, setBannerImage] = useState<{
    url: string;
    file: File;
  } | null>(null);
  const [iconImage, setIconImage] = useState<{
    url: string;
    file: File;
  } | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [devStatus, setDevStatus] = useState("");
  const [ageRating, setAgeRating] = useState("");

  // Frame2
  const [text, setText] = useState("");
  const [textTranslations, setTextTranslations] = useState<Translation[]>([]);
  const [audioTranslations, setAudioTranslations] = useState<Translation[]>([]);

  // Frame3
  const [sensitiveContents, setSensitiveContents] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [plataforma, setPlataforma] = useState("");

  // Frame4
  const [principalFile, setPrincipalFile] = useState<FileInfo | null>(null);
  const [demoFile, setDemoFile] = useState<FileInfo | null>(null);
  const [currencyValue, setCurrencyValue] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [noDemo, setNoDemo] = useState(false);

  // PublicarJogo
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const totalSteps = 4;

  const stepContents = [
    <Frame1
      key={1}
      gameName={nomeJogo}
      setGameName={setNomeJogo}
      bannerImage={bannerImage}
      setBannerImage={setBannerImage}
      iconImage={iconImage}
      setIconImage={setIconImage}
      images={images}
      setImages={setImages}
      onDevStatusSelected={setDevStatus}
      onAgeRatingSelected={setAgeRating}
    />,
    <Frame2
      key={2}
      text={text}
      setText={setText}
      textTranslations={textTranslations}
      setTextTranslations={setTextTranslations}
      audioTranslations={audioTranslations}
      setAudioTranslations={setAudioTranslations}
    />,
    <Frame3
      key={3}
      sensitiveContents={sensitiveContents}
      setSensitiveContents={setSensitiveContents}
      genres={genres}
      setGenres={setGenres}
      tags={tags}
      setTags={setTags}
      onPlatformSelected={setPlataforma}
    />,
    <Frame4
      key={4}
      principalFile={principalFile}
      setPrincipalFile={setPrincipalFile}
      demoFile={demoFile}
      setDemoFile={setDemoFile}
      currencyValue={currencyValue}
      setCurrencyValue={setCurrencyValue}
      isFree={isFree}
      setIsFree={setIsFree}
      noDemo={noDemo}
      setNoDemo={setNoDemo}
    />,
  ];

  const handleStepChange = (step: number) => {
    setDirection(step > currentStep ? "right" : "left");
    setCurrentStep(step);
  };

  // Função para voltar passo
  const handlePrevious = () => {
    if (currentStep > 1) {
      setDirection("left");
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Função para avançar passo
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setDirection("right");
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Função para publicar
  const handlePublish = async () => {
    try {
      const gameData = {
        nomeJogo,
        bannerImage: bannerImage?.file || null,
        iconImage: iconImage?.file || null,
        images: images.map((img) => ({ file: img.file })),
        devStatus,
        ageRating,
        descrição: text,
        textTranslations: textTranslations.map((t) => ({ lingua: t.language })),
        audioTranslations: audioTranslations.map((a) => ({
          lingua: a.language,
        })),
        sensitiveContents,
        generos: genres,
        tags,
        plataforma,
        principalFile: principalFile
          ? {
              name: principalFile.name,
              size: principalFile.size,
              version: principalFile.version,
            }
          : null,
        demoFile: demoFile
          ? {
              name: demoFile.name,
              size: demoFile.size,
              version: demoFile.version,
            }
          : null,
        isFree,
        price: currencyValue,
      };

      await publishGame(gameData);
      alert("Jogo publicado com sucesso!");
    } catch (error) {
      console.error("Erro na publicação:", error);
      alert("Erro ao publicar o jogo. Por favor, tente novamente.");
    }
  };

  // Variantes de animação
  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        {/* Conteúdo do passo atual com animação */}
        <div className={styles.contentContainer}>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: "tween",
                duration: 0.25,
                ease: "easeInOut",
              }}
              className={styles.motionContainer}
            >
              {stepContents[currentStep - 1]}

              <div className={styles.navBTNS}>
                {/* Botões de navegação */}
                <div className={styles.buttonsContainer}>
                  {[...Array(totalSteps)].map((_, index) => {
                    const stepNumber = index + 1;
                    return (
                      <button
                        key={stepNumber}
                        className={`${styles.stepButton} ${
                          currentStep === stepNumber ? styles.active : ""
                        }`}
                        onClick={() => handleStepChange(stepNumber)}
                      >
                        {stepNumber}
                      </button>
                    );
                  })}
                </div>

                <div className={styles.navBTNConrainer}>
                  {currentStep > 1 && (
                    <button
                      className={styles.btnVoltar}
                      onClick={handlePrevious}
                    >
                      VOLTAR
                    </button>
                  )}

                  {currentStep < totalSteps && (
                    <button className={styles.btnAvancar} onClick={handleNext}>
                      AVANÇAR
                    </button>
                  )}

                  {currentStep === totalSteps && (
                    <button
                      className={styles.btnPublicar}
                      onClick={handlePublish}
                    >
                      PUBLICAR
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.previewContainer}>
          <p>ALO</p>
        </div>
      </div>
    </div>
  );
}
