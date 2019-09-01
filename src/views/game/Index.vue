<template>
    <article class="css-pages">
        <div class="top-title">分红</div>
        <div class="show_loading" ref="show_loading">
            <div class="date-wrap">
                <div class="date-box">
                    <span class="span">分红倒计时</span>
                    <p><em>{{timeall.shi}}</em>:<em>{{timeall.fen}}</em>:<em>{{timeall.miao}}</em></p>
                </div>
            </div>
            <div class="back-wrap">
                <div class="title">奖池金额（KYXC）</div>
                <div class="money">{{game.info.bonus_pools}}</div>
                <div class="flex-wrap">
                    <div class="flex-item">
                        <em>{{game.info.total_amount}}</em>
                        <p>我的投票/KYXC</p>
                    </div>
                    <div class="flex-item border">
                        <em class="shouyi">{{game.info.total_repay_amount}}</em>
                        <p>收益总额/KYXC</p>
                    </div>
                </div>
            </div>
            <div class="date-wrap border">
                <div class="date-box">
                    <span class="span flex01">投票记录</span>
                </div>
            </div>

            <div ref="container" class="demo-loadmore-content">
                <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" :loaded-all="loaded_all"
                              @load="load">
                    <div class="list-item" v-for="item in game.list"><p class="date">{{item.addtime}}</p>
                        <p>{{item.votes}}票</p>
                        <p class="money">{{item.repay_amount}}KYXC</p>
                        <p>{{item.status}}</p>
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
    import {game} from "@/api/game.js";

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
                timeall: {
                    timeobj: null,
                    shi: '00',
                    fen: '00',
                    miao: '00',
                },

                game: {
                    info: {
                        bonus_pools: '0.00',
                        total_amount: '0.00',
                        total_repay_amount: '0.00'
                    },
                    list: []
                }
            }
        },
        mounted() {
            this.show_loading = this.$loading({target: this.$refs.show_loading});
            this.getlist();
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
            time(time_str) {
                const strs=time_str.split("-");
                this.timeall.shi = strs[0];
                this.timeall.fen = strs[1];
                this.timeall.miao =  strs[2];
                let _this = this;
                this.timeall.timeobj = setInterval(function () {
                    if (_this.timeall.miao > 0)
                        _this.timeall.miao--;
                    else if (_this.timeall.fen > 0) {
                        _this.timeall.miao = 59;
                        _this.timeall.fen--;
                    } else if (_this.timeall.shi > 0) {
                        _this.timeall.miao = 59;
                        _this.timeall.fen = 59;
                        _this.timeall.shi--
                    } else {
                        clearInterval(_this.timeall.timeobj);
                        _this.timeall.miao = '00';
                        _this.timeall.fen = '00';
                        _this.timeall.shi = '00';
                    }
                }, 1000);
            },

            getlist(isload) {
                this.page = isload == 'load' ? ++this.page : 1;
                const params = {
                    member_id: this.userinfo.id,
                    token: this.userinfo.token,
                    page: this.page,
                    pagesize: this.pagesize
                };

                game(params).then(res => {
                    this.show_loading.close();
                    if (isload == 'load') {
                        this.loading = false;

                        this.game.info = res.data.info;
                        this.game.list = this.game.list.concat(res.data.list);
                    } else {
                        this.time(res.data.info.countdown.time_str);
                        this.refreshing = false;
                        this.game.info = res.data.info;
                        this.game.list = res.data.list;
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
        position: relative;
        z-index: 1;
        text-shadow: 1px 1px 1px rgba(207, 216, 220, 0.2);
    }

    .date-wrap {
        padding: 0 @main-padding;
        background: #ffffff;
        border-bottom: 1px solid @main-border-color;

        &.border {
            border-top: 1px solid @main-border-color;
        }

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

            p {
                font-size: 17px;
                margin-left: 15px;
                display: flex;
                align-items: center;

                em {
                    border: 1px solid @main-border-color;
                    border-radius: 6px;
                    width: 40px;
                    height: 40px;
                    line-height: 40px;
                    font-style: normal;
                    text-align: center;
                    box-sizing: border-box;
                }
            }

            .more {
                position: relative;
                padding: 5px 0 5px 10px;
                color: @main-close;

                i {
                    font-size: 15px;
                    width: 15px;
                    height: 15px;
                    line-height: 15px;
                    float: right;
                }
            }
        }
    }

    .back-wrap {
        margin: @main-padding;
        background: #ffffff;
        border: 1px solid @main-border-color;
        border-radius: 2px;
        padding: 5px 0 15px;

        .title {
            text-align: center;
            font-size: 15px;
            margin: 10px 0;
        }

        .money {
            text-align: center;
            font-size: 36px;
            color: @main-money-color;
            margin-bottom: 10px;
        }

        .flex-wrap {
            display: flex;
            width: 100%;

            .flex-item {
                flex: 1;
                position: relative;

                em {
                    font-size: 20px;
                    font-style: normal;
                    display: block;
                    text-align: center;

                    &.touzi {
                        color: @main-close;
                    }

                    &.shouyi {
                        color: @main-shouyi-color;
                    }
                }

                p {
                    font-style: 14px;
                    text-align: center;
                }

                &.border:after {
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

    .css-pages {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .demo-loadmore-content {
        background: #ffffff;
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;

        .list-item {
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
                    color: @main-money-color;
                }
            }
        }
    }
</style>