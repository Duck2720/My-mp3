// render nhac
// scroll playlist to top
// play/pause/greek
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlist = $('.playlist')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player')
const play = $('.btn-toggle-play')
const next = $('.btn-next')
const prev = $('.btn-prev')
const progres = $('#progress')
const random = $('.btn-random')
const repeat = $('.btn-repeat')


const apps = {
    currentIndex: 0,
    isplay: false,
    isRandom:false,
    isRepeat:false,
    songs: [
        {
            name:'Anh ơi tình yêu là gì',
            singer: 'Diệp Anh',
            path: './assets/song/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name:'So Far Away',
            singer: 'Martin',
            path: './assets/song/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name:'Yêu',
            singer: 'Mindy',
            path: './assets/song/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name:'Bước Qua Nhau',
            singer: 'Vũ',
            path: './assets/song/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name:'Hãy Trao Cho Anh',
            singer: 'Sơn Tùng',
            path: './assets/song/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name:'Chạy Ngay Đi',
            singer: 'Sơn Tùng',
            path: './assets/song/song6.mp3',
            image: './assets/img/song6.png'
        }
    ],
    // render nhạc ra màn hình
    render:function() {
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
            <div class="thumb" 
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>  
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div> 
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    // Định nghĩa
    difine:function() {
        Object.defineProperty(this, 'currentSong', {
            get:function() {
            return this.songs[this.currentIndex]
            }
        })
    },

    // Xử lý các chức năng
    handle:function() {

        // scroll to top
        const _this = this
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const newScroll = document.documentElement.scrollTop || window.scrollY
            const newWidth = cdWidth - newScroll
            cd.style.width = newWidth > 0 ? newWidth + 'px' :0
            cd.style.opacity = newWidth / cdWidth
        }

        // Click vào nút play
        play.onclick = function() {
            if(_this.isplay) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi bài hát chạy
        audio.onplay = function () {
            _this.isplay =  true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi bài hát dừng
        audio.onpause = function () {
            _this.isplay = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // khi next bài hát
        next.onclick = function () {
            if(_this.isRandom) {
                _this.random()
            } else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActive()
        }

        // prev bài hát
        prev.onclick = function () {
            if(_this.isRandom) {
                _this.random()
            } else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActive()

        }

        // quay ảnh
        const cdThumbAnimate =  cdThumb.animate([
            {transform:'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        }
        )
        cdThumbAnimate.pause()

        // progress chạy theo nhạc
        audio.ontimeupdate = function () {
            const progress = Math.floor(this.currentTime / this.duration *  100)
            progres.value = progress
        }

        // tua progress
        progres.oninput = function  (e)  {
            const newProgress = audio.duration  / 100 * e.target.value
            audio.currentTime = newProgress
        }

        // Bật tắt random
        random.onclick = function() {
            if(_this.isRandom) {
                _this.isRandom = false
                random.classList.remove('active')
            } else {
                _this.isRandom = true
                random.classList.add('active')
            }
        }

        // Bật tắt repeat
        repeat.onclick = function() {
            if(_this.isRepeat) {
                _this.isRepeat = false
                repeat.classList.remove('active')
            } else {
                _this.isRepeat = true
                repeat.classList.add('active')
            }
        }

        // Next khi hết bài
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                next.click()
            }
        }

        // Click playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadSong()
                    _this.render()
                    audio.play()
                }
            }
        } 
    },

    // scrollToActive
    scrollToActive:function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        },200)  
    },

    // loadSong
    loadSong:function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path 
        console.log(heading, cdThumb, audio)
    },

    // next bài hát
    nextSong:function () {
        this.currentIndex ++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadSong()
    },

    // Lùi bài hát
    prevSong:function() {
        this.currentIndex --
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1 
        }
        this.loadSong()
    },

    // Random bài hát
    random:function() {
        let newIndex
        do {
           newIndex = Math.floor(Math.random() * this.songs.length )
        } while(this.currentIndex === newIndex)
        this.currentIndex = newIndex
        this.loadSong()
    },

    start:function() {
        // Định nghĩa
        this.difine()
        // các chức năng
        this.handle()
        // Hàm chạy bài hát
        this.loadSong()
         // render nhạc ra màn hình
        this.render()
    }
}
apps.start()

































