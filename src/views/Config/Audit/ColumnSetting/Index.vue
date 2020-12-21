<template>
  <section id="audit-column-set-index">
    <base-header v-bind="headers"/>
    <p class="noData" v-if="!strategyList.length">暂无数据</p>
    <div v-else class="strategyModel" v-for="(item,index) in strategyList" :key="index">
      <div :class="['topRow',{'border':item.isTable}]" @click="switchStrategy(item,index)">
        <p>
          <span>【{{item.strategyName}}】</span>
          <span>{{item.strategyString.split('|')[0]}}</span>
          <span>{{item.strategyString.split('|')[1]}}</span>
        </p>
      </div>
      <el-collapse-transition>
        <base-table
          v-show="item.isTable"
          v-bind="item.list"
          @handleForcedBy="handleForcedBy(arguments,item.list.data)"
          @handleStatus="handleStatus(arguments,item.list.data)"
          @handleDelete="handleTableDelete"
          @handleAllDelete="handleTableAllDelete(arguments,item.list.data)"
        >
          <template #channelName="scope">
            <el-button v-if="scope.scope.row.hiddenAllDelete === false" type="primary" size="medium" @click.stop="selectColumn(item.strategyId)" class="selectBtn">选择栏目</el-button>
            <span v-else>{{scope.scope.row.channelName}}</span>
          </template>
        </base-table>
      </el-collapse-transition>
    </div>
    <form-dialog
      ref="StrategyColumn"
      :title='editTitle'
      :loading="editFormLoading"
      :form="editForm"
      :rules="editRules"
      :buttons="editButtons"
      :scrollHight="scrollHight"
      :formItems="editFormItems"
      @handleConfirm="handleConfirm"
      @getTheNod="getTheNod"
      @change="handleCheckAllChange"
    >
    </form-dialog>
  </section>
</template>

<script>
import baseTable from '@/components/mixins/baseTable'
import baseHeader from '@/components/mixins/baseHeader'
import formDialog from '@/components/mixins/formDialog'
import { deepClone } from '@/utils'

export default {
  name: 'configAuditColumnSetting',
  mixins: [baseTable, baseHeader, formDialog],
  data () {
    const columns = [
      {
        prop: 'channelName',
        label: '栏目',
        minWidth: '180',
        scopeType: 'slot'
      },
      {
        prop: 'isCompel',
        label: '允许强制通过',
        minWidth: '200',
        scopeType: 'switch',
        renderHeader: (h, { column }) => {
          return ('div', [
            h('span', column.label),
            h('jee-popover', {
              style: 'margin-left:10px',
              props: { popoverText: '设为允许后在检测出含有违禁内容时会出现强制提交按钮，点击此按钮可忽略审核策略，请谨慎使用', placement: 'right-start', popoverWidth: '150' }
            })
          ]
          )
        },
        enableText: '是',
        disableText: '否',
        type: 'ForcedBy',
        disabled: !this._checkPermission('/auditchannelset/pass', 'POST')
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '200',
        scopeType: 'switch',
        enableText: '开启',
        disableText: '关闭',
        type: 'Status',
        disabled: !this._checkPermission('/auditchannelset/on', 'POST')
      }
    ]
    return {
      channelList: [],
      strategyId: 0,
      ids: [],
      firstColum: [
        { channelName: '', isCompel: true, status: true }
      ],
      strategyList: [],
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        paddingBottom: '17px',
        content: '一个栏目只能使用一种审核策略；只能对最底层栏目设置审核策略，对栏目设置策略后，在此栏目下发布或自动发布内容时会进行智能审核。'
      },
      list: {
        columns,
        showSelection: false,
        showPagination: false,
        showPaginationSimple: false,
        // data: [
        //   { column: '', isCompel: false, status: false, hiddenDelete: true, hiddenAllDelete: false },
        //   { column: '国内新闻', isCompel: true, status: false, hiddenDelete: false, hiddenAllDelete: true },
        //   { column: '国际新闻', isCompel: false, status: true, hiddenDelete: false, hiddenAllDelete: true }
        // ],
        handleColumnProp: {
          label: '操作',
          align: 'left',
          width: '120'
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/auditchannelset', 'DELETE')
          },
          {
            type: 'AllDelete',
            name: '删除所有栏目',
            icon: 'delete',
            disabled: !this._checkPermission('/auditchannelset', 'DELETE')
          }
        ]
      },
      editTitle: '选择栏目',
      editFormLoading: false,
      editButtons: [
        {
          text: '保存',
          type: 'Submit',
          disabled: !this._checkPermission('/auditchannelset', 'POST')
        }
      ],
      editForm: {
        channelId: [],
        checkAll: ''
      },
      editRules: {
        channelId: [
          this.$rules.required()
        ]
      },
      editFormItems: [
        {
          type: 'checkbox',
          labelWidth: '90px',
          complex: true,
          optionLabel: '所有栏目',
          prop: 'checkAll',
          disabled: false
        },
        {
          prop: 'channelId',
          type: 'checkTree',
          labelWidth: '90px',
          height: 'auto',
          nodeKey: 'channelId',
          tree: [],
          props: {
            children: 'children',
            label: 'channelName',
            disabled: 'gray'
          }
        }
      ],
      clientHeight: document.documentElement.scrollHeight || document.body.scrollHeight,
      scrollHight: document.documentElement.scrollHeight * 56 / 100 - 60
    }
  },
  watch: {
    clientHeight: function (val) {
      this.scrollHight = val * 56 / 100 - 60
    }
  },
  methods: {
    fetchAuditchannelsetList () {
      this.$request.fetchAuditchannelsetList().then(res => {
        if (res.code === 200) {
          this.strategyList = res.data
          this.strategyList.map(v => {
            v.list = deepClone(this.list)
            let firstColum = deepClone(this.firstColum)
            v.channelSets.forEach(item => {
              if (!item.isCompel) {
                firstColum[0].isCompel = false
              }
              if (!item.status) {
                firstColum[0].status = false
              }
            })
            v.list.data = firstColum.concat(deepClone(v.channelSets))
            v.list.data.map(w => {
              if (!w.channelName) {
                w.hiddenDelete = true
                w.hiddenAllDelete = false
              } else {
                w.hiddenDelete = false
                w.hiddenAllDelete = true
              }
            })
          })
          this.strategyList.forEach((item, index) => {
            if (index === 0) {
              this.$set(this.strategyList[index], 'isTable', true)
            } else {
              this.$set(this.strategyList[index], 'isTable', false)
            }
          })
        }
      })
    },
    // 展开table
    switchStrategy (item, i) {
      this.$set(this.strategyList[i], 'isTable', !item.isTable)
    },
    // 强制通过
    fetchAuditchannelsetPass (id) {
      this.$request.fetchAuditchannelsetPass({
        'ids': id
      }).then(res => {
        this.$restBack(res, () => {
        }, '操作成功')
      })
    },
    // 强制不通过
    fetchAuditchannelsetNopass (id) {
      this.$request.fetchAuditchannelsetNopass({
        'ids': id
      }).then(res => {
        this.$restBack(res, () => {
        }, '操作成功')
      })
    },
    // 开启状态
    fetchAuditchannelsetOn (id) {
      this.$request.fetchAuditchannelsetOn({
        'ids': id
      }).then(res => {
        this.$restBack(res, () => {
        }, '操作成功')
      })
    },
    // 关闭状态
    fetchAuditchannelsetOff (id) {
      this.$request.fetchAuditchannelsetOff({
        'ids': id
      }).then(res => {
        this.$restBack(res, () => {
        }, '操作成功')
      })
    },
    // 删除
    fetchAuditchannelset (id) {
      this.$request.fetchAuditchannelset({
        'ids': id
      }).then(res => {
        this.$restBack(res, () => {
          this.fetchAuditchannelsetList()
        }, '删除成功')
      })
    },
    // 全选强制通过/不通过
    handleForcedBy () {
      if (!arguments[0][0].channelName) {
        if (arguments[0][0].isCompel) {
          arguments[1].map(v => {
            v.isCompel = true
          })
          let ids = []
          arguments[1].forEach(item => {
            if (item.id) {
              ids.push(item.id)
            }
          })
          if (ids.length) {
            this.fetchAuditchannelsetPass(ids)
          }
        } else {
          arguments[1].map(v => {
            v.isCompel = false
          })
          let ids = []
          arguments[1].forEach(item => {
            if (item.id) {
              ids.push(item.id)
            }
          })
          if (ids.length) {
            this.fetchAuditchannelsetNopass(ids)
          }
        }
      }
      if (arguments[0][0].channelName) {
        if (arguments[0][0].isCompel) {
          this.fetchAuditchannelsetPass([arguments[0][0].id])
        } else {
          this.fetchAuditchannelsetNopass([arguments[0][0].id])
        }
      }
      if (!arguments[0][0].isCompel) {
        this.$set(arguments[1][0], 'isCompel', false)
      } else {
        let arr = deepClone(arguments[1])
        arr.splice(0, 1)
        let isCheck = arr.some(item => item.isCompel === false)
        console.log(arr, isCheck)
        if (isCheck) {
          this.$set(arguments[1][0], 'isCompel', false)
        } else {
          this.$set(arguments[1][0], 'isCompel', true)
        }
      }
    },
    // 全选状态
    handleStatus () {
      if (!arguments[0][0].channelName) {
        if (arguments[0][0].status) {
          arguments[1].map(v => {
            v.status = true
          })
          let ids = []
          arguments[1].forEach(item => {
            if (item.id) {
              ids.push(item.id)
            }
          })
          if (ids.length) {
            this.fetchAuditchannelsetOn(ids)
          }
        } else {
          arguments[1].map(v => {
            v.status = false
          })
          let ids = []
          arguments[1].forEach(item => {
            if (item.id) {
              ids.push(item.id)
            }
          })
          if (ids.length) {
            this.fetchAuditchannelsetOff(ids)
          }
        }
      }
      if (arguments[0][0].channelName) {
        if (arguments[0][0].status) {
          this.fetchAuditchannelsetOn([arguments[0][0].id])
        } else {
          this.fetchAuditchannelsetOff([arguments[0][0].id])
        }
      }
      if (!arguments[0][0].status) {
        this.$set(arguments[1][0], 'status', false)
      } else {
        let arr = deepClone(arguments[1])
        arr.splice(0, 1)
        let isCheck = arr.some(item => item.status === false)
        console.log(arr, isCheck)
        if (isCheck) {
          this.$set(arguments[1][0], 'status', false)
        } else {
          this.$set(arguments[1][0], 'status', true)
        }
      }
    },
    handleTableDelete (row) {
      this.fetchAuditchannelset([row.id])
    },
    handleTableAllDelete () {
      let ids = []
      arguments[1].forEach(item => {
        if (item.id) {
          ids.push(item.id)
        }
      })
      console.log(ids)
      if (ids.length > 0) {
        this.fetchAuditchannelset(ids)
      }
    },
    // 选择栏目详情
    fetchSelectAuditchannelset (id) {
      this.$request.fetchSelectAuditchannelset({
        'strategyId': id
      }).then(res => {
        if (res.code === 200) {
          this.editFormItems.find(v => v.prop === 'channelId').tree = res.data
          this.ids = []
          this.filterData(res.data)
          this.inverseCheck(res.data)
          if (this.channelList.find(v => v === 'b')) {
            this.editFormItems[0].disabled = false
          } else {
            this.editFormItems[0].disabled = true
          }
          this.editForm.channelId = this.ids
          this.$refs.StrategyColumn.$refs.startTreechannelId[0].setCheckedKeys(this.ids)
        }
      })
    },
    // 保存选择栏目
    fetchSaveAuditchannelset () {
      this.$request.fetchSaveAuditchannelset({
        'strategyId': this.strategyId,
        'channels': this.ids
      }).then(res => {
        this.$restBack(res, () => {
          this.fetchAuditchannelsetList()
        }, '保存成功')
      })
    },
    // 选择栏目
    selectColumn (id) {
      this.strategyId = id
      this.fetchSelectAuditchannelset(id)
      this.channelList = []
      this.$refs.StrategyColumn.showDialog()
      this.editForm.checkAll = 0
    },
    // 保存
    handleConfirm () {
      console.log(this.ids)
      this.fetchSaveAuditchannelset()
    },
    getTheNod (item) {
      this.ids = item
      console.log(item)
    },
    // 筛选数据
    filterData (data) {
      data.forEach(item => {
        if (item.select) {
          this.ids.push(item.channelId)
        }
        if (item.children.length) {
          this.filterData(item.children)
        } else {
          return this.ids
        }
      })
    },
    // 反选
    inverseCheck (data) {
      for (let item of data) {
        if (item.children.length) {
          this.inverseCheck(item.children)
        } else {
          if (item.gray) {
            this.channelList.push('a')
          } else {
            this.channelList.push('b')
          }
        }
      }
    },
    handleCheckAllChange () {
      if (this.editForm.checkAll === 1) {
        this.$refs.StrategyColumn.$refs.startTreechannelId[0].setCheckedNodes(this.editFormItems.find(v => v.prop === 'channelId').tree.filter(d => !d.gray))
        this.ids = this.$refs.StrategyColumn.$refs.startTreechannelId[0].getCheckedKeys()
      } else {
        this.$refs.StrategyColumn.$refs.startTreechannelId[0].setCheckedNodes([])
      }
    }
  },
  mounted () {
    this.fetchAuditchannelsetList()
    var _this = this
    this.scrollHight = document.documentElement.scrollHeight * 56 / 100 - 60
    window.onresize = function () { // 定义窗口大小变更通知事件
      _this.scrollHeight = document.documentElement.scrollHeight // 窗口高度
    }
  },
  activated () {
    this.fetchAuditchannelsetList()
  }
}
</script>
<style lang="scss">
#audit-column-set-index{
  .noData{
    text-align: center;
  }
  .strategyModel{
    margin-bottom: 30px;
  }
  .jee-svg-icon{
    font-size: 14px;
  }
  .topRow{
    cursor: pointer;
    border: 1px solid #E8E8E8;
    min-height: 46px;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    &:hover{
      border-color: #CCCCCC;
    }
    p{
      color: #666666;
      font-size: 14px;
      line-height: 1.5;
      span:first-child{
        font-weight:600;
        color: #333333;
        font-size: 16px;
      }
      span+span{
        padding-left: 20px;
      }
    }
  }
  .border{
    border-radius: 4px 4px 0 0;
  }
  .selectBtn{
    padding: 8px 15px;
    height: 32px;
  }
  .el-table {
      border-top: none!important;
      border-radius:0 0 4px 4px!important;
      .el-table__header th:first-of-type{
        padding-left: 10px !important;
      }
      .cell{
        padding-left: 0;
      }
  }
  .el-form-item.mini-height{
    .el-checkbox__input{
      margin-bottom: -2px;
    }
    .el-checkbox__label{
      line-height: 14px;
    }
  }
  .check-tree-wrap{
    width: 360px!important;
  }
}

</style>
