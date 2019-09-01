<template>
    <article class="invitelist-wrap css-pages">
        <Navhead title_name="充值记录"></Navhead>
        <div class="show_loading" ref="show_loading">
            <div ref="container" class="demo-loadmore-content">
                <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" :loaded-all="loaded_all"
                              @load="load">
                    <div class="list-item" v-for="item in Rechargelog_list">
                        <div>
                            <p class="date"><span>{{item.addtime}}</span></p>
                        </div>
                        <div>
                            <p :class="{'money-j':item.amount>=0}">充值：{{item.amount<0?'':'+'}}{{item.amount}} {{item.coin_code}}</p>
                            <div class="dte">{{item.status_text}}</div>
                        </div>
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
    import {recharge} from "@/api/wallet.js";
    import Navhead from "@/components/Navhead.vue";

    export default {
        name: "Rechargelog",
        data() {
            return {
                refreshing: false,
                loading: false,
                page: 1,
                pagesize: 15,
                loaded_all: false,
                Rechargelog_list: [],
                show_loading: null,

                userinfo: JSON.parse(localStorage.getItem('userinfo')),
                dialog: {
                    title: '',
                    content: '',
                    is_show: false
                },
            }
        },
        components: {
            Navhead
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

                recharge(params).then(res => {
                    this.show_loading.close();
                    if (isload == 'load') {
                        this.loading = false;

                        this.Rechargelog_list = this.Rechargelog_list.concat(res.data.list);

                    } else {
                        this.refreshing = false;
                        this.Rechargelog_list = res.data.list;
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

    .invitelist-wrap {
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
            padding: @main-padding;
            margin: @main-padding;
            border: 1px solid @main-border-color;
            background: #ffffff;
            box-shadow: 0 0 5px rgba(0, 0, 0, .08);

            div {
                display: flex;
                align-items: center;
                &.dte{ font-size: 14px;}
            }

            p {
                flex: 1;
                font-size: 14px;

                span {
                    font-size: 10px;
                    color: #909a9e;
                }

                &.money {
                    color: @main-shouyi-color;
                }

                &.money-j {
                    color: #ef5350;
                }
            }
        }
    }
</style>