<template>
	<div class="tab-buttons">
		<ul>
			<li :key="index" :name="`yy_${item.label}`" :class="{'on': picked == item.value}" key="index" v-for="(item,index) in items" @click="handleClick(item,index)">
				<input :id="`hd-${index}`" type="radio" :value="item.value" name="t-btns" v-model="picked">
				<label :for="`hd-${index}`">{{item.label}}</label>
			</li>
			<i class="bar" :style="barStyle"></i>
		</ul>
	</div>
</template>

	<script>
		export default {
			nam: 'TabButton',
			data() {
				return {
					items: this.data,
					picked: this.data.length && this.data[0].value,
					barStyle: ''
				}
			},
			props: {
				data:{
					type: Array,
					default: []
				}
			},
			methods: {
				handleClick(item,index){
					this.barStyle = { transform: `translate3d(${index*90}px, 0, 0)`}
				}
			}
		}
	</script>

	<style>
		.tab-buttons>ul{
			position: relative;
			display: inline-block;
			border: solid 1px #e1e1e1;
			border-radius: 3px;
			text-align: center;
		}
		.tab-buttons li{
			display: inline-block;
			width: 90px;
			border-left: solid 1px #e1e1e1;
			font-size: 14px;
			line-height: 32px;
			box-sizing: border-box;
			transition: color 0s 200ms;
		}
		.tab-buttons li:first-child{
			border-left: none;
		}
		.tab-buttons li>input[type='radio']{
			visibility: hidden;
			display: none;
		}
		.tab-buttons li>label{
			display: inline-block;
			width: 100%;
			height: 100%;
			z-index: 1;
			position: relative;
			cursor: pointer;
		}
		.tab-buttons li.on{
			border-top-left-radius: 3px;
    	border-bottom-left-radius: 3px;
			color: #fff;
		}
		.tab-buttons ul .bar{
			position: absolute;
			top: -1px;
			left: -1px;
			width: 90px;
			height: 32px;
			border: solid 1px #55d4ff;
			background-color: #55d4ff;
			border-radius: 3px;
			transition: transform 300ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
		}
	</style>