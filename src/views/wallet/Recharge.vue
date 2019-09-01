<template>
    <article class="css-pages">
        <Navhead title_name="充值">
            <mu-ripple class="but-right" @click="$router.push({name:'Rechargelog'})">
                <i class=" mu-icon color material-icons ">记录</i>
            </mu-ripple>
        </Navhead>
        <div class="show_loading" ref="show_loading">
            <p class="qrcode_name" v-if="qrcode_name">{{qrcode_name}}充值地址</p>
            <div class="code">
                <div class="code_box">
                    <div class="code_img"><img v-if="Recharge_data.qrcode" :src="Recharge_data.qrcode"></div>
                </div>
            </div>
            <div class="but-copy">
                <mu-button flat color="primary" @click="dialog.is_show = true">
                    选择币种
                </mu-button>
                <mu-button flat color="primary" class="but" @click="copy" :data-clipboard-text="Recharge_data.coin_address">
                    复制地址
                </mu-button>
            </div>
        </div>
        <mu-dialog :title="dialog.title" width="80%" :esc-press-close="false" :overlay-close="false"
                   :open.sync="dialog.is_show">
            {{dialog.content}}
            <mu-list>
                <mu-list-item :key="item.coin_code" v-for="item in coin.list">
                    <mu-list-item-content>
                        <mu-radio :label="item.coin_name" :value="item.coin_code" v-model="coin.ringtone"></mu-radio>
                    </mu-list-item-content>
                </mu-list-item>
            </mu-list>
            <mu-button slot="actions" flat color="primary" @click="getcode(2)">确定</mu-button>
            <!--<mu-button slot="actions" flat color="primary" v-else @click="dialog.is_show=false">确定</mu-button>-->
        </mu-dialog>
        <mu-dialog :title="dialog_tow.title" width="80%" :esc-press-close="false" :overlay-close="false"
                   :open.sync="dialog_tow.is_show">
            {{dialog_tow.content}}
            <mu-button slot="actions" flat color="primary" @click="dialog_tow.is_show=false">确定</mu-button>
        </mu-dialog>
    </article>
</template>

<script>
    import Clipboard from 'clipboard'
    import {paycode} from "@/api/wallet.js";
    import Navhead from "@/components/Navhead.vue";

    export default {
        name: "Recharge",
        components: {
            Navhead
        },
        data() {
            return {
                show_loading: null,
                userinfo: JSON.parse(localStorage.getItem('userinfo')),
                dialog: {
                    title: '',
                    content: '',
                    is_show: false
                },
                dialog_tow: {
                    title: '',
                    content: '',
                    is_show: false
                },
                Recharge_data: {
                    coin_address: '',
                    qrcode: ''
                },
                qrcode_name: '',
                coin: {
                    list: [],
                    ringtone: '',
                }
            }
        },
        mounted() {
            this.getcode(1);
        },
        methods: {
            copy() {
                let _this = this;
                let clipboard = new Clipboard('.but') //注意要使用let或者const，不能使用var，否则会出现复制次数叠加的问题，即复制不止一次。
                // 因为var是全局变量，let和const是局部
                clipboard.on('success', e => {
                    _this.dialog_tow.title = '提示';
                    _this.dialog_tow.content = '复制成功';
                    _this.dialog_tow.is_show = true;
                    clipboard.destroy() //使用destroy可以清楚缓存
                })
                clipboard.on('error', e => {
                    _this.dialog_tow.title = '提示';
                    _this.dialog_tow.content = '复制失败';
                    _this.dialog_tow.is_show = true;
                    clipboard.destroy()
                })
            },
            getcode(step) {
                this.dialog.is_show = false;
                this.show_loading = this.$loading({target: this.$refs.show_loading});
                let params = {
                    member_id: this.userinfo.id,
                    token: this.userinfo.token,
                    step: step
                };
                //console.log(this.coin.list);
                if (step == 2)
                    params.coin_code = this.coin.ringtone
                paycode(params).then(res => {
                    this.show_loading.close();
                    //this.Recharge_data = res.data;
                    if (step == 1) {
                        this.dialog.title = '选择币种';
                        this.dialog.content = '';
                        this.coin.list = res.data.coin;
                        this.coin.ringtone = res.data.coin[0];
                        this.dialog.is_show = true;
                    } else {
                        if (res.status == 1) {
                            this.dialog.content = '';
                            this.Recharge_data = res.data;

                            for (let i in this.coin.list) {
                                if (this.coin.list[i].coin_code == this.coin.ringtone)
                                    this.qrcode_name = this.coin.list[i].coin_name;
                            }
                        } else {
                            this.dialog.title = '选择币种';
                            this.dialog.content = res.msg;
                            this.dialog.is_show = true;
                        }
                    }
                }).catch((res) => {
                    this.show_loading.close();
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

    .qrcode_name {
        font-size: 16px;
        text-align: center;
        color: #2196f3;
        margin-top: 20px;
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

    @height: 48px;
    .but-right {
        height: @height;
        width: @height;
        line-height: @height;
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        i {
            font-size: 12px;
            width: 22px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            display: block;
        }
    }
</style>