<template>
  <div class="container mt-5">
    <div class="row g-4 justify-content-center">
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
            <p class="card-text mb-4">Управление заказчиками: создание и просмотр списка.</p>
            <div class="d-flex gap-3">
              <button class="btn btn-primary flex-fill" @click="goToCreateCustomer">
                Создать заказчика
              </button>
              <button class="btn btn-outline-primary flex-fill" @click="goToCustomers">
                Список заказчиков
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Аренда -->
      <div class="col-md-5">
        <div class="card h-100 shadow-lg rounded-4">
          <div class="card-body d-flex flex-column justify-content-between">
            <h3 class="card-title mb-3">Аренда</h3>
            <p class="card-text mb-4">Управление арендой автомобилей.</p>
            <div class="d-flex gap-3">
              <button class="btn btn-primary flex-fill" @click="goToBookings">Список аренд</button>
              <button class="btn btn-outline-primary flex-fill" @click="goToCreateBooking">
                Создать аренду
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToCreateCars = () => router.push('/cars/create')
const goToCarList = () => router.push('/cars')
const goToCustomers = () => router.push('/customers')
const goToCreateCustomer = () => router.push('/customers/create')
const goToBookings = () => router.push('/bookings')
const goToCreateBooking = () => router.push('/bookings/create')
</script>
