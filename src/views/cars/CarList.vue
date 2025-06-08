<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center">
      <h2>Список машин</h2>
      <router-link to="/cars/create" class="btn btn-success">Добавить</router-link>
    </div>

    <div class="row mt-3">
      <div class="col-md-4">
        <input
          v-model="filters.name"
          @input="fetchCars"
          type="text"
          class="form-control"
          placeholder="Поиск по модели..."
        />
      </div>
      <div class="col-md-4">
        <select v-model="filters.carsMark" @change="fetchCars" class="form-select">
          <option value="">Все марки</option>
          <option v-for="mark in marks" :key="mark.id" :value="mark.id">{{ mark.name }}</option>
        </select>
      </div>
    </div>

    <table class="table table-hover mt-4">
      <thead>
        <tr>
          <th>Марка</th>
          <th>Модель</th>
          <th>Пробег</th>
          <th>Цена/день</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.id">
          <td>{{ car.carsMark.name }}</td>
          <td>{{ car.name }}</td>
          <td>{{ car.odometer.toLocaleString() }} км</td>
          <td>{{ +car.pricePerDay }} ₽</td>
          <td>
            <router-link :to="`/cars/${car.id}`" class="btn btn-sm btn-outline-primary"
              >Открыть</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@services/api'

const cars = ref([])
const marks = ref([])
const filters = ref({ name: '', carsMark: '' })

const fetchCars = async () => {
  const res = await api.get('/cars', { params: filters.value })
  cars.value = res.data
}

const fetchMarks = async () => {
  const res = await api.get('/cars/cars-mark')
  marks.value = res.data
}

onMounted(() => {
  fetchCars()
  fetchMarks()
})
</script>
