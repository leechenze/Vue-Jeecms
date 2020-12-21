<script>
import Permission from './Permission'
export default {
  name: 'docPermission',
  extends: Permission,
  data () {
    return {
      dataType: 3,
      headers: {
        content: '这里是文档权限管理',
        title: '操作说明：'
      }
    }
  },
  computed: {
    columnHeaders () {
      if (this.currentTab === 'org') {
        return {
          content: '设置组织及角色对当前栏目中内容的管理权限',
          title: '操作说明：'
        }
      } else {
        return {
          content: '设置用户对当前栏目中内容的管理权限',
          title: '操作说明：'
        }
      }
    }
  }
}
</script>
