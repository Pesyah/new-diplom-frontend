<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const customers = ref([])

watch(searchQuery, async (q) => {
  if (!q.trim()) {
    customers.value = []
    return
  }

  try {
    const res = await api.get(`/customers/by-query`, {
      params: { query: q },
    })
    customers.value = res.data
  } catch {
    customers.value = []
  }
})

const onLoadPage = async () => {
  try {
    const res = await api.get(`/customers/by-query`)
    customers.value = res.data
  } catch {
    customers.value = []
  }
}

onMounted(onLoadPage)
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-3">Поиск заказчиков</h1>

    <input
      v-model="searchQuery"
      class="form-control mb-3"
      placeholder="Введите имя, фамилию или отчество"
    />

    <div v-if="customers.length === 0" class="text-muted mb-3">Ничего не найдено</div>

    <div v-for="c in customers" :key="c.id" class="card p-3 mb-3">
      <p><strong>ФИО:</strong> {{ c.surname }} {{ c.name }} {{ c.lastName }}</p>
      <p><strong>Телефон:</strong> {{ c.phone }}</p>
      <p><strong>Адрес:</strong> {{ c.address }}</p>
      <button class="btn btn-primary" @click="router.push(`/customers/edit/${c.id}`)">
        Открыть
      </button>
    </div>

    <router-link to="/customers/create" class="btn btn-success">
      Создать нового заказчика
    </router-link>
  </div>
</template>
