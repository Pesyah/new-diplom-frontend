<!-- src/views/bookings/BookingDetail.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const booking = ref(null)
const loading = ref(true)

const fetchBooking = async () => {
  try {
    const { data } = await api.get(`/bookings/${route.params.id}`)
    booking.value = data
  } catch (err) {
    console.error(err)
    alert('Ошибка загрузки аренды')
  } finally {
    loading.value = false
  }
}

const removeBooking = async () => {
  if (!confirm('Удалить эту аренду?')) return
  try {
    await api.delete(`/bookings/${route.params.id}`)
    alert('Аренда удалена')
    router.push('/bookings')
  } catch (err) {
    console.error(err)
    alert('Ошибка при удалении')
  }
}

onMounted(fetchBooking)
</script>

<template>
  <div class="container mt-4" v-if="!loading">
    <h1 class="mb-3">Информация об аренде</h1>

    <div v-if="booking" class="card p-4 shadow-sm rounded-4">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <strong>Машина:</strong>
          {{ booking.cars?.carsMark?.name || '' }} {{ booking.cars?.name || '' }}
        </li>
        <li class="list-group-item">
          <strong>Заказчик:</strong>
          {{ booking.customers?.surname || '' }} {{ booking.customers?.name || '' }}
        </li>
        <li class="list-group-item">
          <strong>Начало аренды:</strong>
          {{ new Date(booking.startTime).toLocaleString() }}
        </li>
        <li class="list-group-item">
          <strong>Окончание аренды:</strong>
          {{ new Date(booking.endTime).toLocaleString() }}
        </li>
        <li class="list-group-item"><strong>Скидка:</strong> {{ booking.discount }}%</li>
      </ul>

      <div class="mt-4 d-flex justify-content-end">
        <button class="btn btn-danger" @click="removeBooking">Удалить</button>
      </div>
    </div>

    <div v-else class="text-muted">Аренда не найдена</div>
  </div>
</template>
