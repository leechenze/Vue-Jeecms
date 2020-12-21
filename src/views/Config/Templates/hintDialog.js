import hintDialog from '@/views/Config/Templates/hintDialog.vue'

export default {
  components: {
    hintDialog
  },
  data () {
    return {
      hintDialog: {
        visible: false,
        showCancel: true,
        content: '',
        type: '',
        data: {}
      }
    }
  }
}
