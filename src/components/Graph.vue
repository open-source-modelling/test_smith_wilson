<template>
    <div class="graph">
        <Plotly :data="graph_data" :layout="graph_layout" :toImageButtonOptions="config.toImageButtonOptions"></Plotly>
    </div>
</template>

<script>
//import { mapActions } from 'vuex';
import { Plotly } from "vue-plotly";

export default {
    name: "Graph",
    components: {
        Plotly,
    },
    props: {
        graph_data: {
            type: Array,
            required: true,
        },
        graph_layout: {
            type: Object,
            required: true,
        },
    },
    data: function () {
        return {
            config: {
                toImageButtonOptions: {
                    format: 'svg', // one of png, svg, jpeg, webp
                    filename: this.graph_layout.title,
                    height: 700,
                    width: 1400,
                    scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
                }
            }
        };
    },
    computed: {
    },
    methods: {
    },
    created() {
    },
};
</script>

<style lang="scss" scoped>
@import "../scss/style.scss";
</style>
