console.log("JS Started")

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

const playMusic = (song)=>{
    var audio = new Audio("/songs/" + song);
    console.log(audio)
    audio.play()

    audio.addEventListener("loadeddata", ()=>{
        // console.log(audio.duration, audio.currentSrc, audio.currentTime)
    })
}

async function main(){
    let currentSong;
    //Get the list of songs
    let songs = await getSongs();
    // console.log(songs)

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
    })
}
main()