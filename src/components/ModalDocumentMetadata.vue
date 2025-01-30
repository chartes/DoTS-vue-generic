<template>
  <div class="modal-container">

  <div class="modal-document-metadata" :class="metaDataCssClass">
    <a href="#" v-on:click="toggleNew">
        <span class="metadata-header-author">Switch</span>
    </a>
    <div v-if="!isNew">
      <div class="modal-document-metadata-header">
        <a href="#" v-on:click="toggleContent">
          <span class="metadata-header-author">{{ metadata.author }}</span>
          <span v-html="metadata.title" class="metadata-header-title"></span>
        </a>
        <a href="#" class="toggle-btn" v-on:click="toggleContent"></a>
      </div>
      <aside class="menu">
        <Suspense v-if="!isNew">
          <div class="columns is-multiline">
            <div class="column is-2">
              <div v-if="authorThumbnailUrl">
                <figure class="image" style="max-width: 100%">
                  <img :src="authorThumbnailUrl" />
                </figure>
              </div>
              <div v-else class="author-default-thumbnail" />
            </div>
            <div class="column is-7 thesis-infos is-flex is-flex-direction-column">
              <section v-if="metadata.coverage">
                <h2 class="title">Position</h2>
                <ul>
                  <li v-if="metadata.coverage" class="block">
                    <span>Période du sujet</span> : {{ metadata.coverage }}
                  </li>
                </ul>
              </section>
              <section>
                <h2 class="title">Citer</h2>
                <ul>
                  <li class="block">
                    <span style="font-variant: all-small-caps">{{ metadata.author }}</span
                    >, « <span v-html="metadata.title"></span> », in
                    <span style="font-style: italic"
                      >Positions des thèses soutenues par les élèves de la promotion de
                      {{ metadata.date }} pour obtenir le diplôme d'archiviste
                      paléographe</span
                    >, École nationale des chartes, Paris, {{ metadata.date
                    }}<span v-if="metadata.page">, p. {{ metadata.page }}</span
                    >.
                  </li>

                  <li>
                    <span>
                      Licence : <a target="_blank" v-bind:href="metadata.rights">{{ metadata.rights }}</a>
                    </span>
                  </li>
                </ul>
              </section>
              <section>
                <h2 class="title">Direct metadatas</h2>
                <!--<span> {{ metadata }}</span>-->
                <ul v-for="(val, name, index) in metadata" :key="index">
                  <li v-if="typeof(val) === 'string'" class="block">
                    <span style="font-variant: all-small-caps">{{ name }} : {{ val }}</span>
                  </li>
                </ul>
                <section>
                  <h2 class="title"> Extensions - LIAGE</h2>
                  <ul v-for="(value, name, index) in metadata.extensions" :key="index">
                    <li v-if="Array.isArray(value) && value.length > 1">
                      <span
                        class="test"
                        v-for="(v, occ) in value"
                        style="font-variant: all-small-caps"
                        :key="occ"
                      >
                        {{ name }} : {{ typeof(v) === 'object' ? Object.values(v)[0] : v }}
                      </span>
                    </li>
                  </ul>
                </section>
                <section>
                  <h2 class="title"> Extensions - HORS LIAGE</h2>
                  <ul v-for="(value, name, index) in metadata.extensions" :key="index">
                    <li v-if="typeof(value) === 'string' || Array.isArray(value) && value.length === 1">
                      <span style="font-variant: all-small-caps">{{ name }} : {{ value }}</span>
                    </li>
                  </ul>
                </section>
                <section>
                  <h2 class="title">Dublincore</h2>
                  <ul v-for="(value, name, index) in metadata.dublincore" :key="index">
                    <li v-if="Array.isArray(value) && value.length > 1" class="block">
                      <span v-for="(v, occ) in value" style="font-variant: all-small-caps" :key="occ">{{ v }}</span>
                    </li>
                    <li v-else class="block">
                      <span style="font-variant: all-small-caps">{{ value }}</span>
                    </li>
                  </ul>
                </section>
              </section>
            </div>
            <div class="column thesis-links">
              <h2 class="title">Liens externes</h2>
              <div class="is-flex is-flex-direction-column">
                <div>
                  <p class="title">Auteur</p>
                  <div class="columns is-multiline is-mobile block">
                    <div v-if="metadata.wikipedia" class="column is-one-quarter">
                      <figure class="image is-48x48">
                        <a target="_blank" v-bind:href="metadata.wikipedia">
                          <img src="@/assets/images/Logo_wikipedia.png" />
                        </a>
                      </figure>
                    </div>
                    <div v-if="metadata.catalogue_bnf" class="column is-one-quarter">
                      <figure class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="metadata['catalogue_bnf']">
                          <img src="@/assets/images/Logo_bnf.png" />
                        </a>
                      </figure>
                    </div>
                    <div v-if="metadata.data_bnf" class="column is-one-quarter">
                      <figure class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="metadata.data_bnf">
                          <img src="@/assets/images/Logo_databnf.png" />
                        </a>
                      </figure>
                    </div>
                    <div v-if="metadata.idref" class="column is-one-quarter">
                      <figure class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="metadata.idref">
                          <img src="@/assets/images/Logo_idref.png" />
                        </a>
                      </figure>
                    </div>
                    <div v-if="metadata.dbpedia" class="column is-one-quarter">
                      <figure class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="metadata.dbpedia">
                          <img src="@/assets/images/Logo_dbpedia.png" />
                        </a>
                      </figure>
                    </div>
                    <div v-if="metadata.wikidata" class="column is-one-quarter">
                      <figure class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="metadata.wikidata">
                          <img src="@/assets/images/Logo_wikidata.png" />
                        </a>
                      </figure>
                    </div>
                  </div>
                </div>
                <div>
                  <p class="title">Oeuvres liées</p>
                  <div class="columns is-multiline is-mobile block">
                    <div v-if="metadata.thenca" class="column is-one-quarter">
                      <figure class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="metadata.thenca">
                          <img src="@/assets/images/Logo_thenca.png" />
                        </a>
                      </figure>
                    </div>
                    <div v-if="metadata.sudoc" class="column is-one-quarter">
                      <figure class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="metadata.sudoc">
                          <img src="@/assets/images/Logo_sudoc.png" />
                        </a>
                      </figure>
                    </div>
                    <div v-if="metadata.benc" class="column is-one-quarter">
                      <figure class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="metadata.benc">
                          <img src="@/assets/images/Logo_benc.png" />
                        </a>
                      </figure>
                    </div>
                    <div v-if="metadata.hal" class="column is-one-quarter">
                      <figure class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="metadata.hal">
                          <img src="@/assets/images/Logo_hal.png" />
                        </a>
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      </aside>
      <!--  <theseAnnee v-if="state['date']" :id="state['date']" :textid="id" /> -->
    </div>
    <div v-else>
      <div class="modal-document-metadata-header">
        <a href="#" v-on:click="toggleContent">
          <span class="metadata-header-author">Métadonnées</span>
        </a>
        <a href="#" class="toggle-btn" v-on:click="toggleContent"></a>
      </div>
      <aside class="menu">
        <Suspense>
          <div class="is-flex is-justify-content-center py-1">
          <table class="table is-fullwidth is-striped"><!-- style="background-color: #e4e4e4;" -->
            <tbody>
              <!--<tr class="row">
                <td><span class="title" style="font-variant: all-small-caps"><b>Identifiant</b></span></td>
                <td>
                  <span class="title" style="text-transform: uppercase; font-size: 12px">
                    <a target="_blank" :href="metadata.id">{{ metadata.id }}</a>
                </span>
                </td>
                <td></td>
              </tr>
              <tr class="row">
                <td><span class="title" style="font-variant: all-small-caps"><b>Titre</b></span></td>
                <td><span class="title" style="text-transform: uppercase; font-size: 12px">{{ metadata.title }}</span></td>
                <td></td>
              </tr>-->
              <template v-for="(value, name, index) in metadata.dublincore" :key="index">
                <tr v-if="Array.isArray(value) && value.length > 1" v-for="v in value" :key="index" class="row is-align-items-center">
                  <td v-if="v === value[0]" :rowspan="value.length"><span class="title" style="font-variant: all-small-caps"><b>dc:{{ name }}</b></span></td>
                  <td><span class="title" style="text-transform: uppercase; font-size: 12px">{{ v }}</span></td>
                  <td>
                    <figure v-if="getValue(v).includes('http')" class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="getValue(v)">
                          <img :src="ImgUrl(name)"/>
                        </a>
                      </figure>
                  </td>
                </tr>
                <tr class="row" v-else>
                  <td><span class="title" style="font-variant: all-small-caps"><b>dc:{{ name }}</b></span></td>
                  <td><span class="title" style="text-transform: uppercase; font-size: 12px">{{ value }}</span></td>
                  <td></td>
                </tr>
              </template>
              <template v-for="(value, key, index) in metadata" :key="index">
                <tr v-if="Array.isArray(value) && value.length >= 1" v-for="v in value" :key="index" class="row is-align-items-center">
                  <td v-if="v === value[0]" :rowspan="value.length"><span class="title is-align-items-center" style="font-variant: all-small-caps; color: brown"><b>{{ key }}</b></span></td>
                  <td v-if="v.url"><span class="title" style="text-transform: uppercase; font-size: 12px">{{ v.url }}</span></td><!-- {{ Array.isArray(v) ? v[0] : typeof(v) === 'object' ? Object.values(v)[0] : v }} -->
                  <td v-else><span class="title" style="text-transform: uppercase; font-size: 12px">{{ v }}</span></td><!-- {{ Array.isArray(v) ? v[0] : typeof(v) === 'object' ? Object.values(v)[0] : v }} -->
                  <td v-if="v.url">
                    <figure class="image is-24x24 level-left">
                        <a target="_blank" v-bind:href="v.url">
                          <img :src="ImgUrl(v.source)"/>
                        </a>
                      </figure>
                  </td>
                  <td v-else></td>
                </tr>
                <tr class="row" v-else-if="value">
                  <td><span class="title" style="font-variant: all-small-caps"><b>{{ key }}</b></span></td>
                  <td><span class="title" style="text-transform: uppercase; font-size: 12px">{{ value }}</span></td><!-- {{ Array.isArray(value) ? typeof(value[0]) === 'object' ? Object.values(value[0])[0] : value : typeof(value) === 'object' ? Object.values(value)[0] : value }}-->
                  <td></td>
                </tr>
              </template>
              <!--<template v-for="(value, index) in metadata['dct:isVersionOf']" :key="index">
                <tr class="row">
                  <td><span class="title" style="font-variant: all-small-caps"><b>dct:isVersionOf</b></span></td>
                  <td><span class="title" style="text-transform: uppercase; font-size: 12px">{{ value.url }}</span></td>
                  <td>
                    <figure class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="value.url">
                          <img :src="ImgUrl(value.source)"/>
                        </a>
                      </figure>
                  </td>
                </tr>
              </template>
              <template v-for="(value, name, index) in metadata.dublincore" :key="index">
                <tr v-if="Array.isArray(value) && value.length > 1" v-for="v in value" :key="index" class="row">
                  <td v-if="v === value[0]" :rowspan="value.length"><span class="title" style="font-variant: all-small-caps"><b>dc:{{ name }}</b></span></td>
                  <td><span class="title" style="text-transform: uppercase; font-size: 12px">{{ v }}</span></td>
                  <td>
                    <figure v-if="getValue(v).includes('http')" class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="getValue(v)">
                          <img :src="ImgUrl(name)"/>
                        </a>
                      </figure>
                  </td>
                </tr>
                <tr class="row" v-else>
                  <td><span class="title" style="font-variant: all-small-caps"><b>dc:{{ name }}</b></span></td>
                  <td><span class="title" style="text-transform: uppercase; font-size: 12px">{{ value }}</span></td>
                  <td></td>
                </tr>
              </template>
              <template v-for="(value, name, index) in metadata.extensions" :key="index">
                <tr v-if="Array.isArray(value) && value.length > 1" v-for="v in value" :key="index" class="row">
                  <td v-if="v === value[0]" :rowspan="value.length"><span class="title" style="font-variant: all-small-caps"><b>{{ name }}</b></span></td>
                  <td><span class="title" style="text-transform: uppercase; font-size: 12px" v-html="getValue(v)"/></td>
                  <td>
                    <figure v-if="getValue(v).includes('http')" class="image is-48x48 level-left">
                        <a target="_blank" v-bind:href="getValue(v)">
                          <img :src="ImgUrl(name)"/>
                        </a>
                      </figure>
                  </td>
                </tr>
                <tr class="row" v-else>
                  <td><span class="title" style="font-variant: all-small-caps"><b>{{ name }}</b></span></td>
                  <td><span class="title" style="text-transform: uppercase; font-size: 12px">{{ value }}</span></td>
                  <td></td>
                </tr>
              </template>-->
            </tbody>
          </table>
            </div>
          <!--<div class="columns is-multiline">
            <div class="column is-2">
              <div v-if="authorThumbnailUrl">
                <figure class="image" style="max-width: 100%">
                  <img :src="authorThumbnailUrl" />
                </figure>
              </div>
              <div v-else class="author-default-thumbnail" />
            </div>
            <div class="column is-7 thesis-infos is-flex is-flex-direction-column">
              <section v-if="metadata.coverage">
                <h2 class="title">Position</h2>
                <ul>
                  <li v-if="metadata.coverage" class="block">
                    <span>Période du sujet</span> : {{ metadata.coverage }}
                  </li>
                </ul>
              </section>
              <section>
                <h2 class="title">Citer</h2>
                <ul>
                  <li class="block">
                    <span style="font-variant: all-small-caps">{{ metadata.author }}</span
                    >, « <span v-html="metadata.title"></span> », in
                    <span style="font-style: italic"
                      >Positions des thèses soutenues par les élèves de la promotion de
                      {{ metadata.date }} pour obtenir le diplôme d'archiviste
                      paléographe</span
                    >, École nationale des chartes, Paris, {{ metadata.date
                    }}<span v-if="metadata.page">, p. {{ metadata.page }}</span
                    >.
                  </li>

                  <li>
                    <span>
                      Licence : <a target="_blank" v-bind:href="metadata.rights">{{ metadata.rights }}</a>
                    </span>
                  </li>
                </ul>
              </section>
              <section>
                <h2 class="title">Direct metadatas</h2>
                <ul v-for="(val, name, index) in metadata" :key="index">
                  <li v-if="typeof(val) === 'string'" class="block">
                    <span style="font-variant: all-small-caps">{{ name }} : {{ val }}</span>
                  </li>
                </ul>
                <section>
                  <h2 class="title"> Extensions - LIAGE</h2>
                  <ul v-for="(value, name, index) in metadata.extensions" :key="index">
                    <li v-if="Array.isArray(value) && value.length > 1">
                      <span
                        class="test"
                        v-for="(v, occ) in value"
                        style="font-variant: all-small-caps"
                        :key="occ"
                      >
                        {{ name }} : {{ typeof(v) === 'object' ? Object.values(v)[0] : v }}
                      </span>
                    </li>
                  </ul>
                </section>
                <section>
                  <h2 class="title"> Extensions - HORS LIAGE</h2>
                  <ul v-for="(value, name, index) in metadata.extensions" :key="index">
                    <li v-if="typeof(value) === 'string' || Array.isArray(value) && value.length === 1">
                      <span style="font-variant: all-small-caps">{{ name }} : {{ value }}</span>
                    </li>
                  </ul>
                </section>
                <section>
                  <h2 class="title">Dublincore</h2>
                  <ul v-for="(value, name, index) in metadata.dublincore" :key="index">
                    <li v-if="Array.isArray(value) && value.length > 1" class="block">
                      <span v-for="(v, occ) in value" style="font-variant: all-small-caps" :key="occ">{{ v }}</span>
                    </li>
                    <li v-else class="block">
                      <span style="font-variant: all-small-caps">{{ value }}</span>
                    </li>
                  </ul>
                </section>
              </section>
            </div>
          </div>-->
        </Suspense>
      </aside>

    </div>
  </div>

  </div>
</template>

<script>
import { computed, reactive, ref, watch } from "vue";
import md5 from "md5";
import * as $rdf from "rdflib";
//import node from "rdflib/src/node.js";

export default {
  name: "ModalDocumentMetadata",

  components: {},

  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    metadata: {
      required: true, default: () => {}, type: Object
    }
  },
  emits: [
    'changeMetadata'
  ],

  setup(props, context) {
    let state = reactive({
      isOpened: true
    });

    const isMetadataOpened = ref(props.isOpen)

    const isNew = ref(true)
    const metadata = reactive({})
    let authorThumbnailUrl = ref(null)

    const getValue = (data) => {
      function getLink(string) {
        if (string.includes("http")) {
          return `<a target="_blank" href="${string}">${string}</a>`
        } else {
          return string
        }
      }
      console.log("data", data)
      if (Array.isArray(data)) {
        return getLink(data[0])
      } else if (typeof(data) === 'object') {
        return getLink(Object.values(data)[0])
      } else {
        return getLink(data)
      }
    }
    const ImgUrl = (source) => {
      console.log("ImgUrl / source", source)
      const path = new URL('@/assets/images/', import.meta.url);
      return `${path}/Logo_${source}.png`
    }

    /*const ImgUrl = (source) => {
      var images = require.context('../assets/', false, /\.png$/)
      return images('./' + source + ".png")
    }*/

    console.log("state.metadata", metadata)

    const fetchAuthorThumbnailUrl = async (options = {}) => {
      if (metadata.wikidata) {
        let wikidata_id = metadata.wikidata.split("/");
        wikidata_id = wikidata_id[wikidata_id.length - 1];

        console.log("fetchAuthorThumbnailUrl");

        const response = await fetch(
          `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${wikidata_id}&format=json&origin=*`,
          { method: "GET", ...options }
        );
        const document = await response.json();
        console.log("check AuthorThumbnailUrl response", document)

        if (document.claims.P18) {
          let wikidata_link = document.claims.P18[0]["mainsnak"]["datavalue"][
            "value"
          ].replaceAll(" ", "_");

          const _sum = md5(wikidata_link);
          wikidata_link = `https://upload.wikimedia.org/wikipedia/commons/${_sum[0]}/${_sum[0]}${_sum[1]}/${encodeURI(wikidata_link)}`;
          authorThumbnailUrl.value = wikidata_link;

          console.log("author url", authorThumbnailUrl.value);
        } else {
          authorThumbnailUrl.value = null;
        }
      } else {
        authorThumbnailUrl.value = null;
      }
    };

    const fetchBiblioData = async () => {
      if (metadata.data_bnf) {
        const httpsUrl = metadata.data_bnf.replace("http:", "https:");
        //console.log("extra metadata:", httpsUrl);
        console.log(decodeURIComponent(`${httpsUrl}`));
        const redirectUrl = await fetch(`${httpsUrl}`, {
          method: "GET",
          redirect: "follow",
          mode: "cors"
        });
        console.log("redirectUrl.url after redirect : ", redirectUrl.url);
        let httpsUrlJson = redirectUrl.url.replace("/fr", "") + ".json"; //.slice(0, -1)
        console.log("biblio json URL", httpsUrlJson);
        const biblioResponse = await fetch(`${httpsUrlJson}`, {
          method: "GET",
          mode: "cors",
        }).then((response) => {
              return response.json()
        }).catch(() => {
          console.error('Error while loading databnf data')
        })
        console.log("fetch biblio data", biblioResponse);
      }
    };

    const metaDataCssClass = computed(() => {
      return state.isOpened ? "is-opened" : "";
    });

    const toggleContent = function (event) {
      event.preventDefault()
      event.stopPropagation()
      isMetadataOpened.value = !isMetadataOpened.value
      context.emit('changeMetadata', { isMetadataOpened : isMetadataOpened.value })
      console.log("MetadataModal emit event : ", event)
    };

    const toggleNew = function (event) {
      event.preventDefault();
      isNew.value = !isNew.value;
    };

    //const $rdf = require('rdflib')
    const fetchRDF = async () => {
      console.log("metadata.value.idref : ", metadata.idref);
      if (metadata.idref) {
        console.log("metadata.value.idref : ", metadata.idref);
        const store = $rdf.graph();
        const me = store.sym(metadata.idref);
        console.log("me : ", me);
      }
    }

    // when the component is created
    // and when the metadata changes
    watch(
      () => props.metadata,
      () => {
        console.log("metadata watch current, new : ", metadata, props.metadata)
        /*let cleanMetadata = Object.keys(props.metadata)
          .filter(key => props.metadata[key] !== null)
          .reduce((acc, key) => {
            acc[key] = props.metadata[key];
            return acc;
          }, {});
        Object.assign(metadata, cleanMetadata)*/

        const removeKeys = (obj, keys) => obj !== Object(obj)
      ? obj
      : Array.isArray(obj)
      ? obj.map((item) => removeKeys(item, keys))
      : Object.keys(obj)
          .filter((k) => !keys.includes(k))
          .reduce(
            (acc, x) => Object.assign(acc, { [x]: removeKeys(obj[x], keys) }),
            {}
          )

        let removedKeys = ['extensions', 'id', 'downloadXML', 'downloadPDF', 'iiifManifestUrl']

        let filteredMetadata = {}
        Object.assign(filteredMetadata, {})
        filteredMetadata = removeKeys(props.metadata, removedKeys)
        console.log("filteredMetadata", filteredMetadata)
        Object.assign(metadata, filteredMetadata)
        fetchAuthorThumbnailUrl();
        fetchBiblioData();
        fetchRDF();
      },
      { deep: true, immediate: true}
    )
    watch(props, (newProps) => {
      isMetadataOpened.value = newProps.isOpen;
      console.log("CollectionModal watch isOpen props isMetadataOpened.value : ", isMetadataOpened.value)
    });

    return {
      metaDataCssClass,
      isNew,
      isMetadataOpened,
      toggleContent,
      toggleNew,
      authorThumbnailUrl,
      metadata,
      getValue,
      ImgUrl
    };
  },
};
</script>

<style scoped>
.test {
  display: block !important;
}
.modal-container {
    max-width: 1100px !important;
    margin: 150px auto;
    padding: 20px 30px;
    background-color: #fbf8f4;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    max-height: 60vh;
    overflow-y: auto;
    color: #4a4a4a;
}
.modal-document-metadata {
  position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
.modal-document-metadata-header {
  display: flex;
  width: 100%;
  padding: 20px;
  background-color: #e4e4e4;
  border-radius: 6px;
  position: relative;

  font-family: "Barlow Semi Condensed", sans-serif !important;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
}
.is-opened .modal-document-metadata-header {
  border-radius: 6px 6px 0 0;
}
.modal-document-metadata-header span.metadata-header-author {
  margin-right: 40px;
  color: #4a4a4a;
}
.modal-document-metadata-header span.metadata-header-title {
  color: #929292;
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
.is-opened .toggle-btn {
  background: url(../assets/images/croix.svg) center / cover no-repeat;
}

.modal-document-metadata-header > a {
  text-decoration: none;
  border: none;
  max-width: calc(100% - 40px);
}
.modal-document-metadata .menu {
  display: none;
}
.modal-document-metadata.is-opened .menu {
  display: block;
}
ol,
ul {
  list-style: none;
}
aside.menu > .columns {
  padding: 25px 20px 40px;
  border-top: solid 2px #fcfcfc;
  background-color: #e4e4e4;
  border-radius: 0 0 6px 6px;
}
aside.menu > .columns > .column {
  padding: 0;
}
aside.menu > .columns > .column:nth-child(1) {
  padding-right: 50px;
}
aside.menu > .columns > .column:nth-child(2) {
  padding-right: 80px;
}
aside.menu > .columns > .column:nth-child(3) {
  max-width: 50%;
}
.column .title, span.title,
.column {
  font-family: "Barlow", sans-serif;
  font-size: 15px;
  font-weight: 500;
  font-style: normal;
}
.title {
  text-indent: 0;
  margin-bottom: 0;
  color: #4a4a4a;
}
h2.title {
  text-align: left;
  margin: 0 0 20px 0;
  padding: 0;
  text-transform: uppercase;
  font-weight: 700;
  color: #929292;
}
figure img,
figure {
  margin: 0 !important;
  padding: 0 !important;
  border: none;
}
.author-default-thumbnail {
  display: block;
  width: 120px;
  height: 158px;
  background: url(../assets/images/fantome.png) center / contain no-repeat;
}
.thesis-infos,
.thesis-links > div {
  gap: 40px;
}
.thesis-links .column {
  padding: 15px 0 0 0;
}

@media screen and (max-width: 1150px) {
  .menu-list,
  aside.menu > .columns {
    flex-direction: column;
  }
  aside.menu > .columns > .column:nth-child(1) {
    width: 25% !important;
    padding-right: 0;
    margin-bottom: 50px;
  }
  aside.menu > .columns > .column:nth-child(2),
  aside.menu > .columns > .column:nth-child(3) {
    width: 100% !important;
    padding-right: 0;
    margin-bottom: 50px;
  }
  aside.menu > .columns > .column:nth-child(3) {
    max-width: 75% !important;
  }
  .thesis-links {
    margin-top: 40px;
  }
}
@media screen and (max-width: 800px) {
  aside.menu > .columns > .column:nth-child(1) {
    width: 50% !important;
  }
  .modal-document-metadata-header > a {
    max-width: calc(100% - 30px);
  }
  .modal-document-metadata-header span.metadata-header-title,
  .modal-document-metadata-header span.metadata-header-author {
    display: block;
  }
}
@media screen and (max-width: 640px) {
  .toggle-btn {
    width: 20px;
    right: 15px;
  }
}
td {
  vertical-align: middle !important;
}
</style>
