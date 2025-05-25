<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface Trailer {
  id: number
  model: string
  productionDate: string
  condition: number
  isAvailable: boolean
  isUnderRepair: boolean
}

const trailers = ref<Trailer[]>([])
const router = useRouter()

const fetchTrailers = async () => {
  try {
    const res = await api.get('/trailers')
    trailers.value = res.data
  } catch (err) {
    console.error('Ошибка загрузки прицепов:', err)
  }
}

const goToEdit = (id: number) => {
  router.push(`/trailers/edit/${id}`)
}

const goToCreate = () => {
  router.push('/trailers/create')
}

onMounted(fetchTrailers)
</script>

<template>
  <div class="container mt-4">
    <div class="mb-4">
      <button class="btn btn-primary" @click="goToCreate">Создать новый прицеп</button>
    </div>

    <h2 class="mb-4">Список прицепов</h2>

    <div class="row justify-content-start">
      <div v-for="trailer in trailers" :key="trailer.id" class="col-md-6 col-lg-12 mb-3">
        <div
          class="card bg-dark text-light shadow-sm border-start border-4"
          :class="trailer.isAvailable ? 'border-success' : 'border-secondary'"
        >
          <div class="card-body">
            <h5 class="card-title">{{ trailer.model }}</h5>
            <p class="card-text mb-1">
              <strong>Дата выпуска: </strong> {{ trailer.productionDate.slice(0, 10) }}
            </p>
            <p class="card-text mb-1"><strong>Состояние:</strong> {{ trailer.condition }}</p>
            <p class="card-text mb-1">
              <strong>Доступен: </strong> {{ trailer.isAvailable ? 'Да' : 'Нет' }}
            </p>
            <p class="card-text mb-3">
              <strong>В ремонте: </strong> {{ trailer.isUnderRepair ? 'Да' : 'Нет' }}
            </p>
            <button class="btn btn-outline-warning btn-sm" @click="goToEdit(trailer.id)">
              Редактировать
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
