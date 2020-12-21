import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  data () {
    return {
      watermarkPosition: '1',
      expandForm: {
        api: 'fetchSitesDetail',
        titleDepiction: true,
        loading: false,
        params: {
          id: null
        },
        labelWidth: '269px',
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
            prop: 'newContentId',
            label: '新内容标志：',
            type: 'imageUpload',
            isResource: true,
            imgType: 'NewContent',
            urlProp: 'newContentResourceUrl',
            option: {
              isSingleImage: true,
              desc: '(请上传png、jpg、jpeg、gif格式的图片)',
              type: ['png', 'jpg', 'jpeg', 'gif', 'ico'],
              width: 32,
              height: 32
            },
            hiddenKey: 'openContentNewFlag',
            hiddenValue: '1'
          },
          {
            type: 'radio',
            prop: 'contentLikeLogin',
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
            hiddenKey: 'openStatic',
            hiddenValue: '1',
            placeholder: '请选择静态文件后缀',
            maxlength: 50,
            options: [{
              label: 'html',
              value: 'html'
            }]
          },
          {
            type: 'radio',
            prop: 'staticServerMemoryType',
            label: '静态文件存储服务器：',
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
            label: '评论周期（秒）：',
            popoverText: '设置多长时间内评论一次0为不限制',
            hidden: function (form) {
              return form.commentSet === '1' || form.commentSet === '2'
            }
          },
          {
            type: 'radio',
            prop: 'commentAudit',
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
          // {
          //   type: 'title',
          //   enabled: true,
          //   prop: 'smsTitle',
          //   label: '短信服务配置',
          //   hiddenKey: 'smsIsEnable',
          //   hiddenValue: true,
          //   popoverText: '设置后所有短信都会通过此账号发送',
          //   titleID: 'note'
          // },
          // {
          //   type: 'radio',
          //   prop: 'serviceProviders',
          //   label: '服务商：',
          //   hiddenKey: 'smsIsEnable',
          //   hiddenValue: true,
          //   options: [{
          //     label: '阿里云',
          //     value: '1'
          //   },
          //   {
          //     label: '腾讯云',
          //     value: '2'
          //   }]
          // },
          // {
          //   prop: 'accesskeyId',
          //   label: 'AccessKeyID/AppID：',
          //   type: 'textarea',
          //   height: '100px',
          //   hiddenKey: 'smsIsEnable',
          //   hiddenValue: true,
          //   placeholder: '请输入AccessKeyID/AppID',
          //   href: 'https://cloud.tencent.com/product/sms',
          //   hrefText: '点击获取AccessKey和AccessKeySecret',
          //   maxlength: 255
          // },
          // {
          //   prop: 'accesskeySecret',
          //   label: 'AccessKeySecret/AppKey：',
          //   type: 'textarea',
          //   height: '100px',
          //   hiddenKey: 'smsIsEnable',
          //   hiddenValue: true,
          //   placeholder: '请输入AccessKeySecret/AppKey',
          //   maxlength: 1500
          // },
          // {
          //   prop: 'messageSignatures',
          //   label: '短信签名：',
          //   hiddenKey: 'smsIsEnable',
          //   hiddenValue: true,
          //   placeholder: '请输入短信签名',
          //   maxlength: 1500
          // },
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
            },
            {
              label: 'ico',
              value: 'ico'
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
            explain: '“0”表示不限制，默认为0'
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
            explain: '“0”表示不限制，默认为0'
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
            explain: '“0”表示不限制，默认为0'
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
            explain: '“0”表示不限制，默认为0'
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
            explain: '“0”表示不限制，默认为0'
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
        rules: {
          watermarkResourceId: [this.$rules.required()],
          staticPageOssId: [this.$rules.required()],
          staticPageFtpId: [this.$rules.required()],
          uploadOssId: [this.$rules.required()],
          uploadFtpId: [this.$rules.required()],
          commentAudit: [this.$rules.required()],
          openMobileStatic: [this.$rules.required()],
          openPcStatic: [this.$rules.required()],
          uploadAttachmentSuffixType: [this.$rules.required()],
          urlRelative: [this.$rules.required()],
          // commentLink: [this.$rules.required()],
          platform: [this.$rules.required()],
          staticAutoChannelPage: [this.$rules.required(), this.$rules.number()],
          staticAutoChannel: [this.$rules.required()],
          staticAutoIndex: [this.$rules.required()],
          watermarkPicture: [this.$rules.required()],
          contentSaveVersion: [this.$rules.required()],
          uploadDocumentSuffix: [this.$rules.required()],
          uploadDocumentSizeType: [this.$rules.required()],
          uploadDocumentSize: [this.$rules.required(), this.$rules.plusNumber()],
          uploadAttachmentSizeType: [this.$rules.required()],
          uploadAudioSizeType: [this.$rules.required()],
          uploadVideoSizeType: [this.$rules.required()],
          uploadPicSizeType: [this.$rules.required()],
          ftpUploadFileMemory: [this.$rules.required()],
          ossUploadFileMemory: [this.$rules.required()],
          uploadFileMemoryType: [this.$rules.required()],
          ftpStaticServerMemory: [this.$rules.required()],
          ossStaticServerMemory: [this.$rules.required()],
          staticServerMemoryType: [this.$rules.required()],
          loginSuccessVisitSite: [this.$rules.required()],
          channelDisplayContentNumber: [this.$rules.required(), this.$rules.number()],
          channelNormalLimitContribute: [this.$rules.required()],
          channelVisitLimitType: [this.$rules.required()],
          mobileHomePageTemplates: [this.$rules.required()],
          pcHomePageTemplates: [this.$rules.required()],
          mobileSolution: [this.$rules.required()],
          pcSolution: [this.$rules.required()],
          titleRepeat: [this.$rules.required()],
          contentAutoSave: [this.$rules.required()],
          openContentNewFlag: [this.$rules.required()],
          contentNewFlagType: [this.$rules.required()],
          contentNewFlag: [this.$rules.required(), this.$rules.number()],
          watermarkSet: [this.$rules.required()],
          watermarkPosition: [this.$rules.required()],
          watermarkTxt: [this.$rules.required()],
          watermarkTxtSize: [this.$rules.required(), this.$rules.rangeNum(12, 30), this.$rules.number()],
          commentCycle: [this.$rules.required(), this.$rules.rangeNum(0, 3600), this.$rules.number()],
          watermarkTxtColour: [this.$rules.required()],
          watermarkTxtTransparency: [this.$rules.required(), this.$rules.number(), this.$rules.rangeNum(1, 100)],
          channelDisplayList: [this.$rules.required()],
          channelNameRepeat: [this.$rules.required()],
          openStatic: [this.$rules.required()],
          staticHtmlSuffix: [this.$rules.required()],
          commentSet: [this.$rules.required()],
          commentAllowedLink: [this.$rules.required()],
          // serviceProviders: [this.$rules.required()],
          // accesskeyId: [this.$rules.required()],
          // accesskeySecret: [this.$rules.required()],
          // messageSignatures: [this.$rules.required()],
          SMTPService: [this.$rules.required(), this.$rules.max(255)],
          SMTPPort: [this.$rules.required(), this.$rules.number(), this.$rules.rangeNum(1, 65535)],
          sendAccount: [this.$rules.required(), this.$rules.email()],
          emailPassword: [this.$rules.required(), this.$rules.max(50)],
          sslUse: [this.$rules.required()],
          memberRedirectAssign: [this.$rules.required()],
          memberRedirectUrl: [this.$rules.required()],
          sitePushOpen: [this.$rules.required()],
          // sitePushSecret: [this.$rules.required()],
          siteAcquOpen: [this.$rules.required()],
          // siteAcquSecret: [this.$rules.required()],
          openSiteStatistic: [this.$rules.required()],
          openThirdStatistic: [this.$rules.required()],
          thirdStatisticCode: [this.$rules.required()],
          uploadPicSize: [this.$rules.required(), this.$rules.plusNumber()],
          uploadPicSuffix: [this.$rules.required()],
          uploadVideoSize: [this.$rules.required(), this.$rules.plusNumber()],
          uploadVideoSuffix: [this.$rules.required()],
          uploadAudioSize: [this.$rules.required(), this.$rules.plusNumber()],
          uploadAudioSuffix: [this.$rules.required()],
          uploadAttachmentSize: [this.$rules.required(), this.$rules.plusNumber()],
          uploadAttachmentSuffix: [this.$rules.required()],
          newContentId: [this.$rules.required()]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['currentSiteId']),
    expandFormItems () {
      let { path, query } = this.$route
      let title = path + '?'
      delete query.titleID
      Object.keys(query).forEach((d, i) => {
        title += `${d}=${query[d]}&`
      })
      title += 'titleID='
      let formItems = []
      this.expandForm.formItems.forEach(d => {
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
    }
  },
  methods: {
    ...mapActions('config', ['FetchSiteExtentConfig']),
    // 水印定位点击
    location (value) {
      this.expandForm.form.watermarkPosition = value
    },
    // 打开邮箱校验
    handleEmail () {
      if (!this.expandForm.form.SMTPService) {
        this.$message.error('请填写SMTP 服务器')
        return false
      }
      if (!this.expandForm.form.SMTPPort) {
        this.$message.error('请填写SMTP 端口')
        return false
      }
      if (!this.expandForm.form.sendAccount) {
        this.$message.error('请填写发件账号')
        return false
      }
      if (!this.expandForm.form.SMTPService) {
        this.$message.error('请填写邮箱密码')
        return false
      }
      if (!this.expandForm.form.SMTPService) {
        this.$message.error('请选择是否使用SSL协议')
        return false
      }
      this.$refs.addDialogEmail.showDialog()
    },
    // 邮箱检验
    handleConfirmAddEmail (data) {
      data.smtpService = this.expandForm.form.SMTPService
      data.smtpPort = this.expandForm.form.SMTPPort
      data.emailName = this.expandForm.form.sendAccount
      data.emailPassword = this.expandForm.form.emailPassword
      data.isSsl = this.expandForm.form.sslUse
      this.$request.fetchEmailTest(data).then(res => {
        if (res.code === 200) {
          if (res.data === 0) {
            this.$message({
              message: '发送成功',
              type: 'success'
            })
          } else if (res.data === 1) {
            this.$message({ message: '发送失败', type: 'warning' })
          } else if (res.data === 2) {
            this.$message.error('非法邮箱')
          }
        }
      })
    },
    // 点击保存按钮
    handleConfirmExpand (data) {
      if (data.platform.indexOf('1') !== -1) {
        data.openPcStatic = '1'
      } else {
        data.openPcStatic = '0'
      }
      if (data.platform.indexOf('2') !== -1) {
        data.openMobileStatic = '1'
      } else {
        data.openMobileStatic = '0'
      }
      if (data.staticServerMemoryType === 'ftp') {
        data.staticServerMemory = data.ftpStaticServerMemory
      } else if (data.staticServerMemoryType === 'oss') {
        data.staticServerMemory = data.ossStaticServerMemory
      }
      if (data.uploadFileMemoryType === 'ftp') {
        data.uploadFileMemory = data.ftpUploadFileMemory
      } else if (data.uploadFileMemoryType === 'oss') {
        data.uploadFileMemory = data.ossUploadFileMemory
      }
      var obj = {}
      obj.id = Number(this.id)
      obj.cfg = Object.assign({}, data)
      obj.commentFlowId = data.commentFlowId
      obj.cfg.newContentResourceId = data.newContentId
      obj.watermarkResourceId = data.watermarkResourceId
      obj.staticPageOssId = data.staticPageOssId
      obj.staticPageFtpId = data.staticPageFtpId
      obj.uploadOssId = data.uploadOssId
      obj.uploadFtpId = data.uploadFtpId
      obj.cfg.uploadPicSuffix = ''
      // delete obj.cfg.newContentId
      if (obj.cfg.uploadPicSuffixUp.length > 0) {
        for (var i = 0; i < obj.cfg.uploadPicSuffixUp.length; i++) {
          if (i !== obj.cfg.uploadPicSuffixUp.length - 1) {
            obj.cfg.uploadPicSuffix += obj.cfg.uploadPicSuffixUp[i]
            obj.cfg.uploadPicSuffix += ','
          } else {
            obj.cfg.uploadPicSuffix += obj.cfg.uploadPicSuffixUp[i]
          }
        }
      }
      obj.cfg.uploadVideoSuffix = ''
      if (obj.cfg.uploadVideoSuffixUp.length > 0) {
        for (var j = 0; j < obj.cfg.uploadVideoSuffixUp.length; j++) {
          if (j !== obj.cfg.uploadVideoSuffixUp.length - 1) {
            obj.cfg.uploadVideoSuffix += obj.cfg.uploadVideoSuffixUp[j]
            obj.cfg.uploadVideoSuffix += ','
          } else {
            obj.cfg.uploadVideoSuffix += obj.cfg.uploadVideoSuffixUp[j]
          }
        }
      }
      obj.cfg.uploadAudioSuffix = ''
      if (obj.cfg.uploadAudioSuffixUp.length > 0) {
        for (var x = 0; x < obj.cfg.uploadAudioSuffixUp.length; x++) {
          if (x !== obj.cfg.uploadAudioSuffixUp.length - 1) {
            obj.cfg.uploadAudioSuffix += obj.cfg.uploadAudioSuffixUp[x]
            obj.cfg.uploadAudioSuffix += ','
          } else {
            obj.cfg.uploadAudioSuffix += obj.cfg.uploadAudioSuffixUp[x]
          }
        }
      }
      obj.cfg.uploadDocumentSuffix = ''
      if (obj.cfg.uploadDocumentSuffixUp.length > 0) {
        for (var l = 0; l < obj.cfg.uploadDocumentSuffixUp.length; l++) {
          if (l !== obj.cfg.uploadDocumentSuffixUp.length - 1) {
            obj.cfg.uploadDocumentSuffix += obj.cfg.uploadDocumentSuffixUp[l]
            obj.cfg.uploadDocumentSuffix += ','
          } else {
            obj.cfg.uploadDocumentSuffix += obj.cfg.uploadDocumentSuffixUp[l]
          }
        }
      }
      console.log(obj)
      this.$request.fetchSitesExt(obj).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          if (obj.id === this.currentSiteId) {
            this.FetchSiteExtentConfig(obj.id)
          }
        }
      })
    }
  }
}
