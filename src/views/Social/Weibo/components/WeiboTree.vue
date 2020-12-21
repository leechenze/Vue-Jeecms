<template>
  <div class="weibo-tree-index">
    <ul class="wtree-wrap">
      <template v-if="type === 'wechat'">
        <li  class="wtree-items jee-hover-color"
          v-for="(item,index) in wechatInfoList"
          :class="{'is-active jee-color':item[rowKey] === activeId}"
          :key="index">
          <div
            @click="setActive(item[rowKey],item.wechatName)"
            class="resource-wrap-tree">
            <el-image
              class="resource-img-tree"
              :src="item.headImg"
              fit="contain">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
            <div class="resource-name">
              <span class="text"
              :title="item.wechatName">{{item.wechatName}}</span>
            </div>
          </div>
        </li>
        <li class="nothing t-label" v-show="wechatInfoList.length === 0">暂无数据</li>
      </template>
      <template v-else>
        <li  class="wtree-items jee-hover-color"
          v-for="(item,index) in weiboinfoList"
          :class="{'is-active jee-color':item[rowKey] === activeId}"
          :key="index">
          <div
            @click="setActive(item[rowKey],item.screenName)"
            class="resource-wrap-tree">
            <el-image
              class="resource-img-tree"
              :src="item.profileImageUrl"
              fit="contain">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
            <div class="resource-name">
              <span class="text"
              :title="item.screenName">{{item.screenName}}</span>
            </div>
          </div>
        </li>
        <li class="nothing t-label" v-show="weiboinfoList.length === 0">暂无数据</li>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'weibo-tree',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    activeId: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String, // weibo wechat
      default: 'weibo'
    }
  },
  computed: {
    ...mapGetters(['weiboinfoList', 'wechatInfoList'])
  },
  data () {
    return {
      dataList: []
    }
  },
  methods: {
    ...mapActions('content', ['FetchWeiboinfoList', 'FetchWechatInfoPage']),
    setActive (id, name) {
      this.$emit('setActive', id, name)
    }
  },
  watch: {
    type (newVal) {
      if (newVal) {
        if (this.type === 'wechat') {
          this.FetchWechatInfoPage()
        } else {
          this.FetchWeiboinfoList()
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.type === 'wechat') {
        this.FetchWechatInfoPage()
      } else {
        this.FetchWeiboinfoList()
      }
    })
  }

}
</script>

<style lang="scss">
  .weibo-tree-index{
    .wtree-wrap{
      .wtree-items{
        width: 100%;
        height: 80px;
        padding: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #e8e8e8;
        &.is-active{
          background-color: #FAFAFA;
        }
        .resource-wrap-tree{
          cursor: pointer;
        }
        // table 名称修改
        .resource-img-tree{
          display: inline-block;
          width: 40px !important;
          height: 40px !important;
          box-sizing: border-box;
          margin-right: 20px;
          border: 1px solid #e8e8e8;
          border-radius: 4px;
          background-color: #FAFAFA;
          vertical-align: middle;
          .el-image__inner{
            max-width: 100%;
            max-height: 100%;
          }
        }
        .resource-name{
          vertical-align: middle;
          width: 120px;
          box-sizing: border-box;
          display: inline-block;
          .text{
            font-size: 14px;
            width: 100%;
            overflow:hidden;
            text-overflow:ellipsis;
            word-wrap: break-word;
            // white-space: nowrap;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            overflow: hidden;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
</style>
