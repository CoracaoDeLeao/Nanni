"use client";

import { useState } from "react";
import Auth from "@/components/Auth";
import { getReportesByJogoID } from "@/lib/service/ReporteService"; // ajuste o caminho se necessário
import { getCompleteSale, processSale } from "@/lib/service/PaymentService";
import Sidebar from "@/components/sidebarLib";

export default function LoginPage() {
  const [jogoId, setJogoId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    if (!jogoId.trim()) {
      console.warn("⚠️ Informe um ID de jogo válido.");
      return;
    }

    setLoading(true);
    const response = await getReportesByJogoID(jogoId);

    if (response.success) {
      // console.log("📦 Reportes encontrados:", response.reportes);
    } else {
      console.error("❌ Erro ao buscar reportes:", response.error);
    }

    setLoading(false);
  };

  const handlePayment = async () => {
    setLoading(true);

    // Processar uma venda
    const result = await processSale("", [""]);

    if (result.success) {
      // console.log("Venda realizada com sucesso!", result.saleId);

      // Obter detalhes completos da venda
      // const completeSale = await getCompleteSale(result.saleId as string);
      // console.log("Detalhes da venda:", completeSale);
    } else {
      console.error("Falha na venda:", result.error);
    }

    setLoading(false);
  };

  return (
    <div>
      <main>
        <div>
          <h1>Login</h1>
          <Auth />
        </div>

        <hr />

        <div>
          <h1>ID do jogo</h1>
          <input
            type="text"
            value={jogoId}
            onChange={(e) => setJogoId(e.target.value)}
            placeholder="Digite o ID do jogo"
          />

          <button onClick={handleBuscar} disabled={loading}>
            {loading ? "Buscando..." : "Buscar reportes"}
          </button>
        </div>

        <hr />

        <div>
          <h1>Finalizar Compra</h1>
          <button onClick={handlePayment} disabled={loading}>
            {loading ? "Processando..." : "Pagar Agora"}
          </button>
        </div>

        <hr />

        <Sidebar/>
      </main>
    </div>
  );
}
