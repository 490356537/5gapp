<template>
    <article class="css-pages">
        <div class="show_loading" ref="show_loading">
            <mu-carousel hide-controls class="banner-wrap" interval="6000">
                <mu-carousel-item v-for="item in home_all.banner">
                    <img :src="item.image_url">
                </mu-carousel-item>
            </mu-carousel>
            <div class="home-safety">
                <div class="flex-wrap">
                    <div class="title-wrap"><span>我的资产</span></div>
                    <div class="money-wrap flex-item">{{home_all.account.usable_amount}}<em>/KYXC</em></div>
                </div>
            </div>
            <div class="home-safety no-border">
                <div class="title-wrap no-border"><span>票数</span></div>
                <mu-text-field class="update-input" v-model="coin_number" type="number" prefix=' ' readonly
                               suffix="KYXC"></mu-text-field>
            </div>
            <div class="home-safety no-border css-pages-flex1">
                <div class="piao-wrap">
                    <div class="piao-item" :style="{backgroundImage:'url(' + item.image_url + ')'}"
                         v-for="item in home_all.voting" :class="{on:piao_index==item.id}"
                         @click="piao_index=item.id;coin_number=item.coin_number;post_votes=item.votes"><p>
                        {{item.votes}}票</p></div>
                </div>
                <mu-button class="but-tijiao" full-width color="primary" @click="openAlertDialog" large>投票</mu-button>

                <mu-dialog :title="toupiao_dialog.title" width="80%" :esc-press-close="false" :overlay-close="false"
                           :open.sync="openAlert">
                    {{toupiao_dialog.content}}
                    <mu-button slot="actions" flat color="blueGrey200" @click="openAlert = false">关闭</mu-button>
                    <mu-button slot="actions" flat color="primary" @click="poststartgame" v-if="post_votes">确定
                    </mu-button>
                </mu-dialog>
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
    import {index, startgame} from "@/api/home.js";

    export default {
        name: "Index",
        data() {
            return {
                coin_number: '',
                piao_index: null,
                openAlert: false,
                show_loading: null,

                post_votes: null,
                toupiao_dialog: {
                    title: '',
                    content: '',
                },


                userinfo: JSON.parse(localStorage.getItem('userinfo')),
                dialog: {
                    title: '',
                    content: '',
                    is_show: false
                },
                home_all: {
                    banner: [],
                    account: {usable_amount: '0.00'},
                    voting: []
                }
            }
        },
        created(){
            if (!localStorage.getItem('userinfo')) {
                this.$router.replace({name:'Login'});
            }
        },
        mounted() {
            this.show_loading = this.$loading({target: this.$refs.show_loading});
            const params = {
                member_id: this.userinfo.id,
                token: this.userinfo.token,
            };

            index(params).then(res => {
                this.show_loading.close();
                this.home_all = res.data;
            }).catch((res) => {
                this.show_loading.close();
                /*服务器错误执行*/
                this.dialog.title = '错误' + res.status;
                this.dialog.content = '请稍后再试';
                this.dialog.is_show = true;
            });
        },
        components: {
            //Navigation
        },
        methods: {
            openAlertDialog() {
                if (this.post_votes) {
                    this.toupiao_dialog.title = '投票';
                    this.toupiao_dialog.content = '是否投' + this.post_votes + '票,共' + this.coin_number + 'KYXC';
                } else {
                    this.toupiao_dialog.title = '提示';
                    this.toupiao_dialog.content = '请选择投票档位';
                }
                this.openAlert = true;
            },

            poststartgame() {
                this.openAlert = false;
                const loading = this.$loading();
                const params = {
                    member_id: this.userinfo.id,
                    token: this.userinfo.token,
                    votes_id: this.piao_index,
                };

                startgame(params).then(res => {
                    loading.close();
                    if(res.status==1) {
                        this.coin_number = '';
                        this.piao_index = null;
                        this.dialog.title = '提示';
                        this.dialog.content = '投票成功';
                        this.dialog.is_show = true;
                    }else{
                        this.dialog.title = '提示';
                        this.dialog.content = res.msg;
                        this.dialog.is_show = true;
                    }
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

    .css-pages {
        background: #ffffff;
        height: 100%;
        overflow: auto;
        display: flex;
        flex-direction: column;

        .css-pages-flex1 {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
        }
    }

    .home-safety {
        padding: 0 @main-padding;
        background: #ffffff;
        border-bottom: 10px solid #f5f5f5;

        &.no-border {
            border: none;
        }

        .flex-wrap {
            display: flex;
            align-items: center;

            .flex-item {
                flex: 1;
            }
        }
    }

    .title-wrap {
        padding: 13px 0 10px;
        background: #ffffff;

        span {
            padding-left: 5px;
            border-left: 2.5px solid @main-color;
            color: @main-title-color;
            font-size: 15px;
            line-height: 15px;
            display: block;
        }

        &.no-border {
            border: none;
            padding-bottom: 0;
        }
    }

    .money-wrap {
        font-size: 36px;
        color: @main-money-color;
        background: #ffffff;
        padding: 5px 0;
        margin-left: 10px;

        em {
            font-size: 15px;
            color: @main-title-color;
            font-style: normal;
            margin-left: 5px;
        }
    }

    .banner-wrap {
        height: 178px;

        img {
            height: 100%;
        }
    }

    .update-input {
        margin: 10px auto 0;
        display: block;
        text-align: center;
        /*.mu-text-field-input{ text-align: center; background: red;}
        .mu-input-suffix-text{color: @main-money-unit;}*/
    }

    .piao-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        margin-bottom: 10px;

        .piao-item {
            border: 1px solid @main-border-color;
            color: #ffffff;
            border-radius: 6px;
            width: 24%;
            height: 60px;
            line-height: 60px;
            text-align: center;
            margin: 5px 1% 0 0;
            position: relative;
            overflow: hidden;
            font-size: 15px;
            transition: .2s;
            .main-back-img01();

            &.on {
                p {
                    background: rgba(251, 122, 10, 0.7)
                }
            }

            &.back02 {
                .main-back-img02();
            }

            &.back03 {
                .main-back-img03();
            }

            &.back04 {
                .main-back-img04();
            }

            p {
                width: 100%;
                transition: .2s;
                height: 100%;
                background: rgba(0, 0, 0, .35);
            }
        }
    }

    .but-tijiao {
        margin-bottom: 20px;
    }

    .but-post {
        border: 1px solid #2196f3
    }
</style>