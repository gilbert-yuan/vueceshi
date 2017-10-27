<template>
  <div>
    <search
      @result-click="resultClick"
      @on-change="getResult"
      :results="searchResult"
      v-model="searchVal"
      position="fixed"
      @on-cancel="onCancel"
      :autoFixed="true"
      style=" top: 44px"
      @on-submit="onSubmit"
      ref="search"></search>
    <panel :list="treeList" type='5' style="position:absolute; top: 44px;"></panel>
  </div>
</template>
<script>
  import {Panel, Search, Group, Cell, XButton} from 'vux'
  export default {
    components: {
      Panel,
      Search,
      Group,
      Cell,
      XButton
    },
    data: function () {
      return {
        scrollerStatus: '',
        searchVal: '',
        fields: [],
        show_views: {tree: {field: []}, search: {field: []}},
        all_field: {},
        currentAction: '',
        allRecordData: [],
        one_record_data: [],
        ele_table_height: 400,
        input_disabled: true,
        treeList: [],
        view_type: 'tree',
        form_fields: [],
        show_views_temporary: [],
        limit: 8,
        is_all_records_data: false,
        now_record_length: false,
        offset: 0,
        refresh_result_length: 0,
        dataDomain: [],
        results: [],
        value: 'test',
        searchResult: []
      }
    },
    created: function () {
      this.$nextTick(function () {
        this.get_view_data()
      })
    },
    watch: {
      '$route': function (to, from) {
        this.dataDoamin = []
        this.get_view_data()
      },
      searchVal (newVal, oldVal) {
        var self = this
        for (var result of self.searchResult) {
          if (newVal && self.all_field) {
            result.title = newVal + '-' + self.all_field[result.other].string
          } else {
            result.title = self.all_field[result.other].string
          }
        }
      }
    },
    methods: {
      setFocus () {
        this.$refs.search.setFocus()
      },
      getResult () {
        console.log(this.searchResult)
        return this.searchResult
      },
      onFocus () {

      },
      onCancel () {
        var self = this
        self.dataDoamin = JSON.stringify([])
        self.get_more_data(0, 'search')
      },
      onSubmit () {
      },
      resultClick (result) {
        var self = this
        this.dataDoamin = JSON.stringify([[result.other, 'ilike', self.searchVal]])
        self.get_more_data(0, 'search')
      },
      selPullUp () {
        this.get_all_data(false)
      },
      activated () {
        this.$refs.scroller.reset()
      },
      get_search_field: function (currentAction) {
        var loadViewUrl = '/mobile/odoo/load_search_views'
        var self = this
        self.$http.get(loadViewUrl, {
          params: {
            model: currentAction.res_model,
            search_view_id: currentAction.search_view_id.id
          }
        }).then(function (res) {
          console.log(res)
          let parseString = require('xml2js').parseString
          parseString(res.body.arch, function (result, err) {
            if (err && err.search) {
              for (var field of err.search.field) {
                try {
                  if (!self.all_field.hasOwnPrototype) {
                    self.searchResult.push({
                      title: self.all_field[field.$.name].string,
                      other: field.$.name
                    })
                  }
                } catch (err) {
                  console.log(err.stack)
                }
              }
            }
          })
        })
      },
      get_field_views: function (currentAction) {
        var loadViewUrl = '/mobile/odoo/load_views'
        this.$http.get(loadViewUrl, {
          params: {
            model: currentAction.res_model,
            views: JSON.stringify(currentAction.views)
          }
        }).then(function (res) {
          this.xml_convert_to_json(res.body)
        })
      },
      get_all_fields: function (currentAction) {
        var allFieldUrl = '/mobile/odoo/fields_get'
        this.$http.get(allFieldUrl, {params: {model: currentAction.res_model}}).then(function (res) {
          this.all_field = res.body
        })
      },
      get_all_data: function (currentAction) {
        var searchReadUrl = '/mobile/odoo/search_read'
        this.$http.get(searchReadUrl, {
          params: {
            model: currentAction.res_model,
            offset: this.offset,
            limit: this.limit,
            domain: this.dataDoamin
          }
        }).then(function (res) {
          this.allRecordData = res.body
          this.now_record_length = res.body.length
          if (res.body.length !== 8) {
            self.is_all_records_data = true
          } else {
            self.is_all_records_data = false
          }
        })
      },
      get_more_data: function (offset, type) {
        var searchReadUrl = '/mobile/odoo/search_read'
        var self = this
        this.$http.get(searchReadUrl, {
          params: {
            model: self.currentAction.res_model,
            offset: offset,
            limit: self.limit,
            domain: self.dataDoamin
          }
        }).then(function (res) {
          if (type === 'add') {
            self.allRecordData = self.allRecordData.concat(res.body)
            self.now_record_length = res.body.length
          } else {
            this.allRecordData = res.body
            this.compute_list(self.fields)
          }
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
              self.get_all_data(self.currentAction)
            }, 100)
            setTimeout(function () {
              self.get_all_fields(self.currentAction)
            }, 100)
            setTimeout(function () {
              self.get_field_views(self.currentAction)
            }, 100)
            setTimeout(function () {
              self.get_search_field(self.currentAction)
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
        let self = this
        for (var view in fieldViews.fields_views) {
          let parseString = require('xml2js').parseString
          if (view === 'list') {
            parseString(fieldViews.fields_views[view].arch, function (result, err) {
              self.fields = []
              for (var fieldIndex in err.tree.field) {
                self.fields.push(err.tree.field[fieldIndex].$.name)
              }
              self.compute_list(self.fields)
            })
          }
        }
      },
      compute_list: function (fields) {
        var self = this
        self.treeList = []
        console.log(self.allRecordData)
        for (let recordRow of self.allRecordData) {
          let oneRecord = {
            title: '',
            desc: '',
            url: {},
            meta: {}
          }
          var allFieldUrl = '/mobile/odoo/name_get'
          self.$http.get(allFieldUrl, {
            params: {
              model: self.currentAction.res_model,
              id: recordRow.id
            }
          }).then(function (res) {
            oneRecord.title = res.body[0][1]
            let otherMessage = ''
            let descMessage = ''
            for (let field of fields) {
              let fieldRow = self.all_field[field]
              console.log(fieldRow.type)
              if (['float', 'integer', 'datetime'].indexOf(fieldRow.type) >= 0) {
                otherMessage = otherMessage + '  ' + fieldRow.string + ':' + recordRow[field]
              } else if (['boolean'].indexOf(fieldRow.type) >= 0) {
                otherMessage = otherMessage + '  ' + fieldRow.string + ':' + (recordRow[field] === 'false' ? '√' : '×')
              } else if (['char', 'text'].indexOf(fieldRow.type) >= 0) {
                descMessage = descMessage + '  ' + fieldRow.string + ':' + recordRow[field]
              } else if (['many2one'].indexOf(fieldRow.type) >= 0) {
                descMessage = descMessage + '  ' + fieldRow.string + ':' + recordRow[field][1]
              } else if (['selection'].indexOf(fieldRow.type) >= 0) {
                console.log(recordRow[field])
                for (var selectionArray of fieldRow.selection) {
                  if (selectionArray[0] === recordRow[field]) {
                    descMessage = descMessage + '  ' + fieldRow.string + ':' + selectionArray[1]
                    break
                  }
                }
              }
            }
            oneRecord.meta.other = otherMessage
            oneRecord.desc = descMessage
            oneRecord.url = '/mobile/' + self.$route.params.menu_id + '/' + self.$route.params.action_id + '/form/' + recordRow.id
            self.treeList.push(oneRecord)
          })
        }
      }
    }
  }
</script>
