
/* post_demo */
import { common_post } from "./common";

//修改密码
export function game(params) {
    const axios_confgin = {
        url: "/Member/Info/game",
        params: params,
    };
    return common_post(axios_confgin).then(res => {
        return res;
    });
}