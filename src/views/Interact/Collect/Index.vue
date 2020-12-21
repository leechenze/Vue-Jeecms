<template>
  <section class="interact-collect-index-container" v-loading="loading">
    <div class="box-left">
      <el-aside width="190px">
        <div class="interact-collect-index-tree">
          <div class="interact-collect-index-tree-top">
            <el-button :disabled="!_checkPermission('/interact/collect/detail', 'GET',true)" type="primary" size="small"
               @click="addCollect"><jee-icon iconClass="xinjian"></jee-icon>新建任务</el-button>
          </div>
          <div class="interact-collect-index-tree-list">
            <h2><jee-icon iconClass="caijirenwu" :style="{ marginRight: '10px', color: '#777', fill:'#777'}"></jee-icon>采集任务</h2>
            <div class="interact-collect-index-tree-list-box scrollbar">
              <ul>
                <li v-for="(item, index) in collectList" :class="{'hover': index === treeIndex}" :key="index" @click="getCollectDetail(item.id, index)">
                  <p>{{ item.name }}</p>
                  <el-tooltip
                    class="ct-box__item"
                    :content="item.status === 1 ? '采集中' : '未开始'"
                    placement="bottom"
                    effect="light">
                    <jee-icon @mousemove="jeeMove(index)" @mouseout="jeeOut" :class="{'jee-color': startOrIngChangeId === index }" :iconClass="item.status == 0 || item.status === 2 ? 'kaishicaiji' : 'jinxingzhong'"></jee-icon>
                  </el-tooltip>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-aside>
    </div>
    <section class="box-right">
      <template v-if="empty === true">
        <div class="interact-collect-index-empty"></div>
      </template>
      <template v-if="empty === false">
        <base-header
          v-bind="headers"
          v-on:handleDeleteTask="deleteCollectTask"
          v-on:handleDeleteData="fetchCollectContent"
          v-on:handleClear="fetchCollectContentAll"
          v-on:handleEdit="seeOrEditCollect('Edit')"
          v-on:handleStart="collectStart"
          v-on:handleMove="fetchCollectConsume"
          v-on:handleSee="seeOrEditCollect('See')"
        />
        <base-table
          v-bind="list"
          class="interact-collect-index-table"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @handleSelectionChange="handleSelectionChange"
        >
          <template #xuhao="scope"> {{scope.scope.$index + 1}} </template>
          <template #status="scope"><p style="color: red;">已采集，未入库</p></template>
        </base-table>
      </template>
    </section>
    <div class="interact-collect-alert-box" v-if="isAlertShow">
      <div class="interact-collect-alert-box-bg">
        <h3><jee-icon iconClass="tangchuangguanbi" @click="isAlertShow = false"></jee-icon><jee-icon iconClass="tishixinxi"></jee-icon>提示</h3>
        <p>用户无所选栏目下新建内容权限，无法操作</p>
      </div>
    </div>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'

export default {
  name: 'interactCollectIndex',
  mixins: [baseHeader, baseTable],
  data () {
    return {
      // 右侧内容顶部按钮配置
      headers: {
        buttons: [
          {
            type: 'See',
            text: '查看任务',
            icon: 'liulan',
            prim: true,
            disabled: !this._checkPermission('/interact/collect/detail?collectType=See', 'GET', true),
            isHidden: false
          },
          {
            type: 'Edit',
            text: '修改任务',
            icon: 'xiugaihuifu',
            isHidden: false,
            disabled: !this._checkPermission('/interact/collect/detail?collectType=Edit', 'GET', true),
            iconStyle: {
              fontSize: '14px'
            }
          },
          {
            type: 'Start',
            text: '开始采集',
            icon: 'kaishicaiji',
            isHidden: false,
            disabled: !this._checkPermission('/MODULE-COLLECT/collectTasks/start', 'GET')
          },
          {
            type: 'Move',
            text: '手动入库',
            icon: 'yidong1',
            isHidden: false,
            disabled: !this._checkPermission('/collect/consumeByIds', 'POST')
          },
          {
            type: 'DeleteData',
            text: '删除数据',
            icon: 'delete',
            disabled: !this._checkPermission('/MODULE-COLLECT/collect/data/results', 'DELETE'),
            isHidden: false
          },
          {
            type: 'Clear',
            text: '清空所有数据',
            icon: 'qingkong',
            disabled: !this._checkPermission('/MODULE-COLLECT/collect/data/results/clear', 'DELETE'),
            isHidden: false
          },
          {
            type: 'DeleteTask',
            text: '删除任务',
            icon: 'delete',
            disabled: !this._checkPermission('/MODULE-COLLECT/collectTasks/', 'DELETE'),
            isHidden: false
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
      },
      // 表格配置
      list: {
        columns: [
          {
            prop: 'xuhao',
            scopeType: 'slot',
            label: '序号',
            width: '200px'
          },
          {
            prop: 'title',
            label: '标题'
          },
          {
            prop: 'createTime',
            label: '采集时间',
            width: '280px'
          },
          {
            prop: 'status',
            scopeType: 'slot',
            label: '状态',
            width: '140px'
          }
        ],
        totalCount: 0,
        data: []
      },
      // 没有数据
      empty: null,
      // 云端用户ID
      identity: '',
      // 云端url
      iframeUrl: '',
      // 客户端数据
      CMSData: {},
      // 采集任务列表
      collectList: [],
      // 页面加载中
      loading: true,
      // 选中列表
      treeIndex: 0,
      // 按钮显示列表
      isButtonNotShow: [
        ['See'],
        ['Edit', 'Start', 'DeleteTask']
      ],
      // 采集任务数据列表当前页
      collectPage: 1,
      // 采集任务数据列表一页条数
      collectSize: 10,
      // 需要删除的采集数据列表
      collectIds: [],
      // 没有栏目权限，设置禁止点击
      isDisabled: false,
      // 没有权限弹窗
      isAlertShow: false,
      // 未开始、采集中样式切换id
      startOrIngChangeId: ''
    }
  },
  mounted () {
    // 判断是否有云平台ID
    if (window.localStorage.getItem('yunIdentity') === null || window.localStorage.getItem('yunIdentity') === 'null' || window.localStorage.getItem('yunIdentity') === undefined) {
      this.$nextTick(() => {
        this.setCollectId()
      })
    } else {
      this.identity = window.localStorage.getItem('yunIdentity')
      this.iframeUrl = window.localStorage.getItem('yunIframeUrl')
    }
    console.log('1')
    // this.getAppIDOrModel()
  },
  activated () {
    console.log('2')
    this.$nextTick(() => {
      this.getAppIDOrModel()
    })
  },
  methods: {
    // 鼠标移动
    jeeMove (index) {
      this.startOrIngChangeId = index
    },
    // 鼠标离开
    jeeOut () {
      this.startOrIngChangeId = ''
    },
    // 新增任务
    addCollect () {
      this.fetchAddCollectEnable()
    },
    // 检查任务数量限制
    fetchAddCollectEnable () {
      this.$request.fetchAddCollectEnable({ 'appId': this.CMSData.appId, 'identity': this.identity, 'siteId': window.localStorage.getItem('siteId') }).then(res => {
        if (res.code === 200 && res.data) {
          this.$routerLink('/interact/collect/detail')
        }
      })
    },
    // 查看任务or修改任务
    seeOrEditCollect (type) {
      let to = 'FastCollectConfig'
      if (this.collectList[this.treeIndex].modelType === '') {
        to = 'CustomCollect'
      }
      this.$routerLink('/interact/collect/detail?collectType=' + type + '&taskId=' + this.collectList[this.treeIndex].id + '&to=' + to)
    },
    // 设置云端ID
    setCollectId () {
      this.$request.setCollectId().then(res => {
        if (res.code === 200) {
          this.identity = res.data.identity
          this.iframeUrl = res.data.serverUrl
          window.localStorage.setItem('yunIdentity', res.data.identity)
          window.localStorage.setItem('yunIframeUrl', res.data.serverUrl)
        }
      })
    },
    // 获取模型和APPID
    getAppIDOrModel (callback) {
      this.$request.fetchCollectGetId().then(res => {
        this.collectLook = false
        if (res.code === 200) {
          this.CMSData = res.data
          window.localStorage.setItem('appid', res.data.appId)
          this.setYunAppIdOrModel()
          // 判断是否有回调
          if (callback) {
            callback()
          } else {
            this.getCollectLists()
          }
        }
      })
    },
    // 判断是否有权限，页面加载获取栏目列表，跟当前采集任务进行匹配
    isPowerChannels (callback) {
      let Channels = JSON.stringify(this.CMSData.channels)
      // 初始化为不禁用
      this.isDisabled = false
      // 当前采集任务，所在栏目
      if (Channels.indexOf(this.collectList[this.treeIndex].channelId) === -1) {
        this.isDisabled = true
      }
      this.resetButton()
      // 判断是否有回调
      if (callback) callback()
    },
    // 设置云端模型和栏目
    setYunAppIdOrModel () {
      let obj = Object.assign({ 'identity': this.identity, 'siteId': window.localStorage.getItem('siteId') }, this.CMSData)
      this.$request.fetchSetYunAppIdOrModel(obj).then(res => {
        if (res.code === 200) {

        }
      })
    },
    // 获取采集数据列表
    getCollectLists () {
      this.$request.fetchCollectTaskList({ 'id': this.CMSData.appId, 'identity': this.identity, 'siteId': window.localStorage.getItem('siteId') }).then(res => {
        this.loading = false
        if (res.code === 200 || res.code === 1) {
          this.collectList = res.data.content
          if (this.collectList.length > 0) {
            this.empty = false
            this.getCollectDetail(this.collectList[0].id, 0)
          } else {
            this.empty = true
          }
        }
      })
    },
    // 获取采集任务详情
    getCollectDetail (id, index) {
      this.loading = true
      this.treeIndex = index
      this.$request.fetchCollectContentPage({ 'id': id, 'appId': this.CMSData.appId, 'identity': this.identity, 'size': this.collectSize, 'page': this.collectPage }).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.list.data = res.data.content
          this.list.totalCount = res.data.totalElements
          this.isPowerChannels()
        }
      })
    },
    // 删除采集任务
    deleteCollectTask () {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$request.deleteCollectTask({ id: this.collectList[this.treeIndex].id, 'appId': this.CMSData.appId, 'identity': this.identity }).then(res => {
          if (res.code === 200) {
            this.loading = false
            this.collectList.splice(this.treeIndex, 1)
            if (this.collectList.length !== 0) {
              let index = this.treeIndex
              if (this.collectList.length <= index) {
                index--
              }
              this.getCollectDetail(this.collectList[index].id, index)
            }
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      })
    },
    // 删除单条采集数据
    fetchCollectContent () {
      if (this.collectIds.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选需要删除的数据！'
        })
        return
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _this = this
        this.loading = true
        this.$request.fetchCollectContent({ 'data': { 'ids': this.collectIds }, 'appId': this.CMSData.appId, 'identity': this.identity }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功',
              onClose: function () {
                _this.loading = false
                _this.getCollectDetail(_this.collectList[_this.treeIndex].id, _this.treeIndex)
              }
            })
          }
        })
      })
    },
    // 清空数据
    fetchCollectContentAll () {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$request.fetchCollectContentAll({ 'id': this.collectList[this.treeIndex].id, 'appId': this.CMSData.appId, 'identity': this.identity }).then(res => {
          if (res.code === 200) {
            this.loading = false
            this.getCollectDetail(this.collectList[this.treeIndex].id, this.treeIndex)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      })
    },
    // 重置按钮
    resetButton () {
      // 判断状态是否是 2 暂停，如果是，则把按钮显示状态调整为 未开始
      let status = this.collectList[this.treeIndex].status === 2 ? 0 : this.collectList[this.treeIndex].status
      this.headers.buttons.forEach((item) => {
        // 根据状态来判断按钮显示状态 0 == 未开始， 1 == 进行中 , 2 == 暂停
        if (this.isButtonNotShow[status].indexOf(item.type) !== -1) {
          item.isHidden = true
        } else {
          item.isHidden = false
        }
        // 判断当前用户是否有该按钮的权限，如果没有直接
        if (item.disabled === false) {
          // 判断是否禁用
          if (this.isDisabled) {
            if (item.type === 'Start' || item.type === 'Move') {
              item.disabled = true
            }
          } else {
            if (item.type === 'Start') {
              item.disabled = !this._checkPermission('/MODULE-COLLECT/collectTasks/start', 'GET')
            } else if (item.type === 'Move') {
              item.disabled = !this._checkPermission('/collect/consumeByIds', 'POST')
            }
          }
        } else {
          // 判断是否禁用
          if (this.isDisabled) {
            if (item.type === 'Start' || item.type === 'Move') {
              item.disabled = true
            }
          } else {
            if (item.type === 'Start') {
              item.disabled = !this._checkPermission('/MODULE-COLLECT/collectTasks/start', 'GET')
            } else if (item.type === 'Move') {
              item.disabled = !this._checkPermission('/collect/consumeByIds', 'POST')
            }
          }
        }
      })
    },
    // 数据切换
    handleSizeChange (item) {
      this.collectSize = item
      this.getCollectDetail(this.collectList[this.treeIndex].id, this.treeIndex)
    },
    // 分页
    handleCurrentChange (item) {
      this.collectPage = item
      this.getCollectDetail(this.collectList[this.treeIndex].id, this.treeIndex)
    },
    // 勾选
    handleSelectionChange (item) {
      this.collectIds = item.map((obj) => {
        return obj.id
      })
    },
    // 手动移库
    fetchCollectConsume () {
      if (this.collectIds.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选需要移动的数据！'
        })
        return false
      }
      this.loading = true
      this.getAppIDOrModel(() => {
        this.isPowerChannels(() => {
          if (!this.isDisabled) {
            this.$request.fetchCollectConsumeByIds({
              'identity': this.identity,
              'appId': this.CMSData.appId,
              'taskId': this.collectList[this.treeIndex].id,
              'ids': this.collectIds
            }).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '移库成功',
                  onClose: () => {
                    this.loading = false
                    this.getCollectDetail(this.collectList[this.treeIndex].id, this.treeIndex)
                  }
                })
              }
            })
          } else {
            this.loading = false
            this.isAlertShow = true
          }
        })
      })
    },
    // 立即开始
    collectStart () {
      this.loading = true
      this.getAppIDOrModel(() => {
        this.isPowerChannels(() => {
          this.loading = false
          if (!this.isDisabled) {
            this.$request.fetchCollectTasksStart({
              'id': this.collectList[this.treeIndex].id,
              'appId': this.CMSData.appId,
              'identity': this.identity
            }).then(res => {
              if (res.code === 200) {
                this.$routerLink('/interact/collect/detail?collectType=Start&taskId=' + this.collectList[this.treeIndex].id)
              }
            })
          } else {
            this.isAlertShow = true
          }
        })
      })
    }
  }
}

</script>

<style lang="scss">
.interact-collect-index-container{
  height: 100%;
  background-color: #ffffff;
  display: flex;
  position: relative;
  .left-btn{
    margin-top: 10px;
    padding-left: 10px;
    width: 100%;
    box-sizing: border-box;

  }
  .left-btn{
    height: 50px;
  }

  .box-left{
    .el-aside{
      height: 100%;
      overflow: hidden;
      .interact-collect-index-tree{
        border:1px solid rgba(232,232,232,1);
        border-radius:4px;
        height: 100%;
        box-sizing: border-box;
        .interact-collect-index-tree-top{
          height: 57px;
          line-height: 57px;
          border-bottom:1px solid rgba(232,232,232,1);
          padding-left: 10px;
          /deep/ .el-button{
            width: 126px;
            height: 36px;
            padding: 0;
            line-height: 36px;
            font-size:16px;
          }
        }
        .interact-collect-index-tree-list{
          height: 100%;
          display: flex;
          flex-direction: column;
          h2{
            font-size:14px;
            font-weight:normal;
            color:rgba(102,102,102,1);
            line-height: 45px;
            height: 45px;
            padding: 0 10px;
          }
          .interact-collect-index-tree-list-box{
            flex: 1;
            height: calc(100% - 43px);
            overflow-x: hidden;
            overflow-y: overlay;
            padding-bottom: 55px;
            box-sizing: border-box;
          }
          li{
            padding: 0 10px;
            height: 45px;
            font-size:14px;
            font-weight:normal;
            display: flex;
            align-items: center;
            cursor: pointer;
            display: flex;
            .jee-svg-icon{
              width: 20px;
              margin-left: 5px;
              color: #777;
              fill: #777;
            }
            p{
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #666;
            }
            &:hover, &.hover{
              background:rgba(243,243,243,1);
            }
          }
        }
      }
    }
  }
  .box-right{
    margin-left: 30px;
    width: 100%;
    padding-top: 11px;
    .interact-collect-index-empty{
      position: relative;
      width: 100%;
      height: 100%;
      background: url(../../../assets/img/collect-empty.png) 50% 50% no-repeat;
    }
    /deep/ .cell{
      white-space: nowrap;
      padding-right: 80px;
    }
    .interact-collect-index-table{
      th{
        color: #666!important;
      }
    }
  }
  /deep/ .base-header-container .el-button--medium{
    margin-bottom: 10px;
    margin-left: 0;
  }
  /deep/ .is-background{
    padding: 30px 0;
  }
  .interact-collect-alert-box{
    width:332px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(232, 232, 232, 1);
    box-shadow:-1px 1px 15px 0px rgba(157,157,157,0.2);
    border-radius:8px;
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 14px;
    transform: translate(-50%, -50%);
    padding: 15px;
    z-index: 111;
    .interact-collect-alert-box-bg{
      position: relative;
      color:rgba(102,102,102,1);
      h3{
        margin-bottom: 15px;
      }
      .tangchuangguanbi {
        float: right;
        color: #999;
        fill: #999;
        font-size: 12px;
        cursor: pointer;
      }
      .tishixinxi {
        color: #909399;
        font-size: 14px;
        fill: #909399;
        margin-right: 10px;
      }
      p{
        text-align: center;
      }
    }
  }
}
</style>
