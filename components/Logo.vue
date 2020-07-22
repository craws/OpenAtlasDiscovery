<template>
  <img
    class="VuetifyLogo"
    alt="Vuetify Logo"
    src="/logo.png"
  >
</template>

<style>
  .VuetifyLogo {
    height: 180px;
    width: 180px;
    opacity: 0%;
    animation: fade 1.5s ease-out forwards 1s;
  }

  @keyframes fade {
    100% {
      opacity: 100%;
    }
  }
</style>
