<template>
	<span>
		<div :class="['switch',{open: value}]" @click="handleClick">
	    	<i class="bar"></i>
		</div>
		<label>{{label}}</label>
	</span>
</template>

<script>
	export default {
		data(){
			return {
				value: this.defaultValue
			}
		},
		props: {
			label: String,
			defaultValue: {
				type: Boolean,
				default: false
			},
			onSwitch: {
				type: Function,
				default: () => {}
			}
		},
		methods: {
			handleClick(){
				this.value = !this.value
				this.onSwitch(this.value)
			}
		}
	}
</script>

<style>
  .switch{
    background-color: #969696;
    display: inline-block;
    width: 33px;
    height: 18px;
    vertical-align: middle;
    border-radius: 10px;
    cursor: pointer;
  }
  .switch.open{
    background-color: #52d4ff;
  }
  .switch.open+label{
    color: #52d4ff;
  }
  .switch>.bar{
    margin: 1px 16px 1px 0;
    background-color: #fff;
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 10px;
    transition: all 200ms ease;
  }
  .switch.open>.bar{
    margin-right: 1px;
  }
</style>