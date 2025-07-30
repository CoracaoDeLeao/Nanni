import { useRef, useState, ChangeEvent, useEffect } from "react";
import styles from "./Frame4.module.css";
import { FiCheckCircle, FiUpload, FiTrash2, FiX } from "react-icons/fi";
import { FileInfo } from "@/types/Publicar";

interface Frame4Props {
  principalFile: FileInfo | null;
  setPrincipalFile: (file: FileInfo | null) => void;
  demoFile: FileInfo | null;
  setDemoFile: (file: FileInfo | null) => void;
  currencyValue: string;
  setCurrencyValue: (value: string) => void;
  isFree: boolean;
  setIsFree: (value: boolean) => void;
  noDemo: boolean;
  setNoDemo: (value: boolean) => void;
}

export default function Frame4({
  principalFile,
  setPrincipalFile,
  demoFile,
  setDemoFile,
  currencyValue,
  setCurrencyValue,
  isFree,
  setIsFree,
  noDemo,
  setNoDemo,
}: Frame4Props) {
  const principalInputRef = useRef<HTMLInputElement>(null);
  const demoInputRef = useRef<HTMLInputElement>(null);

  // Estados para controlar as versões
  const [principalVersion, setPrincipalVersion] = useState("1.0.0");
  const [demoVersion, setDemoVersion] = useState("1.0.0");

  // Atualiza versões quando arquivos são alterados
  useEffect(() => {
    if (!principalFile) setPrincipalVersion("1.0.0");
    if (!demoFile) {
      setDemoVersion("1.0.0");
      setNoDemo(false);
    }
  }, [principalFile, demoFile, setNoDemo]);

  // Formatação monetária (R$)
  const formatCurrency = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "";
    const number = Number(digits) / 100;
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatCurrency(rawValue);
    setCurrencyValue(formattedValue);
  };

  // Manipula o upload de arquivos
  const handleFileUpload = (isPrincipal: boolean, file: File | null) => {
    if (!file) return;

    const fileInfo: FileInfo = {
      name: file.name,
      size: file.size,
      formattedSize: formatFileSize(file.size),
      type: file.type,
      file,
      version: isPrincipal ? principalVersion : demoVersion,
    };

    if (isPrincipal) {
      setPrincipalFile(fileInfo);
    } else {
      setDemoFile(fileInfo);
      setNoDemo(false);
    }
  };

  // Formata o tamanho do arquivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Remove o arquivo enviado
  const handleRemoveFile = (isPrincipal: boolean) => {
    if (isPrincipal) {
      setPrincipalFile(null);
      if (principalInputRef.current) {
        principalInputRef.current.value = "";
      }
    } else {
      setDemoFile(null);
      if (demoInputRef.current) {
        demoInputRef.current.value = "";
      }
    }
  };

  // Atualiza versão quando input muda
  const handleVersionChange = (
    e: ChangeEvent<HTMLInputElement>,
    isPrincipal: boolean,
  ) => {
    const newVersion = e.target.value;
    if (isPrincipal) {
      setPrincipalVersion(newVersion);
      if (principalFile) {
        setPrincipalFile({
          ...principalFile,
          version: newVersion,
        });
      }
    } else {
      setDemoVersion(newVersion);
      if (demoFile) {
        setDemoFile({
          ...demoFile,
          version: newVersion,
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Sobre</h1>

      {/* Principal Section */}
      <div className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Principal</h2>
          {principalFile && (
            <button
              className={styles.removeButton}
              onClick={() => handleRemoveFile(true)}
            >
              <FiTrash2 /> Remover
            </button>
          )}
        </div>

        {principalFile ? (
          <div className={styles.fileInfo}>
            <p>
              {principalFile.name} | Tamanho: {principalFile.formattedSize} |
              Versão: {principalFile.version}
            </p>
            <div className={styles.versionInputContainer}>
              <label>Atualizar versão:</label>
              <input
                type="text"
                value={principalVersion}
                onChange={(e) => handleVersionChange(e, true)}
                className={styles.versionInput}
              />
            </div>
            <div className={styles.sentStatus}>
              <FiCheckCircle className={styles.checkIcon} />
              <span>Recebido</span>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.fileInfo}>
              <p>Nenhum arquivo selecionado</p>
            </div>
            <div className={styles.versionInputContainer}>
              <label>Versão inicial:</label>
              <input
                type="text"
                value={principalVersion}
                onChange={(e) => setPrincipalVersion(e.target.value)}
                className={styles.versionInput}
              />
            </div>
            <input
              type="file"
              ref={principalInputRef}
              onChange={(e) =>
                handleFileUpload(true, e.target.files?.[0] || null)
              }
              style={{ display: "none" }}
              id="principal-upload"
            />
            <button
              className={styles.button}
              onClick={() => principalInputRef.current?.click()}
            >
              <FiUpload className={styles.icon} /> Selecionar Arquivo
            </button>
          </>
        )}
      </div>

      {/* Demo Section */}
      <div className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Demo</h2>
          {demoFile && (
            <button
              className={styles.removeButton}
              onClick={() => handleRemoveFile(false)}
            >
              <FiTrash2 /> Remover
            </button>
          )}
        </div>

        {demoFile ? (
          <div className={styles.fileInfo}>
            <p>
              {demoFile.name} | Tamanho: {demoFile.size} | Versão:{" "}
              {demoFile.version}
            </p>
            <div className={styles.versionInputContainer}>
              <label>Atualizar versão:</label>
              <input
                type="text"
                value={demoVersion}
                onChange={(e) => handleVersionChange(e, false)}
                className={styles.versionInput}
              />
            </div>
            <div className={styles.sentStatus}>
              <FiCheckCircle className={styles.checkIcon} />
              <span>Recebido</span>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.noFileOption}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={noDemo}
                  onChange={() => setNoDemo(!noDemo)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Não há versão demo</span>
              </label>
            </div>

            {!noDemo && (
              <>
                <div className={styles.fileInfo}>
                  <p>Nenhum arquivo selecionado</p>
                </div>
                <div className={styles.versionInputContainer}>
                  <label>Versão inicial:</label>
                  <input
                    type="text"
                    value={demoVersion}
                    onChange={(e) => setDemoVersion(e.target.value)}
                    className={styles.versionInput}
                  />
                </div>
                <input
                  type="file"
                  ref={demoInputRef}
                  onChange={(e) =>
                    handleFileUpload(false, e.target.files?.[0] || null)
                  }
                  style={{ display: "none" }}
                  id="demo-upload"
                />
                <button
                  className={styles.button}
                  onClick={() => demoInputRef.current?.click()}
                >
                  <FiUpload className={styles.icon} /> Selecionar Arquivo
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Valor Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Valor</h2>
        <div className={styles.inputGroup}>
          <div className={styles.currencyContainer}>
            <input
              type="text"
              className={styles.currencyInput}
              placeholder="R$ 0,00"
              value={isFree ? "R$ 0,00" : currencyValue}
              onChange={handleCurrencyChange}
              onFocus={(e) => {
                if (!e.target.value) {
                  setCurrencyValue("R$ ");
                }
              }}
              disabled={isFree}
            />
            {currencyValue && !isFree && (
              <button
                className={styles.clearButton}
                onClick={() => setCurrencyValue("")}
              >
                <FiX />
              </button>
            )}
          </div>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isFree}
              onChange={(e) => {
                setIsFree(e.target.checked);
                if (e.target.checked) setCurrencyValue("");
              }}
            />
            <span className={styles.checkboxText}>Gratuito</span>
          </label>
        </div>
      </div>
    </div>
  );
}
