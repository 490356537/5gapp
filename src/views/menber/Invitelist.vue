<template>
    <article class="invitelist-wrap css-pages">
        <Navhead title_name="我的邀请"></Navhead>
        <div class="show_loading" ref="show_loading">
            <div ref="container" class="demo-loadmore-content">
                <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" :loaded-all="loaded_all"
                              @load="load">
                    <div class="list-item" v-for="item in Invitelist_list">
                        <div><p><span>{{item.addtime}}</span></p></div>
                        <div><p>用户：{{item.mobile}}</p><p class="cen">uid:{{item.uid}}</p></div>
                        <!--<div class="p"><p>用户：{{item.mobile}}</p>
                            <p>uid:{{item.uid}}</p></div>
                        <p></p>-->
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
    import {team} from "@/api/member.js";
    import Navhead from "@/components/Navhead.vue";

    export default {
        name: "Invitelist",
        data() {
            return {
                refreshing: false,
                loading: false,
                page: 1,
                pagesize: 15,
                loaded_all: false,
                Invitelist_list: [],
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

            getlist(isload) {
                this.page = isload == 'load' ? ++this.page : 1;
                const params = {
                    member_id: this.userinfo.id,
                    token: this.userinfo.token,
                    page: this.page,
                    pagesize: this.pagesize
                };

                team(params).then(res => {
                    this.show_loading.close();
                    if (isload == 'load') {
                        this.loading = false;

                        this.Invitelist_list = this.Invitelist_list.concat(res.data.list);

                    } else {
                        this.refreshing = false;
                        this.Invitelist_list = res.data.list;
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
                &.cen {
                    text-align: center;
                }
            }
        }
    }
</style>