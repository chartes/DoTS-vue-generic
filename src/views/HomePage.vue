<template>
  <main>
    <HelloWorld
      v-if="Object.keys(currCollection).length > 0"
      :collection-identifier="collectionId"
      :currentCollection="currCollection"
      :key="currCollection"
    />
  </main>
</template>

<script>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomePage',
  components: { HelloWorld },
  props: {
    collectionIdentifier: {
      type: String,
      required: true
    },
    currentCollection: {
      type: Object,
      required: true
    }
  },

  setup (props) {
    const route = useRoute()
    const collectionId = ref(props.collectionIdentifier)
    const currCollection = ref(props.currentCollection)
    console.log('HomePage setup props collectionIdentifier : ', props.collectionIdentifier)
    console.log('HomePage setup props currentCollection : ', props.currentCollection)
    /* if (route.params.collId) {
      collectionId.value = route.params.collId
    } */

    console.log('HomePage setup route / collectionId.value / currCollection.value : ', route, collectionId.value, currCollection.value)

    watch(props, (newProps) => {
      collectionId.value = newProps.collectionIdentifier
      currCollection.value = newProps.currentCollection
    }, { deep: true, immediate: true })

    return {
      route,
      collectionId,
      currCollection
    }
  }
}

</script>
