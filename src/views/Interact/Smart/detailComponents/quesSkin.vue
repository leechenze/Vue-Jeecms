<template>
  <section class="ques-skin-wrap">
    <el-collapse v-model="activeName" accordion @change="bandSelectBut">
      <template v-for="(tab, index) in tabs" >
        <el-collapse-item :title="tab.label" :name="tab.name" :key="index" >
          <base-form
            :key="index"
            :ref="'form'+tab.name"
            v-bind="form[tab.name]"
            @getUrlBg="getUrlBg"
            @getUrlHead="getUrlHead"
          >
            <template #bgImage="scope">
              <div>
                <image-upload v-model="scope.form.bgImage" ref='addImge'></image-upload>
              </div>
            </template>
            <template #bgImage2="scope">
              <div class="bg-images" v-if="bgIdx === 1">
                <div class="bg-img" :class="{'jee-border':img.picId === scope.form.bgImage}"
                  v-for="(img,imgIdx) in (scope.item.imgType === 'Head'?headPics:picUrls)  "
                  :key="imgIdx" @click="setImage(img,scope.item.imgType)">
                  <jee-icon iconClass="xuanzhong" class="p-radio-bg" v-if="img.picId === scope.form.bgImage" />
                  <el-image :src="$getPath(img.thumbnail||img.picUrl)" fit="cover">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
              </div>
              <div class="bg-images" v-else-if="bgIdx === 2 ">
                <div class="bg-img" :class="{'jee-border':img.picId === scope.form.bgImage}"
                  v-for="(img,imgIdx) in picUrlsPage "
                  :key="imgIdx" @click="setImage(img,scope.item.imgType)">
                  <jee-icon iconClass="xuanzhong" class="p-radio-bg" v-if="img.picId === scope.form.bgImage" />
                  <el-image :src="$getPath(img.thumbnail||img.picUrl)" fit="cover">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
              </div>
              <div class="bg-images" v-else-if="headIdx === 1 ">
                <div class="bg-img" :class="{'jee-border':img.picId === scope.form.bgImage}"
                  v-for="(img,imgIdx) in headPics "
                  :key="imgIdx" @click="setImage(img,scope.item.imgType)">
                  <jee-icon iconClass="xuanzhong" class="p-radio-bg" v-if="img.picId === scope.form.bgImage" />
                  <el-image :src="$getPath(img.thumbnail||img.picUrl)" fit="cover">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
              </div>
              <div class="bg-images" v-else>
                <div class="bg-img" :class="{'jee-border':img.picId === scope.form.bgImage}"
                  v-for="(img,imgIdx) in (scope.item.imgType === 'Head'?headPicsPage:picUrlsPage)"
                  :key="imgIdx" @click="setImage(img,scope.item.imgType)">
                  <jee-icon iconClass="xuanzhong" class="p-radio-bg" v-if="img.picId === scope.form.bgImage" />
                  <el-image :src="$getPath(img.thumbnail||img.picUrl)" fit="cover">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
              </div>
              <div class="p-bg-show" >
                <div  v-for="(bgItem,index) in bgBut" :key="index" :class="bgItem.type == (tab.name === 'bgConfig' ? bgIdx : headIdx)?'p-show': 'p-hide'" @click="tab.name === 'bgConfig'?handBgShowHide(bgItem):handHeadShowHide(bgItem)">
                </div>
              </div>
            </template>
            <template #fontStyle="scope">
              <set-font-config v-model="scope.form.fontStyle"></set-font-config>
            </template>
            <template #fontKey="scope">
              <set-font-config v-model="scope.form.fontKey"></set-font-config>
            </template>
            <template #fontHelp="scope">
              <set-font-config v-model="scope.form.fontHelp"></set-font-config>
            </template>
            <template #optStyle="scope">
              <set-font-config v-model="scope.form.optStyle"></set-font-config>
            </template>
          </base-form>
        </el-collapse-item>
      </template>
    </el-collapse>
  </section>
</template>
<script>
import baseForm from '@/components/mixins/baseForm'
import setFontConfig from './setFontConfig'
import imageUpload from './imageUpload'
import { mapGetters } from 'vuex'
export default {
  name: 'ques-skin',
  mixins: [baseForm],
  components: {
    setFontConfig,
    imageUpload
  },
  props: {
    cssStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    refresh: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters('app', ['colorOption']),
    bgColor () {
      return this.colorOption(0)[0]
    }
  },
  data () {
    return {
      tabs: [
        { label: '页面背景', name: 'bgConfig' },
        { label: '页眉图片', name: 'headConfig' },
        { label: '内容区设置', name: 'contConfig' },
        { label: '组件设置', name: 'componentConfig' },
        { label: '提交按钮设置', name: 'subConfig' }
      ],
      activeName: ['bgConfig'],
      form: {
        /**
         * 设置组件类型在@/components/form/BaseForm/
         * 例如: item.type==='inputSelect'
         */
        bgConfig: {
          labelWidth: '83px',
          showSubmitButton: false,
          form: {
            bgType: 2,
            bgImage: '',
            bgImage2: '',
            bgImageUrl: '',
            bgImageUrlSelect: '',
            alignType: 'left top',
            opacity: 100,
            step: 100,
            isRepeat: 2,
            phoneImgUrl: '',
            bgColor: '#F0F0F0'
          },
          formItems: [
            {
              prop: 'bgType',
              label: '背景类型：',
              type: 'radioBtn',
              options: [
                {
                  label: '图片背景',
                  value: 1
                },
                {
                  label: '颜色背景',
                  value: 2
                }
              ]
            },
            {
              prop: 'bgImage',
              label: '背景图片：',
              type: 'imageUpload',
              imgType: 'Bg',
              class: 'line-1',
              hiddenKey: 'bgType',
              hiddenValue: 1,
              urlProp: 'bgImageUrl',
              isResource: true,
              option: {
                autoUpload: false
              }
            },
            {
              prop: 'bgImage2',
              labelWidth: 0,
              class: 'dis-label',
              imgType: 'Bg',
              type: 'slot',
              hiddenKey: 'bgType',
              hiddenValue: 1
            },
            {
              prop: 'bgColor',
              label: '背景颜色：',
              type: 'color',
              disInput: true,
              showAlpha: true,
              hiddenKey: 'bgType',
              hiddenValue: 2
            },
            {
              prop: 'alignType',
              label: '对齐方式：',
              type: 'radioBtn',
              btnWidth: '79px',
              class: 'align-type',
              options: [
                {
                  label: '左对齐',
                  value: 'left top'
                },
                {
                  label: '居中对齐',
                  value: 'center top'
                },
                {
                  label: '右对齐',
                  value: 'right top'
                }
              ],
              hiddenKey: 'bgType',
              hiddenValue: 1
            },
            {
              prop: 'isRepeat',
              label: '是否重复：',
              type: 'radioBtn',
              options: [
                {
                  label: '是',
                  value: 1
                },
                {
                  label: '否',
                  value: 2
                }
              ],
              hiddenKey: 'bgType',
              hiddenValue: 1
            },
            {
              prop: 'opacity',
              label: '透明度：',
              type: 'number',
              min: 0,
              max: 100,
              hiddenKey: 'bgType',
              hiddenValue: 1
            }
          ]
        },
        headConfig: {
          labelWidth: '83px',
          form: {
            bgImage: '',
            bgImageUrlSelect: '',
            phoneImgUrl: '',
            bgImageUrl: '',
            bgImage2: ''
          },
          formItems: [
            {
              prop: 'bgImage',
              label: '选择图片：',
              type: 'imageUpload',
              class: 'line-1',
              isResource: true,
              imgType: 'Head',
              urlProp: 'bgImageUrl',
              option: {
                autoUpload: false
              }
            },
            {
              prop: 'bgImage2',
              labelWidth: 0,
              imgType: 'Head',
              class: 'dis-label',
              type: 'slot'
            }
          ],
          showSubmitButton: false
        },
        contConfig: {
          labelWidth: '130px',
          form: {
            bgColor: '#ffffff',
            hasBorder: 1,
            borderColor: '#e8e8e8',
            borderWidth: 1,
            borderRadius: 0,
            hasBody: 1,
            bodyWidth: 1000
          },
          formItems: [
            {
              prop: 'bodyWidth',
              label: '内容区宽度(PX)：',
              type: 'number',
              hiddenKey: 'hasBody',
              min: 200,
              step: 100,
              max: 1800,
              hiddenValue: 1
            },
            {
              prop: 'bgColor',
              label: '背景颜色：',
              type: 'color',
              disInput: true,
              showAlpha: true
            },
            {
              prop: 'hasBorder',
              label: '使用边框：',
              type: 'radioBtn',
              options: [
                {
                  label: '是',
                  value: 1
                },
                {
                  label: '否',
                  value: 2
                }
              ]
            },
            {
              prop: 'borderColor',
              label: '边框颜色：',
              type: 'color',
              disInput: true,
              showAlpha: true,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            },
            {
              prop: 'borderWidth',
              label: '边框粗细：',
              type: 'number',
              min: 1,
              max: 10,
              step: 1,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            },
            {
              prop: 'borderRadius',
              label: '边框圆角：',
              type: 'number',
              min: 0,
              step: 1,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            }
          ],
          showSubmitButton: false
        },
        componentConfig: {
          labelWidth: '110px',
          showSubmitButton: false,
          form: {
            bgColor: '#F0F0F0',
            fontStyle: {
              fontSize: 16,
              fontWigth: 400,
              fontColor: '#333333'
            },
            fontKey: {
              fontSize: 14,
              fontWigth: 400,
              fontColor: '#333333'
            },
            fontHelp: {
              fontSize: 12,
              fontWigth: 400,
              fontColor: '#999999'
            },
            displayType: 2,
            moduleDisplay: 'left',
            titleWidth: 20
          },
          formItems: [
            {
              prop: 'moduleDisplay',
              label: '组件布局：',
              type: 'select',
              options: [
                {
                  label: '左对齐',
                  value: 'left'

                },
                {
                  label: '右对齐',
                  value: 'right'
                },
                {
                  label: '上对齐',
                  value: 'top'
                }
              ]
            },
            {
              prop: 'displayType',
              label: '布局效果：',
              type: 'radioBtn',
              options: [
                {
                  label: '紧凑',
                  value: 1

                },
                {
                  label: '标准',
                  value: 2
                },
                {
                  label: '宽松',
                  value: 3
                }
              ]
            },
            {
              prop: 'titleWidth',
              label: '标题宽度(%)：',
              labelWidth: '110px',
              type: 'number',
              min: 5,
              step: 5,
              max: 80,
              hidden: (form) => {
                return form.moduleDisplay !== 'top'
              }
            },
            {
              prop: 'fontStyle',
              label: '字段标题：',
              labelWidth: '110px',
              type: 'slot'
            },
            {
              prop: 'fontKey',
              label: '字段值：',
              labelWidth: '110px',
              type: 'slot'
            },
            {
              prop: 'fontHelp',
              label: '帮助信息：',
              labelWidth: '110px',
              type: 'slot'
            }
          ]
          // showSubmitButton: false
        },
        subConfig: {
          labelWidth: '83px',
          showSubmitButton: false,
          form: {
            text: '提交',
            fontStyle: {
              fontSize: 14,
              fontWigth: 400,
              fontColor: '#ffffff'
            },
            bgColor: '#1ec6df',
            hasBorder: 1,
            borderColor: '#ffffff',
            borderWidth: 1,
            borderRadius: 4,
            btnWidth: 80,
            btnHeight: 32
          },
          formItems: [
            {
              prop: 'text',
              label: '文字：',
              maxlength: 6,
              labelWidth: '54px'
            },
            {
              prop: 'fontStyle',
              label: '字体：',
              labelWidth: '54px',
              type: 'slot'
            },
            {
              prop: 'bgColor',
              label: '背景颜色：',
              type: 'color',
              disInput: true,
              showAlpha: true
            },
            {
              prop: 'hasBorder',
              label: '使用边框：',
              type: 'radioBtn',
              options: [
                {
                  label: '是',
                  value: 1
                },
                {
                  label: '否',
                  value: 2
                }
              ]
            },
            {
              prop: 'borderColor',
              label: '边框颜色：',
              type: 'color',
              disInput: true,
              showAlpha: true,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            },
            {
              prop: 'borderWidth',
              label: '边框粗细：',
              type: 'number',
              min: 1,
              max: 10,
              step: 1,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            },
            {
              prop: 'borderRadius',
              label: '边框圆角：',
              type: 'number',
              min: 0,
              step: 1,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            },
            {
              prop: 'btnWidth',
              label: '按钮宽度：',
              type: 'number',
              min: 1,
              step: 1
            },
            {
              prop: 'btnHeight',
              label: '按钮高度：',
              type: 'number',
              min: 0,
              step: 1
            }
          ]
        }
      },
      imageList: {
        headImg: [],
        bgImg: []
      },
      picUrls: [],
      picUrlsPage: [],
      headPics: [],
      headPicsPage: [],
      bgBut: [
        {
          type: 1,
          name: 'bg'
        },
        {
          type: 2,
          name: 'head'
        }
      ],
      bgIdx: 1,
      headIdx: 1,
      selectBgIdx: '',
      selectHeadIdx: 1
    }
  },
  watch: {
    form: {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal) {
          this.$emit('change', this.form)
        }
        // if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        //   console.log(111)
        //   this.$emit('change', this.form)
        // }
      }
    },
    cssStyle (newVal) {
      if (newVal.id) {
        this.form.bgConfig.form = newVal.bgConfig
        this.form.headConfig.form = newVal.headConfig
        this.form.contConfig.form = newVal.contConfig
        this.form.componentConfig.form = newVal.componentConfig
        this.form.subConfig.form = newVal.subConfig
      }
    }
  },
  methods: {
    handBgShowHide (item) {
      this.bgIdx = item.type
      this.selectBgIdx = item.type
    },
    handHeadShowHide (item) {
      this.headIdx = item.type
      this.selectHeadIdx = item.type
    },
    bandSelectBut (res) {
      console.log(this.selectBgIdx)
      console.log(this.selectHeadIdx)
      if (res === 'headConfig') {
        this.bgIdx = null
        this.headIdx = this.selectHeadIdx
      } else if (res === 'bgConfig') {
        this.headIdx = null
        this.bgIdx = this.selectBgIdx
      }
    },
    getUrlBg (data, item, prop) {
      // 多个上传组件，返回内容不一样，导致图片没有回显，通过判断是否有url，如果没有则设置fileUrl
      this.form.bgConfig.form.bgImageUrl = data ? (data.url || data.fileUrl || '') : ''
      this.form.bgConfig.form.bgImageUrlSelect = ''
    },
    getUrlHead (data, item, prop) {
      // 多个上传组件，返回内容不一样，导致图片没有回显，通过判断是否有url，如果没有则设置fileUrl
      this.form.headConfig.form.bgImageUrl = data ? (data.url || data.fileUrl || '') : ''
      this.form.headConfig.form.bgImageUrlSelect = ''
    },
    getImageList () {
      this.$request.fetchSmartPic({ querySence: 2 }).then(res => {
        if (res.code === 200) {
          this.imageList = res.data
          this.imageList.bgImg.forEach((item, index) => {
            if (index < 12) {
              this.picUrls.push(item)
            } else if (index < 24) {
              this.picUrlsPage.push(item)
            }
          })
          this.imageList.headImg.forEach((item, index) => {
            if (index < 12) {
              this.headPics.push(item)
            } else if (index < 24) {
              this.headPicsPage.push(item)
            }
          })
        }
      })
    },
    setImage (item, type) {
      if (type === 'Head') {
        this.form.headConfig.form.bgImageUrl = ''
        if (!this.form.headConfig.form.bgImage) {
          this.form.headConfig.form.bgImage = item.picId
          this.form.headConfig.form.bgImageUrlSelect = item.picUrl
          this.form.headConfig.form.phoneImgUrl = item.mobilePicUrl
        } else {
          if (this.form.headConfig.form.bgImage === item.picId) {
            this.form.headConfig.form.bgImage = null
            this.form.headConfig.form.bgImageUrlSelect = ''
            this.form.headConfig.form.phoneImgUrl = ''
          } else {
            this.form.headConfig.form.bgImage = item.picId
            this.form.headConfig.form.bgImageUrlSelect = item.picUrl
            this.form.headConfig.form.phoneImgUrl = item.mobilePicUrl
          }
        }
      } else {
        this.form.bgConfig.form.bgImageUrl = ''
        if (!this.form.bgConfig.form.bgImage) {
          this.form.bgConfig.form.bgImage = item.picId
          this.form.bgConfig.form.bgImageUrlSelect = item.picUrl
          this.form.bgConfig.form.phoneImgUrl = item.mobilePicUrl
        } else {
          if (this.form.bgConfig.form.bgImage === item.picId) {
            this.form.bgConfig.form.bgImage = null
            this.form.bgConfig.form.bgImageUrlSelect = ''
            this.form.bgConfig.form.phoneImgUrl = ''
          } else {
            this.form.bgConfig.form.bgImage = item.picId
            this.form.bgConfig.form.bgImageUrlSelect = item.picUrl
            this.form.bgConfig.form.phoneImgUrl = item.mobilePicUrl
          }
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.refresh) {
        this.getImageList()
        this.$emit('change', this.form)
      }
    })
  }
}
</script>
<style lang="scss">
  .ques-skin-wrap{
    height: 100%;
    overflow-y: auto;
    .el-collapse{
        border: none;
        .el-collapse-item{
           margin-bottom: 12px;
          .el-collapse-item__header {
            border-bottom-color: transparent;
            font-size: 16px;
            font-weight: 600;
            line-height: 32px;
            height: 32px;
            padding: 20px 0 0;
            border-bottom-color: #e8e8e8;
            &.is-active{

            }
            .el-collapse-item__arrow{
              font-size: 18px;
            }
          }
          .el-collapse-item__wrap{
            border-bottom: 0;
            overflow: inherit;
            .el-collapse-item__content{
              padding-bottom: 0;
              padding-top: 30px;
            }
          }
          // & + .el-collapse-item{
          //   margin-bottom: 20px;
          // }
          .el-radio-button{
            &__inner{
              padding: 8px 20px;
              font-size: 14px;
            }
          }
          .el-form{
            .el-form-item{
              margin-bottom:20px;
              &.line-1{
                .el-form-item__label{
                  line-height: 1.2;
                }
              }
              &.dis-label{
                .el-form-item__content{
                  margin-left: 0 !important;
                }
              }
              &.align-type{
                .el-radio-button{
                  &__inner{
                    padding: 8px 0;
                    width: 100%;
                    text-align: center;
                  }
                }
              }
              .bg-images{
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                .bg-img{
                  width: 50px;
                  height: 50px;
                  border-radius: 4px;
                  position: relative;
                  box-sizing: border-box;
                  overflow: hidden;
                  background-color: #f0f0f0;
                  &:first-of-type{
                    margin-bottom: 4px;
                  }
                  &.jee-border{
                    border-width: 2px;
                    border-style: solid;;
                  }
                  .el-image{
                    display: block;
                  }
                  .p-radio-bg{
                    z-index: 333;
                    font-size: 23px;
                    position: absolute;
                    fill: #1EC6DF;
                    right: -1px;
                    top: -2px;
                  }
                }
              }
              .p-bg-show{
                display: flex;
                align-items: center;
                // justify-items: center;
                width: 15%;
                margin: auto;
                div{
                  border: 1px solid #CCCCCC;
                  border-radius: 50%;
                  margin:  5px;
                  cursor: pointer;

                }
                .p-show{
                  width: 10px;
                  height: 10px;
                  background: #1EC6DF;
                  border: none;

                }
                .p-hide{
                  width: 8px;
                  height: 8px;

                }
              }
            }
            .form-item-wrap:last-of-type{
              .el-form-item{
                margin-bottom: 0
              }
            }
            .form-item-wrap{
                .interact-vote-set-font{
                    .font-text:hover{
                        background-color: #F3F3F3;
                    }
                }
            }
          }
        }
      }
  }

</style>
