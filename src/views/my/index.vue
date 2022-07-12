<template>
  <div class="my-container">
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image
            round
            fit="cover"
            class="avater"
            :src="userInfo.photo"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/imgs/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 导航 -->
    <van-grid class="grid-nav mb-9" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /导航 -->
    <van-cell title="消息通知" is-link />
    <van-cell class="mb-9" title="小智同学" is-link />
    <van-cell
      @click="onLogout"
      v-if="user"
      class="logout-cell"
      title="退出登录"
      clickable
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getUserInfo } from "@/api/user";
export default {
  name: "WodeIndex",
  data() {
    return {
      userInfo: {}, //用户信息
    };
  },
  props: {
    obj: {
      type: Object,
      default: () => {},
    },
  },
  components: {},
  methods: {
    onLogout() {
      //退出提示
      //在组件中需要使用 this.$dialog 来调用弹窗组件
      this.$dialog
        .confirm({
          title: "确定退出吗？",
        })
        .then(() => {
          // on confirm
          //确认退出，清除登录状态 （容器中的 user + 本地存储中的 user）
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
        });
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo();
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取用户失败，请稍后重试')
      }
    },
  },
  created() {
    if (this.user) {
      //如果用户登录了，则请求加载用户信息数据
      this.loadUserInfo();
    }
  },
  updated() {},
  mounted() {},
  filters: {},
  computed: { ...mapState(["user"]) },
  watch: {},
};
</script>
<style lang="less" scoped>
.my-container {
  .header {
    height: 201px;
    background: url("~@/assets/imgs/banner.png");
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 66px;
      height: 66px;
    }
    .login-sign {
      color: #ffffff;
      font-size: 14px;
      margin-top: 8px;
    }
  }
  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .base-info {
      width: 100%;
      height: 130px;
      // background-color: pink;
      z-index: 99;
      padding: 38px 16px 11.5px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .avater {
        width: 66px;
        height: 66px;
        border: 2px solid #fff;
      }
      .name {
        font-size: 20px;
        margin-left: 10px;
        color: #ffffff;
      }
    }
    .data-stats {
      width: 100%;
      height: 70px;
      display: flex;
      .data-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 14px;
      }
    }
    .left {
      display: flex;
      align-items: center;
    }
  }
  .grid-nav {
    .grid-item {
      height: 70px;
      i.toutiao {
        font-size: 20px;
      }
      span.text {
        font-size: 14px;
      }
      .toutiao-shoucang {
        color: #ffb6c5;
      }
      .toutiao-lishi {
        color: #ffb961;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
    margin: 10px 0;
    font-size: 15px;
  }
}
</style>
