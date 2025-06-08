<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const customer = ref(null)

watch(searchQuery, async (q) => {
  try {
    const res = await api.get(`/customers/by-query/?query=${encodeURIComponent(q)}`)
    customer.value = res.data
  } catch {
    console.log(123)
    customer.value = null
  }
})
const onLoadPage = async () => {
  try {
    const res = await api.get(`/customers/by-query/`)
    customer.value = res.data
  } catch {
    customer.value = null
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

    <div v-if="customer" class="card p-3 mb-3">
      <p>
        <strong>ФИО:</strong> {{ customer.surname }} {{ customer.name }} {{ customer.lastName }}
      </p>
      <p><strong>Телефон:</strong> {{ customer.phone }}</p>
      <p><strong>Адрес:</strong> {{ customer.address }}</p>
      <button class="btn btn-primary" @click="router.push(`/customers/edit/${customer.id}`)">
        Открыть
      </button>
    </div>

    <router-link to="/customers/create" class="btn btn-success"
      >Создать нового заказчика</router-link
    >
  </div>
</template>
