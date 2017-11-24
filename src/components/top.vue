	<template>
	<header class="header w">
	    <span class="logo fl"></span>
	    <ul id="menuList" class="menu-list fl">
	    	<li :data-page="item.menuId" v-for="item in menus">
		        <a v-if="item.link.indexOf('http')<0" :href="item.link" :class="{'cur': $route.fullPath.indexOf(item.link)>=0}">
		        	{{item.name}}
		        </a>
		        <a v-else :href="item.link" :class="{'cur': menu == item.menuId}">{{item.name}}</a>
		    </li>
	    </ul>
	    <div class="quit fr">
	        您好，{{userName}}。
	        <a :href="logoutUrl" class="q-btn">退出</a>
	    </div>
	</header>
</template>

<script>
	import {mapGetters} from 'vuex'
	export default {
		props: ['menu'],
		data(){
			return {
			}
		},
		computed: Object.assign({			
			
			},mapGetters({
				userName: 'currentUser',
				menus: 'getMenus',
				logoutUrl: 'logoutUrl',
				user: 'getUser'
			})
		),
		methods: {
			isActive (url) {
				return this.$route.path.indexOf(url) + 1
			}
		},
		watch:{
		},
        beforeMount(){
            this.$store.dispatch('fetchUserName', 'user')
			this.$store.dispatch('fetchMenu', 'menu')
		}
    }
</script>