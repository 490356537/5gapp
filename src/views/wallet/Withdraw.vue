<template>
    <article class="css-pages">
        <Navhead title_name="提币">
            <mu-ripple class="but-right" @click="$router.push({name:'Withdrawlog'})">
                <i class=" mu-icon color material-icons ">记录</i>
            </mu-ripple>
        </Navhead>
        <div class="show_loading" ref="show_loading">
            <div class="form-wrap">
                <div class="yue-box"><label>余额：</label>
                    <p>{{page_data.usable_amount}}<em v-if="form_data.coin_code!=''">/{{form_data.coin_code}}</em></p>
                </div>
                <mu-form ref="form_data" :model="form_data">
                    <mu-form-item label="提币币种" prop="coin_code" :rules="coin_codeRules">
                        <mu-select filterable v-model="form_data.coin_code" full-width>
                            <mu-option v-for="city in citys" :key="city.coin_code" :label="city.coin_name"
                                       :value="city.coin_code"></mu-option>
                        </mu-select>
                    </mu-form-item>
                    <mu-form-item label="提币地址" prop="coin_address" :rules="coin_addressRules">
                        <mu-text-field v-model="form_data.coin_address" prop="coin_address"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="提币数量" prop="number" :rules="numberRules" :error-text="number_error">
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
                <div class="shouxu">手续费：{{page_data.withdraw_sum}} {{form_data.coin_code}}</div>
                <mu-button round large full-width color="primary" @click="powithdraw">提币</mu-button>
            </div>
        </div>
        <mu-dialog :title="dialog.title" width="80%" :esc-press-close="false" :overlay-close="false"
                   :open.sync="dialog.is_show">
            {{dialog.content}}
            <!--<mu-button slot="actions" flat color="blueGrey200" @click="dialog.is_show=false"
                       v-show="Upgrade_data.onlevel">关闭
            </mu-button>
            <mu-button slot="actions" flat color="primary" @click="getinfo" v-if="Upgrade_data.onlevel">确定</mu-button>-->
            <mu-button slot="actions" flat color="primary" @click="dialog.is_show=false">确定</mu-button>
        </mu-dialog>
    </article>
</template>

<script>
    import {withdraw} from "@/api/wallet.js";
    import {sendSms} from "@/api/public.js";
    import {FloatMul, FloatSub} from "@/api/delFloat.js";
    import Navhead from "@/components/Navhead.vue";

    export default {
        name: "Withdraw",
        data() {
            return {
                passwd_new: '',

                citys: [],
                page_data: {
                    usable_amount: '0.00',
                    withdraw_min: 0,
                    withdraw_fee: 0,
                    withdraw_sum: '0.00',
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
                form_data: {
                    coin_code: '',
                    coin_address: '',
                    number: '',
                    smscode: '',
                },
                smscodeRules: [
                    {validate: (val) => !!val, message: '验证码必填'},
                ],
                number_error: '',
                numberRules: [
                    /*{validate: (val) => !!val, message: '提币数量必填'},*/
                ],

                coin_addressRules: [
                    {validate: (val) => !!val, message: '提币地址必填'},
                ],
                coin_codeRules: [
                    {validate: (val) => !!val, message: '提币币种必填'},
                ],
            }
        },
        watch: {
            'form_data.coin_code': function (newVal, oldVal) {
                for (let i in this.citys) {
                    if (this.citys[i].coin_code == newVal) {
                        this.page_data.usable_amount = this.citys[i].usable_amount;
                        this.page_data.withdraw_min = this.citys[i].withdraw_min;
                        this.page_data.withdraw_fee = this.citys[i].withdraw_fee;
                    }
                }
                this.getsum();
            },
            'form_data.number': function (newVal, oldVal) {
                this.getsum();
            },
        },
        components: {
            Navhead
        },
        mounted() {
            this.show_loading = this.$loading({target: this.$refs.show_loading});
            const params = {
                member_id: this.userinfo.id,
                token: this.userinfo.token,
                step: 1
            };
            withdraw(params).then(res => {
                this.show_loading.close();
                this.citys = res.data.coin;
            }).catch((res) => {
                this.show_loading.close();
                /*服务器错误执行*/
                this.dialog.title = '错误' + res.status;
                this.dialog.content = '请稍后再试';
                this.dialog.is_show = true;
            });
        },
        methods: {
            getsum() {
                this.number_error = '';
                if (this.form_data.number == '') {
                    this.number_error = '提币数量必填';
                } else if (FloatSub(this.form_data.number, this.page_data.withdraw_min) < 0)
                    this.number_error = this.form_data.coin_code + '提币最低额度' + this.page_data.withdraw_min;

                if (this.form_data.number > 0 && this.page_data.withdraw_fee > 0) {
                    this.page_data.withdraw_sum = FloatMul(this.form_data.number, this.page_data.withdraw_fee);
                } else {
                    this.page_data.withdraw_sum = '0.00';
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
            powithdraw() {
                this.$refs.form_data.validate().then((result) => {
                    this.getsum();
                    if (result && this.number_error == '') {
                        this.show_loading = this.$loading({target: this.$refs.show_loading});
                        const params = {
                            member_id: this.userinfo.id,
                            token: this.userinfo.token,
                            step: 2,
                            coin_code: this.form_data.coin_code,
                            coin_address: this.form_data.coin_address,
                            number: this.form_data.number,
                            smscode: this.form_data.smscode,
                        };
                        withdraw(params).then(res => {
                            this.show_loading.close();
                            if (res.status == 1) {
                                this.dialog.title = '提示';
                                this.dialog.content = '提币提交成功';
                                this.dialog.is_show = true;
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