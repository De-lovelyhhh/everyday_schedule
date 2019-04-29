// index.js
// 获取应用实例
// todo 接入框架
// todo 下拉刷新
import regeneratorRuntime from '../../utils/runtime' // eslint-disable-line
let util = require('../../utils/util.js');

// noinspection JSAnnotator
Page({
	data: {
		dayList: ['7', '8', '9', '10', '11', '12', '13'],
		classList: [[], [], [], [], [], [], []],
		isEmpty: true
	},
	async onLoad(format, data) {
		this.showPerSchedule();
		let time = util.formatTime(new Date());
		let weekday = util.getDates(7, time);
		console.log(weekday);
		let that = this;
		let week = await this.getDay();
		// todo 简化setData
		this.setData({ week });
		wx.setNavigationBarTitle({ title: '第' + week + '周' });
		this.setData({
			weekday: weekday[0].week
		}, data);
		this.setData({
			classList: await this.getClass()
		});
		// todo 不要再最外层判断
		this.data.classList[this.data.weekday].forEach(function(value) {
			if (value.classWeek[21 - week] === '1') {
				that.setData({ isEmpty: false });
			}
		});
	},

	async getDay() {
		return new Promise(function (resolve, reject) {
			wx.request({
				url: 'https://www.easy-mock.com/mock/5c95ecbf8e241c358386bc37/weekNum',
				success: function(res) {
					console.log(res);
					resolve(res.data.Today.week);
				},
				fail: function (e) {
					console.log(e);
				}
			});
		});
	},

	async getClass() {
		let that = this;
		return new Promise(function(resolve, reject) {
			wx.request({
				url: 'https://www.easy-mock.com/mock/5c95ecbf8e241c358386bc37/class_schedule',
				method: 'POST',
				success: function (res) {
				    // todo 定义一个空数组，再把空数组给classdata
					that.data.classList = [[], [], [], [], [], [], []];
					console.log(res);
					// todo 判断class是不是空的
					// todo foreach后面箭头函数
					// todo item value改名
					res.data.class.forEach(function(item) {
						item.schedules.forEach(function(value) {
						    // todo toString和split一步搞定
							// todo 解构呀
							let beginTime = value.beginTime.toString();
							let endTime = value.endTime.toString();
							let begin = beginTime.split('.');
							let end = endTime.split('.');
							// 将时间转换成二进制
							let week = that.toBin(value.week);
							// todo tofix
							if (end.length === 1) end.push('00');
							else if (end[1].length === 1) end[1] = end[1] + '0';
							if (begin.length === 1) begin.push('00');
							else if (begin[1].length === 1) begin[1] = begin[1] + '0';
							let plan = {
							    // todo 去掉单引号
								// todo 换成lesson
								'className': item.name,
								'classId': item.id,
								'classTeacher': item.teacher,
								'classCredit': item.credit,
								'classTime': value.time,
								'classBeginFloat': value.beginTime,
								'classEndFloat': value.endTime,
								'classBeginTime': begin[0] + ':' + begin[1],
								'classEndTime': end[0] + ':' + end[1],
								'classroom': value.room,
								'classWeek': week
							};
							// 按时间先后排序
							// todo 数组确定下来再排序，用sort
							if (that.data.classList[value.day].length !== 0) {
								that.data.classList[value.day].forEach(function (details, index) {
									if (details.classBeginFloat >= value.beginTime) {
										that.data.classList[value.day].splice(index, 0, plan);
									} else {
										that.data.classList[value.day].push(plan);
									}
								});
							} else {
								that.data.classList[value.day].push(plan);
							}
						});
					});
					console.log(that.data.classList);
					wx.setStorageSync('classList', that.data.classList);
					resolve(that.data.classList);
				},
				fail: function (e) {
					console.log('请求失败：' + e);
					reject(e);
				}
			});
		});

	},
	showPerSchedule: function() {
		let classList = wx.getStorageSync('classList');
		if (classList) {
			this.setData({
				classList: classList
			});
		}
	},
	changeDay: function (options) {
		let day = options.currentTarget.dataset.index;
		let week = this.data.week;
		this.setData({ isEmpty: true });
		let that = this;
		this.setData({
			weekday: day
		});
		this.data.classList[day].forEach(function(value) {
			if (value.classWeek[21 - week] === '1') {
				that.setData({ isEmpty: false });
			}
		});
	},
	// todo 用函数
	toBin: function (n) {
		if (n === 0) return '00000000000000000000';
		let res = '';
		while (n !== 0) {
			res = n % 2 + res;
			n = parseInt(n / 2);
		}
		res = res.padStart(20, '0');
		console.log(res);
		return res;
	}
});
