/* post_demo */
import { common_post } from "./common";

//修改密码
export function updatePwd(params) {
    const axios_confgin = {
        url: "/Member/Communal/updatePwd",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}

//我的邀请码
export function invite(params) {
    const axios_confgin = {
        url: "/Member/Info/invite",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}

//我的邀请记录
export function team(params) {
    const axios_confgin = {
        url: "/Member/Info/team",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}