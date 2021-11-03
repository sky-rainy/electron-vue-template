<template>
    <div style="margin-top:35px; height:100%;">
      <el-row :gutter="20" style="padding:5px;">
        <!-- <el-col :span="1" ><el-button  icon="el-icon-back" @click="canGoBack()" style="float:right;"></el-button></el-col> -->
        <el-col :span="13" ><el-input  v-model="urls"></el-input></el-col>
        <el-col :span="5"  style="width:auto;" ><el-button  icon="el-icon-refresh-right" circle :loading="reloadbut"  @click="reload()" style="float:left;">
          </el-button><el-button  icon="el-icon-position" @click="gourl()" style="float:left;"></el-button>
        <el-button  @click="tools()" style="float:left;">调试</el-button></el-col>
        <!-- <el-col :span="3"  ></el-col> -->
      </el-row>
      <div style="margin-top:5px; padding:2px;">
            <div>
                <webview  src="https://zh-sky.gitee.io/electron-vue-template-doc/Overview/#%E5%8A%9F%E8%83%BD"   ></webview>
            </div>

      </div>
    </div>
</template>

<script>
import { ipcRenderer,shell } from "electron";
export default {
  data(){
      return{
        urls:null,
        reloadbut:true,
      }
  },

  components: {},

  mounted() {
    this.onload();
  },
  methods: {
        onload(){
                const   webview = document.querySelector('webview');
                        webview.addEventListener('dom-ready',(e)=>{
                            console.log(e)
                       })
                        webview.addEventListener("did-start-loading", ()=> {
                            console.log("did-start-loading...","开始加载事件监听");
                            this.reloadbut = true
                        })
                        webview.addEventListener("did-stop-loading", ()=> {
                          this.reloadbut = false
                            console.log("did-stop-loading...","停止加载事件监听");
                           //注入css
                            // webview.insertCSS(`
                            // body {
                            //     background: #fa0000 !important;
                            // }
                            // `)
                            //注入js脚本
                            // webview.executeJavaScript(`
                            //     setTimeout(()=>{
                            //         console.log("打印", document.querySelector(".cc-cd-cb-l") )
                            //         alert(document.querySelector(".cc-cd-cb-l").innerHTML)
                            //     }, 2000);
                            // `)
                             
                        })
                        webview.addEventListener("new-window",(e) => { 
                          const protocol = require('url').parse(e.url).protocol
                                if (protocol === 'http:' || protocol === 'https:') {
                                    // webview.loadURL(e.url)
                                   // webview.src = e.url
                                  shell.openExternal(e.url)
                                  // window.open(e.url)
                                //   let data = {url:e.url,webview:true}
                                //   ipcRenderer.invoke("open-win", data);

                                }
                          
                          console.log('new-window',e)
                        })
                        webview.addEventListener('did-attach',(e)=>{
                                console.log('did-attach',e)
                        })
                        webview.addEventListener('page-title-updated',(e)=>{
                                console.log('page-title-updated',e)
                        })
                        webview.addEventListener('page-favicon-updated',(e)=>{
                                console.log('page-favicon-updated',e)
                        })
                        webview.addEventListener('enter-html-full-screen',(e)=>{
                                console.log('enter-html-full-screen',e)
                        })
                        webview.addEventListener('leave-html-full-screen',(e)=>{
                                console.log('leave-html-full-screen',e)
                        })
                        webview.addEventListener('console-message',(e)=>{
                                console.log('console-message',e)
                        })
                        webview.addEventListener('will-navigate',(e)=>{
                                console.log('will-navigate',e)
                        })
                        webview.addEventListener('did-start-navigation',(e)=>{
                                console.log('did-start-navigation',e)
                        })
                        webview.addEventListener('did-redirect-navigation',(e)=>{
                                console.log('did-redirect-navigation',e)
                        })
                        webview.addEventListener('did-navigate',(e)=>{
                                console.log('did-navigate',e)
                        })
                        webview.addEventListener('did-frame-navigate',(e)=>{
                                console.log('did-frame-navigate',e)
                        })
                        webview.addEventListener('did-navigate-in-page',(e)=>{
                                console.log('did-navigate-in-page',e)
                        })
                        webview.addEventListener('close',(e)=>{
                                console.log('close',e)
                        })
                        webview.addEventListener('crashed',(e)=>{
                                console.log('crashed',e)
                        })
                        webview.addEventListener('plugin-crashed',(e)=>{
                                console.log('plugin-crashed',e)
                        })
                        webview.addEventListener('destroyed',(e)=>{
                                console.log('destroyed',e)
                        })

        },
        gourl(){
           const   webview = document.querySelector('webview');
            var reg=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if(!reg.test(this.urls)){
                 webview.loadURL('https://'+this.urls)
            }
            else{
                 webview.loadURL(this.urls)
            }
        },
        reload(){
          //刷新当前页面
           const   webview = document.querySelector('webview');
                   webview.reloadIgnoringCache()
        },
        // canGoBack(){
        //   //后退
        //    const   webview = document.querySelector('webview');
        //            webview.canGoBack()
        // }
        tools(){
           const  webview = document.querySelector('webview');
                  webview.openDevTools()
        }
  }
}

</script>
<style>
  webview {
    width:100%;
    height:1060px;
  }
</style>