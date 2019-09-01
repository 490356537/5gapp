<template>
    <article class="css-pages">
        <div class="navhead-wrap">
            <mu-ripple class="but-left" @click="$router.replace({name:'Login'})">
                <i class=" mu-icon color material-icons ">navigate_before</i>
            </mu-ripple>
            <p>注册会员</p>
        </div>

        <div class="show_loading" ref="show_loading">
            <div class="form-wrap">
                <mu-form ref="form_mobile" :model="form_mobile">
                    <mu-form-item label="手机号码" prop="mobile" :rules="mobileRules">
                        <mu-text-field v-model="form_mobile.mobile" prop="mobile" type="text"></mu-text-field>
                    </mu-form-item>
                </mu-form>
                <!--<mu-text-field full-width v-model="form_data.mobile" label="手机号码" type='text'></mu-text-field>-->
                <mu-form ref="captcha_form" :model="form_data">
                    <div class="yan-wrap">
                        <div class="yan-wrap">
                            <mu-form-item label="验证码" prop="smscode" :rules="smscodeRules">
                                <mu-text-field v-model="form_data.smscode" prop="smscode"></mu-text-field>
                            </mu-form-item>
                            <!--<mu-text-field full-width v-model="form_data.smscode" label="验证码" type='text'></mu-text-field>-->
                        </div>
                        <mu-button class="operating-item" flat color="primary" @click="show_getsms">
                            获取验证码{{isgetsmsall.miao==0?'':'('+isgetsmsall.miao+')'}}
                        </mu-button>

                    </div>
                    <mu-form-item label="登录密码" prop="login_pwd" :rules="login_pwdRules">
                        <mu-text-field v-model="form_data.login_pwd" prop="login_pwd"
                                       :action-icon="isshow_pwd ? 'visibility_off' : 'visibility'"
                                       :action-click="() => (isshow_pwd = !isshow_pwd)"
                                       :type="isshow_pwd ? 'text' : 'password'"></mu-text-field>
                    </mu-form-item>

                    <mu-form-item label="确认密码" prop="confirm_pwd" :rules="confirm_pwdRules">
                        <mu-text-field v-model="form_data.confirm_pwd" prop="confirm_pwd"
                                       type="password"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="邀请码" prop="invite_code" :rules="invite_codeRules">
                        <mu-text-field v-model="form_data.invite_code" prop="invite_code" type="text"></mu-text-field>
                    </mu-form-item>
                </mu-form>
            </div>
            <div class="but-box">
                <mu-button class="operating-item" full-width color="primary" large @click="post_Register">注册</mu-button>
            </div>
        </div>

        <mu-dialog :title="dialog.title" width="80%" :esc-press-close="false" :overlay-close="false"
                   :open.sync="dialog.is_show">
            <div class="captcha-box" v-if="dialog.content==''">
                <img :src="captcha_url" @click="newcapt_id">
                <mu-form ref="dialog_form" :model="captcha_form">
                    <mu-form-item label="验证码" label-float prop="captcha" :rules="captchaRules">
                        <mu-text-field v-model="captcha_form.captcha" prop="captcha"></mu-text-field>
                    </mu-form-item>
                </mu-form>
            </div>
            {{dialog.content}}
            <mu-button slot="actions" flat color="blueGrey200" @click="dialog.is_show=false" v-if="dialog.content==''">
                关闭
            </mu-button>
            <mu-button slot="actions" flat color="primary" @click="getsmscode" v-if="dialog.content==''">确定</mu-button>
            <mu-button slot="actions" flat color="primary" @click="$router.replace({name:'Login'})" v-if="dialog.content!=''&&addgod">确定</mu-button>
            <mu-button slot="actions" flat color="primary" @click="dialog.is_show=false" v-if="dialog.content!=''&&!addgod">确定</mu-button>
        </mu-dialog>
    </article>
</template>

<script>
    import {sendSms, getSign} from "@/api/public.js";
    import {Register} from "@/api/loginRegister.js";

    export default {
        name: "Registered",
        data() {
            return {
                addgod: false,

                isshow_pwd: '',
                isgetsmsall: {
                    timeobj: null,
                    miao: 0
                },
                captchaRules: [
                    {validate: (val) => !!val, message: '验证码必填'},
                ],
                captcha_form: {
                    captcha: '',
                },
                capt_id: new Date().getTime(),
                captcha_url: 'http://api.hkwtsz.com/Member/Communal/captcha?capt_id=' + this.capt_id,


                form_mobile: {
                    mobile: '',
                },
                form_data: {
                    login_pwd: '',
                    confirm_pwd: '',
                    invite_code: this.$route.query.invite?this.$route.query.invite:'',
                    smscode: '',
                },
                dialog: {
                    title: '',
                    content: '',
                    is_show: false
                },


                smscodeRules: [
                    {validate: (val) => !!val, message: '验证码必填'},
                ],
                login_pwdRules: [
                    {validate: (val) => !!val, message: '登录密码必填'},
                    {validate: (val) => val.length >= 6 && val.length <= 14, message: '密码长度大于6小于14'}
                ],
                confirm_pwdRules: [
                    {validate: (val) => !!val, message: '确认密码必填'},
                    {validate: (val) => val.length >= 6 && val.length <= 14, message: '密码长度大于6小于14'}
                ],
                invite_codeRules: [
                    {validate: (val) => !!val, message: '邀请码必填'},
                ],
                mobileRules: [
                    {validate: (val) => !!val, message: '手机号码必填'},
                ],
            }
        },
        methods: {
            newcapt_id(){
                this.capt_id= new Date().getTime();
                this.captcha_url= 'http://api.hkwtsz.com/Member/Communal/captcha?capt_id=' + this.capt_id;
            },
            show_getsms() {
                if(this.isgetsmsall.miao <=0) {
                    this.$refs.form_mobile.validate().then((result) => {
                        if (result) {
                            this.dialog.title = '获取短信验证码';
                            this.dialog.content = '';
                            this.dialog.is_show = true;
                        }
                    });
                }
            },
            getsmscode() {
                this.$refs.dialog_form.validate().then((result) => {
                    if (result) {
                        this.dialog.is_show = false;
                        const loading = this.$loading({target: this.$refs.show_loading});
                        const getSign_params = {
                            controller: 'Communal',
                            action: 'sendSms',
                        };
                        getSign(getSign_params).then(getSign_params => {
                            const params = {
                                type: 1,
                                mobile: this.form_mobile.mobile,
                                sign: getSign_params.data.sign,
                                captcha: this.captcha_form.captcha,
                                capt_id: this.capt_id
                            };
                            sendSms(params).then(res => {
                                loading.close();
                                this.captcha_form.captcha = '';
                                if(res.status==1) {
                                    this.isgetsmsall.miao = 59;
                                    let _this = this;
                                    this.isgetsmsall.timeobj = setInterval(function () {
                                        _this.isgetsmsall.miao -= 1;
                                        if (_this.isgetsmsall.miao <= 0) {
                                            clearInterval(_this.isgetsmsall.timeobj)
                                        }
                                    }, 1000);
                                }else{
                                    this.dialog.title = '提示';
                                    this.dialog.content = res.msg;
                                    this.dialog.is_show = true;
                                }
                            }).catch((res) => {
                                loading.close();
                                /*服务器错误执行*/
                                this.dialog.title = '错误' + res.status;
                                this.dialog.content = '请稍后再试';
                                this.dialog.is_show = true;
                            });
                        }).catch((res) => {
                            loading.close();
                            /*服务器错误执行*/
                            this.dialog.title = '错误' + res.status;
                            this.dialog.content = '请稍后再试';
                            this.dialog.is_show = true;
                        });
                    }
                });

            },
            post_Register() {
                this.$refs.form_mobile.validate().then((result_one) => {
                    this.$refs.captcha_form.validate().then((result_tow) => {
                        if (result_one && result_tow) {
                            const loading = this.$loading();
                            const params = {
                                mobile: this.form_mobile.mobile,
                                login_pwd: this.form_data.login_pwd,
                                invite_code: this.form_data.invite_code,
                                smscode: this.form_data.smscode,
                            };
                            Register(params).then(res => {
                                loading.close();
                                if(res.status==1) {
                                    this.dialog.title = '提示';
                                    this.dialog.content = '注册成功';
                                    this.addgod = true;
                                    this.dialog.is_show = true;
                                }else{
                                    this.dialog.title = '提示';
                                    this.dialog.content = res.msg
                                    this.dialog.is_show = true;
                                }
                            }).catch((res) => {
                                loading.close();
                                /*服务器错误执行*/
                                this.dialog.title = '错误' + res.status;
                                this.dialog.content = '请稍后再试';
                                this.dialog.is_show = true;
                            });
                        }
                    });
                });
            }
        },
        mounted() {
            this.newcapt_id();
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/css/main";

    .but-box {
        margin: 0 @main-padding;
    }

    .css-pages {
        display: flex;
        flex-direction: column
    }

    @height: 48px;
    .navhead-wrap {
        height: @height;
        line-height: @height;
        font-size: 15px;
        border-bottom: 1px solid @main-close;
        text-align: center;
        box-shadow: 0 0 5px @main-close;
        background: @main-color;
        color: #ffffff;
        text-shadow: 1px 1px 1px rgb(58, 145, 216, 1);
        position: relative;

        .but-left {
            height: @height;
            width: @height;
            line-height: @height;
            text-align: center;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
        }

        i {
            font-size: 22px;
            width: 22px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            display: block;
        }
    }


    .form-wrap {
        padding: @main-padding;
        background: #ffffff;
    }

    .yan-wrap {
        display: flex;
        align-items: center;

        .flex01 {
            flex: 1;
        }
    }

    .captcha-box {
        img {
            width: 200px;
            height: 49.6px;
            display: block;
            margin: 0 auto;
        }
    }
</style>