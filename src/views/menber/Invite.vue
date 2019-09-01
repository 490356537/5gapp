<template>
    <article class="css-pages">
        <Navhead title_name="邀请码"></Navhead>
        <div class="show_loading" ref="show_loading">
            <div class="text_code">邀请码:{{Invite_data.invite_code}}</div>
            <div class="tpis">您的好友在注册时也可以填写邀请码</div>
            <div class="code">
                <div class="code_box">
                    <div class="code_img"><img :src="Invite_data.qrcode"></div>
                </div>
            </div>
            <div class="but-copy">
                <mu-button flat color="primary" class=" but" @click="copy" :data-clipboard-text="Invite_data.invite_url">
                    复制邀链接
                </mu-button>
            </div>

        </div>
        <mu-dialog :title="dialog.title" width="80%" :esc-press-close="false" :overlay-close="false"
                   :open.sync="dialog.is_show">
            {{dialog.content}}
            <mu-button slot="actions" flat color="primary" @click="dialog.is_show=false">确定</mu-button>
        </mu-dialog>
    </article>
</template>

<script>
    import Clipboard from 'clipboard'
    import {invite} from "@/api/member.js";
    import Navhead from "@/components/Navhead.vue";

    export default {
        name: "Invite",
        data() {
            return {
                show_loading: null,

                userinfo: JSON.parse(localStorage.getItem('userinfo')),
                dialog: {
                    title: '',
                    content: '',
                    is_show: false
                },
                Invite_data: []

            }
        },
        components: {
            Navhead
        },
        mounted() {
            this.show_loading = this.$loading({target: this.$refs.show_loading});
            const params = {
                member_id: this.userinfo.id,
                token: this.userinfo.token,
            };

            invite(params).then(res => {
                this.show_loading.close();
                this.Invite_data = res.data;
            }).catch((res) => {
                this.show_loading.close();
                /*服务器错误执行*/
                this.dialog.title = '错误' + res.status;
                this.dialog.content = '请稍后再试';
                this.dialog.is_show = true;
            });
        },
        methods:{
            copy() {
                let _this = this;
                let clipboard = new Clipboard('.but') //注意要使用let或者const，不能使用var，否则会出现复制次数叠加的问题，即复制不止一次。
                // 因为var是全局变量，let和const是局部
                clipboard.on('success', e => {
                    _this.dialog.title = '提示';
                    _this.dialog.content = '复制成功';
                    _this.dialog.is_show = true;
                    clipboard.destroy() //使用destroy可以清楚缓存
                })
                clipboard.on('error', e => {
                    _this.dialog.title = '提示';
                    _this.dialog.content = '复制失败';
                    _this.dialog.is_show = true;
                    clipboard.destroy()
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/css/main";

    .text_code {
        text-align: center;
        font-size: 16px;
        margin: 20px 0 5px;
    }

    .tpis {
        text-align: center;
    }

    .code {
        width: 300px;
        border-radius: 8px;
        background: linear-gradient(to bottom right, #90caf9, @main-color);
        margin: 20px auto;
        overflow: hidden;

        .code_box {
            width: 200px;
            margin: 50px auto;
            border-radius: 8px;
            background: #ffffff;
            overflow: hidden;

            .code_img {
                width: 180px;
                height: 180px;
                margin: 10px auto;
                overflow: hidden;

                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    border-style: none;
                    border: 0;
                    overflow: hidden;
                }
            }
        }
    }

    .but-copy {
        display: flex;
        justify-content: center;
    }

</style>