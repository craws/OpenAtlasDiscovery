<template>

  <div class="control" >
    <div :title="label"  class="clickable box d-flex justify-center align-center"  @click="$emit('input', !value)" >
      <v-icon :color="value ? 'primary' : 'grey'" size="20"><slot>mdi-plus</slot></v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapControl',
  props:['value','label'],
  data(){
    return{
      active: false,
    }
  },
  methods:{
    expand(){
      this.$emit('opened',this.id)
      this.expanded = !this.expanded;
    }
  }
};
</script>

<style scoped>


.clickable{
  cursor: pointer;
}


.box{
  width: 30px;
  height: 30px;
  background:white;
  border: 2px solid rgba(0,0,0,0.2);
  border-radius: 4px;
}

.box:hover{
  filter:brightness(0.8);
}

.control{
  width:100%;
  position:relative;
  height:100%
}

</style>
