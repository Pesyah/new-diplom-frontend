<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Создание водителя</h2>
    <form @submit.prevent="submitForm" class="mx-auto" style="max-width: 600px">
      <div class="mb-3 row">
        <label class="col-sm-4 col-form-label">ФИО</label>
        <div class="col-sm-8">
          <input v-model="form.fullName" type="text" class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-4 col-form-label">Аватар (URL)</label>
        <div class="col-sm-8">
          <input v-model="form.avatar" type="text" class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-4 col-form-label">Телефон</label>
        <div class="col-sm-8">
          <input v-model="form.phone" type="text" class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-4 col-form-label">Дата рождения</label>
        <div class="col-sm-8">
          <input v-model="form.birthDate" type="date" class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-4 col-form-label">ID прав (через запятую)</label>
        <div class="col-sm-8">
          <input v-model="form.driverLicense" type="text" class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-4 col-form-label">Стаж (лет)</label>
        <div class="col-sm-8">
          <input v-model.number="form.experienceYears" type="number" class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-4 col-form-label">Доступен</label>
        <div class="col-sm-8 d-flex align-items-center">
          <input v-model="form.isAvailable" type="checkbox" class="form-check-input" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-4 col-form-label">В отпуске</label>
        <div class="col-sm-8 d-flex align-items-center">
          <input v-model="form.isOnLeave" type="checkbox" class="form-check-input" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-4 col-form-label">Зарплата</label>
        <div class="col-sm-8">
          <input v-model.number="form.salary" type="number" class="form-control" />
        </div>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-primary">Создать</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

const form = ref({
  fullName: '',
  avatar: '',
  phone: '',
  birthDate: '',
  driverLicense: '', // строка, например: "1, 2, 3"
  experienceYears: 0,
  isAvailable: false,
  isOnLeave: false,
  salary: 0,
})

const submitForm = async () => {
  try {
    const payload = {
      fullName: form.value.fullName,
      avatar: form.value.avatar,
      phone: form.value.phone,
      birthDate: new Date(form.value.birthDate).toISOString(),
      driverLicense: form.value.driverLicense.split(',').map((id: string) => Number(id.trim())),
      experienceYears: form.value.experienceYears,
      isAvailable: form.value.isAvailable,
      isOnLeave: form.value.isOnLeave,
      salary: form.value.salary,
    }

    await api.post('/drivers', payload)
    alert('Водитель создан!')
  } catch (err) {
    console.error(err)
    alert('Ошибка при создании')
  }
}
</script>
