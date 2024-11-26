<template>
  <ol class="tree">
    <template v-for="(item, index) in toc" :key="index">
      <li :class="item.children && item.children.length > 0 ? 'more' : ''">
        <router-link
          :class="route.hash === item.url ? 'is-current' : !route.hash && item.identifier === currentRefId ? 'is-current' : ''"
          v-if="item.level <= 0"
          :to="{ name: 'Document', params: {id: item.identifier} }"
        >
          Lvl {{ item.level }}
          {{ item.dublincore && item.dublincore.title ? item.dublincore.title : item.extensions["tei:role"] ? item.extensions["tei:role"] : item.citeType && item.extensions["tei:num"] ? item.citeType + ' ' + item.extensions["tei:num"] : "pas de titre" }}
          {{ item.identifier }}
        </router-link>
        <router-link
         :class="route.hash === item.url ? 'is-current' : !route.hash && item.identifier === currentRefId ? 'is-current' : ''"
          v-else
          :to="{ name: 'Document', params: {id: route.params.id}, query: { refId: item.link_type === 'hash' ? item.ancestor_editorialLevel : item.identifier }, hash: item.link_type === 'hash' ? item.url : false}"
        >

            Lvl {{ item.level }}
            {{ item.dublincore && item.dublincore.title ? item.dublincore.title : item.extensions["tei:role"] ? item.extensions["tei:role"] : item.citeType && item.extensions["tei:num"] ? item.citeType + ' ' + item.extensions["tei:num"] : "pas de titre" }}
            {{ item.identifier }}
        </router-link>
        <!--<router-link
          v-else
          :to="{ name: 'Document', param: {id: route.params.id}, query: { refId: route.query.refId }, hash: item.url }"
        >
          {{ route.query.refId }}
          Lvl {{ item.level }} tada
          {{ item.dublincore && item.dublincore.title ? item.dublincore.title : "pas de titre" }}
          {{ item.identifier }}
        </router-link>-->
        <!--<div v-else>
          <div
            :class="item.identifier === currentRefId ? 'is-current' : ''"
          >
            Lvl {{ item.level }}
            {{ item.dublincore && item.dublincore.title ? item.dublincore.title : "pas de titre" }}
            {{ item.identifier }}
          </div>
        </div>-->
        <!--<a
          :class="item.identifier === currentRefId ? 'is-current' : ''"
          :href="item.url"
        >--><!--  @click="toggleBurger($event, item.identifier)" -->
          <!--{{ item.custom && item.custom.htmlTitle? item.custom.htmlTitle : item.identifier }}
        </a>-->
        <TOC
          v-if="item.level < maxcitedepth && item.children && item.children.length > 0"
          :toc="item.children"
          :maxcitedepth="maxcitedepth"
          :refid="currentRefId"
          @update-ref-id="getNewRefId"
        />
      </li>
    </template>
  </ol>
</template>

<script>

import {ref, watch} from "vue";
import {useRoute} from "vue-router";
import router from "@/router";

export default {
  name: "TOC",

  components: {},

  props: {
    toc: { required: true, default: () => [], type: Array },
    maxcitedepth: { required: false, default: 0, type: Number },
    refid: { required: false, default: ''}
  },
  emits: ["updateRefId"],
  setup(props) {
    const currentRefId = ref(props.refid);
    const route = useRoute()

    console.log("TOC props.toc :", props.toc)
    console.log("TOC props.maxcitedepth :", props.maxcitedepth)
    console.log("TOC props.refid :", props.refid)

    //remove when proved unneeded
    const toggleBurger = function ($event, ref) {
      $event.preventDefault();
      //$event.stopPropagation();
      currentRefId.value = ref
      console.log("TOC ref : ", $event, currentRefId.value)
      router.push({path: route.path, query: {refId: ref} });
    };
    /*watch(route, () => {
      console.log("TOC watch route.query : ", route.query)
      //if (Object.keys(route.query).length > 0 && Object.keys(route.query).includes("refId")) {
          console.log("watch route.query.ref : ", route.query.refId ? route.query.refId : false)
          currentRefId.value = route.query.refId
        //}

    });*/


    return {
      route,
      toggleBurger,
      currentRefId
    }
  },
  methods: {
    getNewRefId() {
      if (Object.keys(this.route.query).length > 0 && Object.keys(this.route.query).includes("refId")) {
          console.log("TOC getNewRefId /this.route.query.refId : ", this.route.query.refId ? this.route.query.refId : false)
          this.currentRefId.value = this.route.query.refId
        }
      console.log("TOC getNewRefId / this.currentRefId", this.currentRefId)
    }
  }
};
</script>

<style scoped>
.is-current {
  color: #971716 !important;
}
</style>
