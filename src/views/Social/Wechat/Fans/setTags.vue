<template>
  <el-popover
    popper-class="tags-popover"
    placement="bottom"
    title="设置标签"
    @show="showPopover"
    ref="popover"
    width="456"
    trigger="click">
      <el-checkbox-group
        class="tags-checkbox-group t-check t-group-height"
         v-model="tagIds">
        <el-checkbox v-for="(option, index) in tags" :key="index"
         :label="option.id">{{option.tagName}}</el-checkbox>
      </el-checkbox-group>
      <div class="t-text-right">
        <el-button size="mini" @click="hidePopover">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirm"
          :disabled="!_checkPermission('/wechattags/set', 'POST')"
        >确 定</el-button>
      </div>
    <i slot="reference" class="set-tags t-label el-icon-caret-bottom"></i>
  </el-popover>
</template>

<script>
export default {
  name: 'set-tags',
  props: {
    tags: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Object,
      default: () => {
        return { tags: [] }
      }
    },
    appId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tagIds: []
    }
  },
  methods: {
    showPopover () {
      let ids = this.data.tagidList.split(',')
      let arr = []
      ids.forEach(v => {
        if (v) {
          arr.push(parseInt(v))
        }
      })
      this.tagIds = arr
    },
    hidePopover () {
      this.$refs.popover.doClose()
    },
    handleConfirm () {
      let data = {
        ids: [this.data.id],
        tagids: this.tagIds,
        appId: this.data.appId || this.appId
      }
      this.$request.fetchWechattagsSet(data).then(res => {
        this.$restBack(res, () => {
          this.hidePopover()
          this.$emit('setTags', data)
        }, '设置成功')
      })
    }
  }
}
</script>

<style lang="scss">
  .tags-popover{
    padding-top: 30px !important;
  }
  .tags-checkbox-group{
    padding: 0 20px;
    .el-checkbox{
      margin: 10px 0;
      min-width: 85px;
    }
  }
</style>
