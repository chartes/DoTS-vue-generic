<template>
  <div class="is-flex is-flex-direction-column" :class="viewModeCssClass"><!-- v-if="!isModalOpened" -->
    <CollectionModal
      class="modal-area"
      v-if="isLoading && isModalOpened"
      :isOpen="isModalOpened ? isModalOpened : false"
      :collectionId="selectedCollectionId"
      :currentItem="selectedCollection"
      :toc="flatTOC"
      @change="closeModal"
    >
    </CollectionModal>
    <!--<ModalDocumentMetadata
      v-if="isLoading && isMetadataOpened && metadata"
      :isOpen="isMetadataOpened"
      :metadata="metadata"
      class="metadata-area app-width-margin"
      @changeMetadata="closeMetadata"
    >
    </ModalDocumentMetadata>-->
    <!--<div class="arianetop app-width-margin">
      <ul class="is-flex is-flex-direction-row crumbstop">
        <li
          v-for="(item, index) in ancestors.value" :key="index"
          :class="item.length > 1 ? 'several-parent-top' : ''"
        >
          <template v-for="ancestor in item">
            <router-link
              v-if="ancestor.citeType === 'Collection' && ancestor.level === ancestors.value[0][0].level"
              :class="item.length > 1 ? 'several-parent' : refId ? ancestor.identifier === refId ? 'is-current' : '' : ancestor.identifier === resourceId ? 'is-current' : ''"
              :to="{ name: 'Home', params: {collId: ancestor.identifier} }"
              >
              {{ ancestor.title }}
            </router-link>
            <a
              v-else-if="ancestor.citeType === 'Collection'"
              href="#"
              :class="item.length > 1 ? 'several-parent-top' : refId ? ancestor.identifier === refId ? 'is-current' : '' : ancestor.identifier === resourceId ? 'is-current' : ''"
              v-on:click="toggleCollection($event, ancestor.router)">
              {{ ancestor.title }}
            </a>
            <router-link
              v-else
              :class="item.length > 1 ? 'several-parent' : refId ? ancestor.identifier === refId ? 'is-current' : '' : ancestor.identifier === resourceId ? 'is-current' : ''"
              :to="ancestor.router"
              >
              {{ ancestor.title }}
            </router-link>
          </template>
        </li>
      </ul>
      <a href="#" class="toggle-btn" v-on:click="toggleMetadata($event)"></a>
    </div>-->
    <div v-if="parentCollectionId">
      <!--<liste-these-annee
        v-if="parentCollectionId"
        class="liste-theses-area app-width-padding"
        :id="parentCollectionId"
        :textid="resourceId"
        :toc="flatTOC"
      />-->
      <document-metadata
        :ispopup="false"
        :metadata="metadata"
        class="metadata-area app-width-margin"
      />
    </div>
    <div class="toc-area app-width-margin" :class="tocCssClass">
      <div class="toc-area-header">
        <a href="#" v-on:click="toggleTOCContent">Sommaire</a>
        <a href="#" class="toggle-btn" v-on:click="toggleTOCContent"></a>
      </div>
      <div class="toc-area-content toc-content">
        <aside id="aside">
          <nav>
            <nav>
              <TOC
               :toc="topTOC"
               :maxcitedepth="TOC_DEPTH"
               @update-ref-id="getNewRefId"
               :refid="refId"
               :key="refId"
              />
            </nav>
          </nav>
        </aside>
      </div>
    </div>
    <nav class="controls is-flex app-width-margin">
      <a
        href=""
        @click="toggleTOCMenu"
        class="toc-menu-toggle"
        :class="currentLevelIndicator !== 'toEdit' ? 'hideAsideToc' : TOCMenuBtnCssClass"
        >Sommaire</a
      >
      <ul class="is-flex">
        <li>
          <a
            href=""
            class="text-btn"
            aria-label="texte seul"
            @click="changeViewMode($event, 'text-mode')"
          ></a>
        </li>
        <li>
          <a
            href=""
            class="text-images-btn"
            aria-label="texte et images"
            @click="changeViewMode($event, 'text-and-images-mode')"
          ></a>
        </li>
        <li>
          <a
            href=""
            class="images-btn"
            aria-label="images seules"
            @click="changeViewMode($event, 'images-mode')"
          ></a>
        </li>
      </ul>
      <ul class="is-flex">
        <li>
          <a
            v-if="metadata.downloadPDF"
            target="_blank"
            v-bind:href="metadata.downloadPDF"
            class="pdf-btn"
            aria-label="Télécharger le PDF"
          />
        </li>
        <li>
          <a
            v-if="metadata.downloadXML"
            target="_blank"
            v-bind:href="metadata.downloadXML"
            class="xml-btn"
            aria-label="Télécharger le XML"
          />
        </li>
        <li>
          <a
            v-if="metadata.thenca"
            target="_blank"
            v-bind:href="metadata.thenca"
            class="access_link"
          >Accès à la thèse
          </a>
        </li>
      </ul>
    </nav>
    <div class="navigation-row app-width-margin">
      <div class="ariane-collection">
        <ul class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center crumbs">
          <li
            v-for="(item, index) in arianeCollection.value" :key="index"
            :class="item.length > 1 ? 'several-parent' : refId ? item[0].identifier === refId ? 'is-current' : '' : item[0].identifier === resourceId ? 'is-current' : ''"
          >
            <template v-for="ancestor in item">
              <router-link
                v-if="ancestor.level === arianeCollection.value[0][0].level"
                :to="{ name: 'Home', params: {collId: ancestor.identifier} }"
                >
                {{ ancestor.title }}
              </router-link>
              <a
                v-else
                href="#"
                v-on:click="toggleCollection($event, ancestor.router)"
              >
                {{ ancestor.title }}
              </a>
            </template>
          </li>
        </ul>
      </div>

      <div class="navigation-document">
        <div class="ariane">
          <ul class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center crumbs">
            <li
              v-for="(ancestor, index) in arianeDocument.value" :key="index"
              :class="refId ? ancestor.identifier === refId ? 'is-current' : '' : ancestor.identifier === resourceId ? 'is-current' : ''"
            >
                <router-link
                  :to="ancestor.router"
                  >
                    <span class="left" v-html="setText(ancestor.title ? ancestor.title : ancestor.dublincore?.title ? ancestor.dublincore?.title : 'fragment courant sans titre' ).left"></span>
                    <span class="right" v-html="setText( ancestor.title ? ancestor.title : ancestor.dublincore?.title ? ancestor.dublincore?.title : 'fragment courant sans titre' ).right"></span>
                </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="navigation-document-top">
        <to-previous-button
          class="to-previous-button-page-top"
          :class="!refId || firstRef ? 'disabled' : ''"
          :refid="refId"
          :previousrefid="previousRefId"
          :previousreftitle="previousRefTitle"
          @click="getNewRefId"
          :key="resourceId + refId"
        />
        <to-next-button
          class="to-next-button-page-top"
          :class="!refId || lastRef ? 'disabled' : ''"
          :refid="refId"
          :nextrefid="nextRefId"
          :nextreftitle="nextRefTitle"
          @click="getNewRefId"
          :key="resourceId + refId"
        />
      </div>

    </div>
    <div class="document-area is-flex app-width-margin" :class="tocMenuCssClass">
      <div class="toc-area-aside toc-content"><!-- id="toc-area-aside" -->
        <aside id="aside">
          <nav>
            <nav>
              <TOC
               :toc="asideTOC.value"
               :maxcitedepth="TOC_DEPTH"
               @update-ref-id="getNewRefId"
               :refid="refId"
              />
            </nav>
          </nav>
        </aside>
      </div>
      <div class="document-views is-flex" v-if="isLoading">
        <div v-if="!refId || refId && refId.length === 0" class="text-view" id="text-view">
          <document
            :id="resourceId"
            :level="currentLevel"
            :editorialLevelIndicator="currentLevelIndicator"
            :editoriallevel="editorialLevel"
            :documenttype="documentType"
            :asidetoc="asideTOC.value"
            :maxcitedepth="TOC_DEPTH"
            :key="resourceId + currentLevelIndicator"
          />
        </div>
        <div v-else class="text-view" id="text-view">
          <document
            :id="resourceId + '&ref=' + refId"
            :level="currentLevel"
            :editorialLevelIndicator="currentLevelIndicator"
            :editoriallevel="editorialLevel"
            :documenttype="documentType"
            :asidetoc="asideTOC.value"
            :maxcitedepth="TOC_DEPTH"
            :key="refId + editorialLevel"
          />
        </div>
        <div class="mirador-view" id="mirador-view" :style="miradorViewCssStyle">
          <div id="vue-mirador-container" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Document from "@/components/Document.vue"
import TOC from "@/components/TOC.vue"
import ToPreviousButton from "@/components/ToPreviousButton.vue"
import ToNextButton from "@/components/ToNextButton.vue"
import ListeTheseAnnee from "@/components/ListeTheseAnnee.vue"
import DocumentMetadata from "@/components/DocumentMetadata.vue"
import ModalDocumentMetadata from "@/components/ModalDocumentMetadata.vue"
import CollectionModal from "@/components/CollectionModal.vue"

import { useStore } from 'vuex'
import useMirador from "@/composables/use-mirador"
import { getMetadataFromApi, getParentFromApi, getTOCFromApi } from "@/api/document"

import {
  computed,
  onMounted,
  onUnmounted,
  watch,
  reactive,
  provide,
  ref,
  inject, nextTick
} from "vue"

import { onBeforeRouteUpdate, useRoute } from "vue-router"
import router from "@/router/index.js";
import fetchMetadata from "@/composables/get-metadata.js";


const PROJECT = `${import.meta.env.VITE_APP_PROJECT}`

const sources = [
  { name: "databnf", ext: "data.bnf.fr", type: "author_link" },
  { name: "dbpedia", ext: "dbpedia.org", type: "author_link" },
  { name: "idref", ext: "idref.fr", type: "author_link" },
  { name: "cataloguebnf", ext: "catalogue.bnf.fr", type: "author_link" },
  { name: "wikidata", ext: "wikidata", type: "author_link" },
  { name: "wikipedia", ext: "wikipedia", type: "author_link" },
  { name: "thenca", ext: "thenca", type: "document_link" },
  { name: "hal", ext: "hal", type: "document_link" },
  { name: "benc", ext: "koha", type: "document_link" },
  { name: "sudoc", ext: "sudoc.fr", type: "document_link" },
  { name: "biblissima", ext: "biblissima.fr", type: "document_link" },
  { name: "creativecommons", ext: "creativecommons.org", type: "document_link" },
  { name: "enc", ext: "manifest", type: "other_link" },
]

function findSource(id) {
  let i = 0;
  let source = null;

  do {
    source = id.toLowerCase().includes(sources[i].ext) ? sources[i] : null;
    i++;
  } while (i < sources.length && source === null);

  if (source) {
    console.log("findSource source.name :", source.name)
    console.log("findSource source :", source)
    return {"name": source.name, "type": source.type}
  }

  return null;
}
function getSimpleObject(obj) {
  //console.log("getSimpleObject / obj", obj)
  let simpleObject = {}
  simpleObject = {
    identifier: obj.identifier ? obj.identifier : obj['@id'],
    citeType: obj['@type'] ? obj['@type'] : obj.citeType,
    expanded: obj.expanded,
    title: obj.title,
    level: obj.level,
    link_type: obj.link_type,
    editorialLevelIndicator: obj.editorialLevelIndicator,
    totalChildren: obj.totalChildren,
    children: obj.children,
    member: obj.member,
    parent: obj.parent,
    dublincore: obj.dublincore,
    extensions: obj.extensions
  }
  //console.log("getSimpleObject / simpleObject", simpleObject)
  return simpleObject
}
function findById(array, id) {
  for (const item of array) {
    if (item.identifier === id) return item;
    if (item.children?.length) {
      const innerResult = findById(item.children, id);
      if (innerResult) return innerResult;
    }
  }
}
function findDeep(array, id) {
  return array.some(function(item) {
    if(item.id === id) return item;
    else if(item.children?.length) return findDeep(item.children, id)
  })
}

export default {
  name: "DocumentPage",
  components: {
    ListeTheseAnnee,
    DocumentMetadata,
    Document,
    TOC,
    ToPreviousButton,
    ToNextButton,
    CollectionModal,
    ModalDocumentMetadata
  },

  async setup() {
    console.log("PROJECT test : ", PROJECT)
    const manifestIsAvailable = ref(false)

    // Mirador view sticky behavior
    let miradorViewBoundingTop = ref(0);
    const miradorViewCssStyle = computed(() => {
      return {marginTop: miradorViewBoundingTop.value + "px"};
    })

    const updateMiradorTopPosition = function () {
      const textView = document.getElementById("text-view");
      if (textView) {
        const top = textView.getBoundingClientRect().top;
        miradorViewBoundingTop.value = top < 0 ? -Math.floor(top) : 0;
      }
    }




    const setText = (text) => {

      // We're going to split the string towards the end. This is just a judgment call.
      // Since we can't dynamically change the split as the container changes size (at
      // least, not with a lot more work), we have to pick a location that scales the
      // ellipsis well.
      let splitIndex = Math.round( text.length * 0.5 )

      return {
        'left': text.slice( 0, splitIndex ),
        'right': text.slice( splitIndex )
      }
    }

    const initial_metadata = {
      id: null,
      title: null,
      author: null,
      rights: null,
      sudoc: null,
      benc: null,
      thenca: null,
      data_bnf: null,
      dbpedia: null,
      idref: null,
      catalogue_bnf: null,
      hal: null,
      wikidata: null,
      wikipedia: null,
      iiifManifestUrl: null,
      downloadPDF: null,
      downloadXML: null
    }/*document_links: [],
      author_links: [],
      other_links: [],*/

    const metadata = reactive(initial_metadata)
    const route = useRoute()
    const store = useStore()

    const resourceId = ref()
    const refId = ref(false)
    const hash = ref(false)
    const currentItem = ref({})
    const documentType = ref()
    let parentCollectionId = ref()
    let collection = ref()

    const isLoading = ref(false)
    const TOC_DEPTH = ref(parseInt(`${import.meta.env.VITE_APP_TOC_DEPTH}`))
    const editorialTypesIsValid = ref(false)
    const currentLevelIndicator = ref(false)
    const currentLevel = ref(1)
    const editorialLevel = ref(parseInt(`${import.meta.env.VITE_APP_EDITORIAL_LEVEL}`))
    let flatTOC = ref([])
    let topTOC = ref([])
    let asideTOC = reactive([])

    let arianeCollection = reactive([])
    let arianeDocument = reactive([])

    let yearsWithAdditionalPositions = []
    let allItemsIds = []
    const previousDocId = ref('')
    const nextDocId = ref('')
    const previousRefId = ref('')
    const previousRefTitle = ref('')
    const nextRefId = ref('')
    const nextRefTitle = ref('')
    const firstRef = ref(false)
    const lastRef = ref(false)


    const selectedCollectionId = ref('')
    const selectedCollection = reactive({})
    const isModalOpened = ref(false)
    const isMetadataOpened = ref(false)


    const miradorInstance = useMirador("vue-mirador-container", null, 0)
    // provide an uninitialized instance of Mirador
    provide("mirador", miradorInstance)

    const layout = inject("variable-layout")

    const getCurrentItem = async (origin, route) => {
      console.log("getCurrentItem origin route", origin, route)
      if (route.params.id) {
        resourceId.value = route.params.id
        //let currentIdResponse = getMetadata(resourceId.value)
        console.log("Setting resourceId : ", resourceId.value)
        // Check if route id param is a DoTS resourceId or a fragmentId in order to store current resourceId
        // get DotS route to identify type of Id (collection / resource / fragment)
        // if route param id is collection -> ?
        // if route param id is resource -> store the resourceId in Store
        // await getMetadataFromApi(route.params.id)
        store.commit('setResourceId', route.params.id)

        let response = await getMetadataFromApi(resourceId.value);
        let parentResponse = await getParentFromApi(response['@id'])
        //console.log("parentResponse", parentResponse["member"][0])

        if (response["@type"] === "Resource") {

          documentType.value = "Resource"
          currentItem.value = getSimpleObject(response)
          currentItem.value.parent = parentResponse["member"].length > 1 ? parentResponse["member"].map(p => p['@id']): parentResponse["member"][0]['@id']
          currentItem.value.level = 0

          // Fetch editorial level document parts if any (based on citeType)
          let editorialTypes = []
          if (import.meta.env.VITE_APP_EDITORIAL_TYPE && import.meta.env.VITE_APP_EDITORIAL_TYPE.length > 0) {
            editorialTypes = import.meta.env.VITE_APP_EDITORIAL_TYPE.replace(/\s/g, '').split(",")
          }
          currentItem.value.editorialLevelIndicator = editorialTypes.includes(currentItem.citeType) ? "toEdit" : "renderToc"
          store.commit('setCurrentItem', currentItem.value)
          console.log("init type : ", documentType.value)
          isModalOpened.value = false
        } else {
          documentType.value = "Collection"

          currentItem.value = getSimpleObject(response)
          currentItem.value.parent = parentResponse["member"] ? parentResponse["member"][0]['@id'] : null
          currentItem.value.level = -1
          currentItem.value.editorialLevelIndicator = "renderToc"
          store.commit('setCurrentItem', currentItem.value)
          console.log("init type : ", documentType.value)
          isModalOpened.value = true
        }
        currentLevelIndicator.value = currentItem.value.editorialLevelIndicator
        refId.value = Object.keys(route.query).length > 0 && Object.keys(route.query).includes("refId")
                    ? refId.value = route.query.refId
                    : false

        hash.value = route.hash && route.hash.length > 0
                    ? hash.value = route.hash.replace("#", "")
                    : false
      }
    }



    const getMetadata = async () => {
      let metadataResponse = await fetchMetadata(resourceId.value, "Resource", route)
      console.log("DocumentPage getMetadata metadataResponse", metadataResponse)
      Object.assign(metadata, metadataResponse)
    }

    // Setting up the Tables Of Content Top and Left
    const getTOC = async (reason) => {
      console.log("DocumentPage getTOC reason", reason)
      console.log("DocumentPage getTOC resourceId.value", resourceId.value)
      console.log("DocumentPage getTOC refId.value", refId.value)

      let response = await getTOCFromApi(resourceId.value, documentType.value);
      console.log("initial response", response)
      if (response.member && documentType.value === 'Collection') {
        response.member.forEach((m) => m.parent = response['@id'])
        response.member.forEach((m) => m.level = store.state.currentItem.level + 1)
        response.member.forEach((m) => m.identifier = m['@id'])
      }
      let parentNode = {}

      let parentId = store.state.currentItem.parent ? store.state.currentItem.parent : null /*Array.isArray(store.state.currentItem.parent) ? store.state.currentItem.parent[0] : */
      console.log("initial parentNode", parentNode)
      parentCollectionId.value = parentId
      console.log("parentCollectionId", parentCollectionId)

      let processFlatTOC = []
      processFlatTOC = [store.state.currentItem, ...response.member]
      processFlatTOC.filter(item => item.level === 1).forEach((i) => {i.parent = resourceId.value})

      // Fetch editorial level document parts if any (based on citeType)
      let editorialTypes = []
      if (import.meta.env.VITE_APP_EDITORIAL_TYPE && import.meta.env.VITE_APP_EDITORIAL_TYPE.length > 0) {
        editorialTypes = import.meta.env.VITE_APP_EDITORIAL_TYPE.replace(/\s/g, '').split(",")
      }
      // Validate that there are actually in the data
      let editorialTypesIsValid = processFlatTOC.some(item => editorialTypes.some(l => l === item.citeType))
      console.log("editorialTypes editorialTypesIsValid", editorialTypes, editorialTypesIsValid)



      console.log("initial3 processFlatTOC", processFlatTOC)


      async function parentLoop(node) {
        if (node.parent && node.parent.length > 0) {
          if (Array.isArray(node.parent)) {
            /*multiple parents */
            for (let i = 0; i < node.parent.length; i += 1) {
              console.log("appendParentInTOC / node.parent / p", node.parent, node.parent[i])
              let appendParentInTOC = await getMetadataFromApi(node.parent[i])
              console.log("appendParentInTOC", appendParentInTOC)
              let parentResponse = await getParentFromApi(appendParentInTOC['@id'])
              // Compute parent level from current node
              parentResponse.level = node.level - 1
              // Append this level to the parent instance to be added in the TOC
              appendParentInTOC.level = parentResponse.level
              appendParentInTOC.editorialLevelIndicator = 'renderToc'
              // Complete the list of children of the parent
              appendParentInTOC.member = appendParentInTOC.member.map(obj => {
                let updatedMember = {
                  identifier: obj.identifier ? obj.identifier : obj['@id'],
                  ...obj
                }
                return updatedMember
              })
              appendParentInTOC.children = []

              appendParentInTOC.children = appendParentInTOC.member.filter(item => item.identifier !== node.identifier).map(obj => {
                let updatedMember = {
                  identifier: obj.identifier ? obj.identifier : obj['@id'],
                  citeType: obj['@type'] ? obj['@type'] : obj.citeType,
                  expanded: obj.identifier === node.id ? node.expanded : undefined,
                  title: obj.title,
                  level: node.level,
                  link_type: node.link_type,
                  editorialLevelIndicator: node.editorialLevelIndicator,
                  totalChildren: obj.totalChildren,
                  children: obj.children ? obj.children : [],
                  member: obj.member? obj.member : [],
                  parent: node.parent,
                  dublincore: obj.dublincore,
                  extensions: obj.extensions
                }
                return updatedMember
              })
              //appendParentInTOC.member = appendParentInTOC.member.map(m => { return getSimpleObject(m)})
              //appendParentInTOC.children = appendParentInTOC.member
              appendParentInTOC.expanded = true
              // Check if the parent has itself a parent
              if (parentResponse.member) {
                // Then add the parent id to the parent instance to be added in the TOC
                appendParentInTOC.parent = parentResponse.member[0]['@id']
              } else {
                // Otherwise add a null parent id to the parent instance to be added in the TOC
                appendParentInTOC.parent = null
              }
              // Add this parent object to the TOC
              processFlatTOC = [getSimpleObject(appendParentInTOC), ...processFlatTOC]
              // If the parent has itself a parent : loop
              if (appendParentInTOC.parent && !processFlatTOC.some(item => item.identifier === appendParentInTOC.parent)) {
                await parentLoop(appendParentInTOC)
              }
            }
              /*let appendParentInTOC = await getMetadataFromApi(node.parent[0])
              console.log("appendParentInTOC", appendParentInTOC)
              let parentResponse = await getParentFromApi(appendParentInTOC['@id'])
              // Compute parent level from current node
              parentResponse.level = node.level - 1
              // Append this level to the parent instance to be added in the TOC
              appendParentInTOC.level = parentResponse.level
              appendParentInTOC.editorialLevelIndicator = 'renderToc'
              // Complete the list of children of the parent
              console.log("flatTOC debug appendParentInTOC.childre / appendParentInTOC.member", appendParentInTOC.children, appendParentInTOC.member)
              appendParentInTOC.children = appendParentInTOC.member
              appendParentInTOC.expanded = true
              // Check if the parent has itself a parent
              if (parentResponse.member) {
                // Then add the parent id to the parent instance to be added in the TOC
                appendParentInTOC.parent = parentResponse.member[0]['@id']
              } else {
                // Otherwise add a null parent id to the parent instance to be added in the TOC
                appendParentInTOC.parent = null
              }
              // Add this parent object to the TOC
              flatTOC.value = [getSimpleObject(appendParentInTOC), ...flatTOC.value]
              // If the parent has itself a parent : loop
              if (appendParentInTOC.parent) {
                await parentLoop(appendParentInTOC)
              }*/
          } else {
              let appendParentInTOC = await getMetadataFromApi(node.parent)
              console.log("appendParentInTOC", appendParentInTOC)

              let parentResponse = await getParentFromApi(appendParentInTOC['@id'])
              // Compute parent level from current node
              parentResponse.level = node.level - 1
              // Append this level to the parent instance to be added in the TOC
              appendParentInTOC.level = parentResponse.level
              appendParentInTOC.editorialLevelIndicator = 'renderToc'
              // Complete the list of children of the parent
            appendParentInTOC.member = appendParentInTOC.member.map(obj => {
                let updatedMember = {
                  identifier: obj.identifier ? obj.identifier : obj['@id'],
                  ...obj
                }
                return updatedMember
              })
              appendParentInTOC.children = []

              appendParentInTOC.children = appendParentInTOC.member.filter(item => item.identifier !== node.identifier).map(obj => {
                let updatedMember = {
                  identifier: obj.identifier ? obj.identifier : obj['@id'],
                  citeType: obj['@type'] ? obj['@type'] : obj.citeType,
                  expanded: obj.identifier === node.id ? node.expanded : undefined,
                  title: obj.title,
                  level: node.level,
                  link_type: node.link_type,
                  editorialLevelIndicator: node.editorialLevelIndicator,
                  totalChildren: obj.totalChildren,
                  children: obj.children ? obj.children : [],
                  member: obj.member? obj.member : [],
                  parent: node.parent,
                  dublincore: obj.dublincore,
                  extensions: obj.extensions
                }
                return updatedMember
              })
              //appendParentInTOC.member = appendParentInTOC.member.map(m => { return getSimpleObject(m)})
              //appendParentInTOC.children = appendParentInTOC.member
              appendParentInTOC.expanded = true

              // Check if the parent has itself a parent
              if (parentResponse.member) {
                // Then add the parent id to the parent instance to be added in the TOC
                appendParentInTOC.parent = parentResponse.member[0]['@id']
              } else {
                // Otherwise add a null parent id to the parent instance to be added in the TOC
                appendParentInTOC.parent = null
              }
              // Add this parent object to the TOC
              processFlatTOC = [getSimpleObject(appendParentInTOC), ...processFlatTOC]
              // If the parent has itself a parent : loop
              if (appendParentInTOC.parent && !flatTOC.value.some(item => item.identifier === appendParentInTOC.parent)) {
                await parentLoop(getSimpleObject(appendParentInTOC))
              }
          }

        }
      }


      await parentLoop(store.state.currentItem)


      console.log("setup afterParents processFlatTOC : ", processFlatTOC)

      //Move ultimate ancestor to first position


      let ultimateAncestor = processFlatTOC.filter(item => item.parent === null)[0]
      let ultimateAncestorIndex = processFlatTOC.findIndex(item => item.parent === null)
      console.log("setup afterParents find ultimate ancestor : ", processFlatTOC, ultimateAncestor, ultimateAncestorIndex)

      processFlatTOC.splice(ultimateAncestorIndex, 1)
      processFlatTOC.unshift(ultimateAncestor)
      console.log("setup afterParents find ultimate ancestor after: ", processFlatTOC, ultimateAncestor, ultimateAncestorIndex)


      let maxTocDepth = Math.max(...processFlatTOC.map(item => item.level))
      console.log("document DoTS maxTocDepth : ", maxTocDepth)

      editorialLevel.value = parseInt(`${import.meta.env.VITE_APP_EDITORIAL_LEVEL}`)
      console.log("USER editorialLevel.value / typeof : ", editorialLevel.value, typeof(editorialLevel.value))
      editorialLevel.value = editorialLevel.value > maxTocDepth ? 0 : editorialLevel.value
      console.log("VALIDATED editorialLevel.value / typeof : ", editorialLevel.value, typeof(editorialLevel.value))

      console.log("currentLevel / typeof : ", currentLevel, typeof(currentLevel))

      console.log("TOC_DEPTH.value / typeof : ", TOC_DEPTH.value, typeof(TOC_DEPTH.value))

      if (refId.value) {
        console.log("there is a refId , update currentLevel", processFlatTOC.filter(item => item.identifier === refId.value)[0].level)
        currentLevel.value = processFlatTOC.filter(item => item.identifier === refId.value)[0].level
        console.log("there is a refId , updated currentLevel", currentLevel.value)
      } else {
        console.log("there is NO refId , update currentLevel to 0", 0)
        currentLevel.value = 0
        console.log("there is NO refId , updated currentLevel", currentLevel.value)
      }

      let startTimeBuildTOC = new Date();
      if (editorialTypesIsValid) {

        let editorialTypeTOC = list_to_tree_types(processFlatTOC)
        console.log("flatTOC editorialTypeTOC", editorialTypeTOC)

        function list_to_tree_types(flat_toc) {
          var map = {}, node, roots = [], i;

          for (i = 0; i < flat_toc.length; i += 1) {
            map[flat_toc[i].identifier] = i; // initialize the map
            flat_toc[i].children = flat_toc[i].children ? flat_toc[i].children : [] ; // initialize the children
          }
          for (i = 0; i < flat_toc.length; i += 1) {
            node = flat_toc[i]
            node.identifier = node.identifier ? node.identifier : node['@id']

            //console.log("flatTOC level debug node.children node.member", node)
            if (node.parent && node.parent.length > 0 && i > 0) {
              //console.log("check node.parent error : ", flatTOC, node, i)
              // TODO? if you have dangling branches check that map[node.parent] exists
              if (Array.isArray(node.parent)) {
                /*multiple parents*/
                for (let i = 0; i < node.parent.length; i += 1) {
                  //console.log("check if child already in children ", node, flat_toc[map[node.parent[i]]].children.some(item => item.identifier === node.identifier))
                  let index = flat_toc[map[node.parent[i]]].children.findIndex(o => o.identifier === node.identifier);
                  if (index > -1) {
                      flat_toc[map[node.parent[i]]].children[index] = node
                  } else {
                    flat_toc[map[node.parent[i]]].children.push(node)
                  }
                  //console.log("check if child node after addition of childs ", node, flat_toc[map[node.parent[i]]])
                }/*
                flat_toc[map[node.parent[0]]].children.push(node)*/
              } else {
                //console.log("check if child 2 already in children ", node, flat_toc[map[node.parent]].children.some(item => item.identifier === node.identifier))
                let index = flat_toc[map[node.parent]].children.findIndex(o => o.identifier === node.identifier);
                  if (index > -1) {
                    flat_toc[map[node.parent]].children[index] = node
                  } else {
                    flat_toc[map[node.parent]].children.push(node)
                  }
                //flat_toc[map[node.parent]].children.push(node)
                //console.log("check if child 2 node after addition of childs ", node, flat_toc[map[node.parent]])
              }
              if (processFlatTOC.filter(item => item.identifier === node.identifier)[0]) {
                Object.assign(processFlatTOC.filter(item => item.identifier === node.identifier)[0], node)
              } else if (findById(processFlatTOC, node.identifier)) {
                Object.assign(findById(processFlatTOC, node.identifier), node)
              }
            } else {
              processFlatTOC.filter(item => item.identifier === node.identifier)[0] = node
              roots.push(node)
            }
          }
          return roots
        }

        let testTOC = editorialTypeTOC

        editorialTypeTOC.forEach((item) => item.identifier = item.identifier ? item.identifier : item['@id'])

        console.log("testTOC without addFlag function", testTOC)


        function addFlag(data, level = 0, indicator = false, ancestorId) {

          return data.map(({ citeType, children = [], ...rest }) => {

            const node = { ...rest, citeType }
            //console.log("addFlag node", node.citeType, editorialTypes, !editorialTypes.includes(node.citeType), indicator)
            if (!editorialTypes.includes(node.citeType) && !indicator) {
              node.editorialLevelIndicator = 'renderToc'
              node["link_type"] = "link"
              if (node.level <=0) {

                node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${node.identifier}`
                node.router = node.identifier
                node.router_params = node.identifier
                //console.log("addFlag on node.level <=0 :", node)
              } else {
                node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}?refId=${node.identifier}`
                node.router = `${route.params.id}?refId=${node.identifier}`
                node.router_params = route.params.id
                node.router_refid = node.identifier
              }
              //console.log("addFlag not in types and no indicator", node, node.citeType, indicator, node.identifier)
            } else if (editorialTypes.includes(node.citeType)) {
              ancestorId = node.identifier
              indicator = true
              node.editorialLevelIndicator = 'toEdit'
              node["link_type"] = "link"
              if (node.level <=0) {
                node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}/document/${node.identifier}test`
                node.router = node.identifier
              } else {
                node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}?refId=${node.identifier}`
                node.router = `${route.params.id}?refId=${node.identifier}`
                node.router_params = route.params.id
                node.router_refid = node.identifier
              }
              //console.log("addFlag in types", node, node.citeType, indicator)
            } else if (node.level > level && indicator ) {
              node.editorialLevelIndicator = 'hash'
              node["link_type"] = "hash"
              node["ancestor_editorialLevel"] = ancestorId
              //if (Object.keys(route.query).length > 0 && Object.keys(route.query).includes("refId")) {
              if (node.ancestor_editorialLevel !== route.params.id) {
                node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}?refId=${node.ancestor_editorialLevel}#${node.identifier}`
                node.router = `${route.params.id}?refId=${node.ancestor_editorialLevel}#${node.identifier}`
                node.hash = `#${node.identifier}`
                node.router_params = route.params.id
                node.router_refid = node.ancestor_editorialLevel
                node.router_hash = `#${node.identifier}`
              } else {
                node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}#${node.identifier}`
                node.router = `${route.params.id}#${node.identifier}`
                node.hash = `#${node.identifier}`
                node.router_params = route.params.id
                node.router_hash = `#${node.identifier}`
              }
              /*} else {
                node.url = `TEST!!!!!!!${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}#${node.identifier}`
                node.router = `${route.params.id}#${node.identifier}`
                node.hash = `#${node.identifier}`
              }*/
              //console.log("addFlag in types below ", node, node.citeType, indicator)
            } else {
              indicator = false
              //console.log("addFlag resetting level ? node node.level", node, node.citeType, node.level, level)
            }
            if (children.length) {
              //console.log("flatTOC debug children.length children", children.length, children)
              node.children = addFlag(children, node.level, indicator, ancestorId)
            }
            if (processFlatTOC.filter(item => item.identifier === node.identifier)[0]) {
              Object.assign(processFlatTOC.filter(item => item.identifier === node.identifier)[0], node)
            } else if (findById(processFlatTOC, node.identifier)) {
              Object.assign(findById(processFlatTOC, node.identifier), node)
            }
            return node
          })
        }

        topTOC.value = addFlag(editorialTypeTOC)
        console.log("addFlag debug topTOC.value", addFlag(editorialTypeTOC), processFlatTOC)




        let startTimefindById = new Date();
        /*flatTOC.value.forEach((i) => {
          if (i.identifier === 'Paris') {
            console.log("updating flatToc from topTOC Paris ex :", flatTOC.value, i, topTOC.value.filter(item => item.identifier === i.identifier))
          }

          let itemToUpdate = findById(topTOC.value, i.identifier)
          //console.log("update flatToc row 809 i)", i)
          //console.log("update flatToc row 809 itemToUpdate", itemToUpdate)
          i.url = itemToUpdate.url
          i.router = itemToUpdate.router
          i.editorialLevelIndicator = itemToUpdate.editorialLevelIndicator
          i.link_type = itemToUpdate.link_type
          i.hash = itemToUpdate.hash ? itemToUpdate.hash : undefined
        })*/
        let endTimefindById = new Date();
        console.log("Timing findById : ", endTimefindById - startTimefindById)
        //console.log("flatTOC.value updated after editorialType : ", flatTOC.value)
        console.log("processFlatTOC updated after editorialType : ", processFlatTOC)
        console.log("topTOC.value based on editorialType : ", topTOC.value)
        //console.log("deepEqual(topTOC.value, testTOC)", deepEqual(flatTOC.value, processFlatTOC))

        flatTOC.value = processFlatTOC

        if (refId.value) {
          console.log("there is a refId , update currentLevelIndicator", currentLevelIndicator.value)
          currentLevelIndicator.value = flatTOC.value.find(i => i.identifier === refId.value).editorialLevelIndicator
          console.log("there is a refId , updated currentLevelIndicator", currentLevelIndicator.value)
        } else {
          console.log("there is NO refId , update currentLevelIndicator", currentLevelIndicator.value)
          currentLevelIndicator.value = flatTOC.value.find(i => i.identifier === resourceId.value).editorialLevelIndicator
          console.log("there is NO refId , updated currentLevelIndicator", currentLevelIndicator.value)
        }
      }
      let endTimeBuildTOC = new Date();
      console.log("TimeBuildTOC : ", endTimeBuildTOC - startTimeBuildTOC)

      if (!editorialTypesIsValid) {
        topTOC.value = list_to_tree(flatTOC.value, editorialLevel.value)
        console.log("topTOC.value based on levels : ", topTOC.value)
      }
      console.log("topTOC.value based on editorialLevel before: ", topTOC.value, findById(topTOC.value, resourceId.value))
      topTOC.value = findById(topTOC.value, resourceId.value).children
      //topTOC.value = topTOC.value.filter(item => item.identifier === resourceId.value)[0].children
      console.log("topTOC.value based on editorialLevel : ", topTOC.value)


      function list_to_tree(flat_toc, level, editorialTypes) {
        var map = {}, node, roots = [], i;

        for (i = 0; i < flat_toc.length; i += 1) {
          map[flat_toc[i].identifier] = i // initialize the map
          flat_toc[i].children = flat_toc[i].children ? flat_toc[i].children : [] // initialize the children
        }
        let ancestor_editorialLevel = ""
        for (i = 0; i < flat_toc.length; i += 1) {
          node = flat_toc[i]
          node.identifier = node.identifier ? node.identifier : node['@id']

          if (node.level <= 0) {
            //console.log("node level < editorial level : ", node)
            node.editorialLevelIndicator = 'renderToc'
            node["link_type"] = "link"
            node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}/document/${node.identifier}`
            node.router = node.identifier
            node.router_params = node.identifier
          } else if (node.level < level && level > 0) {
            //console.log("node level < editorial level : ", node)
            node.editorialLevelIndicator = 'renderToc'
            node["link_type"] = "link"
            node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}?refId=${node.identifier}`
            node.router = `${route.params.id}?refId=${node.identifier}`
            node.router_params = route.params.id
            node.router_refid = node.identifier
          } else if (node.level === level) {
            //console.log("node level === editorial level : ", node)
            ancestor_editorialLevel = node.identifier
            node.editorialLevelIndicator = 'toEdit'
            node["link_type"] = "link"
            node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}?refId=${node.identifier}`
            node.router = `${route.params.id}?refId=${node.identifier}`
            node.router_params = route.params.id
            node.router_refid = node.identifier
          } else {
            //console.log("node level > editorial level : ", node)
            node["ancestor_editorialLevel"] = ancestor_editorialLevel
            node.editorialLevelIndicator = 'hash'
            node["link_type"] = "hash"
            if (node.ancestor_editorialLevel !== route.params.id) {
              node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}?refId=${node.ancestor_editorialLevel}#${node.identifier}`
              node.router = `${route.params.id}?refId=${node.ancestor_editorialLevel}#${node.identifier}`
              node.hash = `#${node.identifier}`
              node.router_params = route.params.id
              node.router_refid = node.ancestor_editorialLevel
              node.router_hash = `#${node.identifier}`

            } else {
              node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}/document/${node.identifier}#${node.identifier}`
              node.router = `${route.params.id}#${node.identifier}`
              node.hash = `#${node.identifier}`
              node.router_params = route.params.id
              node.router_hash = `#${node.identifier}`
            }
          }
          if (node.parent && node.parent.length > 0 && i > 0) {
            //console.log("check node.parent error : ", flatTOC, node)
            // TODO? if you have dangling branches check that map[node.parent] exists
                          if (Array.isArray(node.parent)) {
                /*multiple parents*/
                for (let i = 0; i < node.parent.length; i += 1) {
                  //console.log("check if child already in children ", node, flat_toc[map[node.parent[i]]].children.some(item => item.identifier === node.identifier))
                  let index = flat_toc[map[node.parent[i]]].children.findIndex(o => o.identifier === node.identifier);
                  if (index > -1) {
                      flat_toc[map[node.parent[i]]].children[index] = node
                  } else {
                    flat_toc[map[node.parent[i]]].children.push(node)
                  }
                  //console.log("check if child node after addition of childs ", node, flat_toc[map[node.parent[i]]])
                }/*
                flat_toc[map[node.parent[0]]].children.push(node)*/
              } else {
                //console.log("check if child 2 already in children ", node, flat_toc[map[node.parent]].children.some(item => item.identifier === node.identifier))
                let index = flat_toc[map[node.parent]].children.findIndex(o => o.identifier === node.identifier);
                  if (index > -1) {
                    flat_toc[map[node.parent]].children[index] = node
                  } else {
                    flat_toc[map[node.parent]].children.push(node)
                  }
                //flat_toc[map[node.parent]].children.push(node)
                //console.log("check if child 2 node after addition of childs ", node, flat_toc[map[node.parent]])
              }
          } else {
            roots.push(node);
          }
        }
        return roots;
      }

      if (refId.value) {
        console.log("there is a refId , update currentLevelIndicator", currentLevelIndicator.value)
        currentLevelIndicator.value = flatTOC.value.find(i => i.identifier === refId.value).editorialLevelIndicator
        console.log("there is a refId , updated currentLevelIndicator", currentLevelIndicator.value)


        console.log("search RefId item in TOC and return children : ", findById(topTOC.value, refId.value).children)
        asideTOC.value = findById(topTOC.value, refId.value).children
        /*if (topTOC.value.filter(item => item.identifier === refId.value)[0] && topTOC.value.filter(item => item.identifier === refId.value)[0].children) {
          asideTOC.value = topTOC.value.filter(item => item.identifier === refId.value)[0].children
          console.log("asideToc cas 1 :", asideTOC.value, topTOC.value)
        } else {
          asideTOC.value = topTOC.value.find(node => node.items.some(item => item.identifier === refId.value));
              //topTOC.value.filter(item => item.identifier === refId.value)
          console.log("asideToc cas 2 :", refId.value, asideTOC.value, topTOC.value)
        }*/
      } else {
        console.log("there is NO refId , update currentLevelIndicator", currentLevelIndicator.value)
        currentLevelIndicator.value = flatTOC.value.find(i => i.identifier === resourceId.value).editorialLevelIndicator
        console.log("there is NO refId , updated currentLevelIndicator", currentLevelIndicator.value)
        asideTOC.value = topTOC.value
        console.log("asideToc cas 3 :", asideTOC.value, topTOC.value)
      }
      await getAncestors()
      console.log("getTOC result topTOC : ", topTOC.value)
      console.log("getTOC result asideTOC : ", asideTOC.value)
      store.commit('setTOC', flatTOC.value)
      isLoading.value = true
    }

    const getAncestors = async () => {
      console.log("getAncestors start")
      let currentItemId = hash.value ? hash.value.replace('#', '') : refId.value ? refId.value : resourceId.value
      console.log("ancestors currentItemId : ", flatTOC.value, hash.value, refId.value, resourceId.value, currentItemId)

      function findAncestors(item, directory) {
        if (item.parent === null) return [item];
        let parent = []
        if (Array.isArray(item.parent)) {
          /*multiple parents*/
          for (let i = 0; i < item.parent.length; i += 1) {
            let parentId = item.parent[i]
            //console.log("findAncestors item.parent", item.parent, i, item.parent[i])
            parent.push(directory.find(i => i.identifier === parentId))
            //console.log("findAncestors parent list", directory.find(i => i.identifier === parentId))
          }/*
        parent.push(directory.find(i => i.identifier === item.parent[0]))*/
        } else {
          parent.push(directory.find(i => i.identifier === item.parent))
        }
        //console.log("findAncestors item, parent", item, parent)

        return [
          item,
          parent,
          ...findAncestors(parent[0], directory),
        ].flat();
      }

      console.log("ancestors flatTOC.value", flatTOC.value)

      let startTimeBuildAncestors = new Date();

      if (editorialTypesIsValid) {
        console.log("ancestors editorialTypesIsValid", editorialTypesIsValid, currentItemId)
        console.log("flatTOC.value debug", flatTOC.value.filter(item => item.identifier === currentItemId))
          // Filter the TOC down to the item we care about based on currentItemId

      } else {
        console.log("ancestors based on levels ")
      }

      //Build the collections breadcrumb
      arianeCollection.value = flatTOC.value
          // Filter the TOC down to the item we care about based on currentItemId
          .filter(item => item.identifier === currentItemId)
          // Map each item to an array of its ancestors
          .map(item => findAncestors(item, flatTOC.value))
          // Flatten the array of arrays into an array of items
          .flat()
          // De-duplicate the result
          .reduce((output, item) => {
            return !output.includes(item)
                ? [...output, item]
                : output;
          }, [])
          // From these ancestors, we only need Collection items
          .filter(item => item.citeType === "Collection")
          // Sorting by increasing level
          .sort((a, b) => a.level - b.level)

      console.log("arianeCollection.value", arianeCollection.value)

      //Group the ancestors (type collection) by level (when there are several parent collections at any level)
      const arianeColGroupedByLevel = new Map();

      for (let i = 0; i < arianeCollection.value.length; i += 1) {
        console.log("arianeCollection test order increasing", arianeCollection.value[i])
        const level = arianeCollection.value[i].level;
        console.log("arianeCollection arianeColGroupedByLevel i / item / level : ", i, arianeCollection.value[i], level)
        console.log("arianeCollection arianeColGroupedByLevel / i ", i, arianeColGroupedByLevel)
        if (!arianeColGroupedByLevel.has(level)) {
          arianeColGroupedByLevel.set(level, [arianeCollection.value[i]]);
        } else {
          arianeColGroupedByLevel.get(level).push(arianeCollection.value[i]);
        }
      }
      arianeCollection.value = Array.from(arianeColGroupedByLevel.values())

      //Build the breadcrumb within the resource
      arianeDocument.value = flatTOC.value
          // Filter the TOC down to the item we care about based on currentItemId
          .filter(item => item.identifier === currentItemId)
          // Map each item to an array of its ancestors
          .map(item => findAncestors(item, flatTOC.value))
          // Flatten the array of arrays into an array of items
          .flat()
          // De-duplicate the result
          .reduce((output, item) => {
            return !output.includes(item)
                ? [...output, item]
                : output;
          }, [])
          // From these ancestors, we only need non-collection items
          .filter(item => item.citeType !== "Collection")
          // From these ancestors, we don't display the current ressource
          //.filter(item => item.identifier !== currentItemId)
          // Sorting by increasing level
          .sort((a, b) => a.level - b.level)

      console.log("arianeDocument.value", arianeDocument.value)

      let endTimeBuildAncestors = new Date();
      console.log("TimeBuildAncestor : ", endTimeBuildAncestors - startTimeBuildAncestors)
    }

    const getAllPositionsYears = async () => {
      console.log("getAllPositionsYears start")
      // get parent's collection of current id
      /*let parentCollection = await getParentCollection()
      console.log("getAllPositionsYears parentCollection", parentCollection)*/
      if (parentCollectionId.value) {
        let data = {}
        if (Array.isArray(parentCollectionId.value)) {
          data = await getMetadataFromApi(parentCollectionId.value[0])
        } else {
          data = await getMetadataFromApi(parentCollectionId.value)
        }
        //const data = await getMetadataFromApi(parentCollectionId.value)
        console.log("getAllPositionsYears parentCollectionId", parentCollectionId)
        console.log("getAllPositionsYears const data", data)
        let collectionCurrentItem = [];
        allItemsIds = [];
        for (var member of data.member) {
          let item = member["@id"]
          collectionCurrentItem.push(item);
          let itemID = {id: member["@id"], totalChildren: member.totalChildren}
          allItemsIds.push(itemID);
        }
        collectionCurrentItem.sort();
        let listProm = collectionCurrentItem;
        console.log("getAllPositionsYears check error listProm", listProm)
        //updatePreviousDocId(listProm, resourceId.value)
        //updateNextDocId(flatTOC, refId.value ? refId.value : resourceId.value)
      }
    }

    const closeModal = () => {
      isModalOpened.value = false
      selectedCollectionId.value = ''
      Object.assign(selectedCollection, {})
      console.log(" Collection modal was closed : ", selectedCollectionId.value, selectedCollection)
    }
    const closeMetadata = () => {
      isMetadataOpened.value = false
      console.log(" Metadata modal was closed")
    }

    const toggleMetadata = (event => {
      event.preventDefault()
      isMetadataOpened.value = !isMetadataOpened.value
    })

    const toggleCollection = ((event, collectionId) => {
      console.log("toggleCollection collectionId : ", collectionId)
      event.preventDefault()
      isModalOpened.value = true
      selectedCollectionId.value = collectionId
      Object.assign(selectedCollection, flatTOC.value.filter(item => item.identifier === selectedCollectionId.value)[0])
      console.log("toggleCollection selectedCollectionId / selectedCollection : ", selectedCollectionId.value, flatTOC.value.filter(item => item.identifier === selectedCollectionId.value)[0])
    })

    function updatePreviousDocId(listProm, docId) {
      let yearsIdwithSupplementalIndicator = listProm.filter(a => a.includes('b'))
      console.log("yearsIdwithSupplementalIndicator : ", yearsIdwithSupplementalIndicator)
      yearsWithAdditionalPositions = yearsIdwithSupplementalIndicator.map(string => string.replace('b', ''));
      console.log("yearsWithAdditionalPositions : ", yearsWithAdditionalPositions)
      let currentItem = docId
      console.log("function updatePreviousDocId currentItem", currentItem)
      let currentItemIndex = listProm.findIndex(id => id === docId)
      console.log("function updatePreviousDocId currentDocIndex", currentItemIndex)
      let firstItem = allItemsIds[0].id
      console.log("function updatePreviousDocId firstItem", firstItem)
      console.log("function updatePreviousDocId allItemsIds", allItemsIds)
      if (currentItem === firstItem && currentItemIndex === allItemsIds.filter(({id}) => currentItem === id)[0].totalChildren) {
        console.log("it is the first item in collection : ", currentItem, currentItemIndex)
        previousDocId.value = ""
        console.log("first item previousDocId : ", previousDocId.value)
      } else {
        let previousItemIndex = null
        let previousItem = {}
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        if (currentItemIndex < allItemsIds.filter(({id}) => currentItem === id)[0].totalChildren) {
          // current doc is not the first one within its collection : get following doc for the same collection
          previousDocId.value = currentItem + "_" + zeroPad(currentItemIndex - 1, 2)
        } else {
          previousItemIndex = allItemsIds.findIndex(({id}) => id === currentItem) - 1;
          previousItem = allItemsIds[previousItemIndex]
          console.log("previousItemIndex , previousItem : ", previousItemIndex, previousItem)
          previousDocId.value = previousItem.id
        }
      }
    }
    function updateNextDocId(flatTOC, id) {
      console.log("function updateNextDocId flatTOC, id", flatTOC, id)
      let editorialFlatTOC = flatTOC.value.filter(item => item.level <= editorialLevel.value)
      let currentItem = editorialFlatTOC.find(item => item.identifier === id)
      console.log("function updateNextDocId currentItem", currentItem)
      let currentItemIndex = currentItem ? editorialFlatTOC.findIndex(id => id === id) : -1
      console.log("function updateNextDocId currentItemIndex", currentItemIndex)
      let lastItem = editorialFlatTOC.slice(-1).id
      console.log("function updateNextDocId lastItem", editorialFlatTOC.slice(-1)[0])
      if (currentItemIndex === editorialFlatTOC.length) {
        //this is the last item in editorial levels
        console.log("function updateNextDocId this is the last item")
        nextRefId.value = ""
      } else {
        //this is not the last item in editorial levels : find next
        console.log("function updateNextDocId this is NOT the last item")
        nextDocId.value = editorialFlatTOC[currentItemIndex + 1].identifier
        console.log("function updateNextDocId nextDocId.value : ", nextDocId.value)
      }
    }
    /*function updateNextDocId(listProm, docId) {
      console.log("function updateNextDocId listProm, docId", listProm, docId)
      let yearsIdwithSupplementalIndicator = listProm.filter(a => a.includes('b'))
      console.log("yearsIdwithSupplementalIndicator : ", yearsIdwithSupplementalIndicator)
      yearsWithAdditionalPositions = yearsIdwithSupplementalIndicator.map(string => string.replace('b', ''));
      console.log("yearsWithAdditionalPositions : ", yearsWithAdditionalPositions)
      let currentItem = docId
      console.log("function updateNextDocId currentItem", currentItem)
      let currentItemIndex = listProm.findIndex(id => id === docId)
      console.log("function updateNextDocId currentItemIndex", currentItemIndex)
      let lastItem = allItemsIds.slice(-1)[0].id
      console.log("function updateNextDocId lastItem", lastItem)
      console.log("function updateNextDocId allItemsIds", allItemsIds)
      console.log("function updateNextDocId allItemsIds.filter(({id}) => id === currentItem)[0].totalChildrens", allItemsIds.filter(({id}) => id === currentItem)[0].totalChildren)
      if (currentItem === lastItem && currentItemIndex === allItemsIds.filter(({id}) => id === currentItem)[0].totalChildren) {
        console.log("it is the last item in collection : ", currentItem, currentItemIndex)
        nextDocId.value = ""
        console.log("last item nextDocId : ", nextDocId.value)
      } else {
        let nextItemIndex = null
        let nextItem = {}
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        if (currentItemIndex < allItemsIds.filter(({id}) => currentItem === id)[0].totalChildren) {
          // current Position is not the last one within its publication year : get following Position for the same year
          nextDocId.value = currentItem + "_" + zeroPad(currentItemIndex + 1, 2)
        } else {
          nextItemIndex = allItemsIds.findIndex(({id}) => id === currentItem) + 1;
          nextItem = allItemsIds[nextItemIndex]
          console.log("nextItemIndex , nextItem : ", nextItemIndex, nextItem)
          nextDocId.value = nextItem ? nextItem.id : ""
        }
      }
    }*/

    const getNewRefId = function () {
      console.log("getNewRefId check if refId / refId.value", refId, refId.value)
      if (refId.value) {
        firstRef.value = false
        lastRef.value = false
        console.log("getNewRefId flatTOC.value ", flatTOC.value)
        //filter TOC to get only editorial level items
        if (editorialTypesIsValid) {
          let editorialFlatTOC = flatTOC.value.filter(item => item.editorialLevelIndicator === "toEdit" || item.editorialLevelIndicator === "renderToc" && item.level > 0)
          console.log("function getNewRefId editorialFlatTOC", editorialFlatTOC)
          let currentItem = editorialFlatTOC.find(item => item.identifier === refId.value)
          console.log("function getNewRefId currentItem", currentItem)
          let currentItemIndex = currentItem ? editorialFlatTOC.findIndex(item => item.identifier === refId.value) : -1
          console.log("function getNewRefId currentItemIndex", currentItemIndex)

          //if (currentItem) {
            if (currentItemIndex === 0) {
              //this is the first item in editorial levels
              //console.log("function getNewRefId this is the first item")
              previousRefId.value = ""
              previousRefTitle.value = "Table des matières"
              firstRef.value = true
            } else {
              //this is not the first item in editorial levels : find previous
              //console.log("function getNewRefId this is NOT the first item : ", editorialFlatTOC[currentItemIndex - 1])
              previousRefId.value = editorialFlatTOC[currentItemIndex - 1].identifier
              previousRefTitle.value = editorialFlatTOC[currentItemIndex - 1].title ?
                                       editorialFlatTOC[currentItemIndex - 1].title :
                                       editorialFlatTOC[currentItemIndex - 1].dublincore?.title
              //console.log("function getNewRefId previousRefId.value : ", previousRefId.value)
            }
            if (currentItemIndex === editorialFlatTOC.length - 1) {
              //this is the last item in editorial levels
              //console.log("function getNewRefId this is the last item")
              nextRefId.value = ""
              nextRefTitle.value = ""
              lastRef.value = true
            } else {
              //this is not the last item in editorial levels : find next
              //console.log("function getNewRefId this is NOT the last item : ", editorialFlatTOC[currentItemIndex + 1])
              nextRefId.value = editorialFlatTOC[currentItemIndex + 1].identifier
              nextRefTitle.value = editorialFlatTOC[currentItemIndex + 1].title ?
                                   editorialFlatTOC[currentItemIndex + 1].title :
                                   editorialFlatTOC[currentItemIndex + 1].dublincore?.title
              //console.log("function getNewRefId nextRefId.value : ", nextRefId.value)
            }

        } else {

          let editorialFlatTOC = flatTOC.value.filter(item => item.level <= editorialLevel.value && item.level > 0)
          console.log("function getNewRefId editorialFlatTOC", editorialFlatTOC)
          let currentItem = editorialFlatTOC.find(item => item.identifier === refId.value)
          console.log("function getNewRefId currentItem", currentItem)
          let currentItemIndex = currentItem ? editorialFlatTOC.findIndex(item => item.identifier === refId.value) : -1
          console.log("function getNewRefId currentItemIndex", currentItemIndex)

          if (currentItemIndex === 0) {
            //this is the first item in editorial levels
            console.log("function getNewRefId this is the first item")
            previousRefId.value = ""
            previousRefTitle.value = "Table des matières"
            firstRef.value = true
          } else {
            //this is not the first item in editorial levels : find previous
            console.log("function getNewRefId this is NOT the first item : ", editorialFlatTOC[currentItemIndex - 1])
            previousRefId.value = editorialFlatTOC[currentItemIndex - 1].identifier
            previousRefTitle.value = editorialFlatTOC[currentItemIndex - 1].title
            console.log("function getNewRefId previousRefId.value : ", previousRefId.value)
          }
          if (currentItemIndex === editorialFlatTOC.length - 1) {
            //this is the last item in editorial levels
            console.log("function getNewRefId this is the last item")
            nextRefId.value = ""
            nextRefTitle.value = ""
            lastRef.value = true
          } else {
            //this is not the last item in editorial levels : find next
            console.log("function getNewRefId this is NOT the last item : ", editorialFlatTOC[currentItemIndex + 1])
            nextRefId.value = editorialFlatTOC[currentItemIndex + 1].identifier
            nextRefTitle.value = editorialFlatTOC[currentItemIndex + 1].title ?
                                   editorialFlatTOC[currentItemIndex + 1].title :
                                   editorialFlatTOC[currentItemIndex + 1].dublincore?.title
            console.log("function getNewRefId nextRefId.value : ", nextRefId.value)
          }
        }
      } else {
        previousRefId.value = ""
        previousRefTitle.value = ""
        nextRefId.value = ""
        nextRefTitle.value = ""
      }
    }

    const setMirador = function () {
      if (metadata.iiifManifestUrl && metadata.iiifManifestUrl.length > 0) {
        fetch(metadata.iiifManifestUrl, {
          method: "HEAD",
        })
            .then((r) => {
              manifestIsAvailable.value = r.ok;
              miradorInstance.setManifestUrl(metadata.iiifManifestUrl);
              miradorInstance.initialize();
            })
            .catch(() => {
              manifestIsAvailable.value = false;
            })
      } else {
        manifestIsAvailable.value = false;
      }
    };

    watch(
        () => metadata.iiifManifestUrl,
        async () => {
          setMirador();
        }
    )

    watch(
        router.currentRoute, async (newRoute, oldRoute) => {
          isLoading.value = false
          //console.log("Document page watch route.params : ", route.params)
          //console.log("Document page watch route.query : ", route.query)
          //console.log("Document page watch route.hash : ", route.hash)
          //console.log("Document page watch route oldRoute, newRoute : ", oldRoute, newRoute)

          if (newRoute && oldRoute && newRoute.params.id !== oldRoute.params.id) {
            await getCurrentItem("watch getCurrentItem : route : ", newRoute)
            console.log("Document page watch route change, resource DID change :", refId.value)
            await getTOC("watch query")
            await getMetadata()
            await getAllPositionsYears();
            getNewRefId()
            isLoading.value = true
          } else if (newRoute && oldRoute && newRoute.params.id === oldRoute.params.id) {
            console.log("Document page watch route change but resource DID NOT change ", oldRoute, newRoute)
            //await getCurrentItem("watch getCurrentItem : route : ", newRoute)
            //await getTOC("watch query")
            if (newRoute.query.refId === oldRoute.query.refId) {
              console.log("Document page watch route change but resource/refId DID NOT change ", oldRoute, newRoute)
              hash.value = route.hash && route.hash.length > 0 ? route.hash.replace("#", "") : false
              isLoading.value = true
              if (route.hash && route.hash.length > 0) {
                console.log("watch scrollTo")
                scrollTo()
              }
            } else {
              refId.value = newRoute.query.refId
              await getCurrentItem("watch getCurrentItem : route : ", newRoute)
              //await getTOC("watch query")
              currentLevel.value = refId.value
                  ? flatTOC.value.find(i => i.identifier === refId.value).level
                  : flatTOC.value.find(i => i.identifier === resourceId.value).level
              await getAncestors()
              if (editorialTypesIsValid) {
              currentLevelIndicator.value = refId.value
                  ? flatTOC.value.find(i => i.identifier === refId.value).editorialLevelIndicator
                  : flatTOC.value.find(i => i.identifier === resourceId.value).editorialLevelIndicator
              } else {
                currentLevelIndicator.value = false
              }
              console.log("watch query : currentLevelIndicator.value debug", currentLevelIndicator.value)
              console.log("watch query : refId", refId.value)

              asideTOC.value = refId.value ? findById(topTOC.value, refId.value).children : topTOC.value
              console.log("watch query : asideTOC", asideTOC.value)
              getNewRefId()
              isLoading.value = true
            }
          } else if (!oldRoute) {
            await getCurrentItem("watch getCurrentItem : route : ", newRoute)
            console.log("Document page watch NO newRoute : oldRoute, newRoute ", oldRoute, newRoute)
            await getTOC("watch query")
            await getMetadata()
            getNewRefId()
          } else {
            console.log("Document page watch TEST : oldRoute, newRoute ", oldRoute, newRoute)
          }
        }, {deep: true, immediate: true}
    );

    function scrollTo() {
      nextTick(() => {
        // If the selected item is an anchor, capture and scroll to that anchor
        let hash = route.hash ? route.hash.replace("#", "") : ''
        //console.log("DocumentPage.vue scrollTo on resolve hash : ", hash)
        if (hash.length) {
          location.hash = hash
        }
      })
    }
    onMounted(() => {
      const appView = document.getElementById("app");
      appView.addEventListener("scroll", updateMiradorTopPosition);
      window.addEventListener('scroll', updateMiradorTopPosition);
    });

    onUnmounted(() => {
      const appView = document.getElementById("app");
      appView.removeEventListener("scroll", updateMiradorTopPosition);
      window.removeEventListener('scroll', updateMiradorTopPosition);
    });

    return {
      tocCssClass: layout.tocCssClass,
      toggleTOCContent: layout.toggleTOCContent,
      tocMenuCssClass: layout.tocMenuCssClass,
      toggleTOCMenu: layout.toggleTOCMenu,
      TOCMenuBtnCssClass: layout.TOCMenuBtnCssClass,
      changeViewMode: layout.changeViewMode,
      viewModeCssClass: layout.viewModeCssClass,
      miradorViewCssStyle,
      metadata,
      manifestIsAvailable,
      layout,
      resourceId,
      parentCollectionId,
      collection,
      isLoading,
      TOC_DEPTH,
      currentLevelIndicator,
      editorialLevel,
      currentLevel,
      documentType,
      flatTOC,
      topTOC,
      asideTOC,
      arianeCollection,
      arianeDocument,
      refId,
      hash,
      getNewRefId,
      previousDocId,
      nextDocId,
      previousRefId,
      previousRefTitle,
      nextRefId,
      nextRefTitle,
      firstRef,
      lastRef,
      scrollTo,
      isModalOpened,
      closeModal,
      isMetadataOpened,
      closeMetadata,
      toggleMetadata,
      toggleCollection,
      selectedCollectionId,
      selectedCollection,
      currentItem,
      setText,
    }
  }
}
</script>

<style>
.modal-area {
  width: 100%;
}
.arianetop {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 20px;

  font-family: "Barlow", sans-serif !important;
  font-size: 14px;
  color: #000 !important;

  &.crumbstop {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  &.crumbstop li, li:not(:last-child)::after {
    content: " > ";
    white-space: pre;
  }
  &.crumbstop li, li > a:hover {
    color: red !important;
  }
  &.crumbstop li, li .several-parent-top {
    display: flex !important;
    flex-direction: column !important;
 }
}
.liste-theses-area {
  background-color: #fbf8f4;
  padding-top: 50px;
  padding-bottom: 50px;
  margin-bottom: 28px;
}
.metadata-area {
  margin-top: 15px !important;
  margin-bottom: 15px !important;
}
.metadata-area .columns {
  margin: 0;
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
.toc-area-content {
  background-color: #e4e4e4;
  border-radius: 0 0 6px 6px;
  display: none;
}
.toc-area.is-opened .toc-area-header {
  background-color: #f1f1f1;
  border-radius: 6px 6px 0 0;
}
.toc-area.is-opened .toc-area-content {
  display: block;
}
.toc-area .toc-area-content aside {
  width: 100% !important;
  padding: 20px 50px !important;
}
.toc-area .toc-area-content nav > ol.tree {
  /*display: flex;
  justify-content: space-between;
  align-content: space-around;*/
  columns: 4;
  gap: 40px;
}
.toc-content > aside > nav > nav > ol.tree > li {
  /*width: 25%;*/
  text-transform: uppercase;
  margin-bottom: 20px;
  padding: 0;
}
.toc-content > aside > nav > nav > ol.tree > li.more > a {
  /*display: inline-block;*/
  margin-bottom: 8px;
}
.toc-content > aside > nav > nav > ol.tree > li li {
  padding: 0;
  margin: 0 0 6px;
  text-transform: none;
}
.toc-content > aside > nav > nav > ol.tree > li ol {
  margin: 0;
}
.toc-content nav > ol.tree > li {
  break-inside: avoid;
}
.toc-content nav > ol.tree li::before {
  display: none;
}
.toc-content nav > .tree ol,
.tree ul {
  border: none !important;
}
.toc-content a:hover {
  background-color: transparent !important;
  border-radius: unset !important;
  color: #000;
  text-decoration: underline dotted !important;
}
.toc-area-aside a,
.toc-area-content a {
  font-family: "Barlow Semi Condensed", sans-serif !important;
  font-weight: 400;
  text-align: left;
  line-height: 20px;
  letter-spacing: 0;
  border: none;
  box-shadow: none;
}
.toc-area-content a {
  font-size: 17px;
  color: #252525;
}
.toc-area-aside a {
  font-size: 16px;
  color: #000;
}

/* toogle */
.toggle-btn {
  position: absolute;
  right: 20px;
  width: 27px;
  height: 27px;
  background: url(../assets/images/chevron_rouge.svg) center top -7px / cover no-repeat;
  border: none;
  text-decoration: none;
}
.toc-area.is-opened .toggle-btn {
  background: url(../assets/images/croix.svg) center / cover no-repeat;
}

.controls {
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: #b9192f 1px dashed;
  border-bottom: #b8b8b8 1px solid;
  padding: 12px 0 9px;
}
.controls a {
  display: inline;
  font-family: "Barlow", sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-transform: uppercase;
  color: #4a4a4a;
  margin: 0;
}
.controls > a.toc-menu-toggle {
  font-size: 14px;
  color: #aeaeae;
  padding: 6px 10px;
  border: #aeaeae 1px solid;
  border-radius: 4px;
}
.controls > a.toc-menu-toggle.is-opened {
  color: #b9192f;
  border-color: #b9192f;
}
.controls ul {
  align-items: center;
}
.controls ul > li {
  margin: 0;
}
.controls ul > li > a {
  display: inline-block;
  width: 42px;
  height: 42px;
  margin-right: 10px;
}
.controls ul > li > a.access_link {
  vertical-align: center;
  display: inline;
  margin-left: 15px;
}
.controls a.text-btn {
  background: url(../assets/images/b_text_off.svg) center / cover no-repeat;
}
.text-mode .controls a.text-btn {
  background-image: url(../assets/images/b_text_on.svg);
}
.controls a.text-images-btn {
  width: 80px;
  background: url(../assets/images/b_text-image_off.svg) center / cover no-repeat;
  margin: 0 25px 0 15px;
}
.text-and-images-mode .controls a.text-images-btn {
  background-image: url(../assets/images/b_text-image_on.svg);
}
.controls a.images-btn {
  background: url(../assets/images/b_image_off.svg) center / cover no-repeat;
}
.images-mode .controls a.images-btn {
  background-image: url(../assets/images/b_image_on.svg);
}
.text-mode-only .controls a.text-btn {
  pointer-events: none;
}
.text-mode-only .controls a.text-images-btn,
.text-mode-only .controls a.images-btn {
  pointer-events: none;
  opacity: 0.2;
}
.controls a.pdf-btn {
  background: url(../assets/images/b_PDF.svg) center / cover no-repeat;
}
.controls a.xml-btn {
  background: url(../assets/images/b_XML.svg) center / cover no-repeat;
}
.document-area {
  width: 100%;
}
.document-area #aside,
.toc-area #aside {
  position: unset;
  float: none;
  margin: 0;
  background: none;
  border: none;
}
.document-area #aside header,
.toc-area #aside header {
  display: none;
}
.document-views {
  width: 100%;
}
.toc-area-aside {
  display: none;
}
.toc-aside-is-opened .toc-area-aside {
  display: flex;
  width: 220px;
}
.toc-aside-is-opened .document-views {
  flex: calc(100% - 220px);
}
.mirador-view {
  position: relative;
  min-height: 80vh;
  max-height: 100vh;
}
.text-mode .text-view,
.images-mode .mirador-view {
  flex: 100% 0 0;
  width: 100%;
}
.images-mode .text-view,
.text-mode .mirador-view {
  position: absolute;
  width: 500px;
  height: 700px;
  visibility: hidden;
}
.text-mode .mirador-view {
  flex: 100% 0 0;
}
.text-and-images-mode .text-view,
.text-and-images-mode .mirador-view {
  flex: 50% 0 0;
}

#center {
  width: 100%;
  margin: 0 !important;
}

#article {
  padding: 40px 10% 120px;
  border-bottom: 1px dotted #ffffff;
  min-height: 100%;
}
div.remove-bottom-padding #article {
  padding: 40px 10% 10px !important;
}

#article article {
  margin: 0;
}

#article > span.error > b {
  display: none;
}

#article h1,
#article .titlepage {
  font-family: "Barlow", sans-serif !important;
}

#article h1 {
  padding: 0;
  font-size: 25px;
  font-weight: 500;
  line-height: 33px;
  text-transform: none;
  color: #971716;
}

#article .titlepage {
  font-size: 18px;
  line-height: 25px;
}

#article .titlepage hr {
  width: 100%;
  margin: 60px 0 45px;
  border: dashed #b9192f 1px;
}

#article .titlepage,
#article .titlepage .forename {
  font-variant: small-caps;
  text-transform: none;
}

#article .titlepage .surname {
  text-transform: uppercase;
}

#article .titlepage .forename,
#article .titlepage .surname {
  font-size: 20px;
  font-weight: 500;
}
#article .titlepage .name {
  margin-bottom: 30px;
}
#article .titlepage .roleName {
  font-size: 16px;
  line-height: 22px;
  text-transform: uppercase;
  font-style: italic;
  color: #777;
}

#article section.div {
  border: none;
  padding-bottom: 0;
  padding-top: 40px;
  font-family: "Libre Baskerville", serif !important;
  font-size: 16px;
  text-align: left;
  font-weight: 400;
  line-height: 28px;
  color: #5f5f5f;
}

#article section.div h2.head {
  line-height: 115%;
  color: #971716;
  border-bottom: none;
  padding: 1em 0 0 0;
  margin: 35px 0 43px 0px;
  text-align: center;
  font-variant: small-caps;
}

#article section.div h3.head {
  color: #222222;
  margin: 35px 0 28px 0;
  border-bottom: 0px dotted;
  text-align: center;
  padding: 1em 0 0 1ex;
  font-weight: bold;
  text-transform: none;
}

#article section.div h4.head {
  text-align: center;
  color: #999;
  font-size: 15px;
  font-weight: bold;
  padding: 1em 0 1ex 2ex;
}

.toc-area-header a {
  color: inherit;
}

@media screen and (max-width: 1150px) {
  .toc-area .toc-area-content nav > ol.tree {
    columns: 2;
  }
  .controls > a.toc-menu-toggle {
    margin-left: 20px;
  }
  .controls ul > li > a.access_link {
    margin-right: 20px;
  }
}
@media screen and (max-width: 800px) {
  #article {
    padding: 40px 4% 120px;
  }
  .toc-area .toc-area-content aside {
    padding: 20px 20px !important;
  }
}
@media screen and (max-width: 640px) {
  .pb,
  .controls > a.toc-menu-toggle,
  .toc-area-aside {
    display: none !important;
  }
  .toc-area .toc-area-content nav > ol.tree {
    columns: 1;
  }
  .toggle-btn {
    width: 20px;
    right: 15px;
  }
  .controls {
    flex-wrap: wrap;
  }
  .controls ul:first-of-type {
    order: 3;
    flex: 100% 0 0;
    width: 100%;
    justify-content: center;
    padding: 20px 0 10px;
  }
  .controls ul:last-of-type {
    flex: 100% 0 0;
    justify-content: center;
  }
  .controls ul:last-of-type > li > a {
    width: 30px;
    height: 30px;
  }
  .controls > ul:first-of-type > li:nth-child(2) {
    display: none;
  }
  #article section.div {
    font-size: 14px;
    line-height: 24px;
  }
  #article h1 {
    font-size: 20px;
    line-height: 25px;
  }
  #article section.div h2.head,
  #article section.div h3.head {
    font-size: 14px;
    line-height: 24px;
  }
  #article section.div {
    padding-top: 10px;
  }
  #article p.p {
    text-align: left;
  }

  .text-and-images-mode .document-views {
    display: block !important;
  }
  .text-and-images-mode .text-view,
  .text-and-images-mode .mirador-view {
  }
}
* [class*="mirador-window-top-bar"] {
  border-top: none !important;
}
.ariane-collection {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1100px;
  margin-top: 10px;
  margin-bottom: 10px;

  font-family: "Barlow", sans-serif;
  font-size: 16px;
  & .crumbs {
    padding-bottom: 5px;
  }
}
.ariane {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80% !important;
  max-width: 1100px !important;

  font-family: "Barlow", sans-serif !important;
  font-size: 16px;

  & > ul {
    display: flex;
    justify-content: center;
    align-items: center;

    & > li:first-child {
      font-variant: small-caps;
      font-weight: bold;
    }
  }
}
.crumbs {
  width: 100%;
}
.crumbs li + li:before {
  width: 100% !important;
  padding: 20px !important;
}

.crumbs li {
  width: 100% !important;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 20px;
  margin-right: 20px;

  &.is-current {
    display: flex;
    justify-content: center;
    align-items: center;
    & a {
      display: flex;
      justify-content: center;
      width: 100%;
      color: #336;
      border: none;
      &:hover {
        color: #B9192F;
      }
    }
  }
  &:not(.is-current) {
    & a {
      display: flex;
      justify-content: center;
      width: 100% !important;

      color: #4a4a4a;
      border: none;

      &:hover {
        color: #B9192F !important;
      }
    }
  }
}

.navigation-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  vertical-align: center;
  margin-bottom: 20px;
}
.navigation-document {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}
.navigation-document-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}
.navigation-document-bottom {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  width: 100%;
}
/*.is-current {
  font-weight: bold;
}*/
.several-parent {
  display: flex;
  flex-direction: row;
  justify-content: center;
  & > a:first-child {
    justify-content: right !important;
  }
  & > a:not(:first-child) {
    justify-content: left !important;
    color: #929292 !important;

    &:before {
      content: ' (autres collections : ';
      white-space: pre;
    }

    &:after {
      content: ') ';
      white-space: pre;
    }
  }
}
.left {
	/* The left side CANNOT GROW, it can ONLY SHRINK (and add an ellipsis at the end). */
  text-align: right;
  width: 50%;
	flex: 0 1 auto;
	overflow: hidden;
	text-overflow: ' [...] ';
	white-space: pre;
}

.right {
	/* The right side can grow, but NOT SHRINK. */
  text-align: left;
  width: 50%;
	flex: 1 0 auto;
	overflow-x: hidden;
	white-space: pre;
}
/*.hideAsideToc {
  visibility: hidden;
}*/
</style>