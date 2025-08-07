export class SoundManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = {}; // To store loaded audio buffers
        this.isUnlocked = false; // To track if AudioContext is resumed
        console.log("SoundManager created. AudioContext state:", this.audioContext.state); // Added logging
        this.unlockAudio(); // Attempt to unlock on first interaction
    }

    // Function to unlock audio on first user interaction
    unlockAudio() {
        const unlock = () => {
            console.log("Attempting to unlock AudioContext. Current state:", this.audioContext.state); // Added logging
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    console.log('AudioContext resumed!');
                    this.isUnlocked = true;
                    document.body.removeEventListener('touchstart', unlock);
                    document.body.removeEventListener('click', unlock);
                }).catch(e => console.error("Error resuming AudioContext:", e));
            } else {
                this.isUnlocked = true;
                console.log('AudioContext already active or resuming. isUnlocked set to true.'); // Added logging
                document.body.removeEventListener('touchstart', unlock);
                document.body.removeEventListener('click', unlock);
            }
        };

        // Add event listeners to attempt resume
        document.body.addEventListener('touchstart', unlock, { once: true });
        document.body.addEventListener('click', unlock, { once: true });
        console.log("Added AudioContext unlock listeners."); // Added logging
    }

    async loadSound(name, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.buffers[name] = audioBuffer;
            console.log(`Sound ${name} loaded successfully.`);
        } catch (error) {
            console.error(`Error loading sound ${name} from ${url}:`, error);
        }
    }

    playSound(name) {
        if (!this.isUnlocked) {
            console.warn(`AudioContext not unlocked. Cannot play sound ${name}. Current state: ${this.audioContext.state}`); // Improved warning
            return;
        }

        const buffer = this.buffers[name];
        if (buffer) {
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start(0);
        } else {
            console.warn(`Sound ${name} not loaded.`);
        }
    }
}