import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  data () {
    const columns = [
      {
        prop: 'user.username',
        scopeType: 'user',
        icon: 'touxiang1'
      },
      {
        prop: 'ip',
        scopeType: 'ip'
      },
      {
        prop: 'createTime',
        scopeType: 'time',
        icon: 'shijian',
        iconLeft: '35px'
      }

    ]
    const statusList = [
      {
        prop: 'status',
        textLeft: '30px',
        scopeType: 'status',
        showColunms: 'status',
        options: [
          {
            label: '【待审核】',
            value: 0,
            color: '#FF9300'
          },
          {
            label: '【审核通过】',
            value: 1,
            color: '#6AC043'
          },
          {
            label: '【审核不通过】',
            value: 2,
            color: '#FF0000'
          }
        ]
      },
      {
        prop: 'isTop',
        scopeType: 'status',
        showColunms: 'isTop',
        options: [
          {
            label: '【已推荐】',
            value: true,
            color: '#6AC043'
          }
        ]
      },
      {
        prop: 'isUserDisable',
        scopeType: 'status',
        showColunms: 'isUserDisable',
        options: [
          {
            label: '【用户禁止评论】',
            value: true,
            color: '#FF0000'
          }
        ]
      },
      {
        prop: 'isIpDisable',
        scopeType: 'status',
        showColunms: 'isIpDisable',
        options: [
          {
            label: '【IP禁止评论】',
            value: true,
            color: '#FF0000'
          }
        ]
      },
      {
        prop: 'isReport',
        scopeType: 'status',
        showColunms: 'isReport',
        options: [
          {
            label: '【举报】',
            value: true,
            color: '#FF0000'
          }
        ]
      }
    ]
    const comments = [
      {
        prop: 'commentText',
        label: '评论：',
        showComment: 'commentText'
      },
      {
        prop: 'replyAdminComment.commentText',
        label: '回复：',
        showComment: 'replyAdminComment',
        reply: true,
        replyUesr: 'replyAdminComment.user.username',
        replyTime: 'replyTime'
      }
    ]
    const commentsNum = [
      {
        icon: 'quanbu',
        label: '全部',
        text: 'allNum'
      },
      {
        icon: 'daishen',
        label: '待审核',
        text: 'pendingReview'
      },
      {
        icon: 'shenghetongguo',
        label: '已审核',
        text: 'successReview'
      },
      {
        icon: 'shenghebutongguo',
        label: '审核不通过',
        text: 'errorReview'
      }
    ]
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      list: {
        api: 'fetchInteractUsercommentList',
        loading: false,
        columns,
        statusList,
        comments,
        commentsNum,
        footButtons: [],
        title: 'content.channel.name',
        titleText: 'content.title',
        data: [],
        showCheckAll: 'head',
        params: {
          senior: false,
          selectID: '',
          fuzzySearch2: '',
          fuzzySearch1: '',
          criticalTimes: [],
          replyTimes: [],
          status: '',
          isReply: '',
          channel: [''],
          startTime: '',
          endTime: '',
          replyStartTime: '',
          replyEndTime: '',
          fuzzySearch: '',
          userName: '',
          ip: '',
          commentText: '',
          replytText: '',
          title: '',
          isTop: ''
        },
        ids: []
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'status',
            placeholder: '请选择审核状态',
            label: '审核状态：',
            style: {
              width: '120px'
            },
            options: [
              {
                label: '所有',
                value: ''
              },
              {
                label: '待审核',
                value: 0
              },
              {
                label: '审核通过',
                value: 1
              },
              {
                label: '审核未通过',
                value: 2
              }
            ]
          },
          {
            type: 'cascader',
            value: 'channel',
            props: {
              label: 'name',
              value: 'id',
              checkStrictly: true
            },
            style: {
              width: '150px'
            },
            placeholder: '请选择栏目',
            label: '选择栏目：',
            options: []
          },
          {
            type: 'select',
            value: '',
            placeholder: '请选择是否推荐',
            label: '是否推荐：',
            style: {
              width: '120px'
            },
            options: [
              {
                label: '所有',
                value: ''
              },
              {
                label: '是',
                value: true
              },
              {
                label: '否',
                value: false
              }
            ]
          },
          {
            type: 'select',
            value: 'isReply',
            placeholder: '请选择回复状态',
            label: '回复状态：',
            hiddenKey: 'senior',
            hiddenValue: true,
            style: {
              width: '120px'
            },
            options: [
              {
                label: '所有',
                value: ''
              },
              {
                label: '是',
                value: true
              },
              {
                label: '否',
                value: false
              }
            ]
          },
          {
            type: 'timePicker',
            value: 'criticalTimes',
            hiddenKey: 'senior',
            hiddenValue: true,
            startText: '起始评论时间',
            endText: '截止评论时间'
          },
          {
            type: 'timePicker',
            value: 'replyTimes',
            hiddenKey: 'senior',
            hiddenValue: true,
            startText: '起始回复时间',
            endText: '截止回复时间'
          },
          {
            type: 'select',
            value: 'selectID',
            placeholder: '请选择',
            options: [
              {
                label: '模糊搜索',
                value: ''
              },
              {
                label: '评论人',
                value: 1
              },
              {
                label: '评论Ip',
                value: 2
              },
              {
                label: '评论内容',
                value: 3
              },
              {
                label: '回复内容',
                value: 4
              },
              {
                label: '文章标题',
                value: 5
              }
            ],
            style: {
              width: '120px'
            },
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'searchInput',
            value: 'fuzzySearch1',
            placeholder: '评论人/IP/评论内容/回复内容/文章标题',
            hiddenKey: 'senior',
            hiddenValue: false
          },
          {
            type: 'searchInput',
            value: 'fuzzySearch2',
            placeholder: '请输入搜索内容',
            fuzzySearch2: true,
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'senior',
            value: 'senior'
          }
        ]
      },
      causeForm: {
      },
      causeRules: {
        replytText: [this.$rules.required()]
      },
      causeFormItems: [
        {
          prop: 'replytText',
          type: 'textarea',
          autosize: { minRows: 3 },
          maxlength: 150
        }
      ],
      causeButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      rowId: '',
      reportNum: null
    }
  },
  computed: {
    ...mapGetters(['siteExtendConfig']),
    commentAudit () {
      return this.siteExtendConfig && this.siteExtendConfig.cfg ? this.siteExtendConfig.cfg.commentAudit : '0'
    },
    header () {
      return {
        showAlertIcon: false,
        buttons: [
          {
            type: 'All',
            btn: 'Pass',
            text: '审核通过',
            icon: 'shenghetongguo',
            isHidden: this.commentAudit !== '1',
            disabled: !this._checkPermission('/usercomment/status', 'PUT')
          },
          {
            type: 'All',
            btn: 'NoPass',
            text: '审核不通过',
            icon: 'shenghebutongguo',
            isHidden: this.commentAudit !== '1',
            disabled: !this._checkPermission('/usercomment/status', 'PUT')
          },
          {
            type: 'All',
            btn: 'Delete',
            text: '删除评论',
            icon: 'delete',
            disabled: !this._checkPermission('/usercomment', 'DELETE')
          }
        ]
      }
    },
    footButtons () {
      const that = this
      return [
        {
          type: 'Referrer',
          icon: 'tuijian',
          text: '推荐',
          hiddenKey: 'isTop',
          hiddenValue: false,
          disabled: !this._checkPermission('/usercomment/top', 'PUT')
        },
        {
          type: 'NoReferrer',
          icon: 'quxiaotuijian',
          text: '取消推荐',
          hiddenKey: 'isTop',
          hiddenValue: true,
          disabled: !this._checkPermission('/usercomment/top', 'PUT')
        },
        {
          type: 'Pass',
          icon: 'shenghetongguo',
          text: '审核通过',
          // 0-待审核 1-审核通过 2-审核未通过
          hiddenFunc (item) {
            return that.commentAudit === '1' && (item.status === 0 || item.status === 2)
          },
          disabled: !this._checkPermission('/usercomment/status', 'PUT')
        },
        {
          type: 'NoPass',
          icon: 'shenghebutongguo',
          text: '审核不通过',
          hiddenFunc (item) {
            return that.commentAudit === '1' && item.status === 0
          },
          disabled: !this._checkPermission('/usercomment/status', 'PUT')
        },
        {
          type: 'BackPass',
          icon: 'huanyuan',
          text: '撤回审核',
          hiddenFunc (item) {
            return that.commentAudit === '1' && item.status === 1
          },
          disabled: !this._checkPermission('/usercomment/status', 'PUT')
        },
        {
          type: 'NoUesr',
          icon: 'jingzhiyonghupinglun',
          text: '禁止用户评论',
          hiddenKey: 'isUserDisable',
          hiddenValue: false,
          disabled: !this._checkPermission('/usercomment/plus/stop', 'PUT')
        },
        {
          type: 'ToUesr',
          icon: 'quxiaojingzhi',
          text: '取消用户禁止',
          hiddenKey: 'isUserDisable',
          hiddenValue: true,
          disabled: !this._checkPermission('/usercomment/cancel/stop', 'PUT')
        },
        {
          type: 'NoIp',
          icon: 'jinyong',
          text: '禁止IP评论',
          hiddenKey: 'isIpDisable',
          hiddenValue: false,
          disabled: !this._checkPermission('/usercomment/plus/stop', 'PUT')
        },
        {
          type: 'ToIp',
          icon: 'quxiaojingzhi',
          text: '取消IP禁止',
          hiddenKey: 'isIpDisable',
          hiddenValue: true,
          disabled: !this._checkPermission('/usercomment/cancel/stop', 'PUT')
        },
        {
          type: 'Reply',
          icon: 'huifu1',
          text: '回复',
          hiddenKey: 'reply',
          hiddenValue: false,
          disabled: !this._checkPermission('/usercomment/reply', 'PUT')
        },
        {
          type: 'PutReply',
          icon: 'xiugaihuifu',
          text: '修改回复',
          hiddenKey: 'reply',
          hiddenValue: true,
          disabled: !this._checkPermission('/usercomment/reply', 'PUT')
        },
        {
          type: 'Delete',
          icon: 'delete',
          text: '删除评论',
          disabled: !this._checkPermission('/usercomment', 'DELETE')
        }
      ]
    }
  },
  methods: {
    ...mapActions('config', ['FetchSiteExtentConfig'])
  },
  mounted () {
    this.FetchSiteExtentConfig()
  }
}
