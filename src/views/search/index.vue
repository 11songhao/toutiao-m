<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
     -->
    <form class="search-from" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :searchText="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion :searchText="searchText" v-else-if="searchText" @search="onSearch"></search-suggestion>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history v-else :history="history"/>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import SearchHistory from "./components/search-history";
import SearchSuggestion from "./components/search-suggestion";
import SearchResult from "./components/search-result";

export default {
  name: "SearchIndex",
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult,
  },
  props: {},
  data() {
    return {
      searchText: "",
      isResultShow:false,
      history:[]
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearch(val) {
      this.searchText=val
      this.isResultShow = true;
    },
    onCancel() {
      this.$router.back();
    },
  },
};
</script>

<style scoped lang="less">
.search-container {
  padding-top: 54px;
  .van-search__action {
    color: #fff;
  }
  .search-from{
    position:fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>