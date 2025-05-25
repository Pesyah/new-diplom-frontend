<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface SelectItem {
  id: number
  name: string
}

const router = useRouter()

// Модель формы
const form = ref({
  driverId: null as number | null,
  truckId: null as number | null,
  trailerId: null as number | null,
  cargoTypeId: null as number | null,
  statusId: null as number | null,
  origin: '',
  destination: '',
  routeDistanceKm: 0,
  departureTime: '',
  arrivalTime: '',
  totalPrice: 0,
})

// Селекты
const drivers = ref<SelectItem[]>([])
const trucks = ref<SelectItem[]>([])
const trailers = ref<SelectItem[]>([])
const cargoTypes = ref<SelectItem[]>([])
const statuses = ref<SelectItem[]>([])

const fetchOptions = async () => {
  const [d, t, tr, c, s] = await Promise.all([
    api.get('/drivers'),
    api.get('/trucks'),
    api.get('/trailers'),
    api.get('/trips/cargo-type'),
    api.get('/trips/trips-status'),
  ])
  console.log(d, t, tr, c, s)
  drivers.value = d.data
  trucks.value = t.data
  trailers.value = tr.data
  cargoTypes.value = c.data
  statuses.value = s.data
}

const submit = async () => {
  try {
    const data = {
      driver: form.value.driverId,
      truck: form.value.truckId,
      trailer: form.value.trailerId,
      cargoType: form.value.cargoTypeId,
      tripsStatus: form.value.statusId,
      origin: form.value.origin,
      destination: form.value.destination,
      routeDistanceKm: form.value.routeDistanceKm,
      departureTime: form.value.departureTime,
      totalPrice: form.value.totalPrice,
    }
    if (form.value.arrivalTime) data['arrivalTime'] = form.value.arrivalTime
    else data['arrivalTime'] = null
    await api.post('/trips', data)

    router.push('/trips')
  } catch (e) {
    console.error('Ошибка при создании поездки', e)
    alert('Не удалось создать поездку')
  }
}

onMounted(fetchOptions)
</script>

<template>
  <div class="container mt-4 text-light">
    <h2 class="mb-4">Создание поездки</h2>

    <div class="card bg-dark text-light p-4">
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label">Место отправления</label>
          <input
            v-model="form.origin"
            class="form-control bg-dark text-light form-control-lg"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Место прибытия</label>
          <input
            v-model="form.destination"
            class="form-control bg-dark text-light form-control-lg"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Расстояние (км)</label>
          <input
            type="number"
            v-model.number="form.routeDistanceKm"
            class="form-control bg-dark text-light form-control-lg"
            min="0"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Дата и время отправления</label>
          <input
            type="datetime-local"
            v-model="form.departureTime"
            class="form-control bg-dark text-light form-control-lg"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Дата и время прибытия</label>
          <input
            type="datetime-local"
            v-model="form.arrivalTime"
            class="form-control bg-dark text-light form-control-lg"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Стоимость</label>
          <input
            type="number"
            v-model.number="form.totalPrice"
            class="form-control bg-dark text-light form-control-lg"
            min="0"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Водитель</label>
          <select
            v-model="form.driverId"
            class="form-select bg-dark text-light form-control-lg"
            required
          >
            <option disabled value="">Выберите</option>
            <option v-for="d in drivers" :key="d.id" :value="d.id">{{ d.fullName }}</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Грузовик</label>
          <select
            v-model="form.truckId"
            class="form-select bg-dark text-light form-control-lg"
            required
          >
            <option disabled value="">Выберите</option>
            <option v-for="t in trucks" :key="t.id" :value="t.id">{{ t.name || t.model }}</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Прицеп</label>
          <select
            v-model="form.trailerId"
            class="form-select bg-dark text-light form-control-lg"
            required
          >
            <option disabled value="">Выберите</option>
            <option v-for="tr in trailers" :key="tr.id" :value="tr.id">
              {{ tr.model || tr.number }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Тип груза</label>
          <select
            v-model="form.cargoTypeId"
            class="form-select bg-dark text-light form-control-lg"
            required
          >
            <option disabled value="">Выберите</option>
            <option v-for="c in cargoTypes" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="form-label">Статус</label>
          <select
            v-model="form.statusId"
            class="form-select bg-dark text-light form-control-lg"
            required
          >
            <option disabled value="">Выберите</option>
            <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>

        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-success btn-lg">Сохранить</button>
        </div>
      </form>
    </div>
  </div>
</template>
