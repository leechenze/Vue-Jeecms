<template>
  <section class='actions-dialog-container'>
    <div class="title-wrap">
      <span class="title-text">{{title}}</span>
      <el-link type="primary" :underline="false" @click="showDialog">编辑</el-link>
    </div>
    <div class="action-list-wrap">
      <span v-for="(item, index) in value" :key="index">{{item.name}}</span>
    </div>
    <el-dialog
      v-loading="loading"
      :title="$t(title)"
      :width="width"
      :visible.sync="dialogVisible"
      class="tag-wrap"
    >
      <el-button type="primary" size="small"  class="add-btn" @click="handleHeaderCreate">
        <jee-icon iconClass="tianjia"/>添加
      </el-button>
      <base-table
        v-bind="list"
        :showSelection="false"
        :showPagination="false"
        @handleEdit="handleTableEdit"
        @handleDelete="handleTableDelete"
      ></base-table>
      <form-dialog
        ref="addDialog"
        width="492px"
        labelWidth="110px"
        :title="addFormTitle"
        :loading="addFormLoading"
        :form="addForm"
        :rules="addRules"
        :buttons="addFormButtons"
        :formItems="addFormItems"
        @handleConfirm="handleConfirmAdd"
        :appendToBody="true"
        customClass='add-action-dialog'
      ></form-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel" size="small" plain>{{$t('global.cancel')}}</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'

const columns = [
  {
    prop: 'name',
    label: '动作名称'
  },
  {
    prop: 'code',
    label: '编号'
  }
]
export default {
  name: 'OrgDialog',
  mixins: [baseTable, formDialog],
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    const name = (rule, value, callback) => {
      const isRepeat = this.list.data.filter((d, i) => i !== this.addForm.index).map(d => d[rule.field]).includes(value)
      if (value === '' || !isRepeat) {
        callback()
      } else {
        const error = rule.field === 'name' ? '动作名称' : '编号'
        callback(new Error(`${error}不能重复`))
      }
    }
    return {
      loading: false,
      dialogVisible: false,
      title: '动作类型',
      width: '492px',
      list: {
        columns,
        data: this.value,
        api: '',
        params: {},
        handleColumn: [
          {
            type: 'Edit',
            name: '编辑',
            icon: 'bianji'
          },
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete'
          }
        ],
        handleColumnProp: {
          width: '150px'
        }
      },
      addFormLoading: false,
      addFormTitle: '添加动作类型',
      addForm: {
        name: '',
        code: ''
      },
      addFormItems: [
        {
          prop: 'name',
          label: '动作名称',
          maxlength: 10
        },
        {
          prop: 'code',
          label: '编号',
          disabled: false,
          maxlength: 15
        }
      ],
      addFormButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      addRules: {
        name: [
          this.$rules.required(),
          {
            validator: name,
            trigger: ['blur', 'change']
          }
        ],
        code: [
          this.$rules.required(),
          {
            validator: name,
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    handleCancel () {
      this.dialogVisible = false
    },
    handleHeaderCreate () {
      this.addFormTitle = '添加动作类型'
      this.addForm = {
        name: '',
        code: ''
      }
      this.addFormItems[1].disabled = false
      this.$refs.addDialog.showDialog()
    },
    handleTableEdit (row, index) {
      this.addForm = { ...row, index }
      this.addFormTitle = '编辑动作类型'
      if (['agree', 'disagree'].includes(row.code)) {
        this.addFormItems[1].disabled = true
      } else {
        this.addFormItems[1].disabled = false
      }
      this.$refs.addDialog.showDialog()
    },
    handleTableDelete (row, index) {
      this._confirmDelete().then(() => {
        this.list.data.splice(index, 1)
        this.$emit('input', this.list.data)
      })
    },
    handleConfirmAdd (data, btn) {
      this.addFormLoading = true
      if ('index' in data) {
        // this.list.data[data.index] = data
        this.list.data.splice(data.index, 1, data)
      } else {
        this.list.data.push(data)
      }
      this.$emit('input', this.list.data)
      this.addFormLoading = false
    },
    handleConfirm () {
      this.handleCancel()
    }
  }
}
</script>

<style lang="scss">
.actions-dialog-container{
  .title-wrap{
    line-height: 14px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    .title-text{
      color: #666666;
    }
  }
  .action-list-wrap{
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    span{
      padding-right: 40px;
      padding-bottom: 20px;
      color: #333333;
      line-height: 14px;
    }
  }
  .add-btn{
    margin-bottom: 20px;
    .jee-svg-icon{
      font-size: 12px;
      padding-right: 10px;
    }
  }
}
.el-dialog__wrapper .el-dialog.add-action-dialog .el-dialog__body{
  padding-bottom: 10px;
}
</style>
