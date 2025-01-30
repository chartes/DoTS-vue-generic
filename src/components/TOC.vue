<template>
  <ol class="tree">
    <template v-for="(item, index) in toc" :key="index">
      <li
        :style="`margin-left: ${ $props.margin }px;`"
        :class="item.children && item.children.length > 0 ? 'more' : ''"
      >
        <!--<router-link
          :class="route.hash === item.hash ? 'is-current' : !route.hash && item.identifier === currentRefId ? 'is-current' : ''"
          :to="item.router"
        >
          Lvl {{ item.level }}
          {{ item.dublincore && item.dublincore.title.length ? item.dublincore.title : item.extensions ? item.extensions["tei:role"] ? item.extensions["tei:role"] : item.citeType && item.extensions["tei:num"] ? item.citeType + ' ' + item.extensions["tei:num"] : "pas de titre" : "pas de titre"}}
          {{ item.identifier }}
        </router-link>-->
        <div class="li container">
          <button
            v-if="item.level < maxcitedepth && item.children && item.children.length > 0"
            class="expand-collection"
            :class="expandedById[item.identifier] || item.expanded === true ? 'expanded' : ''"
            @click="toggleExpanded(item.identifier)"
          />
          <a
            :data-href="item.url"
            :class="route.hash === item.hash ? 'is-current' : !route.hash && item.identifier === currentRefId ? 'is-current' : ''"
            v-on:click="goTo($event, item)"
          ><!--v-on:click="goTo($event, item)"-->
            {{ item.dublincore && item.dublincore.title.length ? item.dublincore.title : item.extensions ? item.extensions["tei:role"] ? item.extensions["tei:role"] : item.citeType && item.extensions["tei:num"] ? item.citeType + ' ' + item.extensions["tei:num"] : "pas de titre" : `Fragment n° ${index + 1}` }}

          </a><!-- Lvl {{ item.level }} {{ item.identifier }}-->
          <!--<router-link
            :class="route.hash === item.hash ? 'is-current' : !route.hash && item.identifier === currentRefId ? 'is-current' : ''"
            v-if="item.link_type === 'link'"
            :to="item.level <= 0 ? { name: 'Document', params: {id: item.identifier} } : { name: 'Document', params: {id: route.params.id}, query: { refId: item.identifier }}"
          >
            Lvl {{ item.level }}
            {{ item.dublincore && item.dublincore.title.length ? item.dublincore.title : item.extensions ? item.extensions["tei:role"] ? item.extensions["tei:role"] : item.citeType && item.extensions["tei:num"] ? item.citeType + ' ' + item.extensions["tei:num"] : "pas de titre" : "pas de titre"}}
            {{ item.identifier }}
            {{ item.url }}
          </router-link>
          <router-link
           :class="route.hash === item.hash ? 'is-current' : !route.hash && item.identifier === currentRefId ? 'is-current' : ''"
            v-else
            :to="currentRefId ? { name: 'Document', params: {id: route.params.id}, query: { refId: item.ancestor_editorialLevel }, hash: item.link_type === 'hash' ? item.url : false }
                              : { name: 'Document', params: {id: route.params.id}, hash: item.link_type === 'hash' ? item.url : false }"
          >
            Lvl {{ item.level }}
            {{ item.dublincore && item.dublincore.title.length ? item.dublincore.title : item.extensions ? item.extensions["tei:role"] ? item.extensions["tei:role"] : item.citeType && item.extensions["tei:num"] ? item.citeType + ' ' + item.extensions["tei:num"] : "pas de titre" : "pas de titre"}}
            {{ item.identifier }}
            {{ item.url }}
          </router-link>-->
        </div>
        <div
          v-if="expandedById[item.identifier]"
        >
          <TOC
            v-if="item.level < maxcitedepth && item.children && item.children.length > 0"
            :margin="$props.margin + 23"
            :toc="item.children"
            :maxcitedepth="maxcitedepth"
            :refid="currentRefId"
            @update-ref-id="getNewRefId"
          />
        </div>
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
    margin: { required: true, default: 0, type: Number },
    toc: { required: true, default: () => [], type: Array },
    maxcitedepth: { required: false, default: 0, type: Number },
    refid: { required: false, default: ''}
  },
  emits: ["updateRefId"],
  setup(props) {
    const currentRefId = ref(props.refid);
    const route = useRoute()
    const expandedById = ref({})

    //console.log("TOC props.toc :", props.toc)
    //console.log("TOC props.maxcitedepth :", props.maxcitedepth)
    //console.log("TOC props.refid :", props.refid)

    //remove when proved unneeded
    const toggleBurger = function ($event, ref) {
      $event.preventDefault();
      //$event.stopPropagation();
      currentRefId.value = ref
      //console.log("TOC ref : ", $event, currentRefId.value)
      router.push({path: route.path, query: {refId: ref} });
    }

    const toggleExpanded = async (id) => {
      console.log("TOC toggleExpanded id : ", id, expandedById.value)
      expandedById.value[id] = !expandedById.value[id]
      console.log("TOC after expandedById[id] : ", id, expandedById.value)

    }


    const goTo = function ($event, item) {
      $event.preventDefault();
      //$event.stopPropagation();
      //currentRefId.value = ref
      //console.log("TOC ref : ", $event, currentRefId.value)
      if (item.router_hash) {
        if (item.router_refid) {
          router.push({ name: 'Document', params: {'collId': import.meta.env.VITE_APP_APP_ROOT_COLLECTION_ID, 'id': item.router_params }, query: {refId: item.router_refid}, hash: item.router_hash })
        } else {
          router.push({ name: 'Document', params: {'collId': import.meta.env.VITE_APP_APP_ROOT_COLLECTION_ID, 'id': item.router_params }, hash: item.router_hash })
        }
      } else if (item.router_refid) {
        router.push({ name: 'Document', params: {'collId': import.meta.env.VITE_APP_APP_ROOT_COLLECTION_ID, 'id': item.router_params }, query: {refId: item.router_refid} })
      } else {
        router.push({ name: 'Document', params: {'collId': import.meta.env.VITE_APP_APP_ROOT_COLLECTION_ID, 'id': item.router_params } })
      }
    };

    return {
      route,
      toggleBurger,
      currentRefId,
      goTo,
      expandedById,
      toggleExpanded
    }
  },
  methods: {
    getNewRefId() {
      if (Object.keys(this.route.query).length > 0 && Object.keys(this.route.query).includes("refId")) {
          //console.log("TOC getNewRefId /this.route.query.refId : ", this.route.query.refId ? this.route.query.refId : false)
          this.currentRefId.value = this.route.query.refId
        }
      //console.log("TOC getNewRefId / this.currentRefId", this.currentRefId)
    }
  }
};
</script>

<style scoped>
div.toc-content {
  .tree li {
    /*margin-left: 10px;*/
    font-family: "Barlow Semi Condensed", sans-serif;
    font-size: 17px;
    font-weight: 400;
    line-height: 20px;
    &:before {
      margin-left: 0;
      margin-right: 11px;
    }

    & .li.container {
      display: flex;
      margin: 0;

      & > a {
        margin-top: 4px;
        color: #4a4a4a;
      }
    }

    &.more {
      /*margin-left: 0px;*/
      padding-left: 0px;

      &::before {
        content: none !important;
      }
    }
    &:not(.more) {
      padding-left: 30px !important;
    }
  }
}
div.bottom-toc {
  .tree li {
    /*margin-left: 10px;*/
    font-family: "Barlow Semi Condensed", sans-serif;
    font-size: 15px;
    font-weight: 500;
    line-height: 22px;

    &:before {
      margin-left: -8px;
      margin-right: 11px;
    }

    & .li.container {
      display: flex;
      align-items: center;
      margin: 0;

      & > a {
        color: #4a4a4a;
      }
    }

    &.more {
      /*margin-left: 0px;*/
      padding-left: 0px;

      &::before {
        content: none !important;
      }
    }
  }
}

.is-current {
  color: #971716 !important;
}
button {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border: none;
  cursor: pointer;

  background: url(@/assets/images/chevron_red_rounded.svg) center / 20px auto no-repeat;

  &.expanded {
    background: url(@/assets/images/chevron_red_rounded.svg) center / 20px auto no-repeat;
    transform: rotate(90deg);
  }
}
</style>
