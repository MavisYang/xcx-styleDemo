# 小程序学习第一波

- "tabBar"
- template的用法
```
template
  - template.wxml

<template name='itemList'>
    <image class='item-img' src='{{listItem.picImg}}' />
    <view>{{listItem.name}}</view>
</template>


home
    -home.wxml
<import src='../../template/template.wxml'/>
<template is='itemList' data='{{listItem}}'></template>

```

注意： 
1. template的样式不能写在template.wxss中，要写在引入<template>的home.wxss或者app.wxss
2. app.json的pages中不需要引入该wxml

- 订单列表
```
<view class="noCodeBox bgWriteColor" wx:if="{{!orderList.length}}">
    <image class="imgCenter" src="/images/pic_delivery_empty.png"></image>
    <text class="noCodeText">暂无订单信息</text>
</view>
<scroll-view class="scroll" wx:else 
    scroll-y="true" 
    bindscrolltolower='loadMoreList' style="height: 100%;">


    <view  wx:if='{{!isMore}}' class='noMore'>
        <text>没有更多了</text>
    </view>
    <view wx:else class='noMore'>
        <text>下拉加载更多</text>
    </view>
</scroll-view>
```

