
// 开发时使用，模拟后台返回的数据
export default [
  // 工作台
  {
    'path': '/workplace',
    'name': 'workplace',
    'icon': 'gongzuotai',
    'children': [
      {
        'path': '/workplace/index',
        'name': 'workplaceIndex',
        'hidden': true
      },
      {
        'path': '/workplace/workflow',
        'name': 'workplaceWorkflow',
        'hidden': true
      }
    ]
  },
  // 站内信
  {
    'path': '/inMail',
    'name': 'inMail',
    'hidden': true
  },
  // 内容管理
  {
    'path': '/content',
    'name': 'content',
    'icon': 'neirongguanli',
    'children': [
      {
        'path': '/content/index',
        'name': 'contentIndex',
        'hidden': true
      },
      {
        'path': '/content/create',
        'name': 'contentCreate',
        'hidden': true
      },
      {
        'path': '/content/detail',
        'name': 'contentDetail',
        'hidden': true
      },
      {
        'path': '/content/public/edit',
        'name': 'wechatPublicEdit',
        'hidden': true
      },
      {
        'path': '/content/sina/edit',
        'name': 'sinaWeiboEdit',
        'hidden': true
      }
    ]
  },
  // 栏目管理
  {
    'path': '/column',
    'name': 'column',
    'icon': 'langmuguanli',
    'children': [
      {
        'path': '/column/index',
        'name': 'columnIndex',
        'hidden': true
      },
      {
        'path': '/column/permission',
        'name': 'columnPermission',
        'hidden': true
      },
      {
        'path': '/column/docPermission',
        'name': 'docPermission',
        'hidden': true
      }
    ]
  },
  // 配置
  {
    'path': '/config',
    'name': 'config',
    'icon': 'peizhi',
    'children': [
      // 站点管理
      {
        'path': '/config/site',
        'name': 'configSite',
        'children': [
          {
            'path': '/config/site/index',
            'name': 'configSiteIndex',
            'hidden': true
          },
          {
            'path': '/config/site/detail',
            'name': 'configSiteDetail',
            'hidden': true
          },
          {
            'path': '/config/site/permission/site',
            'name': 'configSitePermissionSite',
            'hidden': true
          },
          {
            'path': '/config/site/permission/siteGroup',
            'name': 'configSitePermissionSiteGroup',
            'hidden': true
          },
          {
            'path': '/config/site/static',
            'name': 'configSiteStatic',
            'hidden': true
          }
        ]
      },
      // 模板管理
      {
        'path': '/config/templates',
        'name': 'configTemplates',
        'children': [
          {
            'path': '/config/templates/index',
            'name': 'configTemplateseIndex',
            'hidden': true
          },
          {
            'path': '/config/templates/detail',
            'name': 'configTemplatesDetail',
            'hidden': true
          }
        ]
      },
      // 文件管理
      {
        'path': '/config/files',
        'name': 'configFiles',
        'children': [
          {
            'path': '/config/files/index',
            'name': 'configFilesIndex',
            'hidden': true
          },
          {
            'path': '/config/files/detail',
            'name': 'configFilesDetail',
            'hidden': true
          }
        ]
      },
      // 消息管理
      {
        'path': '/config/information',
        'name': 'configInformation',
        'children': [
          {
            'path': '/config/information/index',
            'name': 'configInformationIndex',
            'hidden': true
          },
          {
            'path': '/config/information/detail',
            'name': 'configInformationDetail',
            'hidden': true
          }
        ]
      },
      // 词汇管理
      {
        'path': '/config/vocabulary',
        'name': 'configVocabulary',
        'children': [
          // tag词
          {
            'path': '/config/vocabulary/tag',
            'name': 'configVocabularyTag'
          },
          // 敏感词
          {
            'path': '/config/vocabulary/sensitive',
            'name': 'configVocabularySensitive'
          },
          // 搜索词
          {
            'path': '/config/vocabulary/search',
            'name': 'configVocabularySearch'
          },
          // 热词
          {
            'path': '/config/vocabulary/hot',
            'name': 'configVocabularyHot',
            'children': [
              // 热词-列表
              {
                'path': '/config/vocabulary/hot/index',
                'name': 'configVocabularyHotIndex',
                'hidden': true
              },
              // 热词-详情
              {
                'path': '/config/vocabulary/hot/detail',
                'name': 'configVocabularyHotDetail',
                'hidden': true
              },
              // 热词-管理
              {
                'path': '/config/vocabulary/hot/manage/index',
                'name': 'configVocabularyHotManage',
                'hidden': true
              }

            ]
          }
        ]
      },
      // 内容索引
      {
        'path': '/config/content',
        'name': 'configContent'
      },
      // 定时任务
      {
        'path': '/config/timing',
        'name': 'configTiming'
      },
      // 工作流
      {
        'path': '/config/workflow',
        'name': 'configWorkflow',
        'children': [
          {
            'path': '/config/workflow/index',
            'name': 'configWorkflowIndex',
            'hidden': true
          },
          {
            'path': '/config/workflow/create',
            'name': 'configWorkflowCreate',
            'hidden': true
          },
          {
            'path': '/config/workflow/detail',
            'name': 'configWorkflowDetail',
            'hidden': true
          }
        ]
      },
      // 内容智能审核
      {
        'path': '/config/audit',
        'name': 'configAudit',
        'children': [
        // 审核策略管理
          {
            'path': '/config/audit/manage',
            'name': 'configAuditManage'
          },
          // 审核栏目设置
          {
            'path': '/config/audit/columnSetting',
            'name': 'configAuditColumnSetting'
          },
          // 审核模型设置
          {
            'path': '/config/audit/modelSetting',
            'name': 'configAuditModelSetting'
          }
        ]
      }
    ]
  },
  // 网站统计
  {
    'path': '/statistics',
    'name': 'statistics',
    'icon': 'shujutongji',
    'children': [
      // 网站概况
      {
        'path': '/statistics/general',
        'name': 'statisticsGeneral'
      },
      // 流量分析
      {
        'path': '/statistics/flow',
        'name': 'statisticsFlow',
        'children': [
          {
            'path': '/statistics/flow/index',
            'name': 'statisticsFlowIndex'
          },
          {
            'path': '/statistics/flow/tendency',
            'name': 'statisticsFlowTendency'
          }
        ]
      },
      // 来源分析
      {
        'path': '/statistics/source',
        'name': 'statisticsSource',
        'children': [
          {
            'path': '/statistics/source/index',
            'name': 'statisticsSourceIndex'
          },
          {
            'path': '/statistics/source/search',
            'name': 'statisticsSourceSearch'
          },
          {
            'path': '/statistics/source/link',
            'name': 'statisticsSourceLink'
          }
        ]
      },
      // 受访分析
      {
        'path': '/statistics/interviewer',
        'name': 'statisticsInterviewer',
        'children': [
          {
            'path': '/statistics/interviewer/index',
            'name': 'statisticsInterviewerIndex'
          },
          {
            'path': '/statistics/interviewer/entrance',
            'name': 'statisticsInterviewerEntrance'
          }
        ]
      },
      // 访客分析
      {
        'path': '/statistics/visitor',
        'name': 'statisticsVisitor',
        'children': [
          {
            'path': '/statistics/visitor/territory',
            'name': 'statisticsVisitorTerritory'
          },
          {
            'path': '/statistics/visitor/network',
            'name': 'statisticsVisitorNetwork'
          },
          {
            'path': '/statistics/visitor/visitor',
            'name': 'statisticsVisitorVisitor'
          },
          {
            'path': '/statistics/visitor/fidelity',
            'name': 'statisticsVisitorFidelity'
          }
        ]
      },
      // 内容发布统计
      {
        'path': '/statistics/release',
        'name': 'statisticsRelease',
        'children': [
          {
            'path': '/statistics/release/column',
            'name': 'statisticsReleaseColumns'
          },
          {
            'path': '/statistics/release/user',
            'name': 'statisticsReleaseUser'
          },
          {
            'path': '/statistics/release/organization',
            'name': 'statisticsReleaseOrganization'
          },
          {
            'path': '/statistics/release/siteview',
            'name': 'statisticsReleaseSiteview'
          }
        ]
      },
      // 内容数据统计
      {
        'path': '/statistics/information',
        'name': 'statisticsInformation',
        'children': [
          {
            'path': '/statistics/information/index',
            'name': 'statisticsInformationIndex'
          },
          {
            'path': '/statistics/information/single',
            'name': 'statisticsInformationSingle'
          }
        ]
      }
    ]
  },
  // 互动
  {
    'path': '/interact',
    'name': 'interact',
    'icon': 'hudong',
    'children': [
      // 评论管理
      {
        'path': '/interact/comment',
        'name': 'interactComment',
        'children': [
          {
            'path': '/interact/comment/index',
            'name': 'interactCommentIndex',
            'hidden': true
          },
          {
            'path': '/interact/comment/content',
            'name': 'interactCommentContent',
            'hidden': true
          },
          {
            'path': '/interact/comment/member',
            'name': 'interactCommentMember',
            'hidden': true
          },
          {
            'path': '/interact/comment/ip',
            'name': 'interactCommentIp',
            'hidden': true
          },
          {
            'path': '/interact/comment/forbid/index',
            'name': 'interactCommentForbidIndex',
            'hidden': true
          },
          {
            'path': '/interact/comment/forbid/member',
            'name': 'interactCommentForbidMember',
            'hidden': true
          },
          {
            'path': '/interact/comment/forbid/ip',
            'name': 'interactCommentForbidIp',
            'hidden': true
          },
          {
            'path': '/interact/comment/report',
            'name': 'interactCommentReport',
            'hidden': true
          }
        ]
      },
      // 采集管理
      {
        'path': '/interact/collect',
        'name': 'interactCollect',
        'children': [
          {
            'path': '/interact/collect/index',
            'name': 'interactCollectIndex',
            'hidden': true
          },
          {
            'path': '/interact/collect/detail',
            'name': 'interactCollectIframe',
            'hidden': true
          }
          // {
          //   "path": "/interact/collect/createcustom",
          //   "name": "interactCollectCreateCustom",
          //   "hidden": true
          // },
          // {
          //   "path": "/interact/collect/detail",
          //   "name": "interactCollectDetail",
          //   "hidden": true
          // }
        ]
      },
      // 友情链接
      {
        'path': '/interact/blogroll',
        'name': 'interactBlogroll',
        'children': [
          {
            'path': '/interact/blogroll/index',
            'name': 'interactBlogrollIndex',
            'hidden': true
          },
          {
            'path': '/interact/blogroll/detail',
            'name': 'interactBlogrollDetail',
            'hidden': true
          }
        ]
      },
      // 问卷调查
      {
        'path': '/interact/vote',
        'name': 'interactVote',
        'children': [
          {
            'path': '/interact/vote/index',
            'name': 'interactVoteIndex',
            'hidden': true
          },
          {
            'path': '/interact/vote/create',
            'name': 'interactVoteCreate',
            'hidden': true
          },
          {
            'path': '/interact/vote/detail',
            'name': 'interactVoteDetail',
            'hidden': true
          },
          {
            'path': '/interact/vote/view',
            'name': 'interactVoteView',
            'hidden': true
          }
        ]
      },
      // 智能表单
      {
        'path': '/interact/smart',
        'name': 'interactSmart',
        'children': [
          {
            'path': '/interact/smart/index',
            'name': 'interactSmartIndex',
            'hidden': true
          },
          {
            'path': '/interact/smart/detail',
            'name': 'interactSmartDetail',
            'hidden': true
          },
          {
            'path': '/interact/smart/view',
            'name': 'interactSmartView',
            'hidden': true
          }
        ]
      }
    ]
  },
  // 社交媒体
  {
    'path': '/social',
    'name': 'social',
    'icon': 'shejiaomeiti',
    'children': [
      // 微信
      {
        'path': '/social/Wechat',
        'name': 'socialWechat',
        'children': [
          // 授权管理
          {
            'path': '/social/wechat/authorization',
            'name': 'socialWechatAuthorization',
            'children': [
              {
                'path': '/social/wechat/authorization/index',
                'name': 'socialWechatAuthorizationIndex',
                'hidden': true
              },
              {
                'path': '/social/wechat/public/detail',
                'name': 'socialWechatPublicDetail',
                'hidden': true
              },
              {
                'path': '/social/wechat/applet/detail',
                'name': 'socialWechatAppletDetail',
                'hidden': true
              }
            ]
          },
          // 菜单管理
          {
            'path': '/social/wechat/menu',
            'name': 'socialWechatMenu',
            'children': [
              // 菜单
              {
                'path': '/social/wechat/menu/index',
                'name': 'socialWechatMenuIndex',
                'hidden': true
              },
              // 默认菜单详情
              {
                'path': '/social/wechat/default/detail',
                'name': 'socialWechatMenuDefaultDetail',
                'hidden': true
              },
              // 个性菜单详情
              {
                'path': '/social/wechat/individualization/detail',
                'name': 'socialWechatIndividualizationDetail',
                'hidden': true
              },
              // 默认菜单新增
              {
                'path': '/social/wechat/default/add',
                'name': 'socialWechatMenuDefaultAdd',
                'hidden': true
              },
              // 个性菜单新增
              {
                'path': '/social/wechat/individualization/add',
                'name': 'socialWechatIndividualizationAdd',
                'hidden': true
              }
            ]
          },
          // 素材管理
          {
            'path': '/social/wechat/material',
            'name': 'socialWechatMaterial',
            'children': [
              // 菜单
              {
                'path': '/social/wechat/material/index',
                'name': 'socialWechatMaterialIndex',
                'hidden': true
              },
              // 图文新增
              {
                'path': '/social/wechat/imageText/add',
                'name': 'socialWechatMaterialImageTextAdd',
                'hidden': true
              },
              // 图文修改
              {
                'path': '/social/wechat/imageText/edit',
                'name': 'socialWechatMaterialImageTextEdit',
                'hidden': true
              }

            ]
          },
          // 自动回复
          {
            'path': '/social/wechat/AutoReply',
            'name': 'socialWechatAutoReply'
          },
          // 粉丝管理
          {
            'path': '/social/wechat/fans',
            'name': 'socialWechatFans',
            'children': [
              // 菜单
              {
                'path': '/social/wechat/fans/index',
                'name': 'socialWechatFansIndex',
                'hidden': true
              },
              // 发送消息
              {
                'path': '/social/wechat/fans/send',
                'name': 'socialWechatFansSend',
                'hidden': true
              }
            ]
          },
          // 留言管理
          {
            'path': '/social/wechat/comment',
            'name': 'socialWechatComment'
          },
          // 消息管理
          {
            'path': '/social/wechat/message',
            'name': 'socialWechatMessage'
          },
          // 推送管理
          {
            'path': '/social/wechat/push',
            'name': 'socialWechatPush',
            'children': [
              {
                'path': '/social/wechat/push/index',
                'name': 'socialWechatPushIndex',
                'hidden': true
              },
              {
                'path': '/social/wechat/push/detail',
                'name': 'socialWechatPushDetail',
                'hidden': true
              }
            ]
          },
          // 粉丝汇总
          {
            'path': '/social/wechat/FansStatistics',
            'name': 'socialWechatFansStatistics'
          },
          // 定时群发
          {
            'path': '/social/wechat/group',
            'name': 'socialWechatGroup'
          },
          // 汇总统计
          {
            'path': '/social/wechat/Statistics',
            'name': 'socialWechatStatistics'
          },
          // 小程序代码管理
          {
            'path': '/social/wechat/applet',
            'name': 'socialWechatApplet'
          }
        ]
      },
      // 微博
      {
        'path': '/social/Weibo',
        'name': 'socialWeibo',
        'children': [
          // 应用配置
          {
            'path': '/social/weibo/application',
            'name': 'socialWeiboApplication'
          },
          // 账号管理
          {
            'path': '/social/weibo/account',
            'name': 'socialWeiboAccount'
          },
          // 粉丝管理
          {
            'path': '/social/weibo/fans',
            'name': 'socialWeiboFans'
          },
          // 消息管理
          {
            'path': '/social/weibo/message',
            'name': 'socialWeiboMessage'
          },
          // 推送记录
          {
            'path': '/social/weibo/pushRecord',
            'name': 'socialWeiboPushRecord'
          }
        ]
      }
    ]
  },
  // 会员
  {
    'path': '/vip',
    'name': 'vip',
    'icon': 'huiyuan',
    'children': [
      // 待审核会员
      {
        'path': '/vip/checkPending',
        'name': 'vipCheckPending',
        'children': [
          {
            'path': '/vip/checkPending/index',
            'name': 'vipCheckPendingIndex',
            'hidden': true
          },
          {
            'path': '/vip/checkPending/detail',
            'name': 'vipCheckPendingDetail',
            'hidden': true
          }
        ]
      },
      // 会员管理
      {
        'path': '/vip/member',
        'name': 'vipMember',
        'children': [
          {
            'path': '/vip/member/index',
            'name': 'vipMemberIndex',
            'hidden': true
          },
          {
            'path': '/vip/member/detail',
            'name': 'vipMemberDetail',
            'hidden': true
          },
          {
            'path': '/vip/member/create',
            'name': 'vipMemberCreate',
            'hidden': true
          }
        ]
      },
      // 会员组管理
      {
        'path': '/vip/groupName',
        'name': 'vipGroupName',
        'children': [
          {
            'path': '/vip/groupName/index',
            'name': 'vipGroupNameIndex',
            'hidden': true
          },
          {
            'path': '/vip/groupName/detail',
            'name': 'vipGroupNameDetail',
            'hidden': true
          },
          {
            'path': '/vip/groupName/members/index',
            'name': 'vipGroupNameMembersIndex',
            'hidden': true
          }
        ]
      },
      // 会员等级
      {
        'path': '/vip/grade',
        'name': 'vipGrade'
      },
      // 积分配置
      {
        'path': '/vip/integral',
        'name': 'vipIntegral'
      }
    ]
  },
  // 系统
  {
    'path': '/system',
    'name': 'system',
    'icon': 'xitong',
    'children': [
      // 组织管理
      {
        'path': '/system/organize',
        'name': 'organize',
        'children': [
          {// 组织管理
            'path': '/system/organize/index',
            'name': 'organizeIndex',
            'hidden': true
          },
          {// 组织管理-成员
            'path': '/system/organize/member',
            'name': 'organizeMember',
            'hidden': true
          },
          {// 组织管理-详情
            'path': '/system/organize/detail',
            'name': 'organizeDetail',
            'hidden': true
          },
          {// 权限
            'path': '/system/organize/permission',
            'name': 'organizePermission',
            'hidden': true
          }
        ]
      },
      // 角色管理
      {
        'path': '/system/role',
        'name': 'role',
        'children': [
          {// 列表
            'path': '/system/role/index',
            'name': 'roleIndex',
            'hidden': true
          },
          {// 详情修改
            'path': '/system/role/edit',
            'name': 'roleEdit',
            'hidden': true
          },
          {// 会员管理
            'path': '/system/role/member',
            'name': 'roleMember',
            'hidden': true
          },
          {// 权限
            'path': '/system/role/permission',
            'name': 'rolePermission',
            'hidden': true
          }
        ]
      },
      // 用户管理
      {
        'path': '/system/user',
        'name': 'user',
        'children': [
          {// 用户管理
            'path': '/system/user/index',
            'name': 'userIndex',
            'hidden': true
          },
          {// 用户编辑
            'path': '/system/user/create',
            'name': 'userCreate',
            'hidden': true
          },
          {// 权限
            'path': '/system/user/permission',
            'name': 'userPermission',
            'hidden': true
          }
        ]
      },
      // 模型管理
      {
        'path': '/system/model',
        'name': 'model',
        'children': [
          // 栏目模型
          {
            'path': '/system/model/column',
            'name': 'modelColumn',
            'children': [
              {
                'path': '/system/model/column/index',
                'name': 'modelColumnIndex',
                'hidden': true
              },
              // 模型-栏目模型
              {
                'path': '/system/model/column/detail',
                'name': 'modelColumnDetail',
                'hidden': true
              }
            ]
          },
          // 内容模型
          {
            'path': '/system/model/content',
            'name': 'modelContent',
            'children': [
              {
                'path': '/system/model/content/index',
                'name': 'modelContentIndex',
                'hidden': true
              },
              // 模型-内容模型
              {
                'path': '/system/model/content/detail',
                'name': 'modelContentDetail',
                'hidden': true
              },
              // 模型-内容模型
              {
                'path': '/system/model/newcontent/detail',
                'name': 'modelNewContentDetail',
                'hidden': true
              }
            ]
          },
          // 会员模型
          {
            'path': '/system/model/vip',
            'name': 'modelVip'
          },
          // 来源管理
          {
            'path': '/system/model/source',
            'name': 'configVocabularySource'
          },
          // 内容类型管理
          {
            'path': '/system/model/contenttype',
            'name': 'configVocabularyContent'
          },
          // 发文字号管理
          {
            'path': '/system/model/fontsize',
            'name': 'configVocabularyFontsize'
          }
        ]
      },
      // 资源库
      {
        'path': '/system/resource',
        'name': 'resource'
      },
      // 系统设置
      {
        'path': '/system/system-setting',
        'name': 'systemSetting'
      },
      // 单点登录设置
      {
        'path': '/system/single-login',
        'name': 'singleLoginSetting'
      },
      // 账户安全设置
      {
        'path': '/system/safe',
        'name': 'safe'
      },
      // 密级管理
      {
        'path': '/system/security',
        'name': 'security',
        'children': [
          // 人员密级
          {
            'path': '/system/security/user',
            'name': 'securityUser',
            'children': [
              {
                'path': '/system/security/user/index',
                'name': 'securityUserIndex',
                'hidden': true
              },
              {
                'path': '/system/security/user/detail',
                'name': 'securityUserDetail',
                'hidden': true
              }
            ]
          },
          // 内容密级
          {
            'path': '/system/security/content',
            'name': 'securityContent',
            'children': [
              {
                'path': '/system/security/content/index',
                'name': 'securityContentIndex',
                'hidden': true
              },
              {
                'path': '/system/security/content/detail',
                'name': 'securityContentDetail',
                'hidden': true
              }
            ]
          },
          // 附件密级
          {
            'path': '/system/security/accessory',
            'name': 'securityAccessory',
            'children': [
              {
                'path': '/system/security/accessory/index',
                'name': 'securityAccessoryIndex',
                'hidden': true
              },
              {
                'path': '/system/security/accessory/detail',
                'name': 'securityAccessoryDetail',
                'hidden': true
              }
            ]
          }
        ]
      },
      // 存储管理
      {
        'path': '/system/storage',
        'name': 'storage',
        'children': [
          // FTP管理
          {
            'path': '/system/storage/ftpStorge',
            'name': 'storageFtp',
            'children': [
              {
                'path': '/system/storage/ftpStorge/index',
                'name': 'storageFtpIndex',
                'hidden': true
              },
              {
                'path': '/system/storage/ftpStorge/detail',
                'name': 'storageFtpDetail',
                'hidden': true
              }
            ]
          },
          // 云存储
          {
            'path': '/system/storage/cloudStorage',
            'name': 'storageCloud',
            'children': [
              {
                'path': '/system/storage/cloudStorage/index',
                'name': 'storageCloudIndex',
                'hidden': true
              },
              {
                'path': '/system/storage/cloudstorage/detail',
                'name': 'storageCloudDetail',
                'hidden': true
              }
            ]
          }
        ]
      },
      // 第三方登录设置
      {
        'path': '/system/third-party',
        'name': 'thirdParty'
      },
      // 短信服务设置
      {
        'path': '/system/sms',
        'name': 'sms'
      },
      // 邮件服务设置
      {
        'path': '/system/email',
        'name': 'email'
      },
      // 微信开放平台设置
      {
        'path': '/system/weixin',
        'name': 'weixin'
      },
      // 防火墙设置
      {
        'path': '/system/firewall',
        'name': 'firewall'
      },
      // 数据备份
      {
        'path': '/system/backup',
        'name': 'backup'
      },
      // 日志管理
      {
        'path': '/system/log',
        'name': 'log',
        'children': [
          {
            'path': '/system/log/realTime',
            'name': 'logRealTime'
          },
          {
            'path': '/system/log/system',
            'name': 'logSystem'
          },
          {
            'path': '/system/log/business',
            'name': 'logBusiness'
          },
          {
            'path': '/system/log/audit',
            'name': 'logAudit'
          },
          {
            'path': '/system/log/safety',
            'name': 'logSafety'
          },
          {
            'path': '/system/log/report',
            'name': 'logReport'
          },
          {
            'path': '/system/log/backups',
            'name': 'logBackups'
          },
          {
            'path': '/system/log/strategy',
            'name': 'logStrategy'
          },
          {
            'path': '/system/log/statistics',
            'name': 'logStatistics'
          }
        ]
      },
      // 菜单管理
      {
        'path': '/system/menus',
        'name': 'menus',
        'children': [
          // 接口管理
          {
            'path': '/system/menus/apis',
            'name': 'menusApis',
            'children': [
              {
                'path': '/system/menus/apis/index',
                'name': 'menusApisIndex',
                'hidden': true
              },
              {
                'path': '/system/menus/apis/detail',
                'name': 'menusApisDetail',
                'hidden': true
              }
            ]
          },
          // 菜单管理
          {
            'path': '/system/menus/menus',
            'name': 'menusMenus',
            'children': [
              {
                'path': '/system/menus/menus/index',
                'name': 'menusMenusIndex',
                'hidden': true
              },
              {
                'path': '/system/menus/menus/detail',
                'name': 'menusMenusDetail',
                'hidden': true
              },
              {
                'path': '/system/menus/menus/create',
                'name': 'menusMenusCreate',
                'hidden': true
              }
            ]
          }
        ]
      },
      // 系统信息
      {
        'path': '/system/systemInfo',
        'name': 'systemInfo'
      },
      // 区域管理
      {
        'path': '/system/district',
        'name': 'district'
      },
      // 三员管理
      {
        'path': '/system/threeMember',
        'name': 'threeMember',
        'children': [
          // 三员管理设置
          {
            'path': '/system/threeMember/setting',
            'name': 'threeMemberSetting'
          },
          // 三员审核
          {
            'path': '/system/threeMember/audit',
            'name': 'threeMemberAudit'
          },
          // 三员审核日志
          {
            'path': '/system/threeMember/journal',
            'name': 'threeMemberJournal'
          }

        ]
      },
      // 双因子
      {
        'path': '/system/double',
        'name': 'doubleIndex'
      },
      // 绩效管理
      {
        'path': '/performance',
        'name': 'performance',
        'children': [
          // 绩效管理-列表
          {
            'path': '/system/performance/index',
            'name': 'performanceIndex'
          },
          // 绩效管理-新增
          {
            'path': '/system/performance/add',
            'name': 'performanceAdd'
          },
          // 绩效管理-详情
          {
            'path': '/system/performance/detail',
            'name': 'performanceDetail'
          },
          // 绩效管理-评分结果
          {
            'path': '/system/performance/list',
            'name': 'performanceList'
          },
          // 绩效管理-查看绩效列表
          {
            'path': '/system/performance/examine',
            'name': 'performanceExamine'
          },
          // 绩效管理-查看绩效详情
          {
            'path': '/system/performance/examine/detail',
            'name': 'performanceExamineDetail'
          }
        ]
      },
      // 分级保护
      {
        'path': '/system/hierarchical',
        'name': 'hierarchical',
        'children': [
          // 分级保护-设置
          {
            'path': '/system/hierarchical/settin',
            'name': 'hierarchicalSettin'
          },
          // 分级保护-用户密级设置
          {
            'path': '/system/hierarchical/secret',
            'name': 'hierarchicalSecret'
          },
          // 分级保护-用户日志
          {
            'path': '/system/hierarchical/journal',
            'name': 'hierarchicalJournal'
          }

        ]
      }
    ]
  },
  {
    'path': '/service',
    'name': 'service',
    'icon': 'fuwushichang',
    'children': [
      // 服务市场
      {
        'path': '/service/index',
        'name': 'serviceIndex'
      }
    ]
  }
]
