<template>
  <div class="document-metadata" :class="metaDataCssClass">
    <!--<a href="#" v-on:click="toggleNew">
        <span class="metadata-header-author">Switch</span>
    </a>-->
    <div v-if="!isNew">
      <div class="document-metadata-header">
        <a href="#" v-on:click="toggleContent">
          <span
            class="metadata-header-author"
          >
            {{ metadata.author }}
          </span>
          <span
            class="metadata-header-title"
          >
            {{ metadata.title }}
          </span>
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
      <div
        v-if="!isPopUp"
         class="document-metadata-header"
      >
        <div class="resource" v-on:click="toggleContent">

          <span class="metadata-header-title resource">{{ metadata.title }}</span>
          <template v-if="Array.isArray(metadata.author) && metadata.author.length > 0">
            <span
              v-for="(aut, index) in metadata.author"
              v-bind:key="index"
              class="metadata-header-author resource"
            >
              {{ aut }}
            </span>
          </template>
          <span
            v-else-if="metadata.author"
            class="metadata-header-author resource"
          >
            {{ metadata.author }}
          </span>
          <span class="metadata-header-label resource">
            Métadonnées
          </span>
        </div>
        <a href="#" class="toggle-btn" v-on:click="toggleContent"></a>
      </div>
      <div
        v-else
         class="document-metadata-header"
      >
        <div class="collection" v-on:click="toggleContent">
          <span class="metadata-header-label collection">
            Métadonnées
          </span>
          <span class="metadata-header-title collection">{{ metadata.title }}</span>
          <span
            v-if="metadata.author"
            class="metadata-header-author collection"
          >
            {{ metadata.author }}
          </span>
        </div>
        <a href="#" class="toggle-btn" v-on:click="toggleContent"></a>
      </div>
      <aside class="menu">
        <Suspense>
          <div class="is-flex is-justify-content-center">
          <table class="table is-fullwidth"><!-- style="background-color: #e4e4e4;" -->
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
                <tr v-if="Array.isArray(value) && value.length > 1" v-for="(v, i) in value" :key="i" class="row is-align-items-center">
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
                <tr v-if="Array.isArray(value) && value.length > 1" v-for="(v, i) in value" :key="i" class="row is-align-items-center">
                  <td v-if="v === value[0]" :rowspan="value.length"><span class="title" style="font-variant: all-small-caps"><b>{{ name }}</b></span></td>
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
                  <td><span class="title" style="font-variant: all-small-caps"><b>{{ name }}</b></span></td>
                  <td><span class="title" style="text-transform: uppercase; font-size: 12px">{{ value }}</span></td>
                  <td></td>
                </tr>
              </template>
              <template v-for="(value, key, index) in metadata" :key="index">
                <tr v-if="Array.isArray(value) && value.length >= 1" v-for="(v, i) in value" :key="i" class="row is-align-items-center">
                  <td v-if="v === value[0]" :rowspan="value.length"><span class="title is-align-items-center" style="font-variant: all-small-caps"><b>{{ key }}</b></span></td>
                  <td v-if="v.url"><span class="title" style="text-transform: uppercase; font-size: 12px">{{ v.url }}</span></td><!-- {{ Array.isArray(v) ? v[0] : typeof(v) === 'object' ? Object.values(v)[0] : v }} -->
                  <td v-else><span class="title" style="text-transform: uppercase; font-size: 12px">{{ v }}</span></td><!-- {{ Array.isArray(v) ? v[0] : typeof(v) === 'object' ? Object.values(v)[0] : v }} -->
                  <td v-if="v.url">
                    <figure class="image is-24x24 level-left">
                      <a target="_blank" v-bind:href="v.url">
                        <img :src="ImgUrl(v.source.name)"/>
                      </a>
                    </figure>
                  </td>
                  <td v-else></td>
                </tr>
                <tr class="row" v-else-if="value && typeof(value) === 'object'">
                  <td><span class="title" style="font-variant: all-small-caps"><b>{{ key }}</b></span></td>
                  <td><span class="title" style="text-transform: uppercase; font-size: 12px">{{ value.url }}</span></td><!-- {{ Array.isArray(value) ? typeof(value[0]) === 'object' ? Object.values(value[0])[0] : value : typeof(value) === 'object' ? Object.values(value)[0] : value }}-->
                  <td>
                    <figure v-if="value.url && value.url.includes('http')" class="image is-24x24 level-left">
                      <a target="_blank" v-bind:href="value.url">
                        <img :src="ImgUrl(value.source.name)"/>
                      </a>
                    </figure>
                  </td>
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
</template>

<script>
import { computed, reactive, ref, watch } from 'vue'
import md5 from 'md5'
import * as $rdf from 'rdflib'
// import node from "rdflib/src/node.js";

export default {
  name: 'DocumentMetadata',

  components: {},

  props: {
    ispopup: { required: true, default: false, type: Boolean },
    metadataprop: { required: true, default: () => {}, type: Object }
  },

  setup (props) {
    const state = reactive({
      isOpened: false
    })
    const isPopUp = ref(props.ispopup)
    const isNew = ref(true)
    const metadata = ref(props.metadataprop)
    const authorThumbnailUrl = ref(null)

    const getValue = (data) => {
      function getLink (string) {
        if (string.includes('http')) {
          return `<a target="_blank" href="${string}">${string}</a>`
        } else {
          return string
        }
      }
      console.log('data', data)
      if (Array.isArray(data)) {
        return getLink(data[0])
      } else if (typeof (data) === 'object') {
        return getLink(Object.values(data)[0])
      } else {
        return getLink(data)
      }
    }
    const ImgUrl = (source) => {
      console.log('ImgUrl / source', source)
      return new URL(`/src/assets/images/Logo_${source}.png`, import.meta.url).href
    }

    console.log('DocumentMetadata metadata.value : ', metadata.value)

    const fetchAuthorThumbnailUrl = async (options = {}) => {
      if (metadata.value.wikidata) {
        let wikidata_id = metadata.value.wikidata.split('/')
        wikidata_id = wikidata_id[wikidata_id.length - 1]

        console.log('fetchAuthorThumbnailUrl')

        const response = await fetch(
          `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${wikidata_id}&format=json&origin=*`,
          { method: 'GET', ...options }
        )
        const document = await response.json()
        console.log('check AuthorThumbnailUrl response', document)

        if (document.claims.P18) {
          let wikidata_link = document.claims.P18[0].mainsnak.datavalue.value.replaceAll(' ', '_')

          const _sum = md5(wikidata_link)
          wikidata_link = `https://upload.wikimedia.org/wikipedia/commons/${_sum[0]}/${_sum[0]}${_sum[1]}/${encodeURI(wikidata_link)}`
          authorThumbnailUrl.value = wikidata_link

          console.log('author url', authorThumbnailUrl.value)
        } else {
          authorThumbnailUrl.value = null
        }
      } else {
        authorThumbnailUrl.value = null
      }
    }

    const fetchBiblioData = async () => {
      if (metadata.value.data_bnf) {
        const httpsUrl = metadata.value.data_bnf.replace('http:', 'https:')
        // console.log("extra metadata:", httpsUrl);
        console.log(decodeURIComponent(`${httpsUrl}`))
        const redirectUrl = await fetch(`${httpsUrl}`, {
          method: 'GET',
          redirect: 'follow',
          mode: 'cors'
        })
        console.log('redirectUrl.url after redirect : ', redirectUrl.url)
        const httpsUrlJson = redirectUrl.url.replace('/fr', '') + '.json' // .slice(0, -1)
        console.log('biblio json URL', httpsUrlJson)
        const biblioResponse = await fetch(`${httpsUrlJson}`, {
          method: 'GET',
          mode: 'cors'
        }).then((response) => {
          return response.json()
        }).catch(() => {
          console.error('Error while loading databnf data')
        })
        console.log('fetch biblio data', biblioResponse)
      }
    }

    const metaDataCssClass = computed(() => {
      return state.isOpened ? 'is-opened' : ''
    })

    const toggleContent = function (event) {
      event.preventDefault()
      state.isOpened = !state.isOpened
    }

    const toggleNew = function (event) {
      event.preventDefault()
      isNew.value = !isNew.value
    }

    // const $rdf = require('rdflib')
    const fetchRDF = async () => {
      console.log('metadata.value.idref : ', metadata.value.idref)
      if (metadata.value.idref) {
        console.log('metadata.value.idref : ', metadata.value.idref)
        const store = $rdf.graph()
        const me = store.sym(metadata.value.idref)
        console.log('me : ', me)
      }
    }

    // when the component is created
    // and when the metadata changes
    watch(
      () => props.metadataprop,
      () => {
        console.log('metadataprop watch current, new : ', metadata.value, props.metadataprop)

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

        const removedKeys = ['children', 'member', 'editorialLevelIndicator', 'renderToc', 'level', 'expanded', 'router', 'dublincore', 'extensions']/* gerer les 'url' à supp pour les collections seulement */

        metadata.value = props.metadataprop

        let filteredMetadata = {}
        // Object.assign(filteredMetadata, {})
        filteredMetadata = removeKeys(metadata.value, removedKeys)
        console.log('filteredMetadata', filteredMetadata)
        metadata.value = filteredMetadata
        // Object.assign(metadata, filteredMetadata)
        fetchAuthorThumbnailUrl()
        fetchBiblioData()
        fetchRDF()
      },
      { deep: true, immediate: true }
    )

    return {
      metaDataCssClass,
      isPopUp,
      isNew,
      toggleContent,
      toggleNew,
      authorThumbnailUrl,
      metadata,
      getValue,
      ImgUrl
    }
  }
}
</script>

<style scoped>
.test {
  display: block !important;
}
.document-metadata {
  width: 100%;
  font-family: "Barlow", sans-serif !important;
}
.document-metadata-header {
  display: flex;
  width: 100%;
  padding: 20px;
  background-color: #e4e4e4;
  border-radius: 6px;
  position: relative;

  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-decoration: none;
  border: none;
  & > div.resource {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    align-items: baseline;
    width: 100%;
  }
}
.is-opened .document-metadata-header {
  border-radius: 6px 6px 0 0;
}
.document-metadata-header span.metadata-header-label.collection{
  margin-right: 40px;
  font-family: "Barlow Semi Condensed", sans-serif !important;
  font-weight: 500;
  color: #4a4a4a;
}
.document-metadata-header span.metadata-header-label.resource {
  margin-right: 47px;
  margin-left: auto;
  text-align: left;
  font-family: "Barlow Semi Condensed", sans-serif !important;
  font-weight: 500;
  color: #4a4a4a;
}
.document-metadata-header span.metadata-header-title.collection {
  margin-right: 40px;
  color: #4a4a4a;
}
.document-metadata-header span.metadata-header-title.resource {
  margin-right: 40px;
  font-size: 20px;
  font-weight: 500;
  color: #971716;
}
.document-metadata-header span.metadata-header-author {
  color: #929292;
}
/* toogle */
.toggle-btn {
  position: absolute;
  right: 20px;
  width: 27px;
  height: 27px;
  background: url(../assets/images/chevron_rouge.svg) center top -4px / cover no-repeat;
  border: none;
  text-decoration: none;
}
.is-opened .toggle-btn {
  background: url(../assets/images/croix.svg) center / cover no-repeat;
}

.document-metadata-header > a {
  text-decoration: none;
  border: none;
  max-width: calc(100% - 40px);
}
.document-metadata .menu {
  display: none;
}
.document-metadata.is-opened .menu {
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
  .document-metadata-header > a {
    max-width: calc(100% - 30px);
  }
  .document-metadata-header span.metadata-header-title,
  .document-metadata-header span.metadata-header-author {
    display: block;
  }
}
@media screen and (max-width: 640px) {
  .toggle-btn {
    width: 20px;
    right: 15px;
  }
}
table {
  background-color: #f1f1f1;
  border-radius: 0 0 6px 6px;
}
td {
  vertical-align: middle !important;
}
</style>
