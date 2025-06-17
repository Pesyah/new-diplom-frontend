<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const bookingForm = ref({
  car: null,
  customer: null,
  startTime: '',
  endTime: '',
  discount: 0,
})

const carQuery = ref('')
const customerQuery = ref('')

const carResults = ref([])
const customerResults = ref([])

const today = new Date().toISOString().split('T')[0] // формат YYYY-MM-DD

watch(carQuery, async (q) => {
  if (!q) return (carResults.value = [])
  try {
    const res = await api.get('/cars', { params: { name: q } })
    carResults.value = res.data
  } catch {
    carResults.value = []
  }
})

watch(customerQuery, async (q) => {
  if (!q) return (customerResults.value = [])
  try {
    const res = await api.get('/customers/by-query', { params: { query: q } })
    customerResults.value = res.data
  } catch {
    customerResults.value = []
  }
})

const selectCar = (car) => {
  bookingForm.value.car = car
  carQuery.value = `${car.carsMark?.name || ''} ${car.name}`
  carResults.value = []
}

const selectCustomer = (customer) => {
  bookingForm.value.customer = customer
  customerQuery.value = `${customer.surname} ${customer.name} ${customer.lastName}`
  customerResults.value = []
}

const submit = async () => {
  try {
    const payload = {
      cars: bookingForm.value.car?.id,
      customers: bookingForm.value.customer?.id,
      startTime: new Date(bookingForm.value.startTime),
      endTime: new Date(bookingForm.value.endTime),
      discount: bookingForm.value.discount,
    }
    await api.post('/bookings', payload)
    alert('Аренда успешно создана')
    router.push('/bookings')
  } catch (err) {
    console.error(err)
    alert('Ошибка при создании аренды')
  }
}
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-3">Создание аренды</h1>
    <form @submit.prevent="submit">
      <!-- Поиск машины -->
      <div class="mb-3 position-relative">
        <label class="form-label">Машина</label>
        <input v-model="carQuery" class="form-control" placeholder="Введите название машины" />
        <ul class="list-group position-absolute w-100 z-1" v-if="carResults.length">
          <li
            class="list-group-item list-group-item-action"
            v-for="car in carResults"
            :key="car.id"
            @click="selectCar(car)"
            style="cursor: pointer"
          >
            {{ car.carsMark?.name || 'Без марки' }} — {{ car.name }} — {{ car.pricePerDay }}₽/день
          </li>
        </ul>
      </div>

      <div v-if="bookingForm.car" class="mb-3 card p-2">
        <strong>Выбрано:</strong>
        {{ bookingForm.car.carsMark?.name || '' }} {{ bookingForm.car.name }}
      </div>

      <!-- Поиск заказчика -->
      <div class="mb-3 position-relative">
        <label class="form-label">Заказчик</label>
        <input v-model="customerQuery" class="form-control" placeholder="Введите ФИО заказчика" />
        <ul class="list-group position-absolute w-100 z-1" v-if="customerResults.length">
          <li
            class="list-group-item list-group-item-action"
            v-for="customer in customerResults"
            :key="customer.id"
            @click="selectCustomer(customer)"
            style="cursor: pointer"
          >
            {{ customer.surname }} {{ customer.name }} {{ customer.lastName }}
          </li>
        </ul>
      </div>

      <div v-if="bookingForm.customer" class="mb-3 card p-2">
        <strong>Выбрано:</strong>
        {{ bookingForm.customer.surname }} {{ bookingForm.customer.name }}
        {{ bookingForm.customer.lastName }}<br />
        {{ bookingForm.customer.phone }}
      </div>

      <!-- Время и скидка -->
      <!-- Дата начала -->
      <div class="mb-3">
        <label class="form-label">Дата начала</label>
        <input v-model="bookingForm.startTime" type="date" class="form-control" :min="today" />
      </div>

      <!-- Дата окончания -->
      <div class="mb-3">
        <label class="form-label">Дата окончания</label>
        <input v-model="bookingForm.endTime" type="date" class="form-control" :min="today" />
      </div>

      <div class="mb-3">
        <label class="form-label">Скидка (%)</label>
        <input
          v-model.number="bookingForm.discount"
          type="number"
          min="0"
          max="100"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary">Создать аренду</button>
    </form>
  </div>
</template>
