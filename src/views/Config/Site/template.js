import { deepClone } from '../../../utils'

export default {
  data () {
    return {
      pcColumns: [
        // {
        //   modelId: '',
        //   modelName: '',
        //   options: [
        //     {
        //       value: 'tplPath',
        //       label: 'tplPath'
        //     }
        //   ]
        // }
      ],
      pcContents: [],
      telColumns: [],
      telContents: [],
      templatesForm: {
        api: 'fetchSitesDetail',
        loading: false,
        params: {
          id: ''
        },
        labelWidth: '140px',
        form: {
          id: '',
          pcSolution: '',
          mobileSolution: '',
          mobileHomePageTemplates: '',
          pcHomePageTemplates: ''
        },
        formItems: [{
          type: 'title',
          label: 'PC端',
          titleClass: 'big-title'
        },
        {
          type: 'select',
          prop: 'pcSolution',
          label: '模板方案：',
          placeholder: '请选择模板方案',
          options: [],
          change: this.handleChangePcSolution
        },
        {
          type: 'select',
          prop: 'pcHomePageTemplates',
          label: '首页模板：',
          placeholder: '请选择首页模板',
          options: []
        },
        {
          type: 'title',
          flag: 'pcColumns',
          label: '栏目模型模板'
        },
        {
          type: 'title',
          flag: 'pcContents',
          label: '内容模型模板'
        },
        {
          type: 'title',
          label: '手机端',
          titleClass: 'big-title'
        },
        {
          type: 'select',
          prop: 'mobileSolution',
          label: '模板方案：',
          placeholder: '请选择模板方案',
          options: [],
          change: this.handleChangeTelSolution
        },
        {
          type: 'select',
          prop: 'mobileHomePageTemplates',
          label: '首页模板：',
          placeholder: '请选择首页模板',
          options: []
        },
        {
          type: 'title',
          flag: 'telColumns',
          label: '栏目模型模板'
        },
        {
          type: 'title',
          flag: 'telContents',
          label: '内容模型模板'
        }
        ],
        rules: {
          mobileHomePageTemplates: [this.$rules.required()],
          pcHomePageTemplates: [this.$rules.required()],
          mobileSolution: [this.$rules.required()],
          pcSolution: [this.$rules.required()]
        }
      }
    }
  },
  computed: {
    getFormItems () {
      let formItems = [...this.templatesForm.formItems]
      this.pcColumns.forEach(d => {
        const index = formItems.findIndex(c => c.flag === 'pcColumns')
        if (index >= 0) {
          const item = {
            type: 'select',
            prop: `pcColumns_${d.modelId}`,
            label: `${d.modelName}：`,
            placeholder: '请选择模型模板',
            options: d.options
          }
          formItems.splice(index + 1, 0, item)
        }
      })
      this.pcContents.forEach(d => {
        const index = formItems.findIndex(c => c.flag === 'pcContents')
        if (index >= 0) {
          const item = {
            type: 'select',
            prop: `pcContents_${d.modelId}`,
            label: `${d.modelName}：`,
            placeholder: '请选择模型模板',
            options: d.options
          }
          formItems.splice(index + 1, 0, item)
        }
      })
      this.telColumns.forEach(d => {
        const index = formItems.findIndex(c => c.flag === 'telColumns')
        if (index >= 0) {
          const item = {
            type: 'select',
            prop: `telColumns_${d.modelId}`,
            label: `${d.modelName}：`,
            placeholder: '请选择模型模板',
            options: d.options
          }
          formItems.splice(index + 1, 0, item)
        }
      })
      this.telContents.forEach(d => {
        const index = formItems.findIndex(c => c.flag === 'telContents')
        if (index >= 0) {
          const item = {
            type: 'select',
            prop: `telContents_${d.modelId}`,
            label: `${d.modelName}：`,
            placeholder: '请选择模型模板',
            options: d.options
          }
          formItems.splice(index + 1, 0, item)
        }
      })
      return formItems
    }
  },
  watch: {
    'templatesForm.form': function (newData) {
      console.log(newData)
    }
  },
  methods: {
    handleChangePcSolution (val) {
      if (val) {
        this.fetchSitesTplListPC()
        this.pcFetchSitesModelsList()
      }
      this.clearFormData('pc')
    },
    handleChangeTelSolution (val) {
      if (val) {
        this.fetchSitesTplListTEL()
        this.mobileFetchSitesModelsList()
      }
      this.clearFormData('tel')
    },
    // 切换方案清理from数据
    clearFormData (type) {
      Object.keys(this.templatesForm.form).forEach(k => {
        if (k.startsWith(`${type}Columns`) || k.startsWith(`${type}Contents`)) {
          this.templatesForm.form[k] = ''
        }
      })
      if (type === 'pc') {
        this.templatesForm.form.pcHomePageTemplates = ''
      } else if (type === 'tel') {
        this.templatesForm.form.mobileHomePageTemplates = ''
      }
      this.$nextTick(() => {
        this.$refs[`${this.activeTabName}Form`].$refs.form.clearValidate()
      })
    },
    // 处理详情数据
    handleTemplateDetail (data) {
      let { modelTpls, ...form } = data
      if (modelTpls instanceof Array && modelTpls.length) {
        modelTpls.forEach(d => {
          if (d.model && d.model.tplType === 1) {
            if (!d.pcTplPath || d.pcTplPath === undefined) {
              form[`pcColumns_${d.model.id}`] = ''
            } else {
              form[`pcColumns_${d.model.id}`] = d.pcTplPath
            }
            if (!d.mobileTplPath || d.mobileTplPath === undefined) {
              form[`telColumns_${d.model.id}`] = ''
            } else {
              form[`telColumns_${d.model.id}`] = d.mobileTplPath
            }
          }
          if (d.model && d.model.tplType === 2) {
            if (!d.pcTplPath || d.pcTplPath === undefined) {
              form[`pcContents_${d.model.id}`] = ''
            } else {
              form[`pcContents_${d.model.id}`] = d.pcTplPath
            }
            if (!d.mobileTplPath || d.mobileTplPath === undefined) {
              form[`telContents_${d.model.id}`] = ''
            } else {
              form[`telContents_${d.model.id}`] = d.mobileTplPath
            }
          }
        })
      }
      this.templatesForm.form = deepClone(form)
      console.log(this.templatesForm.form)
      this.$nextTick(() => {
        this.$refs[`${this.activeTabName}Form`].$refs.form.clearValidate()
      })
    },
    // 获取详情之后
    changeTemplates () {
      this.fetchTemplateSolution()
      this.fetchSitesTplListPC()
      this.fetchSitesTplListTEL()
      this.pcFetchSitesModelsList()
      this.mobileFetchSitesModelsList()
    },
    // 获取模板方案列表
    fetchTemplateSolution () {
      var siteId = this.id
      // 模板方案下拉
      this.$request.fetchSitesSolutions({ siteId }).then(res => {
        console.log(res.data)
        if (res.code === 200 && res.data instanceof Array) {
          const options = res.data.map(d => ({
            value: d,
            label: d
          }))
          this.templatesForm.formItems.find(v => v.prop === 'pcSolution').options = options
          this.templatesForm.formItems.find(v => v.prop === 'mobileSolution').options = options
        }
      })
    },
    // 获取PC首页模板下拉列表
    fetchSitesTplListPC () {
      const solution = this.templatesForm.form.pcSolution
      if (!solution) {
        this.templatesForm.form.pcHomePageTemplates = ''
        this.templatesForm.formItems.find(v => v.prop === 'pcHomePageTemplates').options = []
        return
      }
      const param = {
        siteId: this.id,
        solution
      }
      this.$request.fetchSitesTplList(param).then(res => {
        console.log(res.data)
        if (res.code === 200 && res.data instanceof Array) {
          this.templatesForm.formItems.find(v => v.prop === 'pcHomePageTemplates').options = res.data.map(d => ({
            value: d,
            label: d
          }))
        }
      })
    },
    // 获取手机首页模板下拉列表
    fetchSitesTplListTEL () {
      const solution = this.templatesForm.form.mobileSolution
      if (!solution) {
        this.templatesForm.form.mobileHomePageTemplates = ''
        this.templatesForm.formItems.find(v => v.prop === 'mobileHomePageTemplates').options = []
        return
      }
      const param = {
        siteId: this.id,
        solution
      }
      this.$request.fetchSitesTplList(param).then(res => {
        if (res.code === 200 && res.data instanceof Array) {
          this.templatesForm.formItems.find(v => v.prop === 'mobileHomePageTemplates').options = res.data.map(d => ({
            value: d,
            label: d
          }))
        }
      })
    },
    // 获取PC模型的模板下拉列表
    pcFetchSitesModelsList () {
      const solution = this.templatesForm.form.pcSolution
      if (!solution) {
        this.pcColumns = []
        this.pcContents = []
        return
      }
      const param = {
        siteId: this.id,
        solution
      }
      const that = this
      this.$request.fetchSitesModelsList(param).then(res => {
        console.log(res)
        if (res.code === 200 && res.data instanceof Array) {
          let columns = []
          let contents = []
          res.data.forEach(d => {
            const opt = {
              value: d.tplPath,
              label: d.tplPath
            }
            const col = {
              modelId: d.modelId,
              modelName: d.modelName,
              options: [opt]
            }
            if (d.type === 1) {
              const column = columns.find(c => c.modelId === d.modelId)
              if (column) {
                column.options.push(opt)
              } else {
                columns.push(col)
              }
            } else {
              const content = contents.find(c => c.modelId === d.modelId)
              if (content) {
                content.options.push(opt)
              } else {
                contents.push(col)
              }
            }
          })
          this.pcColumns = columns
          this.pcContents = contents
          columns.forEach(d => {
            if (d.options instanceof Array && d.options.length) {
              that.templatesForm.form[`pcColumns_${d.modelId}`] = that.templatesForm.form[`pcColumns_${d.modelId}`] === '' || that.templatesForm.form[`pcColumns_${d.modelId}`] === undefined ? d.options[0].value : that.templatesForm.form[`pcColumns_${d.modelId}`]
            } else {
              that.templatesForm.form[`pcColumns_${d.modelId}`] = ''
            }
          })
          contents.forEach(d => {
            if (d.options instanceof Array && d.options.length) {
              that.templatesForm.form[`pcContents_${d.modelId}`] = that.templatesForm.form[`pcContents_${d.modelId}`] === '' || that.templatesForm.form[`pcContents_${d.modelId}`] === undefined ? d.options[0].value : that.templatesForm.form[`pcContents_${d.modelId}`]
            } else {
              that.templatesForm.form[`pcContents_${d.modelId}`] = ''
            }
          })
        }
      })
    },
    // 获取手机模型的模板下拉列表
    mobileFetchSitesModelsList () {
      const solution = this.templatesForm.form.mobileSolution
      if (!solution) {
        this.telColumns = []
        this.telContents = []
        return
      }
      const param = {
        siteId: this.id,
        solution
      }
      const that = this
      this.$request.fetchSitesModelsList(param).then(res => {
        if (res.code === 200 && res.data instanceof Array) {
          let columns = []
          let contents = []
          res.data.forEach(d => {
            const opt = {
              value: d.tplPath,
              label: d.tplPath
            }
            const col = {
              modelId: d.modelId,
              modelName: d.modelName,
              options: [opt]
            }

            if (d.type === 1) {
              const column = columns.find(c => c.modelId === d.modelId)
              if (column) {
                column.options.push(opt)
              } else {
                columns.push(col)
              }
            } else {
              const content = contents.find(c => c.modelId === d.modelId)
              if (content) {
                content.options.push(opt)
              } else {
                contents.push(col)
              }
            }
          })
          this.telColumns = columns
          this.telContents = contents
          columns.forEach(d => {
            if (d.options instanceof Array && d.options.length) {
              that.templatesForm.form[`telColumns_${d.modelId}`] = that.templatesForm.form[`telColumns_${d.modelId}`] === '' ? d.options[0].value : that.templatesForm.form[`telColumns_${d.modelId}`]
            } else {
              that.templatesForm.form[`telColumns_${d.modelId}`] = ''
            }
          })
          contents.forEach(d => {
            if (d.options instanceof Array && d.options.length) {
              that.templatesForm.form[`telContents_${d.modelId}`] = that.templatesForm.form[`telContents_${d.modelId}`] === '' ? d.options[0].value : that.templatesForm.form[`telContents_${d.modelId}`]
            } else {
              that.templatesForm.form[`telContents_${d.modelId}`] = ''
            }
          })
        }
      })
    },
    // 保存
    handleConfirmTemplates () {
      this.templatesForm.loading = true
      const { id, pcSolution, mobileSolution, mobileHomePageTemplates, pcHomePageTemplates, ...prop } = this.templatesForm.form
      let data = {
        id,
        cfg: {
          pcSolution,
          mobileSolution,
          mobileHomePageTemplates: this.$encode(mobileHomePageTemplates),
          pcHomePageTemplates: this.$encode(pcHomePageTemplates)
        },
        modelTpls: []
      }
      Object.keys(prop).forEach(k => {
        if (k.includes('_')) {
          const ids = k.split('_')
          let model = data.modelTpls.find(m => m.modelId === ids[1])
          console.log(ids)
          console.log(model)
          if (model) {
            if (ids[0].startsWith('pc')) {
              if (!prop[k] || prop[k] === undefined) {
                model.pcTplPath = ''
              } else {
                model.pcTplPath = this.$encode(prop[k])
              }
            } else {
              if (!prop[k] || prop[k] === undefined) {
                model.mobileTplPath = ''
              } else {
                model.mobileTplPath = this.$encode(prop[k])
              }
            }
          } else {
            let newModel = {
              modelId: ids[1]
            }
            if (ids[0].startsWith('pc')) {
              if (!prop[k] || prop[k] === undefined) {
                newModel.pcTplPath = ''
              } else {
                newModel.pcTplPath = this.$encode(prop[k])
              }
            } else {
              if (!prop[k] || prop[k] === undefined) {
                newModel.mobileTplPath = ''
              } else {
                newModel.mobileTplPath = this.$encode(prop[k])
              }
            }
            data.modelTpls.push(newModel)
          }
        }
      })
      let param = deepClone(data)
      this.$request.fetchSitesModelUpdate(param).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      }).then(() => {
        this.templatesForm.loading = false
      }).catch(() => {
        this.templatesForm.loading = false
      })
    }
  }
}
