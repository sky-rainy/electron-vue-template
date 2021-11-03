<template>
    <div >
        <Headnav />
        <div class="notes-body">
              <tinymce v-model="form.desc" :height="550" :width="550" />
        </div>
        <Bottomnav />
    </div>
</template>

<script>
import Headnav from '@/components/Headnav';
import Bottomnav from '@/components/Bottomnav';
import Tinymce from "@/components/Tinymce";
export default {
  name:"notes",
  components: {
    Headnav,
    Bottomnav,
    Tinymce
  },  
  data(){
      return{
        form:{
          desc:'',
        }
      }
  },
  mounted() {},

  methods: {}
}

</script>
<style scoped>
.notes-body{
    padding: 60px 5px 5px 5px;
}
</style>