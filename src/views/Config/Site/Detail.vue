<template>
  <jee-aside-layout class="config-site-detail-container">
    <section slot="asideHeader">
      <el-button
        size="medium"
        type='primary'
        class="drag-tree-btn"
        @click="handleHeaderRecycle()"
        :disabled="!_checkPermission('/sites/recycle', 'GET')"
      >
        <jee-icon iconClass="huishouzhan"></jee-icon>站点回收站
      </el-button>
    </section>
    <section slot="asideMain">
      <drag-tree v-bind="tree"
        @handleClick='handleClick'
        @handleSort="handleSort"
         v-if="tree.currentNodeKey"
      ></drag-tree>
    </section>
    <section class='content-wrap' slot="main"
      @mousewheel="handleWheel"
    >
      <base-header v-bind="myheaders"
       @handleNews="handleNews()"
       @handlePreview="handlePreview()"
       @handleBrowse="handleBrowse()"
       @handleRelease='handleRelease()'
       @handleMove="handleMove()"
       @handleShut="handleShut()"
       @handleDelete='handleDelete()'
       @handleJurisdiction='handleJurisdiction()'
       @handleCommandPermission='handlePermission'
      />
      <el-tabs v-model="activeTabName" class="tabs-box" @tab-click="tabsHandleClick">
        <el-tab-pane label="基本信息" name="basic">
            <base-form class="tabs-froms"
              ref='basicForm'
              v-bind="basicForm"
              :submitBtns='basicSubmitBtns'
              v-on:handleConfirm="handleConfirmBasic"
            >
            <template #domain="scope">
              <div class="agreement">
                <el-select popper-class="jee-border"
                  slot="prepend" v-model="basicForm.form.protocol" placeholder="请选择">
                  <el-option
                    v-for="item in scope.item.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-form-item class="size-wrap" style="margin-bottim: 0" prop="size">
                  <el-input
                    class="jee-input-append-select" maxlength="100"
                    v-model="basicForm.form.domain">
                    <template slot="append"><el-button class="jee-bg-light-important" @click="addHref" type="primary">添加</el-button></template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="agreement" v-for="(items, index) in basicForm.form.alias" :key="index">
                <el-select popper-class="jee-border"
                  slot="prepend" disabled v-model="basicForm.form.protocol" placeholder="请选择">
                  <el-option
                    v-for="item in scope.item.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-form-item class="size-wrap" style="margin-bottim: 0" prop="size">
                  <el-input
                    class="jee-input-append-select" v-model="items.herf" maxlength="100">
                    <template slot="append"><el-button class="jee-bg-light-important" @click="herfDelete(index)" type="primary">删除</el-button></template>
                  </el-input>
                </el-form-item>
              </div>
            </template>
            </base-form>
        </el-tab-pane>
        <el-tab-pane label="扩展配置" name="expand" class='expand'>
            <base-form class="tabs-froms"
              ref='expandForm'
              v-bind="expandForm"
              :formItems="expandFormItems"
              :submitBtns='extSubmitBtns'
              v-on:handleConfirm="handleConfirmExpand"
             v-on:getUrlWater="getUrlWater"
             @getUrlNewContent="getUrlNewContent"
            >
              <template #watermarkPosition="scope">
                <ul class="location-box">
                   <li class="location-children" v-for="(item, index) in scope.item.options" :class="{'location-children-on':expandForm.form.watermarkPosition === item.value} " :key="index" v-text="item.label" @click="location(item.value)"></li>
                </ul>
              </template>
              <template #toAddress="scope">
                <el-button @click="handleEmail" type="primary">邮箱校验</el-button>
              </template>
            </base-form>
            <div class="depiction" >
              <ul>
                <li v-for="(items, index) in getTitle" :key="index">
                    <a :href="'#'+items.titleID" class="jee-hover-color"
                      :class="{'jee-color': index === currentTitleIndex}" @click="currentTitleIndex = index"
                    >{{items.label}}</a>
                    <div class='circle' :class="{'jee-bg-light': index === currentTitleIndex}"></div>
                </li>
              </ul>
            </div>
        </el-tab-pane>
        <el-tab-pane label="默认模板设置" name="templates">
            <base-form class="tabs-froms"
              ref='templatesForm'
              v-bind="templatesForm"
              :formItems="getFormItems"
              :submitBtns='templateSubmitBtns'
              v-on:handleConfirm="handleConfirmTemplates"
            ></base-form>
        </el-tab-pane>
      </el-tabs>
      <form-dialog
          ref="addDialog"
          title="新建站点"
          :loading="addFormLoading"
          :form="addForm"
          :rules="addRules"
          :buttons="addButtons"
          :formItems="addFormItems"
          v-on:handleConfirm="handleConfirmAdd"
        >
        <template #domain="scope">
          <div class="agreement">
            <el-select popper-class="jee-border" size="small"
              slot="prepend" v-model="addForm.protocol" placeholder="请选择">
              <el-option
                v-for="item in scope.item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-form-item class="size-wrap" style="margin-left:5px" prop="size">
              <el-input
                class="jee-input-append-select" size="small"
                v-model="addForm.domain"  maxlength="50">
                <template slot="append"><el-button class="jee-bg-light-important" @click="addFormHref" type="primary">添加</el-button></template>
              </el-input>
            </el-form-item>
          </div>
          <div class="agreement" v-for="(items, index) in addForm.alias" :key="index" style="margin-top: 20px;">
            <el-select popper-class="jee-border" size="small"
              slot="prepend" disabled v-model="addForm.protocol" placeholder="请选择">
              <el-option
                v-for="item in scope.item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-form-item class="size-wrap" style="margin-left:5px" prop="size">
              <el-input
                class="jee-input-append-select" v-model="items.herf" maxlength="100" size="small">
                <template slot="append"><el-button class="jee-bg-light-important" @click="addFormDelete(index)" type="primary">删除</el-button></template>
              </el-input>
            </el-form-item>
          </div>
        </template>
      </form-dialog>
      <form-dialog class="email-dialog"
        ref="addDialogEmail"
        :buttons='dialogBtn'
        :loading="addFormLoadingEmail"
        :form="addFormEmail"
        title="邮箱检验"
        :rules="addRulesEmail"
        :formItems="addFormItemsEmail"
        v-on:handleConfirm="handleConfirmAddEmail"
      ></form-dialog>
      <table-dialog
        ref="recycleBin"
        v-bind="tablelist"
        @handleSelectionChange="handleTableDialogSelectionChange"
        @handleBtnDelete='recycleBinDelete'
        @handleBtnRestore='recycleBinRestore'
      ></table-dialog>
      <msg-dialog
        v-bind="msgDialog"
        v-on:handleConfirm="handleConfirmMsg"
        v-on:handleCancel="hideMsgDialog"
      />
    </section>
  </jee-aside-layout>
</template>

<script>
import sites from './sites'
import extend from './extend'
import template from './template'
import { deepClone } from '@/utils'
import {
  mapActions,
  mapGetters
} from 'vuex'
export default {
  name: 'configSiteDetail',
  mixins: [sites, extend, template],
  data () {
    return {
      id: null,
      parentId: '',
      path: '',
      activeTabName: 'basic',
      currentTitleIndex: 0,
      basicForm: {
        api: 'fetchSitesDetail',
        loading: false,
        params: {
          id: ''
        },
        labelWidth: '140px',
        form: {
          alias: [],
          id: '',
          name: '',
          image: '',
          iconPath: ''
        },
        formItems: [
          {
            type: 'title',
            label: '基本信息设置'
          },
          {
            type: 'text',
            prop: 'id',
            label: '站点ID：'
          },
          {
            type: 'cascader',
            prop: 'nodeSiteIds',
            label: '上级站点：',
            placeholder: '请选择上级站点',
            options: [],
            maxlength: 50,
            props: {
              label: 'name',
              value: 'id'
            },
            hidden: function (form) {
              return form.parentId !== null
            }
          },
          {
            prop: 'name',
            label: '站点名称：',
            placeholder: '请输入站点名称',
            maxlength: 20
          },
          {
            prop: 'path',
            label: '站点目录：',
            placeholder: '请输入站点目录',
            maxlength: 50
          },
          {
            type: 'slot',
            prop: 'domain',
            label: '域名：',
            placeholder: '请输入站点域名',
            maxlength: 100,
            options: [
              {
                value: 'http://',
                label: 'http://'
              },
              {
                value: 'https://',
                label: 'https://'
              }
            ]
          },
          {
            type: 'textarea',
            prop: 'description',
            label: '站点描述：',
            placeholder: '请输入站点描述',
            maxlength: 500
          },
          {
            type: 'radio',
            prop: 'isOpen',
            label: '站点状态：',
            options: [{
              label: '开启',
              value: true
            },
            {
              label: '关闭',
              value: false
            }]
          },
          {
            type: 'title',
            label: 'SEO设置'
          },
          {
            prop: 'seoTitle',
            label: 'SEO标题：',
            maxlength: 20,
            placeholder: '请输入SEO标题'
          },
          {
            prop: 'seoKeyword',
            label: 'SEO关键字：',
            maxlength: 50,
            placeholder: '请输入SEO关键字'
          },
          {
            prop: 'seoDescription',
            label: 'SEO描述：',
            maxlength: 500,
            placeholder: '请输入SEO描述'
          }
        ],
        rules: {
          name: [this.$rules.required()],
          protocol: [this.$rules.required()],
          domain: [
            this.$rules.required()
            // {
            //   validator: (rule, value, callback) => {
            //     if (value) {
            //       var params = {
            //         domain: value,
            //         id: this.id
            //       }
            //       this.$request.fetchSitesDomainUnique(params).then(res => {
            //         if (res.code === 200 && res.data) {
            //           callback()
            //         } else {
            //           callback(new Error('域名不能重复'))
            //         }
            //       })
            //     }
            //   },
            //   trigger: 'blur'
            // }
          ],
          iconId: [this.$rules.required()],
          isOpen: [this.$rules.required()],
          nodeSiteIds: [this.$rules.required()],
          path: [
            this.$rules.required(),
            {
              validator: (rule, value, callback) => {
                if (value) {
                  var params = {
                    path: value,
                    id: this.id
                  }
                  this.$request.fetchSitesPathUnique(params).then(res => {
                    if (res.code === 200 && res.data) {
                      callback()
                    } else {
                      callback(new Error('站点目录不能重复'))
                    }
                  })
                }
              },
              trigger: 'blur'
            }
          ]
        }
      },
      ftpOptions: [],
      ossOptions: [],
      addFormLoadingEmail: false,
      addFormEmail: {
        toAddress: ''
      },
      addRulesEmail: {
        toAddress: [this.$rules.required(), this.$rules.email(), this.$rules.max(50)]
      },
      addFormItemsEmail: [
        {
          prop: 'toAddress',
          label: '收件邮箱',
          placeholder: '请输入收件邮箱'
        }
      ],
      dialogBtn: [{ text: '发送', type: 'Submit' }],
      previewUrl: '',
      browseUrl: '',
      isOpen: null,
      isDelete: null
    }
  },
  inject: ['removeTab'],
  computed: {
    /* workflow-plugin start */
    ...mapGetters(['smsIsGloable', 'smsIsEnable', 'emailIsGloable', 'emailIsEnable', 'siteExtendConfig', 'workflowOptions']),
    /* workflow-plugin change ...mapGetters(['smsIsGloable', 'smsIsEnable', 'emailIsGloable', 'emailIsEnable', 'siteExtendConfig']), workflow-plugin change */
    /* workflow-plugin end */
    openStatic () {
      return this.siteExtendConfig && this.siteExtendConfig.cfg ? this.siteExtendConfig.cfg.openStatic : '0'
    },
    getTitle () {
      return this.expandFormItems.filter(value => {
        if (value.prop === 'smsTitle') return this.smsIsEnable === true
        if (value.prop === 'smtpTitle') return this.emailIsEnable === true
        return value.type === 'title'
      })
    },
    myheaders () {
      return {
        ...this.headers,
        buttons: [
          {
            type: 'News',
            text: '新建子站点',
            icon: 'xinjian',
            disabled: !this._checkPermission('/sites', 'POST') || (this.basicForm.form && !this.basicForm.form.newChildAble)
          },
          {
            type: 'Preview',
            text: '预览',
            icon: 'yulang',
            disabled: (this.basicForm.form && !this.basicForm.form.viewAble)
          },
          {
            type: 'Browse',
            text: '浏览',
            icon: 'liulan'
          },
          {
            type: 'Release',
            text: '发布静态页',
            icon: 'fabu',
            isHidden: this.openStatic !== '1',
            disabled: (this.basicForm.form && !this.basicForm.form.staticAble)
          },
          {
            type: 'Permission',
            text: '权限分配',
            icon: 'tongyong-xiugaimimatubiao',
            btnType: 'dropdown',
            btnProps: {
              type: 'empty'
            },
            options: [
              {
                value: '1',
                label: '站群权限分配'
              },
              {
                value: '0',
                label: '站点权限分配'
              }
            ],
            disabled: (this.basicForm.form && !this.basicForm.form.permAssignAble)
          },
          {
            type: 'Shut',
            text: this.isOpen ? '关闭' : '开启',
            icon: 'jianqu',
            disabled: (this.basicForm.form && !this.basicForm.form.openCloseAble)
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: this.parentId === null || !this._checkPermission('/sites', 'DELETE') || (this.basicForm.form && !this.basicForm.form.deleteAble)
          }
        ],
        showAlertIcon: false
      }
    },
    basicSubmitBtns () {
      return [{
        text: '保存',
        subType: 'submit',
        disabled: !this._checkPermission('/sites', 'PUT') || (this.basicForm.form && !this.basicForm.form.editAble)
      }]
    },
    /* workflow-plugin start */
    getWorkOptions () {
      return this.workflowOptions
    },
    /* workflow-plugin end */
    extSubmitBtns () {
      return [{
        text: '保存',
        subType: 'submit',
        disabled: !this._checkPermission('/sites/ext', 'PUT') || (this.basicForm.form && !this.basicForm.form.editAble)
      }]
    },
    templateSubmitBtns () {
      return [{
        text: '保存',
        subType: 'submit',
        disabled: !this._checkPermission('/sites/model', 'PUT') || (this.basicForm.form && !this.basicForm.form.editAble)
      }]
    }
  },
  methods: {
    /* workflow-plugin start */
    ...mapActions('config', ['FetchWorkFlowOptions']),
    /* workflow-plugin end */
    ...mapActions('system', ['FetchEmailDetail']),
    // 预览
    handlePreview () {
      if (this.previewUrl) {
        window.open(this.previewUrl)
      } else {
        this.$message('没有预览地址')
      }
    },
    // 浏览
    handleBrowse () {
      if (this.browseUrl) {
        window.open(this.browseUrl)
      } else {
        this.$message('没有浏览地址')
      }
    },
    // 发布静态页
    handleRelease () {
      this.$routerLink('/config/site/static?id=' + this.id)
    },
    // 关闭
    handleShut () {
      var ids = []
      ids.push(this.id)
      if (this.isOpen) {
        this.$request.fetchsitesOff({ ids }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '关闭成功',
              type: 'success'
            })
            this.fetchSitesbutton()
            this.fetchSitesDetail()
          }
        })
      } else {
        this.$request.fetchsitesOn({ ids }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '开启成功',
              type: 'success'
            })
            this.fetchSitesbutton()
            this.fetchSitesDetail()
          }
        })
      }
    },
    // 删除
    handleDelete () {
      this.$confirm('是否确定删除此站点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = []
        ids.push(Number(this.id))
        this.$request.fetchSitesDelete({ ids }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            if (this.id === this.siteId) this.FetchSitesOwnsite(true)
            this.removeTab(this.$route.fullPath)
            this.$routerLink('/config/site/index', 'list')
          }
        })
      })
    },
    // 点击站点
    handleClick (data) {
      this.id = data.id
      this.$router.push({ query: { id: data.id } })
      /* workflow-plugin start */
      this.FetchWorkFlowOptions({ flowCate: 2, siteId: data.id })
      /* workflow-plugin end */
      this.activeTabName = 'basic'
      this.tabsHandleClick()
      this.fetchSitesbutton()
    },
    // 保存基本信息
    handleConfirmBasic (data) {
      data.domainAlias = ''
      if (data.alias.length > 0) {
        for (var i = 0; i < data.alias.length; i++) {
          if (i === data.alias.length - 1) {
            data.domainAlias += data.alias[i].herf
          } else {
            data.domainAlias += data.alias[i].herf += ','
          }
        }
      }
      data.parentId = data.nodeSiteIds[data.nodeSiteIds.length - 1]
      let params = deepClone(data)
      params.protocol = this.$encode(data.protocol)
      params.url = this.$encode(data.url)
      params.domain = this.$encode(data.domain)
      params.path = this.$encode(data.path)
      params.previewUrl = this.$encode(data.previewUrl)
      params.domainAlias = this.$encode(data.domainAlias)
      this.$request.fetchSitesUpdate(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.fetchSiteseList()
          this.fetchSitesbutton()
        }
      })
    },
    // tebs页面切换
    tabsHandleClick () {
      if (this.activeTabName === 'basic') {
        this.fetchSitesDetail()
      } else if (this.activeTabName === 'expand') {
        this.fetchSitesExtDetail()
      } else if (this.activeTabName === 'templates') {
        this.fetchSitesModelDetail()
      }
    },
    // 打开新建子站点
    handleNews () {
      this.addForm.parentId = this.id
      this.addForm.parentName = this.basicForm.form.name
      this.addForm.protocol = 'https://'
      this.$refs.addDialog.showDialog()
    },
    // 获取站点内容
    fetchFormCallBack (res) {
      if (res.code === 200) {
      }
    },
    // 添加子站点
    addHref () {
      var newHerf = { herf: '' }
      this.basicForm.form.alias.push(newHerf)
    },
    // 删除子站点
    herfDelete (index) {
      this.basicForm.form.alias.splice(index, 1)
    },
    // 跳转权限分配
    handlePermission (val) {
      switch (val) {
        case '1':
          this.$routerLink('/config/site/permission/siteGroup?id=' + this.id)
          break
        default:
          this.$routerLink('/config/site/permission/site?id=' + this.id)
          break
      }
    },
    // 接口信息
    // 站点联级选择器
    fetchSitesChilds () {
      this.$request.fetchSitesChilds().then(res => {
        if (res.code === 200) {
          const loop = function (data, siteId) {
            if (data instanceof Array && data.length) {
              return data.map(d => {
                if (d.id === siteId || !d.newChildAble) {
                  d.disabled = true
                }
                if (d.children instanceof Array && d.children.length) {
                  loop(d.children, siteId)
                }
                return d
              })
            }
          }
          this.basicForm.formItems.find(d => d.prop === 'nodeSiteIds').options = loop(res.data, this.id)
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    // 获得站点基础信息
    fetchSitesDetail () {
      var id = this.id
      this.basicForm.loading = true
      this.$request.fetchSitesDetail({ id }).then(res => {
        if (res.code === 200) {
          this.basicForm.form = res.data
          this.fetchSitesChilds()
        }
        this.basicForm.loading = false
      }).catch(() => {
        this.basicForm.loading = false
      })
    },
    // 获得站点按钮信息
    fetchSitesbutton () {
      var id = this.id
      this.$request.fetchSitesDetail({ id }).then(res => {
        if (res.code === 200 && res.data) {
          this.path = res.data.protocol + res.data.path
          this.previewUrl = res.data.previewUrl
          this.browseUrl = res.data.url
          this.isOpen = res.data.isOpen
          this.parentId = res.data.parentId
        }
      })
    },
    // 获得站点扩展信息
    fetchSitesExtDetail () {
      var id = this.id
      this.expandForm.loading = true
      this.$request.fetchSitesExtDetail({ id }).then(res => {
        if (res.code === 200) {
          this.expandForm.form = res.data.cfg
          this.expandForm.form.platform = []
          this.expandForm.form.commentFlowId = res.data.cmsSiteExt.commentFlowId
          this.expandForm.form.staticPageFtpId = res.data.cmsSiteExt.staticPageFtpId
          this.expandForm.form.staticPageOssId = res.data.cmsSiteExt.staticPageOssId
          this.expandForm.form.uploadFtpId = res.data.cmsSiteExt.uploadFtpId
          this.expandForm.form.uploadOssId = res.data.cmsSiteExt.uploadOssId
          this.expandForm.form.uploadPicSuffixUp = res.data.uploadPicSuffix
          this.expandForm.form.uploadVideoSuffixUp = res.data.uploadVideoSuffix
          this.expandForm.form.uploadAudioSuffixUp = res.data.uploadAudioSuffix
          this.expandForm.form.uploadDocumentSuffixUp = res.data.uploadDocumentSuffix
          this.expandForm.form.surveyConfigurationId = res.data.cfg.surveyConfigurationId ? Number(res.data.cfg.surveyConfigurationId) : ''
          this.expandForm.form.siteId = res.data.id
          // this.expandForm.form.newContentId = res.data.cfg && res.data.cfg.newContentResourceId ? res.data.cfg.newContentResourceId : ''
          if (res.data.cfg.openPcStatic) {
            if (res.data.cfg.openPcStatic === '1') {
              this.expandForm.form.platform.push('1')
            }
          }
          if (res.data.cfg.openMobileStatic) {
            if (res.data.cfg.openMobileStatic === '1') {
              this.expandForm.form.platform.push('2')
            }
          }
          if (res.data.cfg.staticServerMemory) {
            if (res.data.cfg.staticServerMemoryType === 'ftp') {
              this.expandForm.form.ftpStaticServerMemory = Number(this.expandForm.form.staticServerMemory)
              this.expandForm.form.ossStaticServerMemory = ''
            } else if (res.data.cfg.staticServerMemoryType === 'oss') {
              this.expandForm.form.ossStaticServerMemory = Number(this.expandForm.form.staticServerMemory)
              this.expandForm.form.ftpStaticServerMemory = ''
            }
          }
          if (res.data.cfg.uploadFileMemory) {
            if (res.data.cfg.uploadFileMemoryType === 'ftp') {
              this.expandForm.form.ftpUploadFileMemory = Number(this.expandForm.form.uploadFileMemory)
              this.expandForm.form.ossUploadFileMemory = ''
            } else if (res.data.cfg.uploadFileMemoryType === 'oss') {
              this.expandForm.form.ossUploadFileMemory = Number(this.expandForm.form.uploadFileMemory)
              this.expandForm.form.ftpUploadFileMemory = ''
            }
          }
          this.expandForm.form.smsIsEnable = this.smsIsEnable
          this.expandForm.form.emailIsEnable = this.emailIsEnable
          // console.log(this.expandForm.form)
        }
        this.expandForm.loading = false
      }).catch(() => {
        this.expandForm.loading = false
      })
    },
    // 获得站点模板设置信息
    fetchSitesModelDetail () {
      var id = this.id
      this.templatesForm.loading = true
      this.$request.fetchSitesModelDetail({ id }).then(res => {
        if (res.code === 200) {
          // 改变模板设置信息数据结构
          this.handleTemplateDetail(res.data)
          this.changeTemplates()
        }
        this.templatesForm.loading = false
      }).catch(() => {
        this.templatesForm.loading = false
      })
    },
    // 获得FTP下拉数据
    fetchFtpList () {
      this.$request.fetchFtpList().then(res => {
        if (res.code === 200) {
          this.ftpOptions = res.data
        }
      })
    },
    // 获得oss下拉数据
    fetchOssList () {
      this.$request.fetchOssList().then(res => {
        if (res.code === 200) {
          this.ossOptions = res.data
        }
      })
    },
    smsIsGloableHandler () {
      this.expandForm.form.smsIsEnable = this.smsIsEnable
      if (this.smsIsGloable === null) return
      const that = this // serviceProviders
      const props = ['smsTitle', 'accesskeyId', 'accesskeySecret', 'messageSignatures']
      props.forEach(d => {
        const item = this.expandForm.formItems.find(f => f.prop === d)
        if (item) {
          item.disabled = that.smsIsGloable
        }
      })
    },
    emailIsGloableHandler () {
      this.expandForm.form.emailIsEnable = this.emailIsEnable
      if (this.emailIsGloable === null) return
      const props = ['smtpTitle', 'SMTPService', 'SMTPPort', 'sendAccount', 'emailPassword', 'sslUse', 'toAddress']
      this.expandForm.formItems.forEach(d => {
        if (props.includes(d.prop)) {
          d.disabled = this.emailIsGloable
        }
      })
    },
    // 滚动
    handleWheel (e) {
      const that = this
      const box = document.querySelectorAll('.expand .form-item-title')
      // 滚动条高度
      var windowHeight = document.documentElement.clientHeight
      for (var i = box.length - 1; i >= 0; i--) {
        var top = box[i].getBoundingClientRect().top
        if (top < windowHeight && top > 120) {
          that.currentTitleIndex = i
          // console.log(i)
          // console.log('第' + i + '个区域可见')
        }
      }
    },
    // 获取水印图片
    getUrlWater (data, prop) {
      this.expandForm.form.watermarResourceId = data.id
      this.expandForm.form.watermarkResourceId = data.id
      this.expandForm.form.watermarkPicture = data.id
      this.expandForm.form.watermarkPictureUrl = data.url
    },
    getUrlNewContent (data) {
      console.log(data)
      this.expandForm.form.newContentId = data.id
      this.expandForm.form.newContentResourceId = data.id
      this.expandForm.form.newContentResourceUrl = data.url
      // newContentResourceUrl
    }
  },
  activated () {
    const { id, isAdd } = this.$route.query
    if (id && Number(id) !== this.id) {
      this.id = Number(id)
      if (isAdd) {
        this.activeTabName = 'expand'
      }
      this.tabsHandleClick()
      this.fetchSitesbutton()
      /* workflow-plugin start */
      this.FetchWorkFlowOptions({ flowCate: 2, siteId: id })
      /* workflow-plugin end */
      this.setSiteId('')
      this.$nextTick(() => {
        this.setSiteId(id)
      })
    }
  },
  updated () {
    const { id, isAdd } = this.$route.query
    if (id && Number(id) !== this.id) {
      this.id = Number(id)
      if (isAdd) {
        this.activeTabName = 'expand'
      }
      this.tabsHandleClick()
      /* workflow-plugin start */
      this.FetchWorkFlowOptions({ flowCate: 2, siteId: id })
      /* workflow-plugin end */
      this.fetchSitesbutton()
      this.setSiteId('')
      this.$nextTick(() => {
        this.setSiteId(id)
      })
    }
  },
  mounted () {
    this.id = Number(this.$route.query.id)
    this.fetchSiteseList()
    this.fetchSitesbutton()
    this.fetchFtpList()
    this.fetchOssList()
    this.FetchEmailDetail()
    this.smsIsGloableHandler()
    this.emailIsGloableHandler()
    /* workflow-plugin start */
    this.FetchWorkFlowOptions({ flowCate: 2, siteId: this.$route.query.id || '' })
    /* workflow-plugin end */
    this.tabsHandleClick()
    this.setSiteId('')
    this.$nextTick(() => {
      this.setSiteId(this.id)
    })
  },
  watch: {
    smsIsGloable (newData) {
      this.smsIsGloableHandler()
    },
    emailIsGloable (newData) {
      this.emailIsGloableHandler()
    },
    smsIsEnable (newData) {
      this.smsIsGloableHandler()
    },
    emailIsEnable (newData) {
      this.emailIsGloableHandler()
    },
    /* workflow-plugin start */
    workflowOptions (newData) {
      this.expandForm.formItems.find(d => d.prop === 'surveyConfigurationId').options = newData
    },
    /* workflow-plugin end */
    // 'expandForm.form.serviceProviders': function (newData) {
    //   if (newData === '1') {
    //     this.expandForm.formItems.find(d => d.prop === 'accesskeyId').href = 'https://www.aliyun.com/product/sms'
    //   } else if (newData === '2') {
    //     this.expandForm.formItems.find(d => d.prop === 'accesskeyId').href = 'https://cloud.tencent.com/product/sms'
    //   }
    // },
    'expandForm.form.uploadFileMemoryType': function (newData) {
      if (newData === 'ftp') {
        this.expandForm.formItems.find(d => d.prop === 'ftpUploadFileMemory').options = this.ftpOptions
      } else if (newData === 'oss') {
        this.expandForm.formItems.find(d => d.prop === 'ossUploadFileMemory').options = this.ossOptions
      }
    },
    'expandForm.form.staticServerMemoryType': function (newData) {
      if (newData === 'ftp') {
        this.expandForm.formItems.find(d => d.prop === 'ftpStaticServerMemory').options = this.ftpOptions
      } else if (newData === 'oss') {
        this.expandForm.formItems.find(d => d.prop === 'ossStaticServerMemory').options = this.ossOptions
      }
    },
    'addForm.name': function (newData, oldData) {
      if (newData && newData !== oldData) {
        this.$request.fetchPinyin({ text: newData }).then(r => {
          if (r.code === 200) {
            this.addForm.path = r.data
          }
        })
      } else {
        this.addForm.path = ''
      }
    }
  }
}
</script>

<style lang="scss">
.config-site-detail-container{
  height: calc(100vh - 140px);
  background-color: #ffffff;
  display: flex;
  .drag-tree-btn{
    padding-left: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(232,232,232,1);
  }
  .content-wrap{
    padding-top: 11px;
    .agreement{
      display: flex;
      .el-select{
        width: 110px;
      }
      .el-form-item{
        width: 300px;
        margin-left: 5px;
        button{
          width: 100%;
        }
      }
      .el-input-group__append{
        width: 63px;
        text-align: center;
      }
    }
    .agreement + .agreement{
      padding-top: 10px;
    }
    .agreement:last-child{
      height: 40px;
    }
    .location-box{
      width:144px;
      height:97px;
      background:rgba(249,249,249,1);
      border:1px solid rgba(226,226,226,1);
      border-radius:4px;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap ;
      padding-top: 7px;
    }
    .location-children{
      width:37px;
      height:22px;
      border:1px dashed rgba(226,226,226,1);
      border-radius:2px;
      text-align: center;
      line-height: 22px;
      font-size: 12px;
      color: #666666;
      cursor:pointer;
    }
    .location-children:hover{
      border:1px dashed #1EC6DF;
      color: #1EC6DF;
    }
    .location-children-on{
      background-color: #1EC6DF !important;
      color: #ffffff !important;
      border: solid 1px #1EC6DF !important;
    }
  }
  .depiction{
    position: fixed;
    right: 78px;
    top: 50%;
    transform: translateY(-50%);
    border-right:#e8e8e8 1px solid;
    padding: 40px 24px 40px 0;
    li{
      position: relative;
    }
    a{
      font-size: 14px;
      display: block;
      width: 150px;
      text-align: right;
      color: #666666;
      line-height: 31px;
    }
    .circle{
      position: absolute;
      top: 7px;
      right: -32px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
    }
  }
  .form-dialog-container .agreement{
    display: flex;
    .el-select{
      width: 110px;
    }
    .el-form-item{
      width: 185px;
      margin-bottom: 0 !important;
    }
  }
}

</style>
