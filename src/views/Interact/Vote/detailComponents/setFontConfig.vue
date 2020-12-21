<template>
  <section class="interact-vote-set-font">
    <div class="font-wrap">
      <el-select class="font-size" @change="setSize"
        v-model="config.fontSize" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <div class="font-weight font-text"  @click="setWeight(config.fontWigth)"
        :class="{'is-active jee-bg-light':config.fontWigth===600}">B</div>
      <div class="font-color font-text">
        <color-picker v-model="config.fontColor" @change="setColor" :isRight="true"></color-picker>
      </div>
      <div class="font-align" v-if="config.fontAlign">
        <div class="font-text" @click="setAlign(icon)"
          :class="{'is-active jee-bg-light':config.fontAlign===icon.key}"
          v-for="(icon,index) in icons" :key="index">
          <jee-icon :iconClass="icon.icon"></jee-icon>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import colorPicker from '@/components/plugin/color-picker'
export default {
  name: 'setFontConfig',
  components: {
    colorPicker
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          fontSize: 14,
          fontWigth: 400,
          fontColor: '#333333'
        }
      }
    }
  },
  data () {
    return {
      config: this.value,
      options: [12, 14, 16, 18, 20, 22, 24, 28, 30, 32, 36, 40, 44, 48],
      icons: [
        { icon: 'zuoduiqi', key: 'left' },
        { icon: 'juzhongduiqi', key: 'center' },
        { icon: 'youduiqi', key: 'right' }
      ]
    }
  },
  watch: {
    value (newVal, oldVal) {
      this.config = newVal
    }
  },
  methods: {
    setAlign (item) {
      this.$set(this.config, 'fontAlign', item.key)
      this.$emit('input', this.config)
    },
    setWeight (w) {
      this.$set(this.config, 'fontWigth', w === 400 ? 600 : 400)
      this.$emit('input', this.config)
    },
    setColor () {
      this.$emit('input', this.config)
    },
    setSize () {
      this.$emit('input', this.config)
    }
  }

}
</script>
<style lang="scss">
.interact-vote-set-font{
  .font-wrap{
    display: flex;
    .font-size{
      width: 87px;
    }
    .font-text{
      width: 32px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      margin: 4px 0;
      margin-left: 4px;
      cursor: pointer;
    }
    .font-weight{
      font-size: 20px;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Chrome/Safari/Opera */
      -khtml-user-select: none; /* Konqueror */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently*/
    }
    .font-align{
      display: flex;
      font-size: 17px;
      .jee-svg-icon{
        fill:#666666;
      }
    }
    .is-active{
      color: #ffffff;
      border-radius: 4px;
      .jee-svg-icon{
        fill:#ffffff;
      }
    }
  }
}
</style>
