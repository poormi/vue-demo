<template>
<div id="app">
  	<top :menu="menu"></top>
    <transition name="fade">
    	<router-view class="view"></router-view>
    </transition>
    <foot></foot>
  </div>
</template>

<script>
	import top from './components/top.vue'
	import foot from './components/foot.vue'

	export default {
		data(){
			return {
				menu: '001'
			}
		},
		methods:{
			cutMenu(menuId){
				if(menuId == this.menu){
					document.body.className = 'active';
				}else{
					document.body.className = '';
				}
			}
		},
		components:{
			top,
			foot
		}
	}
</script>