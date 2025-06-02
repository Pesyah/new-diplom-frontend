<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

interface Category {
  id: number
  name: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: number
}

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const product = ref<Product>({
  id: '',
  name: '',
  description: '',
  price: 0,
  category: 1,
})

const categories = ref<Category[]>([])

const fetchCategories = async () => {
  try {
    const res = await api.get('/products/categories', {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
      },
    })
    categories.value = res.data
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error)
  }
}

const fetchProduct = async () => {
  try {
    const id = route.params.id as string
    const res = await api.get(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
      },
    })
    product.value = {
      id: res.data.id,
      name: res.data.name,
      description: res.data.description,
      price: +res.data.price,
      category: res.data.category.id,
    }
  } catch (error) {
    console.error('Ошибка при загрузке продукта:', error)
  }
}

const saveProduct = async () => {
  try {
    const id = route.params.id as string
    await api.patch(
      `/products/${id}`,
      {
        name: product.value.name,
        description: product.value.description,
        price: product.value.price,
        category: product.value.category,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
        },
      },
    )
    alert('Продукт успешно сохранён')
    router.push('/products-admin')
  } catch (error) {
    console.error('Ошибка при сохранении продукта:', error)
    alert('Ошибка при сохранении')
  }
}

onMounted(() => {
  fetchCategories()
  fetchProduct()
})
</script>

<template>
  <div class="container py-4">
    <h1 class="mb-4 text-white">Редактирование продукта</h1>

    <form @submit.prevent="saveProduct" class="text-white">
      <div class="mb-3">
        <label for="name" class="form-label">Название</label>
        <input
          id="name"
          type="text"
          v-model="product.name"
          class="form-control bg-dark text-white border-secondary"
          required
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Описание</label>
        <textarea
          id="description"
          v-model="product.description"
          class="form-control bg-dark text-white border-secondary"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">Цена (₽)</label>
        <input
          id="price"
          type="number"
          v-model.number="product.price"
          class="form-control bg-dark text-white border-secondary"
          min="0"
          required
        />
      </div>

      <div class="mb-3">
        <label for="category" class="form-label">Категория</label>
        <select
          id="category"
          v-model.number="product.category"
          class="form-select bg-dark text-white border-secondary"
          required
        >
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>
  </div>
</template>
