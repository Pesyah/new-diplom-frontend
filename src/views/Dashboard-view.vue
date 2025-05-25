<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/services/api'

interface UserInfo {
  name: string
  surname: string
  phone: string
  avatar: string
}

const userInfo = ref<UserInfo | null>(null)

const fetchUserInfo = async () => {
  try {
    const response = await api.get('auth/user-info')
    userInfo.value = response.data
  } catch (e) {
    console.error('Ошибка при загрузке информации о пользователе', e)
  }
}

onMounted(fetchUserInfo)
</script>

<template>
  <div class="dashboard container mt-5 text-light">
    <h1 class="mb-4">Личный кабинет</h1>

    <div v-if="userInfo" class="card bg-dark text-light p-4">
      <div class="text-center mb-4" v-if="userInfo.avatar">
        <img
          :src="userInfo.avatar"
          alt="Аватар"
          class="rounded-circle"
          style="width: 120px; height: 120px; object-fit: cover"
        />
      </div>
      <p><strong>Имя:</strong> {{ userInfo.name }}</p>
      <p><strong>Фамилия:</strong> {{ userInfo.surname }}</p>
      <p><strong>Телефон:</strong> {{ userInfo.phone }}</p>
    </div>

    <div v-else class="text-center mt-5">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
  </div>
</template>
