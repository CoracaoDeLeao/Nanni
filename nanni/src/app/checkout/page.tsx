"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { processSale } from "@/lib/service/PaymentService";
import { CartService } from "@/lib/service/CarrinhoService";
import { fetchJogos } from "@/lib/service/JogoService";
import { JogoProps } from "@/types/JogoProps";
import styles from "./Checkout.module.css";
import {
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
  FiArrowLeft,
  FiShoppingBag,
  FiCheckCircle,
  FiLock,
} from "react-icons/fi";
import { CiBarcode } from "react-icons/ci";

const paymentMethods = [
  {
    id: "credit",
    name: "Cartão de crédito",
    icon: <FiCreditCard />,
    description:
      "Pague com seu cartão de crédito em até 12x. Aceitamos Visa, Mastercard, American Express e outros.",
  },
  {
    id: "pix",
    name: "PIX",
    icon: <FiDollarSign />,
    description:
      "Pagamento instantâneo via PIX. Aprovação imediata. Você pode pagar usando QR Code ou chave PIX.",
    badge: "Pagamento instantâneo",
  },
  {
    id: "boleto",
    name: "Boleto",
    icon: <CiBarcode />,
    description:
      "Gere um boleto bancário e pague em qualquer agência bancária, casa lotérica ou internet banking.",
  },
  {
    id: "debit",
    name: "Cartão de débito",
    icon: <FiSmartphone />,
    description:
      "Pague diretamente da sua conta corrente usando cartão de débito. Disponível para todos os bancos.",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("");
  const [cartGames, setCartGames] = useState<JogoProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saleId, setSaleId] = useState<string | null>(null);
  const [saleTotal, setSaleTotal] = useState<number>(0);

  const userId = "T0EYcPo4RHUnUlHJ3SJcWgepzPJ2";

  // Calcular total
  const total = cartGames.reduce((sum, game) => {
    return game.preco === "Gratis" ? sum : sum + parseFloat(game.preco);
  }, 0);

  // Carregar itens do carrinho
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartItems = await CartService.getCartItems(userId);
        const games = await fetchJogos(cartItems);
        setCartGames(games || []);
      } catch (err) {
        console.error("Failed to load cart:", err);
        setError("Falha ao carregar carrinho");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [userId]);

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError("Selecione um método de pagamento");
      return;
    }

    setProcessing(true);
    setError(null);
    setSaleTotal(total);

    try {
      const cartItems = await CartService.getCartItems(userId);
      const result = await processSale(
        userId,
        cartItems,
        total,
        selectedMethod
      );

      if (result.success) {
        setSaleId(result.saleId ?? null);
        await CartService.clearCart(userId);
        setSuccess(true);
      } else {
        throw new Error(result.error || "Erro no processamento");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToStore = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.backButton} onClick={() => router.back()}>
            <FiArrowLeft className={styles.arrowIcon} />
            Voltar
          </button>
          <h1 className={styles.title}>
            <FiCreditCard className={styles.titleIcon} />
            {success ? "Compra Finalizada" : "Método de pagamento"}
          </h1>
          <div className={styles.headerSpacer}></div>
        </div>
        <div className={styles.headerDivider}></div>
      </div>

      {/* Overlay de processamento */}
      {processing && (
        <div className={styles.processingOverlay}>
          <div className={styles.processingContent}>
            <div className={styles.spinnerWithLock}>
              <div className={styles.processingSpinner}></div>
              <FiLock className={styles.lockIcon} />
            </div>
            <h3>Processando seu pagamento...</h3>
            <p>Por favor, aguarde enquanto processamos sua compra</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando métodos...</p>
        </div>
      ) : success ? (
        // Card de sucesso
        <div className={styles.successContainer}>
          <div className={styles.successCard}>
            <FiCheckCircle className={styles.successIcon} />
            <h2>Compra realizada com sucesso!</h2>
            <p className={styles.successMessage}>
              Obrigado por sua compra. Seus jogos já estão disponíveis em sua
              biblioteca.
            </p>

            <div className={styles.successDetails}>
              <div className={styles.detailItem}>
                <span>Número do pedido:</span>
                <span className={styles.detailValue}>{saleId}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Total pago:</span>
                <span className={styles.detailValue}>
                  {saleTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span>Método de pagamento:</span>
                <span className={styles.detailValue}>
                  {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                </span>
              </div>
            </div>

            <div className={styles.successButtons}>
              <button
                className={styles.successButtonSecondary}
                onClick={handleBackToStore}
              >
                Continuar comprando
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Conteúdo normal do checkout
        <div className={styles.content}>
          <div className={styles.paymentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FiCreditCard className={styles.sectionIcon} />
                Selecione um método de pagamento
              </h2>
              <p className={styles.sectionSubtitle}>
                Escolha como deseja pagar sua compra
              </p>
            </div>

            <div className={styles.methodsGrid}>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`${styles.methodCard} ${selectedMethod === method.id ? styles.selected : ""}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className={styles.methodHeader}>
                    <div className={styles.methodIcon}>{method.icon}</div>
                    <h3 className={styles.methodName}>{method.name}</h3>
                  </div>

                  <p className={styles.methodDescription}>
                    {method.description}
                  </p>

                  {method.badge && (
                    <div className={styles.methodBadge}>{method.badge}</div>
                  )}
                </div>
              ))}
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>

          {/* Resumo da compra */}
          <div className={styles.summaryContainer}>
            <div className={styles.summaryHeader}>
              <h2 className={styles.summaryTitle}>
                <FiShoppingBag className={styles.summaryIcon} />
                Resumo da Compra
              </h2>
              <div className={styles.summarySubtitle}>
                {cartGames.length} itens no carrinho
              </div>
            </div>

            <div className={styles.summaryItems}>
              {cartGames.map((game, index) => (
                <div
                  key={`summary-${game.id}-${index}`}
                  className={styles.summaryItem}
                >
                  <span className={styles.itemName}>{game.nome}</span>
                  <span className={styles.itemPrice}>
                    {game.preco === "Gratis"
                      ? "Grátis"
                      : parseFloat(game.preco).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotal}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>
                {total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <button
              className={styles.confirmButton}
              onClick={handlePayment}
              disabled={processing || !selectedMethod}
            >
              {processing ? (
                <>
                  <div className={styles.buttonSpinner}></div>
                  Processando pagamento...
                </>
              ) : (
                `Confirmar com ${selectedMethod ? paymentMethods.find((m) => m.id === selectedMethod)?.name : "pagamento"}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
