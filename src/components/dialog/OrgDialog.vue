<template>
  <section class='org-dialog-container'>
    <el-dialog
      v-loading="loading"
      :title="$t(title)"
      :width="width"
      :visible.sync="dialogVisible"
      class="tag-wrap"
    >
      <div class="label-box">
        <el-tag
          class="tag-item"
          :key="tag.value"
          v-for="tag in orgTag"
          closable
          :disable-transitions="false"
          @close="handleTagClose(tag)">
          {{tag.label}}
        </el-tag>
      </div>
      <div class="tree-box scrollbar">
        <el-tree
          :data="organizeOptionsAll"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
          <span style="width:100%"
            @click="getCheckId(data)"
            slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
              <span class="right-radio">
                <el-checkbox v-if="orgTagIds.includes(data.value)"
                  :checked="true"></el-checkbox>
              </span>
            </span>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel" size="small" plain>{{$t('global.cancel')}}</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: 'OrgDialog',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    ids: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      title: '添加组织',
      width: '600px',
      orgTag: this.value
    }
  },
  computed: {
    ...mapGetters(['organizeOptionsAll']),
    orgTagIds () {
      return this.orgTag.map(d => d.value)
    }
  },
  watch: {
    ids (newVal) {
      if (newVal.length !== this.value.length) {
        this.orgTag = this.value.filter(t => newVal.includes(t.value))
      }
    }
  },
  methods: {
    ...mapActions('system', ['FetchOrganizeOptionsAll']),
    showDialog () {
      this.dialogVisible = true
    },
    handleCancel () {
      this.dialogVisible = false
    },
    getCheckId (data) {
      var i = this.orgTagIds.indexOf(data.value)
      if (i > -1) {
        this.orgTag.splice(i, 1)
      } else {
        this.orgTag.push({
          value: data.value,
          label: data.label
        })
      }
    },
    handleTagClose (tag) {
      const i = this.orgTagIds.indexOf(tag.value)
      this.orgTag.splice(i, 1)
    },
    handleConfirm () {
      this.$emit('input', this.orgTag)
      this.handleCancel()
    }
  },
  mounted () {
    this.FetchOrganizeOptionsAll()
  }
}
</script>

<style lang="scss">
.org-dialog-container{
  .el-dialog__wrapper.tag-wrap{
    padding: 0 30px;
    .tree-box-label{
      line-height: 1;
      margin-bottom: 20px;
      display: block;
    }
    .tree-box{
      width: 100%;
      max-width: 100%;
      height: 330px;
      overflow: overlay;
      padding-top: 10px;
      box-sizing: border-box;
      border: 1px solid #e8e8e8;
      .el-tree{
        background-color: #fff;
        .el-tree-node{
          display: block!important;
        }
        .el-tree-node__content{
          height: 32px;
          color: #333333;
        }
      }
      .right-radio{
        display: inline-block;
        position: absolute;
        right: 30px;
        .el-radio__label{
          display: none;
        }
        .el-checkbox__inner{
          border-radius: 100%;
        }
      }
    }
    .label-box{
      min-height: 40px;
      width: 100%;
      box-sizing: border-box;
      border: 1px dashed #E8E8E8;
      margin-bottom: 20px;
      padding: 9px 0 0 20px;
      display: flex;
      flex-wrap: wrap;
      .tag-item{
        height: 22px;
        line-height: 22px;
        margin-bottom: 9px;
        margin-right: 20px;
        font-size: 12px;
        border: 0;
        padding-left: 20px;
        display: block;
        .el-tag__close{
          color: #999;
          padding-left: 10px;
          &:hover{
            background-color: transparent;
          }
        }
      }
    }
  }
}
</style>
