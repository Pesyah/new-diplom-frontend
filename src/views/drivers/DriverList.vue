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

const goToCreateDriver = () => {
  router.push('/drivers/create')
}

onMounted(fetchDrivers)
</script>

<template>
  <div class="container mt-4">
    <div class="mb-4">
      <button @click="goToCreateDriver" class="btn btn-primary">Создать водителя</button>
    </div>

    <h2 class="mb-4">Список водителей</h2>

    <div class="row justify-content-start">
      <div v-for="driver in drivers" :key="driver.id" class="col-md-6 col-lg-12 mb-3">
        <div
          class="card bg-dark text-light shadow-sm border-start border-4"
          :class="driver.isAvailable ? 'border-success' : 'border-danger'"
        >
          <div class="card-body">
            <h5 class="card-title mb-1">{{ driver.fullName }}</h5>
            <p class="card-text mb-1"><strong>Телефон:</strong> {{ driver.phone }}</p>
            <p class="card-text">
              <strong>Доступен: </strong>
              <span :class="driver.isAvailable ? 'text-success' : 'text-danger'">
                {{ driver.isAvailable ? 'Да' : 'Нет' }}
              </span>
            </p>
            <button class="btn btn-outline-warning btn-sm" @click="goToEdit(driver.id)">
              Редактировать
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
