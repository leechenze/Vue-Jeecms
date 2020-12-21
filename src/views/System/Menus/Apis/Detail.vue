<template>
  <section class="apis-detail-container">
    <base-header v-bind="headers"
      v-on:handleBack="handleBack"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
    ></base-form>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import { mapActions } from 'vuex'
import { deepClone } from '@/utils'

export default {
  name: 'menusApisDetail',
  mixins: [baseHeader, baseForm],
  data () {
    return {
      backUrl: '/system/menus/apis/index',
      headers: {
        buttons: [
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/apis', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      form: {
        api: 'fetchApisDetail',
        params: {
          id: ''
        },
        form: {
          id: '',
          requestMethod: '',
          apiName: '',
          apiUrl: '',
          useScene: ''
        },
        formItems: [
          {
            prop: 'apiName',
            label: '接口名称：',
            placeholder: '请输入接口名称',
            maxlength: 50
          },
          {
            prop: 'apiUrl',
            label: '接口地址：',
            placeholder: '请输入接口地址',
            maxlength: 120
          },
          {
            type: 'select',
            prop: 'requestMethod',
            label: '请求方式：',
            placeholder: '请选择',
            options: this.$enums.method
          },
          {
            prop: 'useScene',
            label: '使用场景：',
            placeholder: '请输入使用场景',
            maxlength: 75
          }
        ],
        rules: {
          requestMethod: [
            this.$rules.required()
          ],
          apiName: [
            this.$rules.required()
          ],
          apiUrl: [
            this.$rules.required(),
            {
              validator: (rule, value, callback) => {
                if (value) {
                  var params = {
                    url: value,
                    id: this.form.params.id,
                    requestMethod: this.form.form.requestMethod
                  }
                  this.$request.fetchApisUnique(params).then(res => {
                    if (res.code === 200 && res.data) {
                      callback()
                    } else {
                      callback(new Error('API地址不能重复'))
                    }
                  })
                }
              },
              trigger: 'blur'
            }
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/apis', 'PUT')
        }]
      }
    }
  },
  inject: ['removeTab'],
  methods: {
    ...mapActions('system', ['ReflushApi']),
    // 顶部操作按钮
    handleHeaderDelete () {
      this._confirmDelete().then(() => {
        this.fetchApisDelete([this.form.form.id])
      })
    },
    handleConfirm (data) {
      this.form.loading = true
      /* hyt-link s */
      let params = deepClone(data)
      params.apiUrl = this.$encode(params.apiUrl)
      /* hyt-link e */
      this.$request.fetchApisUpdate(params).then(res => {
        this.hideFormLoading()
        if (res.code === 200) {
          this._messageSuccess('save')
          this.ReflushApi(true)
          this.removeTab(this.$route.fullPath)
          this.$router.replace({ name: 'menusApisIndex' }).catch(()=>{});//把error 抛出来
        }
      }).catch(this.hideFormLoading)
    },
    // 发送请求事件
    fetchApisDelete (ids) {
      this.$request.fetchApisDelete(ids).then(res => {
        if (res.code === 200) {
          this._messageSuccess('delete')
          this.ReflushApi(true)
          this.removeTab(this.$route.fullPath)
          this.$router.replace({ name: 'menusApisIndex' }).catch(()=>{});//把error 抛出来
        }
      })
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.$set(this.form, 'form', res.data)
      }
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.form.params.id = id
    this.fetchFormApi()
  },
  activated () {
    const { id } = this.$route.query
    if (id && id !== this.form.params.id) {
      this.form.params.id = id
      this.fetchFormApi()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
