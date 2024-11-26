<template>
  <a v-if="!refid || refid.length === 0" href="#" @click="goToPreviousDocument" :class="cssClass"></a>
  <a v-else href="#" @click="goToPreviousFragment($event, previousrefid)" :class="cssClass"></a>
</template>

<script>
import {ref, watch} from "vue"; //onMounted, onUnmounted,
import router from "@/router";
import {useRoute} from "vue-router";

export default {
  name: "ToPreviousButton",
  props: ["docid", "previousdocid", "refid", "previousrefid"],
  emits: ["updateRefId"],

  setup(props) {

    const previousRefId = ref(props.previousrefid);
    const route = useRoute()
    console.log("ToPreviousButton currentDocId : ", props.docid)
    console.log("ToPreviousButton previousdocid : ", props.previousdocid)
    console.log("ToPreviousButton refid : ", props.refid)
    console.log("ToPreviousButton previousrefid : ", props.previousrefid)

    let cssClass = ref("to-previous");

    // On click :
    const goToPreviousDocument = function (event) {
      event.preventDefault();
      if (props.previousdocid && props.previousdocid.length > 0) {
        console.log("PreviousButton previousdocid : ", event, props.previousdocid.value)
        router.push({path: `/document/${props.previousdocid}`})
      }
    };

    const goToPreviousFragment = function ($event, previous) {
      $event.preventDefault();
      console.log("goToPreviousFragment event/previous", $event, previous)
      if (previous.length > 0) {
        previousRefId.value = previous
        console.log("PreviousButton previousRefId : ", $event, previousRefId.value)
        console.log("let route", route, route.path)
        // Replace current querystring with the new one.
        router.push({path: route.path, query: {refId: previous} });
      }
    };
    watch(props, (newProps) => {
      previousRefId.value = newProps.previousrefid;
    }, {deep: true, immediate: true});

    return {
      goToPreviousDocument,
      goToPreviousFragment,
      previousRefId,
      cssClass,
    };
  },
};
</script>

<style>
.to-previous.to-previous-button-page {
  display: block;
  width: 40px;
  height: 40px;
  border-bottom: none !important;
  background: url(../assets/images/back_to_top.svg) center / cover no-repeat;
  transform: rotate(-90deg);
  &.disabled {
    pointer-events: none;
    background: url(../assets/images/page_avant.svg) center / cover no-repeat;
    transform: none;
  }
  position: sticky;
  margin-left:20px;
  margin-right: auto;
  top: 20px;
  margin-top: 20px;
}

@media screen and (max-width: 640px) {
  .to-previous {
    width: 30px;
    height: 30px;
  }
}
</style>
