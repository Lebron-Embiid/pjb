// pages/shipment/index.js
import {
  queryBeerDeliveryAverageOutlineIsIsDay,
  queryBeerDeliveryAverageOutlineIsMonth
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
import * as echarts from '../../components/ec-canvas/echarts';
var Chart = null;
var dataList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: '',
    dataList: [],
    ec: {
      lazyLoad: true // 延迟加载
    },
    selectDayMonth: 0,
    lastArr: [],
    lastMonth: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      identity: wx.getStorageSync('userInfo').type
    })
    this.echartsComponnet = this.selectComponent('#mychart');
    this.getData(0); //获取数据
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
  selectDayOrMonth(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      lastMonth: [],
      dataList: [],
      selectDayMonth: index
    })
    this.getData(index);
  },
  backData(res){
    let x_data = [[],[]];	
    for(let i in res.data){
      if(res.data[i].deliveryBeerNumber == null){
        res.data[i].deliveryBeerNumber = 0;
      }
      if(res.data[i].deliveryNumber == null){
        res.data[i].deliveryNumber = 0;
      }
      //啤酒数量	
      x_data[0].push(Math.ceil(res.data[i].deliveryBeerNumber))
      //配送数量	
      x_data[1].push(parseInt(res.data[i].deliveryNumber))
    }
    for(let i=0;i<2;i++){
      this.data.dataList.push({
        name: i==0?'啤酒数量':'配送数量',
        type: 'line',
        smooth: true,
        data: x_data[i]
      })
    }
    
    let date = res.data;
    for(let j in date){
      this.data.lastMonth.push(date[j].date);
    }

    this.setData({
      dataList: this.data.dataList,
      lastMonth: this.data.lastMonth,
      lastArr: this.data.lastMonth
    })
    this.init_echarts();
  },
  getData(index){
    if(index == 0){
      // 天
      let data = {};
      if(this.data.identity == 0 || this.data.identity == 1){
        data.businessId = wx.getStorageSync('business_id')
      }
      if(this.data.identity == 2){
        data.factoryShopId = wx.getStorageSync('shop_id')
      }
      queryBeerDeliveryAverageOutlineIsIsDay(data).then((res)=>{
        if(res.code == 200){
          this.backData(res)
        }
      })
    }else{
      // 月
      let data = {};
      if(this.data.identity == 0 || this.data.identity == 1){
        data.businessId = wx.getStorageSync('business_id')
      }
      if(this.data.identity == 2){
        data.factoryShopId = wx.getStorageSync('shop_id')
      }
      queryBeerDeliveryAverageOutlineIsMonth(data).then((res)=>{
        if(res.code == 200){
          this.backData(res)
        }
      })
    }
  },
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: 3
      });
      Chart.setOption(this.getOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    Chart.clear();  // 清除
    Chart.setOption(this.getOption());  //获取新数据
  },
  getOption(){
    var option = {
      title: {
        text: '啤酒配送总数平均值',
        left: 'center'
      },
      // color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      // legend: {
      //   data: ['A', 'B', 'C','D', 'E', 'F','G', 'H', 'I'],
      //   bottom: 0,
      //   left: 'center',
      //   z: 100
      // },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.data.lastArr,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: this.data.dataList
    };
    return option;
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