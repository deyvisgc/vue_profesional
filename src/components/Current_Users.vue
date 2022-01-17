<template>
    <div class="current-users">
        <slot :user="user"></slot>
    </div>
</template>
<script>
// mapGetters es un helper que nos permite obtener la informacion de los geters de los estados del store
import {mapGetters} from 'vuex'
export default {
    name: 'CurrentUsers',
    computed: {
        ...mapGetters({
        user: 'authUsers'
    })
  }
}
</script>