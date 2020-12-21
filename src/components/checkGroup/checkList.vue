<template>
  <div class="check-list-index">
    <el-checkbox-group
      v-model="ids"
      @change="changeCheck"
      class="check-list-wrap">
        <template v-for="(item, index) in groups">
            <div class="check-list-box" :key="index">
              <el-checkbox
                :title="item.label||item[props.label]"
                class="check-list-radio"
                :label="item[rowKey]">
                <el-image
                  :class="{'jee-border':(ids.indexOf(item[rowKey])>-1)}"
                  class="check-list-img"
                  :src="item.url||item[props.url]"
                  fit="contain">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
                <span class="check-list-label">
                  {{item.label||item[props.label]}}
                </span>
              </el-checkbox>
            </div>
          </template>
    </el-checkbox-group>
    <el-checkbox
      class="check-list-all"
      label="全选"
      v-model="checkAll"
      @change="handleCheckedChange">
    </el-checkbox>
  </div>
</template>

<script>
export default {
  name: 'check-list',
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    groups: {
      type: Array,
      default: () => {
        return []
      }
    },
    props: {
      type: Object,
      default: () => {
        return {}
      }
    },
    rowKey: {
      type: String,
      default: 'id'
    }
  },
  data () {
    return {
      ids: [],
      checkAll: false,
      isIndeterminate: false
    }
  },
  methods: {
    changeCheck (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.groups.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.groups.length
      this.$emit('input', value)
    },
    handleCheckedChange (val) {
      var value = val ? this.groups.map(v => { return v[this.rowKey] }) : []
      this.ids = value
      this.isIndeterminate = false
      this.$emit('input', this.ids)
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (newVal) {
        this.ids = newVal
      }
    }
  }
}
</script>

<style lang="scss">
  .check-list-index{
    .check-list-wrap{
      border: 1px solid #e8e8e8;
      min-height: 364px;
      min-width: 568px;
      box-sizing: border-box;
      display: block !important;
      border-radius: 4px;
      .check-list-box{
        width: 100%;
        display: block !important;
        border-bottom: 1px solid #e8e8e8;
        background-color: #fff;
        box-sizing: border-box;
        line-height: 90px;
        padding: 20px;
        overflow: hidden;
        &:nth-of-type(1){
          border-radius: 4px 4px 0 0;
        }
        .el-checkbox{
          padding-bottom: 0;
          &__input{
            line-height: 80px;
          }
          .el-checkbox__label{
            display: flex;
          }
        }
        .check-list-img{
          width: 80px;
          height: 80px;
          margin-left: 20px;
          box-sizing: border-box;
          border: 1px solid #fff;
          background-color: #f8f8f8;
        }
        .check-list-label{
          line-height: 80px;
          vertical-align: top;
          margin-left: 8px;
        }
      }
    }
    .check-list-all{
      margin-top: 20px;
    }
  }
</style>
