import { defineStore } from 'pinia'

type CartItem = {
  product: string // ID продукта
  count: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items') || '[]') as CartItem[],
  }),

  actions: {
    saveToLocalStorage() {
      localStorage.setItem('cart_items', JSON.stringify(this.items))
    },

    addToCart(productId: string, count = 1) {
      const existing = this.items.find((item) => item.product === productId)
      if (existing) {
        existing.count += count
      } else {
        this.items.push({ product: productId, count })
      }
      this.saveToLocalStorage()
    },

    removeFromCart(productId: string) {
      this.items = this.items.filter((item) => item.product !== productId)
      this.saveToLocalStorage()
    },

    changeCount(productId: string, count: number) {
      this.items = this.items.map((item) =>
        item.product === productId ? { product: item.product, count } : item,
      )
      this.saveToLocalStorage()
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },
  },
})
