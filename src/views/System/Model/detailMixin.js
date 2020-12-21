import draggable from 'vuedraggable'
import EditorComponents from '@/components/draggable/Editor/components'
import PreviewComponents from '@/components/draggable/Preview/components'
import customConfigs from '@/components/draggable/Config/customConfigs'
import fastConfigs from '@/components/draggable/Config/fastConfigs'
import defaultConfigs from '@/components/draggable/Config/defaultConfigs'
import { deepClone, hasRepeatValue, randomWord } from '@/utils'

export default {
  components: {
    draggable,
    ...EditorComponents,
    ...PreviewComponents
  },
  data () {
    return {
      modelId: '',
      modelName: '',
      loading: false,
      activePanels: ['1'],
      tabs: [
        {
          label: '基本信息',
          name: 'Base'
        },
        {
          label: '扩展设置',
          name: 'Extend'
        },
        {
          label: 'SEO设置',
          name: 'Seo'
        }
      ],
      currentTab: 'Base',
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
      },
      options2: {
        group: 'widget',
        forceFallback: true,
        ghostClass: 'ghost',
        swapThreshold: 0.5,
        animation: 100
      },
      options3: {
        group: {
          name: 'widget',
          put: false
        },
        sort: false,
        forceFallback: true,
        filter: '.disable',
        ghostClass: 'ghost',
        chosenClass: 'chosen',
        dragClass: 'dragging'
      },
      customConfigs,
      fastConfigs,
      defaultConfigs: this.getInitDefaultConfig(),
      customConfigsFilter: [],
      fastConfigsFilter: [],
      selectTab: '',
      selectIndex: '',
      selectWg: {},
      updateWg: {},
      data: {
        // 基本
        formListBase: [],
        // 扩展
        formListExtend: [],
        // SEO
        formListSeo: []
      },
      labelWidth: 'auto'
    }
  },
  computed: {
    groups () {
      return [
        {
          title: '模型组件',
          name: '1',
          class: 'drag-comp-list',
          options: this.options,
          icon: 'moxingzujian',
          data: this.getCustomConfigs
        },
        {
          title: '快速组件',
          name: '2',
          class: 'drag-comp-list',
          icon: 'kuaisuzujian',
          options: this.options,
          data: this.getFastConfigs
        },
        {
          title: '未启用模型',
          name: '3',
          class: 'drag-comp-list2',
          icon: 'weiqiyongmoxing',
          options: this.options3,
          data: this.defaultConfigs
        }
      ]
    },
    getSelectFormItem () {
      if (this.selectTab !== '' && this.selectIndex !== '') {
        return this.data[`formList${this.selectTab}`][this.selectIndex]
      } else {
        return null
      }
    },
    formListFormat () {
      const formList = {
        formListBase: this.data.formListBase.map((d, i) => {
          d.index = i + 1
          d.groupType = 1
          return d
        }),
        formListExtend: this.data.formListExtend.map((d, i) => {
          d.index = i + 1
          d.groupType = 2
          return d
        }),
        formListSeo: this.data.formListSeo.map((d, i) => {
          d.index = i + 1
          d.groupType = 3
          return d
        })
      }
      return JSON.stringify(formList, null, 4)
    },
    getCustomConfigs () {
      return this.customConfigs.filter(d => !this.customConfigsFilter.includes(d.type)).slice().sort((a, b) => a.groupIndex - b.groupIndex)
    },
    getFastConfigs () {
      return this.fastConfigs.filter(d => !this.fastConfigsFilter.includes(d.type)).slice().sort((a, b) => a.groupIndex - b.groupIndex)
    },
    getDefaultConfigs () {
      return this.defaultConfigs.slice().sort((a, b) => a.groupIndex - b.groupIndex)
    }
  },
  watch: {
    'selectWg.value': {
      deep: true,
      handler (newData) {
        this.$nextTick(() => {
          try {
            this.$refs.editorComponent.$refs.baseForm.$refs.form.validate(valid => {
              if (valid) {
                this.options2.disabled = false
              } else {
                this.$message.error('请检查配置详情')
                this.options2.disabled = true
              }
            })
          } catch (error) {
            this.options2.disabled = false
          }
        })
      }
    }
  },
  methods: {
    deepClone,
    hasRepeatValue,
    getInitDefaultConfig () {
      console.log(defaultConfigs)
      return defaultConfigs.filter(d => !['parentColumn', 'columnName', 'accessPath'].includes(d.type)).slice().sort((a, b) => a.groupIndex - b.groupIndex)
    },
    // 展/收面板
    handleChangePanel (val) {
      this.activePanels = val
    },
    // 切换预览区标签
    handleMouseOverTabs (e) {
      if (/el-tabs__item/.test(e.target.className)) {
        const id = e.target.id.substr(4)
        this.currentTab = id
        this.labelWidth = ''
        this.$nextTick(() => {
          this.labelWidth = 'auto'
        })
      }
    },
    handleWidgetAdd (e, tab) {
      const newIndex = e.newIndex
      let newObj = this.deepClone(this.data[`formList${tab}`][newIndex])
      // console.log('prop: ', newObj.prop, this.selectWg.prop)
      if (newObj.type) {
        const key = Date.now() + '_' + Math.ceil(Math.random() * 1000000)
        if (!newObj.prop) {
          newObj.prop = newObj.type + '_' + key
          if (newObj.isCustom && newObj.type !== 'organize') newObj.value.name = newObj.type + '_' + randomWord(false, 6)
        }
        if (newObj.prop && newObj.prop === this.selectWg.prop) {
          this.selectIndex = newIndex
          this.selectTab = tab
        } else if (this.selectTab && this.selectTab === tab) {
          this.selectIndex = this.data[`formList${this.selectTab}`].findIndex(d => d.prop === this.selectWg.prop)
        }
        this.data[`formList${tab}`][newIndex] = newObj
        this.updateWg = this.data[`formList${tab}`][newIndex] // 重新刷新页面？
        // 选择节点
        this.selectIndex = newIndex
        this.selectTab = tab
        this.selectWg = newObj
      }
    },
    // 移动节点
    handleWidgetMoved (e, tab) {
      // console.log('move: ', tab, this.selectTab)
      if (this.selectTab) this.selectIndex = this.data[`formList${this.selectTab}`].findIndex(d => d.prop === this.selectWg.prop)
    },
    // 选择节点
    handleSelectWidget (index, tab) {
      try {
        this.$refs.editorComponent.$refs.baseForm.$refs.form.validate(valid => {
          if (valid) {
            this.doSelectItem(index, tab)
          } else {
            this.$message.error('请检查配置详情')
          }
        })
      } catch (error) {
        this.doSelectItem(index, tab)
      }
    },
    doSelectItem (index, tab) {
      this.selectIndex = index
      this.selectTab = tab
      this.selectWg = this.data[`formList${tab}`][index]
      // console.log('select', this.selectWg)
    },
    // 删除节点
    handleWidgetDelete (index, tab) {
      this.selectIndex = ''
      this.selectTab = ''
      this.selectWg = {}
      this.$nextTick(() => {
        // this.defaultConfigs.push(this.data[`formList${tab}`][index])
        // this.defaultConfigs = this.defaultConfigs.slice().sort((a, b) => a.groupIndex - b.groupIndex)
        // this.data[`formList${tab}`].splice(index, 1)
        let obj = null
        // 判断是否有多层级
        if (index.toString().indexOf(',') !== -1) {
          let indexs = index.split(',')
          // 判断有两级
          if (indexs.length === 2) {
            // 判断是否list
            if (this.data[`formList${tab}`][indexs[0]].list) {
              obj = deepClone(this.data[`formList${tab}`][indexs[0]].list[indexs[1]])
              // 清除
              if (this.data[`formList${tab}`][indexs[0]].list.length === 1) {
                this.data[`formList${tab}`].splice(indexs[0], 1)
              } else {
                this.data[`formList${tab}`][indexs[0]].list.splice(indexs[1], 1)
              }
            } else {
              obj = deepClone(this.data[`formList${tab}`][indexs[0]][indexs[1]])
              // 清除
              this.data[`formList${tab}`][indexs[0]].splice(indexs[1], 1)
            }
          } else if (indexs.length === 3) {
            // 三级
            obj = deepClone(this.data[`formList${tab}`][indexs[0]][indexs[1]][indexs[2]])
            // 清除
            this.data[`formList${tab}`][indexs[0]].splice(indexs[1], 1)
            this.data[`formList${tab}`].splice(indexs[0], 1, this.data[`formList${tab}`][indexs[0]][0][0])
          } else {
            // 第四级，视频、音频、单图
            obj = deepClone(this.data[`formList${tab}`][indexs[0]][indexs[1]][indexs[2]].list[indexs[3]])
            // 清除
            if (this.data[`formList${tab}`][indexs[0]][indexs[1]][indexs[2]].list.length === 1) {
              this.data[`formList${tab}`][indexs[0]].splice(indexs[1], 1)
              this.data[`formList${tab}`].splice(indexs[0], 1, this.data[`formList${tab}`][indexs[0]][0][0])
            } else {
              this.data[`formList${tab}`][indexs[0]][indexs[1]][indexs[2]].list.splice(indexs[3], 1)
            }
          }
        } else {
          // 没有多层级
          // 判断是否有list
          if (this.data[`formList${tab}`][index].list) {
            obj = this.data[`formList${tab}`][index].list
          } else {
            obj = this.data[`formList${tab}`][index]
          }
          // 清除
          this.data[`formList${tab}`].splice(index, 1)
        }
        // 存到未启用模型中
        if (obj instanceof Array) {
          this.defaultConfigs.push(...obj)
        } else {
          this.defaultConfigs.push(obj)
        }
      })
    },
    // 从默认组件中彻底删除字段
    handleDeleteDefaultConfig (index) {
      this.defaultConfigs.splice(index, 1)
    },
    // 保存页面
    handleSave () {
      try {
        this.$refs.editorComponent.$refs.baseForm.$refs.form.validate(valid => {
          if (valid) {
            this.doSave()
          } else {
            this.$message.error('请检查配置详情')
            return false
          }
        })
      } catch (error) {
        console.log(error)
        this.doSave()
      }
    },
    doSave () {
      const check = this.hasRepeatValue(this.data.formListBase.map(d => d.value.name)) && this.hasRepeatValue(this.data.formListExtend.map(d => d.value.name)) && this.hasRepeatValue(this.data.formListSeo.map(d => d.value.name))
      if (!check) {
        this.$message.error('存在重复的标签名称，请检查并修改')
      } else {
        this.loading = true
        const that = this
        let data = {}
        Object.keys(this.data).forEach(item => {
          data[item] = that.data[item].map((d, i) => {
            d.index = i + 1
            d.groupType = 1
            return d
          })
        })
        // 对未启用字段进行排序
        this.defaultConfigs.forEach((d, index) => {
          d.groupIndex = index + 1
        })
        const postData = {
          modelId: this.modelId,
          enableJson: JSON.stringify(data),
          unEnableJson: JSON.stringify(this.defaultConfigs)
        }
        this.$request.fetchModelItem(postData).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 关闭页面
    handleClose () {
      this.$confirm('关闭页面后当前保存的数据将会丢失，是否确定关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.opener = null
        window.close()
      })
    },
    // 获取详情
    fetchModelDetail () {}
  },
  mounted () {
    const { id } = this.$route.query
    if (id) {
      this.modelId = id
      this.fetchModelDetail()
    }
  },
  activated () {
    const { id } = this.$route.query
    if (id && id !== this.modelId) {
      this.modelId = id
      this.fetchModelDetail()
    }
  }
}
