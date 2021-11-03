<template>
    <div class="bottom-nav">
        <el-badge :is-dot="isdownload"  class="item">
            <el-tooltip class="item" effect="light"  placement="top-end">
            <div slot="content" style="color:#333;">下载文件</div>
            <i class="el-icon-download" @click="download"></i>
            </el-tooltip>
        </el-badge>
        <el-badge :is-dot="false" class="item">
            <el-tooltip class="item" effect="light"  placement="top-end">
            <div slot="content"><el-button size="mini" type="success" plain  @click="GoURL">框架文档</el-button></div>
            <i class="el-icon-link"></i>
            </el-tooltip>
        </el-badge>
        <!-- 版本带小圆点 -->
        <el-badge :is-dot="verisdot" class="item">
            <el-tooltip class="item" effect="light" placement="top-end">
            <div slot="content" style="color:#333;">{{ versioninfo }}<br/>QQ群号：12354891</div>
            <i class="el-icon-warning-outline" @click="version"></i>
            </el-tooltip>
        </el-badge>
       <!-- 版本带小圆点 -->

    </div>
</template>

<script>
import { shell,ipcRenderer } from "electron";
import { mapGetters } from "vuex";
export default {
    name:"bottomnav",
    computed: {
            ...mapGetters([
                'isdownload'
            ])
    },
    data(){
         return {
             verisdot:true,
             versioninfo:"",
         }
    },
    created() {
        console.log(window.location.pathname)
        ipcRenderer.invoke("version").then(res => {
            this.versioninfo = res;
        });
        ipcRenderer.on("con-state-update",(event,res) =>{
            res?.isdownload ? this.alertMsg(res.isdownload) :"";
        })
    },
     methods:{
         version(){
            this.verisdot = !this.verisdot;
            console.log("底部获取下载状态：",this.$store.state.app.isdownload)
         },
         download(){
            this.downloadisdot = false
            this.$store.dispatch("downloadState",false);
            let data = {url: "/downloadfile/index",resizable:false,maximizable:false};
            ipcRenderer.invoke("open-win", data);
         },
         GoURL(){
            shell.openExternal("https://zh-sky.gitee.io/electron-vue-template-doc/Overview");
         },
         alertMsg(isdownload){
            this.$store.dispatch("downloadState",isdownload)
            this.$message({
                message: '下载完成',
                type: 'success'
            });
         }
     },
    destroyed() {
        console.log("销毁了哦");
        ipcRenderer.removeAllListeners("con-state-update");
    },
}
</script>

<style scoped>
.bottom-nav {
    width: 100%;
    height: 20px;
    text-align: right;
    margin: 0;
    padding-right:5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, .04);
    position:fixed;
    /* overflow-x: hidden; */
    bottom:0;
    background: rgba(1, 252, 168, 0.336);
    font-size: 16px;
    line-height: 18px;
}
  /* 小图标 */
.item .el-button{
   padding:1px 1px !important; 
}
.item {
    margin-right:2px;
}
</style>