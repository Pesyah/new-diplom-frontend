<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface Truck {
  id: number
  model: string
  productionDate: string
  condition: number
  odometer: number
  isAvailable: boolean
  isUnderRepair: boolean
}

const trucks = ref<Truck[]>([])
const router = useRouter()

const fetchTrucks = async () => {
  const res = await api.get('/trucks')
  trucks.value = res.data
}

const goToCreateTruck = () => {
  router.push('/trucks/create')
}

const goToEditTruck = (id: number) => {
  router.push(`/trucks/edit/${id}`)
}

onMounted(fetchTrucks)
</script>

<template>
  <div class="container mt-4">
    <div class="mb-4">
      <button @click="goToCreateTruck" class="btn btn-primary">Создать новый грузовик</button>
    </div>

    <h2 class="mb-4">Список грузовиков</h2>

    <div class="row justify-content-start">
      <div v-for="truck in trucks" :key="truck.id" class="col-md-6 col-lg-12 mb-3">
        <div
          class="card bg-dark text-light shadow-sm border-start border-4"
          :class="truck.isAvailable ? 'border-success' : 'border-secondary'"
        >
          <div class="card-body">
            <h5 class="card-title">{{ truck.model }}</h5>
            <p class="card-text mb-1">
              <strong>Год выпуска: </strong>
              {{ new Date(truck.productionDate).toLocaleDateString() }}
            </p>
            <p class="card-text mb-1"><strong>Пробег: </strong> {{ truck.odometer }} км</p>
            <p class="card-text mb-1"><strong>Состояние: </strong> {{ truck.condition }}</p>
            <p class="card-text mb-1">
              <strong>Доступен: </strong>
              <span :class="truck.isAvailable ? 'text-success' : 'text-danger'">
                {{ truck.isAvailable ? 'Да' : 'Нет' }}
              </span>
            </p>
            <p class="card-text mb-3">
              <strong>В ремонте: </strong>
              <span :class="truck.isUnderRepair ? 'text-warning' : 'text-success'">
                {{ truck.isUnderRepair ? 'Да' : 'Нет' }}
              </span>
            </p>
            <button class="btn btn-outline-warning btn-sm" @click="goToEditTruck(truck.id)">
              Редактировать
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
