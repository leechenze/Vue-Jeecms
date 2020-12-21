<script>
import OrgPermission from './OrgPermission'
const columns = [
  {
    prop: 'orgPerm',
    label: '组织',
    scopeType: 'checkbox',
    minWidth: '200',
    formatter: (row, column, cellValue, index) => {
      return row.orgId ? row.orgName : ''
    },
    hidden: (row, column) => {
      if (row.orgId) {
        return false
      } else {
        return true
      }
    }
  },
  {
    prop: 'rolePerm',
    label: '角色',
    minWidth: '120',
    scopeType: 'checkbox',
    formatter: (row, column, cellValue, index) => {
      return row.orgId ? '' : row.roleName
    },
    hidden: (row, column) => {
      if (row.orgId) {
        return true
      } else {
        return false
      }
    }
  }
]
export default {
  name: 'GroupOrgPermission',
  extends: OrgPermission,
  data () {
    return {
      selectList: {
        api: 'fetchSitesGroupPermOrg',
        columns,
        isTree: true,
        params: {
          [this.name]: this.value
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
              d.id = d.orgId ? 'orgId_' + d.orgId : 'roleId_' + d.roleId
              d.orgPerm = d.siteOwner.hasPerm
              d['orgPerm' + 'Disabled'] = !d.siteOwner.canAssign
              d.rolePerm = d.siteOwner.hasPerm
              d['rolePerm' + 'Disabled'] = !d.siteOwner.canAssign
              if (d.children instanceof Array && d.children.length) {
                d.children = loop(d.children)
              }
              return d
            })
          } else {
            return []
          }
        }
        this.selectList.data = loop(res.data)
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
              roleId: d.roleId,
              orgId: d.orgId,
              selected: d.orgId ? d.orgPerm : d.rolePerm
            })
            if (d.children instanceof Array && d.children.length) {
              loop(d.children)
            }
          })
        }
      }
      loop(this.selectList.data)
      const data = {
        permOwner: 'org',
        siteId: this.value,
        perms
      }
      this.$request.fetchSitesGroupPermOrgUpdate(data).then(res => {
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
    }
  }
}
</script>
