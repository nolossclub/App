<template>
  <div class="md:container md:mx-auto">
    <Landing />
    <HowItWorks />
    <CallToAction />
    <Footer />
  </div>
</template>

<script>
import Landing from "./components/Landing.vue";
import HowItWorks from "./components/HowItWorks.vue";
import CallToAction from "./components/CallToAction.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Landing,
    HowItWorks,
    CallToAction,
    Footer,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Raleway:wght@400;500;600;700;800&display=swap');
#app {
  font-family: Poppins, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  background-image: linear-gradient(150deg, #d4fc79 0%, #ffffff 30%);
}

.title {
  font-family: Raleway, Helvetica, Arial, sans-serif;
  font-weight: 800;
}

</style>
