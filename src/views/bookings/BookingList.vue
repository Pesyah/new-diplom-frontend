<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce'

const bookings = ref([])

const customersOptions = ref([])
const carsOptions = ref([])
const managers = ref([])

const filters = ref({
  customersId: '',
  customersQuery: '',
  managerId: '',
  carsId: '',
  carsQuery: '',
})

const router = useRouter()

const fetchBookings = async () => {
  try {
    const params = {}

    if (filters.value.customersId) params.customersId = filters.value.customersId
    if (filters.value.managerId) params.managerId = filters.value.managerId
    if (filters.value.carsId) params.carsId = filters.value.carsId

    const { data } = await api.get('/bookings', { params })
    bookings.value = data
  } catch (err) {
    console.error(err)
    alert('Ошибка при загрузке заказов')
  }
}

const fetchManagers = async () => {
  try {
    const { data } = await api.get('/auth/users')
    managers.value = data
  } catch (err) {
    console.error(err)
  }
}

const searchCustomers = debounce(async () => {
  if (!filters.value.customersQuery) {
    customersOptions.value = []
    return
  }

  try {
    const { data } = await api.get('/customers/by-query', {
      params: { query: filters.value.customersQuery },
    })
    customersOptions.value = data
  } catch (err) {
    console.error(err)
  }
}, 400)

const searchCars = debounce(async () => {
  if (!filters.value.carsQuery) {
    carsOptions.value = []
    return
  }

  try {
    const { data } = await api.get('/cars', {
      params: { name: filters.value.carsQuery },
    })
    carsOptions.value = data
  } catch (err) {
    console.error(err)
  }
}, 400)

watch(() => filters.value.customersQuery, searchCustomers)
watch(() => filters.value.carsQuery, searchCars)

onMounted(() => {
  fetchManagers()
  fetchBookings()
})

const viewDetails = (id) => {
  router.push(`/bookings/detail/${id}`)
}
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Список заказов</h1>

    <!-- Filters -->
    <div class="card p-3 mb-4">
      <div class="row g-3">
        <!-- Customer search -->
        <div class="col-md-4">
          <label class="form-label">Поиск заказчика</label>
          <input
            type="text"
            class="form-control"
            placeholder="Введите имя, фамилию..."
            v-model="filters.customersQuery"
          />
          <select
            class="form-select mt-2"
            v-if="customersOptions.length"
            v-model="filters.customersId"
          >
            <option disabled value="">Выберите заказчика</option>
            <option v-for="c in customersOptions" :key="c.id" :value="c.id">
              {{ c.surname }} {{ c.name }}
            </option>
          </select>
        </div>

        <!-- Manager select -->
        <div class="col-md-4">
          <label class="form-label">Менеджер</label>
          <select class="form-select" v-model="filters.managerId">
            <option value="">Все</option>
            <option v-for="m in managers" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>
        </div>

        <!-- Car search -->
        <div class="col-md-4">
          <label class="form-label">Поиск машины</label>
          <input
            type="text"
            class="form-control"
            placeholder="Название машины..."
            v-model="filters.carsQuery"
          />
          <select class="form-select mt-2" v-if="carsOptions.length" v-model="filters.carsId">
            <option disabled value="">Выберите машину</option>
            <option v-for="car in carsOptions" :key="car.id" :value="car.id">
              {{ car.carsMark?.name || 'без марки' }} {{ car.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-3 text-end">
        <button class="btn btn-primary" @click="fetchBookings">Поиск</button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Клиент</th>
            <th>Менеджер</th>
            <th>Машина</th>
            <th>Начало</th>
            <th>Конец</th>
            <th>Скидка</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(b, index) in bookings" :key="b.id">
            <td>{{ index + 1 }}</td>
            <td>{{ b.customers?.surname }} {{ b.customers?.name }}</td>
            <td>{{ b.manager?.name }}</td>
            <td>{{ b.cars?.carsMark?.name }} {{ b.cars?.name }}</td>
            <td>{{ new Date(b.startTime).toLocaleDateString() }}</td>
            <td>{{ new Date(b.endTime).toLocaleDateString() }}</td>
            <td>{{ b.discount }}%</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary" @click="viewDetails(b.id)">
                Подробнее
              </button>
            </td>
          </tr>
          <tr v-if="bookings.length === 0">
            <td colspan="8" class="text-center">Нет заказов</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
