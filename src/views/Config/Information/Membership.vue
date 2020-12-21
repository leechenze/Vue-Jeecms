<template>
  <section class="config-message-index-container">
    <!-- hyt-修改 -->
      <base-header
        v-bind="headers"
        @handleLink="handleHeaderLink"
        @handleOperate="handleHeaderOperate"
      />
    <!-- hyt-修改 end -->
    <base-table
      v-bind="list"
      :columns="columns"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleNote="handleNoteData"
      @handleEamil="handleEamilData"
      @handleLetter="handleLetterData"
    >
      <template #openPhone="scope">
        <el-switch
          :disabled="!_checkPermission('/messageTpl', 'PUT')"
          class="phoneSuitch"
          v-model="scope.scope.row.openPhone"
          @change="handleNoteData(scope.scope.row)"
          :active-text="scope.scope.row.openPhone?'开启':'关闭'">
        </el-switch>
        <p v-if="scope.scope.row.tplName">短信模板： {{scope.scope.row.tplName}}</p>
      </template>
    </base-table>
    <!-- 站点列表 -->
    <el-dialog
      title="同步到子站"
      :visible.sync="dialogOperate"
      width="510px"
      :before-close="handleClose">
      <div class="tipShow">
        <div class="tipShow-title"><jee-icon icon-class="caozuoshuoming" /> 温馨提示：</div>
        <div class="tipShow-text"> 同步到子站会将当前站点的消息模板数据同步到所有子站点，并删除子站原有消息模板，请谨慎操作！</div>
      </div>
      <div class="operate">
        <div class="operate-left"><span>* </span>选择站点:</div>
        <div class="operate-right">
          <base-tree
            style="overflow-y: overlay"
            ref="contentTree"
            :showCheckbox="true"
            :check-strictly="true"
            :highlight-current="false"
            v-bind="contentTree"
            v-on="$listeners"
            @check-change="handleCheckKeys">
          </base-tree>
        </div>
      </div>
      <el-dialog
        width="510px"
        :visible.sync="innerVisible"
        :show-close="false"
        :before-close="handInnerClose"
        append-to-body>
        <div class="inner-title">消息模版同步中 </div>
        <el-progress :percentage="number" class="progress-num"></el-progress>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOperate = false">取 消</el-button>
        <el-button type="primary" @click="bandOperateData">同 步</el-button>
      </span>
    </el-dialog>
    <!-- 短信模板弹窗 -->
    <el-dialog
      title="消息模版详情"
      :visible.sync="dialogNote"
      width="553px"
      :before-close="handleNoteClose">

      <div class="note-all">
        <div class="all-left"><span>* </span>短信模版</div>
        <div class="all-right">
          <el-select v-model="noteValue" size="small" @change="bandSelectNoteData" placeholder="请选择">
            <el-option
              v-for="item in noteOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleNoteClose">取消</el-button>
        <el-button type="primary" @click="bandDialogNoteData">保存</el-button>
      </span>
    </el-dialog>
    <!-- 邮件模板弹窗 -->
    <el-dialog
      title="邮件模版详情"
      :visible.sync="dialogEamil"
      width="840px"
      :before-close="handleEamilClose">
      <ul class="eamil-all">
        <li>
          <div class="item-left"><span>*</span> 邮件主题:</div>
          <div class="item-right"><el-input v-model="inputEamil" maxlength="150" size="small" placeholder="请输入邮件主题"></el-input></div>
        </li>
        <li>
          <div  class="item-left"><span>*</span> 邮件正文:</div>
          <div class="item-right"><el-input v-model="inputText" maxlength="150" type="textarea" placeholder="请输入邮件正文"></el-input></div>
        </li>
        <li>
          <div class="item-left"> 提示信息:</div>
          <div class="item-right"><el-input v-model="inputTip" maxlength="300" type="textarea"  placeholder="新建后，提示信息显示在邮件正文下方 "></el-input></div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEamilClose">取消</el-button>
        <el-button type="primary" @click="bandTempalteData">保存</el-button>
      </span>
    </el-dialog>
    <!-- 站内信板弹窗 -->
    <el-dialog
      title="站内信模版详情"
      :visible.sync="dialogLetter"
      width="840px"
      :before-close="handleLetterClose">
      <ul class="eamil-all">
        <li>
          <div class="item-left"><span>*</span> 标题:</div>
          <div class="item-right"><el-input v-model="letterEamil" maxlength="150" size="small" placeholder="请输入站内信标题"></el-input></div>
        </li>
        <li>
          <div  class="item-left"><span>*</span> 内容:</div>
          <div class="item-right"><el-input maxlength="150" v-model="letterText" type="textarea" placeholder="请输入站内信内容"></el-input></div>
        </li>
        <li>
          <div class="item-left"> 提示消息:</div>
          <div class="item-right"><el-input maxlength="300" v-model="letterTip" type="textarea"  placeholder="新建后，提示信息显示在站内信内容下方 "></el-input></div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleLetterClose">取消</el-button>
        <el-button type="primary" @click="bandLetterData">保存</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import baseTree from '@/components/mixins/baseTree'
// import formDialog from '@/components/mixins/formDialog'

export default {
  name: 'membership',
  mixins: [baseHeader, baseTable, baseTree],
  props: {
    tabName: {
      type: String,
      default: '1'
    }
  },
  data () {
    return {
      heaserIndex: '0',
      urlApi: 'fetchMessageTplPage',
      contentTree: {
        data: [{
          name: '全部子站',
          id: 'all',
          children: []
        }],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        currentNodeKey: '',
        expandOnClickNode: true
      },
      syncIds: [],
      paramsData: {
        id: '',
        mesType: 1,
        open: '',
        tplDetails: {
        }
      },
      innerVisible: false,
      dialogOperate: false,
      dialogNote: false, // 短信弹窗
      dialogEamil: false, // 邮件弹窗
      dialogLetter: false,
      inputEamil: '', // 保存邮件主题值
      inputText: '', // 保存邮件正文的值
      inputTip: '', // 保存提示消息的值
      noteValue: '',
      dataItem: {},
      noteOptions: [
        {
          value: '1',
          label: '短信模板一'
        },
        {
          value: '2',
          label: '短信模板二'
        }

      ],
      number: 0,
      headers: {
        buttons: [
          {
            type: 'Operate',
            text: '同步到子站',
            icon: 'tongbu',
            disabled: !this._checkPermission('/messageTpl/synch/child/site/tpl', 'POST'),
            isHidden: false,
            params: {
              type: 'add',
              status: this.tabName === '1' ? 'member' : 'user'
            }
          },
          {
            type: 'Link',
            text: '新建',
            icon: 'xinjian',
            href: '/config/information/detail',
            disabled: !this._checkPermission('/messageTpl', 'POST'),
            isHidden: this.$env !== 'dev',
            params: {
              type: 'add',
              status: this.tabName === '1' ? 'member' : 'user'
            }
          }
        ],
        title: '',
        showAlertIcon: false,
        content: '操作说明'
      },
      list: {
        api: '',
        params: {
          tplType: 1
        }
      },
      isAll: true,
      letterEamil: '',
      letterText: '',
      letterTip: ''
    }
  },
  computed: {
    columns () {
      return [
        {
          prop: 'id',
          label: '序号',
          width: '65px'
        },
        {
          prop: 'mesTitle',
          label: '模板名称',
          scopeType: 'link',
          href: '/config/information/detail',
          showOverflowTooltip: true,
          params: {
            status: this.tabName === '1' ? 'member' : 'user'
          }
          // width: '325px'
        },
        {
          prop: 'mesCode',
          label: '模板标识'
        },
        {
          prop: 'remark',
          label: '模板描述',
          showOverflowTooltip: true
        },
        {
          prop: 'openPhone',
          type: 'Note',
          label: '短信',
          scopeType: 'slot',
          disabled: !this._checkPermission('/messageTpl', 'PUT')
        },
        {
          prop: 'openMail',
          type: 'Eamil',
          disableText: '关闭',
          enableText: '开启',
          scopeType: 'switch',
          label: '邮件',
          showOverflowTooltip: true,
          disabled: !this._checkPermission('/messageTpl', 'PUT')
        }
      ]
    }
  },
  watch: {
    tabName (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.initData()
      }
    }
  },
  methods: {
    initData () {
      // 初始化
      this.list.params.tplType = Number(this.tabName)
      this.headers.buttons[0].params.status = this.headers.buttons[1].params.status = (Number(this.tabName) === 1 ? 'member' : 'user')
      this.list.api = this.urlApi
      this.fetchTableApi()
    },
    async getBtnStatus () {
      let res = await this.$request.fetchMessageSynchButData()
      this.headers.buttons[0].isHidden = !res.data
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    // 外部弹窗关闭事件
    handleClose () {
      this.dialogOperate = false
    },
    // 选择复选框选中
    handleCheckKeys (item, newData, oldData) {
      let obj = {}
      let a = []
      let nodes = [item]
      if (item.name === '全部子站') {
        if (newData) {
          const loop = function (data) {
            if (data instanceof Array) {
              data.forEach(v => {
                a.push({ siteName: v.name, siteId: v.id })
                nodes.push(v)
                if (v.children) {
                  loop(v.children)
                }
              })
            }
          }
          loop(item.children)
          // getCheckedKeys()
          this.syncIds = a
          this.$refs.contentTree.$refs.tree.setCheckedNodes(nodes)
        } else {
          if (this.isAll) {
            this.syncIds = []
            this.$refs.contentTree.$refs.tree.setCheckedNodes([])
          }
        }
        this.isAll = true
      } else {
        if (newData) {
          let b = this.syncIds.find(v => item.id === v.siteId)
          if (!b) {
            obj.siteId = item.id
            obj.siteName = item.name
            this.syncIds.push(obj)
          }
          this.isAll = true
        } else {
          // this.$refs.contentTree.$refs.tree.setCheckedNodes([])
          this.$refs.contentTree.$refs.tree.setChecked('all', false)
          for (let i in this.syncIds) {
            if (this.syncIds[i].siteId === item.id) {
              this.syncIds.splice(i, 1)
            }
          }
          this.isAll = false
        }
      }
    },
    // 点击同步弹窗
    bandOperateData () {
      let childSiteList = this.syncIds
      if (childSiteList.length === 0) {
        this.$message({
          message: '请选择子站点',
          type: 'warning'
        })
        return
      }
      this.dialogOperate = false
      this.innerVisible = true
      this.number = 1
      let num = 1
      // 使用定时器是读条在加载%   fetchMessaggetSynchChild
      var time = setInterval(() => {
        num++
        this.number = num
        if (num === 99) {
          clearInterval(time)
        } else if (num === 100) {
        }
      }, 500)
      this.$request.fetchMessaggetSynchChild({ childSiteList: childSiteList }).then(res => {
        if (res.code === 200) {
          num = 100
          this.innerVisible = false
          clearInterval(time)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.innerVisible = false
          clearInterval(time)
          // this.$message.error('同步失败!')
        }
      })
    },
    handSynchChild () {
    },
    // 内部弹窗关闭点击事件
    handInnerClose (data) {
    },
    // 短信弹窗
    handleNoteData (data) {
      this.paramsData.id = data.id
      this.paramsData.mesType = 3
      this.dataItem = data
      this.paramsData.tplDetails = {
        extendedField: data.detailsMap.phone.extendedField,
        mesContent: data.detailsMap.phone.mesContent,
        mesTitle: data.detailsMap.phone.mesTitle,
        tplId: data.detailsMap.phone.tplId,
        tplName: data.detailsMap.phone.tplName
      }
      if (data.openPhone) {
        this.$request.fetchMessaggetHaveNumber().then(res => {
          if (res.data === false) {
            this.$confirm('你的网站未购买短信服务或短信服务余量为0, 请购买后再开启短信模板', '提示', {
              confirmButtonText: '去购买',
              cancelButtonText: '稍后购买',
              type: 'warning'
            }).then(() => {
              this.$routerLink('/service/index')
            }).catch(() => {
              this.dialogNote = false
              this.paramsData.open = false
              this.reshData(this.paramsData)
            })
          } else {
            if (!data.detailsMap.phone.tplId) {
              this.dialogNote = true
              this.getLogList()
            } else if (data.detailsMap.phone.tplId) {
              this.paramsData.open = true
              this.reshData(this.paramsData)
            } else {
              this.paramsData.open = false
              this.reshData(this.paramsData)
            }
          }
        })
      } else {
        this.paramsData.open = false
        this.reshData(this.paramsData)
      }
    },
    reshData (data) {
      this.$request.fetchMessageDetailsStatus(data).then(res => {
        this.fetchTableApi()
      })
    },
    getLogList () {
      this.$request.fetchMessageTplPhoneListPage().then(res => {
        this.noteOptions = res.data
      })
    },
    // 保存短信修改
    bandDialogNoteData () {
      if (!this.noteValue) {
        this.$message({
          message: '请选择短信模板',
          type: 'warning'
        })
        return
      }
      for (let i in this.noteOptions) {
        if (this.noteValue === this.noteOptions[i].id) {
          this.paramsData.tplDetails.tplName = this.noteOptions[i].name
        }
      }
      this.paramsData.id = this.dataItem.id
      this.paramsData.mesType = 3
      this.paramsData.open = true
      this.paramsData.tplDetails.tplId = this.noteValue
      this.$request.fetchMessageDetailsStatus(this.paramsData).then(res => {
        if (res.code === 200) {
          this.dialogNote = false
          this.fetchTableApi()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      })
    },
    // 短信关闭弹窗
    handleNoteClose () {
      this.dialogNote = false
      if (this.dialogNote === false) {
        this.dataItem.note = false
        this.fetchTableApi()
      }
    },
    // 短信选择事件
    bandSelectNoteData (data) {
    },
    // 邮件弹窗
    handleEamilData (data) {
      this.inputEamil = ''
      this.inputText = ''
      this.inputTip = ''
      this.paramsData.id = data.id
      this.paramsData.mesType = 2
      this.dataItem = data
      this.paramsData.tplDetails = {
        extendedField: data.detailsMap.mail.extendedField,
        mesContent: data.detailsMap.mail.mesContent,
        mesTitle: data.detailsMap.mail.mesTitle,
        tplId: data.detailsMap.mail.tplId,
        tplName: data.detailsMap.mail.tplName
      }
      if (data.openMail) {
        if (!data.detailsMap.mail.mesContent && !data.detailsMap.mail.mesTitle) {
          this.dialogEamil = true
        } else if (data.detailsMap.phone.mesContent || data.detailsMap.phone.mesTitle) {
          this.paramsData.open = true
          this.$request.fetchMessageDetailsStatus(this.paramsData).then(res => {
            if (res.code === 200) {
              this.fetchTableApi()
            }
          })
        } else {
          data.openMail = false
          this.paramsData.open = true
          this.$request.fetchMessageDetailsStatus(this.paramsData).then(res => {
            if (res.code === 200) {
              this.fetchTableApi()
            }
          })
        }
      } else {
        this.paramsData.open = false
        this.$request.fetchMessageDetailsStatus(this.paramsData).then(res => {
          if (res.code === 200) {
            this.fetchTableApi()
          }
        })
      }
    },
    // 邮件保存
    bandTempalteData () {
      this.paramsData.id = this.dataItem.id
      this.paramsData.mesType = 2
      this.paramsData.open = true
      this.paramsData.tplDetails.mesTitle = this.inputEamil
      this.paramsData.tplDetails.mesContent = this.inputText
      this.paramsData.tplDetails.extendedField = this.inputTip
      if (!this.inputEamil) {
        this.$message({
          message: '邮件主题不能为空!',
          type: 'warning'
        })
        return
      } else if (!this.inputText) {
        this.$message({
          message: '邮件正文不能为空!',
          type: 'warning'
        })
        return
      }
      this.$request.fetchMessageDetailsStatus(this.paramsData).then(res => {
        if (res.code === 200) {
          this.dialogEamil = false
          this.fetchTableApi()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      })
    },
    // 邮件取消
    handleEamilClose () {
      this.dialogEamil = false
      if (this.dialogNote === false) {
        this.dataItem.eamil = false
        this.fetchTableApi()
      }
    },
    // 点击同步到子站
    handleHeaderOperate (item) {
      this.dialogOperate = true
      this.$request.fetchMessaggetAllTree().then(res => {
        if (res.code === 200) {
          this.contentTree.data[0].children = res.data
        }
      })
    },
    // 站内信弹窗-取消
    handleLetterClose () {
      this.dialogLetter = false
      this.fetchTableApi()
    },
    // 站内信
    handleLetterData (data) {
      this.letterEamil = ''
      this.letterText = ''
      this.letterTip = ''
      this.paramsData.id = data.id
      this.paramsData.mesType = 1
      this.dataItem = data
      this.paramsData.tplDetails = {
        extendedField: data.detailsMap.letter.extendedField,
        mesContent: data.detailsMap.letter.mesContent,
        mesTitle: data.detailsMap.letter.mesTitle,
        tplId: data.detailsMap.letter.tplId,
        tplName: data.detailsMap.letter.tplName
      }
      if (data.openLetter) {
        if (!data.detailsMap.letter.mesContent && !data.detailsMap.letter.mesTitle) {
          this.dialogLetter = true
        } else if (data.detailsMap.letter.mesContent || data.detailsMap.letter.mesTitle) {
          data.dialogLetter = true
          this.paramsData.open = true
          this.$request.fetchMessageDetailsStatus(this.paramsData).then(res => {
            if (res.code === 200) {
              this.fetchTableApi()
            }
          })
        } else {
          this.paramsData.open = false
          this.$request.fetchMessageDetailsStatus(this.paramsData).then(res => {
            if (res.code === 200) {
              this.fetchTableApi()
            }
          })
        }
      } else {
        this.paramsData.open = false
        this.$request.fetchMessageDetailsStatus(this.paramsData).then(res => {
          this.fetchTableApi()
        })
      }
    },
    // 站内信弹窗-保存
    bandLetterData () {
      this.paramsData.id = this.dataItem.id
      this.paramsData.mesType = 1
      this.paramsData.open = true
      this.paramsData.tplDetails.mesTitle = this.letterEamil
      this.paramsData.tplDetails.mesContent = this.letterText
      this.paramsData.tplDetails.extendedField = this.letterTip
      if (!this.letterEamil) {
        this.$message({
          message: '标题不能为空!',
          type: 'warning'
        })
        return
      } else if (!this.letterText) {
        this.$message({
          message: '内容不能为空!',
          type: 'warning'
        })
        return
      }
      this.$request.fetchMessageDetailsStatus(this.paramsData).then(res => {
        if (res.code === 200) {
          this.dialogLetter = false
          this.fetchTableApi()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      })
    }
  },
  activated () {
    this.initData()
    this.getBtnStatus()
  },
  mounted () {
    this.$nextTick(() => {
      this.initData()
      this.getBtnStatus()
    })
  }
}
</script>

<style lang="scss">
.config-message-index-container{
  .phoneSuitch{
    width: 100% !important;
  }
  .operate{
    display: flex;
    margin-top: 20px;
    .operate-left{
      span{
        color: #FF0000;
        font-size: 14px;
      }
    }
    .operate-right{
      width: 350px;
      height: 246px;
      overflow-y: scroll;
      margin-left: 20px;
      padding: 10px 0;
      border: 1px solid #E8E8E8;
    }
  }
  .tipShow{
    background: #FDF6EC;
    color: #FF9300;
    padding: 15px 20px;
    font-size: 12px;
    .tipShow-title{
      padding-bottom: 15px;
    }
    .jee-svg-icon{
      fill: #FF9300;
      font-size: 16px;
      margin-right: 9px;
    }
    .tipShow-text{
      line-height: 20px;
    }
  }
  .inner-title{
    text-align: center;
    font-size: 14px;
    margin-bottom: 30px;
    margin-top: 10px;
  }
  .progress-num{
    margin-bottom: 40px;
  }
  .note-all{
    display: flex;
    width: 80%;
    margin: auto;
    align-items: center;
    font-size: 14px;
    .all-left{

      span{
        color: #FF0000;
      }
    }
    .all-right{
      width: 300px;
      margin-left: 20px;
      .el-select{
        width: 100%;
        .el-input{
          .el-input__inner{
            height: 30px !important;
            line-height: 30px !important;
          }

        }
      }
    }
  }
  .eamil-all{
    margin-left: 20px;
    li:first-child{
      margin-top: 0px;
    }
    li{
      display: flex;
      margin-top: 20px;
      .item-left{
        // flex: 1;
        line-height: 32px;
        span{
          color: #FF0000;
        }
      }
      .item-right{
        flex: 8;
        margin-left: 20px;
        .el-textarea{
          height: 200px;
          .el-textarea__inner{
            height: 100% !important;
          }
        }
      }
    }
  }
}
</style>
