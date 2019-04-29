const formatTime = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : '0' + n;
};
// todo 命名
// todo 那天是几号用newdate
function getDates(days, todate) {
	let dateArray = [];
	for (let i = 0; i < days; i++) {
		let dateObj = dateLater(todate, i);
		dateArray.push(dateObj);
	}
	return dateArray;
}
function dateLater(dates, later) {
	let dateObj = {};
	let show_day = [0, 1, 2, 3, 4, 5, 6];
	let date = new Date(dates);
	date.setDate(date.getDate() + later);
	let day = date.getDay();
	let yearDate = date.getFullYear();
	let month = ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1);
	let dayFormate = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());
	dateObj.time = yearDate + '-' + month + '-' + dayFormate;
	dateObj.week = show_day[day];
	return dateObj;
}

module.exports = {
	formatTime: formatTime,
	getDates: getDates
};
