<template>
  <section class="user-detail-container">
    <base-header v-bind="headers"
      v-on:handleBack="handleBack"
      v-on:handleLink="handleHeaderLink"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
    ></base-form>
  </section>
</template>

<script>
import baseForm from '@/components/mixins/baseForm'
import baseHeader from '@/components/mixins/baseHeader'
export default {
  name: 'configVocabularyHotDetail',
  mixins: [baseForm, baseHeader],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          cateName: value,
          id: this.form.form.id
        }
        this.$request.fetchHotWordCategorysUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('热词分类名称已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      headers: {
        buttons: [
          {
            type: 'Link',
            text: '热词管理',
            href: '/config/vocabulary/hot/manage/index',
            icon: 'reciguangli'
          },
          {
            type: 'Delete',
            text: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/hotWordCategorys', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '操作说明'
      },
      form: {
        labelWidth: '166px',
        api: 'fetchHotWordCategorysGet',
        params: {
          id: this.$route.query.id
        },
        form: {
          'id': '',
          'cateName': '',
          'channelId': [],
          'applyScope': 1
        },
        formItems: [
          {
            prop: 'cateName',
            label: '热词分类名称：',
            maxlength: 50,
            placeholder: '请输入热词分类名称'
          },
          {
            prop: 'applyScope',
            label: '应用范围：',
            type: 'checkbox',
            complex: true,
            defaultValue: 2,
            optionValue: 1,
            optionLabel: '所有栏目'
          },
          {
            prop: 'channelId',
            type: 'checkTree',
            labelWidth: '166px',
            hiddenKey: 'applyScope',
            hiddenValue: 2,
            tree: [],
            props: {
              children: 'children',
              label: 'name'
            }
          }
        ],
        rules: {
          cateName: [
            this.$rules.required(),
            { validator: nameUnique, trigger: ['change', 'blur'] }
          ],
          applyScope: [
            this.$rules.required()
          ],
          channelId: [
            this.$rules.required()
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/hotWordCategorys', 'PUT')
        }]
      }
    }
  },
  inject: ['removeTab'],
  methods: {
    // 发送请求事件
    fetchSysHotDelete (ids) {
      var params = {
        'ids': ids
      }
      this.$request.fetchHotWordCategorysDelete(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          setTimeout(() => {
            this.removeTab(this.$route.fullPath)
            this.$routerLink('/config/vocabulary/hot/index', 'list')
          }, 500)
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    // 顶部操作按钮
    handleHeaderDelete () {
      this.$confirm('是否确定删除该热词分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchSysHotDelete([this.form.form.id])
      }).catch(() => {})
    },
    handleConfirm (data) {
      console.log(data)
      this.form.loading = true
      if (data.orgids) {
        data.orgid = data.orgids[data.orgids.length - 1]
      }
      this.$request.fetchHotWordCategorysPut(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          setTimeout(() => {
            this.removeTab(this.$route.fullPath)
            this.$routerLink('/config/vocabulary/hot/index', 'list')
          }, 500)
        }
        this.hideFormLoading()
      }).catch(this.hideFormLoading)
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = Object.assign(this.form.form, res.data)
        this.form.form.channelId = res.data.channels.map(v => { return v.id })
      }
    },
    getTreeList () {
      this.$request.fetchChannelGetAllTree().then(res => {
        if (res.code === 200) {
          this.form.formItems.find(v => v.prop === 'channelId').tree = res.data
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.form.params = this.$route.query
      this.getTreeList()
      this.fetchFormApi()
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      if (newRoute.name === 'configVocabularyHotDetail') {
        const { id } = newRoute.query
        if (id && id !== this.form.params.id) {
          this.form.params.id = id
          this.fetchFormApi()
        }
      }
    }
  }

}
</script>
<style lang="scss">
.user-detail-container{
  .base-form-container{
    padding-top: 10px;
  }
  .el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
  .base-form-container {
    padding-top: 0;
  }
}
</style>
