<template>
    <article class="css-pages">
        <Navhead title_name="VIP升级"></Navhead>
        <div class="show_loading" ref="show_loading"><!--:style="{backgroundImage:'url(' + item.image_url + ')'}"-->
            <mu-ripple v-for="item in Upgrade_data.list" class="upgrade-item" color="red50" :opacity="0.5"
                       :style="{backgroundImage:'url(' + item.image_url + ')'}"
                       @click="onshow(item.level_name,item.coin_number,item.level)">
                <i class=" mu-icon te material-icons ">group_add</i>
                <p>{{item.level_name}}</p>
                <span>充值{{item.coin_number}}个KYXC成为{{item.level_name}}</span>
            </mu-ripple>
        </div>

        <mu-dialog :title="dialog.title" width="80%" :esc-press-close="false" :overlay-close="false"
                   :open.sync="dialog.is_show">
            {{dialog.content}}
            <mu-button slot="actions" flat color="blueGrey200" @click="dialog.is_show=false"
                       v-show="Upgrade_data.onlevel">关闭
            </mu-button>
            <mu-button slot="actions" flat color="primary" @click="getinfo" v-if="Upgrade_data.onlevel">确定</mu-button>
            <mu-button slot="actions" flat color="primary" @click="dialog.is_show=false" v-else>确定</mu-button>
        </mu-dialog>
    </article>
</template>

<script>
    import {upgrade} from "@/api/wallet.js";
    import Navhead from "@/components/Navhead.vue";

    export default {
        name: "Upgrade",
        data() {
            return {
                Upgrade_data: {
                    list: [],
                    onlevel: null
                },


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
            getinfo(isget) {
                this.dialog.is_show = false;
                const loading = this.$loading({target: this.$refs.show_loading});
                let params = {
                    member_id: this.userinfo.id,
                    token: this.userinfo.token,
                    step: isget == 'get' ? 1 : 2,
                };
                if (isget != 'get') {
                    params.level = this.Upgrade_data.onlevel;
                }

                upgrade(params).then(res => {
                    loading.close();
                    if (isget == 'get') {
                        this.Upgrade_data.list = res.data.config;
                    } else {
                        this.dialog.is_show = false;
                        this.Upgrade_data.onlevel = null;
                        /*服务器错误执行*/
                        this.dialog.title = '提示';
                        this.dialog.content = res.status == 0 ? res.msg : '恭喜！升级成功';
                        this.dialog.is_show = true;
                    }
                }).catch((res) => {
                    loading.close();
                    this.Upgrade_data.onlevel = null;
                    /*服务器错误执行*/
                    this.dialog.title = '错误' + res.status;
                    this.dialog.content = '请稍后再试';
                    this.dialog.is_show = true;
                });
            },
            onshow(level_name, coin_number, level) {
                this.Upgrade_data.onlevel = level;
                this.dialog.title = level_name;
                this.dialog.content = '是否扣除' + coin_number + 'KYXC升级为' + level_name + '？';
                this.dialog.is_show = true;
            }
        },
        mounted() {
            this.getinfo('get');
        }
    }
</script>

<style lang="less" scoped>

    @import "~@/assets/css/main";

    .upgrade-item {
        //background: linear-gradient(to bottom right, #2196f3, #0d47a1);
        border: 1px solid @main-border-color;
        border-radius: 6px;
        margin: @main-padding;
        box-shadow: 0 0 10px rgba(128, 126, 123, 0.75);
        padding: 30px 0;
        position: relative;
        overflow: hidden;
        background-size: cover; background-repeat: no-repeat; background-position: center;

        i {
            color: #ffffff;
            opacity: .1;
            width: 100px;
            height: 100px;
            line-height: 100px;
            font-size: 100px;
            position: absolute;
            top: 0;
            right: 20px;
        }

        &.back02 {
            background: linear-gradient(to bottom right, #ffca28, #ff6d00);

            p {
                text-shadow: 1px 1px 1px #b36a45;
            }

            span {
                text-shadow: 1px 1px 1px #b36a45;
            }
        }

        &.back03 {
            background: linear-gradient(to bottom right, #ab47bc, #4a148c);

            p {
                text-shadow: 1px 1px 1px #23013e;
            }

            span {
                text-shadow: 1px 1px 1px #23013e;
            }
        }

        p {
            color: #ffffff;
            font-size: 16px;
            text-align: center;
            text-shadow: 1px 1px 1px #294594;
        }

        span {
            color: #ffffff;
            display: block;
            font-size: 14px;
            text-align: center;
            text-shadow: 1px 1px 1px #294594;
        }
    }

</style>