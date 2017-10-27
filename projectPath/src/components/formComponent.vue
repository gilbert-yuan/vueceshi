<template>
  <div>
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
        currentAction: this.$route.params.action_id,
        second_level_menu: [],
        show_views: {form: {}},
        field_views: {form: {}},
        one_record_data: {},
        all_field: {},
        state_normal: 'show',
        input_disabled: false,
        show_views_temporary: {form: {}},
        record_id: this.$route.params.record_id
      }
    },
    created: function () {
      this.$nextTick(function () {
        this.get_view_data()
      })
    },
    methods: {
      get_field_views: function (currentAction) {
        var loadViewUrl = '/mobile/load_views'
        this.$http.get(loadViewUrl, {
          params: {
            model: currentAction.res_model,
            views: JSON.stringify(currentAction.views)
          }
        }).then(function (res) {
          this.field_views = res.body
          this.xml_convert_to_json(this.field_views)
        })
      },
      get_all_fields: function (currentAction) {
        var allFieldUrl = '/mobile/fields_get'
        this.$http.get(allFieldUrl, {params: {model: currentAction.res_model}}).then(function (res) {
          this.all_field = res.body
        })
      },
      get_one_data: function (currentAction) {
        var searchReadUrl = '/mobile/search_read'
        this.$http.get(searchReadUrl, {
          params: {
            model: currentAction.res_model,
            offset: 0,
            limit: 1,
            domain: [('id', '=', this.record_id)]
          }
        }).then(function (res) {
          console.log(res.body)
          this.one_record_data = res.body[0]
        })
      },
      get_view_data: function () {
        var url = '/mobile/odoo/action/load'
        var self = this
        self.$http.get(url, {params: {action_id: self.$route.params.action_id}}).then(function (res) {
          self.currentAction = res.body
          if (self.currentAction) {
            if (!self.currentAction.views) {
              self.$notify.error({
                title: '错误',
                message: '这个菜单对应的动作没有定义视图类型！'
              })
            }
            setTimeout(function () {
              self.get_all_fields(self.currentAction)
            }, 100)
            setTimeout(function () {
              self.get_field_views(self.currentAction)
            }, 100)

            setTimeout(function () {
              self.get_one_data(self.currentAction)
            }, 100)
          }
        })
      },
      xml_get_all_field: function (form) {
        for (var xmlTag in form) {
          if (xmlTag === 'field') {
            if (Array.isArray(form[xmlTag])) {
              this.show_views_temporary.form.push.apply(this.show_views_temporary.form, form[xmlTag])
            } else {
              this.show_views_temporary.form.push(form[xmlTag])
            }
          } else if (typeof form[xmlTag] === 'object') {
            this.xml_get_all_field(form[xmlTag])
          }
        }
      },
      xml_convert_to_json: function (fieldViews) {
        for (var view in fieldViews.fields_views) {
          var x2js = 'new X2JS()'
          var viewJsonObj = x2js.xml_str2json(fieldViews.fields_views[view].arch)
          fieldViews.fields_views[view].arch_jsonobj = viewJsonObj
          if (view === 'form') {
            this.show_views_temporary.form = []
            this.xml_get_all_field(viewJsonObj.form)
            // 列表中有对象有 列表对象 还需要进一步的
            this.show_views = this.show_views_temporary
          }
        }
      },
      edit_record: function (recordId) {

      },
      new_record: function (recordId) {

      },
      save_record: function (recordId) {

      }
    }
  }
</script>
