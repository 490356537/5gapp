<template>
    <nav class="nav-wrap">
        <mu-paper class="nav-box" :z-depth="2">
            <mu-ripple class="nav-item" :class="{on:router_name=='Home_index'}" @click="tabbar_click('Home_index',0)">
                <div>
                    <p>
                        <mu-icon left value="home"></mu-icon>
                    </p>
                    <span>首页</span>
                </div>
            </mu-ripple>
            <mu-ripple class="nav-item" :class="{on:router_name=='Game_index'}" @click="tabbar_click('Game_index',1)">
                <div>
                    <p>
                        <mu-icon value="monetization_on"></mu-icon>
                    </p>
                    <span>分红</span>
                </div>
            </mu-ripple>
            <mu-ripple class="nav-item" :class="{on:router_name=='Wallet_index'}" @click="tabbar_click('Wallet_index',2)">
                <div>
                    <p>
                        <mu-icon value="account_balance_wallet"></mu-icon>
                    </p>
                    <span>钱包</span>
                </div>
            </mu-ripple>
            <mu-ripple class="nav-item" :class="{on:router_name=='Menber_index'}" @click="tabbar_click('Menber_index',3)">
                <div>
                    <p class="i-da">
                        <mu-icon value="person"></mu-icon>
                    </p>
                    <span>我的</span>
                </div>
            </mu-ripple>
        </mu-paper>
    </nav>
</template>

<script>
    export default {
        name: "Navigation",
        data(){
            return{
                router_name: ''
            }
        },
        props: {
            msg: String
        },
        methods: {
            tabbar_click(router_name,index) {
                this.$router.replace({name: router_name});
                //this.nav_index = index;
                /*this.router_name = this.$store.state.transition_params.router_log[this.$store.state.transition_params.router_log.length-1];
                console.log(this.router_name);*/
            }
        },
        watch: {
            $route() {
                this.router_name = this.$route.name;
            }
        },
        created() {
            this.router_name = this.$route.name;
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/css/main";

    @main-height: 56px;

    .nav-wrap {
        height: @main-height;
    }

    .nav-box {
        display: flex;
        width: 100%;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;

        .nav-item {
            flex: 1;
            height: @main-height;;
            text-align: center;
            display: flex;
            align-items: center;
            position: relative;

            div {
                flex: 1;
            }

            i {
                color: #ffffff;
                font-size: 16px;
                line-height: 20px;
            }

            p {
                background: @main-color-gray;
                width: 20px;
                height: 20px;
                text-align: center;
                margin: 8px auto 3px;
                border-radius: 2px;
                transition: background .2s;

                &.i-da {
                    i {
                        font-size: 18px;
                    }
                }
            }

            span {
                display: block;
                color: @main-color-gray;
                font-size: 12px;
                transition: color .2s;
            }

            &.on {
                p {
                    background: @main-color;
                }

                span {
                    color: @main-color;
                }
            }
        }
    }
</style>