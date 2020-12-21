<script>
import ToDealTable from './ToDealTable'
export default {
  name: 'OverDueTable',
  extends: ToDealTable,
  data () {
    return {
      list: {
        api: 'fetchTaskOverDue',
        params: this.params,
        columns: [
          {
            scopeType: 'slot',
            label: '标题',
            prop: 'title'
          },
          {
            label: '逾期时间',
            prop: 'flowTime'
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
