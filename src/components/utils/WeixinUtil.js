/**
 * 2017/4/28.
 */

import HttpUtil from './HttpUtil';
import * as AppUrl from '../config/AppUrl';
import Sign from './Sign';

export default class WeixinUtil {

    static getAccessToken() {
        return HttpUtil.get(AppUrl.URL_GET_ACCESS_TOKE).then((json)=>{
            return json.accessToken;
        }).catch((err)=>alert(err));
    }


    static getJsApiTicket() {
        return HttpUtil.get(AppUrl.URL_GET_JSAPI_TICKET).then((json)=>{
            return json.jsapiTicket;
        }).catch((err)=>alert(err));
    }


    static getJsdkSign(url) {
        let index = url.indexOf("#");
        if (index !== -1) {
            url = url.substring(0, index);
        }
        return WeixinUtil.getJsApiTicket().then((jsapi_ticket)=>{
            return Sign.sign(jsapi_ticket, url)
        }).catch((err)=>alert(err));
    }

}