<template>
  <section class="options-set-select-smart-wrap">

    <div class="p-iconItem">
      <jee-icon iconClass="quxiao"  @click.stop="handColeBut"/>
    </div>
    <div class="os-wrap">
      <!-- 级联题 -->
      <div class="os-box">
        <el-row class="os-items">
          <el-col :span="6" v-for="col in 4" :key="col">
            <label class="os-label">{{getCol(col)}}级选项</label>
          </el-col>
        </el-row>
        <!-- 一级 -->
        <div class="w-25">
          <draggable  :list="slectItem.options" >
            <div class="os-items"  v-for="(opt,idx) in slectItem.options" :key="idx">
              <div class="os-move" v-if="opt" @click="setLevel('actOptOne',opt.sortNum,'actOptOnes',opt.children)">
                <el-input :class="{'jee-border':actOptOne === opt.sortNum}" maxlength="50"
                  class="m-135 jee-hover-border" v-model="opt.name" placeholder="请输入"></el-input>
                <jee-icon iconClass="jianqu" v-if="slectItem.options&&slectItem.options.length>1"
                  @click.stop="delOptions(1,idx)"/><jee-icon iconClass="tuozhuai"/>
              </div>
            </div>
          </draggable>
          <div class="os-items">
            <el-link class="os-add"
                :underline="false" @click="handleAddOpts(slectItem.options.length)" >
                <jee-icon iconClass="jia1"/><span class="t-title">添加选项</span>
              </el-link>
          </div>
        </div>
        <!-- 二级 -->
        <div class="w-25" v-if="actOptOne">
          <draggable  :list="actOptOnes" >
            <div class="os-items"  v-for="(opt,idx) in actOptOnes" :key="idx">
              <div class="os-move" @click="setLevel('actOptTwo',opt.sortNum,'actOptTwos',opt.children)">
                <el-input maxlength="50" :class="{'jee-border':actOptTwo === opt.sortNum}"
                  class="m-135 jee-hover-border" v-model="opt.name" placeholder="请输入"></el-input>
                <jee-icon iconClass="jianqu"
                  @click.stop="delOptionsTwo(actOptOne,idx)"/><jee-icon iconClass="tuozhuai"/>
              </div>
            </div>
            </draggable>
          <div class="os-items">
            <el-link class="os-add"
                :underline="false" @click="handleAddTwoOpts(actOptOne)" >
                <jee-icon iconClass="jia1"/><span class="t-title">添加选项</span>
              </el-link>
          </div>
        </div>
        <!-- 三级 -->
        <div class="w-25" v-if="actOptTwo">
          <draggable  :list="actOptTwos" >
            <div class="os-items"  v-for="(opt,idx) in actOptTwos" :key="idx">
              <div class="os-move" @click="setLevel('actOptTree',opt.sortNum,'actOptTrees',opt.children)">
                <el-input maxlength="50" :class="{'jee-border':actOptTree === opt.sortNum}"
                  class="m-135 jee-hover-border" v-model="opt.name" placeholder="请输入"></el-input>
                <jee-icon iconClass="jianqu"
                  @click.stop="delOptionsTree(actOptOne,actOptTwo,idx)"/><jee-icon iconClass="tuozhuai"/>
              </div>
            </div>
          </draggable>
          <div class="os-items">
            <el-link class="os-add"
                :underline="false" @click="handleAddTreeOpts(actOptOne,actOptTwo)" >
                <jee-icon iconClass="jia1"/><span class="t-title">添加选项</span>
              </el-link>
          </div>
        </div>
        <!-- 四级 -->
        <div class="w-25" v-if="actOptTree">
          <draggable  :list="actOptTrees" >
            <div class="os-items"  v-for="(opt,idx) in actOptTrees" :key="idx">
              <div class="os-move">
                <el-input maxlength="50" :class="{'jee-border':actOptFour === opt.sortNum}"
                  class="m-135 jee-hover-border" v-model="opt.name" placeholder="请输入"></el-input>
                <jee-icon iconClass="jianqu"
                  @click.stop="delOptionsFour(actOptOne,actOptTwo,actOptTree,idx)"/><jee-icon iconClass="tuozhuai"/>
              </div>
            </div>
          </draggable>
          <div class="os-items">
            <el-link class="os-add"
                :underline="false" @click="handleAddFourOpts(actOptOne,actOptTwo,actOptTree)" >
                <jee-icon iconClass="jia1"/><span class="t-title">添加选项</span>
              </el-link>
          </div>
        </div>
      </div>
    </div>
    <div class="os-addBut">
      <!-- <el-button>取消</el-button> -->
      <el-button class="el-button--primary" @click.stop="handAddBut(value)">保存</el-button>
    </div>
  </section>
</template>
<script>
// import imageUpload from './imageUpload'
import draggable from 'vuedraggable'
import { deepClone } from '@/utils'
export default {
  name: 'options-set',
  components: {
    // imageUpload,
    draggable
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    setType: {
      type: [Number, String],
      default: 1
    },
    index: {
      type: Number,
      default: -1
    }
  },
  watch: {
    setType (newVal, oldVal) {
      // 判断是否单选题、多选题、下拉题
      if (newVal === 1 || newVal === 2 || newVal === 4 || newVal === 5) {
        // 判断setType是否等于0 如果是，则把新值保存到临时对象中，因为初始化传进来的值是0
        if (oldVal === 0) {
          this.inputChange(newVal)
        } else {
          // 把老的值保存到临时对象中
          this.inputChange(oldVal)
        }
        // 判断是否已经保存过当前题目类型下的选项
        if (this.tempOptions.hasOwnProperty(newVal)) {
          this.slectItem.options = deepClone(this.tempOptions[newVal])
        } else {
          // 判断当前题目类型下是否有值， 如果没有设置第一个选择
          if (Object.keys(this.tempOptions).length === 0) {
            // 保存当前题目类型下的选项
            this.tempOptions[newVal] = deepClone(this.slectItem.options)
          } else {
            // 保存当前题目类型下的选项
            this.tempOptions[newVal] = deepClone(this.templateOption)
            // 并且重置全新题型的选项
            this.slectItem.options = deepClone(this.templateOption)
          }
        }
      }
      if (newVal === 5) {
        // 判断是否是级联题
        this.resetOptions()
      }
    }
  },
  data () {
    return {
      inputTypes: [
        { label: '请选择', value: '' },
        { label: '只能输入中文', value: 1 },
        { label: '只能输入英文', value: 2 },
        { label: '只能输入数字(整数或小数)', value: 3 },
        { label: '只能输入英文、数字', value: 4 },
        { label: '只能输入整数', value: 5 },
        { label: '只能输入中文、英文、数字', value: 6 },
        { label: '邮箱', value: 7 },
        { label: '手机号', value: 8 },
        { label: '座机号', value: 9 },
        { label: '手机或座机号', value: 10 },
        { label: '身份证号', value: 11 },
        { label: '邮政编码', value: 12 }
      ],
      slectItem: {},
      actOptOne: 1,
      actOptTwo: 0,
      actOptOnes: [],
      actOptTwos: [],
      actOptTree: 0,
      actOptTrees: [],
      actOptFour: 0,
      tempOptions: {},
      tempForm: {}, // 临时保存form数据，用于在点击取消按钮的时候重新赋值
      templateOption: [
        {
          name: '选项1', // 单个选项
          pic: '', // 图片id
          picUrl: '', // 图片路径
          isDefault: false, // 是否默认
          isRequired: false, // 是否必填
          isEemty: false, // 是否允许填空
          sortNum: 1// 排序
        },
        {
          name: '选项2', // 单个选项
          pic: '', // 图片id
          picUrl: '', // 图片路径
          isDefault: false, // 是否默认
          isRequired: false, // 是否必填
          isEemty: false, // 是否允许填空
          sortNum: 2// 排序
        }
      ] // 默认选项数据
    }
  },
  methods: {
    inputChange (oldVal) {
      this.tempOptions[oldVal] = deepClone(this.slectItem.options)
    },
    getCol (i) {
      let arr = ['一', '二', '三', '四']
      return arr[i - 1]
    },
    handleAddOpt (opt) {
      let i = this.slectItem.options.length
      let j = this.slectItem.options.find(t => t.sortNum === i + 1)
      this.slectItem.options.push({
        name: '选项' + (j ? i + '1' : i + 1), // 单个选项
        pic: '', // 图片id
        picUrl: '', // 图片路径
        isDefault: false, // 是否默认
        isRequired: false, // 是否必填
        sortNum: j ? i + '1' : i + 1// 排序
      })
      // 保存选项到临时选项
      this.tempOptions[this.setType] = deepClone(this.slectItem.options)
    },
    handleDelOpt (opt, i) {
      this.slectItem.options.splice(i, 1)
    },
    // 新建级联
    handleAddOpts (i) {
      let j = this.slectItem.options.find(t => t.sortNum === i + 1)
      this.slectItem.options.push({
        name: '选项' + (j ? i + '1' : i + 1),
        sortNum: j ? i + '1' : i + 1,
        children: [],
        pic: '' // 图片id
      })
    },
    handleAddTwoOpts (num) {
      let data = this.slectItem.options.find(t => t.sortNum === num)
      if (!data.children) {
        data.children = []
      }
      let i = data.children.length
      let j = data.children.find(t => t.sortNum === i + 1)
      data.children.push({
        name: '选项' + (j ? i + '1' : i + 1),
        sortNum: j ? i + '1' : i + 1,
        children: [],
        pic: '' // 图片id
      })
      this.actOptOnes = this.slectItem.options.find(t => t.sortNum === num).children = data.children
    },
    handleAddTreeOpts (num, num2) {
      let data = this.slectItem.options.find(t => t.sortNum === num).children.find(t => t.sortNum === num2)
      if (!data.children) {
        data.children = []
      }
      let i = data.children.length
      let j = data.children.find(t => t.sortNum === i + 1)
      data.children.push({
        name: '选项' + (j ? i + '1' : i + 1),
        sortNum: j ? i + '1' : i + 1,
        children: [],
        pic: '' // 图片id
      })
      this.actOptTwos = this.slectItem.options.find(t => t.sortNum === num).children.find(t => t.sortNum === num2).children = data.children
    },
    handleAddFourOpts (num, num2, num3) {
      let data = this.slectItem.options.find(t => t.sortNum === num).children.find(t => t.sortNum === num2).children.find(t => t.sortNum === num3)
      if (!data.children) {
        data.children = []
      }
      let i = data.children.length
      let j = data.children.find(t => t.sortNum === i + 1)
      data.children.push({
        name: '选项' + (j ? i + '1' : i + 1),
        sortNum: j ? i + '1' : i + 1,
        children: [],
        pic: '' // 图片id
      })
      this.actOptTrees = this.slectItem.options.find(t => t.sortNum === num)
        .children.find(t => t.sortNum === num2).children.find(t => t.sortNum === num3).children = data.children
    },
    // 获取层级
    getLevel (arr) {
      let i = 0
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          i++
          data.forEach(r => {
            if (r.children && r.children.length) {
              loop(r.children)
            }
          })
        }
        return i
      }
      return loop(arr, i)
    },
    delConfirm (fn) {
      this.$confirm('该级选项及相关联的子级将全部删除，确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fn()
      })
    },
    delOptions (i, j) {
      this.delConfirm(() => {
        this.slectItem.options.splice(j, 1)
        let len = this.slectItem.options.length
        if (len < 1) {
          this.actOptOne = 0
        }
      })
    },
    delOptionsTwo (i, j) {
      this.delConfirm(() => {
        this.slectItem.options.find(t => t.sortNum === i).children.splice(j, 1)
        let len = this.slectItem.options.find(t => t.sortNum === i).children.length
        if (len < 1) {
          this.actOptTwo = 0
        }
      })
    },
    delOptionsTree (i, j, z) {
      this.delConfirm(() => {
        this.slectItem.options.find(t => t.sortNum === i).children.find(t => t.sortNum === j).children.splice(z, 1)
        let len = this.slectItem.options.find(t => t.sortNum === i).children.find(t => t.sortNum === j).children.length
        if (len < 1) {
          this.actOptTree = 0
        }
      })
    },
    delOptionsFour (i, j, z, y) {
      this.delConfirm(() => {
        this.slectItem.options.find(t => t.sortNum === i).children.find(t => t.sortNum === j)
          .children.find(t => t.sortNum === z).children.splice(y, 1)
        let len = this.slectItem.options.find(t => t.sortNum === i).children.find(t => t.sortNum === j)
          .children.find(t => t.sortNum === z).children.length
        if (len < 1) {
          this.actOptFour = 0
        }
      })
    },
    setLevel (name, i, label, j) {
      if (this[name] !== i) {
        this.$set(this, name, i)
        this.$set(this, label, j || [])
        switch (name) {
          case 'actOptOne':
            this.actOptTwo = 0
            this.actOptTree = 0
            this.actOptFour = 0
            this.actOptTwos = []
            this.actOptTrees = []
            break
          case 'actOptTwo':
            this.actOptTree = 0
            this.actOptFour = 0
            this.actOptTrees = []
            break
          case 'actOptTree':
            this.actOptFour = 0
            break
        }
      }
    },
    // 默认选项切换事件
    optCheckBoxChange (idx) {
      // 下拉题目 判断是多选还是单选  isRadio  0, 多选 1, 单选
      if (this.setType === 1 || (this.setType === 4 && this.slectItem.isRadio === 1)) {
        this.slectItem.options.forEach((item, index) => {
          if (index !== idx) {
            item.isDefault = false
          }
        })
      }
    },
    // 重置级联题选项
    resetOptions () {
      // 判断级联题一级选项第一选项，是否有子级
      if (Object.keys(this.slectItem.options[0]).indexOf('children') !== -1) {
        this.actOptOnes = this.slectItem.options[0].children || []
        this.actOptOne = this.actOptOnes[0].sortNum
        // 判断级联题 二级选项第一选项，是否有子级
        if (this.actOptOnes.length > 0 && Object.keys(this.actOptOnes[0]).indexOf('children') !== -1) {
          this.actOptTwos = this.actOptOnes[0].children || []
          this.actOptTwo = this.actOptOnes[0].sortNum
          // 判断级联题 三级选项第一选项，是否有子级
          if (this.actOptTwos.length > 0 && Object.keys(this.actOptTwos[0]).indexOf('children') !== -1) {
            this.actOptTrees = this.actOptTwos[0].children || []
            this.actOptTree = this.actOptOnes[0].sortNum
          }
        }
      }
    },
    // 关闭编辑弹窗
    handColeBut () {
      this.slectItem = deepClone(this.value.option)
      this.$emit('close', null, this.index)
    },
    handAddBut (data) {
      // 如果是保存，更新原始数据
      this.$emit('close', this.slectItem, this.index, 'update')
    }
  },
  created () {
    this.slectItem = this.value.option
    this.resetOptions()
  }
}
</script>
<style lang="scss">
  .options-set-select-smart-wrap{
    .p-iconItem{
      text-align: right;
      padding: 30px 30px 0px 0;
      .quxiao{
        font-size: 14px;
        cursor: pointer;
      }
    }
    .os-wrap{
      padding: 20px 40px;
      .ts-items{
        margin-top: 10px;
      }
      .os-items{
        margin-bottom: 10px;
        line-height: 1;
        .os-w-410{
          width:410px;
          max-width: 410px;
        }
        .os-w-120{
          min-width: 120px;
        }
        .os-w-130{
          min-width: 130px;
        }
        .os-w-30{
          min-width: 30px;
        }
        .os-w-210{
          min-width: 210px;
        }
      }
      .os-select{
        width: 115px;
      }
      .os-select180{
        width: 180px;
      }
      @media screen and (max-width: 1440px) {
        .os-select180{
          width: 160px;
        }
      }
      .os-label{
        font-size: 14px;
        color: #666666;
      }
      .os-explian{
        margin-left: 15px;
      }
      .os-w-120,.os-w-30,.os-w-130{
        .el-checkbox{
          margin-right: 20px;
          margin-top: 9px;
          &__input{
            // vertical-align: top;
          }
        }
      }
      .el-input{
        max-width: 100%;
        border-radius: 4px;
        &.m-300{
          max-width: 300px;
        }
        &.m-135{
          max-width:135px;
          border-style:solid;
          border: 1px solid #e8e8e8;
          box-sizing: border-box;
          .el-input__inner{
            border: none
          }
        }
        &.m-200{
          max-width: 200px;
        }
        @media screen and (max-width: 1440px) {
            &.m-300{
              max-width: 250px;
            }
            &.m-135{
              max-width:115px;
            }
            &.m-200{
              max-width: 173px;
            }
        }
      }
      .os-radio-btn{
        text-align: center;
        .el-radio-button__inner{
          font-size: 14px;
          padding: 9px 20px;
        }
      }
      .h-32{
        height: 32px;
        line-height: 32px;
      }
      .os-del,.os-add{
        margin-top: 12px;
        .jee-svg-icon{
          fill:#787878;
          margin-right:10px;
        }
      }
      .os-move{
        .jee-svg-icon{
          fill:#787878;
          margin-left:10px;
          cursor: pointer;
        }
      }
      .w-25{
        width:25%;
        display: inline-block;
        vertical-align:top;
      }

    }
    .os-addBut{
      text-align: right;
      padding: 0px 30px 30px 0;
    }
  }
  .edit-view{
    .options-set-wrap{
      .os-wrap{
        .os-items{
          margin-bottom: 10px;
          line-height: 1;
          .btn-88{
            width: 88px;
            padding: 10px 20px;
            font-size: 12px;
          }
          .os-w-410{
            max-width: 410px;
            width: 52%;
          }
          .os-w-120{
            min-width: 120px;
          }
          .os-w-30{
            min-width: 30px;
          }
          .os-w-210{
            min-width: 210px;
          }
        }
        .el-input{
          max-width: 100%;
          &.m-300{
            width: 65%;
            max-width: 300px;
          }
          &.m-135{
            width: 62%;
            max-width:135px;
          }
          &.m-200{
            max-width: 180px;
          }
        }
      }
    }
  }
</style>
