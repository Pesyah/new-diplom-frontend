<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import router from '@/router/router'

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
const authStore = useAuthStore()

const deleteProduct = async (product: Product) => {
  if (!confirm(`Удалить продукт "${product.name}"? Это действие нельзя отменить.`)) return

  try {
    await api.delete(`/products/${product.id}`)
    // Удаляем продукт из списка локально
    products.value = products.value.filter((p) => p.id !== product.id)
  } catch (error) {
    console.error('Ошибка при удалении продукта:', error)
    alert('Не удалось удалить продукт')
  }
}

const fetchProducts = async () => {
  try {
    const res = await api.get('/products/all-admin')
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
    await api.patch(route)
    product.deleted_at = product.deleted_at ? null : new Date().toISOString()
  } catch (error) {
    console.error('Ошибка при обновлении видимости:', error)
  }
}
const isAdmin = computed(() => authStore.user?.role === 2)

onMounted(fetchProducts)
</script>

<template>
  <div class="container py-4" v-if="isAdmin">
    <h1 class="mb-4">Админский список продуктов</h1>

    <button
      class="btn btn-success mt-2 text-white mb-2"
      @click="router.push('products-admin/create')"
    >
      Создать новый продукт
    </button>

    <div v-for="product in products" :key="product.id" class="card mb-3">
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 class="card-title mb-1">{{ product.name }}</h5>
          <p class="card-text mb-1">
            {{
              product.description.length > 150
                ? product.description.slice(0, 150) + '...'
                : product.description
            }}
          </p>
          <p class="mb-1">Цена: {{ product.price }}₽</p>
          <p class="mb-1">Категория: {{ product.category.name }}</p>
          <span v-if="product.deleted_at" class="badge bg-danger">Скрыт</span>
        </div>

        <div>
          <div class="d-flex gap-2 mb-2">
            <button
              class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
              @click="toggleVisibility(product)"
            >
              <i v-if="product.deleted_at" class="bi bi-eye-fill"></i>
              <i v-else class="bi bi-eye-slash-fill"></i>
              {{ product.deleted_at ? 'Показать' : 'Скрыть' }}
            </button>

            <button
              class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              @click="deleteProduct(product)"
            >
              <i class="bi bi-trash3-fill"></i>
              Удалить
            </button>
          </div>

          <div>
            <button
              class="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
              @click="router.push(`products-admin/edit/${product.id}`)"
            >
              <i class="bi bi-pencil-square"></i>
              Редактировать
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
