<template>

  <div class="control" :class="value ? 'expanded' : ''">

    <div class="box relative pa-5">
      <span class="text-h6 text--secondary">{{ label }}</span>
      <slot></slot>
    </div>
    <div :title="label" class="clickable expand-icon d-flex justify-center align-center" @click="expand">
      <v-icon :color="value ? 'primary' : 'grey'" size="20">
        <slot name="icon">mdi-plus</slot>
      </v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapControlExpand',
  props: ['id', 'label','value'],
  methods: {
    expand() {
      if(!this.value)
      this.$emit('activated', this.id);
      this.$emit('input', !this.value);
    }
  }
};
</script>

<style scoped>
.box {
  min-width: 350px;
  position: absolute;
  top: 0;
  right: 30px;
  background: white;
  transform: scale(0);
  transition: transform 100ms ease-in-out;
  transform-origin: right top;
  border-radius: 4px;
  outline: 2px solid rgba(0, 0, 0, 0.2);
}

.clickable {
  cursor: pointer;
}


.expand-icon {
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 4px;
  border: solid 2px  rgba(0, 0, 0, 0.2);

}
.control.expanded .expand-icon {
  border:none;
  box-shadow:
    2px 0 0 0 rgba(0, 0, 0, 0.2),
    0 2px 0 0 rgba(0, 0, 0, 0.2),
    0 -2px 0 0 rgba(0, 0, 0, 0.2);
  border-radius: 0 4px 4px 0;

}

.control.expanded .box {
  transform: scale(1);
  border-radius: 4px 0 4px 4px;
  z-index:40;
}

.control.expanded .box::after {
  content:'';
  width:2px;
  height:29px;
  background:white;
  position:absolute;
  top:0;
  right:-2px;

}


.expand-icon:hover {
  filter: brightness(0.8);
}

.control {
  width: 100%;
  position: relative;
  height: 100%
}

</style>
