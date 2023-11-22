<script>
import  scheduleList from  './scheduleList.vue'
import { ref } from 'vue'
    export default{
        setup(){
            return {
                selectStartStation: ref(null),
                selectEndStation: ref(null),
                departTime: ref('2023-11-27'),
                allStation: [
                    {
                        id:1,
                        name:'station AA'
                    },{
                        id:2,
                        name:'station BB'
                    },
                    {
                        id:3,
                        name:'station CC'
                    },
                    {
                        id:4,
                        name:'station DD'
                    },
                ]
            }
        },
        methods:{
            
        },
        components:{
            scheduleList
        }
    }
</script>

<template>
    <form>
    <fieldset>
        <legend>High Speed Rail Booking System</legend>
        <select class="form-select" style="width:30%" v-model="selectStartStation">
            <option v-for="st in allStation" :key="st.id">{{ st.name }}</option>
        </select>
        <select class="form-select" style="width:30%" v-model="selectEndStation">
            <option v-for="st in allStation" :key="st.id">{{ st.name }}</option>
        </select>
        <input type="date" class="form-control" id="date" name="date" :value="departTime" style="width:30%">
    </fieldset>
    </form>
    <button @click.pre="console.log('search')">Search</button>
    <br>
    <scheduleList></scheduleList>
</template>