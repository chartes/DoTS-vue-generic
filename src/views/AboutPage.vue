<template>
  <article class="about">
    <div class="tiles">
      <div class="tile page-header app-width-padding">
        <div class="tile is-child">
          <div class="is-flex is-flex-direction-row title-tile">
            <p class="title">
              {{ collectionAltTitle ? collectionAltTitle : currentCollection.title }}
            </p>
            <!--<p class="header-baseline">
              <span>Position</span> : à l’origine, les positions prises et à défendre par
              l’élève, face au jury. Depuis, un résumé de la thèse soutenue.
            </p>-->
          </div>
        </div>
      </div>
    </div>
    <div class="about-page app-width-padding"><!--:class="isMenuOpened ?'opened' : ''"-->
      <div class="tab-menu">
        <div
          type="is-toggle"
        ><!-- @click="scrollToTop" -->
          <aside class="menu">
            <p
              class="menu-label"
              :class="currentTab === tab[1] ? 'is-active' : ''"
              v-for="(tab, index) in tabs"
              :key="index"
              @click="currentTab = tab[1]" v-text="tab[0]"
            />
          </aside>
        </div>
      </div>
      <div class="content-menu">
        <keep-alive>
          <component
            class="content"
            :is="currentTab"
          >
          </component>
        </keep-alive>
      </div>
    </div>
  </article>
</template>
<script>
import {shallowRef, defineAsyncComponent, ref} from 'vue'
import myComponents from '@/views/about/index'

export default {
  name: 'AboutPage',
  props: {
    currentCollection: {
      type: Object,
      required: true
    }
  },
  /*
  components: {
    tabs: () => myComponents.forEach((comp) => {
      return defineAsyncComponent(async () => comp.tabPath)
    })
  }, */

  setup (props) {
    const collectionAltTitle = `${import.meta.env.VITE_APP_PROJECT_ALT_TITLE}`
    const currCollection = ref(props.currentCollection)
    console.log('AboutPage setup props.currentCollection / currCollection', props.currentCollection, currCollection.value)
    console.log('AboutPage setup myComponents', myComponents)
    const tabs = []
    for (let i = 0; i < myComponents.length; i += 1) {
      console.log('AboutPage setup comp : ', myComponents[i], '\n comp.tabName : ', myComponents[i].tabName, '\n comp.tabPath : ', myComponents[i].tabPath)
      // const name = filePath.split('/').pop().replace('.vue', '')
      const component = defineAsyncComponent(async () => import(`${myComponents[i].tabPath}.vue`))
      tabs.push([myComponents[i].tabName, component])
    }
    console.log('AboutPage setup tabs', tabs)

    /* const componentsTest = () => {
  for (const filePath in Object.keys(components)) {
    console.log('AboutPage setup filePath', filePath)
    console.log('AboutPage setup components[filePath]', components[filePath])
    defineAsyncComponent(async () => {
      return new Promise((resolve) => {
        resolve({
          template: components[filePath]
        })
      })
    })
  }
}

console.log('AboutPage setup componentsTest', componentsTest) */
    console.log('AboutPage setup tabs[0]', tabs[0])
    const currentTab = shallowRef(tabs[0][1])
    return {
      currCollection,
      collectionAltTitle,
      tabs,
      currentTab
    }
  }
}

</script>
<style>
article.about {
  margin-top: 0;
}
.about-page {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-content: center;
  & .tab-menu {
    margin: 20px 10px auto auto;
    height: 100%;
    width: 20%;
    & > div > aside > p.menu-label {
      padding-top: 5px;
      padding-bottom: 5px;
      padding-left: 20%;
      color: #B9192F;
      font-size: 16px;
      text-transform: uppercase;
      &:hover {
        background-color: rgba(185, 25, 47, 15%);
      }
      &.is-active {
        padding-left: calc(20% - 2px);
        border-left: solid 2px #B9192F;
      }
    }
  }
  & .content-menu {
    margin: 20px 10px auto;
    height: 100%;
    width: 80%;
  }
}
.about .content {
  font-family: "Libre Baskerville", serif !important;
  font-size: 16px;
  text-align: left;
  font-weight: 400;
  line-height: 28px;
  color: #5F5F5F;
  text-indent: 0;
  padding: 0 8% 100px;
}
.about .content p,
.about .content ul {
  font-family: "Barlow", sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 32px;
  color: #5F5F5F;
}
.about .content p {
  text-align: left;
  text-indent: 0;
}
.about .content ul {
  padding-bottom: 10px;
  margin-left: 0;
  list-style-position: inside;
}
.about .content ul > li {
  margin-bottom: 0;
}
.about .content h1,
.about .content h2 {
  padding-top: 0;
}
.about .content h1 {
  margin: 30px 0 !important;
  font-family: "Noto Serif", serif;
  font-weight: 400;
  font-style: normal;
  font-size: 30px;
  line-height: 42px;
}
.about .content h2 {
  margin: 70px 0 30px !important;
  font-family: "Barlow", sans-serif;
  font-weight: 400;
  font-size: 28px;
  line-height: 34px;
  color: #B9192F;
}

@media screen and (max-width: 800px) {
  .about .content {
    padding: 0 20px 50px;
  }
  .about .content p,
  .about .content ul {
    font-size: 16px;
    line-height: 24px;
  }
  .about .content p {
    margin: 0 0 !important;
  }
  .about .content ul {
    list-style-position: inside;
    margin: 20px 0 !important;
  }
  .about .content h1 {
    width: 80%;
    margin: 35px 0 !important;
    font-size: 30px;
    line-height: 36px;
  }
  .about .content h1,
  .about .content h2 {
    text-align: left;
    width: 80%;
  }
}
</style>
