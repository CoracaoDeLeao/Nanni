import { useState, useRef, useEffect } from "react";
import { FiPlusCircle, FiTrash2, FiCheck } from "react-icons/fi";
import styles from "./Frame2.module.css";

interface Frame2Props {
  text: string;
  setText: (text: string) => void;
  textTranslations: { id: string; language: string }[];
  setTextTranslations: (
    translations: { id: string; language: string }[],
  ) => void;
  audioTranslations: { id: string; language: string }[];
  setAudioTranslations: (
    translations: { id: string; language: string }[],
  ) => void;
}

export default function Frame2({
  text,
  setText,
  textTranslations,
  setTextTranslations,
  audioTranslations,
  setAudioTranslations,
}: Frame2Props) {
  const [newLanguage, setNewLanguage] = useState("");
  const [activeInput, setActiveInput] = useState<{
    type: "text" | "audio";
    id?: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const startAddingTextTranslation = () => {
    setActiveInput({ type: "text" });
    setNewLanguage("");
  };

  const saveTextTranslation = () => {
    if (newLanguage.trim()) {
      setTextTranslations([
        ...textTranslations,
        { id: Date.now().toString(), language: newLanguage },
      ]);
      setNewLanguage("");
      setActiveInput(null);
    }
  };

  const removeTextTranslation = (id: string) => {
    setTextTranslations(textTranslations.filter((t) => t.id !== id));
  };

  const startAddingAudioTranslation = () => {
    setActiveInput({ type: "audio" });
    setNewLanguage("");
  };

  const saveAudioTranslation = () => {
    if (newLanguage.trim()) {
      setAudioTranslations([
        ...audioTranslations,
        { id: Date.now().toString(), language: newLanguage },
      ]);
      setNewLanguage("");
      setActiveInput(null);
    }
  };

  const removeAudioTranslation = (id: string) => {
    setAudioTranslations(audioTranslations.filter((a) => a.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: "text" | "audio") => {
    if (e.key === "Enter") {
      if (type === "text") {
        saveTextTranslation();
      } else {
        saveAudioTranslation();
      }
    } else if (e.key === "Escape") {
      setActiveInput(null);
      setNewLanguage("");
    }
  };

  // Fechar o input quando clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        activeInput &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setActiveInput(null);
        setNewLanguage("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeInput]);

  useEffect(() => {
    if (activeInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeInput]);

  const characterCount = text.length;
  const maxCharacters = 500;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Sobre</h2>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={handleTextChange}
          maxLength={maxCharacters}
          placeholder="Digite o texto aqui..."
        />
        <p className={styles.counter}>
          {characterCount}/{maxCharacters} caracteres
        </p>
      </div>

      <div className={styles.divider}></div>

      <h2 className={styles.sectionTitle}>Tradução</h2>

      <div className={styles.translationSection}>
        <p className={styles.sectionLabel}>Texto</p>

        <div className={styles.chipsContainer}>
          {textTranslations.map((translation) => (
            <div key={translation.id} className={styles.chip}>
              <span>{translation.language}</span>
              <button
                className={styles.removeButton}
                onClick={() => removeTextTranslation(translation.id)}
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}

          {activeInput?.type === "text" ? (
            <div className={styles.chip} ref={inputRef}>
              <input
                type="text"
                className={styles.languageInput}
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "text")}
                placeholder="Digite o idioma"
              />
              <button
                className={styles.confirmButton}
                onClick={saveTextTranslation}
                disabled={!newLanguage.trim()}
              >
                <FiCheck size={16} />
              </button>
            </div>
          ) : (
            <button
              className={styles.addButton}
              onClick={startAddingTextTranslation}
            >
              <FiPlusCircle size={20} /> Adicionar tradução
            </button>
          )}
        </div>
      </div>

      <div className={styles.translationSection}>
        <p className={styles.sectionLabel}>Áudio</p>

        <div className={styles.chipsContainer}>
          {audioTranslations.map((translation) => (
            <div key={translation.id} className={styles.chip}>
              <span>{translation.language}</span>
              <button
                className={styles.removeButton}
                onClick={() => removeAudioTranslation(translation.id)}
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}

          {activeInput?.type === "audio" ? (
            <div className={styles.chip} ref={inputRef}>
              <input
                type="text"
                className={styles.languageInput}
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "audio")}
                placeholder="Digite o idioma"
              />
              <button
                className={styles.confirmButton}
                onClick={saveAudioTranslation}
                disabled={!newLanguage.trim()}
              >
                <FiCheck size={16} />
              </button>
            </div>
          ) : (
            <button
              className={styles.addButton}
              onClick={startAddingAudioTranslation}
            >
              <FiPlusCircle size={20} /> Adicionar áudio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
