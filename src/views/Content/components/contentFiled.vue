<template>
  <section>
      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
      @handleSenior="handleSenior"
    ></search-header>
    <content-table
      v-bind="list"
      @handleEventAll="handleEventAll"
      @handleBatchAll="handleBatchAll"
    >
    </content-table>
  </section>
</template>

<script>
import searchHeader from '@/components/mixins/searchHeader'
import contentTable from '@/components/mixins/ContentTable'
import mixins from './mixins'
var columns = [
  {
    prop: 'channelName',
    scopeType: 'model'
  },
  {
    prop: 'title',
    scopeType: 'link',
    href: '/content/detail',
    params: [
      {
        key: 'channelId',
        value: 'channelId'
      }
    ],
    style: { flex: 1, fontSize: '16px', color: '#333' }
  },
  {
    prop: 'updateUser',
    style: { width: '115px' },
    label: '归档人：'
  },
  {
    prop: 'updateTime',
    style: { width: '215px' },
    label: '归档时间：'
  },
  {
    prop: 'id',
    style: { width: '75px' },
    label: 'ID：'
  },
  {
    prop: 'model.modelName',
    style: { width: '75px' },
    label: '模型：'
  }

]
var keyOption = [
  {
    label: '标题',
    value: 1
  },
  {
    label: '作者',
    value: 2
  },
  {
    label: '来源',
    value: 3
  },
  {
    label: '描述',
    value: 4
  },
  {
    label: '创建人',
    value: 5
  }
]
var btnsData = [
  {
    name: '出档',
    type: 'Fileout',
    power: 'fileContentAble',
    icon: 'chudang'
  }
]
var icons = [
  {
    label: '永久置顶',
    icon: 'zhiding'
  },
  {
    label: '限时置顶，到期时间',
    icon: 'xianshizhiding'
  },
  {
    label: '复制，来源栏目',
    icon: 'fuzhilaiyuanlangmu'
  },
  {
    label: '链接型引用，来源栏目',
    icon: 'lianjiexingyinyong'
  },
  {
    label: '镜像型引用，来源栏目',
    icon: 'jingxiangyinyong'
  },
  {
    label: '推荐',
    icon: 'tuijian'
  }
]
export default {
  name: 'contentFiled',
  mixins: [searchHeader, mixins, contentTable],
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    isChild: {
      type: Boolean,
      default: false
    },
    id: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      list: {
        columns,
        data: [],
        status: 'status',
        showCheckAll: 'head',
        rowKey: 'id',
        api: '',
        identIcons: Object.assign([], icons),
        linkData: Object.assign([], btnsData),
        params: {
          'contentType': '',
          'fileStartTime': '',
          'fileEndTime': '',
          'createType': '',
          'keyType': 1,
          'key': '',
          'senior': true,
          'channelIds': [0]
        },
        header: {
          showAlertIcon: false,
          buttons: [
            {
              type: 'All',
              btn: 'Fileout',
              text: '出档',
              icon: 'chudang',
              disabled: !this._checkPermission('/contentext/file', 'POST')
            }
          ]
        }
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'contentType',
            label: '内容类型：',
            placeholder: '请选择',
            optionLabel: 'typeName',
            optionValue: 'id',
            style: {
              width: '100px'
            },
            options: []
          },
          {
            type: 'cascader',
            value: 'channelIds',
            label: '归档前栏目：',
            style: {
              width: '160px'
            },
            props: {
              label: 'name',
              value: 'id',
              checkStrictly: true
            },
            placeholder: '请选择',
            options: []
          },
          {
            type: 'timePicker',
            value: 'times',
            hiddenKey: 'senior',
            hiddenValue: true,
            startText: '归档开始时间',
            endText: '归档结束时间'
          },
          {
            type: 'searchInput',
            value: 'key',
            placeholder: '请输入标题'
          },
          {
            type: 'senior',
            value: 'senior',
            btnClass: 'z-hidden-lg-and-up'
          }
        ]
      },
      type: 1
    }
  },
  methods: {
    handleSearchs () {
      this.list.pageNo = 1
      var params = this.list.params
      if (params.times) {
        params.fileStartTime = params.times[0]
        params.fileEndTime = params.times[1]
      } else {
        params.fileStartTime = ''
        params.fileEndTime = ''
      }
      this.searchHeader.searchItems
        .find(v => v.value === 'key').placeholder = '请输入' + keyOption
          .find(d => d.value === params.keyType).label
      this.list.params = params
      this.fetchContentApi()
    },
    // 回调
    fetchContentCallBack (res) {
      if (res.code === 200 && res.data) {
        console.log()
        let content = res.data.content.map((d, i) => {
          var arr = []
          if (d.top) {
            var obj = {}
            if (d.topEndTime) {
              obj = {
                label: '限时置顶，到期时间' + d.topEndTime,
                icon: 'xianshizhiding'
              }
            } else {
              obj = {
                label: '永久置顶',
                icon: 'zhiding'
              }
            }
            arr.push(obj)
          }
          if (d.copyName) {
            arr.push({
              label: '复制，来源栏目' + d.copyName,
              icon: 'fuzhilaiyuanlangmu'
            })
          }
          if (d.quote) {
            let obj = {}
            if (d.createType === 7) {
              obj = {
                label: '镜像型引用，来源栏目：' + d.quoteChannelName,
                icon: 'jingxiangyinyong'
              }
            } else if (d.createType === 6) {
              obj = {
                label: '链接型引用，来源栏目：' + d.quoteChannelName,
                icon: 'lianjiexingyinyong'
              }
            }
            arr.push(obj)
          } else if (d.quoteChannel && d.quoteChannel.length > 0) {
            d.quoteChannel.forEach(v => {
              let obj = {}
              if (v.createType === 7) {
                obj = {
                  label: '镜像型引用到栏目：' + v.name,
                  icon: 'jingxiangyinyong'
                }
              } else if (v.createType === 6) {
                obj = {
                  label: '链接型引用到栏目：' + v.name,
                  icon: 'lianjiexingyinyong'
                }
              }
              arr.push(obj)
            })
          }
          if (d.contentTypes instanceof Array) {
            d.contentTypes.forEach(v => {
              arr.push({
                label: v.typeName,
                img: v.logoResource ? this.$getPath(v.logoResource.url) : ''
              })
            })
          }
          d.identIcons = arr
          return d
        })
        this.list.data = content
        this.list.totalCount = res.data.totalElements
      } else {
        this.list.data = []
        this.list.totalCount = 0
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.name === 'filed') {
        this.list.api = 'fetchContentextPigeonhole'
        this.getSearchData()
      }
    })
  },
  activated () {
    if (this.$route.query.type === 'list' && this.name === 'filed') {
      this.fetchContentApi()
      this.$router.push({ query: { type: '' } })
    }
  },
  watch: {
    id (newData, oldData) {
      if (newData !== oldData && this.name === 'filed') {
        this.channelId = newData
        this.list.params.channelIds = newData ? [newData] : []
        this.fetchContentApi()
      }
    },
    name (newData, oldData) {
      if (this.name === 'filed') {
        this.list.api = 'fetchContentextPigeonhole'
        this.fetchContentApi()
        if (this.searchHeader.searchItems.find(v => v.value === 'contentType').options.length < 1) {
          this.getSearchData()
        }
      }
    }
  }

}
</script>
