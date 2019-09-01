/* post_demo */
import { common_post } from "./common";

//钱包首页
export function wallet(params) {
    const axios_confgin = {
        url: "/Member/Info/wallet",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}

//充值
export function paycode(params) {
    const axios_confgin = {
        url: "/Member/Info/paycode",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}
//充值记录
export function recharge(params) {
    const axios_confgin = {
        url: "/Member/Info/recharge",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}
//提币
export function withdraw(params) {
    const axios_confgin = {
        url: "/Member/Account/withdraw",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}
//提币记录
export function withdrawlog(params) {
    const axios_confgin = {
        url: "/Member/Info/withdraw",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}
//转账
export function transfer(params) {
    const axios_confgin = {
        url: "/Member/Account/transfer",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}
//转账记录
export function transferlog(params) {
    const axios_confgin = {
        url: "/Member/Info/transfer",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}
//会员升级
export function upgrade(params) {
    const axios_confgin = {
        url: "/Member/Account/upgrade",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}
