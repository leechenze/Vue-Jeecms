# 一、项目部署

项目名称：jeecms_admin

## 1、安装软件包
```
npm install
```

### 2、启动开发模式
```
npm run serve
```

### 3、编辑发布版本
```
npm run build
```

### 4、自定义打包配置文档

See [Configuration Reference](https://cli.vuejs.org/config/).

### 5、创建项目

```
    npm install -g @vue/cli
    vue create projectname
    vue ui
```

    选项：
        Manually select features
            ◉ Babel
            ◯ TypeScript
            ◯ Progressive Web App (PWA) Support
            ◉ Router
            ◉ Vuex
            ◉ CSS Pre-processors
            ◉ Linter / Formatter
            ◯ Unit Testing
            ◯ E2E Testing
        Sass/SCSS (with node-sass)
        ESLint + Standard config
        Lint on save
        In package.json
        N

### 6、更新日志
    2019/8/24 升级 element-ui 2.8.2 至 2.11.1，解决了表格树默认展开所有行问题

# 二、开发流程

### 1、接收任务

>    了解任务内容、业务范围

>    仔细研读原型文档、接口文档、UI效果图

>    功能模块分析、优先级安排、难易度分析、工时计划

>    了解前端开发规范，使用eslink，尽量多写注释，方便他人查阅

### 2、基础工作准备

>    定义接口：在相应文件```src/api/urls```中定义接口地址，地址不重复；在相应文件```src/api/apis```中定义请求方法

>    添加路由：在相应文件```src/routes/asyncRoutes.js```中对应的路由位置添加路由信息

>    建立目录：根据路由信息在```src/views```下相应目录下面建立业务模块目录及文件

>    路由语言：根据路由信息的```name```属性，在相应文件```src/i18n/lang/cn.js```中设置菜单言语名称(menus对象内)

>    添加模拟数据：根据接口文档返回数据格式，在数据数据服务页面添加相应模拟接口。
[Mock Server](http://mw.mock.ywzhou.shop/)

### 3、业务页面开发

>    根据业务功能模块，将已开发过的代码复制过来进行修改

>    业务模块尽量封装使用，提高复用性，如现有已封装模块不能满足，根据需要修改的程序来决定是重新封装过一个还是在原来封装的组织上面增加类型

>    整体业务封装思想是尊从渐进增强的模式，同时考虑灵活性以及便捷性，封装组件与mixin数据配合使用，尽量减少调用者的代码量及复杂度；另外要注意mixin间不能有重复的字段名称及方法名称，以免使用多个mixin时冲突。

### 4、页面样式

>   元素标签上的样式非动态的一律用```class```写

>   页面顶级元素使用不重复的```class```，通过类命名空间来保障样式不冲突，```<style></style>```标签可以不使用```scoped```

>   涉及到主题色的，使用```src/assets/theme/mixin.scss```中定义的类，如没有可自定义

>   属于UI规范类的样式写在```src/assets/css/index.scss```或```src/assets/css/rewrite.scss```中，前者用于定义自定义的```class```，后者用于定义```element ui class`


# 三、文档说明

### 1、动态切换主题

    1.1、
    使用工具生成样式变量文件

```
    npm i element-theme element-theme-chalk -D
    node_modules/.bin/et -i
```

    1.2、
    修改根目录下的```element-variables.scss```变量文件
    在根目录下生成```theme```主题包

    注：以上文件和目录添加到svn忽略中不要上传

```
    node_modules/.bin/et
```

    1.3、
    修改打包配置文件```gulpfile.js```中的变量```customThemeName```，
    注：不能与assets/css/theme/下的目录名重复

    安装```gulp```打包工具

```
    npm i gulp -g
    npm i gulp gulp-css-wrap gulp-clean-css -D
```

    1.4、
    执行命令打包到```src/assets/css/theme/```

```
    gulp css-wrap
    gulp move-font
```

    1.5、
    在入口文件```main.js```中导入新的主题文件
    切换主题时把空间类名附给body即可

```
    document.body.className = 'custom-' + customThemeName
```

    注：customThemeName可存在vuex中，列表形式，同时存一个当前主题值theme
    注：每次更新执行2-4步

### 2、国际化用法


    2.1、组件化本地化用法

```
    const Component1 = {
    template: `
        <div class="container">
        <p>Component1 locale messages: {{ $t("message.hello") }}</p>
        <p>Fallback global locale messages: {{ $t("message.greeting") }}</p>
    </div>`,
    i18n: { // `i18n` 选项，为组件设置语言环境信息
        messages: {
        en: { message: { hello: 'hello component1' } },
        ja: { message: { hello: 'こんにちは、component1' } }
        }
    }
    }
```

    2.2、props默认值
    bug: 不会随着语言切换改变，需要在template中使用$t()
    bug: data中使用也不会改变，需要放在computed中使用；或者写在methods里，但同时要watch，lang的改变去调用方法更新data
    后端：lang通过headers或cookies去传递
    reflush window.reload()

```
    props: {
        name: {
            type: String,
            default () {
                return this.$t('name')
            }
        }
    }
```

    2.3、日期时间本地化

```
    <p>{{ $d(new Date(), 'short') }}</p>
    <p>Apr 19, 2017</p>
    <p>{{ $d(new Date(), 'long', 'en') }}</p>
    <p>2017年4月19日(水) 午前2:19</p>
```

    2.4、数字本地化

```
    <p>{{ $n(100, 'currency') }}</p>
    <p>$100.00</p>
```

    2.5、普通js文件中使用

```
    import i18n from '@/i18n'
    ...
    i18n.t('path')
```

### 3、IconFont图标

    下载svg文件放到 src/assets/icon/svg/ 目录下即可

    3.1、固定颜色使用

    可以改变大小
    ```iconClass``` 值为 src/assets/icon/svg/ 下的文件名称

```
    <jee-icon iconClass="exit"  :style="{fontSize: '32px'}"/>
```

    3.2、双色动态修改

    颜色默认通过path的fill固定了，需要在导出iconfont文件之前做去色处理，
    或者去掉svg文件中的fill属性，才能修改颜色。

    修改svg文件，将其中一个```path```的```fill```属性设为```currentColor```，
    将其他```path```的```fill```属性设为空。

```
    <jee-icon iconClass="exit"  :style="{fontSize: '32px', color: red, fill: green}"/>
```

    结果：设置```currentColor```的path颜色为红色；其他path颜色为绿色

    3.3、使用iconfont.scss文件

```
    <i class="iconfont icon-bianjiqi"  :style="{color: 'green', fontSize: '32px'}"/>
```

### 4、响应式布局和断点隐藏

    4.1、五个响应尺寸

 >   xs                 <768px      超小尺寸
 >   sm     ≥768px      <992px      小尺寸
 >   md     ≥992px      <1200px     中等尺寸
 >   lg     ≥1200px     <1920px     大尺寸
 >   xl     ≥1920px                 超大尺寸

```
    <el-row :gutter="10">
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
            <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
            <div class="grid-content bg-purple-light"></div>
        </el-col>
        <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
            <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
            <div class="grid-content bg-purple-light"></div>
        </el-col>
    </el-row>
```

    4.2、断点隐藏类

    某元素需要在指定尺寸隐藏时可添加以下类

>   hidden-xs-only      - 当视口在 xs 尺寸时隐藏
>   hidden-sm-only      - 当视口在 sm 尺寸时隐藏
>   hidden-sm-and-down  - 当视口在 sm 及以下尺寸时隐藏
>   hidden-sm-and-up    - 当视口在 sm 及以上尺寸时隐藏
>   hidden-md-only      - 当视口在 md 尺寸时隐藏
>   hidden-md-and-down  - 当视口在 md 及以下尺寸时隐藏
>   hidden-md-and-up    - 当视口在 md 及以上尺寸时隐藏
>   hidden-lg-only      - 当视口在 lg 尺寸时隐藏
>   hidden-lg-and-down  - 当视口在 lg 及以下尺寸时隐藏
>   hidden-lg-and-up    - 当视口在 lg 及以上尺寸时隐藏
>   hidden-xl-only      - 当视口在 xl 尺寸时隐藏


#### 5、接口联调

    请求详情数据时默认只会请求id=1的详情接口
    联调时修改```baseForm```中的```fetchFormApi```方法，将 ```{ id: 1 } || ```删除

    修改根目录下的```vue.config.js```文件，切换代理地址，或改成后端人员的本机地址，需要重启serve服务

# 四、 注意事项记录

### 1、路由
    标签页刷新功能，需要asyncRoutes中定义的页面名称name和组件页面的name一致，因为刷新时是将这个值存到store中的excludes里。

### 2、异步表格
    https://blog.csdn.net/weixin_42225341/article/details/94740238

# 五、第三方插件
### 1、工作流插件
        antv/g6/1.2.8

            http://antvis.github.io/g6/demo/04-editor/editor.html
            https://www.jianshu.com/p/13579c3853bc
        antv/g6/3.0
            https://www.yuque.com/antv/g6
            https://www.jianshu.com/p/7f27d6993a12
        ggeditor
            http://ggeditor.com/demo/#/flow

### 2、富文本插件
        https://ueditor.baidu.com/doc/
        https://github.com/notadd/neditor
        https://gitee.com/notadd/neditor
        https://github.com/caiya/vue-neditor-wrap
        https://demo.neditor.notadd.com

### 3、导入word文件转换成html
        https://github.com/wuhuanhost/docx2html

### 4、选色插件
        https://github.com/zuley/vue-color-picker

### 5、拖拽插件
        https://sortablejs.github.io/Vue.Draggable/#/third-party
        https://github.com/SortableJS/Vue.Draggable

### 6、图片预览插件
        https://mirari.cc/v-viewer/

### 7、图片剪切
        https://codepen.io/xyxiao001/pen/wxwKGz
        https://github.com/xyxiao001/vue-cropper#readme

### 8、全屏插件
        screenfull

### 9、文本比较
        https://github.com/ddchef/vue-code-diff
        https://blog.csdn.net/cuandiao6728/article/details/79396500
        https://cloud.tencent.com/developer/article/1425556

### 10、背景蜘蛛网特效
        https://github.com/hustcc/canvas-nest.js/blob/master/README-zh.md
        https://github.com/ZYSzys/vue-canvas-nest

### 11、图表
        https://antv.alipay.com/zh-cn/g2/3.x/index.html
        https://viserjs.github.io
        https://www.echartsjs.com/zh/option.html#series-map.map
        https://www.echartsjs.com/examples/zh/editor.html?c=map-HK



# 六、架构说明
    脚手架 vue-cli 3
    前端框架 vue 2.6.10
    路由 vue-router 3.0.3
    数据存储 vuex 3.0.1
    国际化 vue-i18n 8.11.2
    UI组件库 element-ui 2.11.1
    HTTP请求 axios 0.18.0
    工作流插件 @antv/g6 3.0.5
    富文本插件 vue-neditor
    图表插件 echarts 4.2.1
    图表插件 viser-vue 2.4.6
    全屏插件 screenfull 4.2.0
    拖拽插件 vuedraggable 2.21.0
    选色插件 vue-color-picker
    切图插件 vue-cropper 0.4.9

# 七、使用指北
## 1、配置后端API接口地址
  开发模式：修改文件 .env.development
  生产模式：修改文件 .env.production

## 2、配置权限模式
    使用本地的路由配置routes/asyncRoutes.js
        (1)修改文件：utils/global.js
            取消以下注释
            ```
                // if (this._getItem('openPermission') !== '1') {
                //   return true
                // }
            ```
        (2)修改文件:store/modules/permission.js
          取消以下注释
          ```
            // const openPermission = window.localStorage.getItem('openPermission')
            // if (openPermission !== '1') {
            //   return new Promise(resolve => {
            //     let accessedRoutes = filterAsyncRoutes(asyncRoutes.concat(exceptionRoutes))
            //     commit('SET_ROUTES', [{
            //       ...rootRoute,
            //       children: asyncRoutes
            //     }])
            //     dispatch('app/fetchSetting', {}, { root: true })
            //     resolve([{
            //       ...rootRoute,
            //       children: accessedRoutes
            //     }])
            //   })
            // }
          ```

## 3、启动项目

  安装软件包
```
npm install
```

  启动开发模式
```
npm run serve
```

  打包生产版本
```
npm run build
```

## 4、SRC目录结构
┌─api            	      接口目录
├─assets            		静态资源目录
├─components            复用组件目录
├─directive             vue指令目录
├─i18n                  国际化配置目录
├─layouts               布局组件目录
├─routes                vue路由配置目录
├─routes                vue路由配置目录
├─store                 vuex存储目录
├─views                 业务页面目录
│  ├─Column             栏目管理
│  ├─Config             配置
│  ├─Content            内容管理
│  ├─Exception          异常
│  ├─InMail             站内信
│  ├─Interact           互动
│  ├─Login              登录
│  ├─Social             媒体
│  ├─Statistics         网站统计
│  ├─System             系统管理
│  ├─VIP                会员管理
│  └─WorkPlace          工作台
├─main.js               Vue初始化入口文件
└─App.vue               应用配置

其他文件说明：
├─.env.development      开发环境变量
├─.env.production       生产环境变量
├─element-variables.scss饿了么UI变量文件
├─gulpfile.js           打包饿了么UI主题工具
└─package.json          安装包配置