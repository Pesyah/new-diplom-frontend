<template>
  <div class="container mt-4">
    <h2>Отчёт по пользователю</h2>

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>

    <div v-else>
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">{{ userFullName }}</h5>
          <p class="card-text">
            <strong>Email:</strong> {{ user?.email }}<br />
            <strong>Телефон:</strong> {{ user?.phone }}<br />
            <strong>Дата регистрации:</strong> {{ formatDate(user?.created_at) }}
          </p>
        </div>
      </div>
      <div class="filters mb-4 d-flex flex-wrap gap-3 align-items-center">
        <!-- Фильтр по дате -->
        <div>
          <label for="dateFrom" class="form-label">Дата с:</label>
          <input id="dateFrom" type="date" v-model="dateFrom" class="form-control" />
        </div>

        <div>
          <label for="dateTo" class="form-label">Дата по:</label>
          <input id="dateTo" type="date" v-model="dateTo" class="form-control" />
        </div>

        <!-- Фильтр по статусу -->
        <div>
          <label for="statusFilter" class="form-label">Статус:</label>
          <select id="statusFilter" v-model="statusFilter" class="form-select">
            <option value="">Все</option>
            <option v-for="status in availableStatuses" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>

        <!-- Фильтр по категории -->
        <div>
          <label for="categoryFilter" class="form-label">Категория:</label>
          <select id="categoryFilter" v-model="categoryFilter" class="form-select">
            <option value="">Все</option>
            <option v-for="category in availableCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Кнопка сброса -->
        <div class="align-self-end">
          <button @click="clearFilters" class="btn btn-secondary btn-sm">Сбросить фильтры</button>
        </div>
      </div>

      <div v-for="order in filteredOrders" :key="order.id" class="card mb-3">
        <div class="card-header">
          Заказ от {{ formatDate(order.created_at) }} —
          <span
            :class="{
              'badge bg-success': order.status.id === 2,
              'badge bg-warning': order.status.id === 1,
              'badge bg-danger': order.status.id === 3,
            }"
          >
            {{ order.status.name }}
          </span>
        </div>

        <div class="card-body">
          <ul class="list-group mb-2">
            <li
              class="list-group-item d-flex justify-content-between align-items-start"
              v-for="part in order.orderPart"
              :key="part.id"
            >
              <div class="ms-2 me-auto" :class="{ 'text-muted': !part.product }">
                <div class="fw-bold">
                  <span v-if="part.product">{{ part.product.name }}</span>
                  <span v-else>
                    <i class="bi bi-exclamation-circle-fill text-danger"></i> Удалённый товар
                  </span>
                </div>

                <template v-if="part.product">
                  Категория: {{ part.product.category?.name || 'Удалена' }}<br />
                  Цена: {{ part.product.price }} × {{ part.count }}
                </template>
                <template v-else>
                  <em>Информация о товаре недоступна</em>
                </template>
              </div>
              <span class="badge bg-primary rounded-pill">
                {{ part.product ? partTotal(part) + ' ₽' : '—' }}
              </span>
            </li>
          </ul>
          <div class="text-end fw-bold">Итого по заказу: {{ order.price }} ₽</div>
        </div>
      </div>

      <div class="d-flex align-items-start gap-4">
        <div class="total-fixed border rounded shadow-sm p-2" style="min-width: 160px">
          <span class="fw-bold">Общая сумма:</span> {{ totalSum }} ₽
          <div style="width: 300px; height: 150px; margin-top: 1rem">
            <Bar :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { Bar } from 'vue-chartjs'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale } from 'chart.js'
import dayjs from 'dayjs' // для удобной работы с датами (npm install dayjs)

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
}
const route = useRoute()
const userId = route.query.userId as string

const orders = ref([])
const error = ref('')
const loading = ref(true)

const user = computed(() => orders.value[0]?.user || null)
const userFullName = computed(() => (user.value ? `${user.value.name} ${user.value.surname}` : ''))

const totalSum = computed(() => orders.value.reduce((sum, o) => sum + parseFloat(o.price), 0))

const dateFrom = ref('')
const dateTo = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const chartData = computed(() => {
  const sumsByDate: Record<string, number> = {}

  // Группируем сумму по дате (только отфильтрованные заказы!)
  filteredOrders.value.forEach((order) => {
    const dateKey = dayjs(order.created_at).format('YYYY-MM-DD')
    if (!sumsByDate[dateKey]) sumsByDate[dateKey] = 0
    sumsByDate[dateKey] += parseFloat(order.price)
  })

  // Сортируем по дате
  const sortedDates = Object.keys(sumsByDate).sort()

  return {
    labels: sortedDates,
    datasets: [
      {
        label: 'Сумма покупок, ₽',
        data: sortedDates.map((date) => sumsByDate[date]),
        backgroundColor: '#3b82f6', // синий цвет
      },
    ],
  }
})

const availableStatuses = computed(() => {
  const map = new Map<number, string>()
  for (const order of orders.value) {
    if (!map.has(order.status.id)) {
      map.set(order.status.id, order.status.name)
    }
  }
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
})

// Получаем все категории из заказов (уникальные)
const availableCategories = computed(() => {
  const map = new Map<number, string>()
  for (const order of orders.value) {
    for (const part of order.orderPart) {
      if (!map.has(part.product.category.id)) {
        map.set(part.product.category.id, part.product.category.name)
      }
    }
  }
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
})

// Очистка фильтров
function clearFilters() {
  dateFrom.value = ''
  dateTo.value = ''
  statusFilter.value = ''
  categoryFilter.value = ''
}

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    // Фильтр по дате (по created_at)
    if (dateFrom.value && new Date(order.created_at) < new Date(dateFrom.value)) {
      return false
    }
    if (dateTo.value && new Date(order.created_at) > new Date(dateTo.value + 'T23:59:59')) {
      return false
    }

    // Фильтр по статусу
    if (statusFilter.value && order.status.id !== +statusFilter.value) {
      return false
    }

    // Фильтр по категории — хотя бы одна часть заказа должна содержать выбранную категорию
    if (categoryFilter.value) {
      const catId = +categoryFilter.value
      const hasCategory = order.orderPart.some((part) => part.product.category.id === catId)
      if (!hasCategory) return false
    }

    return true
  })
})

function partTotal(part) {
  return parseFloat(part.product.price) * part.count
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU')
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/orders/to-admin/by-userId`, {
      params: { userId },
    })
    orders.value = data
    console.log(data)
  } catch (e) {
    error.value = 'Ошибка загрузки отчёта'
  } finally {
    loading.value = false
  }
})
</script>
<style>
.total-fixed {
  position: fixed;
  top: 19vh; /* можно регулировать */
  right: 10vw;
  z-index: 1000;
  font-size: 1rem;
}
</style>
