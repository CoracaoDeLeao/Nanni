import { useEffect, useState } from "react";
import Dropdown from "@/components/dropdown/dropdown";
import styles from "./Frame3.module.css";
import { FiPlusCircle, FiX } from "react-icons/fi";
import { useFormContext } from "react-hook-form";

const plataformaRecomendada = ["Windows 11", "Windows 10", "Windows 7"];
const conteudoSensivelOptions = [
  "Violência",
  "Linguagem Inapropriada",
  "Conteúdo Sexual",
  "Drogas",
];

export default function Frame3() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // Obter valores do formulário
  const sensitiveContents = (watch("sensitiveContents") as string[]) || [];
  const genres = (watch("genres") as string[]) || [];
  const tags = (watch("tags") as string[]) || [];
  const plataforma =
    (watch("plataforma") as string) || plataformaRecomendada[0];

  const [newGenre, setNewGenre] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setValue("plataforma", plataforma, { shouldValidate: true });
  }, [plataforma, setValue]);

  const handlePlatformChange = (platform: string) => {
    setValue("plataforma", platform, { shouldValidate: true });
  };

  const toggleSensitiveContent = (content: string) => {
    const newContents = sensitiveContents.includes(content)
      ? sensitiveContents.filter((c) => c !== content)
      : [...sensitiveContents, content];

    setValue("sensitiveContents", newContents, { shouldValidate: true });
  };

  const addGenre = () => {
    if (newGenre.trim() && genres.length < 2) {
      const newGenres = [...genres, newGenre.trim()];
      setValue("genres", newGenres, { shouldValidate: true });
      setNewGenre("");
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      const newTags = [...tags, newTag.trim()];
      setValue("tags", newTags, { shouldValidate: true });
      setNewTag("");
    }
  };

  const removeGenre = (index: number) => {
    const newGenres = genres.filter((_, i) => i !== index);
    setValue("genres", newGenres, { shouldValidate: true });
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setValue("tags", newTags, { shouldValidate: true });
  };

  // Função auxiliar para mensagens de erro
  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return "Erro de validação";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Conteúdo</h1>

      <div
        className={`${styles.section} ${errors.plataforma ? styles.errorSection : ""}`}
      >
        <h2 className={styles.sectionTitle}>Plataforma Recomendada</h2>
        <Dropdown
          opcoes={plataformaRecomendada}
          styles={styles}
          onChange={handlePlatformChange}
          value={plataforma}
        />
        {errors.plataforma && (
          <p className={styles.errorMessage}>
            {getErrorMessage(errors.plataforma)}
          </p>
        )}
      </div>

      <div
        className={`${styles.section} ${errors.sensitiveContents ? styles.errorSection : ""}`}
      >
        <h2 className={styles.sectionTitle}>Conteúdo Sensível</h2>
        <div className={styles.sensitiveContent}>
          {conteudoSensivelOptions.map((option) => (
            <label key={option} className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={sensitiveContents.includes(option)}
                onChange={() => toggleSensitiveContent(option)}
              />
              <span className={styles.checkmark}></span>
              {option}
            </label>
          ))}
        </div>
        {errors.sensitiveContents && (
          <p className={styles.errorMessage}>
            {getErrorMessage(errors.sensitiveContents)}
          </p>
        )}
      </div>

      <div
        className={`${styles.section} ${errors.genres ? styles.errorSection : ""}`}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.titleWithCounter}>
            <h2 className={styles.sectionTitleChips}>Gênero</h2>
            <div className={styles.counterBadge}>
              <span>{genres.length}/2</span>
            </div>
          </div>
          <p className={styles.counterLabel}>Máximo permitido</p>
        </div>

        <div className={styles.chipsContainer}>
          {genres.map((genre, index) => (
            <div key={index} className={styles.chip}>
              {genre}
              <button
                onClick={() => removeGenre(index)}
                className={styles.chipRemove}
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.addInputContainer}>
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            placeholder="Adicionar gênero"
            disabled={genres.length >= 2}
            className={errors.genres ? styles.errorInput : ""}
          />
          <button
            onClick={addGenre}
            className={styles.addButton}
            disabled={!newGenre.trim() || genres.length >= 2}
          >
            <FiPlusCircle size={20} />
          </button>
        </div>
        {errors.genres && (
          <p className={styles.errorMessage}>
            {getErrorMessage(errors.genres)}
          </p>
        )}
      </div>

      <div
        className={`${styles.section} ${errors.tags ? styles.errorSection : ""}`}
      >
        <h2 className={styles.sectionTitleChips}>Tags</h2>

        <div className={styles.chipsContainer}>
          {tags.map((tag, index) => (
            <div key={index} className={styles.chip}>
              {tag}
              <button
                onClick={() => removeTag(index)}
                className={styles.chipRemove}
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.addInputContainer}>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Adicionar tag"
            className={errors.tags ? styles.errorInput : ""}
          />
          <button
            onClick={addTag}
            className={styles.addButton}
            disabled={!newTag.trim()}
          >
            <FiPlusCircle size={20} />
          </button>
        </div>
        {errors.tags && (
          <p className={styles.errorMessage}>{getErrorMessage(errors.tags)}</p>
        )}
      </div>
    </div>
  );
}
