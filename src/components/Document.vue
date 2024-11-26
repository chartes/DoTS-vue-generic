<template>
  <div class="container">
    <div class="row" :class="currentLevel < editorialLevel ? 'remove-bottom-padding' : ''">
      <Suspense>
        <component :is="customDocument"/>
      </Suspense>
    </div>
    <div
      v-if="currentLevel < editorialLevel"
      id="article"
      class="row bottom-toc"
    >
      <TOC
       :toc="asideTOC"
       :maxcitedepth="maxcitedepth"
       :refid="parentId.includes('&ref=') ? parentId.split('&ref=')[1] : parentId"
       :key="parentId"
      />
    </div>
  </div>
</template>

<script>
import {defineAsyncComponent, ref, watch, watchEffect, nextTick, reactive} from "vue";
import { getDocumentFromApi } from "@/api/document";
import { useRoute } from "vue-router";
import TOC from "@/components/TOC.vue";

const VITE_APP_IIIF_URL = `${import.meta.env.VITE_APP_IIIF_URL}`;

export default {
  name: "Document",
  computed: {
    TOC() {
      return TOC
    }
  },
  components: {TOC},

  props: ["id", "level", "editoriallevel", "asidetoc", "maxcitedepth"],

  setup(props) {

    const parentId = ref(props.id);
    console.log("Document.vue const props.id / parentId", props.id, parentId)

    const currentLevel = ref(props.level);
    console.log("Document.vue const currentLevel", currentLevel)

    const editorialLevel = ref(props.editoriallevel);
    console.log("Document.vue const editorialLevel", editorialLevel)

    const asideTOC = reactive(props.asidetoc);
    console.log("Document.vue const asideTOC", props.asidetoc)

    console.log("Document.vue props.maxcitedepth", props.maxcitedepth)

    let customDocument = loadDoc()

    function loadDoc() {
      return defineAsyncComponent(async () => {
        // fetch the initial template
        console.log("Document.vue check currentLevel vs editorialLevel", currentLevel.value, editorialLevel.value)
        let data = ""
        if (currentLevel.value < editorialLevel.value) {
          console.log("Document.vue get excludeFragments=(true)",currentLevel.value < editorialLevel.value)
          data = await getDocumentFromApi(parentId.value, true);
        } else {
          console.log("Document.vue get excludeFragments=(false)",currentLevel.value < editorialLevel.value)
          data = await getDocumentFromApi(parentId.value);
        }

        console.log("Document.vue getDocumentFromApi(parentId.value)", parentId.value)
        // build a temporary dom just to ease the navigation inside the document
        let tmpDom = document.createElement("div");
        tmpDom.innerHTML = data;

        // customize the template with some vue components and code
        let frameNum = 1;
        tmpDom.querySelectorAll("a.pb.facs").forEach((a) => {
          const container = document.createElement("div");
          // TODO: gérer ce lowercase un peu gênant
          const canvadId = `${VITE_APP_IIIF_URL}/${props.id.toLowerCase()}/canvas/f${frameNum}`;
          container.innerHTML = `<page-break canvas-id="${canvadId}" canvas-num="${frameNum}" image="${a.href}"/>`;
          frameNum += 1;
          // replace the link with a PageBreak component
          a.parentNode.replaceChild(container.firstChild, a);
        });

        /*const toc = tmpDom.querySelector("#aside");

        const tocAreaDest = document.querySelector("#toc-area");
        if (tocAreaDest.firstChild) tocAreaDest.removeChild(tocAreaDest.firstChild);
        tocAreaDest.appendChild(toc);

        const tocAsideDest = document.querySelector("#toc-area-aside");
        if (tocAsideDest.firstChild) tocAsideDest.removeChild(tocAsideDest.firstChild);
        tocAsideDest.appendChild(toc.cloneNode(true));*/

        // return what will make the async component
        return new Promise((resolve) => {
          let doc = new DOMParser().parseFromString(tmpDom.innerHTML, "text/html");
          resolve({
            template: doc.getElementById("center").innerHTML,
          });
        });
      });
    }
    watch(
  () => props.asidetoc,
    () => {
      console.log("Document.vue watch props.asidetoc", props.asidetoc)

      }
    )

    /*watch(
  () => props.id,
    () => {
      console.log("Document.vue watch props.id", props.id)
      parentId.value = props.id
      customDocument.value = loadDoc()
      }
    );
    watch(
  () => props.level,
    async () => {
      console.log("Document.vue watch props.level", props.level)
      currentLevel.value = props.level
      console.log("Document.vue watch currentLevel.value", currentLevel.value)
      customDocument.value = loadDoc()
      await nextTick
    },
        {deep: true, immediate: true}
    );*/

    /*const route = useRoute()
    let hash = route.hash ? route.hash : ''
    function scrollTo(h) {
      if (h.length) {
        //console.log("scrollTo hash", h)
        location.hash = h
      }
    }
    const goToHash = (hash) => {
        scrollTo(hash)
      }*/
    return {
      parentId,
      currentLevel,
      editorialLevel,
      asideTOC,
      customDocument
    };
  },
};
</script>

<style src="@/assets/css/html.css" id="document-html-css">
header {
  clear: both;
  padding: 1ex;
  border: dashed #ccc 1px;
  -webkit-border-radius: 1ex;
  -moz-border-radius: 1ex;
  border-radius: 1ex;
}
.bottom-toc {
  padding: 0 10% 10% 120px;
  border-bottom: 1px dotted #ffffff;
  min-height: 100%;
}
</style>
<style src="@/assets/css/postprod.css"/>
