<template>
<section class="videoSection">
    <a
        class="group flex justify-center items-center h-40 px-container md:px-container-md bg-cover bg-center text-whiteish text-center"
        @click="playVideo()">

        <div class="absolute pin bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>

        <div>
            <div class="text-heading-sm leading-tight">
                {{name}} After movie
            </div>
            <div class="mt-3">
                <f-a icon="play" class="text-xl" />
            </div>
        </div>

    </a>
    <!-- <iframe class="ytvideo bg-black transition-opacity" src="https://www.youtube.com/embed/VoFLk0kWX5U?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="encrypted-media"></iframe> -->
</section>
</template>
<script>
/* eslint-disable no-unused-vars */
export default {
    data() {
        return {
            videoClicked: false
        }
    },
    props: {
        name: String,
        videoID: {
            type: String,
            required: true
        }
    },
    mounted() {
        var youtubeApiLoaded = false
        var tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/player_api'
        var firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        window.onYouTubePlayerAPIReady = function() {
            youtubeApiLoaded = true
        }
    },
    methods: {
        playVideo() {
            var section = event.target.closest('section')
            if (this.videoClicked) {
                return
            }
            this.videoClicked = true
            var videoContainer = document.createElement('div')
            videoContainer.setAttribute('id', 'youtubeVideo')
            videoContainer.className = 'youtubeVideo z-10 absolute pin bg-black opacity-0 transition-opacity'
            section.insertBefore(videoContainer, section.firstChild)

            videoContainer.classList.remove('opacity-0')
            section.style.height = section.offsetHeight + 'px'
            section.removeChild(section.lastChild)
            section.style.height = section.offsetWidth * 9 / 16 + 'px'

            section.style.padding = ''
            section.style.backgroundImage = 'none'
            videoContainer.classList.remove('z-10')
            videoContainer.classList.remove('absolute')
            videoContainer.classList.remove('pin')

            var self = this
            playVideo()

            function playVideo() {
                let YT = window.YT
                var player = new YT.Player('youtubeVideo', {
                    videoId: self.videoID,
                    playerVars: {
                        autoplay: 1,
                        modestbranding: 1,
                        playsinline: 1,
                        rel: 0,
                        showinfo: 0,
                        controls: 0,
                        fs: 0
                    },
                })
                let iframe = player.getIframe()

                iframe.classList.add('absolute')
                iframe.classList.add('pin')
                iframe.classList.add('w-full')
                iframe.classList.add('h-full')
            }
        }
    }
}
</script>
<style lang="scss">

.videoSection {
    overflow: hidden;
    transition: height .5s ease;

    a {
        background-image: url(../assets/img/banner.jpg);
    }
}
.youtubeVideo {
    height: 56.25vw;
    width: 100vw;
}
</style>
