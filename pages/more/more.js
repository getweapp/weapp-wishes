const util = require('../../utils/util');

const app = getApp();

Page({
  data:{
    /*wishList : [{
      id:0,
      wishes: '1生命无需过百岁，健康就行。\r\n朋友无须有多少，有你就行。\r\n好朋友祝你新年快乐!生命无需过百岁，健康就行。\r\n朋友无须有多少，有你就行。\r\n好朋友祝你新年快乐!'
    }],*/
    checkedID : null
  },
  check:function(e){
    let id = e.currentTarget.dataset.id;
    if (this.data.checkedID !== id){
      this.setData({
        checkedID : id
      })
    }
  },
  save:function(){
    let id = this.data.checkedID;
    let wishList = this.data.wishList;
    let i = wishList.findIndex(function(item,index,arr){
      return item.id == id;
    })
    if (i >= 0){
      app.setWishes(wishList[i].wishes,true);
      wx.navigateBack()
    }else{
      console.error(`no item with id ${id} in wishList`)
    }

  },
  onLoad:function(opt){
    app.getUserInfo(function(userInfo){
      console.log(userInfo.nickName)
    })
    let that = this;
    util.request({
      path:'lists',
      relation:opt.relation,
      sex:opt.sex
    },function(wishList){
      that.setData({
        wishList : wishList
      })
    })
  }
})
