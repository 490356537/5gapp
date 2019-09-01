<template>
    <article class="css-pages view-wrap">
        <!--<transition :duration="transition_duration" :name="transition_name">-->
            <router-view class="view-box"/>
        <!--</transition>-->
        <Navigation/>
    </article>
</template>

<script>
    import Navigation from "@/components/Navigation.vue";

    export default {
        name: "OnePages",
        components: {
            Navigation
        },
        computed: {
            transition_name() {
                return 'page-' + this.$store.state.transition_params.name;
            },
            transition_duration() {
                return this.$store.state.transition_params.duration;
            },
        }
    }
</script>


<style lang="less" scoped>
    .page-out-enter-active,
    .page-out-leave-active,
    .page-in-enter-active,
    .page-in-leave-active {
        will-change: transform;
        transition: all 200ms;
        height: 100%;
        position: absolute;
        backface-visibility: hidden;
        perspective: 1000;
    }

    .page-out-enter {
        transform: translate3d(-100%, 0, 0);
    }

    .page-out-leave-active {
        transform: translate3d(100%, 0, 0);
    }

    .page-in-enter {
        transform: translate3d(100%, 0, 0);
    }

    .page-in-leave-active {
        transform: translate3d(-100%, 0, 0);
    }

    .view-wrap{ display: flex; flex-direction: column;
        .view-box{ flex: 1;}
    }
</style>