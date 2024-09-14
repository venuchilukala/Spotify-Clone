console.log("JS Started")
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60); // Ensure no decimals

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    // console.log(response);

    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(lis)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    //Show all songs in the platlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (let song of songs) {
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

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        //Add eventlistener to play
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

    })
    return songs;
}

const playMusic = (song, pause = false) => {

    currentSong.src = `/${currFolder}/` + song
    if (!pause) {
        currentSong.play()
        play.src = "Assets/pause.svg"
    }
    // currentSong.play()
    document.querySelector(".songName").innerHTML = decodeURI(song);
    document.querySelector(".songTime").innerHTML = "00:00 / 00: 00";

}

async function displayAlbums() {
    
    let cardContainer = document.querySelector(".card-container")
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-1)[0];
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json()
            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card" data-folder="${folder}">
                            <img src="/songs/${folder}/card.jpeg" alt="card" class="card-img">
                            <h4>${response.title}</h4>
                            <p>${response.description}</p>
                        </div>`

        }

    }

    //Load folder 
    //using currentTarget because when target used it gives element we clicked
    //but currentTarget gives which element we targeted for
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget, item.currentTarget.dataset.folder);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])

        })
    })
}


async function main() {
    //Get the list of songs
    await getSongs("songs/demo");
    playMusic(songs[0], true)

    //Display all albums on the page
    displayAlbums()

    //Add event listeners to play previous, current ,next songs
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "Assets/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "Assets/play.svg"
        }
    })

    //Add eventListener to timeduration 
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    //Add eventListener to seekbar 
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })


    //Add event Listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", (e) => {
        // document.querySelector(".left").style.left = "0";
        console.log(e.target)
        if(e.target.src.includes("Assets/hamburger.svg")){
            e.target.src = e.target.src.replace("Assets/hamburger.svg", "Assets/close.svg")
            document.querySelector(".left").style.left = "0";
        }
        else{
            e.target.src = e.target.src.replace("Assets/close.svg", "Assets/hamburger.svg", )
            document.querySelector(".left").style.left = "-100%";
            
        }
    })

    //Add event Listener to close
    // document.querySelector(".close").addEventListener("click", () => {
    //     document.querySelector(".left").style.left = "-100%";
    // })

    //Add event Listener to previous button
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(currentSong.src)
        console.log(index)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    //Add event Listener to next button
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(currentSong.src)
        console.log(index)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Add event listener to volue bar
    volumeBar.addEventListener("change", (e) => {
        // console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
    })  

    //Add event listener to mute the volume 
    document.querySelector(".volume>img").addEventListener("click", (e) =>{
        if(e.target.src.includes("Assets/speaker.svg")){
            e.target.src = e.target.src.replace("Assets/speaker.svg","Assets/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("Assets/mute.svg","Assets/speaker.svg");
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
}
main()