<template>
  <div style="margin-top: 5vh" class="container py-4 text-white">
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
          <li class="text-white">
            <strong>ФИО:</strong> {{ order.user.surname }} {{ order.user.name }}
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

        <h4 class="mt-3 text-success">Итог: {{ order.price }} ₽</h4>

        <!-- Чат заказов -->
        <div v-if="order?.orderChats" class="card bg-dark border-secondary mt-4">
          <div class="card-body">
            <h5 class="text-white mb-3">Чат по заказу</h5>

            <div v-if="order.orderChats.orderChatsMessages.length">
              <div
                v-for="msg in order.orderChats.orderChatsMessages"
                :key="msg.id"
                class="mb-3 p-2 border border-secondary rounded"
              >
                <p class="mb-1 text-white">
                  <strong>{{ msg.user.surname }} {{ msg.user.name }}</strong>
                  <small class="text-muted"> — {{ formatDate(msg.created_at) }}</small>
                </p>
                <p class="text-white mb-0">{{ msg.message }}</p>
              </div>
            </div>
            <div v-else>
              <p class="text-muted">Сообщений пока нет.</p>
            </div>

            <!-- Форма отправки сообщения -->
            <form @submit.prevent="sendMessage" class="mt-3 d-flex gap-2">
              <input
                v-model="newMessage"
                type="text"
                class="form-control bg-dark text-white border-secondary"
                placeholder="Введите сообщение"
                required
              />
              <button class="btn btn-outline-success" type="submit">
                <i class="bi bi-send"></i>
              </button>
            </form>
          </div>
        </div>

        <div v-if="isAdmin" class="mt-4 d-flex gap-2">
          <button class="btn btn-outline-success" @click="approveOrder">
            <i class="bi bi-check-circle"></i> Одобрить
          </button>
          <button class="btn btn-outline-danger" @click="rejectOrder">
            <i class="bi bi-x-circle"></i> Отклонить
          </button>
          <button class="btn btn-outline-warning" @click="deleteOrderAdmin">
            <i class="bi bi-trash"></i> Удалить заказ
          </button>
        </div>
        <div v-if="isUser" class="mt-4 d-flex gap-2">
          <button class="btn btn-outline-warning" @click="deleteOrder">
            <i class="bi bi-trash"></i> Удалить заказ
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
const isUser = computed(() => authStore.user?.role === 1)
const newMessage = ref('')

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  try {
    await api.post('/orders/send-message-to-chat', {
      message: newMessage.value,
      orderId: order.value.id,
    })

    newMessage.value = ''
    await fetchOrder() // перезагружаем заказ, чтобы получить новые сообщения
  } catch (err) {
    alert('Ошибка при отправке сообщения')
    console.error(err)
  }
}

const fetchOrder = async () => {
  try {
    const { id } = route.params
    const { data } = await api.get(`/orders/${id}`)
    order.value = data
  } catch (err) {
    console.error('Ошибка при загрузке заказа', err)
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('ru-RU')
}

const approveOrder = async () => {
  try {
    await api.patch(`/orders/approve/${order.value.id}`)
    alert('Заказ одобрен')
    await fetchOrder()
  } catch (err) {
    alert('Ошибка при одобрении заказа')
    console.error(err)
  }
}

const rejectOrder = async () => {
  try {
    await api.patch(`/orders/reject/${order.value.id}`)
    alert('Заказ отклонён')
    await fetchOrder()
  } catch (err) {
    alert('Ошибка при отклонении заказа')
    console.error(err)
  }
}

const deleteOrderAdmin = async () => {
  if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return

  try {
    await api.delete(`/orders/admin-remove/${order.value.id}`)
    alert('Заказ удалён')
    router.push('/orders-admin')
  } catch (err) {
    alert('Ошибка при удалении заказа')
    console.error(err)
  }
}

const deleteOrder = async () => {
  if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return

  try {
    await api.delete(`/orders/${order.value.id}`)
    alert('Заказ удалён')
    router.push('/orders')
  } catch (err) {
    alert('Ошибка при удалении заказа')
    console.error(err)
  }
}

onMounted(fetchOrder)
</script>
