<template>
  <div class="list-content" :class="listCssClass">
    <div class="list-header is-flex">
      <p class="menu-label">
        <span @click="toggleContent">Documents de la collection</span> :
        <input
          v-if="!isNaN(inputAnnee)"
          type="text"
          class="year"
          v-model="inputAnnee"
        />
        <input
          v-else
          type="text"
          class="year"
          v-model="input"
        />
      </p>
      <div
        v-if="!isNaN(inputAnnee)"
        class="slider-prev-next-buttons is-flex is-align-items-center"
      >
        <nav>
          <button v-on:click="downOneCollection">-</button>
        </nav>
        <vue-slider
          v-model="id"
          :vData="listProm"
          :lazy="true"
          :tooltip="'active'"
        ></vue-slider>
        <nav>
          <button v-on:click="addOneCollection">+</button>
        </nav>
      </div>
      <div
        v-else
        class="slider-prev-next-buttons is-flex is-align-items-center"
      >
        <nav>
          <button v-on:click="downOneCollection">-</button>
        </nav>

        <nav>
          <button v-on:click="addOneCollection">+</button>
        </nav>
      </div>
      <nav v-if="isNotInitialCollection">
        <button v-on:click="reinitalise">
          Retour à la collection en cours <span>{{ id }}</span>
        </button>
      </nav>
      <a href="#" class="toggle-btn" @click="toggleContent"></a>
    </div>
    <div class="list-body">
      <div class="menu-list-scrollable thin-scroll">
        <ul class="menu-list" v-if="state.metadata">
          <li v-for="item in state.metadata" :key="item[0]">
            <ul v-if="item[1]">
              <b v-if="item[0] === textid">
                <div class="thesis-author">{{ item[1] }}</div>
                <div class="thesis-title" v-html="item[2]"></div>
                <div class="thesis-title" v-html="item[3]"></div>
              </b>
              <router-link
                v-else
                :to="{ name: 'Document', params: {id: item[0]}, query: {refId: undefined}}"
              >
                <div>
                  <!--<div v-html="item[0]"></div>-->
                  <div class="thesis-author">{{ item[1] }}</div>
                  <div v-html="item[2]"></div>
                  <div v-html="item[3]"></div>
                </div>
              </router-link>
            </ul>
            <ul v-else>
              <b v-if="item[0] === textid">{{ item[2] }}2</b>
              <router-link :to="item[0]" v-on:click="gotoTop" v-else
                ><span v-html="item[2]"></span
              ></router-link>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, watch, computed } from "vue";
import { getMetadataFromApi, getMetadataENCPOSFromApi } from "@/api/document";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

export default {
  name: "ListeTheseAnnee",

  props: ["id", "textid"],
  components: {
    VueSlider,
  },
  async setup(props) {
    console.log("setup(props)", props.id, props.textid)


    let state = reactive({
      isOpened: false,
    });
    const id = ref(props.id);
    console.log("ListeTheseAnnee setup const id", id)
    const textid = ref(props.textid);
    console.log("ListeTheseAnnee setup const textid", textid)


    const collection = ref(props.id);
    console.log("ListeTheseAnnee setup const collection", collection)


    const listProm = ref([]);
    console.log("listeTheseAnnee id ", id)
    const getItemsForCurrentCollection = async () => {
      let metadata = {};
      console.log("listeTheseAnnee getItemsForCurrentCollection id.value ", id.value)
      const data = await getMetadataFromApi(id.value);
      console.log("listeTheseAnnee id ", id)
      var htmlnamespace = Object.keys(data["@context"]).find((k) =>
        data["@context"][k].includes("html")
      );
      console.log("data && data[\"member\"]", data)
      if (data && data["member"]) {

        for (const [i, item] of data["member"].entries())
         {
          if (item["@id"].includes("PREV") || item["@id"].includes("NEXT")) {
            continue;
          }
          var title = item["extensions"] && item["extensions"][htmlnamespace + ":h1"] ? item["extensions"][htmlnamespace + ":h1"] : item["dublincore"]["title"]
          var author = item["dublincore"]["creator"] ? item["dublincore"]["creator"] : "inconnu";
          var date = item["dublincore"]["date"] ? item["dublincore"]["date"] : "inconnue";
          metadata[i] = [item["@id"], author, title, date];
          /*try {
            const page = item["extensions"]["dct:extend"].toString().split("-")[0];
            metadata[page] = [item["@id"], author, title];
          } catch {
            metadata[item["@id"].split("_")[2]] = [item["@id"], author, title];
          }*/
        }
      }

      state.metadata = metadata;
      console.log("state.metadata ", state.metadata)
    };

    const getAllPositionsYears = async () => {
      const PROJECT = `${import.meta.env.VITE_APP_PROJECT}`
      console.log("ListeTheseAnnee PROJECT collection.value", PROJECT, props.id)
      const data = await getMetadataFromApi(collection.value);
      console.log("const data", data)
      let collections = [];
      for (var member of data.member) {
        let item = member["@id"];
        collections.push(item);
      }
      collections.sort();
      listProm.value = collections;
      console.log("ListeTheseAnnee listProm", listProm.value)
    };

    const listCssClass = computed(() => {
      return state.isOpened ? "is-opened" : "";
    });

    const toggleContent = function (event) {
      event.preventDefault();
      state.isOpened = !state.isOpened;
    };

    const isNotInitialCollection = computed(() => {
      return collection.value.toString() !== id.value.toString();
    });

    const downOneCollection = function () {
      if (listProm.value.indexOf(collection.value.toString()) != "0") {
        collection.value = listProm.value[
          listProm.value.indexOf(collection.value.toString()) - 1
        ].toString();
      }
      return collection;
    };

    const reinitalise = function () {
      collection.value = id.value.toString();
      return collection;
    };

    const addOneCollection = function () {
      if (
        listProm.value.indexOf(collection.value.toString()) !=
        listProm.value.length.toString() - 1
      ) {
        collection.value = listProm.value[
          listProm.value.indexOf(collection.value.toString()) + 1
        ].toString();
      }
      console.log("liste these année labelled collections, collection.value : ", collection.value)
      return collection;
    };

    const inputAnnee = computed({
      get: () => collection.value,
      set: (val) => {
        const valStr = val.toString().toLowerCase(); // special string value : 1942b
        if (valStr.length >= 4) {
          if (listProm.value.indexOf(valStr) !== -1) {
            collection.value = valStr;
          } else {
            const valNum = parseInt(val);
            const minDate = listProm.value[0];
            const maxDate = listProm.value[listProm.value.length - 1];
            collection.value = Math.min(maxDate, Math.max(minDate, valNum)).toString();
            console.log("minDate, collection.value : ",minDate, collection.value);
          }
        }
      },
    });
    const input = computed({
      get: () => collection.value,
      set: (val) => {
        console.log("liste these année changed labelled input", val)
        const valStr = val.toString().toLowerCase(); // special string value : 1942b
        collection.value = listProm.value.filter(item => item.identifier === val)
        console.log("liste these année labelled collections, collection.value : ", collection.value);
        }
    });

    watch(inputAnnee, () => {
      state.isOpened = true;
    })
    watch(input, () => {
      state.isOpened = true;
    })

    watch(
  () => props.id,
    () => {
      console.log("liste these année watch props.id", props.id)
      id.value = props.id
      collection.value = props.id
      getItemsForCurrentCollection();
      }
    )

    await Promise.all([getItemsForCurrentCollection(), getAllPositionsYears()]);

    const gotoTop = function () {
      scroll(0, 0);
    };

    return {
      state,
      listCssClass,
      toggleContent,
      isNotInitialCollection,
      addOneCollection,
      id,
      reinitalise,
      downOneCollection,
      inputAnnee,
      input,
      gotoTop,
      listProm,
    };
  },
};
</script>

<style scoped>
nav button {
  cursor: pointer;
}
nav button,
.list-header p.menu-label {
  font-family: "Barlow", sans-serif !important;
  font-size: 15px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0;
}
.list-header {
  align-items: center;
  background-color: #b8b5ad;
  padding: 20px 0 20px;
  border-radius: 6px;
  position: relative;
}
.list-content.is-opened .list-header {
  border-radius: 6px 6px 0 0;
}
.list-header p.menu-label {
  color: #4a4a4a;
}
.list-body {
  display: none;
  padding: 30px 20px;
  background-color: #e5e3de;
  border-radius: 0 0 6px 6px;
}
.list-content.is-opened .list-body {
  display: block;
}
.list-header {
  padding-left: 20px;
}

p.menu-label {
  margin-bottom: 0;
  text-indent: 0;
}
.menu-label span:first-child {
  cursor: pointer;
}
.menu-label span.year {
  background-color: #fff;
  font-size: 14px;
  color: #8b8a7e;
  padding: 1px 20px;
  margin: 0 10px;
}
.menu-label input[type="text"].year,
.menu-label input[type="number"].year {
  inset: unset;
  border: none;
  text-shadow: none;
  -moz-appearance: textfield;
  background-color: #fff;

  max-width: 70px;
  padding: 2px 0;
  margin: 0 15px;

  font-family: "Barlow", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #979797;
  text-transform: uppercase;
  text-align: center;
}
.menu-label input[type="text"].year:focus,
.menu-label input[type="number"].year:focus {
  outline: solid 2px #b9192f;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

nav button {
  border: none;
  background: none;
  color: #ffffff;
}
nav button > span {
  border: #ffffff solid 1px;
  border-radius: 4px;
  padding: 4px 20px;
  margin-left: 10px;
}

.slider-prev-next-buttons {
  margin-right: 30px;
}

/* slider */
.vue-slider {
  min-width: 200px;
}
.vue-slider.vue-slider-ltr {
  margin-top: 2px !important;
  padding: 0 10px !important;
  height: 3px !important;
}
.vue-slider :deep(.vue-slider-dot) {
  width: 18px !important;
  height: 18px !important;
}
.vue-slider:hover :deep(.vue-slider-rail),
.vue-slider :deep(.vue-slider-rail) {
  background-color: #ffffff;
}
.vue-slider :deep(.vue-slider:hover .vue-slider-process),
.vue-slider :deep(.vue-slider-process) {
  background-color: #b9192f !important;
}
.vue-slider :deep(.vue-slider-dot-handle:hover),
.vue-slider :deep(.vue-slider-dot-handle-focus),
.vue-slider :deep(.vue-slider-dot-handle) {
  border-color: #b9192f !important;
}
.vue-slider :deep(.vue-slider-dot-handle-focus) {
  box-shadow: 0 0 0 5px rgba(185, 25, 47, 0.2);
}
.vue-slider :deep(.vue-slider-dot-tooltip-text) {
  font-family: "Barlow", sans-serif;
}

/* toogle */
.toggle-btn {
  position: absolute;
  right: 20px;
  top: 19px;
  width: 27px;
  height: 27px;
  background: url(../assets/images/chevron_blanc.svg) center top -3px / cover no-repeat;
  border: none;
  text-decoration: none;
}
.list-content.is-opened .toggle-btn {
  background: url(../assets/images/croix_blc.svg) center / cover no-repeat;
}
.menu-list-scrollable {
  padding: 10px 20px 10px 0;
  max-height: 50vh;
  overflow-y: auto;
}

*.thin-scroll {
  scrollbar-width: thin;
  scrollbar-color: #b9192f #ceccc8;
}
/* Works on Chrome/Edge/Safari */
*.thin-scroll::-webkit-scrollbar {
  width: 8px;
}
*.thin-scroll::-webkit-scrollbar-track {
  background: #ceccc8;
}
*.thin-scroll::-webkit-scrollbar-thumb {
  background-color: #b9192f;
}

.menu-list {
  counter-reset: thesis-counter;
  columns: 3;
}

.thesis-author {
  font-weight: 600;
}
.thesis-author::before {
  content: counter(thesis-counter);
  counter-increment: thesis-counter;
  color: #b9192f;
  margin-right: 5px;
}
.menu-list li ul {
  padding-left: 0;
}
.menu-list > li {
  display: inline-block;
  margin-bottom: 20px;
  break-inside: avoid;
}
.menu-list li > ul {
  border: none;
  display: block;
  margin: 0;
}
.menu-list > li {
  flex: 33.333% 0 0;
}
.menu-list b,
.menu-list a {
  border: none;
  padding: 0;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 25px;
  color: #161616;
  text-transform: none;
}
.menu-list b {
  font-weight: 600;
}
ol,
ul {
  list-style: none;
}

@media screen and (max-width: 1150px) {
  .menu-list {
    columns: 2;
  }
}
@media screen and (max-width: 950px) {
  .list-header {
    flex-wrap: wrap;
  }
  .list-header > nav:last-of-type {
    margin-top: 20px;
    width: 100%;
  }
}
@media screen and (max-width: 800px) {
  .vue-slider.vue-slider-ltr {
    margin-top: 5px !important;
    padding: 0 !important;
    width: calc(100% - 70px) !important;
  }
  .list-body {
    padding: 8px 5px 30px 20px;
  }
}
@media screen and (max-width: 800px) {
}
@media screen and (max-width: 640px) {
  .list-header {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;
  }
  .slider-prev-next-buttons *:first-child {
    padding-right: 10px;
  }
  .slider-prev-next-buttons *:last-child {
    padding-left: 10px;
  }
  .list-header > nav:last-of-type {
    margin-top: 0px;
    width: auto;
  }
  .liste-theses-area {
    padding-top: 30px;
    padding-bottom: 30px;
  }
  .menu-list {
    columns: 1;
  }
  .toggle-btn {
    width: 20px;
    right: 15px;
  }
}
</style>
