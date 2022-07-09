<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录" />
    <van-form @submit="onSubmit">
      <van-field v-model="user.mobile" name="手机号" placeholder="请输入手机号">
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field v-model="user.code" name="验证码" placeholder="请输入验证码">
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-button class="send-sms-btn" round size="small" type="default"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 53px 33px">
        <van-button
          block
          style="background-color: #6db4fb; border: none"
          type="info"
          native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
import { login } from "@/api/user";
export default {
  name: "LoginIndex",
  data() {
    return {
      user: {
        mobile: "", //手机号
        code: "", //验证码
      },
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
    async onSubmit() {
      //获取表单数据
      const user = this.user;
      //表单验证
      //提交表单请求登录
      try {
        const res = await login(user);
        console.log("登录成功", res);
      } catch (err) {
        if (err.response.status === 400) {
          console.log('手机号或验证码错误');
        }else{
          console.log("登录失败,请稍后重试", err);
        }
      }
      //根据请求项应结果处理后续操作
    },
  },
  created() {},
  updated() {},
  mounted() {},
  filters: {},
  computed: {},
  watch: {},
};
</script>
<style lang="less" scoped>
.login {
  .login-btn {
    width: 694px;
    height: 88px;
    background: #6db4fb;
    border: none;
    border-radius: 10px;
  }

  .toutiao {
    font-size: 37px;
  }

  .send-btn {
    width: 152px;
    height: 46px;
    background: #ededed;
    border: none;
    border-radius: 23px;
    padding: 0;
    font-size: 22px;
    color: #666666;
  }
}
</style>
