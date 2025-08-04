import { COLLECTIONS } from "@/constants/FirebaseCollections";
import { db } from "@/lib/Firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  DocumentReference,
  Timestamp,
  FieldValue,
} from "firebase/firestore";

// Tipagem para os itens no carrinho (apenas IDs de produtos)
export type CartItem = string; // ID do documento do produto

// Tipagem para os itens comprados
export interface PurchasedItem {
  productRef: DocumentReference; // Referência ao documento do produto
}

// Tipagem para os dados da venda
export interface SaleData {
  userRefCompra: DocumentReference; // ID do usuário
  valorTotal: number;
  itemsComprados: PurchasedItem[];
  data: Timestamp | FieldValue; // Timestamp do servidor
}

// Função principal para processar venda
export async function processSale(
  userID: string,
  cartItems: CartItem[],
  total: number
) {
  try {
    const purchasedItems: PurchasedItem[] = [];
    const userRef = doc(db, COLLECTIONS.USERS, userID);

    // Processar cada item do carrinho (cada ID é um produto)
    for (const productId of cartItems) {
      // Criar referência ao documento do produto
      const productRef = doc(db, COLLECTIONS.JOGOS, productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error(`Produto não encontrado: ${productId}`);
      }

      purchasedItems.push({
        productRef,
      });
    }

    // Criar documento da venda
    const saleDoc: SaleData = {
      userRefCompra: userRef,
      valorTotal: total,
      itemsComprados: purchasedItems,
      data: serverTimestamp(),
    };

    // Salvar no Firestore
    const salesCollection = collection(db, COLLECTIONS.VENDAS);
    const docRef = await addDoc(salesCollection, saleDoc);

    return {
      success: true,
      saleId: docRef.id,
      valorTotal: total,
    };
  } catch (error) {
    console.error("Erro ao processar venda:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function getCompleteSale(saleId: string) {
  try {
    const saleRef = doc(db, COLLECTIONS.VENDAS, saleId);
    const saleSnap = await getDoc(saleRef);

    if (saleSnap.exists()) {
      const saleData = saleSnap.data();

      // Expandir informações dos produtos
      const products = await Promise.all(
        saleData.itemsComprados.map(async (item: PurchasedItem) => {
          const productSnap = await getDoc(item.productRef);
          return {
            id: item.productRef.id,
            ...productSnap.data(),
          };
        })
      );

      return {
        ...saleData,
        id: saleSnap.id,
        itemsComprados: products,
        data: saleData.data.toDate(), // Converter timestamp para Date
      };
    }
  } catch (error) {
    console.error("Erro ao buscar venda:", error);
    throw error; // Ou retornar um objeto de erro
  }
}
