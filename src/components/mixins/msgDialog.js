import MsgDialog from '@/components/dialog/MsgDialog'

export default {
  components: {
    MsgDialog
  },
  data () {
    return {
      msgDialog: {
        visible: false,
        showCancel: true,
        content: '',
        type: '',
        data: {}
      }
    }
  },
  methods: {
    showMsgDialog () {
      this.msgDialog.visible = true
    },
    hideMsgDialog () {
      this.msgDialog.visible = false
    }
  }
}
