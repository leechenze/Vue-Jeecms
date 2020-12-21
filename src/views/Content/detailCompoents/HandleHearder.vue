<template>
  <section class="handle-detail-hearder">
      <template v-for="(item, index) in handleHeaders">
        <div :key="index" class="header-button t-inline">
          <div v-if="item.key === 'link'">
            <template v-for="(info, infoIndex) in item.subset">
              <el-link
                :disabled="!info.click"
                :underline="false"
                @click="handleEvent(info,item)"
                class="t-inline header-btn jee-hover-color"
                :key="infoIndex"
                >
                <jee-icon v-if="info.icon" :iconClass="info.icon"/>{{info.text}}
              </el-link>
            </template>
          </div>
          <el-popover
            v-else-if="item.key === 'dropdown'"
            popper-class="ct-pover header-button"
            placement="bottom"
            trigger="click"
            v-model="item.active"
            :appendToBody='false'
          >
            <div class="ct-pover__box">
              <template v-for="(info,infoIndex) in item.subset"  >
                <el-link
                  class="ct-pover__item jee-hover-color"
                  :key="infoIndex"
                  :underline="false"
                  :disabled="!info.click"
                  @click="handleEvent(info,item)"
                >
                <jee-icon
                  :iconClass="info.icon"
                  class="jee-hover-fill"
                  :style="{fontSize:'12px'}"
                  v-if="info.icon"></jee-icon>
                  <el-image
                    class="t-inline"
                    v-else-if="info.contentTypeIcon"
                    style="width:14px; height: 14px"
                    :src="info.contentTypeIcon.url"
                    fit="contain"></el-image>
                  {{info.text}}
                </el-link>
              </template>
            </div>
            <span class="link-btn"  slot="reference" :class="item.active?'jee-color':''">
              <jee-icon v-if="item.icon" :iconClass="item.icon"/>{{item.text}}<i class=" i-icon" :class="item.active?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
            </span>
          </el-popover>
        </div>
    </template>
  </section>
</template>

<script>
export default {
  name: 'handleHearder',
  data () {
    return {
      dropdownVisable: false,
      dropdownWidth: 0
    }
  },
  props: {
    handleHeaders: {
      type: Array,
      default: () => []
    },
    showHandle: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => {}
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  wacth: {
    handleHeaders: {
      handler (val) {
        console.log(val)
      },
      deep: true
    }
  },
  methods: {
    handleEvent (data, item) {
      item.active = false
      this.$emit('handleHead', data)
    },
    isDisabled (data) {
      if (data) {
        if (data.disabled) {
          return true
        } else if (this.$route.query.type !== 'add' && this.detail) {
          if (this.detail.purview) {
            return !this.detail.purview[data.power] && data.power
          } else {
            return false
          }
        } else {
          return false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.handle-detail-hearder{
  .header-button{
    color: #666666;
    font-size:14px;
    margin: 0 28px;
    outline: none;
    cursor: pointer;
    &:first-of-type{
      margin-left:14px;
    }
    &:last-of-type{
      margin-right: 0;
    }
    .jee-svg-icon{
      fill: #777777;
      padding-right: 7px;
    }
    .link-btn{
      outline: none;
      .i-icon{
        margin-left:8px;
        font-size:16px;
      }
    }
    .header-btn{
      color: #666666;
      font-size:14px;
      margin: 0 28px;
      outline: none;
      cursor: pointer;
      &:last-of-type{
        margin-right:0;
      }
      &:first-of-type{
        margin-left:0;
      }
    }
  }
  .el-button .jee-svg-icon{
    padding-right: 10px;
  }
  .el-dropdown-menu.el-popper{
    border:none;
  }
  .hand-dropdown{
    border:none !important;
  }
}
</style>
