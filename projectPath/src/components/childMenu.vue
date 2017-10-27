<template>
  <div>
    <template v-for="menu in second_level_menu">
      <group-title> {{menu.name}} </group-title>
      <lastLevelMenu :secondMenuId="menu.id" :menuId="$route.params.menu_id"></lastLevelMenu>
    </template>
  </div>
</template>

<script>
import { Grid, GridItem, GroupTitle } from 'vux'
import lastLevelMenu from './lastLevelMenu'
export default {
  name: 'childMenu',
  components: {
    Grid,
    GridItem,
    GroupTitle,
    lastLevelMenu
  },
  data: function () {
    return {
      second_level_menu: []
    }
  },
  created: function () {
    this.get_second_level_menu()
  },
  methods: {
    get_second_level_menu: function () {
      var url = '/mobile/odoo/get_second_level_menu'
      this.loading = true
      this.$http.get(url, {params: {parent_id: this.$route.params.menu_id}}).then(function (res) {
        this.loading = false
        if (res.body) {
          this.second_level_menu = res.body
        }
      })
    }
  },
  watch: {
    $route: function (newVal, oldVal) {
      this.get_second_level_menu()
    }
  }
}
</script>
