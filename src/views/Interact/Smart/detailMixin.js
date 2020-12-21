import draggable from 'vuedraggable'
import baseHeader from '@/components/mixins/baseHeader'
import EditorComponents from '@/components/draggable/Editor/components'
import PreviewComponents from '@/components/draggable/Preview/components'
import basicConfigs from '@/components/draggable/Config/basicConfigs'
import layoutConfigs from '@/components/draggable/Config/smartLayoutConfigs'
import fastConfigs from '@/components/draggable/Config/smartFastConfigs'
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
    ...EditorComponents,
    ...PreviewComponents
  },
  data () {
    return {
      loading: false,
      labelWidth: 'auto',
      labelPosition: 'right',
      displayType: 2,
      showPage: true,
      headers: {
        paddingBottom: '10px',
        buttons: [
          {
            type: 'Operate',
            text: '保存',
            icon: 'baocundangqian',
            handleType: 0,
            isHidden: false,
            disabled: !this._checkPermission('/smartForm/updateFields', 'POST')
          },
          {
            type: 'Operate',
            text: '发布',
            icon: 'fabu',
            handleType: 3,
            isHidden: false,
            disabled: !this._checkPermission('/smartForm/publish', 'PUT')
          },
          {
            type: 'Operate',
            text: '预览',
            icon: 'yulang',
            handleType: 'preview',
            isHidden: false,
            disabled: !this._checkPermission('/smartForm', 'GET')
          }
        ],
        showAlertIcon: false
      },
      options: {
        group: {
          name: 'widget',
          pull: 'clone',
          put: false
        },
        sort: false,
        forceFallback: true,
        filter: '.disable',
        ghostClass: 'ghost1',
        fallbackClass: true,
        chosenClass: 'chosen',
        dragClass: 'dragging'
      },
      options2: {
        group: 'widget',
        handle: '.widget-view, .widget-view-box',
        forceFallback: true,
        fallbackClass: 'ghost-fallback',
        ghostClass: 'ghost_edit',
        animation: 100,
        dragClass: 'dragging2'
        // disabled: true
      },
      basicConfigs, // 基础组件
      layoutConfigs, // 布局组件
      fastConfigs,
      basicConfigsFilter: [],
      layoutConfigsFilter: [],
      fastConfigsFilter: [],
      selectTab: '',
      selectIndex: -1,
      selectIndexConfig: '', // 选择字段模型，所对应的三层下标
      isConfig: false, // 配置详情
      selectWg: {},
      updateWg: {},
      formData: {},
      getBtn: true
    }
  },
  computed: {
    ...mapGetters(['smartDetailData']),
    groups () {
      return [
        {
          title: '基础组件',
          name: '1',
          class: 'drag-comp-list',
          options: this.options,
          icon: 'jichuzujian',
          data: this.getBasicConfigs
        },
        {
          title: '布局组件',
          name: '2',
          class: 'drag-comp-list',
          icon: 'bujuzujian',
          options: this.options,
          data: this.getLayoutConfigs
        },
        {
          title: '快速组件',
          name: '3',
          class: 'drag-comp-list',
          icon: 'kuaisuzujian',
          options: this.options,
          data: this.getFastConfigs
        }
      ]
    },
    getSelectFormItem () {
      if (this.selectIndex !== '') {
        return this.formList[this.selectIndex]
      }
    },
    getBasicConfigs () {
      return this.basicConfigs.filter(d => !this.basicConfigsFilter.includes(d.type)).slice().sort((a, b) => a.groupIndex - b.groupIndex)
    },
    getLayoutConfigs () {
      return this.layoutConfigs.filter(d => !this.layoutConfigsFilter.includes(d.type)).slice().sort((a, b) => a.groupIndex - b.groupIndex)
    },
    getFastConfigs () {
      return this.fastConfigs.filter(d => !this.fastConfigsFilter.includes(d.type)).slice().sort((a, b) => a.groupIndex - b.groupIndex)
    },
    detail () {
      return this.smartDetailData
    }
  },
  watch: {
    detail (newVal) {
      let { id } = this.$route.query
      // // 判断当前是否是 编辑问卷页签
      if (id && (this.name === 'editQues')) {
        let arr = ['bgConfig', 'headConfig', 'contConfig', 'componentConfig', 'subConfig']
        arr.forEach((t, i) => {
          if (newVal[t] instanceof String) {
            newVal[t] = JSON.parse(newVal[t])
          }
          this.cssStyles[t] = newVal[t]
        })
        this.setDetailData(id, newVal)
      }
      this.formData = newVal
    }
  },
  inject: ['removeTab'],
  methods: {
    deepClone,
    ...mapActions('interact', ['getSmartDetailData', 'resetSmartDetailData']),
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
      if (newObj.type) {
        const key = Date.now() + '_' + Math.ceil(Math.random() * 1000000)
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
        if (newObj.type === 'code') {
          this.basicConfigsFilter.push('code')
        }
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
    handleSelectWidget (index, item) {
      try {
        // 判断是否打开了配置详情
        if (this.isConfig) {
          this.$refs.editorComponent.$refs.baseForm.$refs.form.validate(valid => {
            if (valid) {
              this.doSelectItem(index, item)
            } else {
              this.$message.error('请检查配置详情')
            }
          })
        } else {
          this.doSelectItem(index, item)
        }
      } catch (error) {
        this.doSelectItem(index, item)
      }
    },
    doSelectItem (index, tab) {
      this.selectIndex = index
      if (index) {
        this.selectWg = this.formList[index]
      }
      this.isConfig = true
    },
    validetaEditor () {
      if (this.isConfig) {
        this.$refs.editorComponent.$refs.baseForm.$refs.form.validate(valid => {
          if (valid) {
            this.isConfig = false
          } else {
            this.$message.error('请检查配置详情')
          }
        })
      }
    },
    // 清除选择
    cleanConfig () {
      // console.log('触发点击事件')
      this.validetaEditor()
      this.selectIndex = -1
      this.selectWg = {}
    },
    // 删除节点
    handleWidgetDelete (index, tab) {
      this.cleanConfig()
      this.$nextTick(() => {
        if (this.formList[index].type === 'code') {
          this.basicConfigsFilter = []
        }
        this.formList.splice(index, 1)
      })
    },
    getStyle (data, type) {
      let obj = {}
      let parant = document.querySelector('.interact-smart-edit-ques .edit-ques-wrap')
      let element = document.querySelector('.interact-smart-edit-ques .edit-ques-wrap .bg-style')
      if (data && type === 'bgConfig') {
        element.style.height = parant.scrollHeight + 'px'
        let imgUrlSelect = data.bgImageUrl || data.bgImageUrlSelect
        obj = {
          backgroundColor: data.bgType === 1 ? '' : data.bgColor,
          backgroundImage: data.bgType === 1 ? 'url(' + this.$getPath(imgUrlSelect) + ')' : '',
          backgroundPosition: data.alignType,
          backgroundRepeat: data.isRepeat === 1 ? 'repeat' : 'no-repeat',
          opacity: data.opacity / 100
        }
      } else if (data && type === 'contConfig') {
        obj = {
          backgroundColor: data.bgColor,
          borderColor: data.hasBorder === 1 ? data.borderColor : '#e8e8e8',
          borderWidth: data.hasBorder === 1 ? data.borderWidth + 'px' : '0px',
          borderRadius: data.hasBorder === 1 ? data.borderRadius + 'px' : '0px',
          width: data.bodyWidth + 'px'
          // width: data.btnWidth + 'px',
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
          lineHeight: data.hasBorder === 1 ? data.btnHeight - (data.borderWidth * 2) + 'px' : data.btnHeight + 'px',
          marginTop: this.cssStyles.componentConfig.displayType > 2 ? '15px' : (this.cssStyles.componentConfig.displayType < 2 ? '25px' : '20px')
        }
      } else if (data && type === 'componentConfig') {
        obj = {
          fontStyle: {
            color: data.fontStyle.fontColor,
            fontStyle: data.fontStyle.fontWigth,
            fontSize: data.fontStyle.fontSize + 'px'
          },
          fontKey: {
            color: data.fontKey.fontColor,
            fontStyle: data.fontKey.fontWigth,
            fontSize: data.fontKey.fontSize + 'px'
          },
          fontHelp: {
            color: data.fontHelp.fontColor,
            fontStyle: data.fontHelp.fontWigth,
            fontSize: data.fontHelp.fontSize + 'px'
          },
          // layout: cssType,
          titleWidth: data.titleWidth + '%',
          textAlign: data.moduleDisplay
        }
        this.displayType = data.displayType
        this.labelPosition = obj.textAlign
        this.labelWidth = obj.titleWidth
      } else if (data && type === 'body') {
        obj = {
          width: data.bodyWidth + 'px',
          marginLeft: (element.offsetWidth - data.bodyWidth > 0 ? element.offsetWidth - data.bodyWidth : 0) / 2 + 'px'
        }
      }
      return obj
    },
    // 转换数据
    setDetailData (id, data) {
      if (id) {
        if (data.items && data.items.length) {
          this.formList = this.getDataList(data.items)
        } else if (data.items && data.items.length === 0) {
          this.formList = []
        }
      }
    },
    getDataList (data) {
      return data.map(t => {
        let obj = JSON.parse(t.content)
        obj.value.options = t.option && t.option.options ? t.option.options.map((t, i) => {
          return {
            label: t.name,
            value: t.sortNum,
            ...t
          }
        }) : (t.options.length ? t.options : [])
        if (t.dataType === 'code') {
          this.basicConfigsFilter.push('code')
        }
        this.setBtns()
        return obj
      })
    },
    setBtns () {
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
          this.headers.buttons.find(t => t.handleType === 3).isHidden = false
          if (this.data.status === 1) {
            this.headers.buttons.find(t => t.handleType === 3).isHidden = true
            this.headers.buttons.find(t => t.handleType === 0).isHidden = true
          } else {
            this.headers.buttons.find(t => t.handleType === 0).isHidden = false
          }
          this.headers.buttons.find(t => t.handleType === 'preview').isHidden = false
          this.getBtn = true
        }
      }
    },
    // 切换组件区域
    changeComponent (item) {
      this.isConfig = false
      this.componentShow = true
      this.modelTab = item.name
    },
    // 鼠标离开组件区域
    leaveFun () {
      let _this = this
      _this.componentShow = false
      // 判断是否有从左侧拖出组件
      this.modelTab = ''
    },
    // 左侧模型字段显示
    isLeftModelShow (name) {
      let isTrue = false
      if (this.modelTab === name) {
        isTrue = true
      } else if (this.componentStart) {
        if (this.modelTab === name) {
          isTrue = true
        } else {
          isTrue = false
        }
      } else {
        isTrue = false
      }
      return isTrue
    },
    // 组件拖动事件
    handleComponentStart (e, list, index) {
      this.groupNmae = list.name
      // let type = list.data[e.oldIndex].type
      this.componentStart = true
    }
  },
  updated () {
    this.$nextTick(v => {
      if (this.$route.query.id && this.name === 'editQues') {
        this.setBtns()
      }
    })
  },
  activated () {
    this.$nextTick(v => {
      if (this.name === 'editQues') {
        this.setBtns()
        this.getSmartDetailData({ id: this.$route.query.id, type: true })
      }
    })
  },
  mounted () {
    this.$nextTick(v => {
      if (this.name === 'editQues') {
        this.setBtns()
        this.getSmartDetailData({ id: this.$route.query.id, type: true })
      }
    })
  }
}
