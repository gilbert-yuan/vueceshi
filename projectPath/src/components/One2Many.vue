<template>
  <group :title='label'>
    <template v-for="row in treeList">
      <cell :title="row.title" :inline-desc="row.desc" link="https://vux.li/demos/v2/?x-page=v2-doc-home#/component/cell" ></cell>
    </template>
  </group>
</template>
<script>
  import {Panel, Group, Cell} from 'vux'
  export default {
    props: ['label', 'field', 'valIds'],
    name: 'One2Many',
    components: {
      Group, Panel, Cell
    },
    data: function () {
      return {
        fields: [],
        treeList: [],
        resModel: '',
        allRecordData: []
      }
    },
    created: function () {
      var self = this
      var searchReadUrl = '/mobile/odoo/search_read'
      self.resModel = this.field.relation
      self.$http.get(searchReadUrl, {
        params: {
          model: this.field.relation,
          domain: JSON.stringify([['id', 'in', self.valIds]])
        }
      }).then(function (res) {
        self.allRecordData = res.body
        self.xml_convert_to_json(self.field.views)
      })
    },
    methods: {
      xml_convert_to_json: function (fieldViews) {
        let self = this
        console.log(fieldViews)
        for (var view in fieldViews) {
          if (view === 'tree') {
            console.log(fieldViews[view].fields)
            self.compute_list(fieldViews[view].fields)
          }
        }
      },
      compute_list: function (fields) {
        var self = this
        self.treeList = []
        var allFieldUrl = '/mobile/odoo/name_get'
        var recordIds = []
        for (let recordRow of self.allRecordData) {
          recordIds.push(recordRow.id)
        }
        self.$http.get(allFieldUrl, {
          params: {
            model: self.resModel,
            ids: JSON.stringify(recordIds)
          }
        }).then(function (res) {
          if (res.body) {
            let nameIndex = 0
            for (let recordRow of self.allRecordData) {
              console.log(self.allRecordData)
              let oneRecord = {
                title: '',
                desc: '',
                url: {},
                meta: {}
              }
              oneRecord.title = res.body[nameIndex] && res.body[nameIndex++][1]
              let descMessage = ''
              for (var field in fields) {
                let fieldRow = fields[field]
                if (recordRow[field]) {
                  if (['float', 'integer', 'datetime'].indexOf(fieldRow.type) >= 0) {
                    descMessage = descMessage + '  ' + fieldRow.string + ':' + recordRow[field]
                  } else if (['boolean'].indexOf(fieldRow.type) >= 0) {
                    descMessage = descMessage + '  ' + fieldRow.string + ':' + (recordRow[field] === 'false' ? '√' : '×')
                  } else if (['char', 'text'].indexOf(fieldRow.type) >= 0) {
                    descMessage = descMessage + '  ' + fieldRow.string + ':' + recordRow[field]
//                  } else if (['many2one'].indexOf(fieldRow.type) >= 0) {
//                    let man2oneIndex = 1
//                    descMessage = descMessage + '  ' + fieldRow.string + ':' + recordRow[field][man2oneIndex]
                  } else if (['selection'].indexOf(fieldRow.type) >= 0) {
                    for (let selectionArray of fieldRow.selection) {
                      if (selectionArray[0] === recordRow[field]) {
                        descMessage = descMessage + '  ' + fieldRow.string + ':' + selectionArray[1]
                        break
                      }
                    }
                  }
                }
              }
              oneRecord.desc = descMessage
              oneRecord.url = '/mobile/' + self.$route.params.menu_id + '/' + self.$route.params.action_id + '/form/' + recordRow.id
              self.treeList.push(oneRecord)
              console.log(self.treeList)
            }
          }
        })
      }
    }
  }
</script>
