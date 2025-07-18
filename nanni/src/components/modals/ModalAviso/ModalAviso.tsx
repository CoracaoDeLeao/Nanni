import React from "react";
import styles from "./ModalAviso.module.css";

interface ModalAvisoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const ModalAviso: React.FC<ModalAvisoProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message = "MENSSAGEM",
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Tem Certeza?</h2>
        </div>

        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={onClose}
          >
            Voltar
          </button>
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAviso;
