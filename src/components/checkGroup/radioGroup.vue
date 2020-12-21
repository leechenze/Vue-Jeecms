<template>
  <el-radio-group
    v-model="val"
    class="radio-group-index">
      <template v-for="(item, index) in groups">
          <div :style="boxStyle" class="radio-group-box" :key="index">
            <div :style="imgStyle" class="radio-group-img"
              @click="changeRadio(item[rowKey])"
              :class="{'jee-border':value === item[rowKey]}">
              <el-image
                :src="(props.wechat?$weChatUrl(item.url):item.url)||getPropText(item,props.url)"
                fit="contain">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
              </el-image>
            </div>
            <el-radio
              :style="{maxWidth:imgStyle.width}"
              :title="item.label||getPropText(item,props.label)"
              class="radio-group-radio"
              :label="item[rowKey]">{{item.label||getPropText(item,props.label)}}</el-radio>
          </div>
        </template>
  </el-radio-group>
</template>

<script>
export default {
  name: 'radio-group',
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    groups: {
      type: Array,
      default: () => {
        return []
      }
    },
    props: {
      type: Object,
      default: () => {
        return {}
      }
    },
    imgStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    boxStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    rowKey: {
      type: String,
      default: 'id'
    }
  },
  computed: {
    val: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    changeRadio (id) {
      this.$emit('input', id)
    },
    getPropText (item, prop, formatProp) {
      var i = prop.indexOf('.')
      if (i > -1) {
        var data = prop.split('.')
        var obj = item
        const loop = function (data) {
          if (data instanceof Array) {
            data.forEach(v => {
              if (obj[v]) {
                obj = obj[v]
              } else {
                obj = ''
              }
            })
          }
        }
        loop(data)
        if (obj instanceof Array) {
          obj = obj.join(',')
        }
        return obj
      } else {
        if (item[prop] instanceof Array) {
          item[prop] = item[prop].join(',')
        }
        return item[prop]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .radio-group-index{
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    min-height: 320px;
    min-width: 578px;
    padding-top: 30px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    .radio-group-box{
      margin: 0 30px 30px;
      background-color: #fff;
    }
    .radio-group-img{
      width: 80px;
      height: 80px;
      box-sizing: border-box;
      border: 1px solid #fff;
      background-color: #f8f8f8;
    }
    .radio-group-radio{
      line-height: 1;
      margin: 20px 0 30px;
      max-width: 80px;
      overflow: hidden;
      text-overflow:ellipsis;
    }
  }
</style>
