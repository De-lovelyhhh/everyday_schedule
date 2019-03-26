//index.js
//获取应用实例
var util=require("../../utils/util.js");
const app = getApp();

Page({
  data: {
      dayList:['日','一','二','三','四','五','六'],
      schedule:[[],[],[],[],[],[],[]]
  },
  onLoad: function () {
      this.showTodaySche();
      let time = util.formatTime(new Date());
      let date=util.getDates(7, time);
      let that = this;
      this.setData({
          date:date[0].week
      });
      console.log(date);
      wx.request({
          url:'https://www.easy-mock.com/mock/5c95ecbf8e241c358386bc37/class_schedule',
          success:function (res) {
              that.data.schedule = [[],[],[],[],[],[],[]];
              console.log(res);
              wx.removeStorageSync('details');
              wx.setStorageSync('details', res);
              for (let i = 0;i<res.data.class.length;i++){
                  for(let j=0;j<res.data.class[i].schedule.length;j++){
                      for(let k=0;k<7;k++){
                          if(k===res.data.class[i].schedule[j].day) {
                              let plan = {
                                  "matter":res.data.class[i].name,
                                  "beginTime":res.data.class[i].schedule[j].beginTime,
                                  "endTime":res.data.class[i].schedule[j].endTime
                              };
                              that.data.schedule[k].push(plan);
                              let newSchedule = that.data.schedule;
                              that.setData({
                                  schedule:newSchedule
                              });
                          }
                      }
                  }
              }
              console.log(that.data.schedule);
              wx.removeStorageSync('everyday');
              wx.setStorageSync('everyday', that.data.schedule)
          },
          fail:function (e) {
              console.log('请求失败：'+e)
          }
      })
  },
  showTodaySche:function(){
      if(wx.getStorageSync('everyday')){
          this.setData({
              schedule:wx.getStorageSync('everyday')
          })
      }
  },
    changeDay:function (options) {
        let day=options.currentTarget.dataset.index;
        this.setData({
            date:day
        })
    }
});
