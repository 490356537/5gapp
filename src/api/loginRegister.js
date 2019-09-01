/* post_demo */
import { common_post } from "./common";

//登录
export function login(params) {
    const axios_confgin = {
        url: "/Member/Communal/Login",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}

//退出
export function loginOut(params) {
    const axios_confgin = {
        url: "/Member/Communal/loginOut",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}

//注册
export function Register(params) {
    const axios_confgin = {
        url: "/Member/Communal/Register",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}

//找回密码
export function forgetPwd(params) {
    const axios_confgin = {
        url: "/Member/Communal/forgetPwd",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}
