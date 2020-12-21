<template>
  <section class="crontab-dialog-container">
    <el-dialog
      v-loading="loading"
      :title="title"
      :width="width"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <slot>
        <el-tabs v-model="activeTab">
          <template v-for="(item, index) in tabs">
            <el-tab-pane :key="index" :label='item.label' :name='item.name'>
              <component :is='item.component' :key="index" v-bind="item" v-model="item.value"/>
            </el-tab-pane>
          </template>
        </el-tabs>
        <base-table v-bind="list" :data="tableData" class="crontab-dialog-table"/>
      </slot>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel" size="small" plain>{{$t('global.cancel')}}</el-button>
        <el-button type="primary" size="small"
          @click="handleConfirm">{{$t('global.confirm')}}
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import Second from './Second'
import baseTable from '@/components/mixins/baseTable'

const columns = [
  {
    prop: '1',
    label: '秒'
  },
  {
    prop: '2',
    label: '分'
  },
  {
    prop: '3',
    label: '时'
  },
  {
    prop: '4',
    label: '日'
  },
  {
    prop: '5',
    label: '月'
  },
  {
    prop: '6',
    label: '周'
  },
  {
    prop: '7',
    label: '年'
  }
]
export default {
  name: 'CrontabDialog',
  props: {
    value: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '650px'
    },
    title: {
      type: String,
      default: '设置任务周期'
    },
    showCancel: {
      type: Boolean,
      default: true
    }
  },
  mixins: [baseTable],
  components: {
    Second
  },
  data () {
    const now = new Date()
    const year = now.getFullYear()
    return {
      dialogVisible: false,
      activeTab: '1',
      tabs: [
        {
          name: '1',
          label: '秒',
          value: '*',
          component: 'Second'
        },
        {
          name: '2',
          label: '分',
          value: '*',
          component: 'Second'
        },
        {
          name: '3',
          label: '时',
          value: '*',
          component: 'Second',
          period: {
            minVal: 0,
            maxVal: 2
          }
        },
        {
          name: '4',
          label: '日',
          value: '?',
          component: 'Second',
          typeBtns: ['1', '2', '3', '4', '5', '6', '9'],
          loop: {
            minVal: 1,
            maxVal: 1
          }
        },
        {
          name: '5',
          label: '月',
          value: '*',
          component: 'Second',
          typeBtns: ['1', '2', '3', '4', '9'],
          loop: {
            minVal: 1,
            maxVal: 1
          }
        },
        {
          name: '6',
          label: '周',
          value: '*',
          component: 'Second',
          typeBtns: ['1', '3', '4', '7', '8', '9'],
          loop: {
            minVal: 1,
            maxVal: 1
          }
        },
        {
          name: '7',
          label: '年',
          value: '*',
          component: 'Second',
          typeBtns: ['1', '3', '4'],
          period: {
            minVal: year,
            maxVal: year
          }
        }
      ],
      list: {
        columns,
        showSelection: false,
        showPagination: false,
        handleColumn: []
      }
    }
  },
  computed: {
    tableData () {
      const data = {}
      this.tabs.forEach(d => {
        data[d.name] = d.value
      })
      return [data]
    }
  },
  watch: {
    value (newData, oldData) {
      if (newData !== oldData) {
        const val = newData.split(' ')
        if (val.length) {
          val.forEach((d, i) => {
            let tab = this.tabs[i]
            tab.value = d
            this.tabs.splice(i, 1, tab)
          })
        }
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
    handleConfirm () {
      const val = this.tabs.map(d => d.value).join(' ')
      this.$emit('input', val)
      this.handleCancel()
    }
  }
}
</script>

<style lang="scss">
.crontab-dialog-table{
  padding-top: 20px;
  .el-table.el-table--fit{
    border-right: 1px solid #e8e8e8;
  }
}
</style>
