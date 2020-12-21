<template>
  <section class="menus-detail-container">
    <base-header v-bind="headers"
      v-if="$route.query.id"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-header v-else v-bind="headers2"/>
    <base-form
      ref="form"
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
      @handleConfirmContinue="handleContinue"
    >
      <template v-slot:icon="scope">
        <el-input v-model="scope.form[scope.item.prop]" placeholder="请输入图标">
          <template slot="prepend">
            <jee-icon :iconClass='scope.form[scope.item.prop]' style='fill: #787878'/>
          </template>
          <el-button slot="append" class="jee-bg-light-important" size="small" @click="handleShowIconDialog">选择</el-button>
        </el-input>
      </template>
      <template #apis="scope">
        <div class="apis-list-wrap">
          <el-button type="primary" size="small" width="82px" @click="handleShowApisDialog">
            请选择
          </el-button>
          <div class="apis-list">
            <template v-for="(item, index) in scope.form[scope.item.prop]">
              <span class="api-item jee-hover-border-important jee-hover-color" :key="index">
                <span>{{item.apiName}}：</span>
                <span>{{item.apiUrl}}</span>
                <i class="el-icon-close" @click="()=>handleDeleteApi(index)"></i>
              </span>
            </template>
          </div>
        </div>
      </template>
    </base-form>
    <icon-dialog
      ref="iconDialog"
      v-bind="iconDialog"
      @handleSelectIcon="handleChangeIcon"
    ></icon-dialog>
    <select-dialog
      ref="apisDialog"
      v-bind="selectDialog"
      :selectedRows="form.form.apis"
      @handleSelectionChange="handleSelectDialogSelectionChange"
      @handleSizeChange="handleSelectDialogSizeChange"
      @handleCurrentChange="handleSelectDialogCurrentChange"
      @handleSearch="handleSearchs"
      @handleDeleteChecked="handleDeleteChecked"
    ></select-dialog>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import iconDialog from '@/components/mixins/iconDialog'
import selectDialog from '@/components/mixins/selectDialog'
import { mapActions } from 'vuex'
import { deepClone } from '@/utils'

export default {
  name: 'menusMenusDetail',
  mixins: [baseHeader, baseForm, iconDialog, selectDialog],
  data () {
    const columns = [
      {
        prop: 'apiName',
        label: 'API名称'
      },
      {
        prop: 'apiUrl',
        label: 'API地址',
        formatter: (row, column, cellValue, index) => {
          const method = this.$enums.getLabel('method', row.requestMethod)
          return `【${method}】${cellValue}`
        }
      },
      {
        prop: 'useScene',
        label: '描述',
        width: '197px'
      }
    ]
    return {
      backUrl: '/system/menus/menus/index',
      iconDialog: {
        list: [
          'gongzuotai',
          'neirongguanli',
          'langmuguanli',
          'peizhi',
          'hudong',
          'shejiaomeiti',
          'huiyuan',
          'shujutongji',
          'xitong'
        ]
      },
      selectDialog: {
        title: 'API权限设置',
        width: '778px',
        api: 'fetchApisList',
        columns,
        params: {
          apiName: '',
          apiUrl: '',
          apiUrle: ''
        },
        filterParams: ['apiUrle'],
        searchHeader: {
          searchItems: [
            {
              type: 'input',
              value: 'apiName',
              placeholder: 'API名称'
            },
            {
              type: 'searchInput',
              value: 'apiUrle',
              placeholder: 'API地址'
            }
          ]
        }
      },
      headers: {
        buttons: [
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/menus', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      headers2: {
        title: '操作说明',
        content: '这里是菜单管理'
      },
      form: {
        api: 'fetchMenusDetail',
        params: {
          id: ''
        },
        form: {
          id: '',
          icon: '',
          menuName: '',
          menuType: 1,
          component: 'component',
          parentIds: [],
          sortNum: '',
          name: '',
          path: '',
          hidden: true,
          isAuth: true,
          apis: [
            // {
            //   id: '',
            //   apiName: '',
            //   apiUrl: ''
            // }
          ]
        },
        formItems: [
          {
            type: 'cascader',
            prop: 'parentIds',
            label: '上级菜单：',
            placeholder: '请选择',
            clearable: true,
            props: {
              value: 'id',
              label: 'menuName',
              children: 'children',
              checkStrictly: true
            },
            options: []
          },
          {
            prop: 'menuName',
            label: '菜单名称：',
            placeholder: '请输入菜单名称',
            maxlength: 50
          },
          {
            prop: 'name',
            label: '菜单标识：',
            placeholder: '请输入菜单标识',
            maxlength: 50,
            hiddenKey: 'menuType',
            hiddenValue: 1
          },
          {
            prop: 'path',
            label: '路由地址：',
            placeholder: '请输入路由地址',
            maxlength: 50,
            hiddenKey: 'menuType',
            hiddenValue: 1
          },
          {
            type: 'switch',
            prop: 'hidden',
            label: '是否显示：',
            enableText: '显示',
            disableText: '隐藏',
            hiddenKey: 'menuType',
            hiddenValue: 1
          },
          {
            type: 'switch',
            prop: 'isAuth',
            label: '是否权限控制：',
            enableText: '开启',
            disableText: '关闭'
          },
          {
            type: 'select',
            prop: 'menuType',
            label: '菜单类型：',
            options: [
              {
                value: 1,
                label: '菜单'
              },
              {
                value: 2,
                label: '权限'
              }
            ]
          },
          {
            prop: 'sortNum',
            label: '排序值：'
          },
          {
            type: 'slot',
            prop: 'icon',
            label: 'Icon图标：',
            hiddenKey: 'menuType',
            hiddenValue: 1
          },
          {
            type: 'slot',
            prop: 'apis',
            label: 'API权限：'
          }
        ],
        rules: {
          name: [
            this.$rules.required(),
            this.$rules.enNumLine(),
            {
              validator: (rule, value, callback) => {
                if (value) {
                  var params = {
                    name: value,
                    id: this.form.params.id
                  }
                  this.$request.fetchMenusNameUnique(params).then(res => {
                    if (res.code === 200 && res.data) {
                      callback()
                    } else {
                      callback(new Error('菜单标识不能重复'))
                    }
                  })
                }
              },
              trigger: 'blur'
            }
          ],
          menuName: [
            this.$rules.required()
          ],
          path: [
            this.$rules.required(),
            this.$rules.path(),
            {
              validator: (rule, value, callback) => {
                if (value) {
                  var params = {
                    routing: this.$encode(value),
                    id: this.form.params.id
                  }
                  this.$request.fetchMenusUnique(params).then(res => {
                    if (res.code === 200 && res.data) {
                      callback()
                    } else {
                      callback(new Error('路由路径不能重复'))
                    }
                  })
                }
              },
              trigger: 'blur'
            }
          ],
          sortNum: [
            this.$rules.required(),
            this.$rules.number(),
            this.$rules.rangeNum(1, 99)
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/menus', 'PUT')
        }]
      }
    }
  },
  inject: ['removeTab'],
  methods: {
    ...mapActions('system', ['ReflushMenus']),
    // 顶部操作按钮
    handleHeaderDelete () {
      this._confirmDelete().then(() => {
        this.fetchMenusDelete([this.form.form.id])
      })
    },
    // 保存提交
    handleConfirm (data) {
      let params = deepClone(data)
      this.form.loading = true
      params.parentId = data.parentIds[data.parentIds.length - 1]
      params.hidden = !data.hidden
      params.apiIds = data.apis.map(d => d.id)
      delete params.apis
      delete params.parentIds
      if (params.menuType === 2) {
        params.path = ''
        params.name = ''
        params.hidden = true
      }
      /* hyt-link s */
      params.component = this.$encode(params.component)
      params.path = this.$encode(params.path)
      params.redirect = this.$encode(params.redirect)
      /* hyt-link e */
      const api = this.form.params.id ? 'fetchMenusUpdate' : 'fetchMenusCreate'
      this.$request[api](params).then(res => {
        this.hideFormLoading()
        if (res.code === 200) {
          this.$refs.form.resetFields()
          this._messageSuccess(data.id ? 'save' : 'create')
          this.ReflushMenus(true)
          this.fetchMenusList()
          this.removeTab(this.$route.fullPath)
          this.$router.replace({ name: 'menusMenusIndex' }).catch(()=>{});//把error 抛出来
        }
      }).catch(this.hideFormLoading)
    },
    // 新增继续
    handleContinue (data) {
      this.form.loading = true
      let params = deepClone(data)
      params.parentId = data.parentIds[data.parentIds.length - 1]
      params.hidden = !data.hidden
      params.apiIds = data.apis.map(d => d.id)
      delete params.apis
      delete params.parentIds
      if (params.menuType === 2) {
        params.path = ''
        params.name = ''
        params.hidden = true
      }
      /* hyt-link s */
      params.component = this.$encode(params.component)
      params.path = this.$encode(params.path)
      params.redirect = this.$encode(params.redirect)
      /* hyt-link e */
      const api = this.form.params.id ? 'fetchMenusUpdate' : 'fetchMenusCreate'
      this.$request[api](params).then(res => {
        this.hideFormLoading()
        if (res.code === 200) {
          // this.$refs.form.resetFields()
          this._messageSuccess('create')
          this.ReflushMenus(true)
          this.fetchMenusList()
        }
      }).catch(this.hideFormLoading)
    },
    // 发送请求事件
    fetchMenusDelete (ids) {
      this.$request.fetchMenusDelete(ids).then(res => {
        if (res.code === 200) {
          this._messageSuccess('delete')
          this.ReflushMenus(true)
          this.fetchMenusList()
          this.removeTab(this.$route.fullPath)
          this.$router.replace({ name: 'menusMenusIndex' }).catch(()=>{});//把error 抛出来
        }
      })
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        res.data.hidden = !res.data.hidden
        this.$set(this.form, 'form', res.data)
        this.selectDialog.selectedKeys = res.data.apis.map(d => d.id)
      }
    },
    fetchSelectDialogCallBack (res) {
      if (res.code === 200) {
        this.selectDialog.data = res.data.content
        this.selectDialog.totalCount = res.data.totalElements
        this.selectDialog.params.apiUrl = this.$decode(this.selectDialog.params.apiUrl)
      }
    },
    // 弹出框事件
    handleShowIconDialog () {
      this.$refs.iconDialog.showDialog()
    },
    handleChangeIcon (icon) {
      this.form.form.icon = icon
    },
    handleShowApisDialog () {
      this.$refs.apisDialog.showDialog()
      setTimeout(() => {
        this.handleSearchs()
      }, 100)
    },
    handleSearchs () {
      this.selectDialog.params.apiUrl = this.$encode(this.selectDialog.params.apiUrle)
      setTimeout(() => {
        this.handleSelectSearch()
      }, 100)
    },
    handleDeleteApi (index) {
      this.form.form.apis.splice(index, 1)
    },
    handleDeleteChecked (keys) {
      this.form.form.apis = this.form.form.apis.filter(d => !keys.includes(d.id))
    },
    // 选择表格行后更新事件
    handleAddSelectedRows (row) {
      if (!this.form.form.apis.find(r => r.id === row.id)) {
        this.form.form.apis.push(row)
      }
    },
    handleDelSelectedRows (row) {
      const index = this.form.form.apis.findIndex(r => r.id === row.id)
      if (index >= 0) {
        this.form.form.apis.splice(index, 1)
      }
    },
    // 上级菜单下拉数据，id为当前id的禁用选择
    fetchMenusList () {
      const id = this.form.params.id
      this.$request.fetchMenusList().then(res => {
        if (res.code === 200) {
          const loop = function (d) {
            if (d.id === id) {
              d.disabled = true
            }
            if (d.children instanceof Array && d.children.length) {
              d.children = d.children.map(loop)
            } else {
              delete d.children
            }
            return d
          }
          this.form.formItems.filter(d => d.prop === 'parentIds')[0].options = res.data.map(loop)
        }
      })
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.form.params.id = id
    this.fetchFormApi()
    this.fetchMenusList()
  },
  activated () {
    const { id } = this.$route.query
    if (id) {
      this.form.params.id = id
      this.fetchFormApi()
    }
    this.fetchMenusList()
  }
}
</script>
<style lang="scss" scoped>
.menus-detail-container{
  .apis-list{
    color: #666666;
    display: flex;
    flex-direction: column;
    width: 414px;
    .api-item{
      font-size: 14px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      line-height: 22px;
      padding: 10px 30px 10px 10px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      margin-top: 10px;
      position: relative;
      span:last-of-type{
        flex: 1;
      }
      i{
        cursor: pointer;
        position: absolute;
        right: 10px;
      }
    }
  }
}
</style>
