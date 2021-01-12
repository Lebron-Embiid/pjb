// pages/map/index.js
import {
  viewShopStockCaseList
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
var amapFile = require('../../utils/amap-wx.js')
var markersData = [];
var config_key = '6c417580c2e52be89d4babca2b97d159';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords: '店铺',
    markers: [],
    isFirstFrom: true,//第一次进来
    latitude: '',
    longitude: '',
    textData: {},

    tips: {},
    AddressName: '',
    AddressLocation: '',

    // polygon: [{
    //   points:[
    //     {"latitude":22.534134,"longitude":113.921632},
    //     {"latitude":22.525653,"longitude":113.927153},
    //     {"latitude":22.528388,"longitude":113.923013},
    //     {"latitude":22.527594,"longitude":113.922821},
    //     {"latitude":22.526434,"longitude":113.923674}
    //   ]
    // }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success (res) {
        console.log(res.latitude,res.longitude)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: function(){
        that.setData({
          latitude: 39.909729,
          longitude: 116.398419
        })
      }
     })
    this.setAuthMap();
  },
  toHere(){
    var that = this;
    console.log(that.data.latitude,that.data.longitude)
    wx.openLocation({
      name: that.data.textData.address,
      latitude: Number(that.data.textData.latitude),
      longitude: Number(that.data.textData.longitude),
      scale: 14
    })
  },
  makertap: function(e) {
    this.setData({
      isFirstFrom: false
    })
    // 点击地图的定位点，展示对应的店铺信息
    var id = e.markerId;
    var that = this;
    console.log(JSON.stringify(e))
    for(let i=0;i<that.data.markers.length;i++){
      if(that.data.markers[i].id == id){
        that.showMarkerInfo(that.data.markers,i);
      }
    }
    // that.changeMarkerColor(that.data.markers,id);
  },
  showMarkerInfo: function(data,i){
    var that = this;
    that.setData({
      textData: data[i]
    });
  },
  changeMarkerColor: function(data,i){
    var that = this;
    var markers = [];
    for(var j = 0; j < data.length; j++){
      if(j==i){
        data[j].iconPath = "../../assets/marker1.png"; //如：..­/..­/img/marker_checked.png
      }else{
        data[j].iconPath = "../../assets/marker2.png"; //如：..­/..­/img/marker.png
      }
      markers.push(data[j]);
    }
    that.setData({
      markers: markers
    });
  },
  bindInput: function(e) {
    wx.navigateTo({
      url: '/pages/mapSearch/index'
    })
    return;
  },
 
  bindSearch: function(e) {
    console.log(e)
    var keywords = e.target.dataset.keywords;
    var location = e.target.dataset.location;
    console.log(keywords);
    console.log(location);
    var that = this;
    // var text = this.data.tips;
    // console.log(text);
    that.setData({
      AddressName: keywords,
      AddressLocation: location
    })
    // wx.setStorageSync("addressName", keywords)
  },
  setAuthMap(){
    var that = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined  表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false  表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true  表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '授权失败',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      //再次授权后，加载地图
                      that.showMap(that.data.keywords);
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        duration: 1000
                      });
                    }
                  }             
                })
              }
            }
          })
        } else { 
          //授权后默认加载
          that.showMap(that.data.keywords);
        }
      }
    });
  },
  showMap(keywords){
    var that = this;
    let identity = wx.getStorageSync('userInfo').type;
    var myAmapFun = new amapFile.AMapWX({key:config_key});
    var params = {
      // querykeywords: keywords,
      // iconPathSelected: '../../assets/marker1.png', //如：..­/..­/img/marker_checked.png
      // iconPath: '../../assets/marker2.png', //如：..­/..­/img/marker.png
      success: function(res_data){
        let data = {};
        if(identity==0||identity==1){
          data.businessId = wx.getStorageSync('business_id')
        }
        if(identity==2||identity==6){
          data.factoryShopId = wx.getStorageSync('shop_id')
        }
        viewShopStockCaseList(data).then((shop_res)=>{
          if(shop_res.code == 200){
            markersData = shop_res.data;
            if(markersData.length > 0){
              // var poisData = res_data.poisData;
              var markers_new = [];
              let iconPath = '../../assets/marker2.png';
              let beerSurplus = 0;
              for(let i=0;i<markersData.length;i++){
                let item = markersData[i];
                console.log("---当前item---"+JSON.stringify(item))
                if(item.secureStockList.length != 0){
                  // 安全（绿）库存列表
                  iconPath = '../../assets/marker3.png';
                  let max = item.secureStockList[0].beerSurplus;
                  for(let j=0;j<item.secureStockList.length;j++){
                    var cur = item.secureStockList[j];
                    cur > max ? max = cur : null
                  }
                  beerSurplus = max;
                }
                if(item.warnStockList.length != 0){
                  // 警告（黄）库存列表
                  iconPath = '../../assets/marker4.png';
                  let max = item.warnStockList[0].beerSurplus;
                  for(let j=0;j<item.warnStockList.length;j++){
                    var cur = item.warnStockList[j];
                    cur > max ? max = cur : null
                  }
                  beerSurplus = max;
                }
                if(item.dangerStockList.length != 0){
                  // 危险（红）库存列表
                  iconPath = '../../assets/marker2.png';
                  let max = item.dangerStockList[0].beerSurplus;
                  for(let j=0;j<item.dangerStockList.length;j++){
                    var cur = item.dangerStockList[j];
                    cur > max ? max = cur : null
                  }
                  beerSurplus = max;
                }
                if(item.secureStockList.length==0&&item.warnStockList.length==0&&item.dangerStockList.length==0){
                  // 库存为0的情况
                  iconPath = '../../assets/marker2.png';
                  beerSurplus = 0;
                }
                markers_new.push({
                  id: item.shopId,
                  bossName: item.bossName,
                  shopName: item.shopName,
                  phone: item.phone,
                  address: item.address,
                  beerSurplus: beerSurplus,
                  latitude: item.latitude,
                  longitude: item.longitude,
                  iconPath: iconPath,
                  width: 22,
                  height: 32
                })
              }
              console.log('----marker----'+JSON.stringify(markers_new))
              that.setData({
                markers: markers_new
              });
              // that.setData({
              //   city: poisData[0].cityname || ''
              // });
              // that.setData({
              //   latitude: markersData[0].latitude
              // });
              // that.setData({
              //   longitude: markersData[0].longitude
              // });
              that.showMarkerInfo(that.data.markers,0);
            }else{
              wx.getLocation({
                type: 'gcj02',
                isHighAccuracy: true,
                success: function(res) {
                  that.setData({
                    latitude: res.latitude
                  });
                  that.setData({
                    longitude: res.longitude
                  });
                },
                fail: function(){
                  that.setData({
                    latitude: 39.909729
                  });
                  that.setData({
                    longitude: 116.398419
                  });
                }
              })
            }
          }
        })
      },
      fail: function(info){
        // wx.showModal({title:info.errMsg})
      }
    }
    myAmapFun.getPoiAround(params)
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
    var that = this;
    const pages = getCurrentPages()
    const currPage = pages[pages.length - 1] // 当前页
    console.log('---返回店数据---'+JSON.stringify(currPage.data))
    if(currPage.data.keywords){
      var keywords = currPage.data.keywords;
      var MyAmapFun = new amapFile.AMapWX({
        key: config_key
      });
      MyAmapFun.getInputtips({
        keywords: keywords,
        //city: Addresscity, //已使用机器当前位置编码 为优先搜索
        location: '',
        success: function(data) {
          console.log('----搜索回调----'+JSON.stringify(data))
          if (data && data.tips) {
            that.setData({
              tips: data.tips
            });
          }
        }
      })
    }
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