<template>
  <div id="app">
    <router-view />
  </div>
  
</template>
<script>
export default {
  name: "App",
  // data() {},
  props: {
    obj: {
      type: Object,
      default: () => {},
    },
  },
  components: {},
  methods: {},
  created() {},
  updated() {},
  mounted() {},
  filters: {},
  computed: {},
  watch: {},
};
</script>
<style lang="less" scoped>

</style>
