<template>
  <div class="weibo-tree-index">
    <ul class="wtree-wrap">
      <li  class="wtree-item jee-hover-color"
        v-for="(item,index) in tencentList"
        :class="{'is-active jee-color':item.appId === activeId}"
        :key="index">
        <div
          @click="setActive(item.appId)"
          class="resource-wrap">
          <el-image
            class="resource-img"
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
    }
  },
  computed: {
    ...mapGetters(['tencentList'])
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions('social', ['GetTencentList']),
    setActive (id) {
      this.$emit('setActive', id)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.GetTencentList()
    })
  }

}
</script>

<style lang="scss">
  .weibo-tree-index{
    .wtree-wrap{
      .wtree-item{
        width: 100%;
        height: 80px;
        padding: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #e8e8e8;
        &.is-active{
          background-color: #FAFAFA;
        }
        .resource-wrap{
          cursor: pointer;
        }
        // table 名称修改
        .resource-img{
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
          width: 90px;
          box-sizing: border-box;
          display: inline-block;
          .text{
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
