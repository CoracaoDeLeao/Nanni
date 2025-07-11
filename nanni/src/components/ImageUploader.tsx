"use client";

import { useState } from "react";
import Image from "next/image";

const ImageUploader = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Para ver o erro de verdade
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (data.link) {
        setImageUrl(data.link);
      } else {
        alert("Erro ao obter link da imagem.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploading && <p>Enviando imagem...</p>}
      {imageUrl && (
        <div>
          <p>Imagem enviada:</p>
          <Image src={imageUrl} alt="Upload" width={200} height={400} />
          <p>
            Link:{" "}
            <a href={imageUrl} target="_blank" rel="noreferrer">
              {imageUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
