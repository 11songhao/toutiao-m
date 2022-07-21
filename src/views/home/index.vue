<template>
  <div class="home-container">
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>

    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <article-list :channel="channel" />
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <ChannelEdit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
      />
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>
<script>
import { getUserChannels } from "@/api/user";
import ArticleList from "./components/article-list";
import ChannelEdit from "./components/channel-edit";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";
export default {
  name: "HomeIndex",
  data() {
    return {
      active: 0,
      channels: [], //频道列表
      isChennelEditShow: true, //控制编辑频道弹出层的显示状态
    };
  },
  props: {
    obj: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ArticleList,
    ChannelEdit,
  },
  methods: {
    async loadChannels() {
      try {
        // const { data } = await getUserChannels();
        // this.channels = data.data.channels;
        // console.log( this.channels);
        let channels = [];
        if (this.user) {
          const { data } = await getUserChannels();
          channels = data.data.channels;
        } else {
          const loadChannels = getItem("TOUTIAO_CHANNELS");
          if (loadChannels) {
            // 有的话拿来使用
            channels = loadChannels;
          } else {
            //没有，请求获取默认频道列表
            const { data } = await getUserChannels();
            channels = data.data.channels;
          }
        }
        this.channels = channels;
      } catch (err) {
        this.$toast("获取频道数据失败");
      }
    },
    onUpdateActive(index, isChennelEditShow = true) {
      //更新激活的频道项
      this.active = index;
      //关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow;
    },
  },
  created() {
    this.loadChannels();
  },
  updated() {},
  mounted() {},
  filters: {},
  computed: { ...mapState(["user"]) },
  watch: {},
};
</script>

<style scoped lang="less">
.home-container {
  margin-bottom: 51px;
  padding-top: 89.6212px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }

  .search-btn {
    width: 280px;
    height: 32px;
    color: #fff;
    background-color: #5babfb;
    border: none;
    font-size: 14px;
    .van-icon {
      font-size: 16px;
    }
  }

  /deep/.channel-tabs {
    .van-tabs__content {
      min-height: 79vh;
    }
    .van-tabs__wrap {
      height: 41px;
      position: fixed;
      top: 46px;
      left: 0;
      right: 0;
      z-index: 1;
    }
    .van-tab {
      min-width: 100px;
      border-right: 1px solid #edeff3;
      font-size: 15px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 4px;
      width: 16.5px !important;
      height: 3px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0;
      width: 33px;
      height: 41px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 33px;
      height: 41px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-weight: 16.5px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 2px;
        height: 70%;
        background-image: url(~@/assets/imgs/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>