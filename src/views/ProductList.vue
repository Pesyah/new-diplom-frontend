<template>
  <div class="p-4">
    <!-- Поиск -->
    <input
      v-model="searchQuery"
      placeholder="Поиск продуктов"
      class="border px-2 py-1 mb-4 w-full"
    />

    <!-- Список продуктов -->
    <div v-if="filteredProducts.length">
      <ul>
        <li
          v-for="product in filteredProducts"
          :key="product.id"
          class="flex justify-between items-center border-b py-2"
        >
          <span>{{ product.name }}</span>
          <button class="bg-blue-500 text-white px-2 py-1 rounded" @click="addToCart(product)">
            Добавить в корзину
          </button>
        </li>
      </ul>
    </div>
    <div v-else>Продукты не найдены.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const products = ref([])
const searchQuery = ref('')

const filteredProducts = computed(() =>
  products.value.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
)

const fetchProducts = async () => {
  try {
    const { data } = await api.get('/products')
    products.value = data
  } catch (err) {
    console.error('Ошибка при загрузке продуктов:', err)
  }
}

// Вместо локального cart тут будет вызов на добавление в глобальный cart-store
import { useCartStore } from '@/stores/cart'
const cartStore = useCartStore()

const addToCart = (product) => {
  cartStore.addItem(product.id)
}

onMounted(fetchProducts)
</script>
