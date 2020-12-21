<template>
  <section class="dialog-form-container">
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        :rules="rules"
        :label-width="labelWidth"
        label-suffix="："
      >
        <template v-for="(item, index) in formItems">
          <transition :key="index" name="fade" mode="out-in" >
            <!-- 是否隐藏 -->
            <div v-if="hiddenFn(item,form)" class="form-item-wrap">
              <!-- 放置文字 -->
              <div class="place-txt"
              v-if="item.type === 'place'">
                <span>{{item.text}}</span>
              </div>
              <!-- 注意文字 -->
              <div class="careful-txt"
              v-if="item.type === 'careful'">
                <label class="careful-label"
                v-if="item.label"
                >{{item.label}}</label>
                <span>{{item.text}}</span>
              </div>
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
                  :key="index" :label="option[item.optionValue || 'value']">{{$t(option[item.optionLabel || 'label'])}}</el-radio>
                </el-radio-group>
                <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 多选框 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                :prop="item.prop"
                v-else-if="item.type === 'checkbox'"
                class="mini-height"
              >
                <el-checkbox class="t-check"
                  v-if="item.complex" v-bind="item"
                  v-model="form[item.prop]" :true-label="item.optionValue||1" :false-label="item.defaultValue||0">
                  {{item.optionLabel}}
                </el-checkbox>
                <el-checkbox-group v-model="form[item.prop]" v-else>
                  <el-checkbox v-for="(option, index) in (item.options instanceof Array ? item.options : (options[item.options] || []))"
                  :class="item.class"
                  :key="index" :label="option[item.optionValue || 'value']">{{option[item.optionLabel || 'label']}}</el-checkbox>
                  <jee-popover v-if="item.popoverText" :popoverText="item.popoverText" :popoverWidth="item.popoverWidth"/>
                </el-checkbox-group>
              </el-form-item>
              <!-- 带标题-线框多选组 -->
              <el-form-item
                label-width="0"
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
                class=" tag-wrap"
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
                        <span>{{ data.name }}</span>
                          <span class="right-radio">
                            <el-radio v-if="form[item.prop] === data.id"
                              v-model="form[item.prop]"
                              :label="data.id"></el-radio>
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
                v-else-if="item.type === 'checkTree'"
              >
                <div class="check-tree-wrap scrollbar">
                  <el-tree class="t-check"
                      :ref="'startTree'+item.prop"
                      v-bind="item"
                      show-checkbox
                      :data="item.tree"
                      node-key="id"
                      default-expand-all
                      @check="handleCheckChange"
                      @check-change="handleCheckKeys(item)">
                    </el-tree>
                </div>
              </el-form-item>
               <!-- 树形多选标签（后） -->
              <el-form-item
                label-width="0"
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
                        :data="item.tree"
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
              <!-- 开关 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                :prop="item.prop"
                v-else-if="item.type === 'switch'"
                class="mini-height"
              >
                <el-switch
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
                  :placeholder="item.placeholder">
                   <el-option
                    v-for="option in (item.options instanceof Array ? item.options : (options[item.options] || []))"
                    :key="option[item.optionValue || 'value']"
                    :label="$t(option[item.optionLabel || 'label'])"
                    :value="option[item.optionValue || 'value']">
                  </el-option>
                  <el-button slot="append" v-if="item.btnsText" type="primary"
                   :style="'width:'+(item.width||'68px')"
                  size="small" class="jee-bg-light-important" @click="handleBtns($event)"
                  >{{$t(item.btnsText)}}</el-button>
                </el-select>

                <div v-if="item.explain" class="gray">{{item.explain}}</div>
                <jee-popover v-if="item.popoverText" :popoverText="item.popoverText" :popoverWidth="item.popoverWidth" style="paddingLeft: 10px;"/>
              </el-form-item>
              <!-- 级联选择器 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                :prop="item.prop"
                v-else-if="item.type === 'cascader'"
              >
                  <el-cascader
                    ref='cascader'
                    @change="handleChangeCascader"
                    size="small"
                    v-model="form[item.prop]"
                    popper-class="jee-border"
                    v-bind="item"
                    :options="(item.options instanceof Array ? item.options : (options[item.options] || []))"
                    :props="item.props"
                    :show-all-levels="false"
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
                <span>{{form[item.prop]}}</span>
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
                  :value-format="item.format||'yyyy-MM-dd HH:mm:ss'">
                </el-date-picker>
                <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 多行输入框 -->
              <el-form-item
                v-else-if="item.type==='textarea'"
                :key="index"
                v-bind="item"
                :label="$t(item.label)"
                :show-word-limit='item.showWordLimit'
              >
                <el-input type="textarea"
                  v-bind="item"
                  :style="item.height?'height:'+item.height:'height:32px'"
                  :autosize="item.autosize?item.autosize:{ minRows: 1 }"
                  v-model="form[item.prop]" size="small"
                  :placeholder="item.placeholder"></el-input>
                  <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
              <!-- 输入框 -->
              <el-form-item
                :key="index"
                v-bind="item"
                :label="$t(item.label)"
                v-else-if="!item.type||item.type === 'password'"
              >
                <el-input
                  v-model="form[item.prop]"
                  :type="item.type||''"
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
                :label="$t(item.label)"
                v-else-if="item.type === 'imageUpload'"
              >
                <jee-image-upload
                  v-bind="item.option"
                  :defaultUrl="form[item.urlProp]"
                  v-model="form[item.prop]"
                ></jee-image-upload>
              </el-form-item>
               <!-- 多图上传 -->
              <el-form-item
                :key="index"
                :prop="item.prop"
                :label="$t(item.label)"
                v-else-if="item.type === 'multiImageUpload'"
              >
                <jee-multi-image-upload
                  v-bind="item.option"
                  v-model="form[item.prop]"
                ></jee-multi-image-upload>
              </el-form-item>
               <!-- 视频上传 -->
              <el-form-item
                :key="index"
                :prop="item.prop"
                :label="$t(item.label)"
                v-else-if="item.type === 'videoUpload'"
              >
                <jee-video-upload
                  v-bind="item.option"
                  v-model="form[item.prop]"
                ></jee-video-upload>
              </el-form-item>
               <!-- 音频上传 -->
              <el-form-item
                :key="index"
                :prop="item.prop"
                :label="$t(item.label)"
                v-else-if="item.type === 'audioUpload'"
              >
                <jee-video-upload
                  v-bind="item.option"
                  v-model="form[item.prop]"
                  iconClass='yinpin'
                  compType="audio"
                ></jee-video-upload>
              </el-form-item>
               <!-- 文件上传 -->
              <el-form-item
                :key="index"
                :prop="item.prop"
                :label="$t(item.label)"
                v-else-if="item.type === 'fileUpload'"
              >
                <jee-file-upload
                  v-bind="item.option"
                  v-model="form[item.prop]"
                ></jee-file-upload>
              </el-form-item>
              <!-- 自定义，通过插槽传入 -->
              <el-form-item
                :key="index"
                :label="$t(item.label)"
                :prop="item.prop"
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
                <div
                  class="upload-btn-txt">
                  <span>{{item.name}}</span>
                </div>
              </div>
              <el-button
                v-else
                type="primary" size="small"
                @click="handleBtn(item,$event)"
              >{{item.btnText}}</el-button>
                <div v-if="item.explain" class="gray">{{item.explain}}</div>
              </el-form-item>
            </div>
          </transition>
        </template>
      </el-form>
  </section>
</template>

<script>
export default {
  name: 'dialogForm',
  props: {
    loading: {
      type: Boolean,
      default: false
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
    showWordLimit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      orgTag: []
    }
  },
  methods: {
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
      this.form[item.prop] = data.id
    },
    handleCancel () {
      this.$refs.form.resetFields()
    },
    handleAppend (e) {
      this.$emit('handleAppend', e)
    },
    handleBtns (e) {
      this.$emit('handleBtns', e)
    },
    handleBtn (data, e) {
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
            this.$emit('handleConfirm', data, btn)
            this.$refs.form.resetFields()
          } else {
            if (!btn.keepAlive) {
              this.dialogVisible = false
            }
            this.$emit(`handleConfirm${btn.type}`, data, btn)
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
      this.$emit(`getTheNod`, node.checkedKeys)
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
    handleChangeCascader () {
      this.$refs.cascader[0].dropDownVisible = false
    }
  }
}
</script>

<style lang="scss">
.dialog-form-container{
  .el-form{
    .form-item-wrap{
      .el-form-item {
        width: 100%;
        margin-bottom: 20px!important;
      }
      &:not(:first-of-type):last-of-type .el-form-item{
        margin-bottom: 0!important;
      }
    }
  }
  .el-input,
  .el-textarea,
  .el-cascader,
  .el-select {
    max-width: 300px;
    width: 100%;
  }
  .el-switch{
    height: 16px;
    margin-top: -2px;
  }
  .switch-text{
    margin-left: 10px;
    font-size: 12px;
  }
  .el-textarea .el-textarea__inner{
    min-height: 32px !important;
    height: inherit !important;
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
      min-height: 40px;
      height: inherit;
      padding: 12px 20px;
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
      margin-bottom: 20px;
      display: block;
    }
    .tree-box{
      overflow-x: hidden;
      overflow-y: overlay;
      width: 100%;
      height: 330px;
      padding-top: 10px;
      box-sizing: border-box;
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
    position: absolute;
    line-height: 32px;
    top: 64px;
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
  }
  .place-txt{
    padding-left: 100px;
  }
}
</style>
