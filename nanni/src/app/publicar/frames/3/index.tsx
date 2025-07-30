import { useState } from "react";
import Dropdown from "@/components/dropdown/dropdown";
import styles from "./Frame3.module.css";
import { FiPlusCircle, FiX } from "react-icons/fi";

const plataformaRecomendada = ["Windowns 11", "Windowns 10", "Windowns 7"];
const conteudoSensivelOptions = [
  "Violência",
  "Linguagem Inapropriada",
  "Conteúdo Sexual",
  "Drogas",
];

interface Frame3Props {
  sensitiveContents: string[];
  setSensitiveContents: (contents: string[]) => void;
  genres: string[];
  setGenres: (genres: string[]) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  onPlatformSelected: (platform: string) => void;
}

export default function Frame3({
  sensitiveContents,
  setSensitiveContents,
  genres,
  setGenres,
  tags,
  setTags,
  onPlatformSelected,
}: Frame3Props) {
  const [newGenre, setNewGenre] = useState("");
  const [newTag, setNewTag] = useState("");

  // Estado interno inicializado com o valor da prop ou o primeiro item do array
  const [selectedPlatform, setSelectedPlatform] = useState(
    plataformaRecomendada[0],
  );

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    onPlatformSelected(platform);
  };

  const toggleSensitiveContent = (content: string) => {
    if (sensitiveContents.includes(content)) {
      setSensitiveContents(sensitiveContents.filter((c) => c !== content));
    } else {
      setSensitiveContents([...sensitiveContents, content]);
    }
  };

  const addGenre = () => {
    if (newGenre.trim() && genres.length < 2) {
      setGenres([...genres, newGenre.trim()]);
      setNewGenre("");
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeGenre = (index: number) => {
    setGenres(genres.filter((_, i) => i !== index));
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Conteúdo</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitleA}>Plataforma Recomendada</h2>
        <Dropdown
          opcoes={plataformaRecomendada}
          styles={styles}
          onChange={handlePlatformChange}
          value={selectedPlatform}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitleA}>Conteúdo Sensível</h2>
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
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleWithCounter}>
            <h2 className={styles.sectionTitle}>Gênero</h2>
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
          />
          <button
            onClick={addGenre}
            className={styles.addButton}
            disabled={!newGenre.trim() || genres.length >= 2}
          >
            <FiPlusCircle size={20} />
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Tags</h2>

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
          />
          <button
            onClick={addTag}
            className={styles.addButton}
            disabled={!newTag.trim()}
          >
            <FiPlusCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
