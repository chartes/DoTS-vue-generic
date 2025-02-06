<template>
  <div class="home-mask" :class="homeCssClass">
    <!--<div v-if="isLoading" class="modal-wrapper">-->
      <!--<div class="modal-container" ref="target">-->
        <!--<div class="modal-header is-flex is-flex-direction-row">
          <span class="modal-header-section">Collection :</span>
          <span class="modal-header-title">{{ currentCollection.title }}</span>
        </div>-->
      <div class="tiles">
      <div class="tile page-header app-width-padding">
        <div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center wrapper">
          <div class="tile is-child">
            <div class="is-flex is-flex-direction-row title-tile">
              <p class="title">Editions électroniques de l'ENC</p>
              <!--<p class="header-baseline">
                <span>Position</span> : à l’origine, les positions prises et à défendre par
                l’élève, face au jury. Depuis, un résumé de la thèse soutenue.
              </p>-->
            </div>
          </div>
          <div class="wrapper">
            <div>
              <document-metadata
                :ispopup="false"
                :metadataprop="currentCollection"
                class="metadata-area app-width-margin"
                :key="currentCollection"
              />
            </div>
            <div class="toc-area app-width-margin" :class="tocCssClass">
              <div class="toc-area-header">
                <a href="#">Parcourir la collection </a>
                <!--<a href="#">Parcourir la collection </a>-->
                <a href="#" class="toggle-btn" v-on:click="toggleExpanded($event, collectionId)"></a>
              </div>
              <div v-if="componentTOC.length > 0"
                class="menu app-width-margin"
                :class="expandedById[collectionId] ? 'expanded': ''"
              >
                <!--<button
                  class="show-children"
                  @click="toggleExpanded(collectionId)"
                >
                  Parcourir la collection
                </button>-->
                <div v-if="expandedById[collectionId] && componentTOC.length > 0">
                  <CollectionTOC
                    :toc="componentTOC"
                    :margin="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <!--<div>
          <document-metadata
            :ispopup="false"
            :metadata="currentCollection"
            class="metadata-area app-width-margin"
          />
        </div>

        <div class="toc-area app-width-margin" :class="tocCssClass">
          <div class="toc-area-header">
            <a href="#">Parcourir la collection </a>
            <!- -<a href="#">Parcourir la collection </a>- ->
            <a href="#" class="toggle-btn" v-on:click="toggleExpanded($event, collectionId)"></a>
          </div>
          <div v-if="Object.keys(componentTOC).length > 0 && componentTOC.filter(item => item.identifier === collectionId)[0].member.length > 0"
            class="menu app-width-margin"
            :class="expandedById[collectionId] ? 'expanded': ''"
          >
            <!- -<button
              class="show-children"
              @click="toggleExpanded(collectionId)"
            >
              Parcourir la collection
            </button>- ->
            <div v-if="expandedById[collectionId] && componentTOC.filter(item => item.identifier === collectionId)[0].member.length > 0">
              <CollectionTOC
                :toc="componentTOC.filter(item => item.identifier === collectionId)[0].member"
                :margin="0"
              />
            </div>
          </div>
        </div>-->

      <!--</div>-->
    <!--</div>-->
    <div id="article" class="article app-width-margin">

      <h1>Cartulaires d'Île-de-France</h1>

        <p class="texte">Dans le cadre des projets de numérisation soutenus par la sous-direction
            des bibliothèques et de la documentation à la direction de l'Enseignement supérieur du
            ministère de l'Education nationale, de l'enseignement supérieur et de la recherche et
            dans une logique de mise à disposition des ressources de la bibliothèque de l'École
            nationale des chartes à un large public de chercheurs excédant le cercle restreint des
            élèves de l'École et des archivistes paléographes, nous avons proposé un premier choix
            de documents numérisés qui visent à compléter l'offre de la bibliothèque.</p>
        <p class="texte">Ce projet de numérisation a pour objectif de&nbsp;:</p>
        <ul>
            <li>faire connaître certains documents emblématiques de la bibliothèque et de l'École
                des chartes à un public élargi&nbsp;;</li>
            <li>faciliter pour tous les chercheurs la consultation de ces documents qui sont peu
                présents dans les fonds des bibliothèques de recherche françaises, en offrant un
                support de substitution&nbsp;;</li>
            <li>permettre la mise en œuvre d'une nouvelle méthode de recherche fondée sur un
                environnement numérique de travail.</li>
        </ul>
        <p class="texte">La spécificité de la bibliothèque de l'École des chartes, que reflètent les
            enseignements de l'École depuis son origine, est d'être axée sur les <em>éditions de
                sources</em>, en particulier les sources concernant l'histoire de France.</p>
        <p class="texte">A cet égard, l'ensemble que forment les éditions de cartulaires est
            particulièrement remarquable&nbsp;; les collections de la bibliothèque tendent depuis
            toujours à l'exhaustivité dans ce domaine.</p>
        <p class="texte">Au reste, c'est sur cette série que portent un grand nombre des demandes de
            consultation sur place par les chercheurs français ou étrangers. Il nous a donc paru
            important et urgent de donner à ces cartulaires un accès facilité et une plus grande
            visibilité, d'autant plus que nous ne pouvons que rarement satisfaire les demandes de
            prêt pour des éditions souvent anciennes (datant du XIX<sup>e</sup> siècle pour la
            plupart) et fragilisées en raison de leur fréquente manipulation, ainsi que de leur date
            d'édition (à un moment où des papiers de mauvaise qualité sont massivement utilisés pour
            l'édition).
        </p>
    </div>
  </div>
</template>

<script>
import { computed, inject, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router/index.js'

import DocumentMetadata from '@/components/DocumentMetadata.vue'
import { getMetadataFromApi } from '@/api/document.js'
import CollectionTOC from '@/components/CollectionTOC.vue'
import fetchMetadata from '@/composables/get-metadata.js'

function getSimpleObject (obj) {
  // console.log("getSimpleObject / obj", obj)
  let simpleObject = {}
  simpleObject = {
    identifier: obj.identifier ? obj.identifier : obj['@id'],
    citeType: obj['@type'] ? obj['@type'] : obj.citeType,
    title: obj.title,
    level: obj.level,
    link_type: obj.link_type,
    editorialLevelIndicator: obj.editorialLevelIndicator,
    totalChildren: obj.totalChildren,
    member: !obj.member ? obj.children : obj.member,
    parent: obj.parent,
    dublincore: obj.dublincore,
    extensions: obj.extensions
  }
  // console.log("getSimpleObject / simpleObject", simpleObject)
  return simpleObject
}
/* function findById (array, id) {
  for (const item of array) {
    if (item.identifier === id) return item
    if (item.children?.length) {
      const innerResult = findById(item.children, id)
      if (innerResult) return innerResult
    }
  }
}
function findDeep (array, id) {
  return array.some(function (item) {
    if (item.id === id) return item
    else if (item.children?.length) return findDeep(item.children, id)
  })
} */

export default {
  components: { CollectionTOC, DocumentMetadata },
  props: {
    collectionIdentifier: {
      type: String,
      required: true
    }
  },
  async setup (props) {
    const state = reactive({
      isTreeOpened: false
    })

    const layout = inject('variable-layout')

    const route = useRoute()

    const isLoading = ref(false)

    const collectionId = ref(props.collectionIdentifier)

    console.log('HelloWorld setup collectionId', collectionId.value)

    const componentTOC = ref([])

    const currentCollection = ref({})

    const getCurrentItem = async (route) => {
      console.log('HelloWorld getCurrentItem origin route', origin, route)
      /*
      let response = await getMetadataFromApi(collectionId.value)
      let formatedResponse = getSimpleObject(response)
      formatedResponse.member.forEach((m) => m.identifier = m['@id'])
      formatedResponse.member.forEach((m) => m.parent = collectionId.value)
      console.log("HelloWorld formatedResponse", formatedResponse)
      formatedResponse = {...formatedResponse, member: formatedResponse.member.map(m => {return getSimpleObject(m)})}
      Object.assign(currentCollection, formatedResponse)
      */
      const metadataResponse = await fetchMetadata(props.collectionIdentifier, 'Collection', route)
      console.log('HelloWorld metadataResponse', metadataResponse)
      let formatedResponse = getSimpleObject(metadataResponse)
      console.log('HelloWorld formatedResponse', formatedResponse)
      formatedResponse.member.forEach(m => { m.identifier = m['@id'] })
      formatedResponse.member.forEach(m => { m.parent = collectionId.value })
      console.log('HelloWorld formatedResponse', formatedResponse)
      formatedResponse = { ...formatedResponse, member: formatedResponse.member?.map(m => { return getSimpleObject(m) }) }
      currentCollection.value = formatedResponse
    }

    // componentTOC.value = [currentCollection.value]
    // console.log("HelloWorld currentCollection.value / componentTOC.value : ", currentCollection.value / componentTOC.value)

    console.log('HelloWorld componentTOC / collectionId : ', Object.fromEntries(componentTOC.value.map(col => [col.identifier, false])), componentTOC.value, collectionId, currentCollection)
    const target = ref(null)

    const expandedById = ref([])

    const toggleExpanded = async (event, collId) => {
      event.preventDefault()
      console.log('HelloWorld Modal toggleExpanded', componentTOC.value)
      if (componentTOC.value.length === 0) {
        const response = await getMetadataFromApi(collId)
        response.member.forEach(m => {
          m.identifier = m['@id']
        })
        response.member.forEach(m => {
          m.parent = collId
        })
        console.log('HelloWorld response', response, response.member.forEach(i => {
          i.identifier = i['@id']
        }))
        componentTOC.value = response.member
        console.log('HelloWorld componentTOC', componentTOC.value)
      }
      expandedById.value[collId] = !expandedById.value[collId]
      state.isTreeOpened = !state.isTreeOpened
      console.log('HelloWorld toggleExpanded after expandedById[collectionId] : ', collId, expandedById.value)
    }

    const homeCssClass = computed(() => {
      return state.isTreeOpened ? 'is-tree-opened' : ''
    })

    watch(
      router.currentRoute, async (newRoute, oldRoute) => {
        console.log('HelloWorld watch change in route : ', oldRoute, newRoute)
        if (newRoute === oldRoute) {
          console.log('HelloWorld watch no change in route')
        } else {
          isLoading.value = false
          console.log('HelloWorld watch route.params : ', newRoute.params)
          collectionId.value = props.collectionIdentifier
          console.log('HelloWorld watch collectionId.value : ', collectionId.value)
          await getCurrentItem(newRoute)
          console.log('HelloWorld currentCollection.value : ', currentCollection.value)
          if (currentCollection.value.member) {
            console.log('HelloWorld watch currentCollection.value.member : ', currentCollection.value.member)
            componentTOC.value = currentCollection.value.member
          }
          console.log('HelloWorld watch componentTOC.value : ', componentTOC.value, collectionId)
          // console.log('HelloWorld watch componentTOC.filter(item => item.identifier === collectionId)[0].member.length > 0 : ', componentTOC.value.filter(item => item.identifier === collectionId.value)[0].member.length > 0)
          // expandedById.value = Object.fromEntries(componentTOC.value.filter(item => item.identifier === collectionId.value).map(col => [col.identifier, false]))
          isLoading.value = true
        }
      }, { deep: true, immediate: true }
    )

    return {
      isLoading,
      route,
      homeCssClass,
      tocCssClass: layout.tocCssClass,
      getCurrentItem,
      target,
      collectionId,
      currentCollection,
      componentTOC,
      toggleExpanded,
      expandedById
    }
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-container {
  max-width: 1100px !important;
  margin: 150px auto;
  padding: 20px 30px;
  background-color: #fbf8f4;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  max-height: 60vh;
  overflow-y: auto;
  color: #4a4a4a;
}
.modal-header {
  display: flex;
  width: 100%;
  padding: 20px;
  background-color: #b8b5ad;
  border-radius: 6px;

  font-family: "Barlow Semi Condensed", sans-serif !important;
  font-size: 15px;
  font-weight: 500;
  line-height: 25px;
  letter-spacing: 0;
  text-transform: uppercase;
}
.modal-header span.modal-header-section {
  color: #4a4a4a;
}
.modal-header span.modal-header-title {
  margin-left: 40px;
  color: #161616;
  font-size: 18px;
  font-weight: 600;
  line-height: 25px;
  text-transform: none;
}

.modal-body {
  display: flex;
  width: 100%;
  padding: 20px;
  background-color: #e4e4e4;
  border-radius: 6px;
  position: relative;

  font-family: "Barlow Semi Condensed", sans-serif !important;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
}
.metadata-area {
  margin-top: 15px !important;
  margin-bottom: 15px !important;
}
.toc-area {
  width: 100%;
  font-family: "Barlow", sans-serif !important;
  margin-bottom: 30px !important;
}
.toc-area-header {
  display: flex;
  width: 100%;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 6px;
  position: relative;
}
.toc-area-header > a {
  text-transform: uppercase;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-weight: 500;
  color: #4a4a4a !important;
  text-decoration: none;
  border: none;
  &:first-child {
    text-transform: none;
    margin-left: auto;
    margin-right: 47px;
  }
}
.is-tree-opened .toc-area-header {
  border-radius: 6px 6px 0 0;
}

  .modal-body-header span.modal-body-header-section {
    margin-right: 40px;
  }
  .modal-body-header span.modal-body-header-title {
    color: #929292;
  }
.is-tree-opened .menu {
  display: flex;
  flex-direction: column;
  padding: 0px 20px 0px;
  /*border-top: solid 2px #fcfcfc;*/
  background-color: #e4e4e4;
  border-radius: 0 0 6px 6px;
}
ol {
  list-style: none;
}
/* toggle */
.toggle-btn {
  position: absolute;
  right: 20px;
  width: 27px;
  height: 27px;
  background: url(../assets/images/chevron_rouge.svg) center top -7px / cover no-repeat;
  border: none;
  text-decoration: none;
}
.is-tree-opened .toggle-btn {
  background: url(../assets/images/croix.svg) center / cover no-repeat;
}
#article {
  margin-bottom: 30px !important;
  padding: 10px 0 10px !important;
}
.wrapper {
  width: 100%;
}
.title-tile {
  margin-top: 30px !important;
  margin-bottom: 30px !important;
}
</style>
