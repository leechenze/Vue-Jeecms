<template>
  <section class="workflow-detail-container" :class="{'isFullscreen': isFullscreen}">
    <el-container v-loading="loading">
      <el-header height="auto">
        <flow-header
          :screenFullElement="screenFullElement"
          :isDetail="isDetail"
          @handleCheck="handleCheck"
          @handleSave="handleSave"
          @handleChangeScreenFull='handleChangeScreenFull'
        ></flow-header>
        <el-form class="header-form"
          ref="form"
          :inline="true"
          v-loading="loading"
          :model="form"
          :rules="rules"
        >
          <el-form-item
            prop='name'
          >
            <el-input v-model="form.name" placeholder="请输入工作流名称" style="maxWidth:200px;" :maxlength="75"></el-input>
          </el-form-item>
          <el-form-item
            prop='flowCate'
            label="应用场景："
          >
            <el-select v-model="form.flowCate" placeholder="请选择场景"
              popper-class="jee-border"
              style="maxWidth:140px">
              <el-option
                v-for="option in caseOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop='autoPublish'
          >
            <el-checkbox v-model="form.autoPublish">终审后自动发布</el-checkbox>
            <jee-popover popoverText="若不设置自动发布，内容审核后为已审核状态" popoverWidth="260" style="padding-left:20px"/>
          </el-form-item>
          <el-form-item
            prop='remark'
            label='备注：'
            class="remark"
          >
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注文字" :maxlength="160"></el-input>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <div class="drag-wrap">
          <div class="title">
            <span>流程图形</span>
          </div>
          <div id="begin" title="开始" @dragstart="nodeDragStart" class="flow-node" draggable>
            <div class="begin"></div>
            <div class="text" draggable="false">开始</div>
          </div>
          <div id="audit" title="审核" @dragstart="nodeDragStart" class="flow-node" draggable>
            <div class="audit"></div>
            <div class="text" draggable="false">审核</div>
          </div>
          <div id="end" title="结束" @dragstart="nodeDragStart" class="flow-node" draggable>
            <div class="end"></div>
            <div class="text" draggable="false">结束</div>
          </div>
          <div class="title">
            <span>连线类型</span>
          </div>
          <div id="line" title="直线" @click="addEdgeLine" class="flow-node flow-node-line" :class="{active: mode === 'line'}">
            <div class="line">
              <div class="spoint"></div>
              <div class="epoint"></div>
            </div>
            <div class="text" draggable="false">直线</div>
          </div>
          <div id="polyline" title="折线" @click="addEdgePolyLine" class="flow-node flow-node-line" :class="{active: mode === 'polyline'}">
            <div class="polyline">
              <div class="line-top"></div>
              <div class="line-bottom"></div>
              <div class="spoint"></div>
              <div class="epoint"></div>
            </div>
            <div class="text" draggable="false">折线</div>
          </div>
          <div class="workflow-rule-wrap">
            <el-popover
              placement="top-start"
              trigger="hover"
              width="486px"
              :appendToBody="false"
              >
              <div class='workflow-rule-content'>
                1、必须要有开始节点和结束节点，且只能存在一个开始或结束节点；<br/>
                2、开始节点只能连接审核节点且只能连一个；<br/>
                3、结束节点不能有连线出口；<br/>
                4、整个流程必须闭合（有从开始到结束完整的连线）且不存在孤立节点；<br/>
                5、同一审核节点出来的连线中不能存在相同的动作类型的连线；<br/>
                6、自定义的动作类型不能连接开始和结束节点；"<br/>
              </div>
              <div slot="reference" class='rule-info-wrap'>
                <div class="jee-border">
                  <span>规则<br/>说明</span>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
        <div class="flow-wrap scrollbar">
          <div id="mountNode" @drop="toElementDrop" @dragover="onDragOver" ></div>
        </div>
        <div class="config-wrap scrollbar">
          <div class="title">基本配置</div>
          <component :is="getSettingComponent" v-if="getSettingComponent" ref="setting" v-bind="currentNode" :hiddenAllowRevoke="hiddenAllowRevoke" :actions="actions" :key="currentNode.id"></component>
        </div>
      </el-main>
    </el-container>
    <check-dialog
      ref="checkDialog"
      :messages="messages"
      :tooltips='tooltips'
    />
    <ul id="contextMenu">
      <li @click="handleChangeLine" v-if="['line', 'beginline'].includes(selectItemId.nodeType)">切换</li>
      <li @click="handleDelete">删除</li>
    </ul>
  </section>
</template>
<script>
import g6 from '@/components/plugin/G6/g6'
import FlowHeader from './FlowHeader'
import BeginNodeSetting from './BeginNodeSetting'
import EndNodeSetting from './EndNodeSetting'
import AuditNodeSetting from './AuditNodeSetting'
import ActionSetting from './ActionSetting'
import BeginActionSetting from './BeginActionSetting'
import CheckDialog from './CheckDialog'
import { randomWord } from '@/utils'
import {
  mapActions
} from 'vuex'

export default {
  name: 'configWorkflowDetail',
  mixins: [g6],
  inject: ['removeTab'],
  components: {
    FlowHeader,
    BeginNodeSetting,
    EndNodeSetting,
    AuditNodeSetting,
    ActionSetting,
    BeginActionSetting,
    CheckDialog
  },
  data () {
    var name = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('此项必填'))
      } else {
        var params = {
          name: value,
          id: this.form.id || ''
        }
        this.$request.fetchFlowUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('工作流名称重复'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    var dragImg = new Image()
    dragImg.src = 'dragimage.png'
    return {
      dragImg,
      screenFullElement: '.workflow-detail-container',
      loading: false,
      isFullscreen: false,
      form: {
        id: '',
        name: '',
        flowCate: 1,
        autoPublish: false,
        remark: ''
      },
      rules: {
        name: [
          { validator: name, trigger: 'blur' }
        ]
      },
      caseOptions: [
        {
          value: 1,
          label: '内容'
        },
        {
          value: 2,
          label: '投票调查'
        }
      ],
      currentNode: {}, // 当前节点或线的数据
      hiddenAllowRevoke: false, // 线的允许撤回功能
      actions: [], // 线的源节点已有的动作类型
      messages: [],
      tooltips: []
    }
  },
  computed: {
    isDetail () {
      return true
    },
    getSettingComponent () {
      switch (this.currentNode.nodeType) {
        case 'begin':
          return 'BeginNodeSetting'
        case 'end':
          return 'EndNodeSetting'
        case 'audit':
          return 'AuditNodeSetting'
        case 'beginline':
          return 'BeginActionSetting'
        case 'line':
          return 'ActionSetting'
        default:
          return ''
      }
    }
  },
  watch: {
    // 同步名称
    'currentNode.form.name' (newData, oldData) {
      // 当前配置面板修改数据，更新对应的节点model
      const id = this.currentNode.id
      if (id && typeof oldData !== 'undefined') {
        const node = this.graph.findById(id)
        if (node) {
          this.graph.updateItem(node, {
            label: newData
          })
        }
      }
    }
  },
  methods: {
    /* workflow-plugin start */
    ...mapActions('config', ['FetchWorkFlowOptions']),
    /* workflow-plugin end */
    handleChangeScreenFull (isFullscreen) {
      this.isFullscreen = isFullscreen
    },
    checkNodeType (nodeType) {
      return this.nodeTypes.includes(nodeType)
    },
    // 开始拖拽图形
    nodeDragStart (ev) {
      this.mode = 'default'
      ev.dataTransfer.setData('nodeType', ev.target.id)
      ev.dataTransfer.setData('targetTitle', ev.target.title)
      ev.dataTransfer.setDragImage(this.dragImg, 80, 40)
    },
    // 放下拖拽图形
    toElementDrop (ev) {
      ev.preventDefault()
      const nodeType = ev.dataTransfer.getData('nodeType')
      if (!this.checkNodeType(nodeType)) return false
      if (!this.checkFlowData(nodeType)) return false
      if (!this.checkSettingForm()) return false
      const shape = nodeType + 'Node'
      const id = randomWord(false, 4)
      const title = ev.dataTransfer.getData('targetTitle')
      let form = this.getDefaultForm(nodeType)
      form.id = id
      form.name = title
      const point = this.graph.getPointByClient(ev.clientX, ev.clientY)
      this.graph.addItem('node', {
        id,
        label: title,
        nodeType,
        x: point.x,
        y: point.y,
        shape,
        form
      })
      const node = this.graph.findById(id)
      if (node) {
        this.currentNode = node.getModel()
      }
      return false
    },
    // 拖拽图形hover时
    onDragOver (ev) {
      ev.preventDefault()
    },
    // 点击直线
    addEdgeLine () {
      this.mode = this.mode === 'line' ? 'default' : 'line'
    },
    // 点击折线
    addEdgePolyLine () {
      this.mode = this.mode === 'polyline' ? 'default' : 'polyline'
    },
    // 右键删除节点或线
    handleDelete () {
      if (this.selectItemId.id) {
        const item = this.graph.findById(this.selectItemId.id)
        if (item) {
          this.graph.removeItem(item)
          this.currentNode = {}
          this.selectItemId = {}
          this.graph.refresh()
        }
      }
      const menu = document.getElementById('contextMenu')
      menu.style.left = '-100px'
    },
    // 右键切换线
    handleChangeLine () {
      if (this.selectItemId.id) {
        const item = this.graph.findById(this.selectItemId.id)
        if (item) {
          const model = item.getModel()
          if (['line', 'beginline'].includes(model.nodeType)) {
            this.graph.updateItem(item, {
              shape: model.shape === 'edge' ? 'polyEdge' : 'edge'
            })
          }
        }
      }
      const menu = document.getElementById('contextMenu')
      menu.style.left = '-100px'
    },
    // 生成默认表单
    getDefaultForm (nodeType) {
      switch (nodeType) {
        case 'audit':
          return {
            id: '',
            name: '',
            jointlySign: false,
            jointlyType: 1,
            jointlyPassRatio: 50,
            orgIds: [],
            orgOptions: [],
            roleIds: [],
            roleOptions: [],
            userIds: [],
            userOptions: [],
            actions: [
              {
                name: '通过',
                code: 'agree',
                hiddenDelete: true
              },
              {
                name: '不通过',
                code: 'disagree',
                hiddenDelete: true
              }
            ]
          }
        case 'beginline':
          return {
            id: '',
            name: '',
            allowRevoke: true,
            infoNotify: true,
            mailNotify: false,
            smsNotify: false
          }
        case 'line':
          return {
            id: '',
            name: '',
            actionType: '',
            allowRevoke: true,
            infoNotify: true,
            mailNotify: false,
            smsNotify: false,
            autoRevoke: false,
            autoRevokeHour: 10,
            overtimeReminder: false,
            reminderBegin: 10,
            reminderInterval: 10,
            actionOptions: [
              {
                value: 'agree',
                label: '通过'
              },
              {
                value: 'disagree',
                label: '不通过'
              }
            ]
          }
        default:
          return {
            id: '',
            name: ''
          }
      }
    },
    // 检查当前配置表单
    checkSettingForm () {
      let result = true
      try {
        this.$refs.setting.$refs.form.$refs.form.validate(valid => {
          if (!valid) {
            this.$message('请检查基本配置是否填写正确')
            result = false
          }
        })
      } catch (error) {}
      return result
    },
    // 提交前检查，必须包含开始、结束
    checkBeforeSubmit () {
      const begin = this.graph.find('node', node => {
        return node.get('model').nodeType === 'begin'
      })
      if (!begin) {
        this.$message('必须要有开始节点')
        return false
      } else {
        if (!begin.getOutEdges().length) {
          this.$message('开始节点必须要有出线')
          return false
        }
      }
      const end = this.graph.find('node', node => {
        return node.get('model').nodeType === 'end'
      })
      if (!end) {
        this.$message('必须要有结束节点')
        return false
      } else {
        if (!end.getInEdges().length) {
          this.$message('结束节点必须要有入线')
          return false
        }
      }
      const audit = this.graph.find('node', node => {
        return node.get('model').nodeType === 'audit'
      })
      if (!audit) {
        this.$message('必须要有审核节点')
        return false
      }
      return true
    },
    // 检查添加图形
    checkFlowData (nodeType) {
      if (['begin', 'end'].includes(nodeType)) {
        const findNode = this.graph.find('node', node => {
          return !node.destroyed && node.get('model').nodeType === nodeType
        })
        if (findNode) {
          this.$message(nodeType === 'begin' ? '只能添加一个开始节点' : '只能添加一个结束节点')
          return false
        }
      }
      return true
    },
    // 检查线入口
    checkFlowEdgeIn (node) {
      const model = node.getModel()
      const source = this.edge.getSource().getModel()
      if (model.id === source.id) {
        // 自环时 删除线
        this.$message('不能连接节点本身')
        return false
      }
      if (source.nodeType === 'begin' && model.nodeType !== 'audit') {
        this.$message('开始节点只能连接审核节点')
        return false
      }
      let result = true
      node.getInEdges().forEach(edge => {
        if (!edge.destroyed && edge.getSource().getModel().id === source.id) {
          this.$message('节点之间已经存在连线')
          result = false
        }
      })
      return result
    },
    // 检查线出口
    checkFlowEdgeOut (node) {
      const model = node.getModel()
      if (model.nodeType === 'end') {
        this.$message('结束节点不能有连线出口')
        return false
      }
      if (model.nodeType === 'begin') {
        let hasBeginEdge = false
        node.getEdges().forEach(edge => {
          if (edge.getSource().getModel().nodeType === 'begin') {
            hasBeginEdge = true
          }
        })
        if (hasBeginEdge) {
          this.$message('开始节点只能有一条连接出口')
          return false
        }
      }
      return true
    },
    // 检查边配置
    checkFlowEdgeConfig (edge) {
      const that = this
      const model = edge.getModel()
      const sourceNode = edge.getSource().getModel()
      if (typeof model.target === 'string') {
        const targetNode = edge.getTarget().getModel()
        // 指向开始结束点的连线不能设撤回
        that.hiddenAllowRevoke = ['begin', 'end'].includes(targetNode.nodeType)
      }
      // 同一审核节点不能有同样的动作
      if (sourceNode.nodeType === 'audit') {
        let actions = []
        edge.getSource().getOutEdges().forEach(edge => {
          if (!edge.destroyed && edge.getModel().id !== model.id) {
            actions.push(edge.getModel().form.actionCode)
          }
        })
        that.actions = actions
      }
      // 同步来源节点的动作下拉数据
      const actions = sourceNode.form.actions
      if (actions instanceof Array && actions.length) {
        that.currentNode.form.actionOptions = actions.map(d => {
          return {
            value: d.code,
            label: d.name
          }
        })
      }
    },
    // 详情
    fetchFlowDetail () {
      if (this.form.id) {
        this.$request.fetchFlowDetail(this.form.id).then(res => {
          if (res.code === 200) {
            this.form = res.data.flow
            this.graph.changeData({
              nodes: res.data.nodes,
              edges: res.data.edges.map(d => {
                if (d.targetAnchor === null) delete d.targetAnchor
                if (d.sourceAnchor === null) delete d.sourceAnchor
                return d
              })
            })
          }
        })
      }
    },
    // 获取要提交的数据
    getFlowData () {
      let flowData = this.graph.save()
      if (flowData.edges && flowData.edges.length) {
        flowData.edges.map(d => {
          if ('error' in d) delete d.error
          if ('errors' in d) delete d.errors
          return d
        })
      }
      if (flowData.nodes && flowData.nodes.length) {
        flowData.nodes.map(d => {
          if ('error' in d) delete d.error
          if ('errors' in d) delete d.errors
          if (d.form && d.form.orgOptions instanceof Array && d.form.orgOptions.length) {
            d.form.orgOptions = d.form.orgOptions.filter(o => d.form.orgIds.includes(o.value))
          }
          if (d.form && d.form.roleOptions instanceof Array && d.form.roleOptions.length) {
            d.form.roleOptions = d.form.roleOptions.filter(o => d.form.roleIds.includes(o.value))
          }
          if (d.form && d.form.userOptions instanceof Array && d.form.userOptions.length) {
            d.form.userOptions = d.form.userOptions.filter(o => d.form.userIds.includes(o.value))
          }
          return d
        })
      }
      return flowData
    },
    // 检查
    handleCheck () {
      if (!this.checkSettingForm()) return
      if (!this.checkBeforeSubmit()) return
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let data = Object.assign({}, { flow: this.form }, this.getFlowData())
          this.$request.fetchFlowCheck(data).then(res => {
            if (res.code === 200) {
              // 有错误
              this.messages = res.data.errors
              this.tooltips = res.data.tips
              this.$refs.checkDialog.showDialog(this.messages.length ? 'error' : 'success')
              this.graph.changeData({
                nodes: res.data.nodes.map(d => {
                  d.id = d.idCode
                  return d
                }),
                edges: res.data.edges.map(d => {
                  d.id = d.idCode
                  return d
                })
              })
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 保存
    handleSave () {
      if (!this.checkSettingForm()) return
      if (!this.checkBeforeSubmit()) return
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let data = Object.assign({}, { flow: this.form }, this.getFlowData())
          const api = this.form.id ? 'fetchFlowUpdate' : 'fetchFlowCreate'
          this.$request[api](data).then(res => {
            if (res.code === 200) {
              this._messageSuccess(this.form.id ? 'save' : 'create')
              /* workflow-plugin start */
              this.FetchWorkFlowOptions(true)
              /* workflow-plugin end */
              this.fetchFlowDetail()
              this.currentNode = {}
              this.removeTab(this.$route.fullPath)
              this.$routerLink('/config/workflow/index', 'list')
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.form.id = id
    this.fetchFlowDetail()
    this.initGraph()
    this.registerNode()
    this.registerEdge()
    this.registerBehavior()
    this.listening()
  },
  activated () {
    const { id } = this.$route.query
    if (id && id !== this.form.id) {
      this.form.id = id
      this.fetchFlowDetail()
    }
  }
}
</script>

<style lang="scss">
.workflow-detail-container{
  height: 100%;
  background-color: #ffffff;
  .el-header{
    .header-btn{
      display: flex;
      align-items: center;
    }
    .header-form{
      display: flex;
      align-items: center;
      padding-top: 20px;
      .el-checkbox{
        margin-right: 0;
      }
      .remark{
        flex: 1;
        display: flex;
        margin-right: 0!important;
        .el-form-item__content{
          flex: 1;
          .el-textarea .el-textarea__inner{
            flex: 1;
            min-height: 40px;
            height: 40px;
          }
        }
      }
    }
  }
  .el-main{
    border: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    .drag-wrap{
      width: 127px;
      border-right: 1px solid #e8e8e8;
      position: relative;
      .title{
        font-size: 16px;
        color: #333333;
        // font-weight: bold;
        padding: 30px 20px 15px;
        span{
          display: block;
          line-height: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e8e8e8;
        }
      }
      // 拖拽节点
      .flow-node{
        >div{
          width: 100%;
        }
        border-top: 1px solid #ffffff;
        border-bottom: 1px solid #ffffff;
        cursor: move;
        &:hover,
        &.active{
          background-color: #f9f9f9;
          border-color:#e8e8e8;
        }
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px 20px;
        .text{
          color: #666666;
          font-size: 14px;
          line-height: 14px;
          padding-top: 10px;
          text-align: center;
        }
        .begin,
        .end,
        .audit{
          height: 36px;
          border-radius: 18px;
          border: 2px solid #666666;
        }
        .audit{
          border-radius: 4px;
        }
        .line{
          height: 0;
          border-top: 2px solid #666666;
          position: relative;
          .spoint,
          .epoint{
            position: absolute;
            top: -3px;
            height: 4px;
            width: 4px;
            background-color: #666666;
          }
          .spoint{
            left: 0;
          }
          .epoint{
            right: 0;
          }
        }
        .polyline{
          height: 36;
          position: relative;
          display: flex;
          justify-content: space-between;
          .line-top,
          .line-bottom{
            height: 0;
            width: 50%;
            border-bottom: 2px solid #666666;
          }
          .line-bottom{
            height: 38px;
            border-left: 2px solid #666666;
          }
          .spoint,
          .epoint{
            position: absolute;
            height: 4px;
            width: 4px;
            background-color: #666666;
          }
          .spoint{
            left: 0;
            top: -1px;
          }
          .epoint{
            right: 0;
            bottom: -1px;
          }
        }
        &.flow-node-line{
          cursor: pointer;
        }
      }
      .workflow-rule-wrap{
        position: absolute;
        top: 20px;
        left: 147px;
        z-index: 2;
        .el-popover{
          width: 486px;
        }
      }
      // 规则
      .rule-info-wrap{
        // padding: 0 16px;
        width: 55px;
        .jee-border{
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid;
          margin: 0 auto;
          cursor: pointer;
          span{
            line-height: 16px;
            font-size: 14px;
            color: #666666;
          }
        }
      }
      .workflow-rule-content{
        line-height: 24px;
        font-size: 14px;
        color: #666666;
        padding: 8px;
      }
    }
    .flow-wrap{
      flex: 1;
      overflow: auto;
      position: relative;
      #mountNode{
        z-index: 1;
      }
    }
    .config-wrap{
      width: 381px;
      border-left: 1px solid #e8e8e8;
      padding: 30px 20px;
      overflow-x: hidden;
      overflow-y: overlay;
      .title{
        font-size: 16px;
        line-height: 16px;
        color: #333333;
        // font-weight: bold;
        padding-bottom: 10px;
        margin-bottom: 30px;
        border-bottom: 1px solid #e8e8e8;
      }
      .el-select-dropdown__wrap{
        overflow-x: hidden;
      }
    }
  }
  #contextMenu {
    z-index: 1;
    position: absolute;
    list-style: none;
    padding: 5px 0;
    color: #333333;
    font-size: 16px;
    font-weight: bold;
    left: -100px;
    background: #ffffff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    box-shadow: 0 0 2px 4px rgba(0, 0, 0, 0.01);
  }
  #contextMenu li {
    cursor: pointer;
    padding: 5px 30px;
    &:hover{
      background-color: #f9f9f9;
    }
  }
  .g6-tooltip {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    font-size: 14px;
    color: #666666;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
  .anchor:hover{
    fill: red;
    border: 2px solid green;
  }
  &.isFullscreen{
    padding-bottom: 30px;
    .el-header{
      .header-form{
        padding: 30px 30px 0;
      }
    }
    .el-main{
      margin: 0 30px;
    }
  }
}
</style>
