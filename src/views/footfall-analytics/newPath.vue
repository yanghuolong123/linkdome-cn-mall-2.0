<template>
  <div>
      <path-3d></path-3d>
      <!-- <path-backup></path-backup> -->
  </div>
</template>
<script>
import path3d from './pathMap3D.vue'
import pathBackup from './pathTrendBackup.vue'
export default {
  name: 'newPath',
  components: {
    path3d,
    pathBackup
  },
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {

  }
}
</script>
</style>
