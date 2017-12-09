<template>
    <section>
    	<div>首页</div>
    	<tab-button :data="items" v-model="chooseType" />
    </section>
</template>

<script>
	import {
		TabButton
	} from '../components'

	export default {
		data(){
			return {
				chooseType: 0,
				items: [{
					label: 'All',
					value: 0
				},{
					label: 'app',
					value: 1
				},{
					label: 'pc',
					value: 2
				}]
			}
		},
		components: {
			TabButton
		}
	}
</script>