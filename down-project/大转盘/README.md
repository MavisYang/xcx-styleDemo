## 营销组件

营销组件， WeChat marketing components.


## 支持营销类型

- 大转盘
- 刮刮乐 
- 老虎机	
- 跑马灯 
- 九宫格翻纸牌 
- 摇一摇 
- 手势解锁

 ![支持营销](http://img.pfan123.com/wx_market_1.jpeg?imageView2/1/w/356/h/634)


## 如何使用

1.拉取仓库

```
git clone git@github.com:pfan123/wx-market.git
```

2.安装包依赖

```
npm i 
```

3.查看组件文件

- 大转盘（Rotate）: `/pages/rotate/utils/`
- 刮刮乐 (scratch ticket) : `/pages/scratch/utils/`
- 老虎机	（slot machine） : `/pages/slotmachine/utils/`
- 跑马灯 （marquee）: `/pages/marquee/utils/`
- 九宫格翻纸牌 (grid card): `/pages/gridcard/utils/`
- 摇一摇 (shake): `/pages/shake/utils/`
- 手势解锁 (gesture lock): `/pages/gestureLock/utils/`

4.使用引入方式

拷贝所需组件，到小程序目录pages路由目录

➀使用大转盘组件

- WXSS中引用样式：`@import './utils/dial.wxss'`

- WXML中引用结构：`<import src="./utils/dial.wxml"/>`

- JS中引用：`import Dial from './utils/dial.js'`

- JS中实例调用：

```js
   let dial = new Dial(this, {
     areaNumber: 8,   //抽奖间隔
     speed: 16,       //转动速度
     awardNumer: 2,    //中奖区域从1开始
     mode: 1,    //1是指针旋转，2为转盘旋转
     callback: () => {
       //运动停止回调  
     }
   })
 ```

 ![大转盘组件](http://img.pfan123.com/wx_market_2.jpeg?imageView2/1/w/356/h/634)


➁使用刮刮乐组件

- WXML中引用结构：`<import src="./utils/scratch.wxml"/>`

- JS中引用：`import Scratch from './utils/scratch.js'`

- JS中实例调用：

```js
  this.scratch = new Scratch(this, {
    canvasWidth: 197,   //画布宽带
    canvasHeight: 72,  //画布高度
    imageResource: './images/placeholder.png', //画布背景
    r: 4, //笔触半径
    awardTxt: '中大奖', //底部抽奖文字
    awardTxtColor: "#1AAD16", //画布颜色
    awardTxtFontSize: "24px", //文字字体大小
    callback: () => {
      //清除画布回调
    }
  })
 ```

 `注意：`小程序无globalCompositeOperation = 'destination-out'属性，所以采用 `clearRect` 做擦除处理

 ![刮刮乐组件](http://img.pfan123.com/wx_market_3.jpeg?imageView2/1/w/356/h/634) 

➂使用老虎机组件

- WXSS中引用样式：`@import './utils/machine.wxss'`

- WXML中引用结构：`<import src="./utils/machine.wxml"/>`

- JS中引用：`import Machine from './utils/machine.js'`

- JS中实例调用：

```js
   this.machine = new Machine(this, {
     height: 40,  //单个数字高度
     len: 10,     //单个项目数字个数
     transY1: 0,
     num1: 3,    //结束数字
     transY2: 0,
     num2: 0,    //结束数字
     transY3: 0,
     num3: 0,  //结束数字
     transY4: 0,
     num4: 1,  //结束数字
     speed: 24,  //速度
     callback: () => {
         //停止时回调        
     }      
   })
 ```

  ![老虎机组件](http://img.pfan123.com/wx_market_4.jpeg?imageView2/1/w/356/h/634) 

➃使用跑马灯组件

- WXSS中引用样式：`@import './utils/marquee.wxss'`

- WXML中引用结构：`<import src="./utils/marquee.wxml"/>`

- JS中引用：`import Marquee from './utils/marquee.js'`

- JS中实例调用：

```js 
  this.marquee = new Marquee(this, {
    len: 9, //宫格个数
    ret: 9, //抽奖结果对应值1～9
    speed: 100,  // 速度值
    callback: () => {
      //结束回调    
    }            
  })
 ```

  ![跑马灯组件](http://img.pfan123.com/wx_market_5.jpeg?imageView2/1/w/356/h/634)  

➄使用九宫格翻纸牌组件

- WXSS中引用样式：`@import './utils/card.wxss'`

- WXML中引用结构：`<import src="./utils/card.wxml"/>`

- JS中引用：`import Card from './utils/card.js'`

- JS中实例调用：

```js 
 this.card = new Card(this,{
   data: [   //宫格信息，内联样式、是否是反面、是否运动、对应奖项
     {inlineStyle: '', isBack: false, isMove: false, award: "一等奖"},    
     {inlineStyle: '', isBack: false, isMove: false, award: "二等奖"},
     {inlineStyle: '', isBack: false, isMove: false, award: "三等奖"},
     {inlineStyle: '', isBack: false, isMove: false, award: "四等奖"},
     {inlineStyle: '', isBack: false, isMove: false, award: "五等奖"},
     {inlineStyle: '', isBack: false, isMove: false, award: "六等奖"},
     {inlineStyle: '', isBack: false, isMove: false, award: "七等奖"},
     {inlineStyle: '', isBack: false, isMove: false, award: "八等奖"},
     {inlineStyle: '', isBack: false, isMove: false, award: "九等奖"}
   ],
   callback: (idx, award) => {
     //结束回调， 参数对应宫格索引，对应奖项    
   }
 })
 ```

  ![九宫格翻纸组件](http://img.pfan123.com/wx_market_6.jpeg?imageView2/1/w/356/h/634)  

 ➅使用摇一摇组件

- WXSS中引用样式：`@import './utils/shake.wxss'`

- WXML中引用结构：`<import src="./utils/shake.wxml"/>`

- JS中引用：`import Shake from './utils/shake.js'`

- JS中实例调用：

```js 
  this.shake = new Shake(this, {
    shakeThreshold: 70, //阈值
    callback: () => {
          
    }            
  })
 ```

  ![摇一摇组件](http://img.pfan123.com/wx_market_7.jpeg?imageView2/1/w/356/h/634)   

 ➆使用手势解锁组件

 - WXSS中引用样式：`@import './utils/lock.wxss'`

- WXML中引用结构：`<import src="./utils/lock.wxml"/>`

- JS中引用：`import Lock from './utils/lock.js'`

- JS中实例调用：

```js 
 this.lock = new Lock(this, {
   canvasWidth: 300,
   canvasHeight: 300,
   canvasId: 'canvasLock',
   drawColor: '#3985ff'        
 })
 ```   

![手势解锁组件](http://img.pfan123.com/wx_market_8.jpeg?imageView2/1/w/356/h/634)


## 开源协议

MIT