<script>
import compoment from '../pending/PendingAudit'

const columns = [
  {
    prop: 'requestUserName',
    label: '申请人',
    maxWidth: '280px',
    minWidth: '80px'
  },
  {
    prop: 'createTime',
    label: '申请时间',
    maxWidth: '260px',
    minWidth: '80px'
  },
  {
    prop: 'modulePrompt',
    label: '所属模块',
    maxWidth: '140px',
    minWidth: '60px'
  },
  {
    prop: 'operatingPrompt',
    label: '操作类型',
    maxWidth: '140px',
    minWidth: '60px'
  },
  {
    prop: 'operatingDetails',
    label: '操作详情',
    scopeType: 'slot',
    minWidth: '180px'
  },
  {
    prop: 'auditUserName',
    label: '审核人',
    maxWidth: '180px',
    minWidth: '80px'
  },
  {
    prop: 'updateTime',
    label: '审核时间',
    maxWidth: '180px',
    minWidth: '90px'
  }
]
export default {
  name: 'user-manage',
  extends: compoment,
  props: {
    tabName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      columns,
      navName: 'theFailed',
      list: {
        showSelection: false,
        columns: [],
        showIndex: true,
        isIndexFixed: true,
        SerialNumber: 1, // 保存数据
        indexLabel: '序号',
        indexWidth: '80',
        api: '',
        params: {
          status: 3,
          module: ''
        },
        filterParams: ['region', 'times'],
        fields: [],
        handleColumn: []
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
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    }
  },
  watch: {

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
