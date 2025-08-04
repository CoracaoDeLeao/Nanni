"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Carrinho.module.css";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiShoppingBag,
  FiShoppingCart,
  FiTrash2,
} from "react-icons/fi";
import { processSale } from "@/lib/service/PaymentService";
import { fetchJogos } from "@/lib/service/JogoService";
import { JogoProps } from "@/types/JogoProps";
import { useRouter } from "next/navigation";
import { CartService } from "@/lib/service/CarrinhoService";

type TransactionStatus = "idle" | "processing" | "success";

// Interface para o estado da venda
interface SaleDataState {
  saleId: string;
  total: number;
}

// Componente para exibir o status da transação
const TransactionStatus = ({ 
  status,
  saleData 
}: { 
  status: "processing" | "success";
  saleData?: SaleDataState | null;
}) => {
  const router = useRouter();

  if (status === "processing") {
    return (
      <div className={styles.processingContainer}>
        <div className={styles.spinner}></div>
        <h2>Estamos processando o seu pagamento</h2>
        <p>Por favor, aguarde enquanto finalizamos sua compra...</p>
      </div>
    );
  }

  return (
    <div className={styles.successContainer}>
      <FiCheckCircle className={styles.successIcon} />
      <h2>Compra realizada com sucesso!</h2>
      <div className={styles.transactionInfo}>
        <p>
          <strong>ID da transação:</strong> {saleData?.saleId || "N/A"}
        </p>
        <p>
          <strong>Valor total:</strong>
          {(saleData?.total ?? 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>
      <button
        className={styles.continueButton}
        onClick={() => router.push("/")}
      >
        <FiArrowLeft className={styles.arrowIcon} />
        Voltar às compras
      </button>
    </div>
  );
};

export default function Carrinho() {
  const router = useRouter();
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [saleData, setSaleData] = useState<SaleDataState | null>(null);
  const [cartGames, setCartGames] = useState<JogoProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);

  const userId = "T0EYcPo4RHUnUlHJ3SJcWgepzPJ2";

  // Carregar os itens do carrinho
  useEffect(() => {
    const loadCartData = async () => {
      setLoading(true);
      try {
        // Buscar IDs do carrinho usando o serviço
        const items = await CartService.getCartItems(userId);
        setCartItemIds(items);

        // Buscar detalhes dos jogos
        if (items.length > 0) {
          const games = await fetchJogos(items);
          setCartGames(games || []);
        } else {
          setCartGames([]);
        }
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        setError("Falha ao carregar carrinho");
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, [userId]);

  // Função para remover item do carrinho
  const handleRemoveItem = async (gameId: string) => {
    try {
      // Usar serviço para remover item
      await CartService.removeCartItem(userId, gameId);

      // Atualizar estado local
      setCartItemIds((prev) => prev.filter((id) => id !== gameId));
      setCartGames((prev) => prev.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("Erro ao remover item:", error);
      setError("Falha ao remover item do carrinho");
    }
  };

  // Calcula o total do carrinho
  const total = cartGames.reduce((sum, game) => {
    if (game.preco === "Gratis") return sum;
    return sum + parseFloat(game.preco);
  }, 0);

  // Função para finalizar a compra
  const handleCheckout = async () => {
    setTransactionStatus("processing");
    setError(null);

    try {
      // Adicionar pequeno delay para melhor experiência do usuário
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Processar pagamento com os IDs dos produtos
      const result = await processSale(userId, cartItemIds, total);

      if (result.success) {
        setSaleData({
          saleId: result.saleId!,
          total: result.valorTotal!,
        });
        await CartService.clearCart(userId);
        setCartItemIds([]);
        setCartGames([]);
        setTransactionStatus("success");
      } else {
        throw new Error(result.error || "Erro desconhecido no pagamento");
      }
    } catch (err: unknown) {
      setTransactionStatus("idle");
      let errorMessage = "Erro ao processar pagamento";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meu Carrinho</h1>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando seu carrinho...</p>
        </div>
      ) : transactionStatus === "processing" || transactionStatus === "success" ? (
        <TransactionStatus 
          status={transactionStatus} 
          saleData={saleData} 
        />
      ) : (
        <div className={styles.content}>
          {/* Container do carrinho */}
          <div className={styles.cartContainer}>
            <div className={styles.cartHeader}>
              <FiShoppingCart className={styles.cartIcon} />
              <span>Carrinho ({cartGames.length})</span>
            </div>

            <div className={styles.itemsContainer}>
              {cartGames.length > 0 ? (
                cartGames.map((game) => (
                  <div key={game.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <Image
                        src={game.icone}
                        alt={game.nome}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={styles.productImage}
                      />
                    </div>

                    <div className={styles.itemDetails}>
                      <h3 className={styles.productName}>{game.nome}</h3>
                      <p className={styles.productPrice}>
                        {game.preco === "Gratis"
                          ? "Grátis"
                          : parseFloat(game.preco).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                      </p>

                      <button
                        className={styles.removeButton}
                        onClick={() => handleRemoveItem(game.id)}
                      >
                        <FiTrash2 /> Remover
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyCart}>
                  <FiShoppingBag className={styles.emptyCartIcon} />
                  <p>Seu carrinho está vazio</p>
                  <button
                    className={styles.continueButton}
                    onClick={() => router.push("/")}
                  >
                    <FiShoppingBag className={styles.arrowIcon} />
                    Ir para a loja
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Resumo do pedido */}
          {cartGames.length > 0 && (
            <div className={styles.summaryContainer}>
              <h2 className={styles.summaryTitle}>Resumo do Pedido</h2>

              <div className={styles.summaryItems}>
                {cartGames.map((game) => (
                  <div
                    key={`summary-${game.id}`}
                    className={styles.summaryItem}
                  >
                    <span>{game.nome}</span>
                    <span>
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
                <span>Total:</span>
                <span>
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <button
                className={styles.checkoutButton}
                onClick={handleCheckout}
                disabled={transactionStatus !== "idle" || cartGames.length === 0}
              >
                {(transactionStatus as string) === "processing" ? (
                  <>
                    <div className={styles.buttonSpinner}></div>
                    Processando...
                  </>
                ) : (
                  "Finalizar Compra"
                )}
              </button>

              <button
                className={styles.continueButton}
                onClick={() => router.push("/")}
              >
                <FiArrowLeft className={styles.arrowIcon} />
                Continuar comprando
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}