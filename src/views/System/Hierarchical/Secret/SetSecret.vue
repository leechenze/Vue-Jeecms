<script>
import compoment from './ToSecret'
const columns = [
  {
    prop: 'username',
    label: '用户名',
    maxWidth: '230px',
    minWidth: '100px'
  },
  {
    prop: 'realname',
    label: '真实姓名',
    maxWidth: '230px',
    minWidth: '80px'
  },
  {
    prop: 'orgName',
    label: '所属组织',
    maxWidth: '160px',
    minWidth: '100px'
  },
  {
    prop: 'roleNames',
    label: '所属角色',
    maxWidth: '160px',
    minWidth: '100px'
  },
  {
    prop: 'linephone',
    label: '座机号',
    maxWidth: '160px',
    minWidth: '120px'
  },
  {
    prop: 'telephone',
    label: '手机号',
    maxWidth: '160px',
    minWidth: '120px'
  },
  {
    prop: 'email',
    label: '电子邮箱',
    maxWidth: '160px',
    minWidth: '130px'
  },
  {
    prop: 'enabled',
    label: '状态',
    scopeType: 'slot',
    maxWidth: '120px',
    minWidth: '80px'
  },
  {
    prop: 'createUser',
    label: '创建人',
    maxWidth: '160px',
    minWidth: '100px'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    maxWidth: '180px',
    minWidth: '160px'
  },
  {
    prop: 'userSecretId',
    label: '设置人员密级',
    scopeType: 'slot',
    maxWidth: '300px',
    minWidth: '180px'
  }
]
export default {
  name: 'set-secret',
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
      navName: 'setSecret',
      urlApi: 'fetchUsersecretSetpage',
      list: {
        showSelection: true,
        columns: [],
        showIndex: true,
        isIndexFixed: true,
        SerialNumber: 1, // 保存数据
        indexLabel: '序号',
        indexWidth: '60',
        api: '',
        params: {
          orgids: [''],
          key: '',
          orgid: '',
          roleid: '',
          enabled: '',
          userSecretId: ''
        },
        filterParams: ['region', 'times', 'orgids'],
        fields: [],
        tableProps: {
          maxHeight: 550
        }
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'enabled',
            label: '状态：',
            options: [
              {
                label: '所有',
                value: ''
              },
              {
                label: '启用',
                value: true
              },
              {
                label: '禁用',
                value: false
              }
            ]
          },
          {
            type: 'cascader',
            value: 'orgids',
            props: {
              label: 'name',
              value: 'id',
              checkStrictly: true
            },
            label: '所属组织：',
            placeholder: '请选择',
            options: []
          },
          {
            type: 'select',
            value: 'roleid',
            label: '所属角色：',
            optionLabel: 'roleName',
            optionValue: 'id',
            options: []
          },
          {
            type: 'select',
            label: '所属密级：',
            value: 'userSecretId',
            optionLabel: 'name',
            optionValue: 'id',
            style: {
              width: '100px'
            },
            options: []
          },
          {
            type: 'searchInput',
            value: 'key',
            placeholder: '请输入关键字'
          }
        ]
      },
      allOption: [
        {
          label: '所有',
          value: ''
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    fetchUserSecretsListHeader () {
      this.$request.fetchUserSecretsList().then(res => {
        let arr = [{ name: '所有', id: '' }]
        if (res.code === 200) {
          this.searchHeader.searchItems.find(d => d.value === 'userSecretId').options = arr.concat(res.data)
        }
      })
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          d.linephone = d.userExt.linephone || ''
          d.realname = d.userExt.realname || ''
          if (!d.userSecret) {
            d.userSecretId = ''
            d.userSecretname = ''
          } else {
            d.userSecretId = d.userSecret.id
            d.userSecretname = d.userSecret.name
          }
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    }
  },
  activated () {
  },
  mounted () {
    this.fetchUserSecretsListHeader()
    this.$nextTick(() => {
      this.list.columns = this.columns
    })
  }
}
</script>
