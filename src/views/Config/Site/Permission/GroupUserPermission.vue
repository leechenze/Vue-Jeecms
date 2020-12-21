<script>
import UserPermission from './UserPermission'
const columns = [
  {
    prop: 'userPerm',
    label: '用户名/真实姓名',
    scopeType: 'checkbox',
    minWidth: '200',
    formatter: (row, column, cellValue, index) => {
      return `${row.user.username}/${row.user.realname}`
    }
  },
  {
    prop: 'orgName',
    label: '组织/角色',
    minWidth: '150',
    formatter: (row, column, cellValue, index) => {
      return `${row.user.orgName}/${row.user.roleNames}`
    }
  }
]
export default {
  name: 'GroupUserPermission',
  extends: UserPermission,
  data () {
    return {
      managerAble: false,
      showAssign: true,
      selectList: {
        api: 'fetchSitesGroupPermUser',
        showPagination: true,
        columns,
        params: {
          [this.name]: this.value,
          orgids: [''],
          orgid: '',
          roleid: '',
          key: ''
        }
      }
    }
  },
  methods: {
    // 请求数据并处理
    fetchTableCallBack (res) {
      if (res.code === 200) {
        const loop = function (data) {
          if (data instanceof Array && data.length) {
            return data.map(d => {
              d.id = d.user.id
              d.userPerm = d.siteOwner.hasPerm
              d['userPerm' + 'Disabled'] = !d.siteOwner.canAssign
              if (d.children instanceof Array && d.children.length) {
                d.children = loop(d.children)
              }
              return d
            })
          } else {
            return []
          }
        }
        this.selectList.data = loop(res.data.content)
        this.selectList.totalCount = res.data.totalElements
        this.managerAble = res.data.managerAble
        this.showAssign = !res.data.assigned
        this.initCheckStatus()
      }
    },
    // 保存按钮
    handleSave () {
      this.selectList.loading = true
      let perms = []
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          data.forEach(d => {
            perms.push({
              userId: d.id,
              selected: d.userPerm
            })
            if (d.children instanceof Array && d.children.length) {
              loop(d.children)
            }
          })
        }
      }
      loop(this.selectList.data)
      const data = {
        permOwner: 'user',
        siteId: this.value,
        perms
      }
      this.$request.fetchSitesGroupPermUserUpdate(data).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }
        this.hideSelectTableLoading()
      }).catch(() => {
        this.hideSelectTableLoading()
      })
    },
    // 额外处理: 查看权限、上级查看权限
    handleChangeExtra () {
      // 判断是否需要查看权限
      const hasDetailPerm = function (row) {
        const checked = Object.keys(row).filter(k => !['checkAllRow', 'isRowIndeterminate', 'detail'].includes(k) && !k.endsWith('Disabled') && row[k] === true)
        return checked.length > 0
      }
      // 循环增加查看权限
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          return data.map(d => {
            let detail = false
            if (d.children && d.children instanceof Array) {
              d.children = loop(d.children)
            }
            if (!detail) {
              detail = hasDetailPerm(d)
              if (detail) {
                d.detail = detail // 节点中有查询权限的就设查看权限为真，否则不处理
                if (!d.checkAllRow && !d.isRowIndeterminate) {
                  d.isRowIndeterminate = true
                }
              }
            }
            if (d.children && d.children instanceof Array) {
              if (!d.detail) {
                const childrenDetail = d.children.some(c => c.detail)
                if (childrenDetail) {
                  d.detail = childrenDetail // 子节点中有查询权限的就设查看权限为真，否则不处理
                  if (!d.checkAllRow && !d.isRowIndeterminate) {
                    d.isRowIndeterminate = true
                  }
                }
              }
            }
            return d
          })
        }
      }
      loop(this.selectList.data)
    }
  }
}
</script>
