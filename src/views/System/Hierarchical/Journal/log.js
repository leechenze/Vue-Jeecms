export default {
  data () {
    return {
      logForm: {

      },
      logButtons: [],
      logFormItems: [
        {
          type: 'text',
          prop: 'uri',
          label: '请求路径'
        },
        {
          type: 'text',
          prop: 'logType',
          label: '日志类别'
        },
        {
          type: 'text',
          prop: 'eventType',
          label: '系统类型'
        },
        {
          type: 'text',
          prop: 'subEventType',
          label: '系统子类型'
        },
        {
          type: 'text',
          prop: 'logLevel',
          label: '日志级别'
        },
        {
          type: 'text',
          prop: 'operateType',
          label: '操作类型'
        },
        {
          type: 'text',
          prop: 'requestResult',
          label: '操作结果',
          textColor: '#666666'
        },
        {
          type: 'text',
          prop: 'username',
          label: '用户名'
        },
        {
          type: 'text',
          prop: 'clientIp',
          label: '客户端IP'
        },
        {
          type: 'text',
          prop: 'responseTime',
          label: '响应时间'
        },
        {
          type: 'text',
          prop: 'createTime',
          label: '操作时间'
        },
        {
          type: 'text',
          prop: 'os',
          label: '操作系统'
        },
        {
          type: 'text',
          prop: 'browser',
          label: '浏览器名称'
        },
        {
          type: 'text',
          prop: 'userAgent',
          label: '用户代理'
        },
        {
          type: 'text',
          prop: 'paramData',
          label: '请求参数'
        }
      ],
      searchHeader: {
        searchItems: [
          {
            type: 'input',
            value: 'username',
            label: '用户名：',
            placeholder: '请输入用户名',
            style: {
              width: '200px'
            }
          },
          {
            type: 'timePicker',
            value: 'time',
            label: '操作时间',
            rangeText: '-'
          },
          {
            type: 'input',
            value: 'clientIp',
            label: '客户端IP：',
            placeholder: '请输入客户端IP',
            hiddenKey: 'senior',
            hiddenValue: true,
            style: {
              width: '200px'
            }
          },
          {
            type: 'input',
            value: 'subEventType',
            label: '事件子类型：',
            placeholder: '请输入事件子类型',
            hiddenKey: 'senior',
            hiddenValue: true,
            style: {
              width: '220px'
            }
          },
          {
            type: 'select',
            value: 'logLevel',
            label: '日志级别：',
            placeholder: '请选择日志级别',
            hiddenKey: 'senior',
            hiddenValue: true,
            options: [
              {
                value: '',
                label: '所有'
              },
              {
                value: '1',
                label: '高'
              },
              {
                value: '2',
                label: '中'
              },
              {
                value: '3',
                label: '低'
              }
            ],
            style: {
              width: '120px'
            }
          },
          {
            type: 'select',
            value: 'operateType',
            label: '操作类型：',
            placeholder: '请选择操作类型',
            hiddenKey: 'senior',
            hiddenValue: true,
            options: [
              {
                value: '',
                label: '所有'
              },
              {
                value: '1',
                label: '查询'
              },
              {
                value: '2',
                label: '新增'
              },
              {
                value: '3',
                label: '修改'
              },
              {
                value: '4',
                label: '删除'
              },
              {
                value: '5',
                label: '导出'
              },
              {
                value: '6',
                label: '导入'
              },
              {
                value: '7',
                label: '上传'
              },
              {
                value: '8',
                label: '下载'
              }
            ],
            style: {
              width: '120px'
            }
          },
          {
            type: 'select',
            value: 'requestResult',
            label: '操作结果：',
            placeholder: '请选择操作结果',
            hiddenKey: 'senior',
            hiddenValue: true,
            options: [
              {
                value: '',
                label: '所有'
              },
              {
                value: '1',
                label: '成功'
              },
              {
                value: '2',
                label: '失败'
              }
            ],
            style: {
              width: '120px'
            }
          },
          {
            btnType: 'Search',
            type: 'henderBorderBtn',
            text: '搜索',
            hiddenKey: 'senior',
            hiddenValue: true,
            icon: 'xiazai15'
          },
          {
            btnType: 'Export',
            type: 'henderBorderBtn',
            text: '导出',
            icon: 'daochu-tianchong',
            hiddenKey: 'senior',
            hiddenValue: true,
            disabled: !this._checkPermission('/cmsadmin/logs/export', 'POST')
          },
          {
            type: 'senior',
            value: 'senior'
          }
        ]
      }
    }
  },
  methods: {
    // 日志详情
    logDetail (row) {
      this.$request.fetchLogs(row).then(res => {
        if (res.code === 200) {
          this.logForm = res.data
          if (row.subEventType) {
            this.logForm.subEventType = row.subEventType
          }
          if (this.logForm.eventType === 1) {
            this.logForm.eventType = '系统事件'
          } else if (this.logForm.eventType === 2) {
            this.logForm.eventType = '业务事件'
          }
          this.logForm.uri = '[' + this.logForm.method + ']' + this.logForm.uri
          if (this.logForm.logType === 1) {
            this.logForm.logType = '信息'
          } else if (this.logForm.logType === 2) {
            this.logForm.logType = '警告'
          }
          if (this.logForm.logLevel === 1) {
            this.logForm.logLevel = '高'
          } else if (this.logForm.logLevel === 2) {
            this.logForm.logLevel = '中'
          } else if (this.logForm.logLevel === 3) {
            this.logForm.logLevel = '低'
          }
          if (this.logForm.operateType === 1) {
            this.logForm.operateType = '查询'
          } else if (this.logForm.operateType === 2) {
            this.logForm.operateType = '新增'
          } else if (this.logForm.operateType === 3) {
            this.logForm.operateType = '修改'
          } else if (this.logForm.operateType === 4) {
            this.logForm.operateType = '删除'
          } else if (this.logForm.operateType === 5) {
            this.logForm.operateType = '导出'
          } else if (this.logForm.operateType === 6) {
            this.logForm.operateType = '导入'
          } else if (this.logForm.operateType === 7) {
            this.logForm.operateType = '上传'
          } else if (this.logForm.operateType === 8) {
            this.logForm.operateType = '下载'
          }
          if (this.logForm.requestResult === 1) {
            this.logForm.requestResult = '成功'
            this.logFormItems.find(d => d.prop === 'requestResult').textColor = '#15B811'
          } else if (this.logForm.requestResult === 2) {
            this.logForm.requestResult = '失败'
            this.logFormItems.find(d => d.prop === 'requestResult').textColor = '#FF0000'
          }
          this.$refs.logDialog.showDialog()
        }
      })
    },
    // 导出
    handleEventBtnExport () {
      this.$confirm('是否确定导出日志？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchLogExport(this.list.params).then(res => {
          // if (res.code === 200) {
          if (this.list.params.logCategory === 1) {
            this.$exportClick(res, '系统日志.xlsx')
          } else if (this.list.params.logCategory === 2) {
            this.$exportClick(res, '业务日志.xlsx')
          } else if (this.list.params.logCategory === 3) {
            this.$exportClick(res, '审计日志.xlsx')
          } else if (this.list.params.logCategory === 4) {
            this.$exportClick(res, '安全日志.xlsx')
          }

          // }
        })
      })
    }
  }
}
