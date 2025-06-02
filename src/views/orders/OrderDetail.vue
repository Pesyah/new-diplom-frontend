<template>
  <div class="container py-4 text-white">
    <button class="btn btn-outline-secondary mb-3 text-white" @click="$router.back()">
      <i class="bi bi-arrow-left"></i> Назад
    </button>

    <div v-if="order" class="card bg-dark border-secondary mb-4">
      <div class="card-body">
        <h3 class="card-title mb-3 text-white">Заказ № {{ order.id }}</h3>
        <p class="text-white"><strong>Статус:</strong> {{ order.status.name }}</p>
        <p class="text-white"><strong>Создан:</strong> {{ formatDate(order.created_at) }}</p>

        <h5 class="mt-4 text-white">Пользователь:</h5>
        <ul class="mb-3">
          <li>
            <strong class="text-white">ФИО:</strong> {{ order.user.surname }} {{ order.user.name }}
          </li>
          <li class="text-white"><strong>Email:</strong> {{ order.user.email }}</li>
          <li class="text-white"><strong>Телефон:</strong> {{ order.user.phone }}</li>
        </ul>

        <h5 class="text-white">Состав заказа:</h5>
        <ul>
          <li class="text-white" v-for="part in order.orderPart" :key="part.id">
            {{ part.product.name }} ({{ part.product.category.name }}) — {{ part.count }} шт. ×
            {{ part.product.price }} ₽
          </li>
        </ul>

        <h4 class="mt-3 text-success">Итог: {{ totalPrice }} ₽</h4>

        <div v-if="isAdmin" class="mt-4 d-flex gap-2">
          <button class="btn btn-outline-success" @click="approveOrder">
            <i class="bi bi-check-circle"></i> Одобрить
          </button>
          <button class="btn btn-outline-danger" @click="rejectOrder">
            <i class="bi bi-x-circle"></i> Отклонить
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center mt-5">
      <p>Загрузка заказа...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const order = ref(null)

const isAdmin = computed(() => authStore.user?.role === 2)

const fetchOrder = async () => {
  try {
    const { id } = route.params
    const { data } = await api.get(`/orders/${id}`)
    order.value = data
  } catch (err) {
    console.error('Ошибка при загрузке заказа', err)
  }
}

const totalPrice = computed(() => {
  if (!order.value) return 0
  return order.value.orderPart.reduce(
    (sum, part) => sum + part.count * parseFloat(part.product.price),
    0,
  )
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('ru-RU')
}

const approveOrder = async () => {
  try {
    await api.patch(`/orders/${order.value.id}/status`, { statusId: 2 }) // 2 = Одобрен
    alert('Заказ одобрен')
    await fetchOrder()
  } catch (err) {
    alert('Ошибка при одобрении заказа')
    console.error(err)
  }
}

const rejectOrder = async () => {
  try {
    await api.patch(`/orders/${order.value.id}/status`, { statusId: 3 }) // 3 = Отклонён
    alert('Заказ отклонён')
    await fetchOrder()
  } catch (err) {
    alert('Ошибка при отклонении заказа')
    console.error(err)
  }
}

onMounted(fetchOrder)
</script>
