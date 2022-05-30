<template>
<div class="content px-2">
  <v-content class="wrapper">
  <p  class="text-h4 mb-15">Case Studies</p>
  <div class="casestudy-content" v-for="cs in getCaseStudies"  :key="cs.id" >
    <a class="anchor" :id="`case-study-${cs.id}`"></a>
    <p class="d-flex flex-column">
      <span class="black--text text-h5" >{{cs.name}}</span>

    </p>
    <p class="text-body-1">
      {{cs.description}}    </p>
    <p class="link mt-n3"><nuxt-link class=" text-caption text--secondary"  :to="`/casestudy/${cs.id}`">discover more</nuxt-link></p>

  </div></v-content>

</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'index',

  computed: {
    ...mapGetters('data',['getCaseStudies']),
  }
};
</script>

<style scoped>
.content{
  background: linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(~assets/network.svg) center top;
  background-repeat: repeat-y;
}
.content .wrapper{
  max-width: 900px;
  margin: auto;

}
a.anchor {
  display: block;
  position: relative;
  top: -150px;
  visibility: hidden;
}

.casestudy-content{

  margin-bottom: 80px;
}

.link{
  transition:all ease-in-out 100ms;
}

.link:hover{
  transform:translateX(5px);
  opacity:0.8;
}
</style>
