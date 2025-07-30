import AgeSelector from "@/components/seletorIdade/AgeSelector";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Frame1.module.css";
import { FiPlus, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { LuPen } from "react-icons/lu";
import Dropdown from "@/components/dropdown/dropdown";
import { GalleryImage } from "@/types/Publicar";

interface Frame1Props {
  gameName: string;
  setGameName: (name: string) => void;
  bannerImage: { url: string; file: File } | null;
  setBannerImage: React.Dispatch<
    React.SetStateAction<{ url: string; file: File } | null>
  >;
  iconImage: { url: string; file: File } | null;
  setIconImage: React.Dispatch<
    React.SetStateAction<{ url: string; file: File } | null>
  >;
  images: GalleryImage[];
  setImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
  onDevStatusSelected: (status: string) => void;
  onAgeRatingSelected: (rating: string) => void;
}

const statusDev = ["PRE-ALPHA", "ALPHA", "BETA", "REALEASE"];

export default function Frame1({
  gameName,
  setGameName,
  bannerImage,
  setBannerImage,
  iconImage,
  setIconImage,
  images,
  setImages,
  onDevStatusSelected,
  onAgeRatingSelected,
}: Frame1Props) {
  // Estados para os valores selecionados
  const [devStatus, setDevStatus] = useState(statusDev[0]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    setImage: (image: { url: string; file: File }) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImage({ url: objectUrl, file });
    }
  };

  const handleImageUploadGallery = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const newImages: GalleryImage[] = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleEditImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || editIndex === null) return;

    const file = e.target.files[0];
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[editIndex].url);
      newImages[editIndex] = {
        file,
        url: URL.createObjectURL(file),
      };
      return newImages;
    });
    setEditIndex(null);
    e.target.value = "";
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
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      if (bannerImage) URL.revokeObjectURL(bannerImage.url);
      if (iconImage) URL.revokeObjectURL(iconImage.url);
      images.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [bannerImage, iconImage, images]);

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
          name="gameName"
          required
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Digite o nome do jogo"
          className={styles.inputField}
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Classificação Indicativa</label>
        <AgeSelector
          onChange={onAgeRatingSelected}
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Status de Desenvolvimento</label>
        <Dropdown
          opcoes={statusDev}
          styles={styles}
          onChange={(opcao) => {
            setDevStatus(opcao);
            onDevStatusSelected(opcao);
          }}
          value={devStatus}
        />
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
                onChange={(e) => handleImageUpload(e, setBannerImage)}
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
                onChange={(e) => handleImageUpload(e, setIconImage)}
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
