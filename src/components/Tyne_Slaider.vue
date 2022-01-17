<template>
 <div class="slider-wrapper">
     <slot></slot>
 </div>
</template>
<script>
import {tns} from 'tiny-slider/src/tiny-slider'
import 'tiny-slider/dist/tiny-slider.css';
export default {
    name: 'Slider-Tyne',
    data () {
        return { // al colocar un $ en una variable esto quiere decir que se va a quitar la reactividad a esa variable.
            $slider:  null
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init () {
            const config = {
                container: this.$el,
                mode: 'gallery'
            };
            this.$slider = tns(config);
        }
    },
    beforeDestroy() { // elimino los nodos cuando ya no se va usar este componente
        if (this.$slider) {
            this.$slider.destroy();
        }
    },
}
</script>