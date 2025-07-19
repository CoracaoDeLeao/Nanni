"use client";

import ImageUploader from "@/components/ImageUploader";
import { useState } from "react";
// import ModalAviso from "@/components/modals/ModalAviso/ModalAviso";
import ModalReporte from "@/components/modals/ModalReporte/ModalReporte";

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);

  // const handleSubmitAviso = () => {
  //   setModalOpen(false);
  // };

  // const customMessage =
  //   "Você está prestes a realizar uma ação importante. Todos os dados serão processados e não poderão ser revertidos. Confirma a operação?";

  return (
    <div>
      <main>
        <h1>Upload de Imagem</h1>
        <ImageUploader />

        <button onClick={() => setModalOpen(true)}>Abrir Modal</button>

        {/* <ModalAviso
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleSubmitAviso}
          message={customMessage}
        /> */}

        <ModalReporte
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          userID=""
          jogoID=""
        />
      </main>
    </div>
  );
}
