// pages/mapSearch/index.js
var amapFile = require('../../utils/amap-wx.js')
var config_key = '6c417580c2e52be89d4babca2b97d159';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: {},
    AddressName: '',
    AddressLocation: '',
    type: '',//选择县城区 area
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type == 'area'){
      this.setData({
        type: options.type
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  bindInput: function(e) {
    // wx.navigateTo({
    //   url: '/pages/mapSearch/index'
    // })
    // return;
    var that = this;
    var keywords = e.detail.value;
    var MyAmapFun = new amapFile.AMapWX({
      key: config_key
    });
    MyAmapFun.getInputtips({
      keywords: keywords,
      //city: Addresscity, //已使用机器当前位置编码 为优先搜索
      location: '',
      success: function(data) {
        // console.log(data)
        if (data && data.tips) {
          that.setData({
            tips: data.tips
          });
        }
      }
    })
  },
 
  bindSearch: function(e) {
    console.log(e)
    var keywords = e.currentTarget.dataset.keywords;
    var location = e.currentTarget.dataset.location;
    var area = e.currentTarget.dataset.area;
    console.log(keywords);
    console.log(location);
    console.log(area);
    var that = this;
    that.setData({
      AddressName: keywords,
      AddressLocation: location
    })
    // var text = this.data.tips;
    // console.log(text);
    const pages = getCurrentPages()
    const prevPage = pages[pages.length-2] // 上一页// 调用上一个页面的setData 方法，将数据存储
    
    if(this.data.type == 'area'){
      prevPage.setData({
        area: area
      })
    }else{
      prevPage.setData({
        keywords: keywords,
        location: location
      })
    }
    wx.navigateBack({
      delta: 1
    })
    // wx.setStorageSync("addressName", keywords)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})