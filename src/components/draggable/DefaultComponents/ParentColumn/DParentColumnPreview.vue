<template>
  <section class="d-select-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <el-cascader
        v-model="val"
        class="column-cascader"
        ref='cascader'
        popper-class="jee-border"
        placeholder='请选择'
        clearable
        :props="getCascaderProps"
        :options="getOptions"
        :show-all-levels="false"
        :appendToBody="false"
        @change="handleChange"
      />
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>
<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
import { getTreeIds, deepClone } from '@/utils'
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'DParentColumnPreview',
  mixins: [previewMixin],
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    channelId: {
      type: [String, Number],
      default: ''
    }
  },
  inject: ['changeColumn'],
  methods: {
    ...mapActions('column', ['FetchColumnOptions']),
    getTreeIds,
    handleChange (val) {
      this.$refs.cascader.dropDownVisible = false
      if (val instanceof Array && val.length && this.changeColumn) {
        this.changeColumn(val[val.length - 1])
      }
    }
  },
  computed: {
    ...mapGetters(['columnOptions']),
    getCascaderProps () {
      return {
        checkStrictly: true
      }
    },
    val: {
      get () {
        const value = (this.value || this.value === 0) ? this.getTreeIds(this.getOptions, this.value) : []
        return value
      },
      set (val) {
        const value = val.length ? val[val.length - 1] : ''
        this.$emit('input', value)
      }
    },
    getOptions () {
      const id = this.channelId
      // 不使用深拷贝会产生无限循环
      let options = [{ label: '无', value: 0, id: 0, name: '无' }, ...deepClone(this.columnOptions)]
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          return data.map(d => {
            d.disabled = d.value === Number(id)
            if (d.children instanceof Array && d.children.length) {
              d.children = loop(d.children)
            }
            return d
          })
        }
      }
      return loop(options)
    }
  },
  mounted () {
    this.FetchColumnOptions()
    // this.$refs.cascader.initMenu()
    // this.$nextTick(() => {
    //   if (this.$refs.cascader.menu) {
    //     const cascader = document.getElementsByClassName('column-cascader')[0]
    //     if (cascader) cascader.appendChild(this.$refs.cascader.menu.$el)
    //   }
    // })
  }
}
</script>
