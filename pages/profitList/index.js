// pages/profitList/index.js
import * as echarts from '../../components/ec-canvas/echarts';
import {
  agent_coupon_profit_list,
  seller_coupon_profit_list,
  coupon_sell_trend_chart,
  coupon_sell_trend_chart_month,
  queryAgentCouponDealRecordStatisticsOutlineIsDay,
  queryAgentCouponDealRecordStatisticsOutlineIsHour,
  queryAgentCouponDealRecordStatisticsOutlineIsMonth,
  querySellCouponDealRecordStatisticsOutlineIsDay,
  querySellCouponDealRecordStatisticsOutlineIsHour,
  querySellCouponDealRecordStatisticsOutlineIsMonth,
  queryAgentInviteRatioList,
  getBeerTypeList
} from '../../api/user.js'

var Chart = null;
var dataList = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    date: '',
    tab_list: ["代理人","销售员"],
    activeIndex: 0,
    list: [],
    dataList: [],
    page: 1,
    ec: {
      lazyLoad: true // 延迟加载
    },
    selectDayMonth: 1,//0:小时 1:天 2:月
    lastArr: [],
    lastMonth: [],
    couponTypes: [],
    coupon_index: null,
    coupon_type: '',//是否是 查看促销券类型销量：couponType
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var today = Y + '-' + M + '-' + D;
    
    let last7 = [];
    for(let i=0;i<=9;i++){
      this.getLastSevenDay(i);
      // 获取最近7天的日期  this.getLastSevenDay(i).M_before+'月'+
      last7.unshift(this.getLastSevenDay(i).D_before);
    }

    this.setData({
      type: wx.getStorageSync('userInfo').type,
      date: today,
      lastArr: last7
    })

    if(options.coupon_type){
      this.setData({
        coupon_type: options.coupon_type
      })
    }

    if(this.data.type == 0 || this.data.type == 1){
      // 获取啤酒类型
      getBeerTypeList({
        businessId: wx.getStorageSync('business_id')
      }).then((res)=>{
        if(res.code == 200){
          if(res.data.length!=0){
            this.setData({
              couponTypes: []
            })
          }
          for(let i in res.data){
            this.data.couponTypes.push({
              idKey: res.data[i].idKey,
              name: res.data[i].name
            })
          }
          this.setData({
            couponTypes: this.data.couponTypes
          })
        }
      })
    }

    this.echartsComponnet = this.selectComponent('#mychart');
    this.getData(today); //获取数据

    console.log("---当前身份---"+this.data.type)
    // if(this.data.type == 0 || this.data.type == 1 || this.data.type == 4){
    //   this.getAgentProfitList();
    // }else{
    //   this.getSellerProfitList();
    // }
  },
  getLastSevenDay(n){
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var tdate = new Date(timestamp * 1000);
    //获取年份
    var Y = tdate.getFullYear();
    //获取月份
    var M = (tdate.getMonth() + 1 < 10 ? '0' + (tdate.getMonth() + 1) : tdate.getMonth() + 1);
    //获取当日日期
    var D = tdate.getDate() < 10 ? '0' + tdate.getDate() : tdate.getDate();
    //減7天的时间戳：
    var before_timetamp = timestamp - 24 * 60 * 60 * n;// * (n+1)
    //減7天的时间：
    var n_to = before_timetamp * 1000;
    var before_timetamp = new Date(n_to);
    var Y_before = before_timetamp.getFullYear();
    //月份
    var M_before = (before_timetamp.getMonth() + 1 < 10 ? '0' + (before_timetamp.getMonth() + 1) : before_timetamp.getMonth() + 1);
    //日期
    var D_before = before_timetamp.getDate() < 10 ? '0' + before_timetamp.getDate() : before_timetamp.getDate();
    var lastDay = {
      M_before,
      D_before
    }
    // console.log(M_before,D_before)
    return lastDay;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getData(today){
    if(this.data.coupon_type != 'couponType' && (this.data.type == 0 || this.data.type == 1 || this.data.type == 4)){
      // 代理人报表
      if(this.data.selectDayMonth == 1){
        // 天
        let data = {
          // startDate: today,
          // endDate: today
        }
        if(this.data.type == 4){
          data.agentId = wx.getStorageSync('userInfo').unionId
        }
        if(this.data.type == 0 || this.data.type == 1){
          data.businessId = wx.getStorageSync('business_id')
        }
        queryAgentCouponDealRecordStatisticsOutlineIsDay(data).then((res)=>{
          if(res.code == 200){
            let x_data = [[],[]];	
            for(let i in res.data){
              if(res.data[i].sealSuccessNumber == null){
                res.data[i].sealSuccessNumber = 0;
              }
              if(res.data[i].spreadNumber == null){
                res.data[i].spreadNumber = 0;
              }
              //交易成功数量
              x_data[0].push(res.data[i].sealSuccessNumber)
              //传播数量
              x_data[1].push(res.data[i].spreadNumber)
            }
            for(let i=0;i<2;i++){
              this.data.dataList.push({
                name: i==0?'交易成功数量':'传播数量',
                type: 'line',
                smooth: true,
                data: x_data[i]
              })
            }
            
            let date = res.data;
            for(let j in date){
              this.data.lastMonth.push(date[j].date.split('-')[2]);
            }

            this.setData({
              dataList: this.data.dataList,
              lastMonth: this.data.lastMonth
            })

            console.log(this.data.dataList)
            this.init_echarts();
          }
        })
      }else if(this.data.selectDayMonth == 2){
        // 月
        let data = {
          // startDate: today,
          // endDate: today
        }
        if(this.data.type == 4){
          data.agentId = wx.getStorageSync('userInfo').unionId
        }
        if(this.data.type == 0 || this.data.type == 1){
          data.businessId = wx.getStorageSync('business_id')
        }
        queryAgentCouponDealRecordStatisticsOutlineIsMonth(data).then((res)=>{
          if(res.code == 200){
            let x_data = [[],[]];	
            for(let i in res.data){
              if(res.data[i].sealSuccessNumber == null){
                res.data[i].sealSuccessNumber = 0;
              }
              if(res.data[i].spreadNumber == null){
                res.data[i].spreadNumber = 0;
              }
              //交易成功数量
              x_data[0].push(res.data[i].sealSuccessNumber)
              //传播数量
              x_data[1].push(res.data[i].spreadNumber)
            }
            for(let i=0;i<2;i++){
              this.data.dataList.push({
                name: i==0?'交易成功数量':'传播数量',
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
              lastMonth: this.data.lastMonth
            })
            console.log(this.data.lastMonth);
            console.log(this.data.dataList)
            this.init_echarts();
          }
        })
      }else{
        // 小时
        let data = {
          // startDate: today
        }
        if(this.data.type == 4){
          data.agentId = wx.getStorageSync('userInfo').unionId
        }
        if(this.data.type == 0 || this.data.type == 1){
          data.businessId = wx.getStorageSync('business_id')
        }
        queryAgentCouponDealRecordStatisticsOutlineIsHour(data).then((res)=>{
          if(res.code == 200){
            let x_data = [[],[]];	
            for(let i in res.data){
              if(res.data[i].sealSuccessNumber == null){
                res.data[i].sealSuccessNumber = 0;
              }
              if(res.data[i].spreadNumber == null){
                res.data[i].spreadNumber = 0;
              }
              //交易成功数量
              x_data[0].push(res.data[i].sealSuccessNumber)
              //传播数量
              x_data[1].push(res.data[i].spreadNumber)
            }
            for(let i=0;i<2;i++){
              this.data.dataList.push({
                name: i==0?'交易成功数量':'传播数量',
                type: 'line',
                smooth: true,
                data: x_data[i]
              })
            }
          
            let date = res.data;
            for(let j in date){
              this.data.lastMonth.unshift(date[j].date.split(' ')[1]);
            }

            this.setData({
              dataList: this.data.dataList,
              lastMonth: this.data.lastMonth
            })
            
            console.log(this.data.dataList)
            this.init_echarts();
          }
        })
      }
    }else{
      // 销售员报表
      if(this.data.selectDayMonth == 1){
        // 天
        let data = {
          // startDate: today,
          // endDate: today
        }
        if(this.data.type == 3 || this.data.type == 7){
          data.sellerId = wx.getStorageSync('userInfo').unionId
        }
        
        if(this.data.coupon_type == 'couponType'){
          data.businessId = wx.getStorageSync('business_id')
          if(this.data.coupon_index != null){
            data.beerTypeId = this.data.couponTypes[this.data.coupon_index].idKey
          }
        }
        querySellCouponDealRecordStatisticsOutlineIsDay(data).then((res)=>{
          if(res.code == 200){
            let x_data = [];
            for(let i in res.data){
              if(res.data[i].sellerNumber == null){
                res.data[i].sellerNumber = 0;
              }
              x_data.push(res.data[i].sellerNumber)
              // console.log(res.data[i])
            }
            // x_data.push(x_data[x_data.length-1]*2)
            this.data.dataList.push({
              name: '销售数量',
              type: 'line',
              smooth: true,
              data: x_data
            })

            let date = res.data;
            for(let j in date){
              this.data.lastMonth.push(date[j].date.split('-')[2]);
            }

            this.setData({
              dataList: this.data.dataList,
              lastMonth: this.data.lastMonth
            })

            console.log(this.data.dataList)
            this.init_echarts();
          }
        })
      }else if(this.data.selectDayMonth == 2){
        // 月
        let data = {
          // startDate: today,
          // endDate: today
        }
        if(this.data.type == 3 || this.data.type == 7){
          data.sellerId = wx.getStorageSync('userInfo').unionId
        }
        if(this.data.coupon_type == 'couponType'){
          data.businessId = wx.getStorageSync('business_id')
          if(this.data.coupon_index != null){
            data.beerTypeId = this.data.couponTypes[this.data.coupon_index].idKey
          }
        }
        querySellCouponDealRecordStatisticsOutlineIsMonth(data).then((res)=>{
          if(res.code == 200){
            let x_data = [];
            for(let i in res.data){
              if(res.data[i].sellerNumber == null){
                res.data[i].sellerNumber = 0;
              }
              x_data.push(res.data[i].sellerNumber)
              // console.log(res.data[i])
            }
            this.data.dataList.push({
              name: '销售数量',
              type: 'line',
              smooth: true,
              data: x_data
            })
            
            let date = res.data;
            for(let j in date){
              this.data.lastMonth.push(date[j].date);
            }

            this.setData({
              dataList: this.data.dataList,
              lastMonth: this.data.lastMonth
            })
            console.log(this.data.lastMonth);
            console.log(this.data.dataList)
            this.init_echarts();
          }
        })
      }else{
        // 小时
        let data = {
          // startDate: today
        }
        if(this.data.type == 3 || this.data.type == 7){
          data.sellerId = wx.getStorageSync('userInfo').unionId
        }
        if(this.data.coupon_type == 'couponType'){
          data.businessId = wx.getStorageSync('business_id')
          if(this.data.coupon_index != null){
            data.beerTypeId = this.data.couponTypes[this.data.coupon_index].idKey
          }
        }
        querySellCouponDealRecordStatisticsOutlineIsHour(data).then((res)=>{
          if(res.code == 200){
            let x_data = [];
            for(let i in res.data){
              if(res.data[i].sellerNumber == null){
                res.data[i].sellerNumber = 0;
              }
              x_data.push(res.data[i].sellerNumber)
              // console.log(res.data[i])
            }
            this.data.dataList.push({
              name: '销售数量',
              type: 'line',
              smooth: true,
              data: x_data
            })
          
            let date = res.data;
            for(let j in date){
              this.data.lastMonth.unshift(date[j].date.split(' ')[1]);
            }

            this.setData({
              dataList: this.data.dataList,
              lastMonth: this.data.lastMonth
            })

            console.log(this.data.dataList)
            this.init_echarts();
          }
        })
      }
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
    let title_txt = '';
    let legend_arr = [];
    if(this.data.type == 0 || this.data.type == 1 || this.data.type == 4){
      title_txt = '代理人交易记录报表';
      legend_arr = ['交易成功数量', '传播数量'];
    }else{
      title_txt = '销售员交易记录报表';
      legend_arr = ['销售数量'];
    }
    if(this.data.coupon_type == 'couponType'){
      title_txt = '促销券类型销量报表';
    }
    var option = {
      title: {
        text: title_txt,
        left: 'center'
      },
      // color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      // legend: {
      //   data: legend_arr,
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
  selectDayOrMonth(e){
    let index = e.currentTarget.dataset.index;
    // this.data.selectDayMonth = !this.data.selectDayMonth;
    this.setData({
      lastMonth: [],
      dataList: [],
      selectDayMonth: index
    })
    if(this.data.selectDayMonth == 1){
      // 天
      // let last7 = [];
      // for(let i=0;i<=9;i++){
      //   this.getLastSevenDay(i);
      //   // 获取最近7天的日期  this.getLastSevenDay(i).M_before+'月'+
      //   last7.unshift(this.getLastSevenDay(i).D_before);
      // }
      // this.data.lastArr = last7;
      this.data.lastArr = this.data.lastMonth;
    }else if(this.data.selectDayMonth == 2){
      // 月
      this.data.lastArr = this.data.lastMonth;
    }else{
      // 小时
      // let hours = [];
      // for(let i=1;i<=24;i++){
      //   hours.push(i);
      // }
      // this.data.lastArr = hours;
      this.data.lastArr = this.data.lastMonth;
    }
    this.setData({
      lastArr: this.data.lastArr
    })
    this.getData(this.data.date);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    // this.data.page++;
    // this.setData({
    //   page: this.data.page
    // })
    // if(this.data.activeIndex == 0){
    //   this.getAgentProfitList();
    // }else{
    //   this.getSellerProfitList();
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  clickNav(e){
    this.setData({
      lastMonth: [],
      dataList: [],
      list: [],
      page: 1,
      activeIndex: e.currentTarget.dataset.index
    })
    if(this.data.activeIndex == 0){
      this.getAgentProfitList();
    }else{
      this.getSellerProfitList();
    }
  },
  bindTypeChange(e){
    this.setData({
      coupon_index: e.detail.value,
      lastMonth: [],
      dataList: []
    })
    this.getData(); //获取数据
  },
  bindDateChange(e){
    this.setData({
      list: [],
      page: 1,
      date: e.detail.value
    })
    if(this.data.type == 0 || this.data.type == 1 || this.data.type == 4){
      this.getAgentProfitList();
    }else{
      this.getSellerProfitList();
    }
    // if(this.data.activeIndex == 0){
    //   this.getAgentProfitList();
    // }else{
    //   this.getSellerProfitList();
    // }
  },
  getAgentProfitList(){
    let data = {
      // date: this.data.date
    }
    if(this.data.type == 4){
      data.agentId = wx.getStorageSync('userInfo').unionId
    }
    if(this.data.type == 0){
      data.businessId = wx.getStorageSync('business_id')
    }
    queryAgentInviteRatioList(data).then((res)=>{
      if(res.code == 200){
        if(this.data.page == 1){
          this.setData({
            list: res.data
          })
        }else{
          this.setData({
            list: this.data.list.concat(res.data)
          })
        }
      }
    })
  },
  getSellerProfitList(){
    let data = {
      date: this.data.date
    }
    if(this.data.type == 7){
      data.sellerId = wx.getStorageSync('userInfo').unionId
    }
    querySellCouponDealRecordStatisticsOutlineIsDay(data).then((res)=>{
      if(res.code == 200){
        if(this.data.page == 1){
          this.setData({
            list: res.data
          })
        }else{
          this.setData({
            list: this.data.list.concat(res.data)
          })
        }
      }
    })
  },
  toDetail(e){
    let id = e.currentTarget.dataset.id;
    var type = '';
    if(this.data.activeIndex == 0){
      type = 'boss';
    }else{
      type = 'boss_seller';
    }
    wx.navigateTo({
      url: '/pages/profitDetail/index?type=' + type + '&id=' + id + '&date=' + this.data.date
    })
  }
})