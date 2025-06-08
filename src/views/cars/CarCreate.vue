<template>
  <div class="container mt-4">
    <h2>Создание машины</h2>
    <form @submit.prevent="createCar" class="mt-3">
      <div class="mb-3">
        <label class="form-label">Марка</label>
        <select v-model="form.carsMark" class="form-select" required>
          <option v-for="mark in marks" :key="mark.id" :value="mark.id">{{ mark.name }}</option>
        </select>
        <div class="form-text">
          Нет нужной марки? <a href="#" @click.prevent="showMarkModal = true">Добавить</a>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Название модели</label>
        <input v-model="form.name" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Пробег (км)</label>
        <input v-model.number="form.odometer" type="number" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Цена за сутки (₽)</label>
        <input v-model.number="form.pricePerDay" type="number" class="form-control" required />
      </div>

      <button type="submit" class="btn btn-primary">Создать</button>
    </form>

    <!-- Модалка добавления марки -->
    <div
      v-if="showMarkModal"
      class="modal fade show d-block"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Добавить марку</h5>
            <button type="button" class="btn-close" @click="showMarkModal = false"></button>
          </div>
          <div class="modal-body">
            <input v-model="newMark" type="text" class="form-control" placeholder="Введите марку" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showMarkModal = false">Отмена</button>
            <button class="btn btn-success" @click="createMark">Добавить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  carsMark: '',
  name: '',
  odometer: 0,
  pricePerDay: 0,
})

const marks = ref([])
const showMarkModal = ref(false)
const newMark = ref('')

const fetchMarks = async () => {
  const res = await api.get('/cars/cars-mark')
  marks.value = res.data
}

const createMark = async () => {
  if (!newMark.value) return
  await api.post('/cars/cars-mark', { name: newMark.value })
  await fetchMarks()
  showMarkModal.value = false
  newMark.value = ''
}

const createCar = async () => {
  await api.post('/cars', form.value)
  router.push('/cars') // список
}

onMounted(fetchMarks)
</script>
