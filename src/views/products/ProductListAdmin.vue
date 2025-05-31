<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

interface Category {
  id: number
  name: string
}

interface Product {
  id: string
  name: string
  description: string
  price: string
  deleted_at: string | null
  category: Category
}

const products = ref<Product[]>([])
const auth = useAuthStore()

const fetchProducts = async () => {
  try {
    const res = await api.get('/products/all-admin', {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
      },
    })
    products.value = res.data
    console.log(products)
  } catch (error) {
    console.error('Ошибка при загрузке продуктов:', error)
  }
}

const toggleVisibility = async (product: Product) => {
  const route = product.deleted_at
    ? `/products/restore/${product.id}`
    : `/products/hide/${product.id}`

  try {
    await api.patch(route, {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
      },
    })
    product.deleted_at = product.deleted_at ? null : new Date().toISOString()
  } catch (error) {
    console.error('Ошибка при обновлении видимости:', error)
  }
}

onMounted(fetchProducts)
</script>

<template>
  <div class="container py-4">
    <h1 class="mb-4">Админский список продуктов</h1>

    <div v-for="product in products" :key="product.id" class="card mb-3">
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 class="card-title mb-1">{{ product.name }}</h5>
          <p class="card-text mb-1">{{ product.description }}</p>
          <p class="mb-1">Цена: {{ product.price }}₽</p>
          <p class="mb-1">Категория: {{ product.category.name }}</p>
          <span v-if="product.deleted_at" class="badge bg-danger">Скрыт</span>
        </div>

        <button
          class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
          @click="toggleVisibility(product)"
        >
          <i v-if="product.deleted_at" class="bi bi-eye-fill"></i>
          <i v-else class="bi bi-eye-slash-fill"></i>
          {{ product.deleted_at ? 'Показать' : 'Скрыть' }}
        </button>
      </div>
    </div>
  </div>
</template>
