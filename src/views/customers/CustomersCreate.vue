<script setup lang="ts">
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

const labels: Record<string, string> = {
  passportNumber: 'Номер паспорта',
  passportDate: 'Дата выдачи паспорта',
  passportIssued: 'Кем выдан паспорт',
  passportAddress: 'Адрес регистрации по паспорту',
  passportCode: 'Код подразделения',
  name: 'Имя',
  surname: 'Фамилия',
  lastName: 'Отчество',
  phone: 'Телефон',
  address: 'Адрес проживания',
}

const masks: Record<string, string | null> = {
  passportNumber: '#### ######',
  passportDate: '####-##-##',
  passportIssued: null,
  passportAddress: null,
  passportCode: '###-###',
  name: null,
  surname: null,
  lastName: null,
  phone: '+7 (###) ###-##-##',
  address: null,
}

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
    <h1 class="mb-4">Создание заказчика</h1>
    <form @submit.prevent="submit">
      <div v-for="(value, key) in form" :key="key" class="mb-2">
        <label class="form-label" :for="key">{{ labels[key] }}</label>
        <input
          v-if="masks[key]"
          v-model="form[key]"
          v-mask="masks[key]"
          type="text"
          class="form-control"
          :id="key"
          :placeholder="labels[key]"
          autocomplete="off"
        />
        <input
          v-else
          v-model="form[key]"
          type="text"
          class="form-control"
          :id="key"
          :placeholder="labels[key]"
          autocomplete="off"
        />
      </div>
      <button type="submit" class="btn btn-primary mt-3">Создать</button>
    </form>
  </div>
</template>
