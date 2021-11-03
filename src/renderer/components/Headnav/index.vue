<template>
    <div class="head-nav">
       <el-link   @click="debug" type="info">调试(i)</el-link>
       <el-link   @click="newWin" type="info">弹出窗口</el-link>
       <el-link  type="info" @click="back()" style="float:right;"> <i class="el-icon-back">返回</i></el-link>
       <!-- <el-link  type="info" @click="next()"><i class="el-icon-d-arrow-right"></i> </el-link> -->
    </div>
</template>
<script>
import { ipcRenderer } from "electron";
export default {
    name:"headnav",
    data(){
        return{

        }
    },
    methods:{
        debug(){
            ipcRenderer.invoke("debug-devtools").then(res=>{})
        },
        newWin(){
            let data = {url: "/brower/index",webview:true,width:600,height:600};
            ipcRenderer.invoke("open-win", data);
        },
        // next(){
        //     history.go(1)
        // },
        back(){
            history.back()
        }
    }
}
</script>
<style scoped>
.head-nav {
    width: 100%;
    height: 25px;
    margin-top: 30px;
    padding:0px 10px;
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, .04); */
    position:fixed;
    /* top:30; */
    background: rgba(102, 102, 101, 0.685);
    font-size: 16px;
    line-height: 21px;
}
.head-nav .el-link{
    font-size: 12px !important;
}
</style>