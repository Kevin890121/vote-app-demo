/**
 * 2017/4/28.
 */
import * as AppUrl from '../config/AppUrl';

const TIMEOUT = 10000;

class HttpUtil {
    static get(url, paramters) {
        return new Promise(function(resolve, reject) {
            var timeoutId = setTimeout(function () {
                reject(new Error("连接超时"))
            }, TIMEOUT);
            url = HttpUtil.urlAppendQeury(url, paramters);
            fetch(url, {
                credentials: AppUrl.CORS ? "include" : "omit",
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    /*'Access-Control-Allow-Origin': AppUrl.WHITE_LIST,*/
                },
            }).then((response) => response.json())
                .then((json) => {
                    clearTimeout(timeoutId);
                    if (json.result === 'success') {
                        resolve(json);
                    } else {
                        reject(new Error(json.message ? json.message : '请求错误'));
                    }
                }).catch((error) => {
                    timeoutId && clearTimeout(timeoutId);
                    reject(error);
                }
            );
        })
    }

    static post(url, paramters) {
        return new Promise(function(resolve, reject) {
            var timeoutId = setTimeout(function () {
                reject(new Error("连接超时"))
            }, TIMEOUT);

            fetch(url, {
                credentials: AppUrl.CORS ? "include" : "omit",
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                   /* 'Access-Control-Allow-Origin': AppUrl.WHITE_LIST,*/
                },
                body: JSON.stringify(paramters)
            }).then((response) => response.json())
                .then((json) => {
                    clearTimeout(timeoutId);
                    if (json.result === 'success') {
                        resolve(json);
                    } else {
                        reject(new Error(json.message ? json.message : '请求错误'));
                    }
                }).catch((error) => {
                    timeoutId && clearTimeout(timeoutId);
                    reject(error);
                }
            );
        })
    }

    static urlAppendQeury(url, query){
        if (query) {
            var queryString = Object.keys(query).map(function (key) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
            }).join("&");
            if (url.indexOf('?') === -1) {
                queryString = '?' + queryString;
            } else {
                queryString = '&' + queryString;
            }
            return url + queryString;
        }
        return url;
    }
}

module.exports = HttpUtil;