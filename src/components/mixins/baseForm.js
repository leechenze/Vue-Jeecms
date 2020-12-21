import BaseForm from '@/components/form/BaseForm'
import i18n from '@/i18n'

export default {
  components: {
    BaseForm
  },
  data () {
    return {
      form: {
        loading: false,
        showSubmitButton: true,
        submitBtns: [{ text: i18n.t('global.save'), subType: 'submit' }],
        api: '',
        params: {
          id: ''
        },
        form: {},
        formItems: [],
        rules: {},
        request: false
      }
    }
  },
  methods: {
    hideFormLoading (err) {
      if (err) console.log(err)
      this.form.loading = false
    },
    // api接口请求
    fetchFormApi () {
      // console.log(!this.form.params.id && !this.form.request)
      if (!this.form.params.id && !this.form.request) {
        return
      }
      this.form.loading = true
      if (this.form.api) {
        try {
          return this.$request[this.form.api](this.form.params)
            .then(this.fetchFormCallBack)
            .then(this.hideFormLoading)
            .catch(this.hideFormLoading)
        } catch (error) {
          console.log(error)
          this.form.loading = false
        }
      } else {
        return new Promise((resolve, reject) => {
          this.form.loading = false
          resolve()
        }).catch(this.hideFormLoading)
      }
    },
    fetchFormCallBack () {
      this.hideFormLoading()
    },
    updateFormApi () {
      const { id } = this.$route.query
      if (id && id !== this.form.params.id) {
        this.form.params.id = id
        this.fetchFormApi()
      }
    }
  }
}
