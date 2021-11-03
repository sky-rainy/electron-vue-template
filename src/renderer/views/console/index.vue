<template>
    <div>
        <Headnav />
        <div class="conbody">
            <el-button type="success" plain @click="openNotes">{{text}}</el-button>
        </div>
        <Bottomnav />
    </div>
</template>
<script>
import { ipcRenderer } from "electron";
import Headnav from '@/components/Headnav'
import Bottomnav from '@/components/Bottomnav'
export default {
    name:"con",
    components: {
        Headnav,
        Bottomnav,
    },
    data(){
        return {
           text:"编辑器",
        }
    },
    created(){
        
    },mounted(){
        
    },
    methods:{
        openAudio(){
            let data = {url: "/brower/index",webview:true};
            ipcRenderer.invoke("open-win", data);
        },
        openNotes(){
            this.$router.push({path:'/notes/index'})
        }
    }
}
</script>
<style scoped>
.conbody{
    padding: 60px 5px 5px 5px;
    height: 100%;
}
  webview {
    width:100%;
    height:580px;
  }
</style>