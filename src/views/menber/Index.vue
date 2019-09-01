<template>
    <article class="css-pages">
        <div class="menber-top-box">
            <div class="background-color">
                <div class="title">我的</div>
                <div class="back-box">
                    <div class="logo main-back-img02"></div>
                    <div class="shouji">{{userinfo.mobile}}</div>
                    <div class="uid">UID:{{userinfo.uid}}</div>
                </div>
            </div>
        </div>
        <div class="list-wrap">
            <mu-ripple class="list-item border" @click="$router.push({name:'Invite'})" >
                <i class=" mu-icon te material-icons ">group_add</i>
                <p>我的邀请码</p>
                <i class=" mu-icon color material-icons ">navigate_next</i>
            </mu-ripple>
            <mu-ripple class="list-item border" @click="$router.push({name:'Invitelist'})" >
                <i class=" mu-icon  material-icons ">person</i>
                <p>我的邀请</p>
                <i class=" mu-icon color material-icons ">navigate_next</i>
            </mu-ripple>
            <mu-ripple class="list-item border"  @click="$router.push({name:'Safety'})">
                <i class=" mu-icon  material-icons ">settings</i>
                <p>安全设置</p>
                <i class=" mu-icon color material-icons ">navigate_next</i>
            </mu-ripple>
            <mu-ripple class="list-item" @click="loginout">
                <i class=" mu-icon  material-icons ">power_settings_new</i>
                <p>退出登录</p>
            </mu-ripple>


            <mu-dialog :title="dialog.title" width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="dialog.is_show">
                {{dialog.content}}
                <mu-button slot="actions" flat color="primary" @click="dialog.is_show=false">确定</mu-button>
            </mu-dialog>
        </div>
    </article>
</template>

<script>
    import {loginOut} from "@/api/loginRegister.js";
    export default {
        name: "Index",
        data(){
            return{
                userinfo:JSON.parse(localStorage.getItem('userinfo')),
                dialog:{
                    title:'',
                    content:'',
                    is_show: false
                }
            }
        },
        methods:{
            loginout(){
                const params = {
                    member_id: this.userinfo.id,
                    token: this.userinfo.token,
                };

                loginOut(params).then(res => {
                    localStorage.clear();
                    this.$router.replace({name: 'Login'});
                }).catch((res) => {
                    /*服务器错误执行*/
                    this.dialog.title = '错误' + res.status;
                    this.dialog.content = '请稍后再试';
                    this.dialog.is_show = true;
                });

            }
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/css/main";

    .background-color{ background: linear-gradient(to bottom right, #90caf9 , @main-color); padding: 0 @main-padding; border-radius: 0 0 50% 50%;
        .title{ height: 48px; line-height: 48px; font-size: 15px; color: #ffffff; text-align: center; text-shadow: 1px 1px 1px rgb(58,145,216, 1);}

        .back-box{ background: #ffffff; border-radius: 8px; position: relative; margin-top: 65px; padding: 35px 0 20px;  box-shadow: 0 0 10px #0c56883d;
            .logo{ width:70px; height:70px; top:-35px; margin-left: -35px; left:50%; position: absolute; border-radius: 50%; box-shadow: 0 0 10px #0c56883d; overflow: hidden;}
            .shouji{ text-align: center; font-size: 14px; margin-top: 20px;}
            .uid{ text-align: center; font-size: 12px; margin-top: 5px;}
        }
    }

    .list-wrap{ background: #ffffff; padding: 10px 0;
        .list-item{ display: flex; align-items: center; position: relative; padding: 15px @main-padding;
            i{ width: 24px; height: 24px; text-align: center; line-height: 24px; font-size: 22px; color: @main-color-gray;
                &.color{ color: #96a5ad;}
                &.te{ font-size: 24px;}
            }
            p{ margin: 0 5px; flex: 1; font-size: 14px;}
            &.border:after{ height: 0; border-bottom:1px solid @main-border-color; position: absolute; right:0; left:39px; bottom:0; display: block; content: ' ';}
        }
    }
</style>