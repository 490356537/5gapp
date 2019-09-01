<template>
    <article class="css-pages">
        <Navhead :title_name="$route.query.type==2?'修改支付密码':'修改登录密码'"></Navhead>

        <div class="show_loading" ref="show_loading">
            <div class="form-wrap">
                <mu-form ref="captcha_form" :model="form_data">
                    <mu-form-item label="登录密码" prop="login_pwd" :rules="login_pwdRules">
                        <mu-text-field v-model="form_data.login_pwd" prop="login_pwd"
                                       type="password"></mu-text-field>
                    </mu-form-item>
                    <div class="yan-wrap">
                        <div class="yan-wrap">
                            <mu-form-item label="验证码" prop="smscode" :rules="smscodeRules">
                                <mu-text-field v-model="form_data.smscode" prop="smscode"></mu-text-field>
                            </mu-form-item>
                            <!--<mu-text-field full-width v-model="form_data.smscode" label="验证码" type='text'></mu-text-field>-->
                        </div>
                        <mu-button class="operating-item" flat color="primary" @click="getsmscode">
                            获取验证码{{isgetsmsall.miao==0?'':'('+isgetsmsall.miao+')'}}
                        </mu-button>

                    </div>
                    <mu-form-item :label="$route.query.type==2?'新支付密码':'新登录密码'" prop="new_pwd" :rules="new_pwdRules">
                        <mu-text-field v-model="form_data.new_pwd" prop="new_pwd"
                                       :action-icon="isshow_pwd ? 'visibility_off' : 'visibility'"
                                       :action-click="() => (isshow_pwd = !isshow_pwd)"
                                       :type="isshow_pwd ? 'text' : 'password'"></mu-text-field>
                    </mu-form-item>

                    <mu-form-item label="确认密码" prop="confirm_pwd" :rules="confirm_pwdRules">
                        <mu-text-field v-model="form_data.confirm_pwd" prop="confirm_pwd"
                                       type="password"></mu-text-field>
                    </mu-form-item>
                </mu-form>
            </div>
            <div class="but-box">
                <mu-button class="operating-item" full-width color="primary" @click="post_updatePwd">修改</mu-button>
            </div>
        </div>
        <mu-dialog :title="dialog.title" width="80%" :esc-press-close="false" :overlay-close="false"
                   :open.sync="dialog.is_show">
            {{dialog.content}}
            <mu-button slot="actions" flat color="primary" @click="$router.go(-1);" v-if="dialog.is_out">确定</mu-button>
            <mu-button slot="actions" flat color="primary" @click="dialog.is_show=false" v-else>确定</mu-button>
        </mu-dialog>
    </article>
</template>

<script>
    import {sendSms} from "@/api/public.js";
    import {updatePwd} from "@/api/member.js";

    import Navhead from "@/components/Navhead.vue";

    export default {
        name: "Uppasswd",
        data() {
            return {
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

                form_data: {
                    login_pwd: '',
                    new_pwd: '',
                    confirm_pwd: '',
                    smscode: '',
                },
                userinfo: JSON.parse(localStorage.getItem('userinfo')),
                dialog: {
                    title: '',
                    content: '',
                    is_show: false,
                    is_out: false
                },


                smscodeRules: [
                    {validate: (val) => !!val, message: '验证码必填'},
                ],
                login_pwdRules: [
                    {validate: (val) => !!val, message: '登录密码必填'},
                ],
                new_pwdRules: [
                    {validate: (val) => !!val, message: '新密码必填'},
                    {validate: (val) => val.length >= 6 && val.length <= 14, message: '密码长度大于6小于14'}
                ],
                confirm_pwdRules: [
                    {validate: (val) => !!val, message: '确认密码必填'},
                    {validate: (val) => val.length >= 6 && val.length <= 14, message: '密码长度大于6小于14'}
                ],
            }
        },
        components: {
            Navhead
        },
        methods: {
            getsmscode() {
                const loading = this.$loading({target: this.$refs.show_loading});
                const params = {
                    type: 3,
                    member_id: this.userinfo.id,
                    token: this.userinfo.token,
                };
                sendSms(params).then(res => {
                    loading.close();
                    if (res.status == 1) {
                        this.isgetsmsall.miao = 59;
                        let _this = this;
                        this.isgetsmsall.timeobj = setInterval(function () {
                            _this.isgetsmsall.miao -= 1;
                            if (_this.isgetsmsall.miao <= 0) {
                                clearInterval(_this.isgetsmsall.timeobj)
                            }
                        }, 1000);
                    } else {
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
            },
            post_updatePwd() {
                this.$refs.captcha_form.validate().then((result_tow) => {
                    if (result_tow) {
                        const loading = this.$loading();
                        const params = {
                            member_id: this.userinfo.id,
                            token: this.userinfo.token,
                            type: this.$route.query.type == 2 ? 2 : 1,
                            smscode: this.form_data.smscode,
                            old_pwd: this.form_data.login_pwd,
                            new_pwd: this.form_data.new_pwd,
                        };
                        updatePwd(params).then(res => {
                            loading.close();
                            if (res.status == 1) {
                                this.dialog.title = '提示';
                                this.dialog.content = '修改成功';
                                this.dialog.is_out = true;
                                this.dialog.is_show = true;
                            } else {
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
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>

    @import "~@/assets/css/main";

    .but-box {
        margin: 10px @main-padding;
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
</style>