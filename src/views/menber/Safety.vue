<template>
    <article class="css-pages">
        <Navhead title_name="安全设置"></Navhead>
        <div class="list-wrap">
            <mu-ripple class="list-item border" @click="$router.push({name:'Uppasswd'})">
                <i class=" mu-icon material-icons ">lock</i>
                <p>修改登录密码</p>
                <i class=" mu-icon color material-icons ">navigate_next</i>
            </mu-ripple>
            <!--<mu-ripple class="list-item border" @click="$router.push({ name: 'Uppasswd', query: { type: 2 }})">
                <i class=" mu-icon material-icons ">lock</i>
                <p>修改支付密码</p>
                <i class=" mu-icon color material-icons ">navigate_next</i>
            </mu-ripple>-->
        </div>
    </article>
</template>

<script>
    import Navhead from "@/components/Navhead.vue";

    export default {
        name: "Safety",
        components: {
            Navhead
        },
    }
</script>

<style lang="less" scoped>

    @import "~@/assets/css/main";

    .list-wrap {
        background: #ffffff;
        padding: 10px 0;

        .list-item {
            display: flex;
            align-items: center;
            position: relative;
            padding: 15px @main-padding;

            i {
                width: 24px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                font-size: 22px;
                color: @main-color-gray;

                &.color {
                    color: #96a5ad;
                }

                &.te {
                    font-size: 24px;
                }
            }

            p {
                margin: 0 5px;
                flex: 1;
                font-size: 14px;
            }

            &.border:after {
                height: 0;
                border-bottom: 1px solid @main-border-color;
                position: absolute;
                right: 0;
                left: 39px;
                bottom: 0;
                display: block;
                content: ' ';
            }
        }
    }

</style>