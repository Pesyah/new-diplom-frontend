<template>
  <div class="container mt-4">
    <h2>Редактирование машины</h2>

    <form @submit.prevent="updateCar" class="mt-3">
      <div class="mb-3">
        <label class="form-label">Марка</label>
        <select v-model="form.carsMark" class="form-select">
          <option v-for="mark in marks" :key="mark.id" :value="mark.id">{{ mark.name }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Модель</label>
        <input v-model="form.name" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Пробег</label>
        <input v-model.number="form.odometer" type="number" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Цена за сутки</label>
        <input v-model.number="form.pricePerDay" type="number" class="form-control" />
      </div>

      <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const form = ref({
  name: '',
  odometer: 0,
  pricePerDay: 0,
  carsMark: '',
})

const marks = ref([])

const fetchMarks = async () => {
  const res = await api.get('/cars/cars-mark')
  marks.value = res.data
}

const fetchCar = async () => {
  const res = await api.get(`/cars/${id}`)
  const car = res.data
  form.value = {
    name: car.name,
    odometer: car.odometer,
    pricePerDay: +car.pricePerDay,
    carsMark: car.carsMark.id,
  }
}

const updateCar = async () => {
  await api.patch(`/cars/${id}`, form.value)
  router.push('/cars')
}

onMounted(() => {
  fetchCar()
  fetchMarks()
})
</script>
