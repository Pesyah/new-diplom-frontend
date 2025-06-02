<template>
  <div class="container py-4">
    <h1 class="mb-4 text-white">Каталог продуктов</h1>

    <input
      type="text"
      class="form-control mb-4 bg-dark text-white border-secondary"
      v-model="searchQuery"
      placeholder="Поиск по названию..."
    />

    <div class="row g-3">
      <div class="col-md-12" v-for="product in filteredProducts" :key="product.id">
        <div
          class="card bg-dark text-white border border-secondary shadow-sm h-100"
          style="cursor: pointer"
          @click="goToDetail(product.id)"
        >
          <div class="card-body d-flex flex-column">
            <h5 class="card-title mb-1 text-truncate">{{ product.name }}</h5>
            <h6 class="card-subtitle mb-2 text-truncate text-light">
              {{ product.category.name }}
            </h6>

            <p
              class="card-text small flex-grow-1 overflow-hidden"
              style="max-height: 4.5em"
              :title="product.description"
            >
              {{
                product.description.length > 150
                  ? product.description.slice(0, 150) + '...'
                  : product.description
              }}
            </p>

            <div class="mt-2">
              <strong class="text-success">{{ product.price }} ₽</strong>
            </div>

            <button class="btn btn-success mt-2 text-white" @click.stop="addToCart(product)">
              Добавить в корзину
            </button>
            <div v-if="getCountInCart(product.id) > 0" class="mt-2 text-info">
              В корзине: {{ getCountInCart(product.id) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

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

const cartStore = useCartStore()
const addToCart = (product) => {
  cartStore.addToCart(product.id)
}
const getCountInCart = (productId) => {
  const item = cartStore.items.find((item) => item.product === productId)
  return item ? item.count : 0
}

const router = useRouter()
const goToDetail = (productId) => {
  router.push({ name: 'UserProductView', params: { id: productId } })
}

onMounted(fetchProducts)
</script>
