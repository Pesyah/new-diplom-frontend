<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

interface Trailer {
  model: string
  productionDate: string
  condition: number
  isAvailable: boolean
  isUnderRepair: boolean
}

const route = useRoute()
const router = useRouter()
const id = route.params.id

const form = ref<Trailer>({
  model: '',
  productionDate: '',
  condition: 0,
  isAvailable: true,
  isUnderRepair: false,
})

const fetchTrailer = async () => {
  try {
    const res = await api.get(`/trailers/${id}`)
    const data = res.data
    form.value = {
      model: data.model,
      productionDate: data.productionDate.slice(0, 10),
      condition: data.condition,
      isAvailable: data.isAvailable,
      isUnderRepair: data.isUnderRepair,
    }
  } catch (err) {
    console.error('Ошибка загрузки прицепа:', err)
    alert('Не удалось загрузить прицеп')
    router.push('/trailers')
  }
}

onMounted(fetchTrailer)

const updateTrailer = async () => {
  try {
    await api.patch(`/trailers/${id}`, {
      ...form.value,
      productionDate: new Date(form.value.productionDate).toISOString(),
    })
    router.push('/trailers')
  } catch (err) {
    console.error('Ошибка обновления прицепа:', err)
    alert('Не удалось обновить прицеп')
  }
}
</script>

<template>
  <div class="container mt-4 text-light">
    <h2 class="mb-4">Редактирование прицепа</h2>
    <form @submit.prevent="updateTrailer" class="bg-dark p-4 rounded shadow">
      <div class="mb-3">
        <label class="form-label">Модель</label>
        <input v-model="form.model" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Дата выпуска</label>
        <input v-model="form.productionDate" type="date" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Состояние (0-100)</label>
        <input
          v-model.number="form.condition"
          type="number"
          min="0"
          max="100"
          class="form-control"
        />
      </div>
      <div class="form-check form-switch mb-3">
        <input
          v-model="form.isAvailable"
          class="form-check-input"
          type="checkbox"
          id="availableSwitch"
        />
        <label class="form-check-label" for="availableSwitch">Доступен</label>
      </div>
      <div class="form-check form-switch mb-4">
        <input
          v-model="form.isUnderRepair"
          class="form-check-input"
          type="checkbox"
          id="repairSwitch"
        />
        <label class="form-check-label" for="repairSwitch">В ремонте</label>
      </div>
      <button type="submit" class="btn btn-warning">Сохранить</button>
      <button type="button" class="btn btn-secondary ms-2" @click="router.back()">Отмена</button>
    </form>
  </div>
</template>
