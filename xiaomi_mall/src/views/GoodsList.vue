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
					<a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
					<a href="javascript:void(0)" class="filterby stopPop" @click="show_filter_pop">Filter by</a>
				</div>
				<div class="accessory-result">
					<!-- filter -->
					<div class="filter stopPop" id="filter" :class="{'filterby-show': priceFilterBy}">
						<dl class="filter-price">
							<dt>Price:</dt>
							<dd><a href="javascript:void(0)" @click="priceCheck = 'all'" :class="{'cur':priceCheck == 'all' }">All</a></dd>
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
										<div class="price">{{item.salePrice}}</div>
										<div class="btn-area" @click="addcart(item.productId)">
											<a href="javascript:;" class="btn btn--m">加入购物车</a>
										</div>
									</div>
								</li>
							</ul>
							<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" class="loadMore">
								<img src="../assets/loading-spin.svg" alt="" v-show="loading">
							</div>
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
			priceFilter: [{
					startPrice: '0.00',
					endPrice: '100.00'
				},
				{
					startPrice: '100.00',
					endPrice: '500.00'
				},
				{
					startPrice: '500.00',
					endPrice: '1500.00'
				},
				{
					startPrice: '1500.00',
					endPrice: '3000.00'
				},
				{
					startPrice: '3000.00',
					endPrice: '4500.00'
				}
			],
			priceCheck: 'all',
			priceFilterBy: false,
			priceOverLay: false,
			sortFlag: true,
			page: 1,
			pageSize: 8,
			busy: true, // 为Ture不能加载
			loading: false
		}
	},
	mounted() {
		this.get_goodslist();
	},
	methods: {
		get_goodslist(flag) {
			this.loading = true;
			let _this = this;
			let param = {
				page: this.page,
				pageSize: this.pageSize,
				sorts: this.sortFlag ? 1 : -1,
				priceLevel:this.priceCheck
			}
			axios({
				method: 'GET',
				url: '/api/goods',
				params: param
			}).then(function(res) {
				_this.loading = false
				if(flag) {
					_this.goodslist = _this.goodslist.concat(res.data.result.list);
					if(res.data.result.count == 0) {
						_this.busy = true;
					}
					else {
						_this.busy = false;
					}
				}
				else {
					_this.goodslist = res.data.result.list
					_this.busy = false;
				}
			})
		},
		sortGoods() {
			this.sortFlag = !this.sortFlag;
			this.page = 1;
			this.get_goodslist();
		},
		setPriceFilter(index) {
			this.priceCheck = index;
			this.closePop();
			this.get_goodslist();
		},
		loadMore() {
			let _this = this;
			this.busy = true;
			setTimeout(() => {
				this.page++;
				this.get_goodslist(true);
			}, 1000);
		},
		show_filter_pop() {
			this.priceFilterBy = true;
			this.priceOverLay = true;
		},
		closePop() {
			this.priceFilterBy = false;
			this.priceOverLay = false;
		},
		addcart(id) {
			axios({
				method: 'POST',
				url: '/api/goods/addCart',
				data: {productId:id}
			}).then((res)=>{
				console.log(res);
			})
		},
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
