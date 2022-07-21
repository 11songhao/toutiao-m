<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(text, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search',text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search";
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  data() {
    return {
      suggestions: [],
      htmlStr: `Hello<span style="color:red">World<span>`,
    };
  },
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  watch: {
    searchText: {
      // 监视的处理函数
      handler: debounce(function (val) {
        this.loadSearchSuggestion(val);
      }, 1000),
      // 首次监视触发
      immediate: true,
    },
  },
  methods: {
    async loadSearchSuggestion(q) {
      try {
        const { data } = await getSearchSuggestions(q);
        this.suggestions = data.data.options;
        console.log(data);
      } catch {
        this.$toast("获取失败");
      }
    },
    highlight(text) {
      const highlightStr = `<span class="active">${this.searchText}<span>`;
      const reg = new RegExp(this.searchText, "gi");
      return text.replace(reg, highlightStr);
    },
  },
};
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa !important;
  }
}
</style>