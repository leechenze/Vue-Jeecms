<template>
  <section class="icon-dialog-container">
    <el-dialog
      v-loading="loading"
      :title="title"
      :width="width"
      :visible.sync="dialogVisible"
    >
      <slot>
        <div class="icon-list-wrap">
          <template v-for="(item, index) in list">
            <jee-icon :key="index"
              :iconClass="item"
              className="jee-hover-fill"
              :style="iconStyle"
              @click="() => handleSelectIcon(item, index)"
            ></jee-icon>
          </template>
        </div>
      </slot>
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
      default: '600px'
    },
    title: {
      type: String,
      default: '新建'
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    iconStyle: {
      type: Object,
      default: () => ({
        fontSize: '40px',
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
      dialogVisible: false
    }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    handleCancel () {
      this.dialogVisible = false
    },
    handleSelectIcon (item, index) {
      this.$emit('handleSelectIcon', item, index)
      this.handleCancel()
    }
  }
}
</script>

<style lang="scss">
.icon-dialog-container{
  .icon-list-wrap{
    padding-bottom: 30px;
    display: flex;
    flex-wrap: wrap;
    .jee-svg-icon{
      padding: 20px;
      cursor: pointer;
    }
  }
}
</style>
