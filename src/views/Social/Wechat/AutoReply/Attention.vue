
<script>
import Received from './Received'
export default {
  extends: Received,
  name: 'attention',
  data () {
    return {
      label: ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .received-wrap-index{
    .rw-wrap{
      min-height: 350px;
      color: #666666;
      padding: 5px 20px;
      box-sizing: border-box;
    }
  }
</style>
