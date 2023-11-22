<script>
import ScheduleListItem from './scheduleListItem.vue';
    export default{
    setup() {
        return {
            schedules: [{
                    scheduleId: 1001,
                    startStationName: "Banchai",
                    endStationName: "Tainan",
                    durationTime: "100",
                    ticketPrice: 1040
                }, {
                    scheduleId: 1002,
                    startStationName: "Banchai",
                    endStationName: "Tainan",
                    durationTime: "120",
                    ticketPrice: 1040
                }, {
                    scheduleId: 1003,
                    startStationName: "Banchai",
                    endStationName: "Tainan",
                    durationTime: "100",
                    ticketPrice: 1079
                }, {
                    scheduleId: 1004,
                    startStationName: "Banchai",
                    endStationName: "Tainan",
                    durationTime: "100",
                    ticketPrice: 1040
                }, {
                    scheduleId: 1005,
                    startStationName: "Banchai",
                    endStationName: "Tainan",
                    durationTime: "100",
                    ticketPrice: 2500
                }
            ]
        };
    },
    components: { ScheduleListItem }
}
</script>

<template>
    <ul>
        <ScheduleListItem v-for="sch in schedules"  key="sch.scheduleId" :schDetail="sch" ></ScheduleListItem>
    </ul>
</template>