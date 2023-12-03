<script setup>

</script>

<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="javascript:void(0)">Taiwan High Speed Rail</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mynavbar">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/lostItem" class="nav-link">lost</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/booking" class="nav-link">Booking</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/goods" class="nav-link">shopping</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/emp/login" class="nav-link">employee</router-link>
                    </li>
                </ul>
                <form class="d-flex">
                    <input class="form-control me-2" type="text" placeholder="Search">
                    <button class="btn btn-primary" type="button">Search</button>
                </form>
            </div>
        </div>
    </nav>
</template>