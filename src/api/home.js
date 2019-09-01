/* post_demo */
import { common_post } from "./common";

//首页
export function index(params) {
    const axios_confgin = {
        url: "/Member/Index/index",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}
//投票
export function startgame(params) {
    const axios_confgin = {
        url: "/Member/Account/startgame",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}