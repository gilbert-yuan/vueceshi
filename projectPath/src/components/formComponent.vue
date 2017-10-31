<template>
  <div>
    <template v-if="all_field.state">
        <StateBar
          :fieldSelection="all_field['state'].selection "
          :NowState="one_record_data['state']"
        ></StateBar>
    </template>
    <template v-for="(label, index) in show_views.form">
       <template v-if="label.$.name==='message_ids'">
          <Message :message_ids="one_record_data[label.$.name]"> </Message>
      </template>
      <template v-else-if="['', '[]', [], false, 'false'].indexOf(one_record_data[label.$.name])<0 ">
        <template v-if="['selection'].indexOf(all_field[label.$.name]['type'])>=0">
          <Selection :title="label.$.name&&all_field[label.$.name]['string']"
            :placeholder="label.$.name&&label.$.name"
            :data="one_record_data[label.$.name]"
            :options="all_field[label.$.name].selection"
            :disable="false"></Selection>
        </template>
        <template v-else-if="['many2one'].indexOf(all_field[label.$.name]['type'])>=0">
          <Many2one :title="label.$.name&&all_field[label.$.name]['string']"
                    :id="one_record_data[label.$.name]&&one_record_data[label.$.name][0]"
                    :value="one_record_data[label.$.name]&&one_record_data[label.$.name][1]"
                    :field="all_field[label.$.name]"
                    :menu="$route.params.menu_id"
          ></Many2one>
        </template>
        <template v-else-if="['datetime'].indexOf(all_field[label.$.name]['type'])>=0">
          <datetime v-model="one_record_data[label.$.name]" format="YYYY-MM-DD HH:mm" :minute-list="['00', '15', '30', '45']" :title="label.$.name&&all_field[label.$.name]['string']"></datetime>
        </template>
        <template v-else-if="['date'].indexOf(all_field[label.$.name]['type'])>=0">
          <datetime v-model="one_record_data[label.$.name]" format="YYYY-MM-DD" :minute-list="['00', '15', '30', '45']" :title="label.$.name&&all_field[label.$.name]['string']"></datetime>
        </template>
        <template v-else-if="['binary'].indexOf(all_field[label.$.name]['type'])>=0">
          <BinayImage :imgTitle="label.$.name&&label.$.name&&all_field[label.$.name]['string']"
                      :binaryVal="one_record_data[label.$.name]" ></BinayImage>
        </template>
        <template v-else-if="['one2many'].indexOf(all_field[label.$.name]['type'])>=0">
           <!--<one2many :label="label.$.name&&all_field[label.$.name]['string']"-->
                     <!--:field="all_field[label.$.name]"-->
                     <!--:valIds="one_record_data[label.$.name]"-->
           <!--&gt; </one2many>-->
        </template>
        <template v-else>
          <cell :title="label.$.name&&label.$.name&&all_field[label.$.name]['string']" :value="one_record_data[label.$.name]||'空'"></cell>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
  import { GroupTitle, Group, Divider, Cell, Datetime, Panel, Checker, Swiper, XButton } from 'vux'
  import Many2one from './Many2one'
  import BinayImage from './BinaryImage'
  import Selection from './Selection'
  import StateBar from './StateBar'
  import Message from './Message'
  import One2Many from './One2Many'

  export default {
    name: 'childMenu',
    components: {
      Group,
      Panel,
      Selection,
      StateBar,
      One2Many,
      Message,
      GroupTitle,
      Cell,
      Checker,
      XButton,
      Datetime,
      Swiper,
      Many2one,
      BinayImage,
      Divider
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
        record_id: this.$route.params.record_id,
        one2manyList: [{
          src: 'http://somedomain.somdomain/x.jpg',
          fallbackSrc: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
          title: '标题一',
          desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          url: '/component/cell'
        }, {
          src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
          title: '标题二',
          desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          url: {
            path: '/component/radio',
            replace: false
          },
          meta: {
            source: '来源信息',
            date: '时间',
            other: '其他信息'
          }
        }],
        imageIndex: 0
      }
    },
    created: function () {
      this.$nextTick(function () {
        this.get_view_data()
      })
    },
    methods: {
      get_field_views: function (currentAction) {
        var loadViewUrl = '/mobile/odoo/load_views'
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
        var allFieldUrl = '/mobile/odoo/fields_get'
        this.$http.get(allFieldUrl, {params: {model: currentAction.res_model}}).then(function (res) {
          this.all_field = res.body
        })
      },
      get_one_data: function (currentAction) {
        var searchReadUrl = '/mobile/odoo/search_read'
        this.$http.get(searchReadUrl, {
          params: {
            model: currentAction.res_model,
            offset: 0,
            limit: 1,
            domain: [('id', '=', this.record_id)]
          }
        }).then(function (res) {
          if (res.body) {
            this.one_record_data = res.body[0]
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
            }
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
          } else if (xmlTag === '$') {
          } else if (typeof form[xmlTag] === 'object') {
            this.xml_get_all_field(form[xmlTag])
          }
        }
      },
      xml_convert_to_json: function (fieldViews) {
        let self = this
        for (var view in fieldViews.fields_views) {
          if (view === 'form') {
            self.all_field = fieldViews.fields_views[view].fields
            self.show_views_temporary.form = []
            let xml2js = require('xml2js')
            let parser = new xml2js.Parser()
            parser.parseString(fieldViews.fields_views[view].arch, function (errMsg, result) {
              self.xml_get_all_field(result)
              self.show_views = self.show_views_temporary
            })
          }
        }
      },
      edit_record: function (recordId) {

      },
      new_record: function (recordId) {

      },
      save_record: function (recordId) {

      }
    },
    watch: {
      '$route': function (to, from) {
        if (this.$route.params.record_id) {
          this.get_view_data()
        }
      }
    }
  }
</script>
