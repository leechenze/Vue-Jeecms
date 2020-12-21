<template>
  <section class="base-form-container">
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      :label-width="labelWidth"
      :disabled="disabled"
      :label-position="labelPosition">
      <template v-for="(item, index) in formItems">
        <transition :key="index" name="fade" mode="out-in" >
          <!-- 是否隐藏 -->
          <div v-if="hiddenFn(item,form)"
            class="form-item-wrap">
            <!-- 标题 -->
            <div :id="item.titleID" :class="item.titleClass||'form-item-title'"
              v-if="item.type === 'title'"
            >
              <div class="jee-bg-light"></div>
              <h1>{{$t(item.label)}}
                <el-tag
                  type="success" size="mini" effect="plain"
                  v-if="item.tag">{{item.tag}}</el-tag>
              </h1>
              <jee-popover v-if="item.popoverText" :popoverText="item.popoverText" :popoverWidth="item.popoverWidth"/>
            </div>
            <!-- 单选 -->
            <el-form-item
              :label="$t(item.label)"
              :prop="item.prop"
              :label-width="item.labelWidth||labelWidth"
              v-else-if="item.type === 'radio'"
              :class="item.class||item.itemClass"
              class="sm-height"
            >
              <el-radio-group v-model="form[item.prop]" :disabled='item.disabled'  v-on:change="handRadioType(item,form)">
                <el-radio  v-for="(option, index)  in (item.options instanceof Array ? item.options : (options[item.options] || []))" :key="index" :label="option.value">{{$t(option.label)}}</el-radio>
              </el-radio-group>
              <span class="append-text hidden-md-and-down"
                :class="item.appendPlacement"
                v-if="item.appendText"><span class="unit" v-if="item.unit">{{item.unit}}</span>{{item.appendText}}</span>
              <jee-popover v-if="item.popoverText" :popoverText="item.popoverText" :popoverWidth="item.popoverWidth"/>
            </el-form-item>
               <!-- 树形多选标签（前） -->
                <el-form-item
                :key="index"
                :label="$t(item.label)"
                :prop="item.prop"
                :label-width="item.labelWidth||'0px'"
                v-else-if="item.type === 'checkTree'"
              >
                <div
                  :style="{width:item.width||'300px'}"
                  class="check-tree-wrap scrollbar">
                  <el-tree class="t-check"
                      :ref="'startTree'+item.prop"
                      v-bind="item"
                      show-checkbox
                      :default-checked-keys="form[item.prop]"
                      :data="item.tree"
                      node-key="id"
                      default-expand-all
                      @check="handleCheckChange"
                      @check-change="handleCheckKeys(item)">
                    </el-tree>
                </div>
              </el-form-item>
            <!-- 树形单选标签(后) -->
            <el-form-item
              :label-width="item.labelWidth||'0px'"
              class="tag-wrap"
              v-else-if="item.type==='selectTree'"
            >
              <label class="tree-box-label" v-show="item.label">{{item.label}}：</label>
              <div class="tree-box scrollbar">
                <el-tree
                  :data="(item.options instanceof Array ? item.options : (options[item.options] || []))"
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false">
                  <span style="width:100%"
                    @click="getRadioId(data,item)"
                    slot-scope="{ node, data }">
                    <span>{{ data.name || data[item.optionsLabel] }}</span>
                      <span class="right-radio">
                        <el-radio v-if="form[item.prop] === data.id"
                          v-model="form[item.prop]"
                          :label="data.id || data[item.optionsValue]"></el-radio>
                      </span>
                    </span>
                </el-tree>
              </div>
            </el-form-item>
            <!-- 多选框 -->
            <el-form-item
              :label="$t(item.label)"
              :prop="item.prop"
              v-else-if="item.type === 'checkbox'"
              class="sm-height"
              :class="item.class||item.itemClass"
            >
              <el-checkbox class="t-check"
                  v-if="item.complex" v-bind="item"
                  v-model="form[item.prop]" :true-label="item.optionValue||1" :false-label="item.defaultValue||0">
                  {{item.optionLabel}}
                </el-checkbox>
              <el-checkbox-group v-model="form[item.prop]" v-else>
                <el-checkbox
                  v-for="(option, index) in (item.options instanceof Array ? item.options : (options[item.options] || []))"
                  :key="index"
                  :label="option[item.optionValue || 'value']"
                  :class="item.class"
                >{{option[item.optionLabel || 'label']}}</el-checkbox>
                <jee-popover v-if="item.popoverText" :popoverText="item.popoverText" :popoverWidth="item.popoverWidth"/>
              </el-checkbox-group>

            </el-form-item>
            <!-- 多选框组 -->
            <el-form-item
              :label="$t(item.label)"
              :prop="item.prop"
              v-else-if="item.type === 'checkGroup'"
              class="sm-height" >
                <check-group :type="item.optionsType" v-model="form[item.prop]"></check-group>
                <div v-if="item.explain" class="gray">{{$t(item.explain)}}</div>
            </el-form-item>
            <!-- 线 -->
            <el-form-item
              :label="$t(item.label)"
              :prop="item.prop"
              v-bind="item"
              v-else-if="item.type === 'line'"
              class="sm-height" >
                <span class="t-line"></span>
            </el-form-item>
            <!-- 开关 -->
            <el-form-item
              :label="$t(item.label)"
              :prop="item.prop"
              v-else-if="item.type === 'switch'"
              class="sm-height-switch"
              :class="item.class"
            >
              <el-switch
                :disabled="item.disabled"
                v-model="form[item.prop]"
                :active-value="item.activeValue||true"
                @change="handleChangeSwitch(item.prop, item, $event)"
                :inactive-value="item.inactiveValue||false"
              ></el-switch>
              <span class="switch-text jee-font-hover"
                :class="{'jee-font-second-light': form[item.prop] === '1' || form[item.prop] === true}"
              >{{ form[item.prop] === (item.activeValue||true)? $t(item.enableText || 'global.enabled') : $t(item.disableText || 'global.disabled') }}</span>
              <jee-popover v-if="item.popoverText" :popoverText="item.popoverText" :popoverWidth="item.popoverWidth"/>
            </el-form-item>
            <!-- 选择框 -->
            <el-form-item
              :label="$t(item.label)"
              :prop="item.prop"
              :class="item.itemClass"
              v-else-if="item.type === 'select'"
            >
              <el-select
                popper-class="jee-border"
                v-model="form[item.prop]"
                :style="item.style"
                :popper-append-to-body="popperAppendToBody"
                :multiple="item.multiple||false"
                :collapse-tags='item.collapseTags||false'
                :disabled="item.disabled"
                :clearable="item.clearable"
                :placeholder="$t(item.placeholder)"
                @change="($event)=>{ item.change && item.change($event) }"
              >
                <el-option
                  v-for="option in (item.options instanceof Array ? item.options : (options[item.options] || []))"
                  :key="option[item.optionValue || 'value']"
                  :label="$t(option[item.optionLabel || 'label'])"
                  :value="option[item.optionValue || 'value']"
                  :disabled="option.disabled"
                >
                </el-option>
              </el-select>
              <span class="append-text hidden-md-and-down"
                :class="item.appendPlacement"
                v-if="item.appendText"><span class="unit" v-if="item.unit">{{item.unit}}</span>{{item.appendText}}</span>
              <jee-popover v-if="item.popoverText" :popoverText="item.popoverText" :popoverWidth="item.popoverWidth"/>
            </el-form-item>
            <!-- 级联选择框 -->
            <el-form-item
              :label="$t(item.label)"
              :prop="item.prop"
              v-else-if="item.type === 'cascader'"
            >
              <el-cascader
                v-model="form[item.prop]"
                :disabled="item.disabled"
                popper-class="jee-border"
                :placeholder="item.placeholder"
                :options="(item.options instanceof Array ? item.options : (options[item.options] || []))"
                :props="getCascaderProps(item)"
                :clearable="item.clearable"
                :show-all-levels="false"
                ref='cascader'
                @change="handleChangeCascader"
              ></el-cascader>
              <jee-popover v-if="item.popoverText" :popoverText="item.popoverText" :popoverWidth="item.popoverWidth"/>
              <div v-if="item.explain" class="gray"  v-html="item.explain"></div>
            </el-form-item>
            <!-- 纯文本 -->
            <el-form-item
              :label="$t(item.label)"
              v-else-if="item.type === 'text'"
              class="sm-height width"
              :class="item.class||{'lineShow': lineShow}"
            >
              <span class="form-item-text">{{getText(form, item)}}</span>
              <div v-if="item.explain"
                :style="item.explainWidth?'width:'+item.explainWidth:'width:414px'"
                class="gray"  v-html="item.explain"></div>
            </el-form-item>
            <!-- 日期时间 -->
            <el-form-item
              :label="$t(item.label)"
              v-else-if="item.type === 'time'"
              class="sm-height width"
            >
              <span class="form-item-text">{{$moment(form[item.prop],item.format)}}</span>
            </el-form-item>
            <!-- 多行输入框 -->
            <el-form-item
              :key="index"
              v-bind="item"
              :label="$t(item.label)"
              v-else-if="item.type === 'textarea'"
              :class="item.itemClass"
            >
              <el-input
                v-bind="item"
                :style="item.height?'height:'+item.height:'height:40px'"
                :autosize="item.autosize?item.autosize:{ minRows: 1 }" type="textarea"
                v-model="form[item.prop]" :placeholder="$t(item.placeholder)"></el-input>
              <div v-if="item.explain"  v-html="item.explain" v-bind="item.explainProp"
              :style="item.explainWidth?'width:'+item.explainWidth:'width:414px'"
              class="gray"  ></div>
              <a v-if="item.href" :href="item.href" class="jee-color href" target="_blank">{{item.hrefText}}</a>
            </el-form-item>
            <!-- 输入框 -->
            <el-form-item
              v-bind="item"
              :label="$t(item.label)"
              v-else-if="!item.type"
              :class="item.itemClass"
            >
              <el-input v-model="form[item.prop]" v-bind="item"
                @change="changePropText"
                :autofocus="item.autofocus"
                :placeholder="$t(item.placeholder)"
                v-on="$listeners"></el-input>

              <span class="append-text hidden-md-and-down"
                :class="item.appendPlacement"
                v-if="item.appendText"><span class="unit" v-if="item.unit">{{item.unit}}</span>{{item.appendText}}</span>
              <div v-if="item.explain"
              :style="item.explainWidth?'width:'+item.explainWidth:'width:414px'" class="gray" v-html="item.explain"></div>
              <jee-popover v-if="item.popoverText" :popoverText="item.popoverText" :popoverWidth="item.popoverWidth"/>
                <a v-if="item.href" :href="item.href" class="href jee-color" target="_blank">{{item.hrefText}}</a>
            </el-form-item>
            <!-- 数字输入框 -->
            <el-form-item
              :prop="item.prop"
              :label="$t(item.label)"
              :class="item.itemClass"
              v-else-if="item.type === 'number'"
            >
              <el-input-number class="jee-hover-color" size="middle" v-model="form[item.prop]" v-bind="item"></el-input-number>
              <span class="append-text hidden-md-and-down"
                :class="item.appendPlacement"
                v-if="item.appendText"><span class="unit" v-if="item.unit">{{item.unit}}</span>{{item.appendText}}</span>
              <jee-popover v-if="item.popoverText" :popoverText="item.popoverText" :popoverWidth="item.popoverWidth"/>
            </el-form-item>
            <!-- 颜色选择输入框 -->
            <el-form-item
              v-bind="item"
              :label="$t(item.label)"
              v-else-if="item.type === 'color'"
              class="color-input"
            >
              <el-input  v-model="form[item.prop]"
                :maxlength='item.maxlength'
                :placeholder="$t(item.placeholder)"
                v-on="$listeners">
              </el-input>
              <el-color-picker class="color-select" size="medium" v-model="form[item.prop]"></el-color-picker>
              <div v-if="item.explain"  v-html="item.explain"
              :style="item.explainWidth?'width:'+item.explainWidth:'width:414px'" class="gray"></div>
              <span class="append-text hidden-md-and-down"
                :class="item.appendPlacement"
                v-if="item.appendText"><span class="unit" v-if="item.unit">{{item.unit}}</span>{{item.appendText}}</span>
                <a v-if="item.href" :href="item.href" class="jee-color href" target="_blank">{{item.hrefText}}</a>
            </el-form-item>
            <!-- 输入选择框 -->
            <el-form-item
              v-bind="item"
              :label="$t(item.label)"
              :class="item.itemClass"
              v-else-if="item.type==='inputSelect'"
            >
              <el-input v-model="form[item.prop]" v-bind="item"
                        :placeholder="$t(item.placeholder)"
                        v-on="$listeners">
                <el-select popper-class="jee-border"
                           slot="append" v-model="form[item.selectObj.prop]">
                  <el-option
                    v-for="opt in item.selectObj.options"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value">
                  </el-option>
                </el-select>
              </el-input>
              <div v-if="item.explain"  v-html="item.explain"
              :style="item.explainWidth?'width:'+item.explainWidth:'width:414px'" class="gray"></div>
              <jee-popover v-if="item.popoverText" :popoverText="item.popoverText" :popoverWidth="item.popoverWidth"/>
              <span class="append-text hidden-md-and-down"
                :class="item.appendPlacement"
                v-if="item.appendText"><span class="unit" v-if="item.unit">{{item.unit}}</span>{{item.appendText}}</span>
                <a v-if="item.href" :href="item.href" class="jee-color href" target="_blank">{{item.hrefText}}</a>
            </el-form-item>
            <!-- 图片 -->
            <el-form-item
              :key="index"
              :prop="item.prop"
              :label="$t(item.label)"
              v-else-if="item.type === 'image'"
            >
              <el-image
                class="t-img  t-radius"
                v-bind="item"
                :src="item.weChat?$weChatUrl(form[item.prop]):$getPath(form[item.prop])"
                fit="contain">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
              </el-image>
            </el-form-item>
            <!-- 图片裁剪上传 -->
            <el-form-item
              :key="index"
              :prop="item.prop"
              :label="$t(item.label)"
              v-bind="item"
              v-else-if="item.type === 'imageUpload'"
            >
              <jee-image-resource-upload
               v-if="item.isResource"
                v-bind="item.option"
                :imgType="item.imgType"
                :uploadOption="item.option"
                :defaultUrl="form[item.urlProp]"
                v-model="form[item.prop]"
                @getUrl="getUrl"
              ></jee-image-resource-upload>
              <jee-image-upload v-else
                v-bind="item.option"
                :imgType="item.imgType"
                :defaultUrl="form[item.urlProp]"
                v-model="form[item.prop]"
                @getUrl="getUrl"
              ></jee-image-upload>
            </el-form-item>
            <!-- 单选框-按钮 -->
            <el-form-item
              :key="index"
              :prop="item.prop"
              :label="$t(item.label)"
              v-bind="item" class="radio-btn"
              v-else-if="item.type === 'radioBtn'"
            >
              <el-radio-group v-model="form[item.prop]">
                <el-radio-button
                  :style="{width:item.btnWidth}"
                  v-for="option in (item.options instanceof Array ? item.options : (options[item.options] || []))"
                  :key="option[item.optionValue || 'value']"
                  :label="$t(option[item.optionLabel || 'value'])"
                  :disabled="option.disabled">{{option[item.optionValue || 'label']}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <!-- 自定义，通过插槽传入 -->
            <el-form-item
              :key="index"
              :label-width="item.labelWidth||labelWidth"
              :label="$t(item.label)"
              :prop="item.prop"
              :class="item.class"
              v-else-if="item.type === 'slot'"
            >
              <slot :name="item.prop" :form="form" :item="item"></slot>
              <div v-if="item.explain"   v-html="item.explain"
              :style="item.explainWidth?'width:'+item.explainWidth:'width:414px'" class="gray"></div>
            </el-form-item>
          </div>
        </transition>
      </template>
      <el-form-item v-if="showSubmitButton && submitBtnsLength" class="item-btn" :class="submitBtns[0].class">
        <el-button v-for="(btn,btnIndex) in submitBtns"  :key="btnIndex"
          v-show="hiddenFn(btn,form)"
          v-bind="btn"
          :type="btn.type||'primary'" :size="btn.size||'small'"
          @click="handleSubmit($event,btn)">{{$t(btn.text)}}</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import checkGroup from '@/components/mixins/checkGroup'
export default {
  name: 'baseForm',
  mixins: [checkGroup],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    lineShow: {
      type: Boolean,
      default: false
    },
    showSubmitButton: {
      type: Boolean,
      default: true
    },
    titleDepiction: {
      type: Boolean,
      default: false
    },
    submitBtns: {
      type: Array,
      default: () => {
        return [{ text: '保存', subType: 'submit' }]
      }
    },
    labelWidth: {
      type: String,
      default: '110px'
    },
    form: {
      type: Object,
      default: () => ({})
    },
    formItems: {
      type: Array,
      default: () => []
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    },
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    labelPosition: {
      type: String,
      default: 'right'
    }
  },
  computed: {
    submitBtnsLength () {
      return this.submitBtns.filter(d => this.hiddenFn(d, this.form)).length
    }
  },
  methods: {
    resetFields () {
      this.$refs.form.resetFields()
    },
    handleCheckChange (data, node) {
      this.$emit(`getTheNod`, node.checkedKeys)
    },
    handleCheckKeys (data) {
      var ids = this.$refs['startTree' + data.prop][0].getCheckedKeys()
      this.form[data.prop] = ids
    },
    // 提交
    handleSubmit (e, btn) {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = Object.assign({}, this.form)
          if (btn.subType === 'submit') {
            this.$emit('handleConfirm', data)
          } else {
            this.$emit(`handleConfirm${btn.subType}`, data)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changePropText (val) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('changePropText', val)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 隐藏判断
    hiddenFn (item, form) {
      var status = true
      if (item.hiddenKey) {
        status = form[item.hiddenKey] === item.hiddenValue
      } else if (item.hiddenKeys && item.hiddenKeys instanceof Array) {
        item.hiddenKeys.forEach((v, i) => {
          if (form[v] !== item.hiddenValues[i]) {
            status = false
          }
        })
      } else if (item.hidden instanceof Function) {
        status = item.hidden(form)
      } else if (item.hiddenFunc instanceof Function) {
        status = item.hiddenFunc(form)
      }
      return status
    },
    // 获取文本
    getText (form, item) {
      let text = form[item.prop]
      const options = this.getOptions(item)
      if (options instanceof Array && options.length) {
        const option = options.find(d => d.value === form[item.prop])
        if (option) text = this.$t(option.label)
      }
      if (text instanceof Array) {
        text = text.join(',')
      }
      return text
    },
    // 获取下拉选项
    getOptions (item) {
      // eslint-disable-next-line no-unused-expressions
      this.options
      const { options } = item || {}
      if (options instanceof Array) {
        return options
      } else if (options instanceof String && this.options[options] instanceof Array) {
        return this.options[options]
      } else {
        return []
      }
    },
    // 树形单选框
    getRadioId (data, item) {
      this.form[item.prop] = data.id
    },
    // 获取级联选项
    getCascaderProps (item) {
      return { checkStrictly: true, ...(item.props || {}) }
    },
    // 选择级联项后自动隐藏下拉框
    handleChangeCascader () {
      this.$refs.cascader[0].dropDownVisible = false
    },
    handleChangeSwitch (prop, item, e) {
      this.$emit('handleSwitch' + prop, item, prop, e)
    },
    getUrl (item, prop) {
      this.$emit('getUrl' + prop, item, prop)
    },
    handRadioType (item, form) {
      this.$emit('getRadioType' + item.prop, item, form)
    }
  }
}

</script>

<style lang="scss">
.base-form-container{
  .t-line{
      display: inline-block;
      height: 1px;
      width: 100%;
      border-top: 1px solid #e8e8e8;
    }
  .big-title{
    display: flex;
    align-items: center;
    padding: 10px 0 28px 0;
    .jee-bg-light{
      display: none
    }
    h1{
      color: #333333;
      font-size: 18px;
    }
  }
  .item-btn{
    .el-form-item__content{
      line-height: 1;
    }
  }
  .form-item-wrap{
    .el-form-item.radio-btn{
      height: 32px;
      .el-form-item__content{
        line-height: 32px;
      }
      .el-form-item__label{
        line-height: 32px;
      }
    }
    width: 100%;
    >.el-form-item{
      >.el-form-item__content{
        .jee-input-append-select .el-input-group__append .el-input{
          height: 35px;
        }
        .el-input{
          .el-input__inner{
            width: 100%;
            box-sizing: border-box;
          }
        }
      }
    }
    .tip{
      margin-left: 20px;
      font-size: 14px;
    }
    .append-text{
      color: #B3B3B3;
      font-size: 12px;
      padding-left: 20px;
      white-space: nowrap;
      &.bottom{
        display: block;
        line-height: 12px;
        padding-top: 10px;
      }
      .unit{
        color: #333333;
        font-size: 14px;
        padding-right: 10px;
      }
    }
    .lineShow{
      .el-form-item__label{
        float: left;
      }
    }
    .form-item-text{
      font-size: 14px;
      color: #333333;
    }
  }
  .el-input,
  .el-textarea,
  .el-select {
    max-width: 414px;
    width: 100%;
  }
  .el-cascader{
    max-width: 414px;
    width: 100%;
  }
  .el-dialog{
    .el-dialog__body{
      .el-form{
        .el-form-item{
          &:last-of-type{
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .el-switch{
    height: 16px;
    margin-top: -2px;
  }
  .switch-text{
    margin-left: 10px;
    font-size: 12px;
    &:not(.jee-font-second-light){
      color: #666666;
    }
  }
  .el-textarea{
    min-height: 40px;
    height: inherit !important;
     .el-textarea__inner{
      min-height: 40px !important;
      height: inherit;
      line-height: 30px;
    }
  }
  .el-cascader{
    display: block;
  }
  .href{
    display: block;
    width: 414px;
    margin-bottom: -25px;
  }
  .color-input{
    position: relative;
    .el-input input{
      padding-left: 50px;
    }
    .color-select{
      position: absolute !important;
      left: 2px !important;
      top: 2px !important;
    }
  }
  .check-tree-wrap{
    overflow: overlay;
    width: 300px;
    height: 180px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 10px 0;
    .el-tree .el-tree-node{
      display: block !important;
      .el-tree-node__content{
        height: 32px;
      }
    }
  }

  .tag-wrap{
    // padding: 0 30px;
    .tree-box-label{
      line-height: 1;
      margin-bottom: 20px;
      display: block;
    }
    .tree-box{
      max-width: 414px;
      width: 100%;
      height: 330px;
      padding-top: 10px;
      box-sizing: border-box;
      overflow: overlay;
      border: 1px solid #e8e8e8;
      .el-tree{
        background-color: #fff;
      }
      .right-radio{
        display: inline-block;
        position: absolute;
        right: 30px;
        .el-radio__label{
          display: none;
        }
        .el-checkbox__inner{
          border-radius: 100%;
        }
      }
    }
    .label-box{
      min-height: 40px;
      width: 100%;
      box-sizing: border-box;
      border: 1px dashed #E8E8E8;
      margin-bottom: 20px;
      padding: 9px 0 0 20px;
      .tag-item{
        height: 22px;
        line-height: 20px;
        margin-bottom: 9px;
        margin-right: 20px;
        font-size: 12px;
        .el-tag__close{
          color: #999;
          &:hover{
            background-color: transparent;
          }
        }
      }
    }
  }
}
</style>
