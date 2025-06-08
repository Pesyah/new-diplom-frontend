<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const form = ref(null)

onMounted(async () => {
  try {
    const { data } = await api.get(`/customers/by-id/${route.params.id}`)
    form.value = data
  } catch (err) {
    console.error(err)
    alert('Ошибка загрузки заказчика')
  }
})

const update = async () => {
  try {
    await api.patch(`/customers/${route.params.id}`, form.value)
    alert('Данные обновлены')
  } catch (err) {
    console.error(err)
    alert('Ошибка при обновлении')
  }
}
</script>

<template>
  <div class="container mt-4" v-if="form">
    <h1 class="mb-3">Редактирование заказчика</h1>
    <form @submit.prevent="update">
      <div
        v-for="(value, key) in form"
        :key="key"
        class="mb-3"
        v-if="key !== 'id' && key !== 'created_at'"
      >
        <label class="form-label">{{ key }}</label>
        <input v-model="form[key]" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>
  </div>
</template>
