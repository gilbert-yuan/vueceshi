<template>
    <cell :title="title" :value="value"  :link="many2one_link" ></cell>
</template>

<script>
  import { Cell } from 'vux'
  export default {
    props: ['title', 'value', 'field', 'menu', 'id'],
    name: 'Many2one',
    components: {
      Cell
    },
    data: function () {
      return {
        disable: false,
        many2one_link: {path: ''}
      }
    },
    created: function () {
    },
    watch: {
      value (oldVal, newVal) {
        var url = '/mobile/odoo/getActionId'
        this.$http.get(url, {params: {model: this.field.relation}}).then(function (res) {
          this.many2one_link.path = '/mobile/' + this.menu + '/' + res.body.actionId + '/form/' + this.id
        })
      }
    }
  }
</script>
