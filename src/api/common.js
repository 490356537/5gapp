import axios from "axios";
import router from '../router'

const config = require("./serve_or_build");  // build 需要域名

// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        if (response.status === 200) {
            if (response.data.status == 2) {
                router.replace({name: 'Login'});
            }
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                /*case 401:
                    console.log(401);
                    break;
                case 403:
                    console.log(403);
                    break;*/
                case 404:
                    //console.log(404);
                    router.replace({name: 'Error_404'});
                    break;
                default:
                    console.log(error.response.data.message);
            }
            return Promise.reject(error.response);
        }
    });

/* ajax post请求 */
export function common_post(axios_confgin) {

    /* 创建 form data 格式 */
    let form_data = new FormData();
    for (let i in axios_confgin.params) {
        form_data.append(i, axios_confgin.params[i]);
    }

    return axios.post(config.API_URL + axios_confgin.url, form_data).then(res => {
        return Promise.resolve(res.data);
    });
}

/* ajax get */
export function common_get(axios_confgin) {
    let get_url = '';
    let for_i = 0;
    for (let i in axios_confgin.params) {
        get_url += for_i == 0 ? '?' : '&';
        get_url += i + '=' + axios_confgin.params[i];
    }

    return axios.get(config.API_URL + axios_confgin.url + get_url).then(res => {
        return Promise.resolve(res.data);
    });
}
