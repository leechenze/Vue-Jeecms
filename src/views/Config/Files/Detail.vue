<template>
  <section class="config-files-detail-container">
    <section class="detail-container">

        <search-header
      class="search-header"
        v-bind="searchHeader"
      ></search-header>
      <el-input class="right-form" type="textarea" v-model="form.form.source" placeholder="请输入文件内容" ></el-input>
      <el-button style="margin-top: 10px" size="medium" type='primary' @click="handleConfirm" >保存</el-button>
    </section>

  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseForm from '@/components/mixins/baseForm'
import { deepClone } from '../../../utils'

export default {
  name: 'configFilesDetail',
  mixins: [baseHeader, searchHeader, baseForm],
  data () {
    return {
      news: false,
      root: '',
      tplType: false,
      headers: {
        buttons: [],
        title: '',
        showAlertIcon: true,
        content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'input',
            value: 'filename',
            placeholder: '请输入文件名称',
            label: '文件名称：',
            maxlength: 50
          },
          {
            type: 'select',
            value: 'fileType',
            callback: 'FT',
            options: [
              {
                value: 1,
                label: '.css'
              }, {
                value: 2,
                label: '.js'
              }
            ]
          }
        ],
        params: {
          fileType: 1,
          filename: ''
        }
      },
      form: {
        api: 'fetchResourceDetail',
        params: {
        },
        form: {
          fileType: 1,
          filename: ''
        },
        formItems: [
          {
            prop: 'source',
            type: 'textarea',
            height: '900px',
            placeholder: '请输入文件内容',
            autosize: { minRows: 20 }
          }
        ],
        rules: {
          filename: [this.$rules.required()],
          source: [this.$rules.required('请填写文件内容')]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/resource', this.news ? 'POST' : 'PUT')
        }]
      }

    }
  },
  inject: ['removeTab'],
  computed: {
    filename () {
      return this.searchHeader.params.filename
    },
    fileType () {
      return this.searchHeader.params.fileType
    }
  },
  methods: {
    // 添加文件
    handleConfirm () {
      if (!this.filename) {
        this.$message.error('请填写文件名称！')
        return false
      }
      var reg = /^[\u4e00-\u9fa5|A-Za-z0-9._-]+$/
      if (!reg.test(this.filename)) {
        this.$message.error('文件名称只能输入中文、大小写英文、数字、._-')
        return false
      }
      if (!this.form.form.source) {
        this.$message.error('请填写文件内容！')
        return false
      }
      if (!this.fileType) {
        this.$message.error('请选择文件类型')
        return false
      }
      if (this.fileType === 1) {
        this.form.form.filename = this.filename + '.css'
      } else if (this.fileType === 2) {
        this.form.form.filename = this.filename + '.js'
      } else {
        this.form.form.filename = this.filename
      }
      if (this.root !== 'undefined') {
        this.form.form.root = this.root
      }
      this.form.form.fileType = this.fileType
      const params = {
        dirName: this.form.form.filename,
        root: this.$encode(this.form.form.root)
      }
      this.$request.fetchResourceUniqueDir(params).then(res => {
        if (res.code === 200) {
          if (!res.data) {
            this.$message.error('文件名称重名')
          } else {
            this.fetchResourceCreate()
          }
        }
      }).catch(this.hideFormLoading)
    },
    fetchResourceCreate () {
      let params = deepClone(this.form.form)
      params.root = this.$encode(params.root)
      params.source = this.$encode(params.source)
      if (this.news) {
        this.$request.fetchResourceCreate(params).then(res => {
          if (res.code === 200) {
            this.hideFormLoading()
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.removeTab(this.$route.fullPath)
            this.$routerLink('/config/files/index', 'list')
          }
        }).catch(this.hideFormLoading)
      } else {
        this.$request.fetchResourcePut(params).then(res => {
          if (res.code === 200) {
            this.hideFormLoading()
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.removeTab(this.$route.fullPath)
            this.$routerLink('/config/files/index', 'list')
          }
        }).catch(this.hideFormLoading)
      }
    },
    // 获取文件内容
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = res.data
        const name = res.data.filename
        if (name.endsWith('css')) {
          this.form.form.filename = name.substring(0, name.length - 4)
          this.form.form.fileType = 1
        }
        if (name.endsWith('js')) {
          this.form.form.filename = name.substring(0, name.length - 3)
          this.form.form.fileType = 2
        }
        this.searchHeader.params.filename = this.form.form.filename
        this.searchHeader.params.fileType = this.form.form.fileType
      }
    }
  },
  activated () {
    this.form.form = {
      fileType: 1,
      filename: '',
      source: ''
    }
    const { root, news } = this.$route.query
    if (root !== 'undefined') {
      this.root = root
    }
    if (root !== 'undefined' && !news) {
      this.form.params.name = this.$encode(root)
      this.form.params.id += 1
      this.fetchFormApi()
    }
    if (news) {
      this.news = news
      this.searchHeader.params.filename = ''
      this.searchHeader.params.fileType = 1
    } else {
      this.news = false
    }
  }
}
</script>

<style lang="scss">
.config-files-detail-container{
  height: 100%;
  background-color: #ffffff;
  display: flex;
  .left-btn{
    height: 50px;
  }
  .el-select--small{
    width: 101px !important;
  }
  .detail-container{
    width: 100%;
    .right-form{
      overflow-y: scroll;
      textarea{
      height:calc(75vh) !important;
      overflow-y: scroll;
      }
    }
  }
}

</style>
