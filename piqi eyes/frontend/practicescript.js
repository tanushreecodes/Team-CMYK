// Reading Practice Script
class ReadingPractice {
    constructor() {
        this.currentStage = "paragraph";
        this.currentSentenceIndex = 0;
        this.currentWordIndex = 0;
        this.starsEarned = 0;
        this.isRecording = false;
        this.calibrationComplete = true; // Track calibration state
        this.isCalibrating = false; // Track if currently calibrating

        // Practice content
        this.paragraph =
            "The brave little fox loved to explore the forest every morning. She would walk along the winding paths, listening to the birds sing their beautiful songs. Sometimes she would find interesting rocks or colorful flowers that made her day special. The fox knew that reading books was just like exploring the forest - every page held new adventures and discoveries waiting to be found.";

        this.sentences = [
            "The brave little fox loved to explore the forest every morning.",
            "She would walk along the winding paths, listening to the birds sing their beautiful songs.",
            "Sometimes she would find interesting rocks or colorful flowers that made her day special.",
            "The fox knew that reading books was just like exploring the forest - every page held new adventures and discoveries waiting to be found.",
        ];

        this.words = [
            {
                word: "explore",
                phonetics: "/ɪkˈsplɔːr/",
                meaning:
                    "To travel through or investigate a place to learn about it",
                context: "...loved to explore the forest...",
                hint: "Think of 'ex' (out) + 'plore' (like explore a new place)",
            },
            {
                word: "winding",
                phonetics: "/ˈwaɪn.dɪŋ/",
                meaning: "Having many curves and turns",
                context: "...along the winding paths...",
                hint: "Think of 'wind' (like the wind blowing in curves) + 'ing'",
            },
            {
                word: "listening",
                phonetics: "/ˈlɪs.ən.ɪŋ/",
                meaning: "Giving attention with the ear to hear sounds",
                context: "...listening to the birds...",
                hint: "Think of 'listen' + 'ing' (the action of hearing)",
            },
            {
                word: "beautiful",
                phonetics: "/ˈbjuː.tɪ.fəl/",
                meaning: "Pleasing the senses or mind aesthetically",
                context: "...sing their beautiful songs...",
                hint: "Think of 'beauty' + 'ful' (full of beauty)",
            },
            {
                word: "interesting",
                phonetics: "/ˈɪn.trə.stɪŋ/",
                meaning: "Arousing curiosity or interest",
                context: "...find interesting rocks...",
                hint: "Think of 'interest' + 'ing' (causing interest)",
            },
            {
                word: "adventures",
                phonetics: "/ədˈven.tʃərz/",
                meaning: "Exciting or unusual experiences",
                context: "...new adventures and discoveries...",
                hint: "Think of 'adventure' + 's' (more than one adventure)",
            },
        ];

        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Screen elements
        this.welcomeScreen = document.getElementById("welcomeScreen");
        this.practiceInterface = document.getElementById("practiceInterface");

        // Progress elements
        this.progressSteps = document.querySelectorAll(".progress-step");
        this.currentStageEl = document.getElementById("currentStage");

        // Stage elements
        this.paragraphStage = document.getElementById("paragraphStage");
        this.sentenceStage = document.getElementById("sentenceStage");
        this.wordStage = document.getElementById("wordStage");
        this.completeStage = document.getElementById("completeStage");

        // Paragraph elements
        this.paragraphText = document.getElementById("paragraphText");
        this.paragraphAudioBtn = document.getElementById("paragraphAudioBtn");
        this.paragraphRecordBtn = document.getElementById("paragraphRecordBtn");
        this.paragraphFeedback = document.getElementById("paragraphFeedback");
        this.nextToSentence = document.getElementById("nextToSentence");

        // Sentence elements
        this.sentenceCounter = document.getElementById("sentenceCounter");
        this.currentSentenceEl = document.getElementById("currentSentence");
        this.sentenceAudioBtn = document.getElementById("sentenceAudioBtn");
        this.sentenceRecordBtn = document.getElementById("sentenceRecordBtn");
        this.sentenceFeedback = document.getElementById("sentenceFeedback");
        this.prevSentence = document.getElementById("prevSentence");
        this.nextSentence = document.getElementById("nextSentence");

        // Word elements
        this.wordCounter = document.getElementById("wordCounter");
        this.practiceWord = document.getElementById("practiceWord");
        this.wordPhonetics = document.getElementById("wordPhonetics");
        this.wordHintBtn = document.getElementById("wordHintBtn");
        this.wordAudioBtn = document.getElementById("wordAudioBtn");
        this.wordRecordBtn = document.getElementById("wordRecordBtn");
        this.wordFeedback = document.getElementById("wordFeedback");
        this.prevWord = document.getElementById("prevWord");
        this.nextWord = document.getElementById("nextWord");

        // Completion elements
        this.totalWords = document.getElementById("totalWords");
        this.totalSentences = document.getElementById("totalSentences");
        this.starsEarnedEl = document.getElementById("starsEarned");
        this.practiceAgain = document.getElementById("practiceAgain");
        this.backToProfile = document.getElementById("backToProfile");

        // Navigation elements
        this.backBtn = document.getElementById("backBtn");
        this.homeBtn = document.getElementById("homeBtn");
        this.settingsBtn = document.getElementById("settingsBtn");

        // Modal elements
        this.hintModal = document.getElementById("hintModal");
        this.closeHint = document.getElementById("closeHint");
        this.hintBody = document.getElementById("hintBody");

        // Start button
        this.startBtn = document.getElementById("startBtn");
    }

    bindEvents() {
        // Start button
        if (this.startBtn) {
            this.startBtn.addEventListener("click", () => this.startPractice());
        }

        // Navigation
        if (this.backBtn) {
            this.backBtn.addEventListener("click", () => this.goBack());
        }
        if (this.homeBtn) {
            this.homeBtn.addEventListener("click", () => this.goHome());
        }
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener("click", () =>
                this.openSettings()
            );
        }

        // Paragraph stage
        if (this.paragraphAudioBtn) {
            this.paragraphAudioBtn.addEventListener("click", () =>
                this.playParagraphAudio()
            );
        }
        if (this.paragraphRecordBtn) {
            this.paragraphRecordBtn.addEventListener("click", () =>
                this.recordParagraph()
            );
        }
        if (this.nextToSentence) {
            this.nextToSentence.addEventListener("click", () =>
                this.moveToSentenceStage()
            );
        }

        // Sentence stage
        if (this.sentenceAudioBtn) {
            this.sentenceAudioBtn.addEventListener("click", () =>
                this.playSentenceAudio()
            );
        }
        if (this.sentenceRecordBtn) {
            this.sentenceRecordBtn.addEventListener("click", () =>
                this.recordSentence()
            );
        }
        if (this.prevSentence) {
            this.prevSentence.addEventListener("click", () =>
                this.previousSentence()
            );
        }
        if (this.nextSentence) {
            this.nextSentence.addEventListener("click", () =>
                this.nextSentenceHandler()
            );
        }

        // Word stage
        if (this.wordHintBtn) {
            this.wordHintBtn.addEventListener("click", () =>
                this.showWordHint()
            );
        }
        if (this.wordAudioBtn) {
            this.wordAudioBtn.addEventListener("click", () =>
                this.playWordAudio()
            );
        }
        if (this.wordRecordBtn) {
            this.wordRecordBtn.addEventListener("click", () =>
                this.recordWord()
            );
        }
        if (this.prevWord) {
            this.prevWord.addEventListener("click", () => this.previousWord());
        }
        if (this.nextWord) {
            this.nextWord.addEventListener("click", () =>
                this.nextWordHandler()
            );
        }

        // Completion
        if (this.practiceAgain) {
            this.practiceAgain.addEventListener("click", () =>
                this.restartPractice()
            );
        }
        if (this.backToProfile) {
            this.backToProfile.addEventListener("click", () =>
                this.goToProfile()
            );
        }

        // Modal
        if (this.closeHint) {
            this.closeHint.addEventListener("click", () => this.hideHint());
        }
        if (this.hintModal) {
            this.hintModal.addEventListener("click", (e) => {
                if (e.target === this.hintModal) this.hideHint();
            });
        }

        // Keyboard shortcuts
        document.addEventListener("keydown", (e) => this.handleKeyboard(e));
    }

    async startPractice() {
        console.log("🎯 startPractice called", {
            calibrationComplete: this.calibrationComplete,
            isCalibrating: this.isCalibrating,
            buttonDataset: this.startBtn
                ? this.startBtn.dataset.calibrationComplete
                : "N/A",
        });

        // Check calibration state from instance OR from button data attribute (fallback)
        const isCalibrationComplete =
            this.calibrationComplete ||
            (this.startBtn &&
                this.startBtn.dataset.calibrationComplete === "true");

        // If calibration is not complete, start calibration first
        if (!isCalibrationComplete) {
            this.isCalibrating = true; // Set calibrating flag
            this.startBtn.disabled = true;
            this.startBtn.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> <span>Initializing eye tracking...</span>';

            // Initialize eye tracking and calibration
            initializeEyeTracking();
            return;
        }

        // If calibration is complete, start the actual reading practice
        try {
            console.log(
                "✅ Starting reading practice (calibration already complete)"
            );

            // Update instance state if it wasn't set
            if (!this.calibrationComplete) {
                this.calibrationComplete = true;
                this.isCalibrating = false;
            }

            // Show loading state
            this.startBtn.disabled = true;
            this.startBtn.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> <span>Generating practice content...</span>';
            toggleEyeTracking(true); // Pause eye tracking during content generation

            // Generate content from API
            await this.generatePracticeContent();

            // Start the practice
            this.welcomeScreen.style.display = "none";
            this.practiceInterface.style.display = "block";
            this.showParagraphStage();
            this.updateProgress();
        } catch (error) {
            console.error("Error generating practice content:", error);
            // Reset button state
            this.startBtn.disabled = false;
            this.startBtn.innerHTML =
                '<i class="fas fa-play"></i> <span>Start Reading Practice</span>';
            alert(
                "Sorry, there was an error generating practice content. Please try again."
            );
        }
    }

    async generatePracticeContent() {
        const baseUrl = "http://127.0.0.1:5001/generate";

        try {
            // Generate only the initial paragraph
            const paragraphResponse = await fetch(`${baseUrl}?q=paragraph`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            if (!paragraphResponse.ok) {
                throw new Error(
                    `Paragraph generation failed: ${paragraphResponse.status}`
                );
            }

            const paragraphData = await paragraphResponse.json();

            // Update only the paragraph content
            if (paragraphData && paragraphData.text) {
                this.paragraph = paragraphData.text;
                this.paragraphText.textContent = this.paragraph;
            }
        } catch (error) {
            console.error("API call failed:", error);
            // Keep the default content if API fails
            console.log("Using default practice content");
        }
    }

    async generateSentencesFromRecording(audioBlob) {
        const baseUrl = "http://127.0.0.1:5001";

        try {
            // Send audio to speech-to-text API
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.mp3");
            formData.append("json", this.paragraph);

            console.log("📤 Sending audio to STT API...");
            const sttResponse = await fetch(`${baseUrl}/stt`, {
                method: "POST",
                body: formData,
            });

            if (!sttResponse.ok) {
                throw new Error(`Speech-to-text failed: ${sttResponse.status}`);
            }

            const sttData = await sttResponse.json();
            console.log("✅ STT response received:", sttData);

            // Call TTS API with the recognized words
            if (sttData.words) {
                console.log("🔊 Calling TTS API with words:", sttData.words);
                
                const ttsResponse = await fetch(`${baseUrl}/tts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        words: sttData.words
                    }),
                });

                if (ttsResponse.ok) {
                    // Get base64 audio from TTS response
                    const ttsData = await ttsResponse.json();
                    
                    console.log("🎵 Playing TTS audio feedback...");
                    const audio = new Audio("data:audio/mp3;base64," + ttsData.audio);
                    audio.play();
                } else {
                    console.warn("⚠️ TTS API failed, continuing without audio feedback");
                }
            }

            // Use the words from STT response to generate sentences
            console.log("📝 Generating sentences from recognized words...");
            const sentenceResponse = await fetch(
                `${baseUrl}/generate?q=sentence`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        words: sttData.words || [],
                    }),
                }
            );

            if (!sentenceResponse.ok) {
                throw new Error(
                    `Sentence generation failed: ${sentenceResponse.status}`
                );
            }

            const sentenceData = await sentenceResponse.json();
            console.log("✅ Sentence generation complete:", sentenceData);

            // Update sentences
            if (sentenceData && sentenceData.sentences) {
                this.sentences = sentenceData.sentences;
            } else if (sentenceData && sentenceData.text) {
                this.sentences = sentenceData.text
                    .split(/[.!?]+/)
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0)
                    .map((s) => s + ".");
            }

            return true;
        } catch (error) {
            console.error("Error generating sentences from recording:", error);
            
            // Log more detailed error information
            if (error.message.includes('Failed to fetch')) {
                console.error("❌ Backend server is not running at http://127.0.0.1:5001");
            } else if (error.message.includes('Speech-to-text failed')) {
                console.error("❌ STT API error:", error.message);
            } else if (error.message.includes('Sentence generation failed')) {
                console.error("❌ Sentence generation API error:", error.message);
            } else {
                console.error("❌ Unexpected error:", error.message);
            }
            
            return false;
        }
    }

    async generateWordsFromRecording(audioBlob) {
        const baseUrl = "http://127.0.0.1:5001";

        try {
            // Send audio to speech-to-text API
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.mp3");
            formData.append("json", this.sentences[this.currentSentenceIndex]);

            const sttResponse = await fetch(`${baseUrl}/stt`, {
                method: "POST",
                body: formData,
            });

            if (!sttResponse.ok) {
                throw new Error(`Speech-to-text failed: ${sttResponse.status}`);
            }

            const sttData = await sttResponse.json();

            // Use the words from STT response to generate word practice
            const wordResponse = await fetch(`${baseUrl}/generate?q=word`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    words: sttData.words || [],
                }),
            });

            if (!wordResponse.ok) {
                throw new Error(
                    `Word generation failed: ${wordResponse.status}`
                );
            }

            const wordData = await wordResponse.json();
            console.log("✅ Word generation complete:", wordData);

            // Handle the new API response format: {"text": "asingleword"}
            if (wordData && wordData.text) {
                // Create a single word object for the word stage
                this.words = [{
                    word: wordData.text,
                    phonetics: `/${wordData.text}/`,
                    meaning: `Practice word: ${wordData.text}`,
                    context: `Focus on the word '${wordData.text}'`,
                    hint: `Think about the word '${wordData.text}' and practice saying it slowly.`,
                }];
            } else if (wordData && wordData.words) {
                // Fallback for old format
                this.words = wordData.words.map((wordInfo, index) => {
                    if (typeof wordInfo === "string") {
                        return {
                            word: wordInfo,
                            phonetics: `/${wordInfo}/`,
                            meaning: `Practice word: ${wordInfo}`,
                            context: `...${wordInfo}...`,
                            hint: `Think about the word '${wordInfo}' and practice saying it slowly.`,
                        };
                    } else {
                        return wordInfo;
                    }
                });
            }

            return true;
        } catch (error) {
            console.error("Error generating words from recording:", error);
            return false;
        }
    }

    extractWordsFromText(text) {
        // Extract words from text, filter out common words
        const words = text
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter((word) => word.length > 3)
            .filter(
                (word) =>
                    ![
                        "this",
                        "that",
                        "with",
                        "have",
                        "will",
                        "been",
                        "from",
                        "they",
                        "know",
                        "want",
                        "been",
                        "good",
                        "much",
                        "some",
                        "time",
                        "very",
                        "when",
                        "come",
                        "here",
                        "just",
                        "like",
                        "long",
                        "make",
                        "many",
                        "over",
                        "such",
                        "take",
                        "than",
                        "them",
                        "well",
                        "were",
                    ].includes(word)
            );

        // Remove duplicates and return
        return [...new Set(words)];
    }

    extractKeyWords(text) {
        // Extract key words that are good for practice (longer, more complex words)
        const words = this.extractWordsFromText(text)
            .filter((word) => word.length >= 5)
            .slice(0, 6); // Limit to 6 words for practice

        return words.length > 0
            ? words
            : [
                  "explore",
                  "beautiful",
                  "adventure",
                  "interesting",
                  "wonderful",
                  "discover",
              ];
    }

    updateProgress() {
        this.progressSteps.forEach((step, index) => {
            const stage = step.dataset.stage;
            step.className = "progress-step";

            if (stage === this.currentStage) {
                step.classList.add("active");
            } else if (this.isStageCompleted(stage)) {
                step.classList.add("completed");
            } else {
                step.classList.add("pending");
            }
        });

        // Update stage indicator
        const stageNames = {
            paragraph: "Paragraph Reading",
            sentence: "Sentence Practice",
            word: "Word Focus",
        };
        this.currentStageEl.textContent =
            stageNames[this.currentStage] || "Practice Complete";
    }

    isStageCompleted(stage) {
        switch (stage) {
            case "paragraph":
                return this.currentStage !== "paragraph";
            case "sentence":
                return (
                    this.currentStage === "word" ||
                    this.currentStage === "complete"
                );
            case "word":
                return this.currentStage === "complete";
            default:
                return false;
        }
    }

    showParagraphStage() {
        this.currentStage = "paragraph";
        this.hideAllStages();
        this.paragraphStage.style.display = "block";
        this.updateProgress();
    }

    showSentenceStage() {
        this.currentStage = "sentence";
        this.hideAllStages();
        this.sentenceStage.style.display = "block";
        this.updateSentenceDisplay();
        this.updateProgress();
    }

    showWordStage() {
        this.currentStage = "word";
        this.hideAllStages();
        this.wordStage.style.display = "block";
        this.updateWordDisplay();
        this.updateProgress();
    }

    showCompleteStage() {
        this.currentStage = "complete";
        this.hideAllStages();
        this.completeStage.style.display = "block";
        this.updateCompletionStats();
        this.updateProgress();
    }

    hideAllStages() {
        this.paragraphStage.style.display = "none";
        this.sentenceStage.style.display = "none";
        this.wordStage.style.display = "none";
        this.completeStage.style.display = "none";
    }

    // Paragraph stage methods
    playParagraphAudio() {
        this.simulateAudioPlayback(
            this.paragraphAudioBtn,
            "Playing story...",
            "Listen to Story"
        );
    }

    async recordParagraph() {
        try {
            const audioBlob = await this.recordAudio(this.paragraphRecordBtn);
            if (audioBlob) {
                // Show processing state
                this.paragraphRecordBtn.innerHTML =
                    '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
                this.paragraphRecordBtn.disabled = true;

                // Generate sentences based on the recording
                const success = await this.generateSentencesFromRecording(
                    audioBlob
                );

                if (success) {
                    this.paragraphFeedback.style.display = "block";
                    
                    // Update feedback text
                    const feedbackTextElement = this.paragraphFeedback.querySelector('.feedback-text h4');
                    if (feedbackTextElement) {
                        feedbackTextElement.textContent = "Great Reading!";
                    }
                    const feedbackDescElement = this.paragraphFeedback.querySelector('.feedback-text p');
                    if (feedbackDescElement) {
                        feedbackDescElement.textContent = "Continue to Sentences";
                    }
                    
                    this.starsEarned += 3;
                } else {
                    // Provide more specific error message
                    console.error("❌ generateSentencesFromRecording failed");
                    alert(
                        "Sorry, there was an error processing your recording. Please check that the backend server is running at http://127.0.0.1:5001. Using default sentences."
                    );
                }

                // Reset button
                this.paragraphRecordBtn.innerHTML =
                    '<i class="fas fa-microphone"></i><span>Try Again</span>';
                this.paragraphRecordBtn.disabled = false;
            }
        } catch (error) {
            console.error("Error recording paragraph:", error);
            alert(
                "Sorry, there was an error with the recording. Please try again."
            );
        }
    }

    moveToSentenceStage() {
        if (this.sentences && this.sentences.length > 0) {
            this.showSentenceStage();
        } else {
            alert(
                "Please record the paragraph first to generate sentences for practice."
            );
        }
    }

    // Sentence stage methods
    updateSentenceDisplay() {
        this.sentenceCounter.textContent = `Sentence ${
            this.currentSentenceIndex + 1
        } of ${this.sentences.length}`;
        this.currentSentenceEl.textContent =
            this.sentences[this.currentSentenceIndex];
        this.sentenceFeedback.style.display = "none";

        // Update navigation buttons
        this.prevSentence.style.display =
            this.currentSentenceIndex > 0 ? "flex" : "none";
        this.nextSentence.textContent =
            this.currentSentenceIndex < this.sentences.length - 1
                ? "Next Sentence"
                : "Continue to Words";
    }

    playSentenceAudio() {
        this.simulateAudioPlayback(
            this.sentenceAudioBtn,
            "Playing sentence...",
            "Listen"
        );
    }

    async recordSentence() {
        try {
            const audioBlob = await this.recordAudio(this.sentenceRecordBtn);
            if (audioBlob) {
                // Show processing state
                this.sentenceRecordBtn.innerHTML =
                    '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
                this.sentenceRecordBtn.disabled = true;

                // Generate words based on the recording
                const success = await this.generateWordsFromRecording(
                    audioBlob
                );

                if (success) {
                    // Show feedback with updated text
                    this.sentenceFeedback.style.display = "block";
                    
                    // Update feedback text to show "Perfect! Continue to words"
                    const feedbackTextElement = this.sentenceFeedback.querySelector('.feedback-text h4');
                    if (feedbackTextElement) {
                        feedbackTextElement.textContent = "Perfect!";
                    }
                    const feedbackDescElement = this.sentenceFeedback.querySelector('.feedback-text p');
                    if (feedbackDescElement) {
                        feedbackDescElement.textContent = "Continue to words";
                    }
                    
                    this.starsEarned += 2;
                } else {
                    alert(
                        "Sorry, there was an error processing your recording. Using default words."
                    );
                }

                // Reset button
                this.sentenceRecordBtn.innerHTML =
                    '<i class="fas fa-microphone"></i><span>Try Again</span>';
                this.sentenceRecordBtn.disabled = false;
            }
        } catch (error) {
            console.error("Error recording sentence:", error);
            alert(
                "Sorry, there was an error with the recording. Please try again."
            );
        }
    }

    previousSentence() {
        if (this.currentSentenceIndex > 0) {
            this.currentSentenceIndex--;
            this.updateSentenceDisplay();
        }
    }

    nextSentenceHandler() {
        if (this.currentSentenceIndex < this.sentences.length - 1) {
            this.currentSentenceIndex++;
            this.updateSentenceDisplay();
        } else {
            // Check if words have been generated from recording
            if (
                this.words &&
                this.words.length > 0 &&
                (this.words[0].word !== "explore" || this.words.length === 1)
            ) {
                this.showWordStage();
            } else {
                alert(
                    "Please record a sentence first to generate words for practice."
                );
            }
        }
    }

    // Word stage methods
    updateWordDisplay() {
        const word = this.words[this.currentWordIndex];
        this.wordCounter.textContent = `Word ${this.currentWordIndex + 1} of ${
            this.words.length
        }`;
        this.practiceWord.textContent = word.word;
        this.wordPhonetics.textContent = word.phonetics;

        // Update word info
        const wordInfo = this.wordStage.querySelector(".word-info");
        wordInfo.innerHTML = `
            <div class="word-meaning">
                <h4>Meaning:</h4>
                <p>${word.meaning}</p>
            </div>
            <div class="word-context">
                <h4>In the story:</h4>
                <p>${word.context}</p>
            </div>
        `;

        this.wordFeedback.style.display = "none";

        // Update navigation buttons - for single word, always show "Finish Practice"
        this.prevWord.style.display =
            this.currentWordIndex > 0 ? "flex" : "none";
        
        // If we only have one word (new API format), always show "Finish Practice"
        if (this.words.length === 1) {
            this.nextWord.textContent = "Finish Practice";
        } else {
            this.nextWord.textContent =
                this.currentWordIndex < this.words.length - 1
                    ? "Next Word"
                    : "Finish Practice";
        }
    }

    showWordHint() {
        const word = this.words[this.currentWordIndex];
        this.hintBody.innerHTML = `
            <p><strong>Hint:</strong> ${word.hint}</p>
            <p><strong>Break it down:</strong> Try to sound out each part of the word slowly.</p>
            <p><strong>Remember:</strong> Take your time and don't worry about being perfect!</p>
        `;
        this.hintModal.style.display = "flex";
    }

    hideHint() {
        this.hintModal.style.display = "none";
    }

    playWordAudio() {
        this.simulateAudioPlayback(
            this.wordAudioBtn,
            "Playing word...",
            "Listen"
        );
    }

    async recordWord() {
        try {
            const audioBlob = await this.recordAudio(this.wordRecordBtn);
            if (audioBlob) {
                // For word practice, we immediately show feedback without processing
                // No API call needed for the final word stage
                this.wordFeedback.style.display = "block";
                
                // Update feedback text to show completion
                const feedbackTextElement = this.wordFeedback.querySelector('.feedback-text h4');
                if (feedbackTextElement) {
                    feedbackTextElement.textContent = "Excellent!";
                }
                const feedbackDescElement = this.wordFeedback.querySelector('.feedback-text p');
                if (feedbackDescElement) {
                    feedbackDescElement.textContent = "Lesson completed!";
                }
                
                this.starsEarned += 1;

                // Change the "Next Word" button to "Finish Practice" since this is the final stage
                if (this.nextWord) {
                    this.nextWord.textContent = "Finish Practice";
                }
            }
        } catch (error) {
            console.error("Error recording word:", error);
            alert(
                "Sorry, there was an error with the recording. Please try again."
            );
        }
    }

    previousWord() {
        if (this.currentWordIndex > 0) {
            this.currentWordIndex--;
            this.updateWordDisplay();
        }
    }

    nextWordHandler() {
        if (this.currentWordIndex < this.words.length - 1) {
            this.currentWordIndex++;
            this.updateWordDisplay();
        } else {
            this.showCompleteStage();
        }
    }

    // Completion methods
    updateCompletionStats() {
        this.totalWords.textContent = this.words.length;
        this.totalSentences.textContent = this.sentences.length;
        this.starsEarnedEl.textContent = this.starsEarned;
    }

    restartPractice() {
        this.currentStage = "paragraph";
        this.currentSentenceIndex = 0;
        this.currentWordIndex = 0;
        this.starsEarned = 0;

        this.showParagraphStage();
        this.paragraphFeedback.style.display = "none";
        this.updateProgress();
    }

    // Utility methods
    async recordAudio(button) {
        // Prevent multiple recordings by checking if already recording
        if (this.isRecording) {
            console.log("🚫 Recording already in progress, ignoring click");
            return null;
        }

        try {
            this.isRecording = true;
            console.log("🎙️ Starting new recording session...");

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            // Create MediaRecorder
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            // Update button to show recording state
            const originalContent = button.innerHTML;
            button.innerHTML =
                '<i class="fas fa-stop"></i><span>Recording... (Click to stop)</span>';
            button.disabled = false;

            // Collect audio data
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                    console.log("📝 Audio data chunk received:", event.data.size, "bytes");
                }
            };

            // Handle recording completion
            return new Promise((resolve, reject) => {
                let isRecordingStopped = false;

                const cleanup = () => {
                    // Stop all tracks to release microphone
                    stream.getTracks().forEach((track) => track.stop());
                    this.isRecording = false; // Reset recording flag
                    console.log("🧹 Cleanup completed, microphone released");
                };

                mediaRecorder.onstop = () => {
                    if (isRecordingStopped) return; // Prevent multiple calls
                    isRecordingStopped = true;

                    console.log("🛑 MediaRecorder stopped, processing audio chunks...");
                    console.log("📊 Total audio chunks:", audioChunks.length);

                    if (audioChunks.length === 0) {
                        console.error("❌ No audio data recorded");
                        cleanup();
                        button.innerHTML = originalContent;
                        button.disabled = false;
                        reject(new Error("No audio data recorded"));
                        return;
                    }

                    const audioBlob = new Blob(audioChunks, {
                        type: "audio/mp3",
                    });

                    cleanup();

                    // Reset button
                    button.innerHTML = originalContent;
                    button.disabled = false;
                    
                    console.log("🎙️ Recording stopped, audio blob created:", audioBlob.size, "bytes");
                    console.log("✅ Recording session complete, ready for next recording");
                    resolve(audioBlob);
                };

                mediaRecorder.onerror = (event) => {
                    if (isRecordingStopped) return; // Prevent multiple calls
                    isRecordingStopped = true;

                    cleanup();

                    // Reset button
                    button.innerHTML = originalContent;
                    button.disabled = false;
                    
                    console.error("🎙️ Recording error:", event.error);
                    reject(new Error("Recording failed: " + event.error));
                };

                // Start recording
                mediaRecorder.start(1000); // Collect data every 1 second
                console.log("🎙️ Recording started...");

                // Stop recording when button is clicked again
                const stopRecording = (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    console.log("🛑 Stop button clicked, current state:", mediaRecorder.state);
                    
                    if (mediaRecorder.state === "recording" && !isRecordingStopped) {
                        console.log("🎙️ Stopping recording...");
                        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Stopping...</span>';
                        button.disabled = true;
                        
                        // Remove the event listener immediately to prevent multiple clicks
                        button.removeEventListener("click", stopRecording);
                        
                        mediaRecorder.stop();
                        console.log("🎙️ Recording stop requested by user");
                    }
                };

                // Add the stop recording listener
                button.addEventListener("click", stopRecording);
            });
        } catch (error) {
            this.isRecording = false; // Reset flag on error
            console.error("Error accessing microphone:", error);
            alert("Please allow microphone access to use this feature.");
            return null;
        }
    }

    async playAudioBlob(audioBlob) {
        return new Promise((resolve, reject) => {
            try {
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                
                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    console.log("🎵 TTS audio playback complete");
                    resolve();
                };
                
                audio.onerror = (error) => {
                    URL.revokeObjectURL(audioUrl);
                    console.error("🎵 Audio playback error:", error);
                    reject(error);
                };
                
                audio.play().catch(error => {
                    URL.revokeObjectURL(audioUrl);
                    console.error("🎵 Audio play failed:", error);
                    reject(error);
                });
                
                console.log("🎵 Playing TTS audio feedback...");
            } catch (error) {
                console.error("🎵 Error creating audio:", error);
                reject(error);
            }
        });
    }

    simulateAudioPlayback(button, playingText, normalText) {
        const originalContent = button.innerHTML;
        button.innerHTML = `<i class="fas fa-volume-up"></i><span>${playingText}</span>`;
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalContent;
            button.disabled = false;
        }, 2000);
    }

    simulateRecording(button, callback) {
        // This method is no longer used but kept for compatibility
        const originalContent = button.innerHTML;
        button.innerHTML =
            '<i class="fas fa-stop"></i><span>Recording...</span>';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML =
                '<i class="fas fa-microphone"></i><span>Processing...</span>';

            setTimeout(() => {
                button.innerHTML = originalContent;
                button.disabled = false;
                if (callback) callback();
            }, 1500);
        }, 2000);
    }

    // Navigation methods
    goBack() {
        window.history.back();
    }

    goHome() {
        window.location.href = "profile.html";
    }

    goToProfile() {
        window.location.href = "profile.html";
    }

    openSettings() {
        console.log("Settings clicked");
    }

    // Keyboard shortcuts
    handleKeyboard(e) {
        switch (e.key) {
            case " ":
                e.preventDefault();
                if (
                    this.currentStage === "paragraph" &&
                    this.paragraphRecordBtn.style.display !== "none"
                ) {
                    this.recordParagraph();
                } else if (
                    this.currentStage === "sentence" &&
                    this.sentenceRecordBtn.style.display !== "none"
                ) {
                    this.recordSentence();
                } else if (
                    this.currentStage === "word" &&
                    this.wordRecordBtn.style.display !== "none"
                ) {
                    this.recordWord();
                }
                break;
            case "h":
                e.preventDefault();
                if (this.currentStage === "word") {
                    this.showWordHint();
                }
                break;
            case "a":
                e.preventDefault();
                if (this.currentStage === "paragraph") {
                    this.playParagraphAudio();
                } else if (this.currentStage === "sentence") {
                    this.playSentenceAudio();
                } else if (this.currentStage === "word") {
                    this.playWordAudio();
                }
                break;
            case "ArrowRight":
                e.preventDefault();
                if (
                    this.currentStage === "sentence" &&
                    this.nextSentence.style.display !== "none"
                ) {
                    this.nextSentenceHandler();
                } else if (
                    this.currentStage === "word" &&
                    this.nextWord.style.display !== "none"
                ) {
                    this.nextWordHandler();
                }
                break;
            case "ArrowLeft":
                e.preventDefault();
                if (
                    this.currentStage === "sentence" &&
                    this.prevSentence.style.display !== "none"
                ) {
                    this.previousSentence();
                } else if (
                    this.currentStage === "word" &&
                    this.prevWord.style.display !== "none"
                ) {
                    this.previousWord();
                }
                break;
            case "Escape":
                this.hideHint();
                break;
        }
    }
}

// Initialize the practice when the page loads
document.addEventListener("DOMContentLoaded", () => {
    window.readingPracticeInstance = new ReadingPractice();
});

// Add entrance animations
document.addEventListener("DOMContentLoaded", () => {
    const welcomeCards = document.querySelectorAll(".info-card");
    welcomeCards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {
            card.style.transition = "all 0.6s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 200 + 500);
    });

    const startBtn = document.querySelector(".start-btn");
    startBtn.style.opacity = "0";
    startBtn.style.transform = "translateY(20px)";

    setTimeout(() => {
        startBtn.style.transition = "all 0.6s ease";
        startBtn.style.opacity = "1";
        startBtn.style.transform = "translateY(0)";
    }, 1200);
});

// ===== EYE TRACKING FUNCTIONALITY =====
// WebGazer Eye Tracking Implementation
let isCalibrated = false;
let gazeData = [];
let calibrationStarted = false;

function initializeEyeTracking() {
    console.log("🦊 Initializing eye tracking...");

    // Initialize webgazer with proper settings
    webgazer
        .setRegression("ridge") // Use ridge regression
        .setTracker("TFFacemesh") // Use TensorFlow Facemesh for better accuracy
        .setGazeListener(function (data, elapsedTime) {
            if (data == null) {
                return;
            }

            // Only process gaze data after calibration
            if (!isCalibrated) {
                return;
            }

            const x = data.x;
            const y = data.y;

            // Store recent gaze data for smoothing
            gazeData.push({ x, y, time: Date.now() });

            // Keep only last 10 points
            if (gazeData.length > 10) {
                gazeData.shift();
            }

            // Calculate smoothed position (average of recent points)
            const smoothedX =
                gazeData.reduce((sum, d) => sum + d.x, 0) / gazeData.length;
            const smoothedY =
                gazeData.reduce((sum, d) => sum + d.y, 0) / gazeData.length;

            // Find the element at the gaze position
            const element = document.elementFromPoint(smoothedX, smoothedY);

            if (element) {
                // Get the text content of the element being looked at
                const textContent = element.textContent.trim();

                // Only log if there's actual text content and it's not too long
                if (
                    textContent &&
                    textContent.length > 0 &&
                    textContent.length < 100
                ) {
                    // Split into words and find the closest word to the gaze point
                    const words = extractWordsFromElement(
                        element,
                        smoothedX,
                        smoothedY
                    );

                    if (words && words.length > 0) {
                        console.log("👁️ Looking at word:", words);
                    }
                }
            }
        })
        .saveDataAcrossSessions(true)
        .begin();

    // Configure webgazer settings
    webgazer
        .showVideoPreview(true) // Show video preview for calibration
        .showPredictionPoints(true) // Show where the user is looking
        .applyKalmanFilter(true); // Smoothing filter for better accuracy

    // Wait for video to initialize, then show calibration
    setTimeout(() => {
        if (!calibrationStarted) {
            showCalibrationScreen();
            calibrationStarted = true;
        }
    }, 2000);
}

function showCalibrationScreen() {
    console.log("📋 Showing calibration screen...");

    // Create calibration overlay
    const calibrationDiv = document.createElement("div");
    calibrationDiv.id = "calibrationScreen";
    calibrationDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0, 0, 0, 0.9); z-index: 10000; color: white;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        text-align: center; max-width: 600px; padding: 20px;">
                <h2 style="font-size: 2em; margin-bottom: 20px;">🎯 Eye Tracking Calibration</h2>
                <p style="font-size: 1.2em; margin-bottom: 15px;">
                    Click on each dot that appears and STARE at it for 2 seconds.<br>
                    Keep your head still and only move your eyes.
                </p>
                <p style="font-size: 1em; margin-bottom: 30px; color: #aaa;">
                    Make sure your face is visible in the video preview in the corner.
                </p>
                <div id="calibrationProgress" style="font-size: 1.5em; margin-bottom: 20px;">
                    Point <span id="currentPoint">0</span> of 9
                </div>
                <button id="startCalibration" style="padding: 15px 30px; font-size: 1.2em; 
                        background: #4CAF50; color: white; border: none; border-radius: 5px; 
                        cursor: pointer;">
                    Start Calibration
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(calibrationDiv);

    document
        .getElementById("startCalibration")
        .addEventListener("click", startCalibration);
}

function startCalibration() {
    const calibrationScreen = document.getElementById("calibrationScreen");
    const startButton = document.getElementById("startCalibration");
    startButton.style.display = "none";

    // Define 9 calibration points (3x3 grid)
    const points = [
        { x: 10, y: 10 }, // Top-left
        { x: 50, y: 10 }, // Top-center
        { x: 90, y: 10 }, // Top-right
        { x: 10, y: 50 }, // Middle-left
        { x: 50, y: 50 }, // Center
        { x: 90, y: 50 }, // Middle-right
        { x: 10, y: 90 }, // Bottom-left
        { x: 50, y: 90 }, // Bottom-center
        { x: 90, y: 90 }, // Bottom-right
    ];

    let currentPointIndex = 0;

    function showNextPoint() {
        if (currentPointIndex >= points.length) {
            finishCalibration();
            return;
        }

        // Update progress
        document.getElementById("currentPoint").textContent =
            currentPointIndex + 1;

        const point = points[currentPointIndex];

        // Create calibration dot
        const dot = document.createElement("div");
        dot.className = "calibration-dot";
        dot.style.cssText = `
            position: fixed;
            left: ${point.x}%;
            top: ${point.y}%;
            width: 30px;
            height: 30px;
            background: red;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
            z-index: 10001;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
            animation: pulse 1s infinite;
        `;

        calibrationScreen.appendChild(dot);

        // Click handler
        dot.addEventListener("click", function () {
            // Change color to indicate recording
            this.style.background = "yellow";

            // Record gaze data for this point
            const startTime = Date.now();
            const recordDuration = 2000; // 2 seconds

            const recordInterval = setInterval(() => {
                const rect = dot.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Manually add calibration point to webgazer
                webgazer.recordScreenPosition(centerX, centerY);

                if (Date.now() - startTime >= recordDuration) {
                    clearInterval(recordInterval);
                    dot.style.background = "green";

                    setTimeout(() => {
                        dot.remove();
                        currentPointIndex++;
                        showNextPoint();
                    }, 300);
                }
            }, 100);
        });
    }

    showNextPoint();
}

function finishCalibration() {
    console.log("✅ Calibration complete!");
    isCalibrated = true;

    // Hide prediction points after calibration
    webgazer.showPredictionPoints(false);

    // IMMEDIATELY update the button state
    const startBtn = document.getElementById("startBtn");
    const readingPractice = window.readingPracticeInstance;

    console.log("🔄 Updating button immediately after calibration...");
    console.log("🔍 Debug info:", {
        startBtn: startBtn,
        startBtnExists: !!startBtn,
        readingPractice: readingPractice,
        readingPracticeExists: !!readingPractice,
        windowKeys: Object.keys(window).filter(
            (k) => k.includes("reading") || k.includes("Reading")
        ),
    });

    if (readingPractice && startBtn) {
        readingPractice.calibrationComplete = true;
        readingPractice.isCalibrating = false;
        startBtn.disabled = false;
        startBtn.innerHTML =
            '<i class="fas fa-play"></i> <span>Start Reading Practice</span>';
        console.log("✅ Button updated in finishCalibration");
    } else {
        console.error(
            "❌ Failed to find button or instance in finishCalibration"
        );

        // Try alternative approach - directly update button without instance
        if (startBtn) {
            console.log("⚠️ Updating button without instance reference");
            startBtn.disabled = false;
            startBtn.innerHTML =
                '<i class="fas fa-play"></i> <span>Start Reading Practice</span>';
            startBtn.dataset.calibrationComplete = "true"; // Store state in button itself
            console.log("✅ Button updated via fallback method");
        } else {
            console.error("❌ Start button not found in DOM!");
        }
    }

    // Remove the calibration screen
    const calibrationScreen = document.getElementById("calibrationScreen");
    if (calibrationScreen) {
        calibrationScreen.remove();
        console.log("✅ Calibration screen removed");
    }

    // Add floating toggle button for video preview
    addVideoToggleButton();

    toggleEyeTracking(false); // Resume eye tracking

    console.log("👁️ Eye tracking active. Ready to start reading practice!");
}

// Add a floating button to toggle video preview
function addVideoToggleButton() {
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "floatingVideoToggle";
    toggleBtn.innerHTML = `
        <span id="toggleBtnText">👁️ Hide Video</span>
    `;
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 12px 20px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 25px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
    `;

    toggleBtn.addEventListener("mouseenter", () => {
        toggleBtn.style.transform = "scale(1.05)";
        toggleBtn.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.4)";
    });

    toggleBtn.addEventListener("mouseleave", () => {
        toggleBtn.style.transform = "scale(1)";
        toggleBtn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
    });

    // Check current video state from webgazer
    let videoVisible = webgazer.params.showVideo !== false;

    // Update initial button state
    setTimeout(() => {
        const btnText = document.getElementById("toggleBtnText");
        if (btnText) {
            if (videoVisible) {
                btnText.textContent = "👁️ Hide Video";
                toggleBtn.style.background = "#2196F3";
            } else {
                btnText.textContent = "👁️ Show Video";
                toggleBtn.style.background = "#FF5722";
            }
        }
    }, 100);

    toggleBtn.addEventListener("click", () => {
        videoVisible = !videoVisible;
        webgazer.showVideoPreview(videoVisible);

        // Update button text and style
        const btnText = document.getElementById("toggleBtnText");
        if (videoVisible) {
            btnText.textContent = "👁️ Hide Video";
            toggleBtn.style.background = "#2196F3";
        } else {
            btnText.textContent = "👁️ Show Video";
            toggleBtn.style.background = "#FF5722";
        }

        console.log(
            videoVisible ? "📹 Video preview shown" : "📹 Video preview hidden"
        );
    });

    document.body.appendChild(toggleBtn);
}

// Extract words from an element based on gaze position
function extractWordsFromElement(element, x, y) {
    const text = element.textContent.trim();

    // If it's a short text node (likely a single word or phrase), return it
    if (text.split(/\s+/).length <= 5) {
        return text;
    }

    // For longer text, try to find the specific word being looked at
    // This is a simplified approach - could be enhanced with more precise text positioning
    const rect = element.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;

    // Get words from the element
    const words = text.split(/\s+/).filter((word) => word.length > 0);

    // Calculate approximate word position (simplified)
    // In a production app, you'd want to use Range and getBoundingClientRect for each word
    const estimatedWordIndex = Math.floor(
        (relativeX / rect.width) * words.length
    );
    const wordIndex = Math.max(
        0,
        Math.min(estimatedWordIndex, words.length - 1)
    );

    return words[wordIndex] || text;
}

// Function to pause/resume eye tracking
function toggleEyeTracking(pause = true) {
    if (pause) {
        webgazer.pause();
        console.log("⏸️ Eye tracking paused");
    } else {
        webgazer.resume();
        console.log("▶️ Eye tracking resumed");
    }
}

// Function to hide/show video preview
function toggleVideoPreview(show = true) {
    webgazer.showVideoPreview(show);
}

// Function to hide/show prediction points
function togglePredictionPoints(show = true) {
    webgazer.showPredictionPoints(show);
}

// Add CSS animation for calibration dots
const eyeTrackingStyle = document.createElement("style");
eyeTrackingStyle.textContent = `
    @keyframes pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.2); }
    }
`;
document.head.appendChild(eyeTrackingStyle);
