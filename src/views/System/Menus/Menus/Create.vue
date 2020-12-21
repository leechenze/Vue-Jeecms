<script>
import Detail from './Detail'
export default {
  extends: Detail,
  name: 'menusMenusCreate',
  data () {
    return {
      form: {
        submitBtns: [{
          text: '保存并继续新增',
          subType: 'Continue',
          disabled: !this._checkPermission('/menus', 'POST')
        }, {
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/menus', 'POST')
        }]
      }
    }
  }
}
</script>
