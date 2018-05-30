/* eslint-disable */

const extendDate = () => {
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
const DateUtils = {
    isIOS() {
        return !!window.navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
    },

    format(longDate, pattern) {
        extendDate();

        if (longDate) {
            let fmt = pattern || 'yyyy-MM-dd';
            if (DateUtils.isIOS()) {
                try {
                    longDate = longDate.replace(new RegExp(/(-)/g), "/");
                } catch (e) {

                }
            }
            return new Date(longDate).Format(fmt);
        }
        return null;
    },


    formatFn(longDate, pattern = 'MM-dd') {
        let now = new Date();
        if (DateUtils.isIOS()) {
            try {
                longDate = longDate.replace(new RegExp(/(-)/g), "/");
            } catch (e) {

            }
        }
        let date = new Date(longDate);
        let r = now.getTime() - date.getTime();
        let minute = r / (1000 * 60);
        let hour = minute / 60;
        //let day = hour / 24;

        let isToday = date.getDate() === now.getDate();
        let isYesterday = new Date(now.setDate(now.getDate()-1)).getDate() === date.getDate();

        if (minute <= 10) {
            return "刚刚";
        } else if (minute < 30) {
            return parseInt(minute) + "分钟前";
        } else if (minute < 60) {
            return "半小时前";
        } else if (hour < 12) {
            return parseInt(hour) + "小时前";
        } else if (isToday) {
            return "今天";
        } else if (isYesterday) {
            return "昨天";
        }
        return DateUtils.format(longDate, pattern);
    }
}


module.exports = DateUtils;

