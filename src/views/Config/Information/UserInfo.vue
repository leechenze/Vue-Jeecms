<script>
import Membership from './Membership'
export default {
  extends: Membership,
  name: 'contentCreate',
  computed: {
    columns () {
      return [
        {
          prop: 'id',
          label: '序号',
          width: '65px'
        },
        {
          prop: 'mesTitle',
          label: '模板名称',
          scopeType: 'link',
          href: '/config/information/detail',
          showOverflowTooltip: true,
          params: {
            status: this.name === '1' ? 'member' : 'user'
          }
        },
        {
          prop: 'mesCode',
          label: '模板标识'
        },
        {
          prop: 'remark',
          label: '模板描述',
          showOverflowTooltip: true
        },
        {
          prop: 'openPhone',
          type: 'Note',
          label: '短信',
          disabled: !this._checkPermission('/messageTpl', 'PUT'),
          scopeType: 'slot'
        },
        {
          prop: 'openMail',
          type: 'Eamil',
          disableText: '关闭',
          enableText: '开启',
          scopeType: 'switch',
          label: '邮件',
          showOverflowTooltip: true,
          disabled: !this._checkPermission('/messageTpl', 'PUT')
        },
        {
          prop: 'openLetter',
          type: 'Letter',
          disableText: '关闭',
          enableText: '开启',
          scopeType: 'switch',
          label: '站内信',
          showOverflowTooltip: true,
          disabled: !this._checkPermission('/messageTpl', 'PUT'),
          hiddenFn: (from) => {
            return true
          }
        }
      ]
    }
  }
}

</script>
