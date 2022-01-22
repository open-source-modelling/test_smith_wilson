<template>
    <v-app>
        <v-app-bar color="primary" dark app>
            <!-- <v-app-bar-nav-icon
            ></v-app-bar-nav-icon> -->

            <div class="d-flex align-center">
                <div id="logo" class="logo">
                    Qnity
                </div>
            </div>

            <v-spacer></v-spacer>

            <div class="d-flex align-center">
                <div class="app_name logo">Smith Wilson</div>
            </div>
        </v-app-bar>

        <div class="wrapper">
            <v-main>
                <router-view></router-view>
            </v-main>
        </div>
    </v-app>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "App",

    components: {
    },

    computed: {
    },

    data: () => ({
    }),

    methods: {
        ...mapActions([]),
    },

    created() {
    },
};
</script>

<style lang="scss" scoped>
@import "src/scss/style.scss";
</style>
