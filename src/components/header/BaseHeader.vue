<template>
  <section class='base-header-container'>
    <header :style="{paddingBottom:paddingBottom||'20px'}">
      <span  class="jee-font-second-light"
      :style="{marginRight:marginRight||'10px'}"
        v-if="title">{{$t(title)}}</span>
      <div class="button-list-wrap">
        <template v-for="(item, index) in buttons">
            <el-button
              :class="className||'list-wrap-btn'"
              :key="index"
              v-if="!item.btnType&&index<maxShowIndex&&!item.isHidden"
              :plain="item.plain"
              :size="item.size||'medium'"
              :type="item.plain?'': (isPrimaryIndex === index&&!item.prim?'primary':'empty')"
              :disabled="item.disabled"
              @click="handleEvent(item.type, $event,item)">
              <jee-icon
                :iconClass="item.icon"
                :style="item.iconStyle"
                v-if="item.icon"></jee-icon>{{$t(item.text)}}
            </el-button>
            <!-- :class="item.plain?'jee-button-plain':(index===0?'':'jee-button-empty')" -->
            <jee-dropdown
              :key="index"
              v-else-if="item.btnType==='dropdown'"
              v-bind="item"
              @handleCommand="handleCommand(item.type, $event, item)"
            ></jee-dropdown>
        </template>
        <slot></slot>
      </div>
      <jee-icon :icon-class="icon"
        :className="title?'tip':'tipCenter'"
        v-if="showAlertIcon&&showType === 'click'"
        @click="showAlert = !showAlert"
      />
       <jee-popover style="margin-left:8px;margin-bottom:8px" v-if="showAlertIcon&&showType === 'hover'" v-bind="popoverData"/>
    </header>
    <el-collapse-transition>
      <div v-show="showAlertIcon && showAlert && showType === 'click'">
        <el-alert
          :title="$t(content)"
          type="warning"
          show-icon
          @close="showAlert = false"
        ></el-alert>
      </div>
    </el-collapse-transition>
    <div>
  </div>
  </section>
</template>

<script>
export default {
  name: 'baseHeader',
  props: {
    buttons: {
      type: Array,
      default: () => []
    },
    maxShowIndex: {
      type: Number,
      default: 20
    },
    title: {
      type: String,
      default: ''
    },
    paddingBottom: {
      type: String,
      default: '20px'
    },
    marginRight: {
      type: String,
      default: '10px'
    },
    className: {
      type: String,
      default: ''
    },
    showAlertIcon: {
      type: Boolean,
      default: true
    },
    content: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'caozuoshuoming1'
    },
    showType: {
      type: String,
      default: 'click'
    },
    popoverData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      show3: true,
      showAlert: true
    }
  },
  computed: {
    isPrimaryIndex: function () {
      let index = 0
      for (let i = 0; i < this.buttons.length; i++) {
        if (!this.buttons[i].isHidden) {
          index = i
          break
        }
      }
      return index
    }
  },
  methods: {
    handleCommand (type, val, item) {
      this.$emit(`handleCommand${type}`, val, item)
    },
    handleEvent (type, e, item) {
      e.preventDefault()
      this.$emit(`handle${type}`, item)
    }
  }
}
</script>

<style lang="scss" scoped>
.base-header-container{
  header{
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    .button-list-wrap{
      display: flex;
      flex-wrap: wrap;
      .jee-dropdown-container,
      .el-button{
        margin-bottom: 10px;
        margin-right: 10px;
        margin-left: 0px;
      }
    }
    .tip{
      cursor: pointer;
    }
    .tipCenter{
      cursor: pointer;
      margin-bottom: 10px;
    }
  }
  .el-alert{
    display: flex!important;
    align-items: flex-start !important;
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss">
.custom-grayBlue{
  .el-alert__icon{
    margin-top: 3px;
  }

}

</style>
