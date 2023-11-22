<script>
import {ref} from 'vue'
export default{
    setup(){
        return {
            'test': "test shopping",
            testNum: ref(1)
        }
    },
    methods:{
        'testFunc':function(){
            return 'testFunc'
        }        
    },
    components:{
        'testComp':{ template:'<div>test Component</div>'}
    }
}
</script>
<template>
    <testComp></testComp>
</template>