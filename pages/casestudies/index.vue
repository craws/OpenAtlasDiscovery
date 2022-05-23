<template>
<div class="content px-2">
  <v-content class="wrapper">
  <p  class="text-h4 mb-15">Case Studies</p>
  <div class="casestudy-content" v-for="cs in getCaseStudies"  :key="cs.id" >
    <a class="anchor" :id="`case-study-${cs.id}`"></a>
    <p class="text-h5"><nuxt-link :to="`/casestudy/${cs.id}`">{{cs.name}}</nuxt-link></p>
    <p class="text-body-1">
      {{cs.description}}    </p>
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
  background: linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2)), url(~assets/network.svg) center top;
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
  min-height:300px;

  margin-bottom: 80px;
}
</style>
