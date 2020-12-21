import screenfull from 'screenfull'

export default {
  data () {
    return {
      isFullscreen: false
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.destroy()
  },
  methods: {
    handleClickScreenFull () {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      if (this.screenFullElement) {
        let el = document.querySelector(this.screenFullElement)
        screenfull.toggle(el)
      } else {
        screenfull.toggle()
      }
    },
    handleChangeScreenFull () {
      this.isFullscreen = screenfull.isFullscreen
      this.$emit('handleChangeScreenFull', this.isFullscreen)
    },
    init () {
      if (screenfull.enabled) {
        screenfull.on('change', this.handleChangeScreenFull)
      }
    },
    destroy () {
      if (screenfull.enabled) {
        screenfull.off('change', this.handleChangeScreenFull)
      }
    }
  }
}
