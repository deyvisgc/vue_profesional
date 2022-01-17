<template>
  <header class="bg-white py-5 shadow">
    <div class="container">
      <div class="flex items-center justify-between flex-wrap">
        <div class="flex items-center flex-no-shrink mr-6">
          <a
            class="text-black hover:text-grey-darkest no-underline font-semibold text-lg"
            href="#">Platzi Rooms</a>
        </div>
        <div class="flex items-center w-auto">
          <CurrentUsers>
            <template slot-scope="{user}">
            <div class="items__controls">
              <div class="flex" v-if="user">
                <router-link :to="{name: 'CreateHousePage'}" class="mr-2 flex items-center">
                  <i class="material-icons">add</i>
                </router-link>
                <button class="mr-4 flex items-center">
                  <i class="material-icons">notifications</i>
                </button>
                <div class="flex items-center mr-4">
                  <img class="w-8 h-8 rounded-full mr-2" src="https://avatars2.githubusercontent.com/u/1901273?s=460&v=4" alt="Avatar of Javier Diaz">
                  <div class="text-sm">
                    <p class="text-black leading-none">{{user.userName}}</p>
                    <p class="text-grey-dark">Online</p>
                  </div>
                </div>
                <button class="flex items-center mr-4" @click.prevent="logOut">
                    <i class="material-icons">exit_to_app</i>
                  </button>
              </div>
              <div v-else>
                <button class="btn__outline btn__outline--teal rounded mr-2" @click.prevent="getLogin">Login</button>
                <button class="bg-yellow-dark text-yellow-darker font-semibold py-2 px-4 rounded" @click.prevent="register">Register</button>
              </div>
            </div>
            </template>
          </CurrentUsers>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import CurrentUsers from '@/components/Current_Users'
export default {
  name: 'HeaderPartial',
  components: {
    CurrentUsers
  },
  methods: {
    getLogin() {
      // aqui llamo a la accion del store que tiene como nombre TOGGLE_MODAL_STATE y le paso el nombre y el valor
      this.$store.dispatch('TOGGLE_MODAL_STATE', {
        name: 'login',
        value: true,
      });
    },
    register() { // aqui llamo a la accion del store que tiene como nombre TOGGLE_MODAL_CREATE_STATE y le paso el nombre y el valor
      this.$store.dispatch('TOGGLE_MODAL_CREATE_STATE', {
        name: 'register',
        value: true,
      });
    },
    logOut() {
      this.$store.dispatch('LOG_OUT')
    }
  },
};
</script>
