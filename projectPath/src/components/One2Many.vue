<template>
  <div>
    <panel :list="treeList" type='5' style="position:absolute; top: 44px;"></panel>
  </div>
</template>
<script>
  import {Panel} from 'vux'
  export default {
    props: ['label', 'field', 'valIds'],
    name: 'One2Many',
    components: {
      Panel
    },
    data: function () {
      return {
//        fields: [],
        treeList: [],
        resModel: '',
        allRecordData: []

      }
    }
  }
</script>
