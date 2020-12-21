<script>
import ToDealTable from './ToDealTable'
export default {
  name: 'HandleTable',
  extends: ToDealTable,
  data () {
    return {
      list: {
        api: 'fetchTaskHandle',
        params: this.params,
        columns: [
          {
            scopeType: 'slot',
            label: '标题',
            prop: 'title'
          },
          {
            label: '当前节点',
            prop: 'nodeName'
          },
          {
            scopeType: 'slot',
            label: '操作选项',
            prop: 'handle2'
          }
        ],
        showIndex: true,
        showSelection: false
      }
    }
  }
}
</script>
