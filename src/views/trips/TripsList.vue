<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface Trip {
  id: number
  origin: string
  destination: string
  routeDistanceKm: number
  departureTime: string
  arrivalTime: string
  totalPrice: number
  driver?: { name: string }
  truck?: { model: string }
  trailer?: { number: string }
  cargoType?: { name: string }
  tripsStatus?: { name: string }
}

const trips = ref<Trip[]>([])
const router = useRouter()

const fetchTrips = async () => {
  const res = await api.get('/trips')
  trips.value = res.data
}

const goToCreateTrip = () => {
  router.push('/trips/create')
}

const goToEditTrip = (id: number) => {
  router.push(`/trips/edit/${id}`)
}

onMounted(fetchTrips)
</script>

<template>
  <div class="container mt-4 text-light">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Список поездок</h2>
    </div>
    <button @click="goToCreateTrip" class="btn btn-primary mb-3">Создать поездку</button>

    <div class="row">
      <div v-for="trip in trips" :key="trip.id" class="col-md-6 col-lg-12 mb-3">
        <div class="card bg-dark text-light shadow-sm border-start border-4 border-info">
          <div class="card-body">
            <h5 class="card-title">{{ trip.origin }} → {{ trip.destination }}</h5>

            <p class="card-text mb-1">
              <strong>Водитель: </strong>{{ trip.driver?.fullName || '—' }}
            </p>
            <p class="card-text mb-1"><strong>Грузовик: </strong>{{ trip.truck?.model || '—' }}</p>
            <p class="card-text mb-1"><strong>Прицеп: </strong>{{ trip.trailer?.model || '—' }}</p>
            <p class="card-text mb-1"><strong>Груз: </strong>{{ trip.cargoType?.name || '—' }}</p>
            <p class="card-text mb-1"><strong>Расстояние: </strong>{{ trip.routeDistanceKm }} км</p>
            <p class="card-text mb-1">
              <strong>Время отправления: </strong
              >{{ new Date(trip.departureTime).toLocaleString() }}
            </p>
            <p class="card-text mb-1">
              <strong>Прибытие: </strong
              >{{ trip.arrivalTime ? new Date(trip.arrivalTime).toLocaleString() : 'не указано' }}
            </p>
            <p class="card-text mb-1"><strong>Стоимость: </strong>{{ trip.totalPrice }} ₽</p>
            <p class="card-text mb-3">
              <strong>Статус: </strong>
              <span class="badge bg-info">{{ trip.tripsStatus?.name || 'Неизвестен' }}</span>
            </p>

            <button class="btn btn-outline-warning btn-sm" @click="goToEditTrip(trip.id)">
              Редактировать
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
