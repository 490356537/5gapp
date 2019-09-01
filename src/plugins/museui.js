import Vue from 'vue';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import Loading from 'muse-ui-loading';
import 'muse-ui-loading/dist/muse-ui-loading.css';
import "../assets/fonticon/musefonticon.css";

Vue.use(MuseUI);
Vue.use(Loading,{
    size: null
});