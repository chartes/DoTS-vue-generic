<template>
  <a v-if="!refid || refid.length === 0" href="#" @click="goToNextDocument" :class="cssClass"></a>
  <a
    v-else
    href="#"
    :title="nextRefTitle"
    :class="cssClass"
    @click="goToNextFragment($event, nextrefid, nextreftitle)"
  >
    <span>{{ nextRefTitle }}</span>
    <span class="b_next"/>
  </a>
</template>

<script>
import {ref, watch} from "vue"; //onMounted, onUnmounted,
import router from "@/router";
import {useRoute} from "vue-router";

export default {
  name: "ToNextButton",
  props: ["docid", "nextdocid", "refid", "nextrefid", "nextreftitle"],
  //emits: ["updateRefId"],

  setup(props) {

    const nextRefId = ref(props.nextrefid)
    const nextRefTitle = ref(props.nextreftitle)
    const route = useRoute()
    console.log("ToNextButton currentDocId : ", props.docid)
    console.log("ToNextButton nextdocid : ", props.nextdocid)
    console.log("ToNextButton refid : ", props.refid)
    console.log("ToNextButton nextrefid : ", props.nextrefid)
    console.log("ToNextButton nextreftitle : ", props.nextreftitle)

    let cssClass = ref("to-next")

    // On click :
    const goToNextDocument = function (event) {
      event.preventDefault();
      if (props.nextdocid && props.nextdocid.length > 0) {
        console.log("NextButton nextdocid : ", event, props.nextdocid)
        router.push({path: `/document/${props.nextdocid}`})
      }
    };

    const goToNextFragment = function ($event, nextId, nextTitle) {
      $event.preventDefault();
      console.log("goToNextFragment event", $event, nextId, nextTitle)
      if (props.nextrefid && props.nextrefid.length > 0) {
        //nextRefId.value = props.nextrefid
        console.log("NextButton nextRefId : ", $event, props.nextrefid)
        console.log("NextButton nextRefId : ", $event, props.nextreftitle)
        console.log("NextButton let route", route, route.path)
        nextRefId.value = props.nextrefid
        nextRefTitle.value = props.nextreftitle
        // Replace current querystring with the new one.
        router.push({path: route.path, query: {refId: props.nextrefid} });
      }
    };
    watch(props, (newProps) => {
      nextRefId.value = newProps.nextrefid
      nextRefTitle.value = newProps.nextreftitle
      cssClass.value = "to-next"
    }, {deep: true, immediate: true});

    return {
      goToNextDocument,
      goToNextFragment,
      nextRefId,
      nextRefTitle,
      cssClass,
    };
  },
};
</script>

<style>
.to-next.to-next-button-page {
  display: flex;
  flex-shrink: 0;
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
  //position: sticky;
  margin-left: auto;
  margin-right: 0;
  margin-bottom: auto;
  margin-top: 5px;
}

.to-next.to-next-button-page-top, .to-next.to-next-button-page-bottom {
  text-align: right;
  vertical-align: top;
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  border-bottom: none !important;

  & > span {
    font-family: "Barlow", sans-serif;
    font-size: 14px;

    &:hover {
      text-decoration: underline;
    }
  }
  & > span.b_next {
    display: inline-block;
    vertical-align: middle;
    width: 10px;
    height: 10px;
    margin: 5px;
    background: url(../assets/images/b_next.svg) center / cover no-repeat;
  }

  &.disabled > span {
    display: none;
    pointer-events: none;
    /*background: url(../assets/images/b_next.svg) center / cover no-repeat;*/
    transform: none;
  }
}

@media screen and (max-width: 640px) {
  .to-next {
    width: 30px;
    height: 30px;
  }
}
</style>
