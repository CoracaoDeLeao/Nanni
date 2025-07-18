import React, { useState, useRef, useEffect } from "react";
import styles from "./ModalReporte.module.css";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, description: string) => void;
}

const ModalReporte: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [problemType, setProblemType] = useState<string>("Conteúdo impróprio");
  const [description, setDescription] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const problemTypes = [
    "Conteúdo impróprio",
    "Informação incorreta",
    "Problema técnico",
    "Outro",
  ];

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSubmit = () => {
    onSubmit(problemType, description);
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Reportar problema</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.section}>
          <h3>Selecione o tipo do problema</h3>
          <div className={styles.dropdownContainer} ref={dropdownRef}>
            <div
              className={`${styles.dropdownHeader} ${isDropdownOpen ? styles.active : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{problemType}</span>
              <svg
                className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.rotate : ""}`}
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className={styles.dropdownOptions}>
                {problemTypes.map((type) => (
                  <div
                    key={type}
                    className={`${styles.dropdownOption} ${problemType === type ? styles.selected : ""}`}
                    onClick={() => {
                      setProblemType(type);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Razão</h3>
          <p>Nos ajude a entender o problema</p>
          <textarea
            className={styles.descriptionInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escreva aqui"
            rows={4}
          />
        </div>

        <div className={styles.divider}></div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!description.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalReporte;
