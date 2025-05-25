<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

interface Driver {
  fullName: string
  avatar: string
  phone: string
  birthDate: string
  driverLicense: string[] // массив id в виде строк
  experienceYears: number
  isAvailable: boolean
  isOnLeave: boolean
  salary: number
}

const route = useRoute()
const router = useRouter()
const id = route.params.id

const form = ref<Driver>({
  fullName: '',
  avatar: '',
  phone: '',
  birthDate: '',
  driverLicense: [],
  experienceYears: 0,
  isAvailable: false,
  isOnLeave: false,
  salary: 0,
})

const fetchDriver = async () => {
  const res = await api.get(`/drivers/${id}`)
  const data = res.data

  form.value = {
    ...data,
    driverLicense: Array.isArray(data.driverLicense)
      ? data.driverLicense.map((id: any) => String(id))
      : [],
  }
}

onMounted(fetchDriver)

const updateDriver = async () => {
  const payload = {
    ...form.value,
    driverLicense: form.value.driverLicense.map((id) => Number(id)), // преобразуем обратно
  }
  delete payload['id']
  delete payload['created_at']
  delete payload['updated_at']
  await api.patch(`/drivers/${id}`, payload)
  router.push('/drivers')
}
</script>

<template>
  <div class="container mt-5">
    <h2 class="mb-4">Редактировать водителя</h2>

    <form @submit.prevent="updateDriver">
      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">ФИО</label>
        <div class="col-sm-10">
          <input v-model="form.fullName" class="form-control" required />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">Аватар (URL)</label>
        <div class="col-sm-10">
          <input v-model="form.avatar" class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">Телефон</label>
        <div class="col-sm-10">
          <input v-model="form.phone" class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">Дата рождения</label>
        <div class="col-sm-10">
          <input v-model="form.birthDate" type="date" class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">ID прав (через запятую)</label>
        <div class="col-sm-10">
          <input
            v-model="form.driverLicense"
            class="form-control"
            placeholder="1,2,3"
            @input="form.driverLicense = ($event.target as HTMLInputElement).value.split(',')"
          />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">Стаж (лет)</label>
        <div class="col-sm-10">
          <input v-model.number="form.experienceYears" type="number" class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">Доступен</label>
        <div class="col-sm-10 d-flex align-items-center">
          <input type="checkbox" v-model="form.isAvailable" class="form-check-input" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">В отпуске</label>
        <div class="col-sm-10 d-flex align-items-center">
          <input type="checkbox" v-model="form.isOnLeave" class="form-check-input" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">Зарплата</label>
        <div class="col-sm-10">
          <input v-model.number="form.salary" type="number" class="form-control" />
        </div>
      </div>

      <div class="text-end">
        <button style="margin-right: 13vw" class="btn btn-danger" @click="router.push('/drivers')">
          Назад
        </button>
        <button type="submit" class="btn btn-success">Сохранить</button>
      </div>

      <div class="text-end"></div>
    </form>
  </div>
</template>
