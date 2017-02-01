const util = require('../../utils/util');
const app = getApp();

let o;

Page({
  data: {
    toname: '',
    relation: 1,
    sex: 1,
    today: '',
    sentday: '',
    sentence: '',
    wishesId: '',
    state: 0, //0 换一个, 1 制作我的祝福话
    showOverlay: false
  },
  finishCard () {
    this.setData({
      state: '1'
    })
  },
  changeOne (e) {
    // 点击事件，强制拉去数据
    let that = this;
    if (e){
      util.request({
        path: 'wishes', // 改变path名与util.request中的path名一致可以调试请求失败的情况
        relation: o.relation,
        sex: o.sex,
        id: ''
      },function(w){
        console.log(w)
        that.setData({
          toname: app.getToName() || w.to,
          sentence: w.wishes,
          wishesId: w.wishes_id
        })
      })
      return;
    }
    let _wishes = app.getWishes();
    if (_wishes){
      this.setData({
        sentence: _wishes
      })
    }else{
      util.request({
        path: 'wishes', // 改变path名与util.request中的path名一致可以调试请求失败的情况
        relation: o.relation,
        sex: o.sex,
        id: ''
      },function(w){
        that.setData({
          toname: app.getToName() || w.to,
          sentence: w.wishes,
          wishesId: w.wishes_id
        })
      })
    }
  },
  shareTips () {
    let that = this;
    this.setData({
      showOverlay: true
    })
    setTimeout(function() {
      that.hideOverlay()
    }, 1500);
  },
  hideOverlay () {
    this.setData({
      showOverlay: false
    })
  },
  // 调整到制作页面
  customCard () {
    wx.navigateTo({
      url: `/pages/create/create`
    })
  },
  //跳转到自定义页面
  bindViewTap(){
    if (this.data.state === '0') {
      app.setWishes(this.data.sentence);
      wx.navigateTo({
        url: `/pages/custom/custom?relation=${this.data.relation}&sex=${this.data.sex}`
      })
    }
  },
  onLoad (options) {
    console.log('options', options)
    o = options;
  },
  onShow(){
    let that = this;
    console.log('sssssss')

    if (o.state === '0') {
      console.log('进入制作页面')
      app.clearWishes(true);
      app.clearTempNickName();
      app.clearTempToName();
      // 初始化数据
      this.setData({
        toname: app.getToName(),
        state: o.state,
        relation: o.relation,
        sex: o.sex,
        today : util.today()
      })

      // 获取祝福话
      this.changeOne();

      // 获取用户信息
      app.getUserInfo(function(userInfo){
        that.setData({
          userInfo:userInfo
        })
      })
    }

    if (o.state === '1') {
      console.log('接收贺卡')
      this.setData({
          state: o.state,
          toname: o.toname,
          fromname: o.fromname,
          fromavatar: o.fromavatar,
          sentday: o.sentday,
          sentence: o.sentence
      })
    }

    //判断是否需要展示 点击跳转至自定义页面的提示
    let preview_custom_hint = wx.getStorageSync('preview-custom-hint') || false;
    this.setData({
      showCustomHint : preview_custom_hint
    })
  },
  onShareAppMessage () {
    this.hideOverlay()
    return {
      title: `${this.data.userInfo.nickName}给您发来祝福`,
      desc: "你也可以制作祝福话送给TA哟！",
      path: '/pages/preview/preview?&state=1&fromavatar='+this.data.userInfo.avatarUrl+'&toname='+this.data.toname+'&fromname='+this.data.userInfo.nickName+'&sentday='+this.data.today+'&sentence='+this.data.sentence
    }
  },
  confirmCustomHint : function(){
    wx.setStorageSync('preview-custom-hint',true);
    this.setData({
      showCustomHint:true
    })
  }
})
