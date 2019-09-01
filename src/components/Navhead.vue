<template>
    <article class="navhead-wrap">
        <mu-ripple class="but-left" @click="click_out">
            <i class=" mu-icon color material-icons ">navigate_before</i>
        </mu-ripple>
        <p>{{title_name}}</p>
        <slot></slot>
    </article>
</template>

<script>
    export default {
        name: "Navhead",
        props:['title_name'],
        methods:{
            click_out(){
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/css/main";

    @height: 48px;
    .navhead-wrap{  height: @height; line-height: @height; font-size: 15px; border-bottom: 1px solid @main-close; text-align: center; box-shadow: 0 0 5px @main-close;
        background: @main-color; color: #ffffff; text-shadow: 1px 1px 1px rgb(58,145,216, 1); position: relative;
        .but-left{ height: @height; width: @height; line-height: @height; text-align: center; position: absolute; top:0; left:0; display: flex; align-items: center; justify-content: space-evenly;}
        i{ font-size: 22px; width: 22px; height:22px; text-align: center; line-height: 22px; display: block;}
    }
</style>