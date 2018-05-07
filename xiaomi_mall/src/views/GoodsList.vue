<template>
<div>
	<nav-header></nav-header>
	<nav-bread>
		<span slot>123</span>
	</nav-bread>
	<div class="accessory-result-page accessory-page">
		<div class="container">
			<div class="filter-nav">
				<span class="sortby">Sort by:</span>
				<a href="javascript:void(0)" class="default cur">Default</a>
				<a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
				<a href="javascript:void(0)" class="filterby stopPop" @click="show_filter_pop">Filter by</a>
			</div>
			<div class="accessory-result">
				<!-- filter -->
    				<div class="filter stopPop" id="filter" :class="{'filterby-show': priceFilterBy}">
					<dl class="filter-price">
						<dt>Price:</dt>
						<dd><a href="javascript:void(0)"  @click="priceCheck = 'all'" :class="{'cur':priceCheck == 'all' }">All</a></dd>
						<dd v-for="item,index in priceFilter">
							<a href="javascript:void(0)" :class="{'cur':priceCheck == index }" @click="setPriceFilter(index)">{{item.startPrice}} - {{item.endPrice}}</a>
						</dd>
					</dl>
				</div>

				<!-- search result accessories list -->
				<div class="accessory-list-wrap">
					<div class="accessory-list col-4">
						<ul>
							<li v-for="item in goodslist">
								<div class="pic">
									<a href="#"><img v-lazy="'/static/' + item.productImage"></a>
								</div>
								<div class="main">
									<div class="name">{{item.productName}}</div>
									<div class="price">{{item.prodcutPrice}}</div>
									<div class="btn-area">
										<a href="javascript:;" class="btn btn--m">加入购物车</a>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
    <div class="md-overlay" v-show="priceOverLay" @click.stop="closePop"></div>
	<nav-footer></nav-footer>
</div>
</template>

<script>
import axios from 'axios'
import '@/assets/css/base.css'
import '@/assets/css/product.css'
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import NavBread from '@/components/NavBread'

export default {
	data() {
		return {
            goodslist: [],
            priceFilter: [
                {
                    startPrice: '0.00',
                    endPrice: '500.00'
                },
                {
                    startPrice: '500.00',
                    endPrice: '1000.00'
                },
                {
                    startPrice: '1000.00',
                    endPrice: '2000.00'
                },
                {
                    startPrice: '2000.00',
                    endPrice: '3000.00'
                }
            ],
            priceCheck: 'all',
            priceFilterBy: false,
            priceOverLay: false
        }
	},
	mounted() {
		this.get_goodslist();
	},
	methods: {
		get_goodslist() {
            let _this = this;
			axios({
				method: 'get',
				url: '/api/goods'
			}).then(function(res) {
				console.log(res);
                _this.goodslist = res.data.result.list
            })
		},
        show_filter_pop() {
            this.priceFilterBy = true;
            this.priceOverLay = true;
        },
        closePop() {
            this.priceFilterBy = false;
            this.priceOverLay = false;
        },
        setPriceFilter(index) {
            this.priceCheck = index;
            this.closePop();
        }
	},
	components: {
		NavHeader,
		NavFooter,
		NavBread
	}
}
</script>

<style>
</style>
