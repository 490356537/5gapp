<template>
    <article class="css-pages">
        <div>
            <div class="logo-wrap main-back-img02"></div>
            <mu-form ref="form" :model="validateForm" class="mu-demo-form">
                <div class="user-name">
                    <mu-form-item prop="username" :rules="usernameRules" icon="account_circle" help-text="请填写账号">
                        <mu-text-field class="text-fl" v-model="validateForm.username" type='text'
                                       prop="username"></mu-text-field>
                    </mu-form-item>
                </div>
                <div class="user-passwd">
                    <mu-form-item prop="password" :rules="passwordRules" icon="locked" help-text="请填写密码">
                        <mu-text-field class="text-fl" v-model="validateForm.password" type='password'
                                       prop="password"></mu-text-field>
                    </mu-form-item>
                </div>
                <div class="but-box">
                    <mu-button class="operating-item tian" full-width color="primary" large @click="login">登录</mu-button>
                </div>
            </mu-form>
            <p class="caozuo-wrap"><span @click="$router.replace({name:'Registered'})">立即注册</span><span @click="$router.replace({name:'Retrievepasswd'})">忘记密码？</span></p>

            <mu-dialog :title="dialog.title" width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
                {{dialog.content}}
                <mu-button slot="actions" flat color="primary" @click="openAlert=false">确定</mu-button>
            </mu-dialog>
        </div>
    </article>
</template>

<script>
    import {login} from "@/api/loginRegister.js";

    export default {
        name: "Login",
        data() {
            return {
                openAlert: false,

                usernameRules: [
                    {validate: (val) => !!val, message: '必须填写账号'}
                ],
                passwordRules: [
                    {validate: (val) => !!val, message: '必须填写密码'}
                ],

                validateForm: {
                    username: '',
                    password: '',
                },
                dialog:{
                    title:'',
                    content:'',
                }
            }
        },
        created() {

        },
        methods: {
            login() {
                this.$refs.form.validate().then((result) => {
                    if (result) {
                        const params = {
                            mobile: this.validateForm.username,
                            login_pwd: this.validateForm.password,
                        };
                        const loading = this.$loading();
                        login(params).then(res => {
                            loading.close();
                            if (res.status == 1) {
                                localStorage.setItem('userinfo', JSON.stringify(res.data));
                                this.$router.replace({name: 'Home_index'});
                                //console.log(JSON.parse(localStorage.getItem('userinfo')))
                            } else {
                                this.dialog.title = '登陆失败';
                                this.dialog.content = '请输入正确的账号密码';
                                this.openAlert = true;
                            }
                        }).catch((res) => {
                            /*服务器错误执行*/
                            loading.close();
                            this.dialog.title = '错误' + res.status;
                            this.dialog.content = '请稍后再试';
                            this.openAlert = true;
                        });
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/css/main";

    .logo-wrap {
        width: 80px;
        height: 80px;
        margin: 0 auto 25px;
        //background: red;
    }

    .css-pages {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly; /*background: linear-gradient(to bottom right, #96d0ff, #90caf9);*/
    }

    .caozuo-wrap {
        display: flex;
        justify-content: space-between;
        margin: 10px 30px 50px;

        span {
        }
    }

    .user-name, .user-passwd {
        margin: 0 @main-padding;
        justify-content: center;
        display: flex;
    }

    .text-fl {
        margin-right: 15px;
    }

    .but-box {
        margin: 15px 30px 0;
    }
</style>