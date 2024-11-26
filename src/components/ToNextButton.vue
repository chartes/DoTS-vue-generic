<template>
  <!--<a v-if="!refid || refid.length === 0" href="#" @click="goToNextDocument" :class="cssClass"></a>
  <a v-else href="#" @click="goToNextFragment($event, nextrefid)" :class="cssClass"></a>-->
    <a href="#" @click="goToNextFragment($event, nextrefid)" :class="cssClass"></a>
</template>

<script>
import {ref, watch} from "vue"; //onMounted, onUnmounted,
import router from "@/router";
import {useRoute} from "vue-router";

export default {
  name: "ToNextButton",
  props: ["docid", "nextdocid", "refid", "nextrefid"],
  emits: ["updateRefId"],

  setup(props) {

    const nextRefId = ref(props.nextrefid);
    const route = useRoute()
    console.log("ToNextButton currentDocId : ", props.docid)
    console.log("ToNextButton nextdocid : ", props.nextdocid)
    console.log("ToNextButton refid : ", props.refid)
    console.log("ToNextButton nextrefid : ", props.nextrefid)

    let cssClass = ref("to-next");

    // On click :
    const goToNextDocument = function (event) {
      event.preventDefault();
      if (props.nextdocid && props.nextdocid.length > 0) {
        console.log("NextButton nextdocid : ", event, props.nextdocid)
        router.push({path: `/document/${props.nextdocid}`})
      }
    };

    const goToNextFragment = function ($event, next) {
      $event.preventDefault();
      console.log("goToNextFragment event", $event, next)
      if (props.nextrefid && props.nextrefid.length > 0) {
        //nextRefId.value = props.nextrefid
        console.log("NextButton nextRefId : ", $event, props.nextrefid)
        console.log("NextButton let route", route, route.path)
        // Replace current querystring with the new one.
        router.push({path: route.path, query: {refId: props.nextrefid} });
      }
    };
    watch(props, (newProps) => {
      nextRefId.value = newProps.nextrefid;
    }, {deep: true, immediate: true});

    return {
      goToNextDocument,
      goToNextFragment,
      nextRefId,
      cssClass,
    };
  },
};
</script>

<style>
.to-next.to-next-button-page {
  display: block;
  width: 40px;
  height: 40px;
  border-bottom: none !important;
  background: url(../assets/images/back_to_top.svg) center / cover no-repeat;
  transform: rotate(90deg);
  &.disabled {
    pointer-events: none;
    background: url(../assets/images/page_suivant.svg) center / cover no-repeat;
    transform: none;
  }
  position: sticky;
  margin-left:auto;
  margin-right: 20px;
  top: 20px;
  margin-top: 20px;
}

@media screen and (max-width: 640px) {
  .to-next {
    width: 30px;
    height: 30px;
  }
}
</style>
