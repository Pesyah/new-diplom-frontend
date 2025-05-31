<script setup lang="ts">
import api from '@/services/api'
import { nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import L from 'leaflet'

const map = ref<L.Map | null>(null)
const gpsMarks = ref<{ id: string; latitude: number; longitude: number }[]>([])

const initMap = () => {
  if (!gpsMarks.value.length) return

  const center = [gpsMarks.value[0].latitude, gpsMarks.value[0].longitude]
  map.value = L.map('trip-map').setView(center, 14)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value)

  gpsMarks.value.forEach((mark) => {
    L.marker([mark.latitude, mark.longitude])
      .addTo(map.value!)
      .bindPopup(`GPS: ${mark.latitude}, ${mark.longitude}`)
  })
}

const route = useRoute()
const router = useRouter()
const tripId = route.params.id

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

const drivers = ref<any[]>([])
const trucks = ref<any[]>([])
const trailers = ref<any[]>([])
const cargoTypes = ref<any[]>([])
const statuses = ref<any[]>([])

const fetchOptions = async () => {
  const [d, t, tr, c, s] = await Promise.all([
    api.get('/drivers'),
    api.get('/trucks'),
    api.get('/trailers'),
    api.get('/trips/cargo-type'),
    api.get('/trips/trips-status'),
  ])

  drivers.value = d.data
  trucks.value = t.data
  trailers.value = tr.data
  cargoTypes.value = c.data
  statuses.value = s.data
}

const fetchTrip = async () => {
  try {
    const res = await api.get(`/trips/${tripId}`)
    const trip = res.data

    form.value = {
      driverId: trip.driver?.id || null,
      truckId: trip.truck?.id || null,
      trailerId: trip.trailer?.id || null,
      cargoTypeId: trip.cargoType?.id || null,
      statusId: trip.tripsStatus?.id || null,
      origin: trip.origin,
      destination: trip.destination,
      routeDistanceKm: trip.routeDistanceKm,
      departureTime: trip.departureTime?.slice(0, 16),
      arrivalTime: trip.arrivalTime?.slice(0, 16),
      totalPrice: trip.totalPrice,
    }

    gpsMarks.value = trip.tripGPSMarks || []
    nextTick(() => initMap())
  } catch (e) {
    console.error('Не удалось загрузить поездку', e)
    alert('Ошибка при загрузке данных поездки')
  }
}

const submit = async () => {
  try {
    const data: any = {
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
    await api.patch(`/trips/${tripId}`, data)

    router.push('/trips')
  } catch (e) {
    console.error('Ошибка при сохранении', e)
    alert('Не удалось сохранить изменения')
  }
}

onMounted(async () => {
  await fetchOptions()
  await fetchTrip()
})
</script>

<template>
  <div class="container mt-4 text-light">
    <h2 class="mb-4">Редактирование поездки</h2>

    <div class="row">
      <!-- Левая колонка: форма -->
      <div class="col-lg-10 col-12 mb-3">
        <div class="card bg-dark text-light p-4">
          <form @submit.prevent="submit">
            <!-- поля формы -->
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
              <label class="form-label">Дата и время прибытия (необязательно)</label>
              <input
                type="datetime-local"
                v-model="form.arrivalTime"
                class="form-control bg-dark text-light form-control-lg"
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
                <option v-for="t in trucks" :key="t.id" :value="t.id">
                  {{ t.name || t.model }}
                </option>
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
              <button type="submit" class="btn btn-primary btn-lg">Сохранить изменения</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Правая колонка: карта -->
      <div class="col-lg-2 col-12">
        <div class="position-sticky" style="top: 80px">
          <h4 class="mb-2">GPS метки поездки</h4>
          <div id="trip-map" style="height: 600px; width: 600px; border-radius: 8px"></div>
        </div>
      </div>
    </div>
  </div>
</template>
