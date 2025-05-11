<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface Driver {
  id: number
  fullName: string
  phone: string
  isAvailable: boolean
  // добавь остальные поля при необходимости
}

const drivers = ref<Driver[]>([])
const router = useRouter()

const fetchDrivers = async () => {
  const res = await api.get('/drivers') // замени на свой эндпоинт
  drivers.value = res.data
  drivers.value = res.data
}

const goToEdit = (id: number) => {
  router.push(`/drivers/edit/${id}`)
}

onMounted(fetchDrivers)
</script>

<template>
  <div class="container mt-5">
    <h2 class="mb-4">Список водителей</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ФИО</th>
          <th>Телефон</th>
          <th>Доступен</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="driver in drivers" :key="driver.id">
          <td>{{ driver.fullName }}</td>
          <td>{{ driver.phone }}</td>
          <td>{{ driver.isAvailable ? 'Да' : 'Нет' }}</td>
          <td>
            <button class="btn btn-sm btn-warning" @click="goToEdit(driver.id)">
              Редактировать
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
