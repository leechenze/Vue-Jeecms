<script>
import compoment from './OrgTables'

const columns = [
  {
    prop: 'name',
    label: '站点名称',
    width: '400px'
  },
  {
    prop: 'value',
    label: '内容发布数',
    sortable: 'custom'
  }
]
export default {
  name: 'site-tables',
  extends: compoment,
  props: {
    tabName: {
      type: String,
      default: ''
    }
  },
  watch: {
    'tabName': function (item) {
      if (item === this.navName) {
        this.list.api = this.urlApi
        // this.fetchTableApi()
      }
      // this.list.api = this.urlApi
      // this.fetchTableApi()
    }
  },
  data () {
    return {
      columns,
      numTitle: '',
      navName: 'siteTables',
      urlApi: 'fetchstatisticsSitegeneralSiteData',
      searchHeaders: {
        searchItems: [
          {
            type: 'cutButton',
            value: 'time2',
            label: '时间:',
            options: [
              {
                label: '今日 ',
                value: 1
              },
              {
                label: '本周',
                value: 2
              },
              {
                label: '本月',
                value: 3
              },
              {
                label: '今年',
                value: 4
              },
              {
                label: '累计',
                value: 5
              }
            ]
          },
          {
            type: 'dataPicker',
            rangeText: '-',
            label: '选择日期：',
            value: 'time'
          },
          {
            type: 'searchInput',
            value: 'key',
            placeholder: '请输入站点名称'
          },
          {
            btnType: 'Export',
            type: 'henderBorderBtn',
            text: '导出',
            icon: 'daochu-tianchong'
          }
        ]
      },
      list: {
        filterParams: ['time', 'time2'],
        api: '',
        indexWidth: '85px',
        params: {
          'key': '',
          'sort': true,
          'time': [],
          'time2': 1,
          'startDate': '',
          'endDate': ''
        },
        columns,
        showIndex: false,
        showSelection: false,
        data: []
      }
    }
  },
  computed: {
  },
  methods: {
    bandNaveData (item) {
      this.navIndex = item.name
      this.list.params.module = item.id
      this.fetchTableApi()
    },
    // 回调
    fetchTableCallBack (res) {
      this.numTitle = res.data.sum
      if (res.code === 200) {
        this.list.data = res.data.page.content.map(v => {
          return v
        })
        this.list.totalCount = res.data.page.totalElements
      }
    }
  },
  activated () {
  },
  mounted () {
    this.$nextTick(() => {
      this.list.columns = this.columns
    })
  }
}
</script>
