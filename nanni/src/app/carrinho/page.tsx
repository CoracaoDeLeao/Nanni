import Image from "next/image";
import styles from "./Carrinho.module.css";
import { FiArrowLeft, FiShoppingCart, FiTrash2 } from "react-icons/fi";

export default function Carrinho() {
  // Dados mockados do carrinho
  const cartItems = [
    {
      id: 1,
      name: "Camiseta Premium",
      price: 79.9,
      image: "/classind/CI_18.png",
    },
    {
      id: 2,
      name: "Calça Jeans",
      price: 129.9,
      image: "/classind/CI_18.png",
    },
  ];

  const total = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meu Carrinho</h1>

      <div className={styles.content}>
        {/* Container branco com header */}
        <div className={styles.cartContainer}>
          <div className={styles.cartHeader}>
            <FiShoppingCart className={styles.cartIcon} />
            <span>Carrinho</span>
          </div>

          <div className={styles.itemsContainer}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.productImage}
                  />
                </div>

                <div className={styles.itemDetails}>
                  <h3 className={styles.productName}>{item.name}</h3>
                  <p className={styles.productPrice}>
                    R$ {item.price.toFixed(2)}
                  </p>

                  <button className={styles.removeButton}><FiTrash2 />Remover</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.summaryContainer}>
          <h2 className={styles.summaryTitle}>Resumo do Pedido</h2>

          <div className={styles.summaryItems}>
            {cartItems.map((item) => (
              <div key={`summary-${item.id}`} className={styles.summaryItem}>
                <span>{item.name}</span>
                <span>R$ {item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className={styles.summaryTotal}>
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>

          <button className={styles.checkoutButton}>Finalizar Compra</button>
          <button className={styles.continueButton}>
            <FiArrowLeft className={styles.arrowIcon} />
            Continuar comprando
          </button>
        </div>
      </div>
    </div>
  );
}
