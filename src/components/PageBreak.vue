<template>
  <aside class="media pb-component">
    <article class="pb">
      <div class="pb-label">
        <a :href="imageInfo"></a>
      </div>
      <div><img class="pb-thumnbail" @click.prevent="goToCanvas()" :src="thumbnail" /></div>
    </article>
  </aside>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'PageBreak',

  props: ['canvasId', 'canvasNum', 'image'],

  setup (props) {
    const mirador = inject('mirador')
    const layout = inject('variable-layout')

    const goToCanvas = function () {
      if (mirador) {
        console.log(props.canvasId)
        mirador.setCanvasId(props.canvasId)
        // if (layout.miradorVisible != true) {
        // layout.setMiradorVisible(true);
        layout.changeViewMode('text-and-images-mode')
        // }
      }
    }

    const thumbnail = `${props.image.replace(
      '/full/full/0/default.jpg',
      '/full/60,/0/default.jpg'
    )}`
    const imageInfo = `${props.image.replace('/full/full/0/default.jpg', '')}`

    return {
      goToCanvas,
      thumbnail,
      imageInfo
    }
  }
}
</script>

<style>
.pb-component {
  position: relative;
  float: left;
}
.pb {
  position: absolute;
  left: -80px;
}
.pb-component:hover {
  cursor: pointer;
}
.pb-thumnbail {
  max-width: 60px;
}
.pb-label {
  font-size: large;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
