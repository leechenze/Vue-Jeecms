<template>
  <section class="form-dialog-container">
    <el-dialog
      v-loading="loading"
      :title="$t(title)"
      height="80%"
      :width="width"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :append-to-body="appendToBody"
      :before-close="handleClose"
      :custom-class="customClass"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="labelWidth"
        label-suffix="："
      >
        <input type="password" style="position: absolute;z-index: -1;width:0;opacity:0;"/>
        <input type="text" style="position: absolute;z-index: -1;width:0;opacity:0;"/>
        <template v-for="(item, index) in formItems">
          <transition :key="index" name="fade" mode="out-in" >
            <!-- 是否隐藏 -->
            <div v-if="hiddenFn(item,form)" class="form-item-wrap">
              <!-- 放置文字 -->
              <div :style="item.style||{paddingLeft:item.labelWidth||'100px'}"
                v-if="item.type === 'place'">
                <span>{{item.text}}</span>
              </div>
              <!-- 注意文字 : 注意：xxx-->
              <div class="careful-txt"
                v-if="item.type === 'careful'">
                <label class="careful-label"
                v-if="item.label"
                >{{item.label}}</label>
                <span>{{item.text}}</span>
              </div>
              <el-form-item
                v-else-if="item.type === 'warning'"
                label-width="0">
                <el-alert
                  :title="$t(item.text)"
                  type="warning"
                  show-icon
                  :closable="false"
                ></el-alert>
              </el-form-item>
              <!-- 单选 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                :prop="item.prop"
                v-else-if="item.type === 'radio'"
                class="mini-height"
              >
                <el-radio-group v-model="form[item.prop]">
                  <el-radio v-for="(option, index) in (item.options instanceof Array ? item.options : (options[item.options] || []))"
                  :key="index" :label="option[item.optionValue || 'value']">{{option[item.optionLabel || 'label']}}
                  <jee-popover style="margin-left:8px" v-if="option.popoverText" v-bind="option"/></el-radio>
                </el-radio-group>
                <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 多选框 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                :label-width="item.labelWidth"
                :prop="item.prop"
                v-else-if="item.type === 'checkbox'"
                class="mini-height"
              >
                <el-checkbox class="t-check"
                  v-if="item.complex" v-bind="item" @change="selectChange" :disabled="item.disabled"
                  v-model="form[item.prop]" :true-label="item.optionValue||1" :false-label="item.defaultValue||0">
                  {{item.optionLabel}}
                </el-checkbox>
                <el-checkbox-group v-model="form[item.prop]" v-else>
                  <el-checkbox v-for="(option, index) in (item.options instanceof Array ? item.options : (options[item.options] || []))"
                  :class="item.class"
                  :key="index" :label="option[item.optionValue || 'value']">{{option[item.optionLabel || 'label']}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <!-- 带标题-线框多选组 -->
              <el-form-item
                :label-width="item.labelWidth||'0px'"
                :prop="item.prop"
                class=" mini-height check-share"
                v-else-if="item.type === 'sharebox'">
                <div class="check-share-label">
                  <label class="check-share-title">{{item.title}}</label>
                  <el-link :key="index"
                    @click="handleAdd($event,item)"
                    :underline="false" >
                    <jee-icon :iconClass="item.linkIcon||'jia1'"
                      class="jee-hover-fill link-icon"></jee-icon>
                      {{item.linkName||$t('global.add')}}
                  </el-link>
                </div>
                <el-checkbox-group v-model="form[item.prop]">
                  <el-checkbox
                    v-for="(option, index) in (item.options instanceof Array ? item.options : (options[item.options] || []))" :key="index"
                    :label="$t(option[item.optionValue || 'value'])">
                    {{option[item.optionLabel || 'label']}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <!-- 树形单选标签(后) -->
              <el-form-item
                :label-width="item.labelWidth||'0px'"
                class="tag-wrap"
                :prop="item.prop"
                :label="item.labelWidth?item.label:''"
                v-else-if="item.type==='selectTree'"
              >

                  <label class="tree-box-label" v-show="item.label&&!item.labelWidth">
                    <span class="t-red title-label">*</span>{{item.label}}：</label>
                  <div class="tree-box scrollbar">
                    <el-tree
                      :data="(item.options instanceof Array ? item.options : (options[item.options] || []))"
                      node-key="id"
                      default-expand-all
                      :expand-on-click-node="false">
                      <span style="width:100%"
                        :class="{'is-disabled':data.disabled}"
                        @click="getRadioId(data,item)"
                        slot-scope="{ node, data }">
                        <span>{{ data.name || data[item.optionsLabel] }}</span>
                          <span
                            class="right-radio">
                            <el-radio v-if="form[item.prop] === data.id"
                              v-model="form[item.prop]"
                              :label="data.id || data[item.optionsValue]"></el-radio>
                          </span>
                        </span>
                    </el-tree>
                  </div>
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
                  :style="{width:item.width||'300px',maxHeight:scrollHight+'px',height:item.height}"
                  class="check-tree-wrap scrollbar">
                  <el-tree
                      :ref="'startTree'+item.prop"
                      v-bind="item"
                      show-checkbox
                      :default-checked-keys="form[item.prop]"
                      :data="item.tree"
                      :node-key="item.nodeKey||'id'"
                      :check-strictly="item.checkStrictly"
                      default-expand-all
                      @check="handleCheckChange"
                      @check-change="handleCheckKeys(item)">
                      <span slot-scope="{ node, data }" :style="data.style||{}">
                          <span :class="{'is-disabled':data.disabled}">{{ data[item.props.label || 'label'] }}</span>
                        </span>
                    </el-tree>
                </div>
              </el-form-item>
               <!-- 树形多选标签（后） -->
              <el-form-item
                label-width="0"
                :prop="item.prop"
                 class="el-form-item tag-wrap"
                v-else-if="item.type==='selectTrees'"
              >
                <div class="label-box">
                  <el-tag
                    class="tag-item"
                    :key="tag.id"
                    v-for="tag in orgTag"
                    closable
                    :disable-transitions="false"
                    @close="handleTagClose(tag,item)">
                    {{tag.name}}
                  </el-tag>
                </div>
                  <div class="tree-box scrollbar">
                    <!-- <el-checkbox-group v-model="form[item.prop]"> -->
                      <el-tree
                        :data="(item.tree instanceof Array ? item.tree : (options[item.tree] || []))"
                        node-key="id"
                        default-expand-all
                        :expand-on-click-node="false">
                        <span style="width:100%"
                          @click="getCheckId(data,item)"
                          slot-scope="{ node, data }">
                          <span>{{ data.name }}</span>
                            <span class="right-radio">
                              <el-checkbox v-if="form[item.prop].indexOf(data.id)>-1"
                                :checked="true"></el-checkbox>
                            </span>
                          </span>
                      </el-tree>
                    <!-- </el-checkbox-group> -->
                  </div>
              </el-form-item>
              <!-- 单选框组（列表） -->
              <el-form-item
                :label="$t(item.label)"
                :prop="item.prop"
                v-bind="item"
                v-else-if="item.type === 'radioGroup'"
                class="mini-height" >
                  <radio-group v-bind="item" v-model="form[item.prop]"></radio-group>
              </el-form-item>
              <!-- 单选框组（列表） -->
              <el-form-item
                :label="$t(item.label)"
                :prop="item.prop"
                v-bind="item"
                v-else-if="item.type === 'checkList'"
                class="mini-height" >
                  <check-list v-bind="item" v-model="form[item.prop]"></check-list>
              </el-form-item>
              <!-- 开关 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                :prop="item.prop"
                v-else-if="item.type === 'switch'"
                class="mini-height"
              >
                <el-switch
                :disabled="item.disabled"
                  v-model="form[item.prop]"
                  :active-value="item.activeValue||true"
                  :inactive-value="item.inactiveValue||false"
                ></el-switch>
                <span class="switch-text jee-font-hover"
                  :class="{'jee-font-second-light': form[item.prop]}"
                >{{ form[item.prop] ? (item.enableText || $t('global.enabled')) : (item.disableText || $t('global.disabled')) }}</span>
              </el-form-item>
              <!-- 计数器 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                :prop="item.prop"
                v-else-if="item.type === 'inputNum'"
                class="small-height"
              >
                <el-input-number
                  size="small"
                  v-model="form[item.prop]"
                  @change="handleChange($event)"
                  :min="item.min||1" :max="item.max||10"></el-input-number>
                <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 选择框 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                :prop="item.prop"
                v-else-if="item.type === 'select'"
              >
                <el-select
                  size="small"
                  popper-class="jee-border"
                  :multiple="item.multiple||false"
                  v-model="form[item.prop]"
                  :disabled="item.disabled"
                  v-bind="item"
                  @change="change"
                  :placeholder="item.placeholder">
                   <el-option
                    v-for="option in (item.options instanceof Array ? item.options : (options[item.options] || []))"
                    :key="option[item.optionValue || 'value']"
                    :label="$t(option[item.optionLabel || 'label'])"
                    :value="option[item.optionValue || 'value']"
                    :disabled="option[item.optionDisabled || 'disabled']">
                  </el-option>
                </el-select>
                  <el-button v-if="item.btnsText" type="primary"
                   :style="'width:'+(item.width||'68px')"
                  size="small" class="jee-bg-light-important" @click="handleBtns($event)"
                  >{{$t(item.btnsText)}}</el-button>
                <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 级联选择器 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                :prop="item.prop"
                v-else-if="item.type === 'cascader'"
              >
                  <el-cascader
                    size="small"
                    v-model="form[item.prop]"
                    popper-class="jee-border"
                    v-bind="item"
                    :options="(item.options instanceof Array ? item.options : (options[item.options] || []))"
                    :props="getCascaderProps(item)"
                    :show-all-levels="false"
                    clearable
                    ref='cascader'
                    @change="handleChangeCascader(item,form[item.prop])"
                  ></el-cascader>
                  <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 纯文本 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                v-else-if="item.type==='text'"
                class="mini-height"
              >
                <span :style="{color:item.textColor||'#333333'}">{{form[item.prop]}}</span>
              </el-form-item>
              <!-- 日期时间 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                v-else-if="item.type==='time'"
                class="mini-height"
              >
                <span>{{$moment(form[item.prop],item.format)}}</span>
              </el-form-item>
              <!-- 时间选择器 -->
              <el-form-item
                v-else-if="item.type === 'timePicker'"
                :key="index"
                v-bind="item"
                :label="$t(item.label)">
                <el-date-picker
                  style="width:300px"
                  v-bind="item"
                  size="small"
                  :type="item.timeType||'datetime'"
                  v-model="form[item.prop]"
                  :placeholder="item.placeholder"
                  :start-placeholder="item.startText||'开始时间'"
                  :end-placeholder="item.endText||'结束时间'"
                  :value-format="item.format||'yyyy-MM-dd HH:mm:ss'"
                  :picker-options="item.pickerOptions">
                </el-date-picker>
                <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 多行输入框 -->
              <el-form-item
                v-else-if="item.type==='textarea'"
                :key="index"
                v-bind="item"
                :label="$t(item.label)"
              >
                <el-input type="textarea"
                  v-bind="item"
                  :style="{height: item.height ? item.height : '32px'}"
                  :autosize="item.autosize?item.autosize:{ minRows: 1 }"
                  v-model="form[item.prop]" size="small"
                  :placeholder="item.placeholder"></el-input>
                  <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 密码输入框 -->
              <el-form-item
                :key="index"
                v-bind="item"
                :label="$t(item.label)"
                v-else-if="item.type === 'password'"
              >
                <el-input
                  autocomplete="new-password"
                  v-model="form[item.prop]"
                  type="password"
                  size="small" v-bind="item"
                  :placeholder="$t(item.placeholder)"
                  :disabled="item.disabled"
                >
                  <el-button slot="append" v-if="item.appendText" :style="'width:'+(item.width||'68px')"
                  size="small" class="jee-bg-light-important"
                  @click="handleAppend($event)">{{item.appendText}}</el-button>
                </el-input>
                <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 输入框 -->
              <el-form-item
                :key="index"
                v-bind="item"
                :label="$t(item.label)"
                v-else-if="!item.type"
              >
                <el-input
                  autocomplete="new-password"
                  v-model="form[item.prop]"
                  size="small" v-bind="item"
                  :placeholder="$t(item.placeholder)"
                  :disabled="item.disabled"
                  @blur="blur(item.prop)"
                >
                  <el-button slot="append" v-if="item.appendText" :style="'width:'+(item.width||'68px')"
                  size="small" class="jee-bg-light-important"
                  @click="handleAppend($event)">{{item.appendText}}</el-button>
                </el-input>
                <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 选择上传 -->
              <el-form-item
                :key="index"
                v-bind="item"
                :label="$t(item.label)"
                v-else-if="item.type === 'upload'"
              >
                <el-input v-model="form[item.prop]" :type="item.type||''" size="small" v-bind="item">
                  <div slot="append">
                    <el-upload
                      :style="'width:'+(item.width||'68px')"
                        ref="upload"
                        multiple
                        :show-file-list="false"
                        :file-list="form.fileList"
                        :action="item.action||''"
                        :on-remove="handleRemove"
                        :on-change="beforeUpload"
                        :auto-upload="false">
                      <el-button  v-if="item.appendText"
                      :style="'width:'+(item.width||'68px')"
                      slot="trigger" size="small" class="jee-bg-light-important">{{item.appendText}}</el-button>
                      </el-upload>
                  </div>
                </el-input>
                <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
               <!-- 图片裁剪上传 -->
              <el-form-item
                :key="index"
                :prop="item.prop"
                :class="item.class"
                :label="$t(item.label)"
                v-else-if="item.type === 'imageUpload'"
              >
                <jee-image-upload
                  v-bind="item.option"
                  :defaultUrl="form[item.urlProp]"
                  v-model="form[item.prop]"
                ></jee-image-upload>
              </el-form-item>
              <!-- 自定义，通过插槽传入 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                :prop="item.prop"
                v-bind="item"
                :class="item.class"
                v-else-if="item.type === 'slot'"
              >
                <slot :name="item.prop" :form="form" :item="item"></slot>
                <div v-if="item.explain" :style="item.explainWidth?'width:'+item.explainWidth:'width:414px'" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 按钮（上传） -->
              <el-form-item
                :key="index"
                v-bind="item"
                :label="$t(item.label)"
                v-else-if="item.type === 'btn'"
              >
              <div v-if="item.btnType === 'Upload'" >
                <el-upload
                  :style="'width:'+(item.width||'68px')"
                  ref="uploadBtn"
                  :file-list="item.fileList"
                  :show-file-list="true"
                  :action="item.action||''"
                  :before-remove="handleBeforeRemove"
                  :on-change="handleBtnUpload"
                  :auto-upload="false">
                    <el-button
                      type="primary" size="small" class="jee-bg-light-important">{{item.btnText}}</el-button>
                </el-upload>
                <div class="upload-btn-txt">
                  <span>{{item.name}}</span>
                </div>
              </div>
              <el-button
                v-else
                type="primary" size="small"
                @click="handleBtn(item,$event)"
              >{{item.btnText}}</el-button>
                <div v-if="item.explain" :style="item.explainStyle" class="gray">{{item.explain}}</div>
              </el-form-item>
            </div>
          </transition>
        </template>
      </el-form>
      <slot></slot>
      <span slot="footer" class="dialog-footer" v-if="showFoot">
        <span v-if="footText" class="foot-text">{{footText}}</span>
        <el-button v-if="showCancel" @click="handleCancel" size="small" plain>{{$t('global.cancel')}}</el-button>
        <el-button type="primary" size="small"
          v-for="(item, index) in buttons" :key="index"
          :disabled="item.disabled"
          @click="handleConfirm(item)">{{$t(item.text)}}
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import radioGroup from '@/components/mixins/radioGroup'
import checkList from '@/components/mixins/checkList'
export default {
  name: 'formDialog',
  mixins: [radioGroup, checkList],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '600px'
    },
    title: {
      type: String,
      default: 'global.create'
    },
    footText: {
      type: String,
      default: ''
    },
    scrollHight: {
      type: Number,
      default: document.documentElement.scrollHeight * 56 / 100
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    showFoot: {
      type: Boolean,
      default: true
    },
    buttons: {
      type: Array,
      default () {
        return [
          {
            text: 'global.saveAndContinue',
            type: 'Submit',
            keepAlive: true
          },
          {
            text: 'global.save',
            type: 'Submit'
          }
        ]
      }
    },
    form: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    formItems: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: String,
      default: '166px'
    },
    options: {
      type: Object,
      default: () => ({})
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    handleClose: {
      type: Function,
      default: (done) => {
        done()
      }
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      orgTag: []
    }
  },
  methods: {
    selectChange () {
      this.$emit('change')
    },
    blur (item) {
      this.$emit('inpBlur' + item)
    },
    // 树形多选框
    getCheckId (data, item) {
      var i = this.form[item.prop].indexOf(data.id)
      if (i > -1) {
        this.form[item.prop].splice(i, 1)
        this.orgTag.splice(i, 1)
      } else {
        this.form[item.prop].push(data.id)
        this.orgTag.push(data)
      }
    },
    handleTagClose (tag, item) {
      var i = this.form[item.prop].indexOf(tag.id)
      this.form[item.prop].splice(i, 1)
      this.orgTag.splice(i, 1)
    },
    getOrgKey (ids, item) {
      // console.log(item.tree.map(v => ids.indexOf(v.id) > -1))
      // return item.find(v => ids.indexOf(v.id) > -1)
    },
    // 树形单选框
    getRadioId (data, item) {
      if (!data.disabled) {
        if (item.onlySelectLeaf) {
          if (!(data.children instanceof Array && data.children.length)) {
            this.form[item.prop] = data.id
          }
        } else {
          this.form[item.prop] = data.id
        }
      }
    },
    showDialog () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleCancel () {
      const that = this
      const done = function () {
        that.$refs.form.resetFields()
        that.$refs.form.clearValidate()
        that.dialogVisible = false
      }
      this.handleClose(done)
      this.$emit('handleCancel')
    },
    handleAppend (e) {
      this.$emit('handleAppend', e)
    },
    handleBtns (e) {
      this.$emit('handleBtns', e)
    },
    handleBtn (data, e) {
      console.log(data)
      this.$emit(`handleBtn${data.btnType}`, data, e)
    },
    handleRemove (file) {
      this.$emit('handleRemove', file)
    },
    handleBeforeRemove (file) {
      this.$emit('handleBeforeRemove', file)
      return this.$confirm('确定删除' + file.name + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleBtnUpload (file, fileList) {
      var type = this.uploadType(file)
      this.$emit('handleBtnUpload', file, type)
    },
    // 上传-选择文件
    beforeUpload (file, fileList) {
      var type = this.uploadType(file)
      var list = fileList.map(v => {
        v.type = this.uploadType(v)
        return v
      })
      this.$emit('beforeUpload', file, type, list)
    },
    // 上传-文件类型
    uploadType (file) {
      var type = file.raw.type
      var i = type.indexOf('/')
      var suffix = type.slice(0, i)
      var fileType = ''
      // File文件 Flash Flash Image图片 Media视频 Audio音频 为空则默认Image
      switch (suffix) {
        case 'image':
          fileType = ''
          break
        case 'text':
          fileType = 'File'
          break
        case 'application':
          fileType = 'File'
          break
        case 'video':
          fileType = 'Media'
          break
        case 'audio':
          fileType = 'Audio'
          break
        default:
          fileType = ''
          break
      }
      return fileType
    },
    handleChange (e) {
      this.$emit('handleChange', e)
    },
    // 添加组织数据到列表
    handleAdd (e, item) {
      const data = Object.assign({}, this.form)
      this.$emit(`handleAdd${item.addType}`, data, item)
    },
    handleConfirm (btn) {
      const data = Object.assign({}, this.form)
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!btn.keepAlive) {
            this.dialogVisible = false
          }
          if (btn.type === 'Submit') {
            if (!btn.reset) {
              this.$refs.form.resetFields()
            }
            this.$emit('handleConfirm', data, btn)
          } else {
            if (!btn.keepAlive) {
              this.dialogVisible = false
            }
            this.$emit(`handleConfirm${btn.type}`, data, btn)
            this.$refs.form.resetFields()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCheckKeys (data) {
      var ids = this.$refs['startTree' + data.prop][0].getCheckedKeys()
      this.form[data.prop] = ids
    },
    handleCheckChange (data, node) {
      this.$emit(`getTheNod`, node.checkedKeys, data, node)
      this.$emit(`getTheNod${data.prop}`, node.checkedKeys, data, node)
      this.form[data.prop] = node.checkedKeys
    },
    // 隐藏表单
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
    getOptions (item) {
      const { options } = item || {}
      if (options instanceof Array) {
        return options
      } else if (options instanceof String && this[options] instanceof Array) {
        return this[options]
      } else {
        return []
      }
    },
    getCascaderProps (item) {
      return { checkStrictly: true, ...(item.props || {}) }
    },
    handleChangeCascader (item, val) {
      this.$refs.cascader[0].dropDownVisible = false
      this.$emit('handleChangeCascader', item, val)
    },
    change (item) {
      this.$emit('handleSelectChange', item)
    }
  }
}
</script>

<style lang="scss">
.form-dialog-container{
  .el-input,
  .el-textarea,
  .el-cascader,
  .el-select {
    max-width: 300px;
    width: 100%;
  }
  .foot-text{
    color:#666666;
    font-size:14px;
    margin-right:20px;
  }
  .el-dialog{
    .el-dialog__body{
      .el-form{
        .form-item-wrap{
          /*
          &:not(:first-of-type):last-of-type .el-form-item{
            margin-bottom: 0;
          }
          */
          &:last-of-type .el-form-item{
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .el-tree{
      .el-tree-node .el-tree-node__content .el-checkbox {
        margin-right: 8px;
        .el-checkbox__inner{
          border-radius: 0px !important;
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
  }
  .el-textarea{
    min-height: 32px;
    height: inherit !important;
     .el-textarea__inner{
      min-height: 32px !important;
      height: inherit;
      line-height: 28px;
    }
  }
  .check-share{
    padding: 5px 10px;
    color: #666;
    font-size: 14px;
    .check-share-label{
      margin-bottom: 10px;
      padding-left: 20px;
      .jee-svg-icon{
        fill:#666;
        position: relative;
        top: 0.5px;
        margin-right: 5px;
      }
    }
    .check-share-title{
      color: #333;
      font-size: 16px;
      line-height: 1;
      margin-right: 70px;
      position: relative;
      top: 2px;
    }
    .el-checkbox-group{
      min-height: 32px;
      height: inherit;
      padding: 10px 20px 0;
      box-sizing: border-box;
      border: 1px dashed #E8E8E8;
      .el-checkbox{
        min-width: 65.3px;
        .el-checkbox__inner{
          border-radius: 100%;
          line-height: 1.3;
        }
        .el-checkbox__label{
          line-height: 1.3;
        }
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
      width: 100%;
      max-width: 300px; // 可以注释掉，单独配置宽度
      max-height: 330px;
      min-height: 100px;
      overflow: overlay;
      padding-top: 10px;
      box-sizing: border-box;
      border: 1px solid #e8e8e8;
      .el-tree{
        background-color: #fff;
        margin-left: 1px;
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
      min-height: 31px;
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
  .el-alert{
    height: 42px;
    box-sizing: border-box;
    .el-alert__title{
      font-size: 12px;
    }
  }
  .careful-txt{
    color: #666666;
    padding: 0 15px;
    font-size:14px;
    font-weight: 400;
    line-height:28px;
    margin-bottom: 30px;
    .careful-label{
      color: #FF0000;
    }
  }
  .el-upload-list .el-upload-list__item{
    // position: absolute;
    line-height: 31px;
    // top: 64px;
    width: 300px;
    box-sizing: border-box;
    border: 1px solid #E8E8E8;
    margin-bottom: 10px;
    padding: 0 15px;
    .el-icon-close{
      top: 10px;
    }
  }
  .check-tree-wrap{
    overflow: overlay;
    width: 300px;
    height: 180px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 10px 0;
    .el-tree-node__content{
      height: 32px;
    }
    .el-checkbox__input{
      vertical-align: text-bottom;
    }
  }
}
</style>
