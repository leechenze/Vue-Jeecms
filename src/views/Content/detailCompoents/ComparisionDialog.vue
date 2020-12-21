<template>
  <section class="version-comparison-container">
    <el-dialog
      v-loading="loading"
      title="版本对比"
      :visible.sync="dialogVisible"
      width="1320px"
      :modal-append-to-body="false"
    >
      <el-tabs v-model="activeTab" @tab-click="handleClickTab">
        <template v-for="(item, index) in tabs">
          <el-tab-pane :key="index" :label="item.label" :name="item.name">
            <div class="comparision-wrap">
              <header>
                <div class="left">
                  <transition name='fade' mode='out-in'>
                    <el-link :underline="false" type="primary" @click="handleShow(item)">{{item.active === 'all' ? '只显示差异行' : '显示所有' }}</el-link>
                  </transition>
                </div>
                <div class="right">
                  <span>左({{data[item.name].list1Version || '当前版本'}})</span>
                  <span class="compare">对比</span>
                  <span>右({{data[item.name].list2Version}})</span>
                </div>
              </header>
              <el-row>
                <el-col :span="12" v-for="(content, index) in ['list1', 'list2']" :key="index">
                  <template v-for="(row, index) in data[item.name][content]">
                    <div :key="index" class="row-wrap" :class="{modified: row.modified !== 1}">
                      <div class="row-no">{{row.rowNo}}</div>
                      <div class="row-line" v-html="row.line" v-if="item.active === 'all' || row.modified !== 1">{{row.line}}</div>
                      <div class="row-line" v-else></div>
                    </div>
                  </template>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </template>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel">取消</el-button>
        <el-button size="small" type="primary" @click="handleSaveCurrent" v-if="compareType === 1">保存当前版本</el-button>
        <el-button size="small" type="primary" @click="handleSaveLeft" v-if="compareType === 2">恢复左侧版本</el-button>
        <el-button size="small" type="primary" @click="handleSaveRight">恢复右侧版本</el-button>
        <el-button size="small" type="primary" @click="handleDeleteLeft" v-if="compareType === 2">删除左侧版本</el-button>
        <el-button size="small" type="primary" @click="handleDeleteRight">删除右侧版本</el-button>
      </span>
    </el-dialog>
    <form-dialog
      ref="editDialog"
      v-bind="edit"
      @handleConfirm="handleConfirmEdit"
    >
    </form-dialog>
  </section>
</template>
<script>
import formDialog from '@/components/mixins/formDialog'
export default {
  name: 'ComparisionDialog',
  mixins: [formDialog],
  data () {
    return {
      loading: false,
      dialogVisible: false,
      activeTab: '',
      data: {},
      edit: {
        title: '备注',
        loading: false,
        rules: {},
        form: {
          remark: ''
        },
        formItems: [
          {
            prop: 'remark',
            type: 'textarea',
            label: '备注',
            maxlength: 75,
            showWordLimit: true,
            autosize: { minRows: 3 }
          }
        ],
        buttons: [
          {
            text: '确定',
            type: 'Submit'
          }
        ]
      },
      versionIds: [],
      compareType: 1 // 1对比当前 2对比两个版本
    }
  },
  inject: ['fetchContentDetail'],
  computed: {
    tabs () {
      let obj = this.data
      let arr = []
      for (let item in obj) {
        arr.push({
          label: item,
          name: item,
          sortNum: obj[item].sortNum,
          active: obj[item].active || 'all'
        })
      }
      return arr.sort(function (a, b) { return a.sortNum - b.sortNum })
    }
  },
  watch: {
    tabs (newVal) {
      this.activeTab = newVal[0].name
    }
  },
  methods: {
    handleClickTab (tab) {
      this.activeTab = tab.name
    },
    showDialog (selectKeys) {
      if (selectKeys.length < 2) {
        this.versionIds = [ 0, ...selectKeys ]
        this.compareType = 1
      } else {
        this.versionIds = [ ...selectKeys ]
        this.compareType = 2
      }
      this.fetchContentVersionCompare()
      this.dialogVisible = true
    },
    handleCancel () {
      this.dialogVisible = false
    },
    handleShow (item) {
      this.$set(this.data[item.name], 'active', item.active === 'all' ? 'diff' : 'all')
    },
    handleSaveCurrent () {
      this.$refs.editDialog.showDialog()
    },
    handleConfirmEdit (data, btn) {
      let params = {
        ...data,
        contentId: this.$route.query.id
      }
      this.edit.loading = true
      this.$request.fetchContentVersionAdd(params).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.$emit('onDelete')
        }
        this.edit.loading = false
        this.$refs.editDialog.handleCancel()
      }).catch(() => {
        this.edit.loading = false
      })
    },
    handleSaveLeft () {
      if (this.versionIds.length < 1) {
        this.$message('左侧版本号错误')
      } else {
        this.loading = true
        this.$request.fetchContentVersionRecovery({ id: this.versionIds[0] }).then(res => {
          if (res.code === 200) {
            this._messageSuccess('recover')
            this.fetchContentDetail()
            this.handleCancel()
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    handleSaveRight () {
      if (this.versionIds.length < 2) {
        this.$message('右侧版本号错误')
      } else {
        this.loading = true
        this.$request.fetchContentVersionRecovery({ id: this.versionIds[1] }).then(res => {
          if (res.code === 200) {
            this._messageSuccess('recover')
            this.fetchContentDetail()
            this.handleCancel()
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    handleDeleteLeft () {
      if (this.versionIds.length < 1) {
        this.$message('左侧版本号错误')
      } else {
        this.loading = true
        this.$request.fetchContentVersionDelete({ ids: [this.versionIds[0]] }).then(res => {
          if (res.code === 200) {
            this._messageSuccess('delete')
            this.$emit('onDelete')
            this.handleCancel()
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    handleDeleteRight () {
      if (this.versionIds.length < 2) {
        this.$message('右侧版本号错误')
      } else {
        this.loading = true
        this.$request.fetchContentVersionDelete({ ids: [this.versionIds[1]] }).then(res => {
          if (res.code === 200) {
            this._messageSuccess('delete')
            this.$emit('onDelete')
            this.handleCancel()
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    fetchContentVersionCompare () {
      this.loading = true
      let params = {
        contentId: this.$route.query.id,
        versionIds: this.versionIds
      }
      this.$request.fetchContentVersionCompare(params).then(res => {
        if (res.code === 200) {
          this.data = res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
.version-comparison-container{
  .el-dialog{
    .comparision-wrap{
      margin-top: 5px;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      // 头部按钮
      header{
        display: flex;
        justify-content: space-between;
        height: 41px;
        border-bottom: 1px solid #e8e8e8;
        padding: 0 30px;
        background-color: #f9f9f9;
        line-height: 40px;
        .right{
          text-align: right;
          color: #999999;
          .compare{
            padding: 0 10px;
            color: #333333;
          }
        }
      }
      .el-row{
        // 内容对比区
        .row-wrap{
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #666666;
          background-color: #f9f9f9;
          .row-no{
            height: 100%;
            width: 30px;
            text-align: center;
            color: #666666;
            font-size: 16px;
          }
          .row-line{
            flex: 1;
            line-height: 28px;
            background-color: #ffffff;
            padding: 10px 30px;
            color: #333333;
            border-left: 1px solid #e8e8e8;
            border-right: 1px solid #e8e8e8;
            min-height: 36px;
            box-sizing: border-box;
            img{
              width: 100%!important;
            }
          }
          &.modified{
            .row-line{
              color: red;
              img{
                border: 5px solid red;
                border-radius: 4px;
                margin: 0 auto;
              }
            }
          }
        }
        .el-col:last-of-type .row-line{
          border-right: 0;
        }
      }
    }
  }
}
</style>
