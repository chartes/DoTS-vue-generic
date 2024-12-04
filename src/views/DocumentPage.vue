<template>
  <div class="is-flex is-flex-direction-column" :class="viewModeCssClass">
    <div v-if="parentCollectionId">
      <liste-these-annee
        v-if="parentCollectionId"
        class="liste-theses-area app-width-padding"
        :id="parentCollectionId"
        :textid="resourceId"
      />
      <document-metadata
          v-if="metadata"
          :metadata="metadata"
          class="metadata-area app-width-margin"
      />
    </div>
    <div class="toc-area app-width-margin" :class="tocCssClass">
      <div class="toc-area-header">
        <a href="#" v-on:click="toggleTOCContent">SOMMAIRE</a>
        <a href="#" class="toggle-btn" v-on:click="toggleTOCContent"></a>
      </div>
      <div class="toc-area-content toc-content">
        <aside id="aside">
          <nav>
            <nav>
              <TOC
               :toc="topTOC.value"
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
        :class="TOCMenuBtnCssClass"
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
        <li><a v-if="metadata.downloadPDF" target="_blank" v-bind:href="metadata.downloadPDF" class="pdf-btn" aria-label="Télécharger le PDF"></a></li>
        <li><a target="_blank" v-bind:href="metadata.downloadXML" class="xml-btn" aria-label="Télécharger le XML"></a></li>
        <li><a v-if="metadata.thenca" target="_blank" v-bind:href="metadata.thenca" class="access_link">Accès à la thèse</a></li>
      </ul>
    </nav>
    <div class="navigation-row is-flex is-justify-content-space-between">
      <!--<to-previous-button
        v-if="!refId || refId && refId.length === 0"
        :class="previousDocId.length > 0 ? '' : 'disabled'"
        class="to-previous-button-page"
        :docid="resourceId"
        :previousdocid="previousDocId"
      />-->
      <to-previous-button
        class="to-previous-button-page"
        :class="!refId || firstRef ? 'disabled' : ''"
        :refid="refId"
        :previousrefid="previousRefId"
        @click="getNewRefId"
      />
      <div class="is-flex is-justify-content-center is-align-items-center app-width-margin">
        <ul class="is-flex is-justify-content-center is-align-items-center crumbs">
          <li
            v-for="(item, index) in ancestors.value" :key="index"
          >
            <router-link
              v-if="item.level <= 0"
              :to="{ name: 'Document', params: {id: item.identifier} }"
              >
              {{ item.title }}
            </router-link>
            <router-link
              v-else
              :to="{ name: 'Document', params: {id: resourceId}, query: { refId: item.link_type === 'hash' ? item.ancestor_editorialLevel : item.identifier }, hash: item.link_type === 'hash' ? item.url : false}"
            >
              {{ item.dublincore && item.dublincore.title ? item.dublincore.title : item.extensions["tei:role"] ? item.extensions["tei:role"] : item.citeType && item.extensions["tei:num"] ? item.citeType + ' ' + item.extensions["tei:num"] : "pas de titre" }}
            </router-link>
          </li>
        </ul>
      </div>
      <to-next-button
        class="to-next-button-page"
        :class="!refId || lastRef ? 'disabled' : ''"
        :refid="refId"
        :nextrefid="nextRefId"
        @click="getNewRefId"
      />
      <!--<to-next-button
      v-if="!refId || refId && refId.length === 0"
      :class="nextDocId.length > 0 ? '' : 'disabled'"
      class="to-next-button-page"
      :docid="resourceId"
      :nextdocid="nextDocId"
      />
      <to-next-button
        v-else
        :class="nextRefId.length > 0 && !lastRef ? '' : 'disabled'"
        class="to-next-button-page"
        :refid="refId"
        :nextrefid="nextRefId"
        @click="getNewRefId"
      />-->
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
            :editoriallevel="editorialLevel"
            :asidetoc="asideTOC.value"
            :maxcitedepth="TOC_DEPTH"
            :key="resourceId" />
        </div>
        <div v-else class="text-view" id="text-view">
          <document
            :id="resourceId + '&ref=' + refId"
            :level="currentLevel"
            :editoriallevel="editorialLevel"
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
  inject,
} from "vue"
import { onBeforeRouteUpdate, useRoute } from "vue-router"


const PROJECT = `${import.meta.env.VITE_APP_PROJECT}`

const sources = [
  { name: "data_bnf", ext: "data.bnf.fr" },
  { name: "dbpedia", ext: "dbpedia.org" },
  { name: "idref", ext: "idref.fr" },
  { name: "catalogue_bnf", ext: "catalogue.bnf.fr" },
  { name: "wikidata", ext: "wikidata" },
  { name: "wikipedia", ext: "wikipedia" },
  { name: "thenca", ext: "thenca" },
  { name: "hal", ext: "hal" },
  { name: "benc", ext: "koha" },
  {},
]

function findSource(id) {
  let i = 0;
  let source = null;

  do {
    source = id.includes(sources[i].ext) ? sources[i] : null;
    i++;
  } while (i < sources.length && source === null);

  if (source) {
    return source.name;
  }

  return null;
}
function getSimpleObject(obj) {
  return {
    identifier: obj['@id'],
    type: obj['@type'],
    title: obj.title,
    level: obj.level,
    totalChildren: obj.totalChildren,
    member: obj.member,
    parent: obj.parent,
    dublincore: obj.dublincore,
    extensions: obj.extensions
  }
}

export default {
  name: "DocumentPage",
  components: {
    ListeTheseAnnee,
    DocumentMetadata,
    Document,
    TOC,
    ToPreviousButton,
    ToNextButton
  }, //DocumentMetadata, ListeTheseAnnee

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

    const metadata = reactive({
      sudoc: null,
      benc: null,
      thenca: null,
      iiifManifestUrl: null,
      hal: null,
      downloadPDF: null,
      downloadXML: null,

      author: null,
      title: null,
      data_bnf: null,
      dbpedia: null,
      idref: null,
      catalogue_bnf: null,
      wikidata: null,
      wikipedia: null,
      rights: null,
    })
    const route = useRoute()
    const store = useStore()

    const resourceId = ref()
    const currentItem = ref({})
    const documentType = ref()
    let parentCollectionId = ref()
    let collection = ref()

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
        resourceId.value = route.params.id
        store.commit('setResourceId', route.params.id)

        let response = await getMetadataFromApi(resourceId.value);
        let parentResponse = await getParentFromApi(response['@id'])
        //console.log("parentResponse", parentResponse["member"][0])

        if (response["@type"] === "Resource") {
          documentType.value = "Resource"
          currentItem.value = getSimpleObject(response)
          currentItem.value.parent = parentResponse["member"][0]['@id']
          currentItem.value.level = 0
          store.commit('setCurrentItem', currentItem.value)
          console.log("init type : ", documentType.value)
        } else {
          documentType.value = "Collection"
          currentItem.value = getSimpleObject(response)
          currentItem.value.parent = parentResponse["member"] ? parentResponse["member"][0]['@id'] : null
          currentItem.value.level = -1
          store.commit('setCurrentItem', currentItem.value)
          console.log("init type : ", documentType.value)
        }
        // if route param id is fragment -> get its parent resourceId and store in Store
      }
    }
    const isLoading = ref(false)
    const TOC_DEPTH = ref(parseInt(`${import.meta.env.VITE_APP_TOC_DEPTH}`))
    const currentLevel = ref(1)
    const editorialLevel = ref(parseInt(`${import.meta.env.VITE_APP_EDITORIAL_LEVEL}`))
    let flatTOC = reactive([])
    let topTOC = reactive([])
    let asideTOC = reactive([])
    const refId = ref(false)
    const hash = ref(false)
    if (Object.keys(route.query).length > 0 && Object.keys(route.query).includes("refId")) {
      refId.value = route.query.ref
    }
    if (route.hash && route.hash.length > 0) {
      hash.value = route.hash
    }
    let ancestors = reactive([])

    let yearsWithAdditionalPositions = []
    let allItemsIds = []
    const previousDocId = ref("")
    const nextDocId = ref("")
    const previousRefId = ref("")
    const nextRefId = ref("")
    const firstRef = ref(false)
    const lastRef = ref(false)



    const getMetadata = async () => {
      console.log("getMetadata : ", resourceId.value)
      let listmetadata = {}
      if (documentType.value === "Resource") {
        listmetadata = await getMetadataFromApi(resourceId.value, "Resource");
      } else {
        listmetadata = await getMetadataFromApi(resourceId.value, "Collection");
      }

      var htmlnamespace = Object.keys(listmetadata["@context"]).find((k) =>
          listmetadata["@context"][k].includes("html")
      );
      console.log("htmlnamespace:", htmlnamespace)
      console.log("listmetadata:", listmetadata)

      const dublincore = listmetadata.dublincore ? listmetadata.dublincore : null
      const extensions = listmetadata.extensions ? listmetadata.extensions : null
      console.log("---------");
      console.log("dublincore:", dublincore)

      if (documentType.value === "Resource") {

        if (dublincore) {
          metadata.author = dublincore.creator ? dublincore.creator : null
          metadata.date = dublincore.date ? dublincore.date : null
        }
        if (extensions) {
          if (Array.isArray(listmetadata.extensions.download)) {
            for (let meta of listmetadata["extensions"]["download"]) {
              if (meta.includes(".PDF")) {
                metadata.downloadPDF = meta
              }
              if (meta.includes("document")) {
                metadata.downloadXML = meta
              }
            }
          } else {
            metadata.downloadXML = listmetadata.extensions.download
            metadata.downloadPDF = null
          }
          metadata.download = listmetadata["download"]
          metadata.page = extensions["dct:extend"] ? extensions["dct:extend"] : null
          metadata.coverage = extensions["dct:coverage"] ? extensions["dct:coverage"] : null
          metadata.rights = extensions["dct:rights"] ? extensions["dct:rights"] : null
          metadata.title = extensions[htmlnamespace + ":h1"] ? extensions[htmlnamespace + ":h1"] : null
        }



        /*const dublincore = listmetadata["dublincore"];
        const extensions = listmetadata["extensions"];
        console.log("---------");
        console.log("dublincore:", dublincore);*/
        try {
          metadata.iiifManifestUrl = extensions["dct:source"][0]["@id"];
          layout.imageIsAvailable.value = true;
        } catch {
          metadata.iiifManifestUrl = "";
          //TODO: resolve why layout undefined and uncomment
          //layout.imageIsAvailable.value = false;
        }

        console.log("metadata.iiifManifestUrl:", metadata.iiifManifestUrl);
        console.log("metadata:", metadata);

        if (dublincore && extensions) {
          // reset the sources
          for (let s of sources) {
            metadata[s.name] = null;
          }

          // wikidata test 26/11/2024
          metadata.wikidata = extensions.creator_wikidata_url ? extensions.creator_wikidata_url : null
          metadata.rights = extensions["dct:license"] ? extensions["dct:license"] : null
          metadata.title = metadata.title ? metadata.title : dublincore.title ? dublincore.title : null

          metadata['dublincore'] = {}
          metadata['extensions'] = {}
          for (let keydub of Object.keys(dublincore)) {
            metadata['dublincore'][keydub] = dublincore[keydub]
          }
          for (let keyext of Object.keys(extensions)) {
            metadata['extensions'][keyext] = extensions[keyext]
          }

          // benc & sudoc & thenca
          if (extensions["dct:isVersionOf"]) {
            for (const member of extensions["dct:isVersionOf"]) {
              if (member["@id"]) {
                const source = findSource(member["@id"]);
                if (source) {
                  metadata[source] = member["@id"];
                  console.log("source found:", source, member["@id"]);
                }
              }
            }
          }

          // creators
          if (Array.isArray(extensions["dct:creator"])) {
            for (let aut of extensions["dct:creator"]) {
              if (aut["@id"]) {
                // find the source name from its extension
                const source = findSource(aut["@id"]);
                if (source) {
                  metadata[source] = aut["@id"];
                  console.log("source found:", source, aut["@id"]);
                }
              }
            }
          }
        }
      } else {
        console.log("getMetadata this is a collection !!!!!!!!!")
      }
    }

    const getParentCollection = async () => {
      let parentCollection = await getParentCollectionFromApi(resourceId.value)
      parentCollectionId.value = parentCollection["member"] ? parentCollection["member"][0]["@id"] : null
      console.log("parentCollectionId", parentCollectionId)
    }


    // Setting up the Tables Of Content Top and Left
    const getTOC = async () => {
      console.log("DocumentPage setup const getTOC resourceId.value", resourceId.value)
      /*if (!flatTOC || !flatTOC.length > 0) {
        let response = await getTOCFromApi(resourceId.value, documentType.value);
        flatTOC = response.member
        console.log("setup flatTOC : ", flatTOC)
      }*/
      let response = await getTOCFromApi(resourceId.value, documentType.value);
      console.log("initial response", response)
      if (response.member && documentType.value === 'Collection') {
        response.member.forEach((m) => m.parent = response['@id'])
        response.member.forEach((m) => m.level = store.state.currentItem.level + 1)
        response.member.forEach((m) => m.identifier = m['@id'])
      }
      let parentNode = {}
      if (documentType.value === "Resource") {
        let parentResponse = await getParentFromApi(response.resource['@id'])
        parentNode = parentResponse
        parentNode.level = 0
      } else {
        let parentResponse = await getParentFromApi(response['@id'])
        parentNode = parentResponse
        parentNode.level = -1
      }

      console.log("initial parentNode", parentNode)
      flatTOC = []
      console.log("initial flatTOC", flatTOC)
      let initflatTOC = [response]
      if (response.resource) {
        response.resource.parent = parentNode.member ? parentNode.member[0]['@id'] : null
        response.resource.level = 0
      }

      console.log("initial2 flatTOC", initflatTOC)
      flatTOC = [store.state.currentItem, ...response.member]
      flatTOC.filter(item => item.level === 1).forEach((i) => {i.parent = resourceId.value})
      console.log("initial3 flatTOC", flatTOC)


      let loopParent = parentNode

      while(loopParent.member) {
        console.log("loopParent.member", loopParent.member)
        let parentTOC = await getMetadataFromApi(loopParent["member"][0]['@id'])
        console.log("initial parentTOC", parentTOC)
        console.log("parentNode[\"member\"][0]['@id']", loopParent["member"][0]['@id'])
        let parentResponse = await getParentFromApi(parentTOC['@id'])
        parentResponse.level = loopParent.level - 1
        console.log("parentResponse", parentResponse)
        parentTOC.parent = parentResponse.member ? parentResponse.member[0]['@id'] : null
        parentTOC.level = parentResponse.level
        console.log("parentTOC", parentTOC)
        console.log("parentTOC flatTOC", flatTOC)
        flatTOC = [getSimpleObject(parentTOC), ...flatTOC]
        console.log("flatTOC + parentTOC", flatTOC)
        loopParent = parentResponse
      }
      console.log("setup afterParents flatTOC : ", flatTOC)


      let maxTocDepth = Math.max(...flatTOC.map(item => item.level))
      console.log("document DoTS maxTocDepth : ", maxTocDepth)

      editorialLevel.value = parseInt(`${import.meta.env.VITE_APP_EDITORIAL_LEVEL}`)
      console.log("USER editorialLevel.value / typeof : ", editorialLevel.value, typeof(editorialLevel.value))
      editorialLevel.value = editorialLevel.value > maxTocDepth ? 1 : editorialLevel.value
      console.log("VALIDATED editorialLevel.value / typeof : ", editorialLevel.value, typeof(editorialLevel.value))

      console.log("currentLevel / typeof : ", currentLevel, typeof(currentLevel))

      console.log("TOC_DEPTH.value / typeof : ", TOC_DEPTH.value, typeof(TOC_DEPTH.value))

      if (refId.value) {
        console.log("there is a refId , update currentLevel", flatTOC.filter(item => item.identifier === refId.value)[0].level)
        currentLevel.value = flatTOC.filter(item => item.identifier === refId.value)[0].level
        console.log("there is a refId , updated currentLevel", currentLevel.value)
      } else {
        console.log("there is NO refId , update currentLevel to 0", 0)
        currentLevel.value = 0
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

      topTOC.value = list_to_tree(flatTOC, editorialLevel.value)
      topTOC.value = findById(topTOC.value, resourceId.value).children

      function list_to_tree(flat_toc, level) {
        var map = {}, node, roots = [], i;
        let editorial_level_node = {}
        for (i = 0; i < flat_toc.length; i += 1) {
          map[flat_toc[i].identifier] = i; // initialize the map
          flat_toc[i].children = []; // initialize the children
        }
        let ancestor_editorialLevel = ""
        for (i = 0; i < flat_toc.length; i += 1) {
          node = flat_toc[i];
          //console.log("node / currentLevel : ", node, currentLevel)
          /*if (refId.value && node.level < level) {

            node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}?refId=${node.identifier}`
            //console.log("node cond1 : ", node)
          } else if (refId.value && node.level === level && node.identifier === refId.value) {

            node.url = `#${node.identifier}`
            //console.log("node cond2 : ", node)
          } else if (refId.value && node.level === level && node.identifier !== refId.value) {
            editorial_level_node = node
            node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}?refId=${node.identifier}`
            //console.log("node cond3 : ", node)
          } else if (refId.value && node.level > level && !flat_toc[map[node.parent]].url.includes(refId.value)) {
            node.url = `${editorial_level_node.url}#${node.identifier}`
            console.log("node cond4 : ", node)
          } else if (refId.value && node.level > level && flat_toc[map[node.parent]].url.includes(refId.value)) {
            node.url = `#${node.identifier}`
            console.log("node cond5 : ", node)
          } else {
            console.log("node cond6 : ", node)
            node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}?refId=${node.identifier}`
          }*/
          if (node.level <= 0) {
            //console.log("node level < editorial level : ", node)
            node["link_type"] = "link"
            node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}/document/${node.identifier}`
            console.log("higher levels node url: ", node)
          } else if (node.level < level && level > 0) {
            //console.log("node level < editorial level : ", node)
            node["link_type"] = "link"
            node.url = `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}?refId=${node.identifier}`
          } else if (node.level === level){
            //console.log("node level === editorial level : ", node)
            ancestor_editorialLevel = node.identifier
            node["link_type"] = "link"
          } else {
            //console.log("node level > editorial level : ", node)
            node["ancestor_editorialLevel"] = ancestor_editorialLevel
            node["link_type"] = "hash"
            node.url = `#${node.identifier}`
          }
          if (node.parent && node.parent.length > 0) {
            // TODO? if you have dangling branches check that map[node.parent] exists
            flat_toc[map[node.parent]].children.push(node);
          } else {
            roots.push(node);
          }
        }
        return roots;
      }

      if (refId.value) {

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
        asideTOC.value = topTOC.value
        console.log("asideToc cas 3 :", asideTOC.value, topTOC.value)
      }

      let currentItem = hash.value ? hash.value.replace('#', '') : refId.value ? refId.value : resourceId.value
      console.log("ancestors currentItem : ", currentItem)
      function findAncestors(item, directory) {
        if (item.parent === null) return [item];

        const parent = directory.find(i => i.identifier === item.parent);

        return [
            item,
          parent,
          ...findAncestors(parent, directory),
        ];
      }
      console.log("ancestors flatTOC", flatTOC)
      ancestors.value = flatTOC
    // Filter the items down to the ones we care about
      .filter(item => item.identifier === currentItem)
      // Map each item to an array of its ancestors
      .map(item => findAncestors(item, flatTOC))
      // Flatten the array of arrays into an array of items
      .flat()
      // De-duplicate the result
      .reduce((output, item) => {
        return !output.includes(item)
          ? [...output, item]
          : output;
      }, [])
          .filter(item => item.level <= editorialLevel.value)
          .sort((a, b) => a.level - b.level)
//.concat({identifier: resourceId, level: 0, link_type: "link", url: `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}`})


      console.log("getTOC ancestors : ", editorialLevel, refId.value, ancestors.value)

      console.log("getTOC result topTOC : ", topTOC.value)
      console.log("getTOC result asideTOC : ", asideTOC.value)
      isLoading.value = true
    }



    const getAllPositionsYears = async () => {
      console.log("getAllPositionsYears start")
      // get parent's collection of current id
      let parentCollection = await getParentCollection()
      console.log("getAllPositionsYears parentCollection", parentCollection)
      if (parentCollectionId.value) {
        const data = await getMetadataFromApi(parentCollectionId.value);
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
      let editorialFlatTOC = flatTOC.filter(item => item.level <= editorialLevel.value)
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
      console.log("getNewRefId check if refId.value", refId.value)
      if (refId.value) {
        firstRef.value = false
        lastRef.value = false
        console.log("getNewRefId flatToc ", flatTOC)
        //filter TOC to get only editorial level items
        let editorialFlatTOC = flatTOC.filter(item => item.level <= editorialLevel.value && item.level >0 )
        console.log("function getNewRefId editorialFlatTOC", editorialFlatTOC)
        let currentItem = editorialFlatTOC.find(item => item.identifier === refId.value)
        console.log("function getNewRefId currentItem", currentItem)
        let currentItemIndex = currentItem ? editorialFlatTOC.findIndex(item => item.identifier === refId.value) : -1
        console.log("function getNewRefId currentItemIndex", currentItemIndex)
        /*let lastItem = editorialFlatTOC.slice(-1)[0]
        console.log("function getNewRefId lastItem", editorialFlatTOC.slice(-1)[0])*/
        if (currentItemIndex === 0) {
          //this is the first item in editorial levels
          console.log("function getNewRefId this is the first item")
          previousRefId.value = ""
          firstRef.value = true
        } else {
          //this is not the first item in editorial levels : find previous
          console.log("function getNewRefId this is NOT the first item : ", editorialFlatTOC[currentItemIndex - 1])
          previousRefId.value = editorialFlatTOC[currentItemIndex - 1].identifier
          console.log("function getNewRefId previousRefId.value : ", previousRefId.value)
        }
        if (currentItemIndex === editorialFlatTOC.length - 1) {
          //this is the last item in editorial levels
          console.log("function getNewRefId this is the last item")
          nextRefId.value = ""
          lastRef.value = true
        } else {
          //this is not the last item in editorial levels : find next
          console.log("function getNewRefId this is NOT the last item : ", editorialFlatTOC[currentItemIndex + 1])
          nextRefId.value = editorialFlatTOC[currentItemIndex + 1].identifier
          console.log("function getNewRefId nextRefId.value : ", nextRefId.value)
        }
      } else {
        previousRefId.value = ""
        nextRefId.value = ""
      }
    }
    /*const getNewRefId = function () {
      firstRef.value = false
      lastRef.value = false
      console.log("getNewRefId flatToc ", flatTOC)
      //get the TOC item level in order to navigate only in items of the same level
      let previousRefLevel = flatTOC.filter(i => i.identifier === refId.value)[0].level
      //find the index of the previous TOC item of the same level
      let previousRefIdIndex = flatTOC.filter(i => i.level === previousRefLevel).findIndex(i => i.identifier === refId.value) - 1
      console.log("flatTOC.filter(i => i.level === previousRefLevel).findIndex(i => i.identifier === refId.value) - 1", flatTOC.filter(i => i.level === previousRefLevel).findIndex(i => i.identifier === refId.value) - 1)
      //get the id of the previous TOC item of the same level based on the index found above

      if (previousRefIdIndex < 0) { //flatTOC.filter(i => i.level === previousRefLevel).length
        previousRefId.value = refId
        firstRef.value = true
      } else {
        previousRefId.value = flatTOC.filter(i => i.level === previousRefLevel)[previousRefIdIndex].identifier
      }
      console.log("previousRefLevel", previousRefLevel)
      console.log("previousRefId", previousRefId.value)

      let nextRefLevel = flatTOC.filter(i => i.identifier === refId.value)[0].level
      //find the index of the next TOC item of the same level
      let nextRefIdIndex = flatTOC.filter(i => i.level === nextRefLevel).findIndex(i => i.identifier === refId.value) + 1
      //get the id of next the TOC item of the same level based on the index found above

      if (nextRefIdIndex === flatTOC.filter(i => i.level === nextRefLevel).length) {
        nextRefId.value = refId
        lastRef.value = true
      } else {
        nextRefId.value = flatTOC.filter(i => i.level === nextRefLevel)[nextRefIdIndex].identifier
      }
      console.log("nextRefLevel", nextRefLevel)
      console.log("nextRefId", nextRefId.value)
    }*/


    const setMirador = function () {
      if (metadata.iiifManifestUrl.length > 0) {
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

    function scrollTo(h) {
      if (h.length) {
        console.log("scrollTo hash", h)
        location.hash = h
      }
    }

    watch(
        () => metadata.iiifManifestUrl,
        async () => {
          setMirador();
        }
    );
    watch(route, async () => {
      isLoading.value = false
      console.log("Document page watch route.params : ", route.params)
      console.log("Document page watch route.query : ", route.query)
      console.log("Document page watch route.hash : ", route.hash)
      await getCurrentItem("watch", route)


      if (Object.keys(route.query).length > 0 && Object.keys(route.query).includes("refId")) {
        console.log("watch route.query.refId : ", route.query.refId ? route.query.refId : false)
        resourceId.value = route.params.id
        refId.value = route.query.refId
        currentLevel.value = flatTOC.filter(item => item.identifier === refId.value)[0].level
        console.log("Updating hash1", route.hash)
        hash.value = route.hash && route.hash.length > 0 ? route.hash : false
        await getTOC()
        await getMetadata();
        await getParentCollection();
        await getAllPositionsYears();
        scrollTo(hash.value)
        getNewRefId()
      } else {
        console.log("Document page watch route.query is now removed : ", route.query)
        resourceId.value = route.params.id;
        refId.value = false
        currentLevel.value = store.state.currentItem['@type'] === 'Resource' ? 0 : -1
        console.log("Updating hash2", route.hash)
        hash.value = route.hash && route.hash.length > 0 ? route.hash : false
        await getTOC()
        await getMetadata();
        await getParentCollection();
        await getAllPositionsYears();
        scrollTo(hash.value)
        getNewRefId()
      }
    },
        {deep: true, immediate: true}
    );

    /*onBeforeRouteUpdate(async (to, from) => {
      isLoading.value = false
      await getCurrentItem("onBeforeRouteUpdate", to)
      editorialLevel.value = (parseInt(`${import.meta.env.VITE_APP_EDITORIAL_LEVEL}`))

      //if (Object.keys(to.query).length > 0 && Object.keys(to.query).includes("refId")) {
      console.log("onBeforeRouteUpdate check to.query.refId !== from.query.refId", to.query.refId !== from.query.refId)
      if (to.query.refId !== from.query.refId || to.params.id !== from.params.id) {
        if (to.query.refId !== from.query.refId) {
          refId.value = to.query.refId
          if (Object.keys(to.query).length > 0 && Object.keys(to.query).includes("refId")) {
            console.log("onBeforeRouteUpdate updating currentLevel", currentLevel.value)
            currentLevel.value = flatTOC.filter(item => item.identifier === refId.value)[0].level
            console.log("onBeforeRouteUpdate updatED currentLevel", currentLevel.value)
          }
        }
        if (to.params.id !== from.params.id) {
          console.log("onBeforeRouteUpdate to.params.id", to.params.id)
          resourceId.value = to.params.id
          console.log("onBeforeRouteUpdate resourceId.value", resourceId.value)
        }
        console.log("onBeforeRouteUpdate getMetadata")
        await getMetadata();
        await getParentCollection();
        await getTOC();
        await getAllPositionsYears();
      }


    });*/

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


    //const route = useRoute();
    await getCurrentItem("setup", route)
    console.log("main getMetadata")
    await getMetadata(route.params.id);
    await getParentCollection(route.params.id);
    console.log("setup route.params.id", route.params.id)
    await getTOC(route.params.id);
    console.log("VITE_PROJECT await : ", PROJECT)
    if (route.params.project === 'ENCPOS') {
      await getAllPositionsYears('ENCPOS')
      console.log("DocumentPage route.params.project : ", PROJECT)
    } else {
      console.log("getting all positions years for project :", PROJECT)
      await getAllPositionsYears()
    }
    if (refId && refId.value) {
      getNewRefId()
    }
    getNewRefId()


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
      editorialLevel,
      currentLevel,
      flatTOC,
      topTOC,
      asideTOC,
      ancestors,
      refId,
      getNewRefId,
      previousDocId,
      nextDocId,
      previousRefId,
      nextRefId,
      firstRef,
      lastRef
    }
  }
}
</script>

<style>
.liste-theses-area {
  background-color: #fbf8f4;
  padding-top: 50px;
  padding-bottom: 50px;
  margin-bottom: 28px;
}
.metadata-area {
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
  text-decoration: none;
  border: none;
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
  columns: 4;
  gap: 40px;
}
.toc-content > aside > nav > nav > ol.tree > li {
  text-transform: uppercase;
  margin-bottom: 20px;
  padding: 0;
}
.toc-content > aside > nav > nav > ol.tree > li.more > a {
  display: inline-block;
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
  padding: 40px 10% 0px !important;
}

#article article {
  margin: 0;
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

.crumbs {
  margin-top: 20px;
}
.crumbs li + li:before {
  padding: 20px !important;
  content: "/";
}
.crumbs li a:hover {
  color: red !important;
}
.navigation-row{
  vertical-align: center;
  margin-bottom: 20px;
}
</style>