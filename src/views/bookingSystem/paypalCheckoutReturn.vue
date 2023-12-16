<script setup>
import { onBeforeMount,ref,computed } from 'vue';
import  router from  '../../router/index'
import httpClient from '../../main';
const msg = ref('')
const props= defineProps(['tckodid'])
const nextPage = computed(()=> (msg.value=='座位分配成功')?'車票管理頁面':'首頁')
function toHomePage(){
    router.push('/')
}
function toNextPage(){
    router.push('/ticketOrderDetail/'+props.tckodid)
}
onBeforeMount(()=>{
    console.log( props.tckodid);
    httpClient.post('/registAllocateTicketOrderSeats',props.tckodid,{withCredentials:true})
    .then(res=>{
        if( res.status== 200){
            msg.value = '座位分配成功'
        }
    })
})
</script>
<template>
    <div class="container w-50" style="margin-top:80px;">
        <div class="card">
            <div class="card-header">
                訂票付費結果
            </div>
            <div class="card-body ">
                <h5 class="card-title" style="margin: auto 15%;">{{ msg }}</h5>
                <p class="card-text w-75" style="margin: auto 15%;line-height:45px;">親愛的故先生/女士，<br>

非常高興地通知您，您已成功完成高鐵訂票並順利完成付款！恭喜您即將享有高鐵便捷舒適的旅程。

這意味著您已經完成了所有訂票程序，預訂的座位已經確保。在旅程前，請確認您的訂票詳情，包括乘車日期、時間和乘車站，以確保一切順利。

如果您有任何疑問或需要進一步的協助，請不要猶豫與我們聯繫。感謝您選擇高鐵，祝您旅途愉快！</p>
                <div class="d-flex justify-content-around" style="margin:35px auto">
                    <a href="#" @click="toHomePage" class="btn btn-primary">回首頁</a><a href="#" @click="toNextPage" class="btn btn-primary">前往{{ nextPage }}</a>
                </div>
            </div>
        </div>
    </div>
</template>
<style></style>