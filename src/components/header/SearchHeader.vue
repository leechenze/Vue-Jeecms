<template>
  <section class='search-header-container'>
    <el-row>
      <el-col class='link-wrap' :span="searchItems.length?searchBtnWidth:24" v-if="searchBtns.length">
        <template v-for="(link, linkIndex) in searchBtns">
            <!-- 按钮 -->
            <el-link
                :key="linkIndex"
                :underline="false"
                @click="handleEvents(link)"
              >
              <jee-icon
                :iconClass="link.icon"
                class="jee-hover-fill"
                :style="{fontSize:'14px'}"
                v-if="link.icon"></jee-icon>{{link.name}}
            </el-link>
        </template>
      </el-col>
      <el-col class='search-wrap' :span="searchBtns.length?24-searchBtnWidth:24" v-if="searchItems.length">
        <template v-for="(item, index) in searchItems">
          <div class="search-item-wrap" :class="params.senior ? '' : item.class" :key="index" v-if="hiddenFn(item,params)">
            <!-- 文字展示 -->
            <template v-if="item.type === 'text'">
              <span class="el-checkbox__label" v-if="item.label">{{item.label}}</span>
            </template>
            <!-- 级联选择框 -->
            <template v-if="item.type === 'cascader'">
              <span class="label" v-if="item.label">{{item.label}}</span>
              <el-cascader
                ref='cascader'
                size="small"
                :props="item.props"
                v-model="params[item.value]"
                popper-class="jee-border"
                v-bind="item"
                :clearable='item.clearable||false'
                @change="handleChangeCascader($event,item)"
                :show-all-levels="false"
              ></el-cascader>
            </template>
            <!-- 下拉框 -->
            <template v-else-if="item.type === 'select'">
              <span class="label" v-if="item.label">{{item.label}}</span>
              <el-select
                :style="item.style"
                size="small"
                :clearable='item.clearable||false'
                :popper-class="'jee-border '+item.popperClass"
                :placeholder='item.placeholder||"请选择"'
                v-model="params[item.value]"
                @change="handleSearch($event)"
              >
                <el-option
                  v-for="option in item.options || []"
                  :key="option[item.optionValue || 'value']"
                  :label="option[item.optionLabel || 'label']"
                  :value="option[item.optionValue || 'value']">
                </el-option>
              </el-select>
            </template>
            <!-- 输入框 -->
            <template v-else-if="item.type === 'input'">
              <span class="label" v-if="item.label">{{item.label}}</span>
              <el-input
                :style="item.style"
                class="t-input"
                :maxlength="item.maxlength"
                v-model="params[item.value]" @keyup.enter.native="handleSearch($event)"
                size="small" :placeholder="item.placeholder">
              </el-input>
              <span v-if="item.suffix" class="suffix">{{item.suffix}}</span>
            </template>
            <!-- 多选下拉框 -->
            <template v-else-if="item.type === 'checkboxInput'">
              <span class="label" v-if="item.label">{{item.label}}</span>
              <el-select
                @change="handleSearch($event)"
                :style="item.style"
                popper-class="jee-border"
                class="t-input" v-model="params[item.value]" size="small"
                multiple collapse-tags :placeholder="item.placeholder">
                <el-option
                  v-for="items in item.options"
                  :key="items[item.optionValue || 'value']"
                  :label="items[item.optionLabel || 'label']"
                  :value="items[item.optionValue || 'value']">
                </el-option>
              </el-select>
              <span v-if="item.suffix" class="suffix">{{item.suffix}}</span>
            </template>
            <!-- 多选框 -->
            <template v-else-if="item.type === 'checked'">
              <el-checkbox v-model="params[item.value]" @change="handleSearch($event)">{{item.label}}</el-checkbox>
            </template>
            <!-- 输入搜索框 -->
            <template v-else-if="item.type === 'searchInput'" >
              <span class="label" v-if="item.label">{{item.label}}</span>
              <el-input
              class="jee-input-append-select"
                v-model="params[item.value]"
                :maxlength="item.maxlength||50"
                @keyup.enter.native="handleSearch($event)"
                size="small" :placeholder="item.placeholder"
                :style="item.style||{width: item.width+'px'||'auto'}"
                :clearable='item.clearable||false'
              >
                <el-select v-if="item.isSelect" class="input-prepend" popper-class="jee-border"
                  v-model="params[item.selectProp]" slot="prepend" placeholder="请选择">
                  <el-option
                    v-for="items in item.options"
                    :key="items[item.optionValue || 'value']"
                    :label="items[item.optionLabel || 'label']"
                    :value="items[item.optionValue || 'value']">
                  </el-option>
                </el-select>
                <el-button slot="append" v-if="item.append==='0'?false:true"
                  size="small" class="jee-bg-light-important" type='primary'
                  @click="handleSearch($event)">
                <jee-icon iconClass="xiazai15" style="fill: #ffffff"></jee-icon>
                </el-button>
              </el-input>
            </template>
            <!-- 时间选择器 -->
            <template v-else-if="item.type === 'timePicker'">
              <span class="label" v-if="item.label">{{item.label}}</span>
               <div class="block">
                <el-date-picker
                  :style="item.style"
                  size="small"
                  :type="item.dateType||'datetimerange'"
                  clearable
                   @change="handleSearch($event)"
                  :is-range="item.isRange||true"
                  v-model="params[item.value]"
                  :picker-options="item.pickerOptions"
                  :value-format="item.valueFormat||'yyyy-MM-dd HH:mm:ss'"
                  :placeholder="item.placeholder||'选择时间'"
                  :range-separator="item.rangeText||'至'"
                  :start-placeholder="item.startText||'开始时间'"
                  :disabled="item.disabled"
                  :end-placeholder="item.endText||'结束时间'"
                  >
                </el-date-picker>
              </div>
            </template>
            <!-- 日期选择器 -->
            <template v-else-if="item.type === 'dataPicker'">
              <span class="label" v-if="item.label">{{item.label}}</span>
               <div class="block">
                <el-date-picker
                  :style="item.style"
                  size="small"
                  type="daterange"
                  clearable
                  @focus='handleFocus($event)'
                   @change="handleSearch($event)"
                  :is-range="item.isRange||true"
                  v-model="params[item.value]"
                  value-format="yyyy-MM-dd"
                  :range-separator="item.rangeText||'至'"
                  :start-placeholder="item.startText||'开始日期'"
                  :end-placeholder="item.endText||'结束日期'"
                  :picker-options="item.pickerOptions"
                  :disabled="item.disabled"
                  >
                </el-date-picker>
              </div>
            </template>
            <!-- 按钮 -->
            <template v-else-if="item.type === 'henderBtn'">
              <el-link
                  :key="index"
                  :underline="false"
                  :disabled="item.disabled"
                   class="jee-hover-fill"
                   :class="item.class"
                  @click="handleEvent(item)"
                >
                  <el-tooltip :content="item.title" placement="bottom" effect="light">
                    <jee-icon :iconClass="item.icon" class="jee-hover-fill link-icon"
                      v-if="item.icon"></jee-icon>
                    {{$t(item.text)}}
                  </el-tooltip>
                </el-link>
            </template>
            <!-- 按钮 -->
            <template v-else-if="item.type === 'henderBtns'">
              <el-button :type="item.btnType||'empty'" size="small" :disabled="item.disabled" @click="handleEvent(item)"> {{$t(item.text)}}</el-button>
            </template>
            <!-- 按钮组 -->
            <template v-else-if="item.type === 'henderBorderBtn'">
              <el-button
                :key="index"
                :underline="false"
                :disabled="item.disabled"
                type='primary'
                size="small"
                class='search-button'
                @click="handleBtn(item.btnType, item)">
                <jee-icon :iconClass="item.icon" v-if="item.icon"/>{{$t(item.text)}}
              </el-button>
            </template>
            <!-- 更多搜索 -->
            <template v-else-if="item.type === 'senior'">
              <el-button
                size="small"
                :style="item.style||{minWidth:'70px',padding:'8px'}"
                :class='item.btnClass'
                @click="handleClickSenior(item)"
                type="primary">{{params[item.value]?(item.hideText||'收起'):(item.openText||'高级搜索...')}}</el-button>
            </template>
            <!-- 切换按钮 -->
            <template v-else-if="item.type === 'cutButton'">
              <span class="label" v-if="item.label">{{item.label}}</span>
              <el-radio-group
                class="jee-radio-group"
                size="small"
                v-model="params[item.value]"
                @change="handleSearch($event)">
                <el-radio-button
                  popper-class="jee-border"
                  :disabled="option.disabled?option.disabled(params):false"
                  v-for="option in item.options || []"
                  :key="option[item.optionValue || 'value']"
                  :label="option[item.optionValue || 'value']">
                  {{option[item.optionLabel || 'label']}}
                </el-radio-button>
              </el-radio-group>
            </template>
            <template  v-else-if="item.type === 'slot'">
              <slot></slot>
            </template>
          </div>
        </template>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  name: 'searchHeader',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => ({})
    },
    searchBtns: {
      type: Array,
      default: () => []
    },
    searchBtnWidth: {
      type: Number,
      default: 10
    },
    searchItems: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClickSenior (item) {
      this.$set(this.params, item.value, !this.params[item.value])
      this.$emit('handleSenior', this.params, item)
    },
    handleChangeCascader (e, item) {
      this.$refs.cascader[0].dropDownVisible = false
      this.handleSearch(e, item)
    },
    handleSearch (e, item) {
      if (item && item.callback) {
        this.$emit(`handleSearch${item.callback}`, e, item)
      } else {
        this.$emit('handleSearch', e)
      }
    },
    handleFocus (e, item) {
      this.$emit('handleFocus', e)
    },
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
    handleEvent (item) {
      this.$emit('handleBtn', item)
    },
    handleEvents (item) {
      this.$emit('handleBtnAll', item)
    },
    handleBtn (btnType, item) {
      this.$emit(`handleBtn${btnType}`, item)
    }
  }
}
</script>

<style lang="scss">
.search-header-container{
  padding-bottom: 12px;
  .el-input .el-input__inner{
    border-color: #e8e8e8 !important;
  }
  .el-row{
     border-radius: 4px;
     min-height: 46px;
     overflow: hidden;
     padding: 7px 20px 0 0;
     background-color: #f0f0f0;
     .el-link{
        margin-left: 40px;
        line-height: 32px;
        .jee-svg-icon{
          fill:#666666;
          margin-right: 10px;
        }
        &:first-of-type{
          margin-left: 20px;
        }
      }
   }
  .el-col{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .search-item-wrap{
      line-height: 32px;
      margin-left: 20px;
      padding-bottom: 7px;
      display: flex;
      align-items: center;
      .label{
        padding-right: 10px;
        color: #666666;
        font-size: 14px;
        white-space: nowrap;
      }
      >.el-select{
        min-width: 100px;
        .el-input--small{
          line-height: 32px;
        }
      }
      >.el-input{
        min-width: 200px;
        .input-prepend{
          width: 102px;
          background-color: #fff;
          border: 1px solid #e8e8e8;
          box-sizing: border-box;
          border-left: none;
          border-right: none;
          height: 32px;
          position: relative;
          top: 1px;
          border-radius: 4px 0 0 4px;
          .el-input{
            height: 32px;
            &__inner{
              border:none;
            }
          }
        }
      }
    }
  }
  .suffix{
    margin-left: 10px;
    font-size:14px;
    color:rgba(102,102,102,1);
  }
  .link-icon{
    fill: #787878;
  }
  .el-button.el-button--small.search-button{
    padding: 8px 20px;
  }
  .jee-radio-group{
    .el-radio-button__inner{
      padding: 8px 15px;
      font-size: 14px;
      min-width: 80px;
    }
  }
}
</style>
