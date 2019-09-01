<template>
    <article class="css-pages">
        <div class="top-title">我的钱包</div>
        <div class="show_loading" ref="show_loading">
            <div class="wallet-box">
                <i class=" mu-icon te material-icons ">attach_money</i>
                <p class="p">钱包余额</p>
                <p class="money">{{wallet_data.yue}}<em>/KYXC</em></p>
            </div>
            <div class="operating-box">
                <mu-button class="operating-item" flat color="secondary" @click="$router.replace({name:'Home_index'})">
                    复投KYXC
                </mu-button>
                <mu-button class="operating-item" flat color="primary" @click="$router.push({name:'Withdraw'})">提现
                </mu-button>
                <mu-button class="operating-item tian" flat color="primary" @click="$router.push({name:'Recharge'})">充值
                </mu-button>
            </div>
            <div class="operating-tow">
                <mu-ripple class="operating-item" @click="$router.push({name:'Transfer'})">
                    <i class=" mu-icon  material-icons ">monetization_on</i>
                    <p>转账</p>
                </mu-ripple>
                <mu-ripple class="operating-item border" @click="$router.push({name:'Upgrade'})">
                    <i class=" mu-icon  material-icons ">group_add</i>
                    <p>VIP升级</p>
                </mu-ripple>
            </div>

            <div class="date-wrap border">
                <div class="date-box">
                    <span class="span flex01">账户明细</span>
                </div>
            </div>

            <div ref="container" class="demo-loadmore-content">
                <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" :loaded-all="loaded_all"
                              @load="load">
                    <div class="list-item" v-for="item in wallet_data.list">
                        <div><p class="money" :class="{'money-j':item.amount>=0}">{{item.genre_text}}：{{item.amount<0?'':'+'}}{{item.amount}} KYXC</p></div>
                        <div><p class="col-ta">剩余：{{item.usable_amount}} KYXC</p><div><span>{{item.addtime}}</span></div></div>
                        <!--<div><p :class="{'money-j':item.amount>=0}">变动金额：{{item.amount<0?'':'+'}}{{item.amount}} KYXC</p><div>{{item.genre_text}}</div></div>
                        <div><p><span>{{item.addtime}}</span></p><div>剩余金额：{{item.usable_amount}}</div></div>
                        <div></div>-->
                    </div>
                    <div class="loaded_none" v-if="loaded_all">没有更多数据</div>
                </mu-load-more>
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
    import {wallet} from "@/api/wallet.js";

    export default {
        name: "Index",

        data() {
            return {
                refreshing: false,
                loading: false,
                page: 1,
                pagesize: 15,
                loaded_all: false,
                show_loading: null,

                userinfo: JSON.parse(localStorage.getItem('userinfo')),
                dialog: {
                    title: '',
                    content: '',
                    is_show: false
                },
                wallet_data: {
                    yue: '0.00',
                    list: []
                }
            }
        },
        methods: {
            refresh() {
                this.refreshing = true;
                this.$refs.container.scrollTop = 0;
                this.getlist();
            },
            load() {
                this.loading = true;
                this.getlist('load');
            },

            getlist(isload) {
                this.page = isload == 'load' ? ++this.page : 1;
                const params = {
                    member_id: this.userinfo.id,
                    token: this.userinfo.token,
                    page: this.page,
                    pagesize: this.pagesize
                };

                wallet(params).then(res => {
                    this.show_loading.close();
                    if (isload == 'load') {
                        this.loading = false;

                        this.wallet_data.list = this.wallet_data.list.concat(res.data.list);

                    } else {
                        this.refreshing = false;
                        this.wallet_data.yue = res.data.account.balance;
                        this.wallet_data.list = res.data.list;
                    }

                    if (res.data.list.length < this.pagesize)
                        this.loaded_all = true;
                    else
                        this.loaded_all = false;
                }).catch((res) => {
                    this.show_loading.close();
                    /*服务器错误执行*/
                    this.dialog.title = '错误' + res.status;
                    this.dialog.content = '请稍后再试';
                    this.dialog.is_show = true;
                });
            }
        },
        mounted() {
            this.show_loading = this.$loading({target: this.$refs.show_loading});
            this.getlist();
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/css/main";

    .top-title {
        height: 48px;
        line-height: 48px;
        font-size: 15px;
        border-bottom: 1px solid @main-close;
        text-align: center;
        box-shadow: 0 0 5px @main-close;
        background: #ffffff;
        position: relative;
        z-index: 1;
        text-shadow: 1px 1px 1px rgba(207, 216, 220, 0.2);
    }

    .wallet-box {
        margin: @main-padding;
        padding: 10px 15px 23px;
        background: linear-gradient(to bottom right, #ffca28, #ff6d00);
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(189, 106, 1, 0.75);
        position: relative;

        .p {
            font-size: 14px;
            text-shadow: 1px 1px 1px rgba(189, 106, 1, 0.58);
        }

        .money {
            font-size: 34px;
            color: #ffffff;
            text-align: center;
            text-shadow: 1px 1px 1px #b36a45;
            margin: 10px 0;

            em {
                font-size: 14px;
                font-style: normal;
            }
        }

        i {
            color: #ffffff;
            opacity: .1;
            width: 100px;
            height: 150px;
            line-height: 150px;
            font-size: 150px;
            position: absolute;
            top: 0;
            right: 40px;
        }
    }

    .operating-box {
        display: flex;
        background: #ffffff;
        border-top: 1px solid @main-border-color;
        padding: 10px @main-padding;
        justify-content: space-between;
        border-bottom: 10px solid #f5f5f5;

        .operating-item {
            width: 32%;
            border: 1px solid @main-border-color;
            border-radius: 4px;

            &.tian {
                background: @main-color;
                color: #ffffff;
                border-color: @main-color;
            }
        }
    }

    .operating-tow {
        display: flex;
        background: #ffffff;
        padding: 10px @main-padding;
        justify-content: space-between;
        border-bottom: 10px solid #f5f5f5;

        .operating-item {
            flex: 1;
            position: relative;
            color: @main-color-gray;
            text-align: center;
            font-size: 14px;
            padding: 5px 0;

            i {
                font-size: 24px;
                height: 24px;
                line-height: 24px;
                width: 26px;
                display: block;
                margin: 0 auto;
            }

            &.border {
                color: @main-money-color;

                i {
                    font-size: 26px;
                }

                &:after {
                    width: 0;
                    border-left: 1px solid @main-border-color;
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    display: block;
                    content: ' ';
                }
            }
        }
    }

    .date-wrap {
        padding: 0 @main-padding;
        background: #ffffff;
        border-bottom: 1px solid @main-border-color;

        .date-box {
            display: flex;
            align-items: center;
            height: 50px;

            .span {
                border-left: 2.5px solid @main-color;
                font-size: 15px;
                line-height: 15px;
                padding-left: 5px;
                color: @main-title-color;

                &.flex01 {
                    flex: 1;
                }
            }
        }
    }

    .css-pages {
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
    }

    .demo-loadmore-content {
        background: #ffffff;
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;


        .list-item {
            padding: @main-padding;
            margin: 0 @main-padding;
            border-bottom: 1px solid @main-border-color;
            background: #ffffff;
            //box-shadow: 0 0 5px rgba(0, 0, 0, .08);

            div {
                display: flex;
                align-items: center;
                &.dte{ font-size: 14px;}
            }

            span {
                font-size: 10px;
                color: #909a9e;
            }
            p {
                flex: 1;
                font-size: 12px;


                &.col-ta{ color: #909a9e;}
                &.money {
                    font-size: 14px;
                    color: @main-shouyi-color;
                }

                &.money-j {
                    color: #ef5350;
                }
            }
        }
        /*.list-item {
            display: flex;
            align-items: center;
            padding: 8px @main-padding;
            border-bottom: 1px solid @main-border-color;

            p {
                text-align: center;
                flex: 1;
                font-size: 14px;

                &.date {
                    font-size: 12px;
                    line-height: 1.2;
                }

                &.money {
                    color: @main-shouyi-color;
                }

                &.money-j {
                    color: #ef5350;
                }
            }
        }*/
    }
</style>