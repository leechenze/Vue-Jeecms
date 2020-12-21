<template>
  <section class="icon-dialog-container">
    <el-dialog
      v-loading="loading"
      :title="title"
      :width="width"
      :visible.sync="dialogVisible"
    >
      <slot>
        <el-radio-group class="icon-list-wrap" v-model="icon">
          <div v-for="(item, index) in list" :key="index" class="icon-wrap">
            <jee-icon
              :iconClass="item"
              className="jee-hover-fill"
              :class="{'is-checked': item === icon}"
              :style="iconStyle"
              @click="handleClickIcon(item)"
            ></jee-icon>
            <el-radio :label="item">
              <span>{{item}}</span>
            </el-radio>
          </div>
        </el-radio-group>
      </slot>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel" size="small" plain>{{$t('global.cancel')}}</el-button>
        <el-button type="primary" size="small"
          @click="handleConfirm">{{$t('global.confirm')}}
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'iconDialog',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '620px'
    },
    title: {
      type: String,
      default: 'Icon图标选择'
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    iconStyle: {
      type: Object,
      default: () => ({
        fontSize: '26px',
        fill: '#909399'
      })
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: false,
      icon: ''
    }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    handleCancel () {
      this.dialogVisible = false
    },
    handleClickIcon (item) {
      this.icon = item
    },
    handleConfirm () {
      this.$emit('handleSelectIcon', this.icon)
      this.handleCancel()
    }
  }
}
</script>

<style lang="scss">
.icon-dialog-container{
  .icon-list-wrap{
    display: flex;
    flex-wrap: wrap;
    .icon-wrap{
      width: 100px;
      padding-right: 40px;
      padding-bottom: 20px;
      .jee-svg-icon{
        padding: 12px;
        margin-left: 23px;
        display: block;
        cursor: pointer;
        &.is-checked{
          background-color: #fafafa;
          border-radius: 4px;
          border-width: 1px;
          border-style: solid;
        }
      }
      .el-radio{
        margin-top: 10px;
      }
    }
  }
}
</style>
