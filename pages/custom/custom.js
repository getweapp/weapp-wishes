let opt;
let temp = {
  toname : '',
  "best-wishes": '',
  nickName: ''
}

const saveDataToApp = function(that,e){
  let userInfo = that.data.userInfo;
  let data = e.detail.value;
  userInfo.nickName = data.nickName;
  app.setUserInfo(userInfo);
  app.setWishes(data['best-wishes']);
  app.setToName(data.toname)
}

const saveDataToAppTemp = function(that,data){
  app.setTempNickName(data.nickName);
  app.setToName(data.toname,true)
  app.setWishes(data['best-wishes'],true);
}

var app = getApp()
Page({
  data: {
    isRed: false
  },
  "more-template":function(e){
    let that = this;

    // HACK
    // 防止触发more-template时,setToName,setNickName,setWishes这三个onblur事件还没有完成
    // 最好使用promise;
    setTimeout(function(){
      //防止有几条数据没有改的情况发生
      temp.toname = temp.toname || that.data.toname;
      temp['best-wishes'] = temp['best-wishes'] || that.data.wishes;
      temp.nickName = temp.nickName || that.data.userInfo.nickName;

      saveDataToAppTemp(that,temp);
      wx.navigateTo({
        url:`/pages/more/more?relation=${that.data.relation}&sex=${that.data.sex}`
      })
    },50)
    /*this.setData({showMore:!this.data['showMore']})*/
  },
  save :function(e){
    saveDataToApp(this,e);
    app.clearWishes(true);
    app.clearTempNickName();
    app.clearTempToName();
    wx.navigateBack();
  },
  cancel : function(e){
    app.clearWishes(true);
    app.clearTempNickName();
    app.clearTempToName();
    wx.navigateBack();
  },
  setToName : function(e){
    temp['toname'] = e.detail.value;
  },
  setNickName : function(e){
    temp['nickName'] = e.detail.value;
  },
  setWishes : function(e){
    temp['best-wishes'] = e.detail.value;
  },
  bindChangeText: function (e) {
    let txt = e.detail.value
    if (txt.length > 50) {
      this.setData({
        'isRed': true
      })
    } else {
      this.setData({
        'isRed': false
      })
    }
  },
  onShow:function(){
    let that = this;
    app.getUserInfo(function(userInfo){
      let _userInfo = Object.assign({},userInfo);
      _userInfo.nickName = app.getTempNickName() || _userInfo.nickName;
      that.setData({
        userInfo:_userInfo
      })
    })
    this.setData({
      relation : opt.relation,
      sex : opt.sex,
      toname: app.getToName(true) || app.getToName(),
      wishes: app.getWishes(true) || app.getWishes()
    });
  },
  onLoad: function (options) {
    var that = this;
    opt = options;
  }
})
