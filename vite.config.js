import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue':'vue/dist/vue.esm-bundler.js'
    }
  },
  server:{
    host: '0.0.0.0',
    port: 5173,
    open: true,
    https:false,
    proxy:{
      "/api":{
        target: "http://localhost:8081/MarcHighSpeedRail",
        changeOrigin:true,
        followRedirects:true,
        secure:false,
        rewrite:(path)=>path.replace(/^\/api/,''),
        configure:(proxy, _options)=>{
          proxy.on('error', (err, _req, _res)=> console.log('proxy err',err));
          proxy.on('proxyReq',(proxyReq,req,_res)=> console.log('send request to target',req.method, req.url));
          proxy.on('proxyRes',(proxyRes,req, _res)=> console.log('Received res from target ',proxyRes.statusCode,req.url));
        }
      }
    }
  }
})
