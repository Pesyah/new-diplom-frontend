<template>
  <div v-if="isAdmin" class="d-flex justify-content-center align-items-center min-vh-100">
    <form @submit.prevent="submitForm" class="p-4 bg-dark rounded" style="width: 360px">
      <h2 class="mb-4 text-center">Создать продукт</h2>

      <div class="mb-3">
        <label for="name" class="form-label">Название</label>
        <input
          id="name"
          type="text"
          class="form-control"
          v-model="form.name"
          required
          placeholder="Введите название"
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Описание</label>
        <textarea
          id="description"
          class="form-control"
          v-model="form.description"
          rows="3"
          placeholder="Введите описание"
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">Цена (₽)</label>
        <input
          id="price"
          type="number"
          class="form-control"
          v-model.number="form.price"
          min="0"
          required
        />
      </div>

      <div class="mb-4">
        <label for="category" class="form-label">Категория</label>
        <select id="category" class="form-select" v-model.number="form.category" required>
          <option disabled value="">Выберите категорию</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="loading">
        {{ loading ? 'Сохраняем...' : 'Создать' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const form = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
})

const categories = ref([])
const loading = ref(false)

const fetchCategories = async () => {
  try {
    const { data } = await api.get('/products/categories')
    categories.value = data
  } catch (e) {
    console.error('Ошибка загрузки категорий:', e)
  }
}

const submitForm = async () => {
  loading.value = true
  try {
    // формат тела как ты дал
    await api.post('/products', {
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      category: form.value.category,
    })
    alert('Продукт создан!')
    // очистить форму
    form.value = {
      name: '',
      description: '',
      price: 0,
      category: '',
    }
  } catch (e) {
    alert('Ошибка создания продукта')
    console.error(e)
  } finally {
    loading.value = false
  }
}
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.role === 2)
onMounted(fetchCategories)
</script>

<style scoped>
body {
  background-color: #121212; /* дополнительно, если нужно */
}
</style>
