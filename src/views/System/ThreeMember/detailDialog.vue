<template>
  <section class="three-member-detail-dialog">
    <el-dialog
      class="detail-dialog "
      :title="title"
      :visible.sync="showLog"
      :width="width"
      :before-close="dialogClose">
      <!-- 栏目 -->
      <div class="column " v-if="itemDetail.operating === 26" :style="{'padding-bottom':itemDetail.status === 1?'52px':'0'}">
        <el-tabs v-loading='channel.loading' :value="channel.currentTab" @tab-click="handleChannelTabs">
          <template v-for="(tab, index) in getTabs">
            <el-tab-pane :label="tab.label" :name="tab.name" :key="index">
              <component  v-if="detail.id" :is="tab.component" name="channelId" :value="detail.id"
                :key="index" :label-width="channel.labelWidth" :dataType="channel.dataType"
                :detailForm="detailForm" :detail="detail"/>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
      <!-- 站点 -->
      <div class="site" v-else :style="{'padding-bottom':itemDetail.status === 1?'47px':'0'}">
        <el-tabs v-model="site.activeTabName" class="tabs-box">
          <el-tab-pane label="基本信息" name="basic" v-if="itemDetail.siteType === 1">
              <base-form class="tabs-froms"
                ref='basicForm'
                v-bind="site.basicForm"
              >
                <template #domain="scope">
                  <div class="agreement">
                    <el-select popper-class="jee-border"
                      slot="prepend" v-model="site.basicForm.form.protocol" placeholder="请选择">
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
                        v-model="site.basicForm.form.domain">
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="agreement" v-for="(items, index) in site.basicForm.form.alias" :key="index">
                    <el-select popper-class="jee-border"
                      slot="prepend" disabled v-model="site.basicForm.form.protocol" placeholder="请选择">
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
                      </el-input>
                    </el-form-item>
                  </div>
                </template>
              </base-form>
          </el-tab-pane>
          <el-tab-pane label="扩展配置" name="expand" v-if="itemDetail.siteType === 2">
              <base-form class="tabs-froms"
                ref='expandForm'
                v-bind="site.expandForm"
                :formItems="expandFormItems"
                disabled
              >
                <template #watermarkPosition="scope">
                  <ul class="location-box">
                    <li class="location-children" v-for="(item, index) in scope.item.options"
                      :class="{'location-children-on':site.expandForm.form.watermarkPosition === item.value} " :key="index"
                      v-text="item.label" ></li>
                  </ul>
                </template>
              </base-form>
          </el-tab-pane>
          <el-tab-pane label="默认模板设置" name="templates" v-if="itemDetail.siteType === 3">
              <base-form class="tabs-froms"
                ref='templatesForm'
                v-bind="site.templatesForm"
                :formItems="getFormItems"
                disabled
              ></base-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="detail-footer" v-if="itemDetail.status === 1&&showBtn">
        <el-button type="primary" size="small" @click="handleApproved()">审核通过</el-button>
        <el-button type="primary" size="small" @click="handleAuditFailed()">审核不通过</el-button>
        <el-button  size="small" @click="dialogClose">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import BaseInfo from './Form/BaseInfo'
import ExtendConfig from './Form/ExtendConfig'
import SeoInfo from './Form/SeoInfo'
import baseForm from '@/components/mixins/baseForm'
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: 'detail-dialog',
  components: {
    BaseInfo,
    ExtendConfig,
    SeoInfo
  },
  mixins: [baseForm],
  data () {
    return {
      showBtn: true,
      showLog: false,
      title: '',
      id: '',
      detail: {},
      detailForm: {},
      itemDetail: {},
      width: '692px',
      tabs: [
        {
          label: '基本信息',
          name: 'base',
          component: 'BaseInfo'
        },
        {
          label: '扩展配置',
          name: 'extend',
          component: 'ExtendConfig'
        },
        {
          label: 'SEO信息',
          name: 'seo',
          component: 'SeoInfo'
        }
      ],
      channel: {
        loading: false,
        currentTab: 'base',
        columnData: {},
        dataType: 2,
        labelWidth: 'auto'
      },
      site: {
        activeTabName: 'basic',
        currentTitleIndex: 0,
        basicForm: {
          api: 'fetchSitesDetail',
          disabled: true,
          loading: false,
          params: {
            id: ''
          },
          labelWidth: '115px',
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
              class: 'line1',
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
              itemClass: 'margin-bottom10',
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
          submitBtns: []
        },
        templatesForm: {
          api: 'fetchSitesDetail',
          loading: false,
          params: {
            id: ''
          },
          labelWidth: '105px',
          form: {
            id: '',
            pcSolution: '',
            mobileSolution: '',
            mobileHomePageTemplates: '',
            pcHomePageTemplates: ''
          },
          formItems: [
            {
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
          submitBtns: []
        },
        expandForm: {
          api: 'fetchSitesDetail',
          titleDepiction: true,
          loading: false,
          params: {
            id: null
          },
          labelWidth: '245px',
          form: {
            watermarkPosition: '',
            uploadDocumentSizeType: '1',
            uploadAttachmentSizeType: '1',
            uploadAudioSizeType: '1',
            uploadVideoSizeType: '1',
            uploadPicSizeType: '1'
          },
          formItems: [
            {
              type: 'title',
              enabled: true,
              label: '内容配置',
              titleID: 'content'
            },
            {
              type: 'select',
              prop: 'titleRepeat',
              itemClass: 'margin-bottom10',
              label: '内容标题重复设置：',
              placeholder: '请选择内容标题重复设置',
              maxlength: 50,
              options: [{
                label: '允许重复',
                value: '1'
              },
              {
                label: '站点内不允许重复',
                value: '2'
              },
              {
                label: '同一栏目下不允许重复',
                value: '3'
              }]

            },
            {
              type: 'radio',
              prop: 'contentCommitAllowUpdate',
              itemClass: 'margin-bottom5',
              label: '已发布内容允许编辑：',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }],
              popoverText: '选为否时，只有将已发布的内容下线后才能进行编辑'
            },
            // {
            //   type: 'radio',
            //   prop: 'contentAutoSave',
            //   label: '是否开启内容自动保存：',
            //   options: [{
            //     label: '是',
            //     value: '1'
            //   },
            //   {
            //     label: '否',
            //     value: '0'
            //   }],
            //   popoverText: '选择是否自动保存编辑器中的内容'
            // },
            {
              type: 'radio',
              prop: 'contentSaveVersion',
              itemClass: 'margin-bottom5',
              label: '保存内容时自动保存版本：',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }],
              popoverText: '设为是，保存内容时会自动保存当前版本'
            },
            {
              type: 'radio',
              prop: 'openContentNewFlag',
              itemClass: 'margin-bottom5',
              label: '是否开启新内容标记：',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }]
            },
            {
              type: 'inputSelect',
              prop: 'contentNewFlag',
              label: '新内容定义：',
              selectObj: {
                prop: 'contentNewFlagType',
                options: [{
                  label: '天',
                  value: '1'
                }, {
                  label: '小时',
                  value: '2'
                }]
              },
              appendText: ' ',
              unit: '内发布的为新内容',
              maxlength: 10,
              hiddenKey: 'openContentNewFlag',
              hiddenValue: '1'
            },
            {
              prop: 'newContentResourceId',
              label: '新内容标志：',
              type: 'imageUpload',
              urlProp: 'newContentResourceUrl',
              option: {
                isSingleImage: true,
                desc: '(请上传png、jpg、jpeg、gif格式的图片)',
                type: ['png', 'jpg', 'jpeg', 'gif'],
                width: 32,
                height: 32
              },
              hiddenKey: 'openContentNewFlag',
              hiddenValue: '1'
            },
            {
              type: 'radio',
              prop: 'contentLikeLogin',
              class: 'margin-bottom10',
              label: '点赞是否需要登录',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }]
            },
            {
              type: 'title',
              enabled: true,
              label: '水印配置',
              titleID: 'watermark'
            },
            {
              type: 'radio',
              prop: 'watermarkSet',
              label: '水印状态：',
              options: [{
                label: '使用图片水印',
                value: '1'
              },
              {
                label: '使用文字水印',
                value: '2'
              },
              {
                label: '不使用水印',
                value: '3'
              }]
            },
            {
              prop: 'watermarkTxt',
              label: '水印文字：',
              placeholder: '请输入水印文字',
              hiddenKey: 'watermarkSet',
              hiddenValue: '2',
              maxlength: 10
            },
            {
              prop: 'watermarkTxtSize',
              label: '文字大小：',
              placeholder: '请输入文字大小',
              hiddenKey: 'watermarkSet',
              appendText: ' ',
              explain: '文字大小建议在12~30之间',
              unit: 'PX',
              hiddenValue: '2',
              maxlength: 10
            },
            {
              type: 'color',
              prop: 'watermarkTxtColour',
              label: '文字颜色：',
              hiddenKey: 'watermarkSet',
              appendText: '建议使用白色',
              hiddenValue: '2',
              maxlength: 10
            },
            {
              prop: 'watermarkTxtTransparency',
              label: '透明度：',
              placeholder: '请输入数值',
              hiddenKey: 'watermarkSet',
              appendText: ' ',
              explain: '请输入1-100间的整数，数值越小透明度越高',
              unit: '%',
              hiddenValue: '2',
              maxlength: 10
            },
            {
              type: 'imageUpload',
              prop: 'watermarkResourceId',
              label: '水印图片：',
              urlProp: 'watermarkPictureUrl',
              hiddenKey: 'watermarkSet',
              appendText: '请上传水印图片',
              hiddenValue: '1',
              maxlength: 10
            },
            {
              type: 'slot',
              prop: 'watermarkPosition',
              label: '水印位置：',
              appendText: '请选择水印位置',
              hidden: function (from) {
                return from.watermarkSet === '1' || from.watermarkSet === '2'
              },
              maxlength: 50,
              options: [{
                value: '1',
                label: '左上'
              }, {
                value: '2',
                label: '上'
              }, {
                value: '3',
                label: '右上'
              }, {
                value: '4',
                label: '左'
              }, {
                value: '5',
                label: '中'
              }, {
                value: '6',
                label: '右'
              }, {
                value: '7',
                label: '左下'
              }, {
                value: '8',
                label: '下'
              }, {
                value: '9',
                label: '右下'
              }]
            },
            {
              type: 'title',
              enabled: true,
              label: '栏目配置',
              titleID: 'column'
            },
            {
              type: 'radio',
              prop: 'channelDisplayList',
              itemClass: 'margin-bottom5',
              label: '栏目默认显示在循环列表：',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }]
            },
            {
              type: 'radio',
              prop: 'channelNameRepeat',
              itemClass: 'margin-bottom5',
              label: '栏目名称允许重复：',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }]
            },
            {
              type: 'radio',
              prop: 'channelVisitLimitType',
              itemClass: 'margin-bottom5',
              label: '栏目及内容页浏览设置：',
              options: [{
                label: '都不需要登录',
                value: '1'
              },
              {
                label: '仅内容页需要登录',
                value: '2'
              },
              {
                label: '都需要登录',
                value: '3'
              }],
              popoverText: '若设置了整个站点需要登录，则此处以及栏目、内容中的设置将无效，都需要登录才能访问'
            },
            {
              type: 'radio',
              prop: 'channelNormalLimitContribute',
              label: '栏目默认允许投稿：',
              itemClass: 'margin-bottom10',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }]
            },
            {
              type: 'number',
              prop: 'channelDisplayContentNumber',
              label: '内容列表每页默认显示内容数：',
              min: 1,
              max: 200,
              appendText: '请输入1-200间的整数'
            },
            {
              type: 'title',
              enabled: true,
              label: '静态化配置',
              titleID: 'static'
            },
            {
              type: 'radio',
              prop: 'openStatic',
              itemClass: 'margin-bottom5',
              label: '是否开启静态服务：',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }]
            },
            {
              type: 'checkbox',
              prop: 'platform',
              label: '静态页发布平台：',
              itemClass: 'margin-bottom10',
              hiddenKey: 'openStatic',
              hiddenValue: '1',
              options: [{
                label: 'PC端',
                value: '1'
              },
              {
                label: '手机wap端',
                value: '2'
              }],
              popoverText: '选择静态页需要发布的平台，若未选择PC端，通过PC端访问时将会访问动态页面,静态页发布平台最少要选择一个。'
            },
            {
              type: 'select',
              prop: 'staticHtmlSuffix',
              label: '静态文件后缀：',
              itemClass: 'margin-bottom10',
              hiddenKey: 'openStatic',
              hiddenValue: '1',
              placeholder: '请选择静态文件后缀',
              maxlength: 50,
              options: [{
                label: 'html',
                value: 'html'
              },
              {
                label: 'shtml',
                value: 'shtml'
              }]
            },
            {
              type: 'radio',
              prop: 'staticServerMemoryType',
              label: '静态文件存储服务器：',
              itemClass: 'margin-bottom5',
              hiddenKey: 'openStatic',
              hiddenValue: '1',
              options: [{
                label: '本地服务器',
                value: 'local'
              },
              {
                label: 'FTP',
                value: 'ftp'
              },
              {
                label: 'OSS云存储',
                value: 'oss'
              }],
              popoverText: '当使用集群部署时，指定静态html文件的存储位置'
            },
            {
              type: 'select',
              optionLabel: 'ftpName',
              optionValue: 'id',
              prop: 'ftpStaticServerMemory',
              label: 'ftp：',
              hiddenKeys: ['openStatic', 'staticServerMemoryType'],
              hiddenValues: ['1', 'ftp'],
              options: []
            },
            {
              type: 'select',
              optionLabel: 'ossName',
              optionValue: 'id',
              prop: 'ossStaticServerMemory',
              label: 'OSS云存储：',
              hiddenKeys: ['openStatic', 'staticServerMemoryType'],
              hiddenValues: ['1', 'oss'],
              options: []
            },
            {
              type: 'radio',
              prop: 'staticAutoIndex',
              hiddenKey: 'openStatic',
              hiddenValue: '1',
              itemClass: 'margin-bottom5',
              label: '发布内容时自动生成首页静态页：',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }]
            },
            {
              type: 'radio',
              prop: 'staticAutoChannel',
              hiddenKey: 'openStatic',
              hiddenValue: '1',
              itemClass: 'margin-bottom10',
              label: '发布内容时自动生成栏目静态页：',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }],
              popoverText: '选择是，在发布内容时会自动生成其所属栏目的静态页面。'
            },
            {
              prop: 'staticAutoChannelPage',
              label: '生成静态内容列表页数：',
              hiddenKey: 'openStatic',
              hiddenValue: '1',
              popoverText: '若栏目页中提取了内容分页列表，会按照此项配置决定自动生成静态列表的页数，此项配置仅作用于自动生成静态页，手动生成静态栏目页时会生成所有分页页数，默认为10页，留空为不限制。',
              maxlength: 10
            },
            {
              type: 'title',
              enabled: true,
              label: '评论配置',
              titleID: 'comment'
            },
            {
              type: 'radio',
              prop: 'commentSet',
              itemClass: 'margin-bottom10',
              label: '评论设置：',
              options: [{
                label: '允许游客评价',
                value: '1'
              },
              {
                label: '允许登录后评论',
                value: '2'
              },
              {
                label: '不允许评论',
                value: '3'
              }]
            },
            {
              type: 'number',
              prop: 'commentCycle',
              itemClass: 'margin-bottom10',
              label: '评论周期（秒）：',
              popoverText: '设置多长时间内评论一次0为不限制',
              hidden: function (form) {
                return form.commentSet === '1' || form.commentSet === '2'
              }
            },
            {
              type: 'radio',
              prop: 'commentAudit',
              itemClass: 'margin-bottom0',
              label: '评论是否需要审核：',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }],
              hidden: function (form) {
                return form.commentSet === '1' || form.commentSet === '2'
              }
            },
            {
              type: 'radio',
              prop: 'commentAllowedLink',
              label: '是否允许输入链接：',
              options: [{
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }],
              hiddenFunc: function (form) {
                return form.commentSet === '1' || form.commentSet === '2'
              }
            },
            {
              prop: 'commentLink',
              label: '链接替换为：',
              placeholder: '请输入替换链接',
              // hiddenKeys: ['commentAllowedLink', 'commentSet'],
              // hiddenValues: ['1', '1' || '2'],
              maxlength: 20,
              hiddenFunc: function (form) {
                return (form.commentSet === '1' || form.commentSet === '2') && form.commentAllowedLink === '1'
              }
            },
            {
              type: 'title',
              enabled: true,
              prop: 'smsTitle',
              label: '短信服务配置',
              hiddenKey: 'smsIsEnable',
              hiddenValue: true,
              popoverText: '设置后所有短信都会通过此账号发送',
              titleID: 'note'
            },
            {
              type: 'radio',
              prop: 'serviceProviders',
              label: '服务商：',
              hiddenKey: 'smsIsEnable',
              hiddenValue: true,
              options: [{
                label: '阿里云',
                value: '1'
              },
              {
                label: '腾讯云',
                value: '2'
              }]
            },
            {
              prop: 'accesskeyId',
              label: 'AccessKeyID/AppID：',
              type: 'textarea',
              height: '100px',
              hiddenKey: 'smsIsEnable',
              hiddenValue: true,
              placeholder: '请输入AccessKeyID/AppID',
              href: 'https://cloud.tencent.com/product/sms',
              hrefText: '点击获取AccessKey和AccessKeySecret',
              maxlength: 255
            },
            {
              prop: 'accesskeySecret',
              label: 'AccessKeySecret/AppKey：',
              type: 'textarea',
              height: '100px',
              hiddenKey: 'smsIsEnable',
              hiddenValue: true,
              placeholder: '请输入AccessKeySecret/AppKey',
              maxlength: 1500
            },
            {
              prop: 'messageSignatures',
              label: '短信签名：',
              hiddenKey: 'smsIsEnable',
              hiddenValue: true,
              placeholder: '请输入短信签名',
              maxlength: 1500
            },
            {
              type: 'title',
              enabled: true,
              prop: 'smtpTitle',
              label: '邮件服务配置',
              hiddenKey: 'emailIsEnable',
              hiddenValue: true,
              popoverText: '设置后所有邮件都会通过此账号发送',
              titleID: 'email'
            },
            {
              prop: 'SMTPService',
              label: 'SMTP服务器：',
              placeholder: '请输入SMTP服务器',
              hiddenKey: 'emailIsEnable',
              hiddenValue: true,
              appendText: '设置 SMTP 邮件服务器主机地址，不推荐使用QQ个人邮箱',
              maxlength: 20
            },
            {
              prop: 'SMTPPort',
              label: 'SMTP端口：',
              placeholder: '请输入SMTP端口',
              hiddenKey: 'emailIsEnable',
              hiddenValue: true,
              appendText: '邮件服务器端口，25默认http协议，465默认为https协议，推荐使用465',
              maxlength: 10
            },
            {
              prop: 'sendAccount',
              label: '发件账号：',
              hiddenKey: 'emailIsEnable',
              hiddenValue: true,
              placeholder: '请输入发件账号',
              maxlength: 30
            },
            {
              prop: 'emailPassword',
              label: '邮箱密码：',
              hiddenKey: 'emailIsEnable',
              hiddenValue: true,
              placeholder: '请输入邮箱密码',
              appendText: '一般为验证邮箱密码，如果使用网易邮箱，请填写授权码',
              maxlength: 30,
              showPassword: true
            },
            {
              prop: 'sslUse',
              label: '是否使用SSL协议：',
              type: 'radio',
              hiddenKey: 'emailIsEnable',
              hiddenValue: true,
              options: [
                {
                  value: '1',
                  label: '是'
                },
                {
                  value: '0',
                  label: '否'
                }
              ]
            },
            {
              prop: 'toAddress',
              hiddenKey: 'emailIsEnable',
              hiddenValue: true,
              type: 'slot'
            },
            {
              type: 'title',
              enabled: true,
              label: '站点访问配置',
              titleID: 'site'
            },
            {
              prop: 'loginSuccessVisitSite',
              itemClass: 'margin-bottom0',
              label: '登录后才能访问站点：',
              type: 'radio',
              options: [
                {
                  value: '1',
                  label: '是'
                },
                {
                  value: '0',
                  label: '否'
                }
              ],
              popoverText: '若设置了整个站点需要登录，栏目和内容中的设置将无效，都需要登录才能访问'
            },
            {
              prop: 'urlRelative',
              label: '是否使用相对路径：',
              type: 'radio',
              options: [
                {
                  value: '1',
                  label: '是'
                },
                {
                  value: '0',
                  label: '否'
                }
              ],
              appendText: '选择“否”表示使用绝对路径'
            },
            {
              type: 'title',
              enabled: true,
              label: '会员登录跳转配置',
              titleID: 'member'
            },
            {
              prop: 'memberRedirectAssign',
              label: '会员登录成功后跳转至指定地址：',
              type: 'radio',
              options: [
                {
                  value: '1',
                  label: '是'
                },
                {
                  value: '0',
                  label: '否'
                }
              ]
            },
            {
              prop: 'memberRedirectUrl',
              label: '请输入指定地址：',
              placeholder: '请输入地址',
              hiddenKey: 'memberRedirectAssign',
              hiddenValue: '1',
              maxlength: 30
            },
            /* workflow-plugin start */
            {
              type: 'title',
              enabled: true,
              label: '网络调查配置',
              titleID: 'surveyConfig'
            },
            {
              type: 'select',
              prop: 'surveyConfigurationId',
              label: '工作流：',
              clearable: true,
              options: []
            },
            /* workflow-plugin end */
            {
              type: 'title',
              enabled: true,
              label: '网站群推送配置',
              titleID: 'siteGroup'
            },
            {
              prop: 'sitePushOpen',
              label: '是否接受网站群推送：',
              class: 'margin-bottom10',
              type: 'radio',
              options: [
                {
                  value: '1',
                  label: '是'
                },
                {
                  value: '0',
                  label: '否'
                }
              ]
            },
            {
              prop: 'sitePushSecret',
              label: '密钥：',
              itemClass: 'margin-bottom10',
              placeholder: '请输入密钥',
              hiddenKey: 'sitePushOpen',
              hiddenValue: '1',
              maxlength: 100
            },
            {
              prop: 'siteAcquOpen',
              label: '是否允许网站群采集：',
              type: 'radio',
              options: [
                {
                  value: '1',
                  label: '是'
                },
                {
                  value: '0',
                  label: '否'
                }
              ]
            },
            {
              prop: 'siteAcquSecret',
              label: '密钥：',
              placeholder: '请输入密钥',
              hiddenKey: 'siteAcquOpen',
              hiddenValue: '1',
              maxlength: 100
            },
            {
              type: 'title',
              enabled: true,
              label: '统计配置',
              titleID: 'statistics'
            },
            {
              prop: 'openSiteStatistic',
              label: '是否开启站内统计：',
              itemClass: 'margin-bottom0',
              type: 'radio',
              options: [
                {
                  value: '1',
                  label: '是'
                },
                {
                  value: '0',
                  label: '否'
                }
              ]
            },
            {
              prop: 'openThirdStatistic',
              label: '是否使用第三方统计：',
              type: 'radio',
              options: [
                {
                  value: '1',
                  label: '是'
                },
                {
                  value: '0',
                  label: '否'
                }
              ]
            },
            {
              prop: 'thirdStatisticCode',
              type: 'textarea',
              label: '第三方统计代码：',
              placeholder: '请输入第三方统计代码',
              hiddenKey: 'openThirdStatistic',
              hiddenValue: '1',
              maxlength: 255
            },
            {
              type: 'title',
              enabled: true,
              label: '文件上传配置',
              titleID: 'folder'
            },
            {
              type: 'select',
              prop: 'uploadPicSuffixUp',
              label: '允许上传的图片文件类型：',
              multiple: true,
              collapseTags: true,
              options: [{
                label: 'jpg',
                value: 'jpg'
              },
              {
                label: 'jpeg',
                value: 'jpeg'
              },
              {
                label: 'png',
                value: 'png'
              },
              {
                label: 'gif',
                value: 'gif'
              },
              {
                label: 'bmp',
                value: 'bmp'
              },
              {
                label: 'psd',
                value: 'psd'
              }]
            },
            {
              type: 'inputSelect',
              prop: 'uploadPicSize',
              label: '单张图片文件大小限制：',
              maxlength: 10,
              selectObj: {
                prop: 'uploadPicSizeType',
                options: [{
                  label: 'KB',
                  value: '1'
                }, {
                  label: 'MB',
                  value: '2'
                }]
              },
              appendText: '“0”表示不限制，默认为0'
            },
            {
              type: 'select',
              prop: 'uploadVideoSuffixUp',
              label: '允许上传的视频文件类型：',
              multiple: true,
              collapseTags: true,
              options: [{
                label: 'mp4',
                value: 'mp4'
              },
              {
                label: 'rmvb',
                value: 'rmvb'
              },
              {
                label: '3gp',
                value: '3gp'
              },
              {
                label: 'mkv',
                value: 'mkv'
              },
              {
                label: 'wmv',
                value: 'wmv'
              },
              {
                label: 'flv',
                value: 'flv'
              },
              {
                label: 'm4v',
                value: 'm4v'
              },
              {
                label: 'mov',
                value: 'mov'
              }]
            },
            {
              type: 'inputSelect',
              prop: 'uploadVideoSize',
              label: '单个视频文件大小限制：',
              maxlength: 10,
              selectObj: {
                prop: 'uploadVideoSizeType',
                options: [{
                  label: 'KB',
                  value: '1'
                }, {
                  label: 'MB',
                  value: '2'
                }]
              },
              appendText: '“0”表示不限制，默认为0'
            },
            {
              type: 'select',
              prop: 'uploadAudioSuffixUp',
              label: '允许上传的音频文件类型：',
              multiple: true,
              collapseTags: true,
              options: [{
                label: 'mp3',
                value: 'mp3'
              },
              {
                label: 'wav',
                value: 'wav'
              },
              {
                label: 'ogg',
                value: 'ogg'
              },
              {
                label: 'acc',
                value: 'acc'
              }]
            },
            {
              type: 'inputSelect',
              prop: 'uploadAudioSize',
              label: '单个音频文件大小限制：',
              maxlength: 10,
              selectObj: {
                prop: 'uploadAudioSizeType',
                options: [{
                  label: 'KB',
                  value: '1'
                }, {
                  label: 'MB',
                  value: '2'
                }]
              },
              appendText: '“0”表示不限制，默认为0'
            },
            {
              type: 'select',
              prop: 'uploadDocumentSuffixUp',
              label: '允许上传的文档类型：',
              multiple: true,
              collapseTags: true,
              options: [{
                label: 'doc',
                value: 'doc'
              },
              {
                label: 'docx',
                value: 'docx'
              },
              {
                label: 'xls',
                value: 'xls'
              },
              {
                label: 'xlsx',
                value: 'xlsx'
              },
              {
                label: 'txt',
                value: 'txt'
              },
              {
                label: 'wps',
                value: 'wps'
              },
              {
                label: 'ppt',
                value: 'ppt'
              },
              {
                label: 'pptx',
                value: 'pptx'
              },
              {
                label: 'pdf',
                value: 'pdf'
              }]
            },
            {
              type: 'inputSelect',
              prop: 'uploadDocumentSize',
              label: '单个文档大小限制：',
              maxlength: 10,
              selectObj: {
                prop: 'uploadDocumentSizeType',
                options: [{
                  label: 'KB',
                  value: '1'
                }, {
                  label: 'MB',
                  value: '2'
                }]
              },
              appendText: '“0”表示不限制，默认为0'
            },
            {
              type: 'select',
              prop: 'uploadAttachmentSuffixType',
              label: '允许上传的附件类型：',
              options: [{
                label: '不限制',
                value: '1'
              },
              {
                label: '设置允许类型',
                value: '2'
              },
              {
                label: '设置禁止类型',
                value: '3'
              }]
            },
            {
              prop: 'uploadAttachmentSuffix',
              hiddenKey: 'uploadAttachmentSuffixType',
              maxlength: 100,
              hiddenValue: '2',
              placeholder: '多个类型以逗号隔开'
            },
            {
              prop: 'uploadAttachmentSuffix',
              hiddenKey: 'uploadAttachmentSuffixType',
              maxlength: 10,
              hiddenValue: '3',
              placeholder: '多个类型以逗号隔开'
            },
            {
              type: 'inputSelect',
              prop: 'uploadAttachmentSize',
              itemClass: 'margin-bottom10',
              label: '单个附件大小限制：',
              maxlength: 10,
              selectObj: {
                prop: 'uploadAttachmentSizeType',
                options: [{
                  label: 'KB',
                  value: '1'
                }, {
                  label: 'MB',
                  value: '2'
                }]
              },
              appendText: '“0”表示不限制，默认为0'
            },
            {
              type: 'radio',
              prop: 'uploadFileMemoryType',
              label: '上传文件存储服务器：',
              options: [{
                label: '本地服务器',
                value: 'local'
              },
              {
                label: 'FTP',
                value: 'ftp'
              },
              {
                label: 'OSS云存储',
                value: 'oss'
              }],
              popoverText: '当使用集群部署时，指定上传文件的存储位置'
            },
            {
              type: 'select',
              optionLabel: 'ftpName',
              optionValue: 'id',
              prop: 'ftpUploadFileMemory',
              label: 'ftp：',
              hiddenKey: 'uploadFileMemoryType',
              hiddenValue: 'ftp',
              options: []
            },
            {
              type: 'select',
              optionLabel: 'ossName',
              optionValue: 'id',
              prop: 'ossUploadFileMemory',
              label: 'OSS云存储：',
              hiddenKey: 'uploadFileMemoryType',
              hiddenValue: 'oss',
              options: []
            }
          ],
          submitBtns: []
        },
        pcColumns: [],
        pcContents: [],
        telColumns: [],
        telContents: [],
        ftpOptions: [],
        ossOptions: []
      }

    }
  },
  computed: {
    /* workflow-plugin start */
    ...mapGetters(['smsIsEnable', 'emailIsEnable', 'workflowOptions']),
    /* workflow-plugin change ...mapGetters(['smsIsEnable', 'emailIsEnable']), workflow-plugin change */
    /* workflow-plugin end */
    getTabs () {
      let include = []
      if (this.detail && this.detail.renderingField) {
        const { formListBase, formListExtend, formListSeo } = this.detail.renderingField
        if (formListBase instanceof Array && formListBase.length) {
          include.push('base')
        }
        if (formListExtend instanceof Array && formListExtend.length) {
          include.push('extend')
        }
        if (formListSeo instanceof Array && formListSeo.length) {
          include.push('seo')
        }
      }
      return this.tabs.filter(t => include.includes(t.name))
    },
    getTitle () {
      return this.expandFormItems.filter(value => {
        if (value.prop === 'smsTitle') return this.smsIsEnable === true
        if (value.prop === 'smtpTitle') return this.emailIsEnable === true
        return value.type === 'title'
      })
    },
    expandFormItems () {
      let { path, query } = this.$route
      let title = path + '?'
      delete query.titleID
      Object.keys(query).forEach((d, i) => {
        title += `${d}=${query[d]}&`
      })
      title += 'titleID='
      let formItems = []
      this.site.expandForm.formItems.forEach(d => {
        if (d.type === 'title' && d.enabled && d.titleID) {
          formItems.push({
            ...d,
            titleID: title + d.titleID
          })
        } else {
          formItems.push(d)
        }
      })
      return formItems
    },
    getFormItems () {
      let formItems = [...this.site.templatesForm.formItems]
      this.site.pcColumns.forEach(d => {
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
      this.site.pcContents.forEach(d => {
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
      this.site.telColumns.forEach(d => {
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
      this.site.telContents.forEach(d => {
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
    },
    /* workflow-plugin start */
    getWorkOptions () {
      return this.workflowOptions
    }
    /* workflow-plugin end */
  },
  watch: {
    /* workflow-plugin start */
    workflowOptions (newData) {
      this.site.expandForm.formItems.find(d => d.prop === 'surveyConfigurationId').options = newData
    },
    /* workflow-plugin end */
    'site.ftpOptions': function (newData) {
      if (this.site.expandForm.form.uploadFileMemoryType === 'ftp') {
        this.site.expandForm.formItems.find(d => d.prop === 'ftpUploadFileMemory').options = this.site.ftpOptions
      }
      if (this.site.expandForm.form.staticServerMemoryType === 'ftp') {
        this.site.expandForm.formItems.find(d => d.prop === 'ftpStaticServerMemory').options = this.site.ftpOptions
      }
    },
    'site.ossOptions': function (newData) {
      if (this.site.expandForm.form.uploadFileMemoryType === 'oss') {
        this.site.expandForm.formItems.find(d => d.prop === 'ossUploadFileMemory').options = this.site.ossOptions
      }
      if (this.site.expandForm.form.staticServerMemoryType === 'oss') {
        this.site.expandForm.formItems.find(d => d.prop === 'ossStaticServerMemory').options = this.site.ossOptions
      }
    }
  },
  methods: {
    /* workflow-plugin start */
    ...mapActions('config', ['FetchWorkFlowOptions']),
    /* workflow-plugin end */
    // 关闭弹窗
    dialogClose () {
      this.showLog = false
    },
    // 显示弹窗
    showTheDialog (item, type) {
      this.title = item.operating === 26 ? '栏目详情' : '站点详情'
      this.width = item.operating === 26 ? '720px' : (item.siteType === 2 ? '992px' : '692px')
      this.id = item.id
      this.site.activeTabName = item.siteType === 1 ? 'basic' : (item.siteType === 2 ? 'expand' : 'templates')
      this.itemDetail = Object.assign({}, item)
      this.getData(item.id)
      this.showBtn = type !== 'detail'
      this.showLog = true
    },
    // 点击切换栏目
    handleChannelTabs (tab) {
      this.channel.currentTab = tab.name
      this.channel.labelWidth = ''
      this.$nextTick(() => {
        this.channel.labelWidth = 'auto'
      })
    },
    // 获取详情
    getData (id) {
      this.$request.fetAuditOperateGet({ id: id }).then(res => {
        if (res.code === 200) {
          this.detail = res.data
          if (this.itemDetail.operating === 26) {
            this.getFieldData(res.data)
          } else {
            if (this.itemDetail.siteType === 2) {
              this.fetchFtpList()
              this.fetchOssList()
              /* workflow-plugin start */
              this.FetchWorkFlowOptions({ flowCate: 2, siteId: res.data.id })
              /* workflow-plugin end */
              this.site.expandForm.form = res.data.cfg
              this.site.expandForm.form.platform = []
              this.site.expandForm.form.commentFlowId = res.data.cmsSiteExt.commentFlowId
              // this.site.expandForm.form.newContentResourceId = res.data.cmsSiteExt.newContentResourceId
              // this.site.expandForm.form.newContentResourceId = res.data.cfg.contentNewFlagDefinition
              // newContentResourceId
              this.site.expandForm.form.staticPageFtpId = res.data.cmsSiteExt.staticPageFtpId
              this.site.expandForm.form.staticPageOssId = res.data.cmsSiteExt.staticPageOssId
              this.site.expandForm.form.uploadFtpId = res.data.cmsSiteExt.uploadFtpId
              this.site.expandForm.form.uploadOssId = res.data.cmsSiteExt.uploadOssId
              this.site.expandForm.form.uploadPicSuffixUp = res.data.uploadPicSuffix
              this.site.expandForm.form.uploadVideoSuffixUp = res.data.uploadVideoSuffix
              this.site.expandForm.form.uploadAudioSuffixUp = res.data.uploadAudioSuffix
              this.site.expandForm.form.uploadDocumentSuffixUp = res.data.uploadDocumentSuffix
              this.site.expandForm.form.surveyConfigurationId = res.data.cfg.surveyConfigurationId ? Number(res.data.cfg.surveyConfigurationId) : ''
              this.site.expandForm.form.siteId = res.data.id
              this.site.expandForm.form.watermarkPictureUrl = res.data.cfg.watermarkPictureUrl

              if (res.data.cfg.openPcStatic) {
                if (res.data.cfg.openPcStatic === '1') {
                  this.site.expandForm.form.platform.push('1')
                }
              }
              if (res.data.cfg.openMobileStatic) {
                if (res.data.cfg.openMobileStatic === '1') {
                  this.site.expandForm.form.platform.push('2')
                }
              }
              if (res.data.cfg.staticServerMemory) {
                if (res.data.cfg.staticServerMemoryType === 'ftp') {
                  this.site.expandForm.form.ftpStaticServerMemory = Number(this.site.expandForm.form.staticServerMemory)
                  this.site.expandForm.form.ossStaticServerMemory = ''
                } else if (res.data.cfg.staticServerMemoryType === 'oss') {
                  this.site.expandForm.form.ossStaticServerMemory = Number(this.site.expandForm.form.staticServerMemory)
                  this.site.expandForm.form.ftpStaticServerMemory = ''
                }
              }
              if (res.data.cfg.uploadFileMemory) {
                if (res.data.cfg.uploadFileMemoryType === 'ftp') {
                  this.site.expandForm.form.ftpUploadFileMemory = Number(this.site.expandForm.form.uploadFileMemory)
                  this.site.expandForm.form.ossUploadFileMemory = ''
                } else if (res.data.cfg.uploadFileMemoryType === 'oss') {
                  this.site.expandForm.form.ossUploadFileMemory = Number(this.site.expandForm.form.uploadFileMemory)
                  this.site.expandForm.form.ftpUploadFileMemory = ''
                }
              }
              this.site.expandForm.form.smsIsEnable = this.smsIsEnable
              this.site.expandForm.form.emailIsEnable = this.emailIsEnable
            } else if (this.itemDetail.siteType === 1) {
              this.site.basicForm.form = res.data
              this.fetchSitesChilds()
            } else {
              let { modelTpls, ...form } = res.data
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
              this.site.templatesForm.form = form
              this.changeTemplates()
            }
          }
        }
      })
    },
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
          this.site.basicForm.formItems.find(d => d.prop === 'nodeSiteIds').options = loop(res.data, this.site.basicForm.form.parentId)
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    // 栏目数据处理
    getFieldData (data) {
      const { id, modelId, modelName, dataField, renderingField } = data
      let detailForm = Object.assign({}, dataField || {}, {
        id,
        modelId,
        modelName
      })
      const fieldKeys = Object.keys(renderingField || {})
      if (fieldKeys.length) {
        fieldKeys.forEach(field => {
          const items = renderingField[field]
          if (items instanceof Array && items.length) {
            items.forEach(item => {
              if (!(item.value.name in detailForm)) {
                detailForm[item.value.name] = item.value.defaultValue
              }
            })
          }
        })
      }
      this.detailForm = detailForm
      this.detail = data
      this.channel.currentTab = this.getTabs[0].name
    },
    // 审核
    handleApproved () {
      this.$emit('handleApproved', { id: this.id })
      this.dialogClose()
    },
    handleAuditFailed () {
      this.$emit('handleAuditFailed', { id: this.id })
      this.dialogClose()
    },
    // 站点
    // 获取详情之后
    changeTemplates () {
      this.pcFetchSitesModelsList()
      this.mobileFetchSitesModelsList()
    },
    // 获取PC模型的模板下拉列表
    pcFetchSitesModelsList () {
      const solution = this.site.templatesForm.form.pcSolution
      if (!solution) {
        this.site.pcColumns = []
        this.site.pcContents = []
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
          this.site.pcColumns = columns
          this.site.pcContents = contents
          columns.forEach(d => {
            if (d.options instanceof Array && d.options.length) {
              that.site.templatesForm.form[`pcColumns_${d.modelId}`] = that.site.templatesForm.form[`pcColumns_${d.modelId}`] === '' || that.site.templatesForm.form[`pcColumns_${d.modelId}`] === undefined ? d.options[0].value : that.site.templatesForm.form[`pcColumns_${d.modelId}`]
            } else {
              that.site.templatesForm.form[`pcColumns_${d.modelId}`] = ''
            }
          })
          contents.forEach(d => {
            if (d.options instanceof Array && d.options.length) {
              that.site.templatesForm.form[`pcContents_${d.modelId}`] = that.site.templatesForm.form[`pcContents_${d.modelId}`] === '' || that.site.templatesForm.form[`pcContents_${d.modelId}`] === undefined ? d.options[0].value : that.site.templatesForm.form[`pcContents_${d.modelId}`]
            } else {
              that.site.templatesForm.form[`pcContents_${d.modelId}`] = ''
            }
          })
        }
      })
    },
    // 获取手机模型的模板下拉列表
    mobileFetchSitesModelsList () {
      const solution = this.site.templatesForm.form.mobileSolution
      if (!solution) {
        this.site.telColumns = []
        this.site.telContents = []
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
          this.site.telColumns = columns
          this.site.telContents = contents
          columns.forEach(d => {
            if (d.options instanceof Array && d.options.length) {
              that.site.templatesForm.form[`telColumns_${d.modelId}`] = that.site.templatesForm.form[`telColumns_${d.modelId}`] === '' ? d.options[0].value : that.site.templatesForm.form[`telColumns_${d.modelId}`]
            } else {
              that.site.templatesForm.form[`telColumns_${d.modelId}`] = ''
            }
          })
          contents.forEach(d => {
            if (d.options instanceof Array && d.options.length) {
              that.site.templatesForm.form[`telContents_${d.modelId}`] = that.site.templatesForm.form[`telContents_${d.modelId}`] === '' ? d.options[0].value : that.site.templatesForm.form[`telContents_${d.modelId}`]
            } else {
              that.site.templatesForm.form[`telContents_${d.modelId}`] = ''
            }
          })
        }
      })
    },
    // 获得FTP下拉数据
    fetchFtpList () {
      this.$request.fetchFtpList().then(res => {
        if (res.code === 200) {
          this.site.ftpOptions = res.data
        }
      })
    },
    // 获得oss下拉数据
    fetchOssList () {
      this.$request.fetchOssList().then(res => {
        if (res.code === 200) {
          this.site.ossOptions = res.data
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .three-member-detail-dialog{
    .jee-image-resource-upload-container .resource-upload-wrap .image-wrap .img-editor-wrap{
      display: none;
    }
    .el-tabs__content{
      max-height: 500px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
    }
    .detail-dialog{
      .el-dialog__body{
        margin-bottom: 15px !important;
      }
    }
    .detail-footer{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 52px;
      text-align: right;
      padding: 10px 30px 0;
      box-sizing: border-box;
      background-color: #ffffff;
      box-shadow:0px -5px 7px 0px rgba(0, 0, 0, 0.05);
      .el-button{
        font-weight: 400;
      }
    }
    .tabs-froms{
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
      .size-wrap{
        margin-top: 10px;
        margin-bottom: 0px !important;
      }
      .line1{
        .el-form-item__label{
          line-height: 1 !important;
        }
        .el-form-item__content{
          line-height: 1 !important;
        }
      }
    }
    .z-draggable-preview > .el-form-item{
        padding: 0px 20px 20px;
        &:first-of-type{
          padding-top: 0;
        }
    }
    .column-form-container{
      margin-top:0px;
    }
    .column-form-container .column-form-item{
      padding: 10px 20px ;
    }
    .z-image-uploader,.z-video-uploader,.jee-svg-icon,.editor-container{
       pointer-events: none;
      cursor: default;
      .text-wrap{
        .jee-svg-icon{
          fill: #ccc;
        }
        .text{
          color:#ccc;
        }
      }
    }
    .img-editor-wrap,.drag-icon{
      display: none !important;
    }
    .image-desc{
      margin-bottom: 0px !important;
    }
    .el-textarea__inner,.el-input__inner{
      color: #ccc !important;
      &::placeholder{
        color: #ccc !important;
      }
    }
    .d-file-upload-preview,.d-video-upload-preview,.d-audio-upload-preview,.d-multi-image-upload-preview,.d-image-upload-preview,.d-ueditor-preview{
      >.el-form-item{
        padding-bottom: 10px;
        position: relative;
        bottom: 10px;
      }
    }
    .site .el-tabs__header{
      margin-bottom: 10px !important;
    }
    .d-radio-preview.z-draggable-preview>.el-form-item .el-radio-group .el-radio{
      padding-bottom:0px;
    }
  }
</style>
