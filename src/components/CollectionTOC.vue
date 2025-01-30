<template>
  <ol class="tree">
    <template v-for="(item, index) in toc.sort((a, b) => a.title > b.title ? 1 : -1 )" :key="index">
      <li
        :style="`margin-left: ${ $props.margin }px;`"
        :class="item.totalChildren > 0 ? 'more' : ''"
      >
        <div class="li container">
          <button
            v-if="item.totalChildren > 0"
            class="expand-collection"
            :class="expandedById[item.identifier] || item.expanded === true ? 'expanded' : ''"
            @click="toggleExpanded(item.identifier)"
          />
          <!--<router-link
            v-if="item['@type'] === 'Collection' || item.citeType === 'Collection'"
            :class="route.params.collId === item.identifier ? 'is-current' : ''"
            :to="{ name: 'Home', params: {collId: item.identifier} }"
          >
            {{ item.citeType }}
            {{ item.title }}
          </router-link>-->
          <span
            v-if="item['@type'] === 'Collection' || item.citeType === 'Collection'"
            :class="route.params.collId === item.identifier ? 'is-current' : ''"
            @click="toggleExpanded(item.identifier)"
          >
            {{ item.citeType }}
            {{ item.title }}
          </span>
          <router-link
            v-else
            :class="route.params.id === item.identifier ? 'is-current' : ''"
            :to="{ name: 'Document', params: {collId: item.parent, id: item.identifier} }"
          >
            {{ item.citeType }}
            {{ item.title }}
          </router-link>

        </div>
        <div v-if="expandedById[item.identifier] && item.totalChildren > 0 && item.children?.length > 0
                  || item.expanded === true && item.totalChildren > 0 && item.children?.length > 0">

          <CollectionTOC
            :margin="$props.margin + 23"
            :toc="item.children"
          />
        </div>

      </li>
    </template>
  </ol>
</template>

<script>

import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import router from "@/router";
import {getMetadataFromApi} from "@/api/document.js";

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
    member: !obj.member ? obj.children : obj.member,
    parent: obj.parent,
    dublincore: obj.dublincore,
    extensions: obj.extensions
  }
  //console.log("getSimpleObject / simpleObject", simpleObject)
  return simpleObject
}

export default {
  name: "CollectionTOC",

  components: {},

  props: {
    toc: { required: true, default: () => [], type: Array },
    margin: {required: true, default: 0, type: Number }
  },
  setup(props) {
    const route = useRoute()

    const expandedById = ref({})

    const selectedParent = ref('');

    const collectionTOC = ref(props.toc)
    console.log("collectionTOC.value props.toc : ", collectionTOC.value)

    /*expandedById.value = collectionTOC.value.filter(item => item.expanded === true).map(col => [col.identifier, true])
    console.log("collectionTOC.value expandedById.value : ", expandedById.value)*/
    expandedById.value = Object.assign({}, ...collectionTOC.value.filter(item => item.citeType === 'Collection').map((x) => ({[x.identifier]: false})))

    const toggleExpanded = async (collId) => {
      console.log("collectionTOC toggleExpanded collectionTOC collId: ", collectionTOC.value, collId)
      if (!collectionTOC.value.filter(item => item['@id'] === collId || item.identifier === collId)[0].children || collectionTOC.value.filter(item => item['@id'] === collId || item.identifier === collId)[0].children.length === 0) {
        let response = getSimpleObject(await getMetadataFromApi(collId))
        console.log('response', response)
        response.member.forEach((m) => m.identifier = m['@id'])
        response.member.forEach((m) => m.parent = collId)
        console.log('response after identifier', response)
        collectionTOC.value.filter(item => item.identifier === collId)[0].member = response.member
        collectionTOC.value.filter(item => item.identifier === collId)[0].children = response.member
        console.log('collectionTOC', collectionTOC.value)
      }
      console.log('collectionTOC expandedById.value', expandedById.value)

      selectedParent.value = collId
      console.log("CollectionTOC after selectedParent.value : ", collId)
      expandedById.value[collId] = !expandedById.value[collId]
      console.log("CollectionTOC after expandedById[collectionId] : ", collId, expandedById.value)

    }

    return {
      route,
      toggleExpanded,
      expandedById,
      selectedParent
    }
  }
};
</script>

<style scoped>

.tree li {
  font-family: "Barlow Semi Condensed", sans-serif !important;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  & .li.container {
      display: flex;
      align-items: center;
      margin: 0;
    & > a {
      color: #4a4a4a !important;
    }
  }
  &.more {
    padding-left: 0px !important;

    &::before {
      content: none !important;
    }
  }
}

button {
  width:30px;
  height: 30px;
  border: none;
  cursor: pointer;

  background: url(@/assets/images/chevron_red_rounded.svg) center / 20px auto no-repeat;
  &.expanded {
    background: url(@/assets/images/chevron_red_rounded.svg) center / 15px auto no-repeat;
    transform: rotate(90deg);
  }
}
.is-current {
  color: #971716 !important;
}
</style>
