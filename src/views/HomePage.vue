<template>
  <main>
    <HelloWorld :collection-identifier="collectionId"/>
  </main>
</template>

<script>
import { useRoute } from 'vue-router'
import { ref } from 'vue'

import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomePage',
  components: { HelloWorld },

  setup () {
    const route = useRoute()
    const collectionId = ref('')

    if (route.params.collId) {
      collectionId.value = route.params.collId
    } else if (route.fullPath === '/') {
      collectionId.value = 'elec'
    }

    console.log('HomePage setup route : ', route)

    return {
      route,
      collectionId
    }
  }
}

</script>
