<template>
  <section class="d-content-template-preview d-button-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      class="sm-height-button"
    >
      <el-button type="primary" size="small" @click="handleClick">{{option.btnText}}</el-button>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
    <table-dialog
      ref="content"
      v-bind="tablelist"
      @handleConfirm="handleConfirm"
      @handleSelectionChange="handleMultipleSelect"
    >
      <template #tplPc="scope">
        <el-select v-model="scope.scope.row.tplPc" size="small" placeholder="请选择"
          :clearable="true"
          popper-class="jee-border"
          :popperAppendToBody='false'
          :disabled="forbidden(scope.scope.row.modelId)"
        >
          <el-option
            v-for="item in scope.scope.row.pcTplPaths"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </template>
      <template #tplMobile="scope">
        <el-select v-model="scope.scope.row.tplMobile"
          popper-class="jee-border"
          :clearable="true"
          :disabled="forbidden(scope.scope.row.modelId)"
          size="small" placeholder="请选择">
          <el-option
            v-for="item in scope.scope.row.mobileTplPaths"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </template>
    </table-dialog>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
import tableDialog from '@/components/mixins/tableDialog'

export default {
  name: 'DContentTemplatePreview',
  mixins: [previewMixin, tableDialog],
  data () {
    return {
      ids: [],
      selectList: [],
      tablelist: {
        width: '714px',
        showSelection: true,
        showPagination: false,
        showSearchHeader: false,
        rowKey: 'modelId',
        data: [],
        columns: [
          {
            label: '内容模型',
            prop: 'modelName',
            width: '150px'
          },
          {
            scopeType: 'slot',
            label: '内容PC端模板',
            prop: 'tplPc'
          },
          {
            scopeType: 'slot',
            label: '内容手机端模板',
            prop: 'tplMobile'
          }
        ]
      }
    }
  },
  methods: {
    // 选择框禁用
    forbidden (id) {
      return !this.ids.includes(id)
    },
    // 多选
    handleMultipleSelect (data) {
      this.ids = data.map(v => { return v.modelId })
      this.selectList = data
    },
    handleClick () {
      this.fetchChannelContentModel()
      this.$refs.content.showDialog()
      console.log(this.tablelist, this.value)
    },
    // 回填反选
    invertselect () {
      this.$nextTick(() => {
        this.tablelist.data.forEach(v => {
          this.value.forEach(w => {
            if (v.modelId === w.modelId && w.select) {
              this.$refs.content.$refs.theTable.toggleRowSelection(v, true)
            }
          })
        })
      })
    },

    // 设置内容模型表格
    fetchChannelContentModel () {
      this.tablelist.loading = true
      const params = {
        channelId: this.form.id
      }
      this.$request.fetchChannelContentModel(params).then(res => {
        if (res.code === 200) {
          this.tablelist.data = res.data.map(d => {
            if (this.value instanceof Array && this.value.length) {
              const model = this.value.find(v => v.modelId === d.modelId)
              if (model) {
                d.tplMobile = model.tplMobile || d.tplMobile
                d.tplPc = model.tplPc || d.tplPc
              }
            }
            return d
          })
        }
        this.invertselect()
        this.tablelist.loading = false
      }).catch(() => {
        this.tablelist.loading = false
      })
    },
    // 添加选中状态
    addSelectStatus () {
      for (let i = 0; i < this.tablelist.data.length; i++) {
        for (let j = 0; j < this.selectList.length; j++) {
          this.tablelist.data[i].select = false
          if (this.tablelist.data[i] === this.selectList[j]) {
            this.tablelist.data[i].select = true
            break
          }
        }
      }
    },
    handleConfirm () {
      this.addSelectStatus()
      const data = this.tablelist.data.map(d => {
        return {
          tplMobile: d.tplMobile,
          tplPc: d.tplPc,
          modelId: d.modelId,
          select: d.select
        }
      })
      this.$emit('input', data)
      console.log(data)
      this.$refs.content.handleCancel()
    }
  }
}
</script>

<style lang="scss">
.d-content-template-preview {
  .el-dialog{
    .el-table{
      .el-table__body{
        td{
          border-bottom: 0;
        }
      }
    }
  }
}
</style>
