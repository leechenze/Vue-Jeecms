
<script>
import defaultAdd from './DefaultAdd'

export default {
  extends: defaultAdd,
  name: 'socialWechatIndividualizationAdd',
  data () {
    return {
      form: {
        showSubmitButton: true,
        labelWidth: '166px',
        form: {
          areaCodes: [],
          'areaCode': '',
          'clientDictCode': '3',
          'languageDictCode': '',
          'menuGroupName': '',
          'menuGroupType': 2,
          'sexDictCode': '',
          'status': 2,
          'tagId': '',
          'appId': '',
          'menuList': [
            {
              'choiceType': 1,
              'childs': [],
              'linkUrl': '',
              'menuKey': '',
              'menuName': '默认菜单',
              'menuType': 'media_id',
              'miniprogramAppid': '',
              'miniprogramPagepath': '',
              'mediaId': ''
            }
          ]
        },
        formItems: [
          {
            prop: 'menuGroupName',
            label: '菜单方案组名称：',
            placeholder: '请输入菜单方案名称',
            maxlength: 50
          },
          {
            prop: 'areaCodes',
            label: '显示对象：',
            class: 't-900',
            type: 'slot'
          },
          {
            prop: 'menuList',
            type: 'slot'
          }
        ],
        rules: {
          menuGroupName: [
            this.$rules.required()
          ]
        }
      }
    }
  },
  activated () {
    const { type, linkType } = this.$route.query
    this.form.showSubmitButton = type === 'add' || linkType === 'copy' || linkType === 'edit'
  }
}
</script>
