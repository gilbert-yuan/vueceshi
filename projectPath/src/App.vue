<template>
  <div id="app" style="height:100%;">
    <view-box ref="viewBox">
      <x-header slot="header" 
      :right-options="{showMore: true}"
      :title='title' 
      @on-click-more="showMenus = true" 
      style="width:100%;position:fixed;left:0;top:0;z-index:100;">
        
      </x-header>
      <div slot="default" style="position:absolute;top: 44px;width:100%;">
        <router-view></router-view>
      </div>
      <div slot="bottom">
        <tabbar style="position:fixed">
          <template v-for="menu in first_level_menu">
            <tabbar-item :link="{path: '/mobile/'+menu.id}">
              <img slot="icon" :src="menu.web_icon|get_menu_ico_path">
              <span slot="label">{{ menu.name }}</span>
            </tabbar-item>
          </template>
        </tabbar>
      </div>
    </view-box>
    <div v-transfer-dom>
        <actionsheet :menus="menus" v-model="showMenus" show-cancel></actionsheet>
    </div>
    <div v-transfer-dom>
      <loading :show="isLoading" text="加载中...."></loading>
    </div>
    <loading v-model="isLoading"></loading>
  </div>
</template>
<script>
  import {Tabbar, TabbarItem, Group, Cell, Loading, ButtonTabItem, ViewBox, XHeader, Drawer, ButtonTab, Actionsheet, TransferDomDirective as TransferDom} from 'vux'
  import { mapState } from 'vuex'
  export default {
    directives: {
      TransferDom
    },
    name: 'app',
    components: {
      Tabbar,
      TabbarItem,
      XHeader,
      Group,
      Cell,
      Drawer,
      ViewBox,
      Actionsheet,
      ButtonTab,
      ButtonTabItem,
      Loading
    },
    data: function () {
      return {
        active_second_view_id: '',
        menus: {
          menu1: '提问',
          menu2: '新建'
        },
        showMenus: false,
        first_level_menu: [],
        second_level_menu: [],
        last_leve_menu: [],
        show_first_level_menu: true,
        current_action: '',
        drawerVisibility: '',
        showModeValue: '',
        showPlacementValue: '',
        headerTransition: '',
        leftOptions: ''
      }
    },
    created: function () {
      var url = '/mobile/odoo/get_first_level_menu'
      this.loading = true
      this.$http.get(url).then(function (res) {
        this.loading = false
        this.first_level_menu = res.body
        if (res.body && typeof res.body === 'object' && res.body[0]) {
          this.active_second_view_id = this.first_level_menu[0].id
          this.$router.push({
            name: 'menu',
            params: {menu_id: this.active_second_view_id}
          })
        }
      })
    },
    methods: {
      onclick_first_level_menu: function (menuId) {
        this.$router.push({
          name: 'menu',
          params: {menu_id: menuId}
        })
      }
    },
    computed: {
      ...mapState({
        route: state => state.route,
        path: state => state.route.path,
        isLoading: state => state.vux.isLoading
      }),
      title () {
        return this.componentName ? `Demo/${this.componentName}` : 'Demo/~~'
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';

  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  body {
    background-color: #fbf9fe;
  }
</style>
