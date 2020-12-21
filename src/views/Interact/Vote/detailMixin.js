import draggable from 'vuedraggable'
import baseHeader from '@/components/mixins/baseHeader'
// import EditorComponents from '@/components/draggable/Editor/components'
import PreviewComponents from '@/components/draggable/Preview/components'
import voteConfigs from '@/components/draggable/Config/voteConfigs'
import quesSkin from './detailComponents/quesSkin'
import quesConfigs from './detailComponents/quesConfigs'
import { deepClone, randomWord } from '@/utils'
import { mapActions, mapGetters } from 'vuex'

export default {
  mixins: [baseHeader],
  components: {
    draggable,
    quesSkin,
    quesConfigs,
    // ...EditorComponents,
    ...PreviewComponents
  },
  data () {
    return {
      labelWidth: 'auto',
      showPage: true,
      headers: {
        paddingBottom: '10px',
        buttons: [
          {
            text: '撤回',
            type: 'Withdraw',
            icon: 'chehui',
            handleType: 'withdraw',
            isHidden: true,
            disabled: !this._checkPermission('/task/questionnaire/revoke', 'GET')
          },
          {
            type: 'Operate',
            text: '提交审核',
            icon: 'shenhe1',
            handleType: 1,
            isHidden: false,
            disabled: !this._checkPermission('/questionnaire', 'POST')
          },
          {
            type: 'Operate',
            text: '保存',
            icon: 'baocundangqian',
            handleType: 0,
            isHidden: false,
            disabled: !this._checkPermission('/questionnaire', 'POST')
          },
          {
            type: 'Operate',
            text: '发布',
            icon: 'fabu',
            handleType: 3,
            isHidden: false,
            disabled: !this._checkPermission('/questionnaire', 'POST')
          },
          {
            type: 'Operate',
            text: '预览',
            icon: 'yulang',
            handleType: 'preview',
            isHidden: false,
            disabled: !this._checkPermission('/questionnaire', 'GET')
          }
        ],
        showAlertIcon: false
      },
      btnDatas: [{
        text: '撤回',
        type: 'Withdraw',
        icon: 'chehui',
        handleType: 'withdraw',
        isHidden: true,
        disabled: !this._checkPermission('/task/questionnaire/revoke', 'GET')
      },
      {
        type: 'Operate',
        text: '提交审核',
        icon: 'shenhe1',
        handleType: 1,
        isHidden: false,
        disabled: !this._checkPermission('/questionnaire', 'POST')
      },
      {
        type: 'Operate',
        text: '保存',
        icon: 'baocundangqian',
        handleType: 0,
        isHidden: false,
        disabled: !this._checkPermission('/questionnaire', 'POST')
      },
      {
        type: 'Operate',
        text: '发布',
        icon: 'fabu',
        handleType: 3,
        isHidden: false,
        disabled: !this._checkPermission('/questionnaire', 'POST')
      },
      {
        type: 'Operate',
        text: '预览',
        icon: 'yulang',
        handleType: 'preview',
        isHidden: false,
        disabled: !this._checkPermission('/questionnaire', 'GET')
      }],
      voteConfigs,
      voteConfigsFilter: [],
      group: {
        data: [],
        class: 'widget-form-list',
        options: {
          group: {
            name: 'widget',
            pull: 'clone',
            put: false
          },
          sort: false,
          forceFallback: true,
          filter: '.disable',
          ghostClass: 'ghost',
          chosenClass: 'chosen',
          dragClass: 'dragging'
        }
      },
      options2: {
        group: 'widget',
        forceFallback: true,
        ghostClass: 'ghost',
        swapThreshold: 0.5,
        animation: 100
      },
      selectIndex: '',
      selectWg: {},
      updateWg: {},
      formData: this.data || {},
      getBtn: true
    }
  },
  computed: {
    ...mapGetters(['detailData']),
    getVoteConfigs () {
      return this.voteConfigs.filter(d => !this.voteConfigsFilter.includes(d.type)).slice().sort((a, b) => a.groupIndex - b.groupIndex)
    },
    detail () {
      return this.detailData
    }
  },
  watch: {
    data (newVal) {
      this.formData = newVal
      let { id, type } = this.$route.query
      // 判断当前是否是 编辑问卷页签
      // if (id && !(link === 'statistical' || link === 'linkAddress')) {
      if (id && (this.name === 'editQues' || this.name === 'setQues')) {
        this.setDetailData(id, type)
      }
    },
    workFlow (newVal) {
      this.setBtns()
    }
  },
  inject: ['removeTab'],
  methods: {
    deepClone,
    ...mapActions('interact', ['getDetailData']),
    ...mapActions('interact', ['resetDetailData']),
    addDragItem (item, i) {
      let data = this.deepClone(item)
      this.dragAdd(data, this.formList.length)
    },
    handleWidgetAdd (e, tab) {
      const newIndex = e.newIndex
      let newObj = this.deepClone(this.formList[newIndex])
      // console.log('prop: ', newObj.prop, this.selectWg.prop)
      this.dragAdd(newObj, newIndex)
    },
    dragAdd (newObj, newIndex) {
      // console.log(newObj)
      var arr = ['', '单选题', '多选题', '问答题', '下拉题', '级联题', '附件题']
      if (newObj.type) {
        const key = Date.now() + '_' + Math.ceil(Math.random() * 1000000)
        newObj.value.label = (newIndex + 1) + '.' + (newObj.name || arr[parseInt(newObj.type)])
        newObj.index = newIndex
        if (!newObj.prop) {
          newObj.prop = newObj.type + '_' + key
          if (newObj.isCustom) newObj.value.name = newObj.type + '_' + randomWord(false, 6)
        }
        if (newObj.prop && newObj.prop === this.selectWg.prop) {
          this.selectIndex = newIndex
        } else {
          this.selectIndex = this.formList.findIndex(d => d.prop === this.selectWg.prop)
        }
        this.formList.splice(newIndex, 1, newObj || {})
        this.updateWg = this.formList[newIndex] // 重新刷新页面？
        // 选择节点
        this.selectIndex = newIndex
        this.selectWg = newObj
      }
    },
    // 移动节点
    handleWidgetMoved (e, tab) {
      this.selectIndex = this.formList.findIndex(d => d.prop === this.selectWg.prop)
    },
    // 选择节点
    handleSelectWidget (index) {
      this.doSelectItem(index)
    },
    doSelectItem (index) {
      this.selectIndex = index
      if (index > -1) {
        this.selectWg = this.formList[index]
      }
    },
    // 编辑节点
    handleWidgetEdit (i) {
      var arr = ['', '单选题', '多选题', '问答题', '下拉题', '级联题', '附件题']
      if (!this.formList[i].editShow) {
        this.formList.forEach((t, j) => {
          if (j !== i && t.editShow) {
            if (!t.title) {
              t.title = (j + 1) + '.' + arr[t.type]
            } else {
              t.editShow = false
            }
          }
        })
        this.doSelectItem(i)
        setTimeout(() => {
          this.$set(this.formList[i], 'editShow', true)
        }, 100)
      }
    },
    // 复制节点
    handleWidgetCopy (item, i) {
      if (!item.title) {
        return
      }
      let data = this.deepClone(item)
      data.prop = ''
      data.id = ''
      let a = {
        column: 1, // 每行列数
        inputLimit: false, // 是否限制输入类型
        inputNumLimit: false, // 是否限制输入字数
        inputType: '', // 输入限制
        inputNum: 150, // 限制字数
        inputWidth: '100', // 输入框宽度
        inputHeight: '40', // 输入框高度
        isRadio: 1, // 是否单选-下拉题
        fileSizeLimit: false, // 附件大小限制
        fileNumLimit: true, // 附件数量限制
        fileTypeLimit: false, // 附件类型限制
        fileSize: '', // 附件大小
        fileUnit: 'KB',
        fileNum: 1, // 附件数量
        fileTypeSet: 1, // 附件类型
        fileTypes: '', // 附件类型
        options: []
      }
      data.option = Object.assign(a, item.option)
      this.dragAdd(data, this.formList.length)
      this.closeEdit(i)
    },
    closeEdit (i, status) {
      var arr = ['', '单选题', '多选题', '问答题', '下拉题', '级联题', '附件题']
      if (!this.formList[i].title) {
        this.$set(this.formList[i], 'title', (i + 1) + '.' + arr[this.formList[i].type])
      } else {
        this.$set(this.formList[i], 'editShow', false)
      }
    },
    // 删除节点
    handleWidgetDelete (index, tab) {
      this.selectIndex = ''
      this.selectWg = {}
      this.$nextTick(() => {
        this.formList.splice(index, 1)
      })
    },
    getStyle (data, type) {
      let obj = {}
      if (data && type === 'bgConfig') {
        let parant = document.querySelector('.interact-vote-edit-ques .edit-ques-wrap')
        let element = document.querySelector('.interact-vote-edit-ques .edit-ques-wrap .bg-style')
        // console.log(parant.scrollHeight)
        element.style.height = parant.scrollHeight + 50 + 'px'
        obj = {
          backgroundColor: data.bgType === 1 ? '' : data.bgColor,
          backgroundImage: data.bgType === 1 ? 'url(' + this.$getPath(data.bgImageUrl) + ')' : '',
          backgroundPosition: data.alignType,
          backgroundRepeat: data.isRepeat === 1 ? 'repeat' : 'no-repeat',
          opacity: data.opacity / 100
        }
      } else if (data && type === 'contConfig') {
        obj = {
          backgroundColor: data.bgColor,
          borderColor: data.hasBorder === 1 ? data.borderColor : '#e8e8e8',
          borderWidth: data.hasBorder === 1 ? data.borderWidth + 'px' : '1px',
          borderRadius: data.hasBorder === 1 ? data.borderRadius + 'px' : '0px'
        }
      } else if (data && type === 'subConfig') {
        this.submitText = data.text
        obj = {
          color: data.fontStyle.fontColor,
          fontWeight: data.fontStyle.fontWigth,
          fontSize: data.fontStyle.fontSize + 'px',
          backgroundColor: data.bgColor,
          borderColor: data.hasBorder === 1 ? data.borderColor : '',
          borderWidth: data.hasBorder === 1 ? data.borderWidth + 'px' : '0px',
          borderRadius: data.hasBorder === 1 ? data.borderRadius + 'px' : '0px',
          width: data.btnWidth + 'px',
          height: data.btnHeight + 'px',
          lineHeight: data.btnHeight + 'px'
        }
      } else if (data && (type === 'titleStyle' || type === 'descStyle')) {
        obj = {
          fontSize: data[type].fontSize + 'px',
          fontWeight: data[type].fontWigth,
          color: data[type].fontColor,
          textAlign: data[type].fontAlign || ''
        }
      } else if (data && type === 'stemStyle') {
        obj = {
          fontSize: data[type].fontSize + 'px',
          fontWeight: data[type].fontWigth,
          color: data[type].fontColor,
          optionFontColor: data.optStyle.fontColor,
          optionFontSize: data.optStyle.fontSize + 'px',
          optionFontWeight: data.optStyle.fontWigth
        }
      }
      return obj
    },
    // 转换数据
    setDetailData (id, type) {
      let data = this.formData
      this.headList.find(t => t.prop === 'title').value.defaultValue = data.title
      if (type === 'Edit') {
        this.headList.find(t => t.prop === 'details').value.defaultValue = data.details
        if (data.subjects !== undefined) {
          this.formList = this.getDataList(data.subjects)
        }
      }
    },
    getDataList (data) {
      return data.map(t => {
        let obj = deepClone(t)
        obj.value = {
          label: t.title,
          defaultValue: t.groupIndex === 3 ? '' : (t.groupIndex === 5 ? [''] : { value: '' })
        }
        obj.canDelete = true
        obj.groupIndex = t.type
        obj.editor = this.getGroupType(t.type).editor
        obj.preview = this.getGroupType(t.type).preview
        let a = {
          column: 1, // 每行列数
          inputLimit: false, // 是否限制输入类型
          inputNumLimit: false, // 是否限制输入字数
          inputType: '', // 输入限制
          inputNum: 150, // 限制字数
          inputWidth: '100', // 输入框宽度
          inputHeight: '40', // 输入框高度
          isRadio: 1, // 是否单选-下拉题
          fileSizeLimit: false, // 附件大小限制
          fileNumLimit: true, // 附件数量限制
          fileTypeLimit: false, // 附件类型限制
          fileSize: '', // 附件大小
          fileUnit: 'KB',
          fileNum: 1, // 附件数量
          fileTypeSet: 1, // 附件类型
          fileTypes: '', // 附件类型
          options: []
        }
        obj.option = Object.assign(a, t.option)
        obj.value.options = t.option.options ? t.option.options.map((t, i) => {
          return {
            label: t.name,
            value: t.sortNum,
            ...t
          }
        }) : []
        this.setBtns()
        return obj
      })
    },
    getGroupType (type) {
      let arr = ['Radio', 'Check', 'Question', 'Select', 'Cascade', 'File']
      let obj = {}
      obj.editor = 'V' + arr[type - 1] + 'Editor'
      obj.preview = 'V' + arr[type - 1] + 'Preview'
      return obj
    },
    setBtns () {
      // console.log(this.workFlow)
      // 0未发布1流转中2已驳回3进行中4已结束
      if (this.getBtn) {
        this.getBtn = false
        if (this.$route.query.isHiddenAll) {
          this.headers.buttons = this.headers.buttons.map(t => {
            t.isHidden = true
            return t
          })
        } else {
          this.headers.buttons.find(t => t.handleType === 0).isHidden = false
          if (this.workFlow) {
            this.headers.buttons.find(t => t.handleType === 1).isHidden = false
            if (this.data.status === 0 && this.data.checkStatus) {
              this.headers.buttons.find(t => t.handleType === 3).isHidden = false
            } else {
              this.headers.buttons.find(t => t.handleType === 3).isHidden = true
            }
          } else {
            this.headers.buttons.find(t => t.handleType === 3).isHidden = false
            this.headers.buttons.find(t => t.handleType === 1).isHidden = true
          }
          if (this.$route.query.id && this.$route.query.type === 'Edit') {
            if (this.data.status === 1) {
              this.headers.buttons.find(t => t.handleType === 3).isHidden = true
              this.headers.buttons.find(t => t.handleType === 1).isHidden = true
              this.headers.buttons.find(t => t.handleType === 0).isHidden = true
              if (!this.data.revokeSupport) {
                this.headers.buttons.find(t => t.handleType === 'withdraw').isHidden = true
              } else {
                this.headers.buttons.find(t => t.handleType === 'withdraw').isHidden = false
              }
            } else {
              this.headers.buttons.find(t => t.handleType === 'withdraw').isHidden = true
              this.headers.buttons.find(t => t.handleType === 0).isHidden = false
            }
            this.headers.buttons.find(t => t.handleType === 'preview').isHidden = false
          } else {
            this.headers.buttons.find(t => t.handleType === 'preview').isHidden = true
          }
          this.getBtn = true
          // btnDatas
          // this.headers.buttons = this.headers.buttons.filter(t => !t.isHidden)
        }
      }
    }
  },
  updated () {
    this.$nextTick(v => {
      if (this.$route.query.id) {
        this.setBtns()
      }
    })
  },
  mounted () {
    this.resetDetailData({
      coverPic: null,
      coverPicUrl: '',
      isVerification: false,
      processType: 1,
      prompt: '您的答卷已经提交，感谢您的参与！',
      prompt2: '',
      answerLimit: false,
      beginTime: '',
      endTime: '',
      userAnswerFrequencyLimitUnit: 1,
      userAnswerFrequencyLimit: 1,
      ipAnswerFrequencyLimitUnit: 1,
      ipAnswerFrequencyLimit: 1,
      deviceAnswerFrequencyLimitUnit: 1,
      deviceAnswerFrequencyLimit: 1,
      wechatAnswerFrequencyLimitUnit: 1,
      wechatAnswerFrequencyLimit: 1,
      isOnlyWechat: false,
      shareLogo: null,
      description: '',
      workflowId: null,
      workflowName: '',
      shareLogoUrl: ''
    })
    this.$nextTick(v => {
      this.group.data = this.getVoteConfigs.slice(0, 6)
      if (this.$route.query.id && this.name === 'editQues') {
        this.getDetailData({ id: this.$route.query.id, type: true })
      } else if (this.name === 'editQues') {
        this.setBtns()
      }
    })
  }
}
