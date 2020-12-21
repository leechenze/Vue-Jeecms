<template>
  <section class="d-workflow-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <el-select
        v-model="val"
        popper-class="jee-border"
        placeholder='请选择'
        :clearable="true"
        :popperAppendToBody='false'
      >
        <el-option
          v-for="opt in getOptions || []"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value">
        </el-option>
      </el-select>
      <el-button class="btn-extend" type="primary" size="small" @click="handleClick">应用到其他栏目</el-button>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
    <form-dialog
      ref="apply"
      title="应用到其他栏目"
      :form="applyForm"
      :formItems="applyFormItems"
      :rules="applyRules"
      :buttons="applyButtons"
      @getTheNod='getTheNod'
      @handleConfirm="handleConfirm"
      @change="handleCheckAllChange"
    ></form-dialog>
  </section>
</template>

<script>
import formDialog from '@/components/mixins/formDialog'
import previewMixin from '@/components/draggable/Mixin/previewMixin'
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'DWorkFlowSettingPreview',
  mixins: [previewMixin, formDialog],
  data () {
    return {
      applyForm: {
        applyAll: false,
        checkedKeys: []
      },
      applyFormItems: [
        {
          type: 'checkbox',
          prop: 'applyAll',
          label: '应用到',
          complex: true,
          class: 'z-checkbox-single',
          optionLabel: '所有栏目'
        },
        {
          type: 'checkTree',
          prop: 'checkedKeys',
          tree: [],
          labelWidth: '166px',
          props: {
            label: 'name',
            value: 'id'
          }
        }
      ],
      applyButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['columnOptions', 'workflowOptions']),
    getOptions () {
      return this.workflowOptions
    },
    applyRules () {
      if (this.applyForm.applyAll) {
        return {}
      }
      return {
        checkedKeys: [this.$rules.required()]
      }
    }
  },
  watch: {
    columnOptions (newData) {
      this.applyFormItems[1].tree = newData
    }
  },
  methods: {
    ...mapActions('column', ['FetchColumnOptions']),
    /* workflow-plugin start */
    ...mapActions('config', ['FetchWorkFlowOptions']),
    /* workflow-plugin end */
    handleClick () {
      this.$refs.apply.showDialog()
    },
    handleConfirm (data) {
      let params = {
        channelId: this.form.id,
        all: true,
        ids: []
      }
      if (!data.applyAll) {
        params.all = false
        params.ids = data.checkedKeys
      }
      this.$request.fetchChannelWorkflow(params).then(res => {
        if (res.code === 200) {
          this._messageSuccess('handle')
        }
      })
    },
    getTheNod (data) {
      this.$set(this.applyForm, 'checkedKeys', data)
    },
    handleCheckAllChange () {
      console.log('000')
      if (this.applyForm.applyAll === 1) {
        this.$refs.apply.$refs.startTreecheckedKeys[0].setCheckedNodes(this.applyFormItems.find(v => v.prop === 'checkedKeys').tree.filter(d => !d.disabled))
        this.applyForm.checkedKeys = this.$refs.apply.$refs.startTreecheckedKeys[0].getCheckedKeys()
      } else {
        this.applyForm.checkedKeys = []
        this.$refs.apply.$refs.startTreecheckedKeys[0].setCheckedNodes([])
      }
    }
  },
  mounted () {
    this.FetchColumnOptions()
    /* workflow-plugin start */
    this.FetchWorkFlowOptions({ flowCate: 1 })
    /* workflow-plugin end */
    if (this.columnOptions.length) {
      this.applyFormItems[1].tree = this.columnOptions
    }
  }
}
</script>

<style lang="scss">
.d-workflow-preview > .el-form-item{
  /*padding-bottom: 0;*/
  .el-form-item__content{
    display: flex;
    flex-wrap: wrap;
    .el-select{
      margin-right: 10px;
      /*padding-bottom: 15px;*/
    }
    .btn-extend{
      display: block;
      margin: 0;
      /*margin-bottom: 15px;*/
      font-size: 14px;
    }
  }
}
</style>
