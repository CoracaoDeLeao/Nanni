// Frame4.tsx
import { useRef, useState, ChangeEvent, useEffect } from "react";
import { FiCheckCircle, FiUpload, FiTrash2, FiX } from "react-icons/fi";
import { FileInfo } from "@/types/Publicar";
import { useFormContext } from "react-hook-form";
import styles from "./Frame4.module.css";

export default function Frame4() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const principalInputRef = useRef<HTMLInputElement>(null);
  const demoInputRef = useRef<HTMLInputElement>(null);

  // Obter valores do formulário
  const principalFile = watch("principalFile");
  const demoFile = watch("demoFile");
  const currencyValue = watch("currencyValue");
  const isFree = watch("isFree");
  const noDemo = watch("noDemo");

  // Estados locais para versões
  const [principalVersion, setPrincipalVersion] = useState("1.0.0");
  const [demoVersion, setDemoVersion] = useState("1.0.0");
  const [displayCurrencyValue, setDisplayCurrencyValue] = useState(""); // Valor formatado para exibição

  useEffect(() => {
    if (!principalFile) setPrincipalVersion("1.0.0");
    if (!demoFile) {
      setDemoVersion("1.0.0");
      setValue("noDemo", false);
    }
  }, [principalFile, demoFile, setValue]);

  // Atualiza o valor de exibição quando o valor bruto muda
  useEffect(() => {
    if (currencyValue !== null && currencyValue !== undefined) {
      setDisplayCurrencyValue(formatCurrency(currencyValue));
    } else {
      setDisplayCurrencyValue("");
    }
  }, [currencyValue]);

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCurrencyInput = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const cents = parseInt(rawValue, 10) || 0;
    
    // Salva o valor bruto (em centavos)
    const realValue = cents / 100;
    setValue("currencyValue", realValue, { shouldValidate: true });
  };

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

    const field = isPrincipal ? "principalFile" : "demoFile";
    setValue(field, fileInfo, { shouldValidate: true });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleRemoveFile = (isPrincipal: boolean) => {
    const field = isPrincipal ? "principalFile" : "demoFile";
    setValue(field, null, { shouldValidate: true });

    if (isPrincipal && principalInputRef.current) {
      principalInputRef.current.value = "";
    } else if (demoInputRef.current) {
      demoInputRef.current.value = "";
    }
  };

  const handleVersionChange = (
    e: ChangeEvent<HTMLInputElement>,
    isPrincipal: boolean,
  ) => {
    const newVersion = e.target.value;
    const field = isPrincipal ? "principalFile" : "demoFile";

    if (isPrincipal) {
      setPrincipalVersion(newVersion);
      if (principalFile) {
        setValue(
          field,
          { ...principalFile, version: newVersion },
          { shouldValidate: true },
        );
      }
    } else {
      setDemoVersion(newVersion);
      if (demoFile) {
        setValue(
          field,
          { ...demoFile, version: newVersion },
          { shouldValidate: true },
        );
      }
    }
  };

  const handleClearCurrency = () => {
    setValue("currencyValue", 0, { shouldValidate: true });
    setDisplayCurrencyValue("");
  };

  const handleFreeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setValue("isFree", isChecked, { shouldValidate: true });

    if (isChecked) {
      setValue("currencyValue", 0, { shouldValidate: true });
    }
  };

  const handleNoDemoCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setValue("noDemo", isChecked, { shouldValidate: true });

    if (isChecked) {
      setValue("demoFile", null, { shouldValidate: true });
      if (demoInputRef.current) demoInputRef.current.value = "";
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
        {errors.principalFile?.message && (
          <p className={styles.error}>{String(errors.principalFile.message)}</p>
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
              {demoFile.name} | Tamanho: {demoFile.formattedSize} | Versão:{" "}
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
                  {...register("noDemo")}
                  onChange={handleNoDemoCheckbox}
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
        {errors.demoFile?.message && (
          <p className={styles.error}>{String(errors.demoFile.message)}</p>
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
              value={isFree ? "R$ 0,00" : displayCurrencyValue}
              onChange={handleCurrencyInput}
              disabled={isFree}
            />
            {displayCurrencyValue && !isFree && (
              <button
                className={styles.clearButton}
                onClick={handleClearCurrency}
              >
                <FiX />
              </button>
            )}
          </div>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              {...register("isFree")}
              onChange={handleFreeCheckbox}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Gratuito</span>
          </label>
        </div>
        {errors.currencyValue?.message && (
          <p className={styles.error}>{String(errors.currencyValue.message)}</p>
        )}
      </div>
    </div>
  );
}