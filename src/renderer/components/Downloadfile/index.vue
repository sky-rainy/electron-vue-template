<template>
    <div style="margin-top:35px;">
        <el-card class="box-card">
            <el-input
                type="textarea"
                :rows="1"
                placeholder="请输入下载地址"
                v-model="durl" style="float:left;">
            </el-input>
            <el-button style="float: right; margin:5px;" type="info" plain @click="download()">添加下载</el-button>
            
        </el-card>
        <!-- 下载进度 -->
        <div v-show="dshow">
            <transition name="el-zoom-in-top">
                <el-card class="box-card" >
                   
                    <div slot="header" class="clearfix">
                        
                        <span style="font-size:12px; padding: 3px 0; ">{{ downloadInfo.filename }}1231312</span>
                        <el-button style="float: right; margin:3px;" type="info" plain @click="cancel()">取消下载</el-button>
                    </div>
                    <div  class="text item">
                        <span style="font-size:12px;padding:3px 0px;display: block;margin: 5px 0px 5px 5px;">正在下载：</span>
                        <el-progress :text-inside="true" :stroke-width="24" :percentage="percentage"  status="success"></el-progress>
                    </div>
                </el-card>
            </transition>
        </div>
        <!-- ---- -->
        <!-- 列表 -->
        <div v-if="JSON.stringify(downloadList) != '[]'">
            <el-card  class="box-card" v-for="(v,k) in downloadList" :key="k" >
                <span style="font-size:10px;">已下载  <span>{{  v.times }}</span></span>
                <div style="float:left;width:100%;margin:5px 0px 5px 0px; ">
                    <span style="color:#409EFF; font-size:12px;">{{  v.filename }}</span>
                    <span style="font-size:12px;word-wrap: break-word;word-break: break-all;" :id="'text'+k" @click="copy(k)">  
                         {{ v.durl }}
                    </span>
                </div>
                <el-button style="float: left; margin:5px 0px 10px 0px; " type="info" plain @click="opendir(v.dpath)">打开文件夹</el-button>
                <el-button style="float: right; margin:5px 0px 10px 0px;" type="info" plain @click="del(v.filename,v.times)">列表中移除</el-button>
            </el-card>
        </div>
        <!-- 列表 -->
        <div v-else>
            <el-card class="box-card">
            <el-empty :image-size="30"></el-empty>
            </el-card>
        </div>

  


    </div>
</template>

<script>
import { ipcRenderer,shell,clipboard } from "electron";
import { format } from "date-fns";
export default {
     name:"downloadfile",
     data(){
         return {
             percentage:0,
             durl:null,
             downloadInfo:{
             },
             dshow:false,
             downloadList:[
             ],
         }
     },
    created() {
        this.downloadList = JSON.parse(localStorage.getItem('downloadList')) == null ? [] : JSON.parse(localStorage.getItem('downloadList')) 
        console.log(this.downloadList)
        ipcRenderer.on("download-path-name",(event,arg)=>{
            console.log(arg)
               this.downloadInfo = {}
               this.downloadInfo.filename = arg?.filename
               this.downloadInfo.dpath = arg?.path
               this.downloadInfo.durl = arg?.durl
               this.downloadInfo.times = format(new Date(), "yyyy/MM/dd HH:mm:ss")
               console.log("下载的文件：",this.downloadInfo)
        })
        ipcRenderer.on("download-progress", (event, arg) => {
            this.percentage = Number(arg);
        });
        ipcRenderer.on("download-error", (event, arg) => {
        if (arg) {
            this.progressStaus = "exception";
            this.colors = "#d81e06";
        }
        });
        ipcRenderer.on("download-paused", (event, arg) => {
        if (arg) {
            this.progressStaus = "warning";
            this.$alert("下载由于未知原因被中断！", "提示", {
            confirmButtonText: "重试",
            callback: (action) => {
                ipcRenderer.invoke("satrt-download");
            },
            });
        }
        });
        ipcRenderer.on("download-done", (event, age) => {
            this.filePath = age.filePath;
            this.progressStaus = "success";
            ipcRenderer.invoke("con-state-update-confirm",{isdownload:true})
            this.$store.commit("DOWNLOAD_STATE",true);
            this.dshow = false
            this.downloadList.unshift(this.downloadInfo)
             console.log("下载完成2",this.downloadList)
            localStorage.setItem('downloadList',JSON.stringify(this.downloadList))
            this.$message({
            center:true,
            message: '下载完成',
            type: 'success'
            });
        });
        ipcRenderer.on("UpdateMsg", (event, age) => {
        switch (age.state) {
            case -1:
            const msgdata = {
                title: "发生错误",
                message: age.msg,
            };
            this.dialogVisible = false;
            ipcRenderer.invoke("open-errorbox", msgdata);
            break;
            case 0:
            this.$message("正在检查更新");
            break;
            case 1:
            this.$message({
                type: "success",
                message: "已检查到新版本，开始下载",
            });
            this.dialogVisible = true;
            break;
            case 2:
            this.$message({ type: "success", message: "无新版本" });
            break;
            case 3:
            this.percentage = age.msg.percent.toFixed(1);
            break;
            case 4:
            this.progressStaus = "success";
            this.$alert("更新下载完成！", "提示", {
                confirmButtonText: "确定",
                callback: (action) => {
                ipcRenderer.invoke("confirm-update");
                },
            });
            break;

            default:
            break;
        }
        });
    },
     methods:{
         download(){
             console.log(this.durl)
            if (this.durl != null){
                let data = {downloadUrL: this.durl};
                ipcRenderer.invoke("start-download", data);
                this.dshow = true
            }
         },
        //  handleCommand(e){
        //     switch(e){
        //         case "opendir":
        //             //打开文件夹
        //             this.dpath ? shell.openPath(this.dpath) : '';
        //             break;
        //         case "cancel":

        //         default:
        //             break;
        //     }
            
        //  },
         opendir(p){
            //打开文件夹
            p ? shell.openPath(p) : '';
         },
         cancel(){
            //取消下载
            ipcRenderer.invoke('download-cancel')
            this.percentage = 0;
            this.dshow = false
         },
         copy(k){
                var text = document.getElementById("text"+k).innerText;
                clipboard.writeText(text);
                this.$message({
                    center:true,
                    message:'复制链接成功'
                    });
         },
         del(r,time){
             let array = [];
             this.downloadList.filter((t,c)=>{
                 let t1 =  new Date(t.times);
                 let t2 =  new Date(time);
                 console.log(t1.getTime(),t2.getTime())
                t.filename === r && t1.getTime()  === t2.getTime() ? '' : array.push(t); 
             })
             this.downloadList = array 
             localStorage.removeItem("downloadList");
             localStorage.setItem("downloadList",JSON.stringify(array))
         }
     },
    destroyed() {
        console.log("销毁了哦");
         ipcRenderer.removeAllListeners("UpdateMsg");
         ipcRenderer.removeAllListeners("download-done");
         ipcRenderer.removeAllListeners("download-paused");
         ipcRenderer.removeAllListeners("download-error");
         ipcRenderer.removeAllListeners("download-progress");
         ipcRenderer.removeAllListeners("download-path-name");
    },
}
</script>
<style scoped>
.box-card{
    margin:10px !important;
}
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
