<template>
<transition name="fade">
    <no-ssr placeholder="Loading...">
        <agile :options="options" class="topSlider">
            <div class="slide" v-for="(photo, index) in allPhotos" :key="index">
                <img class="slide--img" :src="photo.main_photo" :alt="photo.category">
            </div>
        </agile>
    </no-ssr>
</transition>
</template>
<script>
export default {
    data() {
        return {
            options: {
                arrows: false,
                responsive: [
                    {
                        breakpoint: 600,
                        settings: {
                            dots: false
                        }
                    },
                    
                    {
                        breakpoint: 900,
                        settings: {
                            arrows: true,
                            dots: true,
                            infinite: false
                        }
                    }
                ]
            }
        }
    },
    props: {
        photos: {
            type: Array,
            required: true
        }
    },
    computed: {
        allPhotos() {
            return this.photos.filter(function(photo) {
                return photo.category !== 'MAIN';
            })
        }
    }
}
</script>
