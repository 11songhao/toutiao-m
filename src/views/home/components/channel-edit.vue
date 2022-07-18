<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        round
        plain
        size="mini"
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        v-for="(channel, index) in myChannels"
        :key="index"
        class="grid-item"
        @click="onMyChannelclick(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span class="text" slot="text" :class="{ active: index === active }">
          {{ channel.name }}
        </span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">推荐列表</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        class="grid-item"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels,
} from "@/api/channel";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";
export default {
  name: "ChannelEdit",
  data() {
    return {
      allChannels: [],
      isEdit: false,
      fiexdChannels: [0],
    };
  },
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState(["user"]),
    recommendChannels() {
      return this.allChannels.filter((channel) => {
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id;
        });
      });
    },
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();
        this.allChannels = data.data.channels;
      } catch (err) {
        this.$toast("数据获取失败");
      }
    },
    async onAddChannel(channel) {
      this.myChannels.push(channel);
      //数据持久化处理
      if (this.user) {
        try {
          //已登陆，把数据请求接口放到线上
          await addUserChannels({
            id: channel.id, //频道ID
            seq: this.myChannels.length, // 序号
          });
        } catch (err) {
          this.$toast("保存失败,请稍后重试");
        }
      } else {
        //未登录，把数据存储到本地
        setItem("TOUTIAO_CHANNELS", this.myChannels);
      }
    },
    onMyChannelclick(channel, index) {
      if (this.isEdit) {
        //1.如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) {
          return;
        }
        //2.删除频道项
        this.myChannels.splice(index, 1);
        //3.如果删除的激活频道之前的频道，则更新激活的频道项
        //参数1：要删除的元素的开始索引（包括）
        //参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后

        if (index <= this.active) {
          //让激活频道的索引-1
          this.$emit("update-active", this.active - 1, true);
        }

        //4.处理持久化
        this.deleteChannel(channel);
      } else {
        //非编辑状态，则执行切换频道
        this.$emit("update-active", index, false);
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          //已登录，则将数据更新到线上
          deleteUserChannels(channel.id);
        } else {
          //未登录，将数据更新到本地
          setItem("TOUTIAO_CHANNELS", this.myChannels);
        }
      } catch (err) {
        this.$toast("请稍后重试");
      }
    },
  },
};
</script>

<style scoped lang="less">
.channel-edit {
  padding: 42.5px 0;

  .title-text {
    font-size: 16px;
    color: #333333;
  }

  .edit-btn {
    width: 52px;
    height: 24px;
    font-size: 13px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/.grid-item {
    width: 80px;
    height: 43px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: orange;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/.my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -5px;
        top: -5px;
        font-size: 15px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 14px;
          margin-right: 3px;
        }
      }
    }
  }
}
</style>