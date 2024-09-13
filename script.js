console.log("JS Started")
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if(isNaN(seconds) || seconds < 0){
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60); // Ensure no decimals

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

async function getSongs() {
    
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    // console.log(response);

    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(lis)
    songs = []
    for(let index=0; index < as.length; index++){
        const element = as[index]
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    // console.log(songs)
    return songs
    
}

const playMusic = (song, pause=false)=>{
    // var audio = new Audio("/songs/" + song);
    currentSong.src = "/songs/" + song
    if(!pause){
        currentSong.play()
        play.src = "Assets/pause.svg"
    }
    // currentSong.play()
    document.querySelector(".songName").innerHTML = decodeURI(song) ;
    document.querySelector(".songTime").innerHTML = "00:00 / 00: 00";

}

async function main(){

    //Get the list of songs
    let songs = await getSongs();
    // console.log(songs)

    playMusic(songs[0],true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for(let song of songs){
        songUL.innerHTML = songUL.innerHTML + `<li>
                        <img src="Assets/music.svg" class="invert" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>Vicky</div>
                        </div>
                        <div class="playNow flex">
                            <span>Play Now</span>
                            <img src="Assets/play.svg" class="invert" alt="">
                        </div>
                    </li>`
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{

        //Add eventlistener to play
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

        //Add event listeners to play previous, current ,next songs
        play.addEventListener("click",()=>{
            if(currentSong.paused){
                currentSong.play();
                play.src = "Assets/pause.svg"
            }
            else{
                currentSong.pause();
                play.src = "Assets/play.svg"
            }
        })

        //Add eventListener to timeduration 
        currentSong.addEventListener("timeupdate",()=>{
            console.log(currentSong.currentTime, currentSong.duration);
            document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
        })

        //Add eventListener to seekbar 
        document.querySelector(".seekbar").addEventListener("click", (e)=>{
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
            document.querySelector(".circle").style.left = percent + "%"

            currentSong.currentTime = (currentSong.duration * percent) / 100
        })
    })
}
main()