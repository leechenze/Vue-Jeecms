import i18n from '@/i18n'

export default {
  getLabel (key, value, options = []) {
    // this.$enums.getLabel('boolYes', true)
    const enumArray = options.length ? options : this[key]
    if (enumArray instanceof Array && enumArray.length) {
      const enumItem = enumArray.find(d => d.value === value)
      if (enumItem) {
        return i18n.t(enumItem.label)
      }
    }
    return ''
  },
  boolYes: [
    {
      value: true,
      label: 'global.yes'
    },
    {
      value: false,
      label: 'global.no'
    }
  ],
  boolOpen: [
    {
      value: true,
      label: 'global.open'
    },
    {
      value: false,
      label: 'global.close'
    }
  ],
  boolEnabled: [
    {
      value: true,
      label: 'global.enabled'
    },
    {
      value: false,
      label: 'global.disabled'
    }
  ],
  rulesMap: [
    {
      value: 'chinese',
      label: '只能输入中文'
    },
    {
      value: 'english',
      label: '只能输入英文'
    },
    {
      value: 'float',
      label: '只能输入数字'
    },
    {
      value: 'enNum',
      label: '只能输入英文和数字'
    },
    {
      value: 'number',
      label: '只能输入整数'
    },
    {
      value: 'cnEnNum',
      label: '只能输入中文、英文和数字'
    },
    {
      value: 'email',
      label: '只能输入邮箱'
    },
    {
      value: 'mobile',
      label: '只能输入手机号'
    },
    {
      value: 'phone',
      label: '只能输入座机号'
    },
    {
      value: 'phoneAll',
      label: '只能输入手机或座机号'
    },
    {
      value: 'identity',
      label: '只能输入身份证号'
    },
    {
      value: 'postal',
      label: '只能输入邮政编码'
    }
  ],
  size: [
    {
      value: 'KB',
      label: 'KB'
    },
    {
      value: 'MB',
      label: 'MB'
    }
  ],
  audioType: [
    {
      value: 'mp3',
      label: 'mp3'
    },
    {
      value: 'wav',
      label: 'wav'
    },
    {
      value: 'ogg',
      label: 'ogg'
    },
    {
      value: 'acc',
      label: 'acc'
    }
  ],
  imageType: [
    {
      value: 'jpg',
      label: 'jpg'
    },
    {
      value: 'jpeg',
      label: 'jpeg'
    },
    {
      value: 'png',
      label: 'png'
    },
    {
      value: 'gif',
      label: 'gif'
    },
    {
      value: 'bmp',
      label: 'bmp'
    }
    // {
    //   value: 'psd',
    //   label: 'psd'
    // }
  ],
  videoType: [
    {
      value: 'mp4',
      label: 'mp4'
    },
    {
      value: 'rmvb',
      label: 'rmvb'
    },
    {
      value: '3gp',
      label: '3gp'
    },
    {
      value: 'mkv',
      label: 'mkv'
    },
    {
      value: 'wmv',
      label: 'wmv'
    },
    {
      value: 'flv',
      label: 'flv'
    },
    {
      value: 'm4v',
      label: 'm4v'
    },
    {
      value: 'mov',
      label: 'mov'
    }
  ],
  fileType: [
    {
      value: 'doc',
      label: 'doc'
    },
    {
      value: 'docx',
      label: 'docx'
    },
    {
      value: 'xls',
      label: 'xls'
    },
    {
      value: 'xlsx',
      label: 'xlsx'
    },
    {
      value: 'txt',
      label: 'txt'
    },
    {
      value: 'wps',
      label: 'wps'
    },
    {
      value: 'ppt',
      label: 'ppt'
    },
    {
      value: 'pptx',
      label: 'pptx'
    },
    {
      value: 'pdf',
      label: 'pdf'
    }
  ],
  compressType: [
    {
      label: 'rar',
      value: 'rar'
    },
    {
      label: 'tar',
      value: 'tar'
    },
    {
      label: '7z',
      value: '7z'
    },
    {
      label: 'zip',
      value: 'zip'
    },
    {
      label: 'iso',
      value: 'iso'
    },
    {
      label: 'cab',
      value: 'cab'
    }
  ],
  fileTypeLimit: [
    {
      value: 1,
      label: '不限制'
    },
    {
      value: 2,
      label: '设置允许类型'
    },
    {
      value: 3,
      label: '设置禁止类型'
    }
  ],
  date: [
    {
      value: 'yyyy',
      label: '仅年'
    },
    {
      value: 'MM',
      label: '仅月'
    },
    {
      value: 'dd',
      label: '仅日'
    },
    {
      value: 'yyyy-MM',
      label: '年-月'
    },
    {
      value: 'MM-dd',
      label: '月-日'
    },
    {
      value: 'yyyy-MM-dd',
      label: '年-月-日'
    }
  ],
  datetime: [
    {
      value: 'dd',
      label: '仅日'
    },
    {
      value: 'MM-dd',
      label: '月-日'
    },
    {
      value: 'yyyy-MM-dd',
      label: '年-月-日'
    }
  ],
  timeType: [
    {
      value: 'date',
      label: '日期'
    },
    {
      value: 'time',
      label: '时间'
    },
    {
      value: 'datetime',
      label: '日期+时间'
    }
  ],
  accuracy: [
    {
      value: 'HH',
      label: '时'
    },
    {
      value: 'HH:mm',
      label: '分'
    },
    {
      value: 'HH:mm:ss',
      label: '秒'
    }
  ],
  // 资源图标类型
  resourceSuffix: [
    {
      suffix: 'unknown', // 未知
      icon: 'geshi_weizhi',
      fill: '#4E57BF'
    },
    // 压缩包
    {
      suffix: 'compress', // 通用
      icon: 'geshi_tongyongyasuobao',
      fill: '#4E57BF'
    },
    {
      suffix: 'tar',
      icon: 'geshi_yasuobaotar',
      fill: '#4E57BF'
    },
    {
      suffix: 'iso',
      icon: 'geshi_yasuobaoiso',
      fill: '#4E57BF'
    },
    {
      suffix: 'cab',
      icon: 'geshi_yasuobaocab',
      fill: '#4E57BF'
    },
    {
      suffix: '7z',
      icon: 'geshi_yasuobaoz',
      fill: '#4E57BF'
    },
    {
      suffix: 'rar',
      icon: 'geshi_yasuobaorar',
      fill: '#4E57BF'
    },
    {
      suffix: 'zip',
      icon: 'geshi_yasuobaozip',
      fill: '#4E57BF'
    },
    // 图片
    {
      suffix: 'image', // 通用
      icon: 'geshi_tongyongtupian',
      fill: '#1EC6DF'
    },
    {
      suffix: 'cdr',
      icon: 'geshi_tupiancdr',
      fill: '#1EC6DF'
    },
    {
      suffix: 'tga',
      icon: 'geshi_tupiantga',
      fill: '#1EC6DF'
    },
    {
      suffix: 'eps',
      icon: 'geshi_tupianeps',
      fill: '#1EC6DF'
    },
    {
      suffix: 'dxp',
      icon: 'geshi_tupiandxf',
      fill: '#1EC6DF'
    },
    {
      suffix: 'emf',
      icon: 'geshi_tupianemf',
      fill: '#1EC6DF'
    },
    {
      suffix: 'wmf',
      icon: 'geshi_tupianwmf',
      fill: '#1EC6DF'
    },
    {
      suffix: 'pcx',
      icon: 'geshi_tupianpcx',
      fill: '#1EC6DF'
    },
    {
      suffix: 'svg',
      icon: 'geshi_tupiansvg',
      fill: '#1EC6DF'
    },
    // {
    //   suffix: 'psd',
    //   icon: 'geshi_tupianpsd',
    //   fill: '#1EC6DF'
    // },
    {
      suffix: 'bmp',
      icon: 'geshi_tupianbmp',
      fill: '#1EC6DF'
    },
    // 音频
    {
      suffix: 'audio', // 通用
      icon: 'geshi_tongyongyinpin',
      fill: '#DB3E1F'
    },
    {
      suffix: 'aac',
      icon: 'geshi_yinpinaac',
      fill: '#DB3E1F'
    },
    {
      suffix: 'flac',
      icon: 'geshi_yinpinflac',
      fill: '#DB3E1F'
    },
    {
      suffix: 'midi',
      icon: 'geshi_yinpinmidi',
      fill: '#DB3E1F'
    },
    {
      suffix: 'ape',
      icon: 'geshi_yinpinape',
      fill: '#DB3E1F'
    },
    {
      suffix: 'ogg',
      icon: 'geshi_yinpinogg',
      fill: '#DB3E1F'
    },
    {
      suffix: 'wav',
      icon: 'geshi_yinpinwav',
      fill: '#DB3E1F'
    },
    {
      suffix: 'wma',
      icon: 'geshi_yinpinwma',
      fill: '#DB3E1F'
    },
    {
      suffix: 'mp3',
      icon: 'geshi_yinpinmp',
      fill: '#DB3E1F'
    },
    // 文档
    {
      suffix: 'file', // 通用
      icon: 'geshi_tongyongwendang',
      fill: '#2AA26A'
    },
    {
      suffix: 'xlsx',
      icon: 'geshi_wendangxlsx',
      fill: '#2AA26A'
    },
    {
      suffix: 'srt',
      icon: 'geshi_wendangsrt',
      fill: '#2AA26A'
    },
    {
      suffix: 'xls',
      icon: 'geshi_wendangxls',
      fill: '#2AA26A'
    },
    {
      suffix: 'html',
      icon: 'geshi_wendanghtml',
      fill: '#2AA26A'
    },
    {
      suffix: 'htm',
      icon: 'geshi_wendanghtm',
      fill: '#2AA26A'
    },
    {
      suffix: 'pdf',
      icon: 'geshi_wendangpdf',
      fill: '#2AA26A'
    },
    {
      suffix: 'pptx',
      icon: 'geshi_wendangpptx',
      fill: '#2AA26A'
    },
    {
      suffix: 'ppt',
      icon: 'geshi_wendangppt',
      fill: '#2AA26A'
    },
    {
      suffix: 'doc',
      icon: 'geshi_wendangdoc',
      fill: '#2AA26A'
    },
    {
      suffix: 'docx',
      icon: 'geshi_wendangdocx',
      fill: '#2AA26A'
    },
    {
      suffix: 'txt',
      icon: 'geshi_wendangtxt',
      fill: '#2AA26A'
    },
    // 视频
    {
      suffix: 'video', // 通用
      icon: 'geshi_tongyongshipin',
      fill: '#2987EB'
    },
    {
      suffix: 'swf',
      icon: 'geshi_shipinswf',
      fill: '#2987EB'
    },
    {
      suffix: 'fla',
      icon: 'geshi_shipinfla',
      fill: '#2987EB'
    },
    {
      suffix: 'flv',
      icon: 'geshi_shipinflv',
      fill: '#2987EB'
    },
    {
      suffix: 'mkv',
      icon: 'geshi_shipinmkv',
      fill: '#2987EB'
    },
    {
      suffix: 'vob',
      icon: 'geshi_shipinvob',
      fill: '#2987EB'
    },
    {
      suffix: 'dat',
      icon: 'geshi_shipindat',
      fill: '#2987EB'
    },
    {
      suffix: 'avi',
      icon: 'geshi_shipinavi',
      fill: '#2987EB'
    },
    {
      suffix: 'mov',
      icon: 'geshi_shipinmov',
      fill: '#2987EB'
    },
    {
      suffix: 'mp4',
      icon: 'geshi_shipinmv',
      fill: '#2987EB'
    },
    {
      suffix: 'mpeg',
      icon: 'geshi_shipinmpeg',
      fill: '#2987EB'
    },
    {
      suffix: 'mpe',
      icon: 'geshi_shipinmpe',
      fill: '#2987EB'
    },
    {
      suffix: 'mpg',
      icon: 'geshi_shipinmpg',
      fill: '#2987EB'
    },
    {
      suffix: '3gp',
      icon: 'geshi_shipingp',
      fill: '#2987EB'
    },
    {
      suffix: 'rmvb',
      icon: 'geshi_shipinrmvb',
      fill: '#2987EB'
    },
    {
      suffix: 'rm',
      icon: 'geshi_shipinrm',
      fill: '#2987EB'
    },
    {
      suffix: 'asx',
      icon: 'geshi_shipinasx',
      fill: '#2987EB'
    },
    {
      suffix: 'asf',
      icon: 'geshi_shipinasf',
      fill: '#2987EB'
    },
    {
      suffix: 'wmv',
      icon: 'geshi_shipinwmv',
      fill: '#2987EB'
    }
  ],
  method: [
    {
      label: 'GET',
      value: 1
    },
    {
      label: 'POST',
      value: 2
    },
    {
      label: 'DELETE',
      value: 3
    },
    {
      label: 'UPDATE',
      value: 4
    },
    {
      label: 'PUT',
      value: 5
    }
  ],
  wechatPermission: [
    { label: '消息管理权限', value: 1 },
    { label: '用户管理权限', value: 2 },
    { label: '帐号服务权限', value: 3 },
    { label: '网页服务权限', value: 4 },
    { label: '微信小店权限', value: 5 },
    { label: '微信多客服权限', value: 6 },
    { label: '群发与通知权限', value: 7 },
    { label: '微信卡券权限', value: 8 },
    { label: '微信扫一扫权限', value: 9 },
    { label: '微信连WIFI权限', value: 10 },
    { label: '素材管理权限', value: 11 },
    { label: '微信摇周边权限', value: 12 },
    { label: '微信门店权限', value: 13 },
    { label: '微信支付权限', value: 14 },
    { label: '自定义菜单权限', value: 15 },
    { label: '获取认证状态及信息', value: 16 },
    { label: '帐号管理权限', value: 17 },
    { label: '开发管理权限', value: 18 },
    { label: '客服消息管理权限', value: 19 },
    { label: '微信登录权限', value: 20 },
    { label: '数据分析权限', value: 21 },
    { label: '城市服务接口权限', value: 22 },
    { label: '广告管理权限', value: 23 },
    { label: '开放平台帐号管理权限', value: 24 },
    { label: '开放平台帐号管理权限', value: 25 },
    { label: '微信电子发票权限 ', value: 26 }
  ],
  sourceType: [
    {
      label: '全部',
      value: ''
    },
    {
      label: '搜索引擎',
      value: 1,
      children: [
        {
          label: '百度搜索',
          value: 11
        },
        {
          label: '360搜索',
          value: 12
        },
        {
          label: '搜狗搜索',
          value: 13
        },
        {
          label: '中国搜索',
          value: 14
        },
        {
          label: '微软搜索',
          value: 15
        },
        {
          label: '雅虎搜索',
          value: 16
        },
        {
          label: '谷歌搜索',
          value: 17
        },
        {
          label: '其他',
          value: 18
        }
      ]
    },
    {
      label: '外部链接',
      value: 2
    },
    {
      label: '直接访问',
      value: 3
    }
  ],
  checkGroups: [
    {
      name: '组织管理：',
      checkIds: [1, 2, 3, 4, 5],
      checkNames: [],
      options: [
        {
          label: '新建',
          value: 1,
          type: '1'
        },
        {
          label: '编辑',
          value: 2,
          type: '1'
        },
        {
          label: '删除',
          value: 3,
          type: '1'
        },
        {
          label: '成员管理',
          value: 4,
          type: '1'
        },
        {
          label: '权限分配',
          value: 5,
          type: '1'
        }
      ]
    },
    {
      name: '角色管理：',
      checkIds: [6, 7, 8, 9, 10],
      checkNames: [],
      options: [
        {
          label: '新建',
          value: 6,
          type: '2'
        },
        {
          label: '编辑',
          value: 7,
          type: '2'
        },
        {
          label: '删除',
          value: 8,
          type: '2'
        },
        {
          label: '成员管理',
          value: 9,
          type: '2'
        },
        {
          label: '权限分配',
          value: 10,
          type: '2'
        }
      ]
    },
    {
      name: '用户管理：',
      checkIds: [11, 12, 13, 14, 15],
      checkNames: [],
      options: [
        {
          label: '新建',
          value: 11,
          type: '3'
        },
        {
          label: '编辑',
          value: 12,
          type: '3'
        },
        {
          label: '删除',
          value: 13,
          type: '3'
        },
        {
          label: '修改密码',
          value: 14,
          type: '3'
        },
        {
          label: '权限分配',
          value: 15,
          type: '3'
        }
      ]
    },
    {
      name: '三员管理设置：',
      checkIds: [16, 17, 18],
      checkNames: [],
      options: [
        {
          label: '开启/关闭',
          value: 16,
          type: '4'
        },
        {
          label: '变更三员角色',
          value: 17,
          type: '4'
        },
        {
          label: '修改应用模块',
          value: 18,
          type: '4'
        }
      ]
    },
    {
      name: '站点管理：',
      checkIds: [],
      checkNames: [],
      options: [
        {
          label: '新建',
          value: 19,
          type: '5'
        },
        {
          label: '编辑',
          value: 20,
          type: '5'
        },
        {
          label: '删除',
          value: 21,
          type: '5'
        },
        {
          label: '开启/关闭',
          value: 22,
          type: '5'
        },
        {
          label: '发布静态页',
          value: 23,
          type: '5'
        },
        {
          label: '权限分配',
          value: 24,
          type: '5'
        }
      ]
    },
    {
      name: '栏目管理：',
      checkIds: [],
      checkNames: [],
      options: [
        {
          label: '新建',
          value: 25,
          type: '6'
        },
        {
          label: '编辑',
          value: 26,
          type: '6'
        },
        {
          label: '删除',
          value: 27,
          type: '6'
        },
        {
          label: '合并',
          value: 28,
          type: '6'
        },
        {
          label: '发布静态页',
          value: 29,
          type: '6'
        },
        {
          label: '权限分配',
          value: 30,
          type: '6'
        }
      ]
    },
    {
      name: '工作流：',
      checkIds: [],
      checkNames: [],
      options: [
        {
          label: '新建',
          value: 31,
          type: '7'
        },
        {
          label: '编辑',
          value: 32,
          type: '7'
        },
        {
          label: '删除',
          value: 33,
          type: '7'
        }
      ]
    }
  ]
}
