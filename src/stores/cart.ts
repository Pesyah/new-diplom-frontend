import { defineStore } from 'pinia'

type CartItem = {
  product: string // ID продукта
  count: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  actions: {
    addToCart(productId: string, count = 1) {
      const existing = this.items.find((item) => item.product === productId)
      if (existing) {
        existing.count += count
      } else {
        this.items.push({ product: productId, count })
      }
    },

    removeFromCart(productId: string) {
      this.items = this.items.filter((item) => item.product !== productId)
    },

    clearCart() {
      this.items = []
    },
  },
})
