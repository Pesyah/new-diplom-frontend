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

onMounted(async () => {
  try {
    const { data } = await api.get(`/customers/by-id/${route.params.id}`)
    form.value = { ...form.value, ...data } // Заполняем существующими значениями
  } catch (err) {
    console.error(err)
    alert('Ошибка загрузки заказчика')
  }
})

const update = async () => {
  try {
    const body = form.value
    console.log(body)
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
        <label class="form-label">{{ label }}</label>
        <input v-model="form[key]" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>
  </div>
</template>
