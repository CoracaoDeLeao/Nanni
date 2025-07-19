import React, { useState, useRef, useEffect } from "react";
import styles from "./ModalReporte.module.css";
import { saveReporte } from "@/lib/service/ReporteService";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userID: string;
  jogoID: string;
}

const ModalReporte: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  userID,
  jogoID,
}) => {
  const [tipoProblema, setTipoProblema] =
    useState<string>("Conteúdo impróprio");
  const [razao, setRazao] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tiposProblema = [
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

  const handleSubmit = async () => {
    if (!razao.trim()) {
      setError("Por favor, descreva o problema");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Chamada ao serviço de reporte
      const result = await saveReporte(jogoID, userID, {
        tipoProblema,
        razao,
      });

      if (!result.success) {
        throw new Error(result.error || "Erro ao enviar reporte");
      }

      // Animação de sucesso
      setIsSuccess(true);
      
      // Resetar estados e fechar modal após 1.5 segundos
      setTimeout(() => {
        setRazao("");
        setIsSuccess(false);
        onClose();
      }, 1500);

    } catch (err: unknown) {
      console.error("Erro ao enviar reporte:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro. Tente novamente mais tarde.");
      }

    } finally {
      setIsSubmitting(false);
    }
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
              <span>{tipoProblema}</span>
              <svg
                className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.rotate : ""}`}
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className={styles.dropdownOptions}>
                {tiposProblema.map((type) => (
                  <div
                    key={type}
                    className={`${styles.dropdownOption} ${tipoProblema === type ? styles.selected : ""}`}
                    onClick={() => {
                      setTipoProblema(type);
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
            value={razao}
            onChange={(e) => setRazao(e.target.value)}
            placeholder="Escreva aqui"
            rows={4}
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>

        <div className={styles.divider}></div>

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.submitButton} ${isSuccess ? styles.success : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting || isSuccess || !razao.trim()}
          >
            {isSuccess ? (
              <svg className={styles.checkIcon} viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            ) : isSubmitting ? (
              <div className={styles.spinner}></div>
            ) : (
              "Enviar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalReporte;