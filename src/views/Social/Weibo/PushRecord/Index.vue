
<script>
import fansIndex from './../Fans/Index'
var columns = [
  {
    prop: 'title',
    label: '内容标题',
    width: '235px',
    showOverflowTooltip: true
  },
  {
    prop: 'weiboInfo.screenName',
    label: '微博名称',
    minWidth: '90px'
  },
  {
    prop: 'pushResult',
    label: '推送状态',
    formatter: (row) => {
      switch (row.pushResult) {
        case 1:
          return '推送成功'
        case 2:
          return '推送失败'
        default:
          return ''
      }
    }
  },
  {
    prop: 'articleSourceUrl',
    label: '原文链接',
    scopeType: 'link',
    target: '_blank',
    width: '180px',
    showOverflowTooltip: true
  },
  {
    prop: 'articleWeiboUrl',
    label: '推送链接',
    scopeType: 'link',
    target: '_blank',
    width: '180px',
    showOverflowTooltip: true
  },
  {
    prop: 'createTime',
    label: '推送时间',
    scopeType: 'time'
  },
  {
    prop: 'createUser',
    label: '推送人',
    minWidth: '160px'
  }
]
export default {
  extends: fansIndex,
  name: 'socialWeiboPushRecord',
  data () {
    return {
      headers: {
        showAlertIcon: false,
        title: '',
        content: ''
      },
      rowKey: 'uid',
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            label: '推送状态:',
            style: {
              width: '118px'
            },
            value: 'status',
            options: [
              { label: '全部', value: '' },
              { label: '成功', value: '1' },
              { label: '失败', value: '2' }
            ]
          },
          {
            type: 'searchInput',
            label: '内容标题：',
            value: 'title',
            placeholder: '搜索内容标题'
          }
        ]
      },
      list: {
        showIndex: true,
        indexLabel: '序号',
        columns,
        api: '',
        params: {
          'uid': '',
          'status': '',
          'title': ''
        }
      }
    }
  },
  methods: {
    getDataList () {
      if (this.weiboinfoList.length > 0) {
        this.list.api = 'weiboarticlepushPage'
        this.list.params.uid = this.weiboinfoList[0].uid
        this.activeId = this.weiboinfoList[0].uid
        this.fetchTableApi()
      }
    },
    // 点击列表
    setActive (id) {
      this.list.params.uid = id
      this.activeId = id
      this.list.api = 'weiboarticlepushPage'
      this.fetchTableApi()
    }
  }
}
</script>
