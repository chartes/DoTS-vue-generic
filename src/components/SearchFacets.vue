<template>
  <div class="search-facets">
    <div
      class="filters-header-title"
      @click="toggleAllFacets"
    >
      Filtres
          <i
            class="arrow"
            :class="{ opened: allOpened }
            "
          />
    </div>

    <div
      v-for="facet in orderedFacets"
      :key="facet.id"
      class="facet-box"
    >
      <div
        class="facet-header"
        @click="toggleOpen(facet.id)"
      >
        <span class="facet-header-label">
          {{ facet.label }} {{ facet.values?.length ? `(${facet.values.length})` : '' }}
          <i
            class="arrow"
            :class="{ opened: isOpen(facet.id) }"
          />
        </span>
      </div>

      <!-- Valeurs actuellement sélectionnées pour CETTE facette, affichées
           sous son header - visible même repliée, en plus de la barre
           sticky du haut qui liste tout confondu.
           Deux cas : facette à valeurs (Auteur, Langage...) -> un tag par
           valeur sélectionnée ; facette temporelle (Date du colloque...)
           -> un seul tag pour la plage en cours, s'il y en a une. -->
      <div
        v-if="facet.type !== 'temporal' && tagsForFacet(facet.id).length"
        class="facet-active-tags"
      >
        <span
          v-for="tag in tagsForFacet(facet.id)"
          :key="tag.raw"
          class="facet-tag"
        >
          {{ tag.label }}
          <button
            type="button"
            class="facet-tag-remove"
            aria-label="Retirer ce filtre"
            @click="console.log('[debug] clic croix facette (terms)', tag); $emit('remove-facet-value', tag)"
          >×</button>
        </span>
      </div>

      <div
        v-else-if="facet.type === 'temporal' && temporalRangeFor(facet)"
        class="facet-active-tags"
      >
        <span class="facet-tag">
          {{ formatRange(temporalRangeFor(facet)) }}
          <button
            type="button"
            class="facet-tag-remove"
            aria-label="Retirer ce filtre"
            @click="console.log('[debug] clic croix facette (temporal)', facet.temporal.key); $emit('reset-range', facet.temporal.key)"
          >×</button>
        </span>
      </div>

      <div
        v-show="isOpen(facet.id)"
        class="facet-body"
      >
        <!-- ===================== -->
        <!-- Facette temporelle -->
        <!-- ===================== -->
        <template v-if="facet.type === 'temporal'">
          <TemporalFacetSlider
            :temporal-facets="[facet.temporal]"
            :ranges="ranges"
            @change="$emit('change-range',$event)"
          />
        </template>

        <!-- ===================== -->
        <!-- Facette terms -->
        <!-- ===================== -->

        <template v-else>
          <!-- Parcours alphabétique (ex. Auteurs) : recherche + A-Z + cases à cocher -->
          <template v-if="isAlphabetFacet(facet.id)">
            <AlphabetFacetPicker
              :items="mergeSelected(facet.id, facet.values)"
              :selected-keys="selectedKeysFor(facet.id)"
              :label="facet.label"
              :placeholder="`Rechercher ${facet.label}`"
              @toggle="(item) => toggleFacet(facet.id, item)"
            />
          </template>

          <!-- Rendu par défaut : autocomplétion + candidats cliquables -->
          <template v-else>
            <div
              class="facet-search"
              :ref="el => setFacetSearchRef(facet.id, el)"
            >
              <input
                class="facet-input"
                type="text"
                :value="facetFilters[facet.id] || ''"
                @input="setFacetFilter(
                  facet.id,
                  $event.target.value
                )"
                @focus="openFacetDropdown(facet.id)"
                @keydown.escape="closeFacetDropdown(facet.id)"
                :placeholder="facetPlaceholder(facet)"
              >


              <div
                v-if="isFacetDropdownOpen(facet.id) && candidateFacetValues(facet.id, facet.values).length"
                class="facet-dropdown"
              >
                <div
                  v-for="item in candidateFacetValues(facet.id, facet.values)"
                  :key="item.facet_key || item.value"
                  class="facet-item facet-candidate"
                  role="option"
                  @mousedown.prevent
                  @click="selectFacetCandidate(facet.id, item)"
                >
                  {{ item.label || item.value }}
                  ({{ item.count }})
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>

import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import TemporalFacetSlider from './TemporalFacetSlider.vue'
import AlphabetFacetPicker from './AlphabetFacetPicker.vue'

const props = defineProps({

  openedFacets:{
      type: Array,
      default: () => []
  },
  facets:{
        type: Array,
        default: () => []
    },

    temporalFacets:{
        type: Array,
        default: () => []
    },

    activeFacets:{
        type: Array,
        default: () => []
    },

    ranges:{
        type: Object,
        default: () => ( {} )
    },

    config:{
        type: Object,
        default: () => ( {} )
    },

    // Clés canoniques (facet.key, ex. "dublinCore.contributor") des facettes
    // "terms" à afficher avec le parcours alphabétique
    // (recherche + index A-Z + cases à cocher) plutôt que le rendu par défaut.
    alphabetFacetIds:{
        type: Array,
        default: () => ['dublinCore.contributor']
    }

})
watch(
  () => props.ranges,
  ranges => {

    Object.keys(ranges).forEach(key => {

      if (!props.openedFacets.includes(key)) {

        emit(
          'facet-open',
          key
        )

      }

    })

  },
  {
    immediate:true,
    deep:true
  }
)

const emit = defineEmits([
    'toggle-facet',
    'facet-open',
    'facet-close',
    'change-range',
    'reset-range',
    'reset-facet',
    'remove-facet-value'
])//'apply-collections'

const facetFilters = ref({})
const facetShowAll = ref({})
const facetDropdownOpen = ref({})

function isFacetDropdownOpen(facetId) {
    return !!facetDropdownOpen.value[facetId]
}

function openFacetDropdown(facetId) {
    facetDropdownOpen.value[facetId] = true
}

function closeFacetDropdown(facetId) {
    facetDropdownOpen.value[facetId] = false
}

// Fermeture du dropdown de suggestions : on ne se base plus sur @blur du
// champ. Sur mobile, scroller la sidebar pour atteindre le dropdown fait
// perdre le focus au champ (le navigateur masque le clavier virtuel dès
// que la page défile), ce qui déclenchait un blur -> fermeture immédiate
// du dropdown avant même d'avoir pu le voir en scrollant.
// On détecte donc la fermeture "clic/tap en dehors" nous-mêmes, ce qui ne
// se déclenche pas pendant un simple scroll tactile.
const facetSearchRefs = {}

function setFacetSearchRef(facetId, el) {
    if (el) {
        facetSearchRefs[facetId] = el
    } else {
        delete facetSearchRefs[facetId]
    }
}

function handleClickOutsideFacetDropdowns(event) {
    Object.keys(facetDropdownOpen.value).forEach(facetId => {
        if (!facetDropdownOpen.value[facetId]) return
        const container = facetSearchRefs[facetId]
        if (container && !container.contains(event.target)) {
            closeFacetDropdown(facetId)
        }
    })
}

onMounted(() => {
    document.addEventListener('click', handleClickOutsideFacetDropdowns)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutsideFacetDropdowns)
})

// Sélection d'un candidat depuis le menu déroulant : on l'ajoute aux
// filtres actifs, on vide le champ de recherche et on referme le menu.
function selectFacetCandidate(facetId, item) {
    toggleFacet(facetId, item)
    setFacetFilter(facetId, '')
    closeFacetDropdown(facetId)
}

function isOpen(facetId){
    return props.openedFacets.includes(facetId)
}

function isAlphabetFacet(facetId){
    return props.alphabetFacetIds.includes(facetId)
}

const allOpened = computed(() => {
  const ids = orderedFacets.value.map(f => f.id)
  return ids.length > 0 &&
    ids.every(id => props.openedFacets.includes(id))
})

function toggleAllFacets() {

  const ids = orderedFacets.value.map(f => f.id)

  if (allOpened.value) {
    ids.forEach(id => emit('facet-close', id))
  } else {
    ids.forEach(id => emit('facet-open', id))
  }
}


function toggleOpen(facetId){
    if (isOpen(facetId)) {
        emit('facet-close', facetId)
    }
    else {
        emit('facet-open', facetId)
    }
}

function setFacetFilter(facetId, value) {
    facetFilters.value[facetId] = value
}

function getFacetShowAll(facetId) {

    if (facetShowAll.value[facetId] === undefined) {
        facetShowAll.value[facetId] = false
    }

    return facetShowAll.value[facetId]
}

function toggleFacetShowAll(facetId) {
    facetShowAll.value[facetId] = !getFacetShowAll(facetId)
    if (facetShowAll.value[facetId]) {
        openFacetDropdown(facetId)
    }
}

const orderedFacets = computed(()=>{

    const result = []

    // =====================
    // Facettes temporelles
    // =====================

    props.temporalFacets.forEach(f=>{

        result.push({
            id: f.key,
            label: f.label,
            type: 'temporal',
            temporal: f,
            order: f.order ?? 999
        })

    })

    // =====================
    // Facettes terms
    // =====================

    props.facets.forEach(f=>{

        result.push({
            id: f.key,
            label: f.label,
            values: f.values,
            type: 'terms',
            facet: f,
            order: f.order ?? 100
        })

    })
    return result.sort(
        (a,b)=>a.order-b.order
    )
})

// Texte affiché comme placeholder dans le champ de recherche de facette :
// simplement le label de la facette (plus de suggestion animée de valeurs).
function facetPlaceholder(facet) {
    return `Filtrer ${facet.label}`
}

// Clé d'identification d'une valeur de facette (constante quel que soit le
// nom de champ utilisé selon la provenance de la donnée).
function facetValueKey(item){
    return item.facet_key ?? item.value ?? item.id
}

// Clés actuellement sélectionnées pour une facette donnée, à partir de
// activeFacets (source de vérité côté recherche).
function selectedKeysFor(facetId){
    return props.activeFacets
        .filter(f => f.facetType === facetId)
        .map(f => f.raw ?? f.facet_key ?? f.value ?? f.id)
}

// Tags (objets complets {facetType, id, label, raw}) à afficher sous le
// header d'une facette donnée. Même source que selectedKeysFor, mais on
// garde l'objet entier : le raw est nécessaire pour retirer le bon filtre
// (cf. SearchPage.vue removeActiveFacet, qui utilise tag.raw).
function tagsForFacet(facetId){
    return props.activeFacets.filter(f => f.facetType === facetId)
}

// Plage actuellement active pour une facette temporelle donnée, si elle
// existe (props.ranges est keyed par la clé canonique facet.temporal.key -
// même clé que celle utilisée par resetFacet() plus bas pour la
// réinitialiser ; facet.temporal.field est le chemin ES, pas la clé).
function temporalRangeFor(facet){
    return props.ranges?.[facet.temporal.key] || null
}

// Formatage identique à ActiveSearchFilters.vue (formatRange), pour un
// rendu cohérent entre la barre sticky du haut et le tag sous la facette.
function formatRange(range){
    if (!range) return ''
    return `${range.gte ?? '∞'} - ${range.lte ?? '∞'}`
}

// Fusionne les valeurs venant d'Elasticsearch avec les valeurs sélectionnées
// que l'agrégation ne renvoie plus (ex. une fois le filtre appliqué, ES peut
// ne plus inclure ce terme dans ses buckets) : on les reconstruit à minima
// pour que la case reste cochée et visible.
function mergeSelected(facetId, values){

    const list = values || []
    const selectedKeys = selectedKeysFor(facetId)

    const selectedFromActive = selectedKeys.map(key => {
        const existing = list.find(v => facetValueKey(v) === key)
        if (existing) return existing
        return {
            facet_key: key,
            value: key,
            label: key,
            count: 0,
            selected: true
        }
    })

    const rest = list.filter(v => !selectedKeys.includes(facetValueKey(v)))

    return [...selectedFromActive, ...rest]
}

const sortAlpha = (a,b) =>
    (a.label || a.value || '')
        .localeCompare((b.label || b.value || ''), 'fr', { sensitivity:'base' })

// Candidats (non sélectionnés) proposés dans le menu déroulant
// d'autocomplétion, sous le champ de saisie.
function candidateFacetValues(facetId, values) {
    const term =
        (facetFilters.value[facetId] || '')
            .trim()
            .toLowerCase()

    const showAll = getFacetShowAll(facetId)

    const selectedKeys = selectedKeysFor(facetId)

    let available = values.filter(v => {
      const key = facetValueKey(v)
      const matchesTerm =
          !term ||
          (v.label || v.value || '').toLowerCase().includes(term)
      const hasCount = (v.count ?? 0) > 0
      return (
          !selectedKeys.includes(key) &&
          (
              hasCount ||
              showAll ||
              (term && matchesTerm)
          )
      )
    })

    if (term) {
        available = available.filter(v =>
            (v.label || v.value || '').toLowerCase().includes(term)
        )
    }

    return available.sort(sortAlpha)
}

function isSelected(facetId, item){

    const value = facetValueKey(item)

    return props.activeFacets.some(f =>
        f.facetType === facetId &&
        (
            f.raw === value ||
            f.id === value ||
            f.value === value ||
            f.facet_key === value
        )
    )
}

function toggleFacet(facetId, item) {

    emit('toggle-facet', {
        facetType: facetId,
        facetKey: facetValueKey(item),
        isCollection: facetId === 'collections'

    })

}

function resetFacet(facet) {

    if (facet.type === 'temporal') {
        emit('reset-range', facet.temporal.key)
        return
    }
    emit('reset-facet', facet.id)
}

watch(
  () => props.activeFacets,
  facets => {

    facets.forEach(f => {
      if (!props.openedFacets.includes(f.facetType)) {
        emit('facet-open', f.facetType)
      }
    })
  },
  {
    immediate:true,
    deep:true
  }
)

// Déplier toutes les facettes par défaut, une seule fois au premier
// chargement (dès que la liste n'est plus vide). On ne le refait pas
// ensuite, pour ne pas ré-ouvrir une facette que l'utilisateur a
// volontairement repliée après coup.
const facetsInitiallyOpened = ref(false)

watch(
  orderedFacets,
  facets => {

    if (facetsInitiallyOpened.value) return
    if (!facets.length) return

    facetsInitiallyOpened.value = true

    facets.forEach(f => {
      if (!props.openedFacets.includes(f.id)) {
        emit('facet-open', f.id)
      }
    })
  },
  {
    immediate:true
  }
)
</script>
<style scoped>
.search-facets{
  display:flex;
  flex-direction:column;
  gap:1rem;
  padding: 0 1rem;
  font-family: "Barlow", sans-serif;

}

.filters-header-title{
  font-size : 24px;
  font-weight: 700;
  font-style: normal;
  color: #000000;
  font-family: "Barlow", sans-serif;
  display:flex;
  align-items:center;
  cursor:pointer;
  user-select:none;
  margin:34px 0 0 0;
  gap: .5rem;
}

.facet-box{
  margin: 1px;
  border:1px solid #ddd;
}

.facet-header{
  background: #f0f0f0;
  padding:.75rem;
  display:flex;
  justify-content:space-between;
  align-items: center;
  cursor:pointer;
  font-weight:600;
}

/* Label + flèche "déplier" regroupés à gauche du header */
.facet-header-label{
  display: flex;
  align-items: center;
  gap: .4rem;
}

/* Valeurs sélectionnées de cette facette, sous son header (visible même
   repliée). */
.facet-active-tags{
  display: flex;
  flex-wrap: wrap;
  gap: .4rem;
  padding: .6rem .75rem;
  background: #fff;
  border-bottom: 1px solid #ddd;
}

.facet-tag{
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  padding: .2rem .5rem;
  font-size: .78rem;
  font-family: "Barlow", sans-serif;
  color: var(--fill-color);
  background: var(--meta-area-fill-color, #f0f0f0);
  border-radius: 12px;
}

.facet-tag-remove{
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  line-height: 1;
  font-size: 1rem;
  color: inherit;
  cursor: pointer;
}

.facet-tag-remove:hover{
  color: #000;
}

.facet-body{
  position: relative;
  padding: 16px;
}

.facet-search{
  position: relative;
  display: flex;
  align-items: center;
  gap: .5rem;
  margin-bottom: .5rem;
}

/* Champ de filtre harmonisé avec .search-form .input (barre de recherche principale) */
.facet-input{
  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 6px 10px;
  font-family: "Barlow", sans-serif;
  font-size: .85rem;
  color: inherit;
  background: none;
  border: 1px solid #979797;
  border-radius: 6px;
  box-shadow: none;
}

.facet-input:focus{
  outline: none !important;
  box-shadow: none !important;
  border-color: #ffffff;
}

/* Bouton "Show all/Hide" harmonisé avec les boutons de la barre de recherche */
.facet-eye-btn{
  flex: 0 0 auto;
  height: 36px;
  padding: 0 12px;
  font-family: "Barlow", sans-serif;
  font-size: .78rem;
  font-weight: 600;
  color: var(--fill-color);
  background: #fff;
  border: 1px solid #979797;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color .15s ease, color .15s ease;
}

.facet-eye-btn:hover{
  background: var(--fill-color);
  border-color: var(--fill-color);
  color: #fff;
}

.facet-dropdown{
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 20;
  margin-top: 2px;
  background: #fff;
  border: 1px solid #979797;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,.15);
  max-height: 240px;
  overflow-y: auto;
  font-family: "Barlow", sans-serif;
}

.facet-item{
  display:block;
  margin-bottom:.4rem;
  padding:.3rem .5rem;
  border-radius:6px;
  cursor:pointer;
  user-select:none;
}

.facet-dropdown .facet-item{
  margin-bottom: 0;
  border-radius: 0;
}

.facet-item:hover{
  background: var(--meta-area-fill-color, #f0f0f0);
}

.facet-item:focus-visible{
  outline: 2px solid var(--fill-color, #333);
  outline-offset: 1px;
}

.facet-item.is-selected{
  font-weight:600;
  color: var(--fill-color);
  background: var(--meta-area-fill-color, #eee);
}
.facet-reset-btn {
  flex: 0 0 auto;
  border: none;
  background: transparent;
  cursor: pointer;

  font-size: 18px;
  line-height: 1;
  padding: 2px 4px;
  color: #666;
}

.facet-reset-btn:hover {
  color: var(--fill-color, #000);
}

.arrow {
  display: inline-block;
  width: 0;
  height: 0;

  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--fill-color);

  transition: transform .15s ease;
}

.arrow.opened {
  transform: rotate(180deg);
}

</style>