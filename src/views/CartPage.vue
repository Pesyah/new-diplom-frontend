<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Корзина</h1>

    <div v-if="cartItems.length">
      <ul>
        <li v-for="item in cartItems" :key="item.product" class="mb-2">
          <div class="flex justify-between items-center">
            <span> {{ getProductName(item.product) }} — {{ item.count }} шт. </span>
            <div>
              <button @click="changeCount(item.product, item.count - 1)">−</button>
              <button @click="changeCount(item.product, item.count + 1)">+</button>
              <button class="text-red-500" @click="removeItem(item.product)">Удалить</button>
            </div>
          </div>
        </li>
      </ul>

      <button class="mt-4 bg-green-600 px-4 py-2 rounded" @click="sendOrder">
        Отправить заказ
      </button>

      <button class="mt-4 bg-blue-600 px-4 py-2 rounded" @click="goToProducts">
        Выбрать продукты
      </button>
    </div>
    <div v-else>
      Корзина пуста
      <button class="mt-4 bg-blue-600 px-4 py-2 rounded" @click="goToProducts">
        Выбрать продукты
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { onMounted, ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const cartStore = useCartStore()
const cartItems = cartStore.items
const router = useRouter()

const products = ref<{ id: string; name: string }[]>([])

onMounted(async () => {
  const { data } = await api.get('/products')
  products.value = data
})

const getProductName = (productId: string) => {
  const product = products.value.find((p) => p.id === productId)
  return product ? product.name : '???'
}

const changeCount = (productId: string, count: number) => {
  if (count < 1) return
  cartStore.changeCount(productId, count)
}

const removeItem = (productId: string) => {
  cartStore.removeItem(productId)
}

const sendOrder = async () => {
  console.log(authStore)
  if (!authStore.access_token) {
    // Пользователь не залогинен
    const goToLogin = confirm(
      'Для отправки заказа нужно войти в систему. Перейти на страницу авторизации?',
    )
    if (goToLogin) {
      router.push('/login')
    }
    return
  }

  try {
    await api.post('/orders', {
      orderPart: cartItems.map(({ product, count }) => ({ product, count })),
    })
    alert('Заказ отправлен!')
    cartStore.clearCart()
  } catch (err) {
    alert('Ошибка при отправке заказа')
    console.error(err)
  }
}

const goToProducts = () => {
  router.push('/products')
}
</script>
