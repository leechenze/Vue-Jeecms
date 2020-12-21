<template>
  <section class="material-dialog-index">
      <image-texts ref="ImageTexts" :data="comment" :appId="appId" @handleConfirm="handleConfirm"></image-texts>
      <images ref="Images" :data="comment" :appId="appId" @handleConfirm="handleConfirm"></images>
      <voices ref="Voices" :data="comment" :appId="appId" @handleConfirm="handleConfirm"></voices>
      <videos ref="Videos" :data="comment" :appId="appId" @handleConfirm="handleConfirm"></videos>
      <texts ref="Texts" :data="comment" :appId="appId" @handleConfirm="handleConfirm"></texts>
      <key-words ref="KeyWords" :data="comment" :appId="appId" @handleConfirm="handleConfirm"></key-words>
  </section>
</template>

<script>
import ImageTexts from './ImageTexts'
import Images from './Images'
import Texts from './Texts'
import Voices from './Voices'
import Videos from './Videos'
import KeyWords from './KeyWords'
// KeyWord
export default {
  name: 'materialDialogIndex',
  components: {
    ImageTexts,
    Images,
    Texts,
    Voices,
    Videos,
    KeyWords
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    appId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      component: '',
      comment: this.data || {}
    }
  },
  methods: {
    showTheDialog (type, data) {
      if (data.type) {
        this.comment = this.data
        this.component = data.type + 's'
        this.$refs[this.component].showDialog()
      }
    },
    handleConfirm (data) {
      var type = 0
      switch (this.component) {
        case 'Texts':
          type = 1
          break
        case 'ImageTexts':
          type = 2
          break
        case 'Images':
          type = 3
          break
        case 'Voices':
          type = 4
          break
        case 'Videos':
          type = 5
          break
        case 'KeyWords':
          type = 6
          break
      }
      if (JSON.stringify(this.comment) !== JSON.stringify(data)) {
        this.comment = data
        this.$emit('handleConfirm', data, type)
      }
    }
  },
  watch: {
    data: {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.comment = newVal
        } else {
          this.comment = {}
        }
      }
    }
  }
}
</script>
