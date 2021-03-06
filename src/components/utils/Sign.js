
export default class Sign {

    static createNonceStr() {
        return Math.random().toString(36).substr(2, 15);
    }

    static createTimestamp() {
        return parseInt(new Date().getTime() / 1000, 10) + '';
    }

    static raw(args) {
        var keys = Object.keys(args);
        keys = keys.sort()
        var newArgs = {};
        keys.forEach(function (key) {
            newArgs[key.toLowerCase()] = args[key];
        });

        var string = '';
        for (var k in newArgs) {
            string += '&' + k + '=' + newArgs[k];
        }
        string = string.substr(1);
        return string;
    }

    /**
     * @synopsis 签名算法
     *
     * @param jsapi_ticket 用于签名的 jsapi_ticket
     * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
     *
     * @returns
     */
    static sign(jsapi_ticket, url) {
        var ret = {
            jsapi_ticket: jsapi_ticket,
            nonceStr: Sign.createNonceStr(),
            timestamp: Sign.createTimestamp(),
            url: url
        };
        var string = Sign.raw(ret);
        //jsSHA = require('jssha');
        var shaObj = new window.jsSHA(string, 'TEXT');
        ret.signature = shaObj.getHash('SHA-1', 'HEX');
        console.log(ret);
        return ret;
    }

}
