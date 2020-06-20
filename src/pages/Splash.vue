<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <lottie-animation
          :width="300"
          :loop="false"
          path="statics/animations/food.json"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import LottieAnimation from 'lottie-vuejs/src/LottieAnimation.vue'

export default {
  name: 'PageSplash',
  components: { LottieAnimation },
  mounted () {
    window.setTimeout(() => {
      this.$router.replace({ name: 'app/index' })
    }, 5500)
  }
}
</script>
