<template>
  <div class="artcle-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
      <article-item
       v-for="(article, index) in list"
       :key="index"
       :article="article"
       />
        <!-- <van-cell
          v-for="(artcle, index) in list"
          :key="index"
          :title="artcle.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";
import ArticleItem from "@/components/articles-item";
export default {
  name: "ArtcleList",
  components: {
    ArticleItem,
  },
  data() {
    return {
      list: [], //存储列表数据的数组
      loading: false, //控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, //请求下一页数据的时间戳
      error: false, //控制列表加载失败的提示状态
      isreFreshLoading: false, //控制下拉刷新的loading状态
      refreshSuccessText: "刷新成功", // 下拉刷新成功提示文本
    };
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1,
        });
        const { results } = data.data;
        this.list.push(...results);
        this.loading = false;
        if (results.length) {
          this.timestamp = data.data.pre_timestamp;
        } else {
          this.finished = true;
        }
      } catch (err) {
        this.error = true;
        this.loading = false;
      }
    },
    async onRefresh() {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1,
        });
        const { results } = data.data;
        this.list.unshift(...results);
        this.isreFreshLoading = false;
        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`;
      } catch (err) {
        this.isreFreshLoading = false;
        this.refreshSuccessText = `刷新失败`;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.artcle-list {
  height: 79vh;
  overflow-y: auto;
}
</style>