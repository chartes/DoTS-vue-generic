<template>
  <div class="container">
    <div class="row" :class="currentLevel < editorialLevel ? 'remove-bottom-padding' : ''">
      <Suspense @resolve="scrollTo()">
        <component :is="customDocument"/>
      </Suspense>
    </div>
    <!-- Display a TOC of the current item children in 2 scenarios : -->
    <!-- When the selected item is hierarchically above editorial level -->
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
    <!-- Or the specific case of Collections when editorial level & current level are 0 -->
    <!-- For example : to be able to have a TOC on Collection ENCPOS, edited at the full position level (0) -->
    <div
      v-else-if="currentLevel === editorialLevel && editorialLevel === 0 && documentType === 'Collection'"
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
import { defineAsyncComponent, ref, reactive } from "vue";
import { getDocumentFromApi } from "@/api/document";
import { useRoute } from "vue-router";
import TOC from "@/components/TOC.vue";

const VITE_APP_IIIF_URL = `${import.meta.env.VITE_APP_IIIF_URL}`;

export default {
  name: "Document",
  components: {
    TOC
  },

  props: ["id", "level", "editoriallevel", "asidetoc", "maxcitedepth", "documenttype"],

  setup(props) {
    // Declare route to capture route hash (used in scrollTo()) to display selected Table Of Content items below the editorial level
    const route = useRoute()
    // The parentId will the id used for the DoTS API, it is either the resourceId or the resourceId + '&ref=' + refId
    // TODO: rename to a more appropriate name : it is the id used for Dots API : dotsID ?
    const parentId = ref(props.id);
    console.log("Document.vue const props.id / parentId", props.id, parentId)
    // Content fetched here will depend on the selected TOC item vs editotial level
    const currentLevel = ref(props.level);
    console.log("Document.vue const currentLevel", currentLevel)

    const editorialLevel = ref(props.editoriallevel);
    console.log("Document.vue const editorialLevel", editorialLevel)

    // Content fetched here will depend whether the selected item is a resource or a collection
    const documentType = ref(props.documenttype);
    console.log("Document.vue const documenttype", documentType)

    // For items hierarchically above the editorial level, display the item TOC
    const asideTOC = reactive(props.asidetoc);
    console.log("Document.vue const asideTOC", props.asidetoc)
    // Required for the TOC component
    console.log("Document.vue props.maxcitedepth", props.maxcitedepth)

    // Declare the async component (displayed content)
    let customDocument = loadDoc()

    // Build the async component
    function loadDoc() {
      return defineAsyncComponent(async () => {
        // fetch the initial template, depending on the selected level compared to the editorial level
        console.log("Document.vue check currentLevel vs editorialLevel", currentLevel.value, editorialLevel.value)
        let data = ""
        // Selected level is a resource but hierarchically an ancestor of the editorial level : use the excludeFragment DoTS API response
        if (currentLevel.value < editorialLevel.value && documentType.value === 'Resource') {
          console.log("Document.vue get excludeFragments=(true) currentLevel.value < editorialLevel.value", currentLevel.value < editorialLevel.value && documentType === 'Resource')
          data = await getDocumentFromApi(parentId.value, true)
        // Selected level is a resource at the editorial level : use the full DoTS API response (and not excludeFragment)
        } else if (editorialLevel.value === currentLevel.value && documentType.value === 'Resource') {
          console.log("Document.vue get excludeFragments=(false) editorialLevel.value === currentLevel.value && documentType === 'Resource'", editorialLevel.value === currentLevel.value && documentType.value === 'Resource')
          data = await getDocumentFromApi(parentId.value, false)
        // Otherwise the selected level is a collection (no DoTS API /document response) : do not fetch
        } else {
          console.log("Document.vue else")
          return
        }

        console.log("Document.vue getDocumentFromApi(parentId.value)", parentId.value)
        // Build a temporary dom just to ease the navigation inside the document
        let tmpDom = document.createElement("div");
        tmpDom.innerHTML = data;

        // Customize the template with some vue components and code

        // Generate PageBreak components for each iiif canvas link encoded in the DoTS response
        let frameNum = 1;
        tmpDom.querySelectorAll("a.pb.facs").forEach((a) => {
          const container = document.createElement("div");
          // TODO: gérer ce lowercase un peu gênant
          const canvadId = `${VITE_APP_IIIF_URL}/${props.id.toLowerCase()}/canvas/f${frameNum}`;
          container.innerHTML = `<page-break canvas-id="${canvadId}" canvas-num="${frameNum}" image="${a.href}"/>`;
          frameNum += 1;
          // Replace the link with a PageBreak component
          a.parentNode.replaceChild(container.firstChild, a);
        });

        // Remove the xslt generated left-hand side TOC (used in other ENC's apps but not here)
        tmpDom.querySelector("#aside").remove() ;

        // Return what will make the async component
        return new Promise((resolve) => {
          let doc = new DOMParser().parseFromString(tmpDom.innerHTML, "text/html");
          resolve({
            template: doc.getElementById("center").innerHTML,
          });
        });
      });
    }

    function scrollTo() {
      // If the selected item is an anchor, capture and scroll to that anchor
      let hash = route.hash ? route.hash.replace("#", "") : ''
      console.log("Document.vue scrollTo on resolve hash : ", hash)
      if (hash.length) {
        location.hash = hash
      }
    }

    return {
      parentId,
      currentLevel,
      editorialLevel,
      documentType,
      asideTOC,
      customDocument,
      scrollTo
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