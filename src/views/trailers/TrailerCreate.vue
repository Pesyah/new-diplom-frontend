<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const form = ref({
  model: '',
  productionDate: '',
  condition: 0,
  isAvailable: true,
  isUnderRepair: false,
})

const createTrailer = async () => {
  try {
    await api.post('/trailers', {
      model: form.value.model,
      productionDate: new Date(form.value.productionDate).toISOString(),
      condition: form.value.condition,
      isAvailable: form.value.isAvailable,
      isUnderRepair: form.value.isUnderRepair,
    })
    router.push('/trailers')
  } catch (err) {
    console.error('Ошибка создания прицепа:', err)
    alert('Не удалось создать прицеп')
  }
}
</script>

<template>
  <div class="container mt-4 text-light">
    <h2 class="mb-4">Создание нового прицепа</h2>
    <form @submit.prevent="createTrailer" class="bg-dark p-4 rounded shadow">
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
      <button type="submit" class="btn btn-success">Создать</button>
      <button type="button" class="btn btn-secondary ms-2" @click="router.back()">Отмена</button>
    </form>
  </div>
</template>
