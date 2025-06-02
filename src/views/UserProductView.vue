<template>
  <div class="container py-4 text-white">
    <button class="btn btn-outline-secondary mb-3 text-white" @click="$router.back()">
      <i class="bi bi-arrow-left"></i> Назад
    </button>

    <div v-if="product" class="card bg-dark border-secondary">
      <div class="card-body">
        <h2 class="card-title text-white mb-3">{{ product.name }}</h2>
        <h5 class="mb-3 text-white">Категория: {{ product.category.name }}</h5>
        <p class="card-text text-white" :title="product.description">
          {{ product.description }}
        </p>
        <h4 class="text-success mt-4">{{ product.price }} ₽</h4>

        <button class="btn btn-success mt-3 text-white" @click="addToCart(product)">
          <i class="bi bi-cart-plus"></i> Добавить в корзину
        </button>

        <div v-if="getCountInCart(product.id) > 0" class="mt-2 text-info">
          В корзине: {{ getCountInCart(product.id) }}
        </div>
      </div>
    </div>

    <div v-else class="text-center mt-5">
      <p>Загрузка продукта...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { useCartStore } from '@/stores/cart'

interface Category {
  id: number
  name: string
}

interface Product {
  id: string
  name: string
  description: string
  price: string
  category: Category
}

const route = useRoute()
const product = ref<Product | null>(null)

const fetchProduct = async () => {
  try {
    const { id } = route.params
    const { data } = await api.get(`/products/${id}`)
    product.value = data
  } catch (error) {
    console.error('Ошибка при загрузке продукта:', error)
  }
}

onMounted(fetchProduct)

// --- Добавление в корзину ---
const cartStore = useCartStore()

const addToCart = (product: Product) => {
  cartStore.addToCart(product.id)
}

const getCountInCart = (productId: string) => {
  const item = cartStore.items.find((item) => item.product === productId)
  return item ? item.count : 0
}
</script>
