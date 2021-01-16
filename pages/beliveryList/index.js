// pages/buildList/index.js
import {
  queryUserBeerDeliveryList,
  changeBeerDeliveryStatus,
  contentToCode
} from '../../api/user.js'
import { base64src } from '../../utils/base64src.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_code: '',
    is_showCode: false,
    beerList: [],
    identity: '',
    get_id: '',//签收id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      identity: wx.getStorageSync('userInfo').type
    })
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
    this.getShowInitList();
  },
  getShowInitList(){
    let data = {}
    if(this.data.identity == 2){
      data.deliveryShopId = wx.getStorageSync('shop_id')
    }
    if(this.data.identity == 6){
      data.deliveryUserId = wx.getStorageSync('userInfo').unionId
    }
    if(this.data.identity == 3 || this.data.identity == 7){
      data.takeShopId = wx.getStorageSync('shop_id')
    }
    queryUserBeerDeliveryList(data).then((der_res)=>{
      if(der_res.code == 200){
        this.setData({
          beerList: der_res.data
        })
      }
    })
  },
  add(){
    wx.navigateTo({
      url: '/pages/beerDelivery/index'
    })
  },
  updateDerviry(e){
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/beerDelivery/index?is_from=edit&data='+encodeURIComponent(JSON.stringify(item))
    })
  },
  clickDerviry(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    let txt = '';
    if(status == 1){
      txt = '配送';
    }else if(status == 2){
      txt = '签收';
    }else if(status == 3){
      txt = '删除';
    }else if(status == 4){
      txt = '拒收';
    }else if(status == 5){
      txt = '取消配送';
    }
    if(status == 2){
      wx.scanCode({
        success: function(scan){
          console.log('签收id---'+JSON.stringify(scan))
          if(scan.result == id){
            changeBeerDeliveryStatus({
              idKey: id,
              status: status,
            }).then((res)=>{
              if(res.code == 200){
                publicFun.getModal('签收成功',false);
                that.getShowInitList();
              }
            })
          }else{
            publicFun.getToast('签收失败，请选择正确的二维码');
          }
        }
      })
      return;
    }
    wx.showModal({
      title: "提示",
      content: "确定要"+txt+"吗?",
      success: function(mos){
        if(mos.confirm){
          changeBeerDeliveryStatus({
            idKey: id,
            status: status
          }).then((res)=>{
            if(res.code == 200){
              that.getShowInitList();
            }
          })
        }
      }
    })
  },
  showUserCode(e){
    let id = e.currentTarget.dataset.id;
    if(wx.getStorageSync('check') == 1){
      contentToCode({
        content: id
      }).then((res)=>{
        if(res.code == 200){
          let base64 = "data:image/png;base64," + res.data;
		  this.setData({
		    user_code: base64,
		    is_showCode: true
		  })
          // base64src(base64,id,image=>{
            
          // })
        }
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  hideUserCode(){
    this.setData({
      is_showCode: false
    })
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