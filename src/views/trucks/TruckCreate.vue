<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const model = ref('')
const productionDate = ref('')
const condition = ref(0)
const odometer = ref(0)
const isAvailable = ref(true)
const isUnderRepair = ref(false)

const createTruck = async () => {
  try {
    await api.post('/trucks', {
      model: model.value,
      productionDate: new Date(productionDate.value).toISOString(),
      condition: condition.value,
      odometer: odometer.value,
      isAvailable: isAvailable.value,
      isUnderRepair: isUnderRepair.value,
    })
    router.push('/trucks')
  } catch (err) {
    console.error('Ошибка при создании грузовика:', err)
    alert('Не удалось создать грузовик.')
  }
}
</script>

<template>
  <div class="container mt-4 text-light">
    <h2 class="mb-4">Создание нового грузовика</h2>

    <form @submit.prevent="createTruck" class="bg-dark p-4 rounded shadow">
      <div class="mb-3">
        <label class="form-label">Модель</label>
        <input v-model="model" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Дата выпуска</label>
        <input v-model="productionDate" type="date" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Состояние (0-100)</label>
        <input v-model.number="condition" type="number" class="form-control" min="0" max="100" />
      </div>

      <div class="mb-3">
        <label class="form-label">Пробег (км)</label>
        <input v-model.number="odometer" type="number" class="form-control" min="0" />
      </div>

      <div class="form-check form-switch mb-3">
        <input
          v-model="isAvailable"
          class="form-check-input"
          type="checkbox"
          id="availableSwitch"
        />
        <label class="form-check-label" for="availableSwitch">Доступен</label>
      </div>

      <div class="form-check form-switch mb-4">
        <input v-model="isUnderRepair" class="form-check-input" type="checkbox" id="repairSwitch" />
        <label class="form-check-label" for="repairSwitch">В ремонте</label>
      </div>

      <button type="submit" class="btn btn-success">Создать</button>
      <button type="button" class="btn btn-secondary ms-2" @click="router.back()">Отмена</button>
    </form>
  </div>
</template>
