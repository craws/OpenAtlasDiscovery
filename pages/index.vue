<template>
  <div>
    <div class="d-flex justify-center align-center">
      <v-img max-width="500px" max-height="300px" contain src="connecLogo.jpg"/>
      <div class="d-flex flex-column">
        <v-btn elevation="0" color="#f05a39" fab @click="scrollTopMap" class="bubble-btn "  medium>Map</v-btn>
        <v-btn elevation="0" color="#ffc114" fab to="/network" class="bubble-btn " x-large>Actor Network</v-btn>
        <v-btn elevation="0" color="#8e1a41" fab   large class="bubble-btn">Case Studies</v-btn>
      </div>
    </div>
    <v-container class=" ">
      <p class="text-body-1" v-html="getSiteContent.intro"></p>

      <event-map id="eventMap" class="mt-15"></event-map>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EventMap from '../components/EventMap';

export default{
  components: { EventMap },
  computed: {
    ...mapGetters('app', [
      'getSiteContent'
    ]),
  },
  methods:{
    scrollTopMap(){
      const element = document.querySelector("#eventMap");

      element.scrollIntoView({ behavior: 'smooth', block: 'end'});
    }
  }
}
</script>

<style>


.bubble-btn{
  transition: all 100ms ease-in-out;
  transform: scale(0.9);

}
.bubble-btn:hover{
   transform:   scale(1);
 }

.bubble-btn:nth-child(2){
  transform: translateX(30px)  scale(0.9);
}
.bubble-btn:nth-child(2):hover{
  transform: translateX(30px)  scale(1);
}
.bubble-btn:nth-child(1) span{
  transform:translateX(60px)
}
.bubble-btn:nth-child(2) span{
  transform:translateX(120px)
}
.bubble-btn:nth-child(3) span{
  transform:translateX(95px)
}
</style>

