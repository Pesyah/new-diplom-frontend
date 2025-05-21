<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const name = ref('')
const surname = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')

const authStore = useAuthStore()
const router = useRouter()

const register = async () => {
  const res: any = await authStore.register({
    name: name.value,
    surname: surname.value,
    phone: phone.value,
    email: email.value,
    password: password.value,
  })

  if (res.status !== 201) {
    alert('Ошибка регистрации.\n' + res.message)
  } else {
    alert('Регистрация прошла успешно!')
    router.push('/login')
  }
}
</script>

<template>
  <div style="margin: 10% auto; width: 30%; padding: 20px">
    <h1>Регистрация</h1>
    <input v-model="name" placeholder="Имя" class="input" />
    <input v-model="surname" placeholder="Фамилия" class="input" />
    <input v-model="phone" placeholder="Телефон" class="input" />
    <input v-model="email" placeholder="Email" class="input" />
    <input v-model="password" type="password" placeholder="Пароль" class="input" />
    <button class="btn btn-primary" @click="register">Зарегистрироваться</button>
  </div>
</template>

<style scoped>
.input {
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
  font-size: 18px;
}
</style>
