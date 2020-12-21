<template>
  <jee-aside-layout class="column-container">
    <section slot="asideHeader">
      <el-button
        size="medium"
        type='primary'
        @click="handleHeaderCreate"
        :disabled="!_checkPermission('/channel', 'POST') || (columnId && columnData.createChildAble !== undefined && !columnData.createChildAble)"
      ><jee-icon iconClass="xinjian"/>新建</el-button>
      <form-dialog
        ref="addDialog"
        title="新建栏目"
        :loading="addFormLoading"
        :form="addForm"
        :rules="addRules"
        :formItems="addFormItems"
        :options="{
          getColumnOptions,
          columnModelOptions
        }"
        v-on:handleConfirm="handleConfirmCreate"
      ></form-dialog>
    </section>
    <section slot="asideMain">
      <div class="aside-search-wrap">
        <el-input
          v-model="searchValue"
          :maxlength="50"
          placeholder="请输入栏目名"
          size="small"
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append"
            size="small" class="jee-bg-light-important"
            @click="handleSearch">
            <jee-icon iconClass="xiazai15" style="fill: #ffffff"></jee-icon>
          </el-button>
        </el-input>
      </div>
      <div class="aside-title">所有栏目</div>
      <div class=" t-scroll">
        <base-tree
          v-bind="tree"
          v-if="columnId"
          @handleClick="handleClick"
          @handleSort="handleSort"
        ></base-tree>
      </div>
    </section>
    <section slot="main">
      <base-header
        v-bind="columnHeaders"
        @handleCommandPermission='handleHeaderPermission'
        @handleRelease="handleHeaderRelease"
        @handleMerge="handleHeaderMerge"
        @handleBatchCreate='handleHeaderBatchCreate'
        @handleDelete="handleHeaderDelete"
        @handleBrowse="handleHeaderBrowse"
        @handlePreview="handleHeaderPreview"
      />
      <el-tabs v-loading='detailLoading' :value="currentTab" @tab-click="handleClickTabs">
        <template v-for="(tab, index) in getTabs">
          <el-tab-pane :label="tab.label" :name="tab.name" :key="index">
            <component  v-if="columnId" :is="tab.component" name="channelId" :value="columnId"
              :key="index" :label-width="labelWidth" :dataType="dataType" :tabIndex="currentTab"
              :permAssignAble="columnData.permAssignAble"
              :editAble="columnData.editAble" @reflushColumnTree="reflushColumnTree"/>
          </el-tab-pane>
        </template>
      </el-tabs>
      <!-- 弹框 -->
      <form-dialog
        class="staticDialog"
        ref="static"
        width='484px'
        title="发布静态页"
        :loading="addStaticFormLoading"
        :form="addStaticForm"
        :formItems="addStaticFormItems"
        :buttons="addStaticButtons"
        v-on:handleConfirm="handleConfirmStatic"
      ></form-dialog>
      <form-dialog
        ref="mergeColumn"
        title="合并栏目"
        :form="addMergeForm"
        :rules="addMergeRules"
        :formItems="addMergeFormItems"
        :buttons="addMergeButtons"
        @getTheNod='getTheNodMerge'
        v-on:handleConfirm="handleConfirmMerge">
        <template #label="scope">
          <p class="mergeLabel">选择合并进来的栏目：</p>
        </template>
      </form-dialog>
      <form-dialog
        ref="BatchColumn"
        title="批量创建栏目"
        class="batch-form"
        :buttons="addBatchButtons"
        :rules="addBatchRules"
        :formItems="addBatchFormItems"
        @handleConfirm="handleConfirmBatch">
        <template #modelId="scope">
          <p>请按如下要求输入栏目名称：</p>
          <p>1、每行请填写一个栏目</p>
          <p>2、子栏目相对父栏目使用两个空格缩进</p>
          <span class="label">3、栏目模型：</span>
          <el-select v-model="scope.form.modelId"
            popper-class="jee-border"
            size="small" placeholder="请选择栏目模型">
            <el-option
              v-for="opt in columnModelOptions"
              :key="opt.value"
              :value="opt.value"
              :label="opt.label"
            ></el-option>
          </el-select>
        </template>
        <template #columns="scope">
          <el-input
            type="textarea"
            v-model="scope.form.columns"
            :autosize="{ minRows: 2, maxRows: 20}"
            placeholder="请输入栏目名称">
          </el-input>
        </template>
      </form-dialog>
    </section>
  </jee-aside-layout>
</template>

<script>
import columnTree from './columnTree'

export default {
  name: 'columnIndex',
  mixins: [columnTree],
  components: {},
  data () {
    return {
      labelWidth: 'auto',
      currentTab: 'org',
      tabs: [],
      addStaticFormLoading: false,
      addStaticForm: {
        op: []
      },
      addStaticFormItems: [
        {
          prop: 'op',
          type: 'checkbox',
          options: [
            {
              value: 'channel',
              label: '生成栏目静态页'
            },
            {
              value: 'channelChild',
              label: '生成子栏目静态页'
            },
            {
              value: 'channelContent',
              label: '生成内容静态页'
            }
          ]
        }
      ],
      addStaticButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      addMergeFormLoading: false,
      addMergeForm: {
        ids: []
      },
      addMergeRules: {
        ids: [this.$rules.required()]
      },
      addMergeFormItems: [
        {
          type: 'slot',
          prop: 'label',
          labeText: '选择合并进来的栏目',
          labelWidth: '80px'
        },
        {
          type: 'checkTree',
          prop: 'ids',
          tree: [],
          props: {
            label: 'name',
            value: 'id'
          },
          labelWidth: '80px'
        }
      ],
      addMergeButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      addBatchForm: {
        modelId: '',
        columns: ''
      },
      addBatchFormItems: [
        {
          type: 'slot',
          prop: 'modelId'
        },
        {
          type: 'slot',
          prop: 'columns'
        }
      ],
      addBatchRules: {
        modelId: [this.$rules.required()],
        columns: [this.$rules.required()]
      },
      addBatchButtons: [
        {
          text: '确定',
          type: 'Submit',
          keepAlive: true
        }
      ]
    }
  },
  methods: {
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleClickTabs (tab) {
      this.currentTab = tab.name
      this.labelWidth = ''
      this.$nextTick(() => {
        this.labelWidth = 'auto'
      })
    },
    // 排序
    handleSort (data, type) {
      this.tree.loading = true
      let params = {
        channelId: data.id
      }
      if (type === 'up') {
        params.nextId = data.prevId
      } else {
        params.onId = data.nextId
      }
      this.$request.fetchChannelSort(params).then(res => {
        if (res.code === 200) {
          this._messageSuccess('sort')
          this.fetchChannelTree()
          this.FetchColumnOptions()
        }
        this.tree.loading = false
      }).catch(() => {
        this.tree.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.column-container{
  .base-header-container{
    padding-top: 11px;
  }
  .el-tabs{
    .el-tabs__content{
      overflow: visible;
    }
  }
  .aside-search-wrap{
    padding: 10px;
  }
  .aside-title{
    padding: 10px 20px 20px;
    color: #333333;
    font-size: 16px;
    // font-weight: bold;
  }
  .staticDialog{
    .el-checkbox-group{
      margin-bottom: 0;
    }
    .el-checkbox{
      width: 100% !important;
      margin-bottom: 15px;
      margin-left: -20px;
      .el-checkbox__label{
        color: #333333;
      }
      &:last-of-type{
        margin-bottom: 5px;
      }
    }
  }
  .batch-form{
    padding-left: 50px;
    .el-form-item__content{
      margin-left: 80px !important;
      .el-form-item{
        margin-bottom: 0 !important;
      }
    }
    // p{
    //   margin-bottom: 10px;
    // }
    .el-textarea{
      // height: 208px;
      width: 100%;
      max-width: 402px;
      textarea{
        color: #333 !important;
      }
    }
    .el-select{
      width: 310px;
      max-width: 310px;
      .el-input{
        width: 310px;
        input{
          width: 310px;
        }
        .el-input__suffix{
          right: 0;
        }
      }
    }
  }
  .mergeLabel{
    margin-bottom: -10px;
  }
}
</style>
