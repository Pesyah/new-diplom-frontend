<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
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

const fieldLabels = {
  passportNumber: 'Номер паспорта',
  passportDate: 'Дата выдачи паспорта',
  passportIssued: 'Кем выдан паспорт',
  passportAddress: 'Адрес регистрации',
  passportCode: 'Код подразделения',
  name: 'Имя',
  surname: 'Фамилия',
  lastName: 'Отчество',
  phone: 'Телефон',
  address: 'Фактический адрес',
}
const today = new Date().toISOString().split('T')[0] // формат YYYY-MM-DD

onMounted(async () => {
  try {
    const { data } = await api.get(`/customers/by-id/${route.params.id}`)

    // Преобразуем дату к нужному формату
    if (data.passportDate) {
      const date = new Date(data.passportDate)
      data.passportDate = date.toISOString().split('T')[0]
    }

    form.value = { ...form.value, ...data }
  } catch (err) {
    console.error(err)
    alert('Ошибка загрузки заказчика')
  }
})

const update = async () => {
  try {
    const body = form.value
    delete body['created_at']
    delete body['id']
    await api.patch(`/customers/${route.params.id}`, form.value)
    alert('Данные обновлены')
    router.push('/customers')
  } catch (err) {
    console.error(err)
    alert('Ошибка при обновлении')
  }
}
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-3">Редактирование заказчика</h1>
    <form @submit.prevent="update" v-if="form">
      <div v-for="(label, key) in fieldLabels" :key="key" class="mb-3">
        <label class="form-label" :for="key">{{ label }}</label>

        <input
          v-if="key === 'passportDate'"
          v-model="form[key]"
          type="date"
          class="form-control"
          :id="key"
          :max="today"
        />

        <input v-else v-model="form[key]" type="text" class="form-control" :id="key" />
      </div>
      <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>
  </div>
</template>
