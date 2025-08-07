import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { COLLECTIONS } from "@/constants/FirebaseCollections";

export const CartService = {
  // Buscar itens do carrinho
  async getCartItems(userId: string): Promise<string[]> {
    try {
      const cartRef = doc(db, COLLECTIONS.USERS, userId);
      const cartSnapshot = await getDoc(cartRef);
      
      if (cartSnapshot.exists()) {
        const cartData = cartSnapshot.data();
        return cartData.cartTempRef || [];
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar itens do carrinho:", error);
      throw new Error("Falha ao carregar carrinho");
    }
  },

  // Atualizar todos os itens do carrinho
  async updateCartItems(userId: string, cartTempRef: string[]): Promise<void> {
    try {
      const cartRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(cartRef, { cartTempRef });
    } catch (error) {
      console.error("Erro ao atualizar carrinho:", error);
      throw new Error("Falha ao atualizar carrinho");
    }
  },

  // Remover um item específico do carrinho
  async removeCartItem(userId: string, gameId: string): Promise<void> {
    try {
      const cartRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(cartRef, {
        cartTempRef: arrayRemove(gameId)
      });
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
      throw new Error("Falha ao remover item");
    }
  },

  // Adicionar um item ao carrinho
  async addCartItem(userId: string, gameId: string): Promise<void> {
    try {
      const cartRef = doc(db, COLLECTIONS.USERS, userId);
      const currentItems = await this.getCartItems(userId);
      
      // Evitar duplicatas
      if (!currentItems.includes(gameId)) {
        await updateDoc(cartRef, {
          cartTempRef: [...currentItems, gameId]
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      throw new Error("Falha ao adicionar item");
    }
  },

  // Limpar todo o carrinho
  async clearCart(userId: string): Promise<void> {
    try {
      const cartRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(cartRef, { cartTempRef: [] });
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
      throw new Error("Falha ao limpar carrinho");
    }
  }
};