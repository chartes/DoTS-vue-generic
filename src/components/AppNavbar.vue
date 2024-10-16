<template>
  <section>
    <nav
      class="level app-width-padding"
      :class="menuCsscClass"
    >
      <div class="level-left">
        <a href="https://www.chartes.psl.eu/" target="_blank" class="logo-header"></a>
        <!-- <span class="level-item" active-class="active">
          <router-link :to="{ name: 'SearchPage' }" active-class="active"
            >Chronique abrégée</router-link
          >
        </span> -->
        <span class="level-item">
          <router-link :to="{ name: 'AboutPage' }" active-class="active"
            >Normes de transcriptions</router-link
          >
        </span>
        <span class="level-item">
          <router-link :to="{ name: 'AboutPage' }" active-class="active"
            >Témoins</router-link
          >
        </span>
      </div>
      <div class="level-right">
        <!-- <span class="level-item">
          <router-link :to="{ name: 'DocumentationPage' }" active-class="active"
            >Documentation</router-link
          >
        </span> -->
      </div>
    </nav>
    <div class="mobile-button">
      <!-- <router-link :to="{ name: 'SearchPage' }" class="home-button"></router-link> -->
      <Burger @change="burgerChanged" :opened="isMenuOpened" />
    </div>
  </section>
</template>
<script>
  import Burger from "./Burger.vue";
  export default {
    name: "AppNavBar",
    components: {Burger},
    data() {
      return {
        isMenuOpened: false
      }
    },
    computed: {
      menuCsscClass () {
        return this.isMenuOpened ? 'is-opened' : ''
      }
    },
    methods: {
      burgerChanged($event) {
        this.isMenuOpened = $event.isOpened;
      },
      closeMenu() {
        this.isMenuOpened = false;
      },
    },
    mounted () {
      document.body.addEventListener('click', this.closeMenu)
    },
    beforeUnmount () {
      document.body.removeEventListener('click', this.closeMenu)
    },
  }
</script>
<style scoped>
nav {
  font-family: 'Barlow', sans-serif;
  font-size: 18px;
  line-height: 1;
  color: #FFFFFF;
  background-color: #B9192F;
  padding-top: 10px;
  padding-bottom: 10px;
}
a {
  color: inherit;
  font-family: inherit;
  background-color: transparent !important;
}
a:hover {
  text-decoration: underline dotted;
  color: #FFFFFF;
}
.active {
  color: #FFFFFF;
  text-decoration: none;
}
.level {
  margin-bottom: 0 !important;
}
nav span.level-item:not(:last-child)::after {
  content: '|';
  display: inline-block;
  color: #000;
  padding-left: .75rem;
}
.logo-header {
  display: inline-block;
  width: 45px;
  height: 50px;
  margin:0 40px 0 2px;
  background: url(../assets/images/head_logo.svg) center / contain no-repeat;
}
.level-left {
  display: flex;
}
.mobile-button {
  display: none;
}
.home-button {
  display: inline-block;
  width: 31px;
  height: 34px;
  background: url(../assets/images/home-mobile.png) center / contain no-repeat;
}

@media screen and (max-width: 800px) {
  .logo-header {
    transform-origin: left center;
    transform: scale(0.8);
    margin-right: 10px !important;
  }
  nav {
    display: flex;
    margin-top: 0;
    font-size: 16px;
    z-index: 10; /* cf documentation menu */

    position: fixed;
    top:0;
    width: 100vw;
    padding-right: 20px;
  }
  .logo-header {
    margin-right: 20px;
  }
  .level-left .level-item:not(:last-child),
  .level-right .level-item:not(:last-child) {
    margin-right: .5rem;
  }
  nav span.level-item:not(:last-child)::after {
    padding-left: .5rem;
  }
  .level-item:not(:last-child) {
    margin-bottom: 0;
  }
  .level-right {
    margin-top: 0;
  }
}
@media screen and (max-width: 500px) {

  nav::before {
    content: '';
    display: block;
    position: absolute;
    top:0;
    left:0;
    width: 100vw;
    height: 71px;
    background-color: #B9192F;
  }
  nav {
    background-color: rgba(185,25,47, 0.9);
    padding: 0;
  }
  .logo-header {
    position: absolute;
    left:10px;
    top:10px;
    transform: scale(1);
    z-index: 1;
  }
  .level {
    display: block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
  }
  .level .level-item {
    display: none !important;
  }
  .level.is-opened .level-item  {
    display: flex !important;
  }
  .mobile-button {
    display: flex;
    align-items: center;
    position: absolute;
    right:15px;
    top:10px;
    z-index: 2;
  }
  .level-left {
    display: block;
    margin-top: 71px;
    border-top:#fcaca9 1px solid;
  }
  .level-right {
    display: block;
  }
  .level-item {
    padding: 5px 0;
    font-size: 25px;
    font-weight: 400;
    line-height: 52px;
  }
  .level-left .level-item:first-of-type {
    padding-top: 10px;
  }
  .level-right .level-item:last-of-type {
    padding-bottom: 10px;
  }
  nav span.level-item[data-v-1fd76d11]:not(:last-child)::after {
    display: none;
  }
}

</style>
