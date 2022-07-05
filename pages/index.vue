<template>
  <div>
    <div class="full-height d-flex justify-center align-center">
      <div>

        <div class="d-flex justify-center align-center flex-wrap mb-10" :class="{'hero':!$vuetify.breakpoint.smAndDown}">

              <v-img max-width="600px" max-height="400px" contain src="connecLogo.jpg"/>

            <div class="d-flex align-center justify-center">
              <div class="navigation-btns" style="position:relative;" :class="{'rotate':!$vuetify.breakpoint.smAndDown}">
                <nuxt-link  style="--i:3; --circle-col:#4fb548;" to="/userguide"
                     class="bubble-btn d-flex">
                  <div class="d-flex align-center bubble-btn-content text-no-wrap">
                    <div class="circle d-inline-block mr-2"></div>
                    <span>User Guide</span>
                  </div>
                </nuxt-link>


                <nuxt-link style="--i:4; --circle-col:#f05a39;" to="/map"
                     class="bubble-btn d-flex">
                  <div class="d-flex align-center bubble-btn-content text-no-wrap">
                    <div class="circle d-inline-block mr-2"></div>
                    <span>Map</span>
                  </div>
                </nuxt-link>

                <nuxt-link style="--i:5; --circle-col:#ffc114;" to="/network"
                     class="bubble-btn d-flex">
                  <div class="d-flex align-center bubble-btn-content text-no-wrap">
                    <div class="circle d-inline-block mr-2"></div>
                    <span>Actor Connections</span>
                  </div>
                </nuxt-link>

                <nuxt-link style="--i:6; --circle-col:#581644;" to="/casestudies"
                           class="bubble-btn d-flex">
                  <div class="d-flex align-center bubble-btn-content text-no-wrap">
                    <div class="circle d-inline-block mr-2"></div>
                    <span>Case Studies</span>
                  </div>
                </nuxt-link>

                <nuxt-link style="--i:7; --circle-col:#8e1a41;" to="/methodology"
                           class="bubble-btn d-flex">
                  <div class="d-flex align-center bubble-btn-content text-no-wrap">
                    <div class="circle d-inline-block mr-2"></div>
                    <span>Methodology</span>
                  </div>
                </nuxt-link>
              </div>
            </div>
        </div>
        <p class="text-body-1 intro text-center" v-html="getSiteContent.intro"></p>

      </div>
    </div>

    <v-container>

      <event-map id="eventMap" class="mt-15"></event-map>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EventMap from '../components/EventMap';

export default {
  components: { EventMap },

  computed: {
    ...mapGetters('app', [
      'getSiteContent'
    ]),
  },
  methods: {
    scrollTopMap() {
      const element = document.querySelector('#eventMap');

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }
};
</script>

<style>
.hero {
 transform: translateX(-60px)
}

.full-height {
  min-height: calc(100vh - 64px);
}

.intro {
  max-width: 600px;
  margin: auto;
}

.bubble-btn {
  text-style:none;
  cursor:pointer;
}

.rotate .bubble-btn {
  width: 200px;
  position: absolute !important;
  top: 0;
  bottom: 0;
  transform-origin: 150px;
  transform: rotate(calc(180deg / 5 * var(--i)));
}

.bubble-btn:hover .circle{
  transform:scale(1.2);
}

.bubble-btn:hover span{
  transform:translateX(-3px);
}

.rotate .bubble-btn .bubble-btn-content {
  transform: rotate(calc(180deg / 5 * var(--i) * -1));
}

.bubble-btn .bubble-btn-content span{
  color:black;
  transition: all ease-in-out 100ms;

}

.rotate .bubble-btn .bubble-btn-content span{
  --sizeFactor:  max(var(--i) - 5 , (-1) * (var(--i) - 5));
  position:absolute;
  display: inline-flex;
  align-items: center;
  left: calc(80px - var(--sizeFactor) * 10px) ;
  height:70px;
}


.bubble-btn .circle {

  transition: all ease-in-out 100ms;
  height: 40px;
  width: 40px;
  background-color: var(--circle-col);
  border-radius: 50%;
  margin-block: 5px;
}

.rotate .bubble-btn .circle {
  --sizeFactor:  max(var(--i) - 5 , (-1) * (var(--i) - 5));
  height: calc(60px - var(--sizeFactor) * 10px);
  width: calc(60px - var(--sizeFactor) * 10px);

}
.rotate.navigation-btns {
  transform: translateX(-200px);
}
</style>

