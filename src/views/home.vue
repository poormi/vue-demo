<template>
    <section class="main-wrap w home-wrap">
        <div class="main-middle w">
            <div class="main-top">
                <div v-if="proms.length>0" class="main-list-wrap fl">
                    <ul id="list" class="main-list" :style="{ width: proms.length * 225+'px'}">
                        <li :class="['item fl',{'cur': params.activeId && params.activeId == item.ACTCODE || !params.activeId && item.STATUS == 1,'first': index == 0,'last':index==4}]"
                            v-for="(item,index) in proms" v-on:click="changePrm(index,item)">
                            <a class="item-wrap" href="javascript:">
                                <div class="item-shadow"></div>
                                <h3 class="item-name">
                                    {{item.ACTNAME}}
                                </h3></a>
                            <div class="item-tips">
                                <i class="triangle"></i>
                                <p class="white"><i class="pre">列表</i>{{item.beginDate}}-{{item.endDate}}</p>
                                <p class="white"><i class="act">其他</i>{{item.otherBeginDate}}-{{item.otherEndDate
                                }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-if="proms.length>0" id="cutBtn" class="main-btn fl" :data-index="currentIndex">
                    <a href="javascript:;" class="before on" :class="{'off': currentProm.ACTCODE == proms[0].ACTCODE}"
                       @click="prevPrm">
                        <span class="br xiaoyu"></span>
                    </a>
                    <a href="javascript:;"
                       :class="['next on',{'off':proms.length<=1 || currentProm.ACTCODE == proms[proms.length-1].ACTCODE}]"
                       @click="nextPrm">
                        <span class="br dayu"></span>
                    </a>
                </div>
            </div>
            <div class="tab-sec">
                <ul id="tabList" class="tab-list clearfix">
                    <router-link to="/list" active-class="cur" tag="li">
                        <a class="tab-item" data-isload="true" href="javascript:;">列表</a>
                    </router-link>
                </ul>
            </div>
            <keep-alive>
                <router-view :currentProm="currentProm" :default="params" class="content-wrap"></router-view>
            </keep-alive>
        </div>
    </section>
</template>
<script>
    import $ from 'jquery'
    import {
        mapGetters
    } from 'vuex'

    const maxDisplay = 5

    export default {
        data() {
            return {
                maxDisplay: 5,
                initProm: null,
                currentIndex: 0
            }
        },
        computed: Object.assign({
            currentProm: {
                get() {
                    if (this.initProm) return this.initProm
                    else {
                        const _this = this;
                        let result = null;
                        _this.proms.map((item, index) => {
                            if (item.STATUS == 1) result = item, _this.currentIndex = index;
                        });
                        return result;
                    }
                },
                set(newVal) {
                    this.initProm = newVal;
                }
            }
        }, mapGetters({
            proms: 'getPromData',
            params: 'getDefaultData'
        })),
        methods: {
            setPrm(item) {
                this.currentProm = item;
                //过期大促节点默认显示活动数据
                if (!item.STATUS || this.params.flag)
                    this.$router.push('/list')
                else {
                    this.$router.push('/other')
                }
            },
            changePrm(index, item) {
                const $t = $(event.currentTarget),
                    $b = $('#cutBtn'),
                    $l = $('#list')
                if (!$t.hasClass('cur')) {
                    if (index == 0) {
                        $b.find('.before').addClass('off');
                        $b.find('.next').removeClass('off');
                    } else if (index == $l.children().length - 1) {
                        $b.find('.next').addClass('off');
                        $b.find('.before').removeClass('off');
                    } else $b.children().removeClass('off');
                    $t.parent().find('.cur').removeClass('cur');
                    $t.addClass('cur');
                    $b.attr('data-index', index);
                    this.setPrm(item);
                }
            },
            nextPrm() {
                const $t = $(event.currentTarget),
                    $el = $t.parent(),
                    $l = $('#list'),
                    $c = $l.children();
                if ($t.hasClass('off')) {
                    return;
                }
                let index = $el.attr('data-index') - 0 + 1;
                $el.attr('data-index', index);
                $($c[index]).prev().removeClass('cur').end().addClass('cur');
                if (index >= maxDisplay) {
                    $l.css({
                        '-webkit-transform': 'translate3d(' + (maxDisplay - index - 1) * width + 'px,0,0)'
                    })
                    $el.attr('data-count', index - maxDisplay);
                }
                index == 1 && $el.find('.before').removeClass('off');
                $c.length - 1 == index && $t.addClass('off');
                if (index >= maxDisplay) {
                    $c.eq(index - 1).removeClass('last');
                    setTimeout(function () {
                        $c.eq(index - maxDisplay - 1).addClass('first')
                    }, 1000);
                    $c.eq(index).addClass('last');
                }
                this.setPrm(this.proms[index]);
            },
            prevPrm() {
                const $t = $(event.currentTarget),
                    $el = $t.parent(), //字符转整型
                    count = $el.attr('data-count'),
                    $l = $('#list'),
                    $c = $l.children();
                let index = $el.attr('data-index') - 0
                if ($t.hasClass('off')) {
                    return;
                }
                index = Number(index) - 1;
                $el.attr('data-index', index);
                $($c[index]).next().removeClass('cur').end().addClass('cur')
                index <= count && $elList.css({
                    '-webkit-transform': 'translate3d(' + (-1) * (count) * width + 'px,0,0)'
                }) && $el.attr('data-count', count - 1);
                0 == index && $t.addClass('off');
                $el.find('.next').removeClass('off');
                if (index - 1 <= count) {
                    $c.eq(index).addClass('first');
                    $c.eq(index + 1).removeClass('first');
                    $l.find('.last').removeClass('last');
                    setTimeout(function () {
                        $c.eq(index + maxDisplay - 1).addClass('last');
                    }, 1000);
                }
                this.setPrm(this.proms[index]);
            }
        },
        watch: {
            params(data, oldData) {
                if (data && !data.actFlag) {
                    this.$router.push('/list')
                } else {
                    this.$router.push('/other')
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                document.body.className = 'main';
            })
        },
        beforeMount() {
            this.$store.dispatch('fetchData', '/api/data')
            this.$parent.menu = '005'
        }
    }
</script>
