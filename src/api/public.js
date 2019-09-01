/* post_demo */
import { common_post,common_get } from "./common";

//图片上传
export function binaryUpload(params) {
    const axios_confgin = {
        url: "/Index/Index/binaryUpload",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}

//接口签名
export function getSign(params) {
    const axios_confgin = {
        url: "/Member/Communal/getSign",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}
//短信发送
export function sendSms(params) {
    const axios_confgin = {
        url: "/Member/Communal/sendSms",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}
//图片验证码
export function captcha(params) {
    const axios_confgin = {
        url: "/Member/Communal/captcha",
        params: params,
    };
    return common_get(axios_confgin).then(res => {
        return res;
    });
}
//检测版本更新
export function checkVersion(params) {
    const axios_confgin = {
        url: "/Member/Index/checkVersion",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}