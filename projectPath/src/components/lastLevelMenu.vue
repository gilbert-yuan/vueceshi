<template>
  <grid :cols="3">
    <grid-item v-for="menu in last_leve_menu" :key="menu.id" :link="{path:'/mobile/'+ menuId +'/'+ menu.action.split(',')[1]+'/tree'}">
      <span class="grid-center">{{menu.name}}</span>
    </grid-item>
  </grid>
</template>
<script>
  import {Grid, GridItem} from 'vux'
  export default {
    props: ['secondMenuId', 'menuId'],
    name: 'lastLevelMenu',
    components: {
      Grid,
      GridItem
    },
    data: function () {
      return {
        last_leve_menu: []
      }
    },
    created: function () {
      var url = '/mobile/odoo/get_last_level_menu'
      this.$http.get(url, {params: {parent_id: this.secondMenuId}}).then(function (res) {
        this.loading = false
        if (res.body) {
          this.last_leve_menu = res.body
        }
      })
    },
    methods: {
      onclick_last_level_menu: function (actionId) {
//        if (actionId && actionId.indexOf(',')) {
//          actionId = actionId.split(',')[1]
//          this.my_current_action = true;
//          this.$router.push({name: 'tree', params: {action_id: actionId}})
//        }
      }
    },
    watch: {
      secondMenuId: function (newVal, oldVal) {
        var url = '/mobile/odoo/get_last_level_menu'
        console.log(newVal)
        this.$http.get(url, {params: {parent_id: oldVal}}).then(function (res) {
          this.loading = false
          if (res.body) {
            this.last_leve_menu = res.body
          }
        })
      }
    }
  }
</script>
