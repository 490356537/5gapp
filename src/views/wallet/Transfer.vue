<template>
    <article class="css-pages">
        <Navhead title_name="转账">
            <mu-ripple class="but-right" @click="$router.push({name:'Transferlog'})">
                <i class=" mu-icon color material-icons ">记录</i>
            </mu-ripple>
        </Navhead>

        <div class="show_loading" ref="show_loading">
            <div class="form-wrap">
                <div class="yue-box"><label>余额：</label>
                    <p>{{page_data.usable_amount}}<em>/KYXC</em></p></div>

                <mu-form ref="form_data" :model="form_data">
                    <mu-form-item label="收账账号" prop="keyword" :rules="keywordRules">
                        <mu-text-field v-model="form_data.keyword" prop="keyword"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="转账数量" prop="number" :rules="numberRules" :error-text="number_error">
                        <mu-text-field v-model="form_data.number" prop="number" type="number"></mu-text-field>
                    </mu-form-item>
                    <div class="yan-wrap">
                        <div class="yan-wrap">
                            <mu-form-item label="验证码" prop="smscode" :rules="smscodeRules">
                                <mu-text-field v-model="form_data.smscode" prop="smscode"></mu-text-field>
                            </mu-form-item>
                        </div>
                        <mu-button class="operating-item" flat color="primary" @click="getsendSms">
                            获取验证码{{isgetsmsall.miao==0?'':'('+isgetsmsall.miao+')'}}
                        </mu-button>
                    </div>
                </mu-form>
                <div class="shouxu">手续费：{{page_data.transfer_sum}} KYXC</div>
                <mu-button round large full-width color="primary" @click="potransfer">转账</mu-button>
            </div>
        </div>
        <mu-dialog :title="dialog.title" width="80%" :esc-press-close="false" :overlay-close="false"
                   :open.sync="dialog.is_show">
            {{dialog.content}}
            <mu-button slot="actions" flat color="primary" @click="show_close">确定</mu-button>
        </mu-dialog>
    </article>
</template>

<script>
    import {transfer} from "@/api/wallet.js";
    import {sendSms} from "@/api/public.js";
    import {FloatMul, FloatSub} from "@/api/delFloat.js";
    import Navhead from "@/components/Navhead.vue";

    export default {
        name: "Transfer",
        data() {
            return {
                passwd_new: '',


                page_data: {
                    usable_amount: '0.00',
                    transfer_min: 0,
                    transfer_fee: 0,
                    transfer_sum: '0.00',
                },
                form_data: {
                    keyword: '',
                    number: '',
                    smscode: '',
                },
                userinfo: JSON.parse(localStorage.getItem('userinfo')),
                dialog: {
                    title: '',
                    content: '',
                    is_show: false
                },
                isgetsmsall: {
                    timeobj: null,
                    miao: 0
                },


                number_error: '',
                numberRules: [
                    /*{validate: (val) => !!val, message: '转账数量必填'},*/
                ],

                keywordRules: [
                    {validate: (val) => !!val, message: '收账账号必填'},
                ],
                smscodeRules: [
                    {validate: (val) => !!val, message: '验证码必填'},
                ],
            }
        },
        watch: {
            'form_data.number': function (newVal, oldVal) {
                this.getsum();
            }
        },
        components: {
            Navhead
        },
        mounted() {
            this.gettransfer();
        },
        methods: {
            getsum() {
                this.number_error = '';
                if (this.form_data.number == '') {
                    this.number_error = '提币数量必填';
                } else if (FloatSub(this.form_data.number, this.page_data.transfer_min) < 0)
                    this.number_error = '转账最低额度 ' + this.page_data.transfer_min;

                if (this.form_data.number > 0 && this.page_data.transfer_fee > 0) {
                    this.page_data.transfer_sum = FloatMul(this.form_data.number, this.page_data.transfer_fee);
                } else {
                    this.page_data.transfer_sum = '0.00';
                }
            },
            getsendSms() {
                if (this.isgetsmsall.miao <= 0) {
                    const loading = this.$loading({target: this.$refs.show_loading});
                    const params = {
                        type: 3,
                        member_id: this.userinfo.id,
                        token: this.userinfo.token,
                    };
                    sendSms(params).then(res => {
                        loading.close();
                        if (res.status == 1) {
                            this.isgetsmsall.miao = 59;
                            let _this = this;
                            this.isgetsmsall.timeobj = setInterval(function () {
                                _this.isgetsmsall.miao -= 1;
                                if (_this.isgetsmsall.miao <= 0) {
                                    clearInterval(_this.isgetsmsall.timeobj)
                                }
                            }, 1000);
                        } else {
                            this.dialog.title = '提示';
                            this.dialog.content = res.msg;
                            this.dialog.is_show = true;
                        }
                    }).catch((res) => {
                        loading.close();
                        /*服务器错误执行*/
                        this.dialog.title = '错误' + res.status;
                        this.dialog.content = '请稍后再试';
                        this.dialog.is_show = true;
                    });
                }
            },
            potransfer() {
                this.$refs.form_data.validate().then((result) => {
                    this.getsum();
                    if (result && this.number_error == '') {
                        this.show_loading = this.$loading({target: this.$refs.show_loading});
                        const params = {
                            member_id: this.userinfo.id,
                            token: this.userinfo.token,
                            step: 2,
                            keyword: this.form_data.keyword,
                            number: this.form_data.number,
                            smscode: this.form_data.smscode,
                        };
                        transfer(params).then(res => {
                            this.show_loading.close();
                            if (res.status == 1) {
                                this.dialog.title = '提示';
                                this.dialog.content = '转账提交成功';
                                this.dialog.is_show = true;
                                this.form_data.keyword = '';
                                this.form_data.number = '';
                                this.form_data.smscode = '';
                            } else {
                                this.dialog.title = '提示';
                                this.dialog.content = res.msg;
                                this.dialog.is_show = true;
                            }
                        }).catch((res) => {
                            this.show_loading.close();
                            /*服务器错误执行*/
                            this.dialog.title = '错误' + res.status;
                            this.dialog.content = '请稍后再试';
                            this.dialog.is_show = true;
                        });
                    }
                })
            },
            gettransfer() {
                this.show_loading = this.$loading({target: this.$refs.show_loading});
                const params = {
                    member_id: this.userinfo.id,
                    token: this.userinfo.token,
                    step: 1
                };
                transfer(params).then(res => {
                    this.show_loading.close();
                    this.page_data.usable_amount = res.data.usable_amount;
                    this.page_data.transfer_min = res.data.transfer_min;
                    this.page_data.transfer_fee = res.data.transfer_fee;
                }).catch((res) => {
                    this.show_loading.close();
                    /*服务器错误执行*/
                    this.dialog.title = '错误' + res.status;
                    this.dialog.content = '请稍后再试';
                    this.dialog.is_show = true;
                });
            },
            show_close() {
                this.number_error = '';
                this.dialog.is_show = false;
                this.gettransfer();
            }
        }
    }
</script>

<style lang="less" scoped>

    @import "~@/assets/css/main";

    .form-wrap {
        padding: @main-padding;
        background: #ffffff;

        .yue-box {
            display: flex;
            font-size: 14px;
            align-items: center;
            color: rgba(0, 0, 0, .54);
            margin-bottom: 10px;
            border-bottom: 1px solid @main-border-color;

            p {
                flex: 1;
                color: @main-money-color;
                font-size: 30px;

                em {
                    font-style: normal;
                    font-size: 14px;
                }
            }
        }
    }

    .yan-wrap {
        display: flex;
        align-items: center;

        .flex01 {
            flex: 1;
        }
    }

    @height: 48px;
    .but-right {
        height: @height;
        width: @height;
        line-height: @height;
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        i {
            font-size: 12px;
            width: 22px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            display: block;
        }
    }

    .shouxu {
        font-size: 14px;
        color: rgba(0, 0, 0, .54);
        margin-bottom: 20px;
    }

</style>