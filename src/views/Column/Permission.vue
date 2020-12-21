<script>
import BaseComp from './BaseComp'
import OrgPermission from './Permission/OrgPermission'
import UserPermission from './Permission/UserPermission'

export default {
  name: 'columnPermission',
  extends: BaseComp,
  components: {
    OrgPermission,
    UserPermission
  },
  data () {
    return {
      dataType: 2,
      currentTab: 'org',
      tabs: [
        {
          label: '组织及角色',
          name: 'org',
          component: 'OrgPermission'
        },
        {
          label: '用户',
          name: 'user',
          component: 'UserPermission'
        }
      ]
    }
  },
  computed: {
    columnHeaders () {
      if (this.currentTab === 'org') {
        return {
          content: '设置可管理当前栏目的组织及角色',
          title: '操作说明：'
        }
      } else {
        return {
          content: '设置可管理当前栏目的用户',
          title: '操作说明：'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
