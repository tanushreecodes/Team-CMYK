// Struggle Words Practice Script
class StruggleWordsPractice {
    constructor() {
        this.currentWordIndex = 0;
        this.words = this.initializeWords();
        this.completedWords = [];
        this.starsEarned = 0;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        
        this.initializeElements();
        this.bindEvents();
        this.loadCurrentWord();
        this.generateWordGrid();
        this.updateProgress();
    }
    
    initializeWords() {
        return [
            {
                word: "adventure",
                phonetics: "/ədˈven.tʃər/",
                meaning: "An exciting or unusual experience",
                sentence: "Going to the mountains was a great adventure!",
                difficulty: "medium",
                hint: {
                    breakdown: "ad-ven-ture",
                    tip: "Think of 'ad' + 'venture' (like going on a journey)"
                }
            },
            {
                word: "beautiful",
                phonetics: "/ˈbjuː.tɪ.fəl/",
                meaning: "Pleasing the senses or mind aesthetically",
                sentence: "The sunset was absolutely beautiful tonight.",
                difficulty: "medium",
                hint: {
                    breakdown: "beau-ti-ful",
                    tip: "Think of 'beauty' + 'ful' (full of beauty)"
                }
            },
            {
                word: "challenge",
                phonetics: "/ˈtʃæl.ɪndʒ/",
                meaning: "A task or situation that tests someone's abilities",
                sentence: "Learning to read was a big challenge for me.",
                difficulty: "hard",
                hint: {
                    breakdown: "chal-lenge",
                    tip: "Think of 'chall' + 'enge' (like a test)"
                }
            },
            {
                word: "different",
                phonetics: "/ˈdɪf.ər.ənt/",
                meaning: "Not the same as another or each other",
                sentence: "Everyone is different and that's okay!",
                difficulty: "medium",
                hint: {
                    breakdown: "dif-fer-ent",
                    tip: "Think of 'diff' + 'er' + 'ent' (not the same)"
                }
            },
            {
                word: "elephant",
                phonetics: "/ˈel.ɪ.fənt/",
                meaning: "A very large animal with a trunk",
                sentence: "The elephant at the zoo was enormous!",
                difficulty: "medium",
                hint: {
                    breakdown: "el-e-phant",
                    tip: "Think of 'el' + 'e' + 'phant' (big animal)"
                }
            },
            {
                word: "friendly",
                phonetics: "/ˈfrend.li/",
                meaning: "Kind and pleasant",
                sentence: "My teacher is very friendly and helpful.",
                difficulty: "easy",
                hint: {
                    breakdown: "friend-ly",
                    tip: "Think of 'friend' + 'ly' (like a friend)"
                }
            },
            {
                word: "gigantic",
                phonetics: "/dʒaɪˈɡæn.tɪk/",
                meaning: "Extremely large in size or extent",
                sentence: "The dinosaur was gigantic compared to us.",
                difficulty: "hard",
                hint: {
                    breakdown: "gi-gan-tic",
                    tip: "Think of 'giant' + 'ic' (very big)"
                }
            },
            {
                word: "happiness",
                phonetics: "/ˈhæp.i.nəs/",
                meaning: "The feeling of being happy",
                sentence: "Reading books brings me great happiness.",
                difficulty: "medium",
                hint: {
                    breakdown: "hap-pi-ness",
                    tip: "Think of 'happy' + 'ness' (the feeling)"
                }
            },
            {
                word: "important",
                phonetics: "/ɪmˈpɔː.tənt/",
                meaning: "Of great significance or value",
                sentence: "It's important to practice reading every day.",
                difficulty: "medium",
                hint: {
                    breakdown: "im-por-tant",
                    tip: "Think of 'import' + 'ant' (very valuable)"
                }
            },
            {
                word: "journey",
                phonetics: "/ˈdʒɜː.ni/",
                meaning: "An act of traveling from one place to another",
                sentence: "Our reading journey is just beginning!",
                difficulty: "medium",
                hint: {
                    breakdown: "jour-ney",
                    tip: "Think of 'jour' + 'ney' (a trip)"
                }
            },
            {
                word: "knowledge",
                phonetics: "/ˈnɒl.ɪdʒ/",
                meaning: "Facts, information, and skills acquired through experience",
                sentence: "Reading helps us gain knowledge about the world.",
                difficulty: "hard",
                hint: {
                    breakdown: "knowl-edge",
                    tip: "Think of 'know' + 'ledge' (what you know)"
                }
            },
            {
                word: "learning",
                phonetics: "/ˈlɜː.nɪŋ/",
                meaning: "The acquisition of knowledge or skills",
                sentence: "Learning to read is an exciting adventure!",
                difficulty: "medium",
                hint: {
                    breakdown: "learn-ing",
                    tip: "Think of 'learn' + 'ing' (the process)"
                }
            }
        ];
    }
    
    initializeElements() {
        // Navigation elements
        this.backBtn = document.getElementById('backBtn');
        this.homeBtn = document.getElementById('homeBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        
        // Stats elements
        this.wordsRemainingEl = document.getElementById('wordsRemaining');
        this.wordsCompletedEl = document.getElementById('wordsCompleted');
        this.starsEarnedEl = document.getElementById('starsEarned');
        
        // Word display elements
        this.wordCard = document.getElementById('wordCard');
        this.difficultyBadge = document.getElementById('difficultyBadge');
        this.wordNumber = document.getElementById('wordNumber');
        this.currentWordEl = document.getElementById('currentWord');
        this.wordPhonetics = document.getElementById('wordPhonetics');
        this.wordMeaning = document.getElementById('wordMeaning');
        this.wordSentence = document.getElementById('wordSentence');
        
        // Control buttons
        this.hintBtn = document.getElementById('hintBtn');
        this.audioBtn = document.getElementById('audioBtn');
        this.practiceBtn = document.getElementById('practiceBtn');
        
        // Reading interface elements
        this.readingInterface = document.getElementById('readingInterface');
        this.recordBtn = document.getElementById('recordBtn');
        this.recordingStatus = document.getElementById('recordingStatus');
        this.readingFeedback = document.getElementById('readingFeedback');
        this.readingActions = document.getElementById('readingActions');
        this.retryBtn = document.getElementById('retryBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        // Hint modal elements
        this.hintModal = document.getElementById('hintModal');
        this.closeHint = document.getElementById('closeHint');
        this.hintTip = document.getElementById('hintTip');
        this.hintVisual = document.getElementById('hintVisual');
        
        // Progress elements
        this.progressFill = document.getElementById('progressFill');
        this.progressPercent = document.getElementById('progressPercent');
        this.wordGrid = document.getElementById('wordGrid');
        
        // Session modal elements
        this.sessionModal = document.getElementById('sessionModal');
        this.modalWordsCompleted = document.getElementById('modalWordsCompleted');
        this.modalStarsEarned = document.getElementById('modalStarsEarned');
        this.modalAccuracy = document.getElementById('modalAccuracy');
        this.reviewBtn = document.getElementById('reviewBtn');
        this.continueBtn = document.getElementById('continueBtn');
    }
    
    bindEvents() {
        // Navigation events
        this.backBtn.addEventListener('click', () => this.goBack());
        this.homeBtn.addEventListener('click', () => this.goHome());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        
        // Control button events
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.audioBtn.addEventListener('click', () => this.playAudio());
        this.practiceBtn.addEventListener('click', () => this.startReadingPractice());
        
        // Reading practice events
        this.recordBtn.addEventListener('click', () => this.toggleRecording());
        this.retryBtn.addEventListener('click', () => this.retryWord());
        this.nextBtn.addEventListener('click', () => this.nextWord());
        
        // Hint modal events
        this.closeHint.addEventListener('click', () => this.hideHint());
        this.hintModal.addEventListener('click', (e) => {
            if (e.target === this.hintModal) this.hideHint();
        });
        
        // Session modal events
        this.reviewBtn.addEventListener('click', () => this.reviewWords());
        this.continueBtn.addEventListener('click', () => this.continueLearning());
        this.sessionModal.addEventListener('click', (e) => {
            if (e.target === this.sessionModal) this.hideSessionModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    loadCurrentWord() {
        const word = this.words[this.currentWordIndex];
        
        // Update word display
        this.currentWordEl.textContent = word.word;
        this.wordPhonetics.textContent = word.phonetics;
        this.wordMeaning.innerHTML = `
            <h3>Definition:</h3>
            <p>${word.meaning}</p>
        `;
        this.wordSentence.innerHTML = `
            <h3>Example:</h3>
            <p>${word.sentence}</p>
        `;
        
        // Update difficulty badge
        this.difficultyBadge.textContent = word.difficulty.charAt(0).toUpperCase() + word.difficulty.slice(1);
        this.difficultyBadge.className = `difficulty-badge ${word.difficulty}`;
        
        // Update word number
        this.wordNumber.textContent = `Word ${this.currentWordIndex + 1} of ${this.words.length}`;
        
        // Reset reading interface
        this.hideReadingInterface();
        
        // Update word grid
        this.updateWordGrid();
        
        // Update stats
        this.updateStats();
    }
    
    generateWordGrid() {
        this.wordGrid.innerHTML = '';
        this.words.forEach((word, index) => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item pending';
            wordItem.textContent = word.word;
            wordItem.addEventListener('click', () => this.goToWord(index));
            this.wordGrid.appendChild(wordItem);
        });
        this.updateWordGrid();
    }
    
    updateWordGrid() {
        const wordItems = this.wordGrid.querySelectorAll('.word-item');
        wordItems.forEach((item, index) => {
            item.className = 'word-item';
            if (index === this.currentWordIndex) {
                item.classList.add('current');
            } else if (this.completedWords.includes(index)) {
                item.classList.add('completed');
            } else {
                item.classList.add('pending');
            }
        });
    }
    
    updateStats() {
        this.wordsRemainingEl.textContent = this.words.length - this.completedWords.length;
        this.wordsCompletedEl.textContent = this.completedWords.length;
        this.starsEarnedEl.textContent = this.starsEarned;
    }
    
    updateProgress() {
        const progress = (this.completedWords.length / this.words.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressPercent.textContent = `${Math.round(progress)}%`;
    }
    
    showHint() {
        const word = this.words[this.currentWordIndex];
        this.hintTip.innerHTML = `
            <p><strong>Break it down:</strong> ${word.hint.breakdown}</p>
            <p><strong>Think of:</strong> ${word.hint.tip}</p>
        `;
        
        this.hintVisual.innerHTML = `
            <div class="syllable-breakdown">
                ${word.hint.breakdown.split('-').map(syllable => 
                    `<span class="syllable">${syllable}</span>`
                ).join('')}
            </div>
        `;
        
        this.hintModal.style.display = 'flex';
    }
    
    hideHint() {
        this.hintModal.style.display = 'none';
    }
    
    playAudio() {
        // Simulate audio playback
        this.audioBtn.innerHTML = '<i class="fas fa-volume-up"></i><span>Playing...</span>';
        this.audioBtn.disabled = true;
        
        setTimeout(() => {
            this.audioBtn.innerHTML = '<i class="fas fa-volume-up"></i><span>Listen</span>';
            this.audioBtn.disabled = false;
        }, 2000);
    }
    
    startReadingPractice() {
        this.readingInterface.style.display = 'block';
        this.practiceBtn.style.display = 'none';
        this.recordBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Click to Read</span>';
        this.recordingStatus.textContent = 'Ready to record!';
    }
    
    hideReadingInterface() {
        this.readingInterface.style.display = 'none';
        this.practiceBtn.style.display = 'flex';
        this.readingFeedback.style.display = 'none';
        this.readingActions.style.display = 'none';
    }
    
    async toggleRecording() {
        if (!this.isRecording) {
            await this.startRecording();
        } else {
            this.stopRecording();
        }
    }
    
    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };
            
            this.mediaRecorder.onstop = () => {
                this.processRecording();
            };
            
            this.mediaRecorder.start();
            this.isRecording = true;
            
            this.recordBtn.innerHTML = '<i class="fas fa-stop"></i><span>Stop Recording</span>';
            this.recordBtn.classList.add('recording');
            this.recordingStatus.textContent = 'Recording... Speak clearly!';
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.recordingStatus.textContent = 'Microphone access denied. Please allow microphone access.';
        }
    }
    
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            this.recordBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Processing...</span>';
            this.recordBtn.classList.remove('recording');
            this.recordingStatus.textContent = 'Processing your reading...';
        }
    }
    
    processRecording() {
        // Simulate processing time
        setTimeout(() => {
            this.showReadingFeedback();
        }, 1500);
    }
    
    showReadingFeedback() {
        // Simulate feedback - in a real app, this would analyze the audio
        const isCorrect = Math.random() > 0.3; // 70% success rate for demo
        
        this.readingFeedback.style.display = 'block';
        this.readingActions.style.display = 'flex';
        
        if (isCorrect) {
            this.readingFeedback.innerHTML = `
                <div class="feedback-content">
                    <div class="feedback-icon">🎉</div>
                    <div class="feedback-text">
                        <h4>Excellent!</h4>
                        <p>You pronounced that word perfectly!</p>
                    </div>
                </div>
            `;
            this.readingFeedback.style.background = 'linear-gradient(135deg, var(--success-green), #66BB6A)';
            this.starsEarned += 2;
        } else {
            this.readingFeedback.innerHTML = `
                <div class="feedback-content">
                    <div class="feedback-icon">👍</div>
                    <div class="feedback-text">
                        <h4>Good try!</h4>
                        <p>You're getting better! Try again for a perfect score.</p>
                    </div>
                </div>
            `;
            this.readingFeedback.style.background = 'linear-gradient(135deg, var(--warning-yellow), #FFB300)';
            this.readingFeedback.style.color = 'var(--text-primary)';
            this.starsEarned += 1;
        }
        
        this.recordingStatus.textContent = 'Recording complete!';
        this.updateStats();
    }
    
    retryWord() {
        this.readingFeedback.style.display = 'none';
        this.readingActions.style.display = 'none';
        this.recordBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Click to Read</span>';
        this.recordingStatus.textContent = 'Ready to record again!';
    }
    
    nextWord() {
        this.completedWords.push(this.currentWordIndex);
        this.updateProgress();
        
        if (this.currentWordIndex < this.words.length - 1) {
            this.currentWordIndex++;
            this.loadCurrentWord();
        } else {
            this.showSessionComplete();
        }
    }
    
    goToWord(index) {
        if (index >= 0 && index < this.words.length) {
            this.currentWordIndex = index;
            this.loadCurrentWord();
        }
    }
    
    showSessionComplete() {
        const accuracy = Math.round((this.completedWords.length / this.words.length) * 100);
        
        this.modalWordsCompleted.textContent = this.completedWords.length;
        this.modalStarsEarned.textContent = this.starsEarned;
        this.modalAccuracy.textContent = `${accuracy}%`;
        
        this.sessionModal.style.display = 'flex';
    }
    
    hideSessionModal() {
        this.sessionModal.style.display = 'none';
    }
    
    reviewWords() {
        this.hideSessionModal();
        this.currentWordIndex = 0;
        this.completedWords = [];
        this.starsEarned = 0;
        this.loadCurrentWord();
        this.updateProgress();
        this.updateStats();
    }
    
    continueLearning() {
        window.location.href = 'profile.html';
    }
    
    goBack() {
        window.history.back();
    }
    
    goHome() {
        window.location.href = 'profile.html';
    }
    
    openSettings() {
        // Placeholder for settings functionality
        console.log('Settings clicked');
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                if (this.readingInterface.style.display === 'none') {
                    this.startReadingPractice();
                } else {
                    this.toggleRecording();
                }
                break;
            case 'h':
                e.preventDefault();
                this.showHint();
                break;
            case 'a':
                e.preventDefault();
                this.playAudio();
                break;
            case 'n':
                e.preventDefault();
                if (this.readingActions.style.display === 'flex') {
                    this.nextWord();
                }
                break;
            case 'r':
                e.preventDefault();
                if (this.readingActions.style.display === 'flex') {
                    this.retryWord();
                }
                break;
            case 'Escape':
                this.hideHint();
                this.hideSessionModal();
                break;
        }
    }
}

// Initialize the practice session when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StruggleWordsPractice();
});

// Add some fun animations
document.addEventListener('DOMContentLoaded', () => {
    // Add entrance animations to cards
    const cards = document.querySelectorAll('.word-card, .practice-controls, .session-stats');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});
