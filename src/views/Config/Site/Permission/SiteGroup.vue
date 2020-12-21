<script>
import Site from './Site'
import GroupOrgPermission from './GroupOrgPermission'
import GroupUserPermission from './GroupUserPermission'

export default {
  name: 'configSitePermissionSiteGroup',
  extends: Site,
  components: {
    OrgPermission: GroupOrgPermission,
    UserPermission: GroupUserPermission
  },
  data () {
    return {
      // headers: {
      //   title: '操作说明',
      //   content: '这里是站群权限分配'
      // }
    }
  },
  computed: {
    columnHeaders () {
      if (this.currentTab === 'org') {
        return {
          content: '设置可管理当前站点的组织及角色',
          title: '操作说明：'
        }
      } else {
        return {
          content: '设置可管理当前站点的用户',
          title: '操作说明：'
        }
      }
    }
  }
}
</script>
