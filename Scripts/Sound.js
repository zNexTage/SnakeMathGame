class Sound {
    audioObj;

    constructor(audioPath) {
        this.audioObj = document.createElement("audio");
        this.audioObj.src = audioPath
    }

    play = () => this.audioObj.play();

    stop = () => this.audioObj.pause();
}