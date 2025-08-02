"use client";

import { useState } from "react";
import styles from "./Publicar.module.css";
import { AnimatePresence, motion } from "framer-motion";
import Frame1 from "./frames/1";
import Frame2 from "./frames/2";
import Frame3 from "./frames/3";
import Frame4 from "./frames/4";
import { publishGame } from "@/lib/service/PublicarService";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

// TODO: Fazer o preview

// Schema de validação
const formSchema = z
  .object({
    // Frame1
    nomeJogo: z.string().min(1, "Nome do jogo é obrigatório"),
    bannerImage: z
      .object({
        url: z.string(),
        file: z.instanceof(File),
      })
      .nullable()
      .refine((val) => val !== null, { message: "Banner é obrigatório" }),
    iconImage: z
      .object({
        url: z.string(),
        file: z.instanceof(File),
      })
      .nullable()
      .refine((val) => val !== null, { message: "Ícone é obrigatório" }),
    images: z
      .array(
        z.object({
          url: z.string(),
          file: z.instanceof(File),
        })
      )
      .min(1, "Adicione pelo menos uma imagem"),
    devStatus: z.string().min(1, "Status de desenvolvimento é obrigatório"),
    ageRating: z.string().min(1, "Classificação etária é obrigatória"),

    // Frame2
    text: z.string().min(1, "Descrição do jogo é obrigatória"),
    textTranslations: z
      .array(
        z.object({
          id: z.string(),
          language: z.string().min(1, "Idioma é obrigatório"),
        })
      )
      .min(1, "Adicione pelo menos uma tradução de texto"),
    audioTranslations: z
      .array(
        z.object({
          id: z.string(),
          language: z.string().min(1, "Idioma é obrigatório"),
        })
      )
      .min(1, "Adicione pelo menos uma tradução de áudio"),

    // Frame3
    sensitiveContents: z.array(z.string()),
    genres: z.array(z.string()).min(1, "Selecione pelo menos um gênero"),
    tags: z.array(z.string()).min(1, "Adicione pelo menos uma tag"),
    plataforma: z.string().min(1, "Plataforma é obrigatória"),

    // Frame4
    principalFile: z
      .object({
        name: z.string(),
        size: z.number(),
        version: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Arquivo principal é obrigatório",
      }),
    demoFile: z
      .object({
        name: z.string(),
        size: z.number(),
        version: z.string(),
      })
      .optional()
      .nullable(),
    currencyValue: z.string().optional(),
    isFree: z.boolean(),
    noDemo: z.boolean(),
  })
  .refine((data) => data.noDemo || data.demoFile, {
    message: "Arquivo de demo é obrigatório",
    path: ["demoFile"],
  })
  .refine((data) => data.isFree || data.currencyValue, {
    message: "Valor monetário é obrigatório",
    path: ["currencyValue"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function PublicarJogo() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeJogo: "",
      bannerImage: null,
      iconImage: null,
      images: [],
      devStatus: "",
      ageRating: "",
      text: "",
      textTranslations: [],
      audioTranslations: [],
      sensitiveContents: [],
      genres: [],
      tags: [],
      plataforma: "",
      principalFile: null,
      demoFile: null,
      currencyValue: "",
      isFree: false,
      noDemo: false,
    },
  });

  //  Validação
  const { trigger } = methods;

  // Definir tipo para os campos dos frames
  type FrameFields = {
    [key: number]: (keyof FormValues)[];
  };

  const frameFields: FrameFields = {
    1: [
      "nomeJogo",
      "bannerImage",
      "iconImage",
      "images",
      "devStatus",
      "ageRating",
    ],
    2: ["text", "textTranslations", "audioTranslations"],
    3: ["sensitiveContents", "genres", "tags", "plataforma"],
    4: ["principalFile", "demoFile", "currencyValue", "isFree", "noDemo"],
  };

  const [isPublishing, setIsPublishing] = useState(false);

  // PublicarJogo
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const totalSteps = 4;

  const stepContents = [
    <Frame1 key={1} />,
    <Frame2 key={2} />,
    <Frame3 key={3} />,
    <Frame4 key={4} />,
  ];

  const handleStepChange = async (step: number) => {
    if (step > currentStep) {
      const fields = frameFields[currentStep];
      const isValid = await trigger(fields);
      if (!isValid) return;
    }

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
  const handleNext = async () => {
    const fields = frameFields[currentStep];
    const isValid = await trigger(fields);
    if (!isValid) return;

    if (currentStep < totalSteps) {
      setDirection("right");
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Função para publicar
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const formData = methods.getValues();

      // Corrigir para atender à interface do publishGame
      const gameData = {
        nomeJogo: formData.nomeJogo,
        bannerImage: formData.bannerImage?.file || null,
        iconImage: formData.iconImage?.file || null,
        images: formData.images.map((img) => ({ file: img.file })),
        devStatus: formData.devStatus,
        ageRating: formData.ageRating,
        descrição: formData.text,
        textTranslations: formData.textTranslations.map((t) => ({
          lingua: t.language, // Corrigir propriedade para 'lingua'
        })),
        audioTranslations: formData.audioTranslations.map((a) => ({
          lingua: a.language, // Corrigir propriedade para 'lingua'
        })),
        sensitiveContents: formData.sensitiveContents,
        generos: formData.genres,
        tags: formData.tags,
        plataforma: formData.plataforma,
        principalFile: formData.principalFile
          ? {
              name: formData.principalFile.name,
              size: formData.principalFile.size,
              version: formData.principalFile.version,
            }
          : null,
        demoFile: formData.demoFile
          ? {
              name: formData.demoFile.name,
              size: formData.demoFile.size,
              version: formData.demoFile.version,
            }
          : null,
        isFree: formData.isFree,
        price: formData.currencyValue || "",
      };

      await publishGame(gameData);
      alert("Jogo publicado com sucesso!");
    } catch (error) {
      console.error("Erro na publicação:", error);
      alert("Erro ao publicar o jogo. Por favor, tente novamente.");
    } finally {
      setIsPublishing(false);
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

  const Spinner = () => (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      className={styles.spinner}
    />
  );

  return (
    <FormProvider {...methods}>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
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
                      <button
                        className={styles.btnAvancar}
                        onClick={handleNext}
                      >
                        AVANÇAR
                      </button>
                    )}

                    {currentStep === totalSteps && (
                      <button
                        className={styles.btnPublicar}
                        onClick={handlePublish}
                        disabled={isPublishing}
                      >
                        {isPublishing ? (
                          <div className={styles.spinnerContainer}>
                            <Spinner />
                          </div>
                        ) : (
                          "PUBLICAR"
                        )}
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
    </FormProvider>
  );
}
