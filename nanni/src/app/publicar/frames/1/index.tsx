import AgeSelector from "@/components/seletorIdade/AgeSelector";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Frame1.module.css";
import { FiPlus, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { LuPen } from "react-icons/lu";
import Dropdown from "@/components/dropdown/dropdown";
import { useFormContext } from "react-hook-form";
import { GalleryImage } from "@/types/Publicar";

const statusDev = ["PRE-ALPHA", "ALPHA", "BETA", "REALEASE"];

export default function Frame1() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [devStatusLocal, setDevStatusLocal] = useState(statusDev[0]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const bannerImage = watch("bannerImage") as {
    url: string;
    file: File;
  } | null;
  const iconImage = watch("iconImage") as { url: string; file: File } | null;
  const rawImages = watch("images") as GalleryImage[] | undefined;
  const images = useMemo(() => rawImages || [], [rawImages]);
  const ageRating = watch("ageRating") as string;

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ageRating === "") {
      setValue("ageRating", "14", { shouldValidate: true });
    }
  }, [ageRating, setValue]);

  const handleGameNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("nomeJogo", e.target.value, { shouldValidate: true });
  };

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: "bannerImage" | "iconImage"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setValue(fieldName, { url: objectUrl, file }, { shouldValidate: true });
    }
  };

  const handleImageUploadGallery = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const newImages = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setValue("images", [...images, ...newImages], { shouldValidate: true });
    }
  };

  const handleEditImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || editIndex === null) return;

    const file = e.target.files[0];
    const newImages = [...images];
    URL.revokeObjectURL(newImages[editIndex].url);
    newImages[editIndex] = {
      file,
      url: URL.createObjectURL(file),
    };
    setValue("images", newImages, { shouldValidate: true });
    setEditIndex(null);
    if (editInputRef.current) editInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerEditInput = (index: number) => {
    setEditIndex(index);
    editInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(images[index].url);
    const newImages = images.filter((_, i) => i !== index);
    setValue("images", newImages, { shouldValidate: true });
  };

  // Efeito para limpeza de URLs
  useEffect(() => {
    const currentImages = [...images];

    return () => {
      if (bannerImage) URL.revokeObjectURL(bannerImage.url);
      if (iconImage) URL.revokeObjectURL(iconImage.url);
      currentImages.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [bannerImage, iconImage, images]);

  useEffect(() => {
    setValue("devStatus", devStatusLocal, { shouldValidate: true });
  }, [devStatusLocal, setValue]);

  return (
    <div className={styles.formContainer}>
      <div className={styles.formContainerHeader}>
        <h1>PUBLICAR JOGO</h1>
      </div>

      <div className={styles.section}>
        <label htmlFor="gameName" className={styles.label}>
          Nome do Jogo
        </label>
        <input
          type="text"
          id="gameName"
          {...register("nomeJogo")}
          className={`${styles.inputField} ${errors.nomeJogo ? styles.errorInput : ""}`}
          placeholder="Digite o nome do jogo"
          onChange={handleGameNameChange}
        />
        {errors.nomeJogo && (
          <p className={styles.errorMessage}>
            {String(errors.nomeJogo.message)}
          </p>
        )}
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Classificação Indicativa</label>
        <AgeSelector
          onChange={(rating) =>
            setValue("ageRating", rating, { shouldValidate: true })
          }
          value={ageRating}
        />
        {errors.ageRating && (
          <p className={styles.errorMessage}>
            {String(errors.ageRating.message)}
          </p>
        )}
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Status de Desenvolvimento</label>
        <Dropdown
          opcoes={statusDev}
          styles={styles}
          onChange={(opcao) => setDevStatusLocal(opcao)}
          value={devStatusLocal}
        />
        {errors.devStatus && (
          <p className={styles.errorMessage}>
            {String(errors.devStatus.message)}
          </p>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ícone e Banner</h3>
        <div className={styles.iconAndBanner}>
          <div className={styles.imageUploadGroup}>
            <div
              className={`${styles.btnBanner} ${bannerImage ? styles.hasImage : ""}`}
              onClick={() => bannerInputRef.current?.click()}
            >
              <input
                type="file"
                accept="image/*"
                ref={bannerInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleImageUpload(e, "bannerImage")}
              />
              {bannerImage ? (
                <div className={styles.imageWrapper}>
                  <Image
                    src={bannerImage.url}
                    alt="Banner selecionado"
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <FiPlusCircle className={styles.plusIcon} />
                  <span>Adicionar Banner</span>
                </div>
              )}
            </div>
            {errors.bannerImage && (
              <p className={styles.errorMessage}>
                {String(errors.bannerImage.message)}
              </p>
            )}
          </div>

          <div className={styles.imageUploadGroup}>
            <div
              className={`${styles.btnIcon} ${iconImage ? styles.hasImage : ""}`}
              onClick={() => iconInputRef.current?.click()}
            >
              <input
                type="file"
                accept="image/*"
                ref={iconInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleImageUpload(e, "iconImage")}
              />
              {iconImage ? (
                <div className={styles.imageWrapper}>
                  <Image
                    src={iconImage.url}
                    alt="Ícone selecionado"
                    fill
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                    unoptimized
                  />
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <FiPlusCircle className={styles.plusIcon} />
                  <span>Adicionar Ícone</span>
                </div>
              )}
            </div>
            {errors.iconImage && (
              <p className={styles.errorMessage}>
                {String(errors.iconImage.message)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.galleryHeader}>
          <h3 className={styles.sectionTitle}>Galeria</h3>
          <button
            onClick={triggerFileInput}
            className={styles.addGalleryButton}
          >
            <FiPlus /> Adicionar Imagens
          </button>
        </div>

        <div className={styles.galleryParent}>
          <div className={styles.galeryContainer}>
            {images.length === 0 ? (
              <div className={styles.emptyGallery}>
                <FiPlusCircle size={32} />
                <p>Nenhuma imagem adicionada</p>
                <p className={styles.emptyGalleryHint}>
                  Use o botão acima para adicionar
                </p>
              </div>
            ) : (
              images.map((image, index) => (
                <div
                  key={index}
                  className={styles.imageWrapper}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Image
                    src={image.url}
                    alt={`Imagem ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />

                  {hoveredIndex === index && (
                    <div className={styles.imageOverlay}>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleRemoveImage(index)}
                        aria-label="Remover imagem"
                      >
                        <FiTrash2 size={14} />
                      </button>
                      <button
                        className={styles.editButton}
                        onClick={() => triggerEditInput(index)}
                        aria-label="Alterar imagem"
                      >
                        <LuPen size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          {errors.images && (
            <p className={styles.errorMessage}>
              {String(errors.images.message)}
            </p>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUploadGallery}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={editInputRef}
        onChange={handleEditImage}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
}
