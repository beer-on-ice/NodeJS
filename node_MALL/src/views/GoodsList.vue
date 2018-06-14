<template>
	<div>
		<nav-header></nav-header>
		<nav-bread>
			<span slot>Goods</span>
		</nav-bread>
		<div class="accessory-result-page accessory-page">
			<div class="container">
				<div class="filter-nav">
					<span class="sortby">Sort by:</span>
					<a href="javascript:void(0)" class="default cur">Default</a>
						<a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short" :class="{'sort-up':sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
		<modal :md-show="mdShow" @close="closeModal">
			<p slot="message">
				请先登录，否则无法加入到购物车！
			</p>
			<div slot="btnGroup">
				<a class="btn btn--m" href="javascript:;" @click="mdShow=false">关闭</a>
			</div>
		</modal>
		<modal :md-show="mdShowCart" @close="closeModal">
			<p slot="message">
				<svg class="icon-status-ok">
				  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
				</svg>
				<span>加入购物车成功！</span>
			</p>
			<div slot="btnGroup">
				<a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
				<router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
			</div>
		</modal>
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
import Modal from '@/components/Modal'
import {mapState,mapMutations} from 'vuex'

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
			loading: false,
			mdShow: false, // 未登录点击加入购物车
			mdShowCart: false // 登录点击加入购物车
		}
	},
	mounted() {
		this.get_goodslist();
	},
	computed: {
		...mapState([
			'cartCount'
		])
	},
	methods: {
		...mapMutations([
			'updateCartCount'
		]),
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
				url: '/api/goods/list',
				params: param
			}).then(function(res) {
				_this.loading = false;
				if(res.data.status == "0") {
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
				}
				else {
					_this.goodslist = [];
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
				_this.page++;
				_this.get_goodslist(true);
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
			let _this = this;
			axios({
				method: 'POST',
				url: '/api/goods/addCart',
				data: {productId:id}
			}).then((res)=>{
				if(res.data.status == "0") {
					_this.mdShowCart = true;
					_this.updateCartCount(1)
				}
				else {
					_this.mdShow = true;
				}
			})
		},
		closeModal() {
			this.mdShow = false;
		}
	},
	components: {
		NavHeader,
		NavFooter,
		NavBread,
		Modal
	}
}
</script>

<style scoped>
	.sort-up {
	transform: rotate(180deg);
	transition: all .3s ease-out;
}
</style>
