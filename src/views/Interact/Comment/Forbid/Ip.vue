<template>
  <section class="interact-forbid-ip-container">
    <p><label>当前用户:</label><span></span><label>禁言时间：</label><span></span><label>操作人：</label><span></span></p>
    <base-header
      v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
    ></base-table>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
const columns = [
  {
    prop: 'ossName',
    label: '评论内容'
  },
  {
    prop: 'ossName',
    label: '文章'
  },
  {
    prop: 'ossName',
    label: '时间'
  }
]
export default {
  name: 'interactCommentForbidIp',
  mixins: [baseTable, baseHeader],
  data () {
    return {
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '取消用户禁止',
            icon: 'quxiaojingzhi',
            disabled: !this._checkPermission('/usercomment/cancel/stop', 'PUT')
          },
          {
            type: 'Delete',
            text: '删除评论',
            icon: 'delete',
            disabled: !this._checkPermission('/usercomment', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
      },
      list: {
        columns,
        api: 'fetchOssStorageList',
        params: {
          ossName: '',
          ossType: ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/usercomment/status', 'PUT')
          }
        ]
      }
    }
  },
  methods: {
    handleHeaderCreate () {

    },
    handleHeaderDelete () {

    },
    handleTableDelete () {

    }
  },
  mounted () {
  },
  created () {

  }
}
</script>

<style lang="scss" scoped></style>
