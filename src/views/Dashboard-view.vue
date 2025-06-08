<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToCreateCars = () => {
  router.push('/cars/create')
}

const goToCarList = () => {
  router.push('/cars')
}

const goToCustomers = () => {
  router.push('/customers')
}
</script>

<template>
  <div class="container mt-5">
    <h1 class="mb-5">Личный кабинет</h1>

    <div class="row justify-content-center gy-4">
      <!-- Машины -->
      <div class="col-md-5">
        <div class="card h-100 shadow-lg rounded-4">
          <div class="card-body d-flex flex-column justify-content-between">
            <h3 class="card-title mb-3">Машины</h3>
            <p class="card-text mb-4">Создание новых машин и просмотр списка.</p>
            <div class="d-flex gap-3">
              <button class="btn btn-primary flex-fill" @click="goToCreateCars">
                Создать машину
              </button>
              <button class="btn btn-outline-primary flex-fill" @click="goToCarList">
                Список машин
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Заказчики -->
      <div class="col-md-5">
        <div class="card h-100 shadow-lg rounded-4">
          <div class="card-body d-flex flex-column justify-content-between">
            <h3 class="card-title mb-3">Заказчики</h3>
            <p class="card-text mb-4">Управление заказчиками.</p>
            <button class="btn btn-primary w-100" @click="goToCustomers">
              Перейти к заказчикам
            </button>
          </div>
        </div>
      </div>

      <!-- Аренда -->
      <div class="col-md-5">
        <div class="card h-100 shadow-lg rounded-4">
          <div class="card-body d-flex flex-column justify-content-between">
            <h3 class="card-title mb-3">Аренда</h3>
            <p class="card-text mb-4">Функционал аренды в разработке.</p>
            <button class="btn btn-secondary w-100" disabled>В разработке</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  min-height: 250px;
}
</style>
