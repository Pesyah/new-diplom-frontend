<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  passportNumber: '',
  passportDate: '',
  passportIssued: '',
  passportAddress: '',
  passportCode: '',
  name: '',
  surname: '',
  lastName: '',
  phone: '',
  address: '',
})

const submit = async () => {
  try {
    await api.post('/customers', form.value)
    alert('Заказчик успешно создан')
    router.push('/customers')
  } catch (err) {
    console.error(err)
    alert('Ошибка при создании заказчика')
  }
}
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-3">Создание заказчика</h1>
    <form @submit.prevent="submit">
      <div v-for="(value, key) in form" :key="key" class="mb-3">
        <label class="form-label">{{ key }}</label>
        <input v-model="form[key]" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Создать</button>
    </form>
  </div>
</template>
