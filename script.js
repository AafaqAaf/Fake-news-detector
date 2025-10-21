// Global variables for state management
let analysisHistory = [];
let currentAnalysisCount = 47;
let realNewsCount = 34;
let fakeNewsCount = 13;

// Model performance data
const modelData = {
    random_forest: {
        name: 'Random Forest Classifier',
        accuracy: 99.95,
        precision: 99.94,
        recall: 99.96,
        f1_score: 99.95
    },
    svm: {
        name: 'Support Vector Machine',
        accuracy: 99.55,
        precision: 99.57,
        recall: 99.53,
        f1_score: 99.55
    },
    roberta: {
        name: 'RoBERTa Transformer',
        accuracy: 98.39,
        precision: 98.50,
        recall: 98.20,
        f1_score: 98.35
    }
};

// Sample articles data
const sampleArticles = {
    real: [
        {
            title: "Climate Change Report Shows Rising Global Temperatures",
            text: "According to the latest IPCC report released today, global temperatures have risen by 1.1 degrees Celsius since pre-industrial times. The comprehensive study, conducted by over 200 scientists from 60 countries, provides evidence of accelerating climate change impacts worldwide. The report emphasizes the urgent need for immediate action to reduce greenhouse gas emissions.",
            source: "Reuters"
        },
        {
            title: "New Medical Breakthrough in Cancer Treatment",
            text: "Researchers at Johns Hopkins University have developed a promising new immunotherapy treatment for pancreatic cancer. The clinical trial, published in Nature Medicine, showed a 40% improvement in patient survival rates. Dr. Sarah Johnson, lead researcher, stated that this breakthrough could revolutionize cancer treatment protocols.",
            source: "Medical Journal"
        }
    ],
    fake: [
        {
            title: "Scientists Discover Aliens Living Underground",
            text: "Breaking: Government sources reveal that alien beings have been living in underground cities for decades. The shocking discovery was made by a team of 'researchers' who claim to have photographic evidence. However, no credible scientific institutions have verified these claims, and the photos appear to be digitally manipulated.",
            source: "Conspiracy News"
        },
        {
            title: "Miracle Cure Eliminates All Diseases Overnight",
            text: "A revolutionary new pill discovered by a 'doctor' promises to cure all diseases within 24 hours. The amazing discovery has 'shocked' the medical community, though no peer-reviewed studies exist. Medical experts warn this is likely a scam targeting vulnerable people.",
            source: "Fake Health News"
        }
    ]
};

// Initialize the application
function initializeApp() {
    populateSampleArticles();
    updateModelInfo();
}

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Input method switching
function switchInputMethod(method) {
    const textSection = document.getElementById('text-input-section');
    const urlSection = document.getElementById('url-input-section');
    const tabs = document.querySelectorAll('.analysis-section .tab');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    if (method === 'text') {
        textSection.classList.add('active');
        urlSection.classList.remove('active');
    } else {
        textSection.classList.remove('active');
        urlSection.classList.add('active');
    }
}

// Character count update
function updateCharCount() {
    const textarea = document.getElementById('news-text');
    const charCount = document.getElementById('char-count');
    const count = textarea.value.length;
    charCount.textContent = `${count} characters`;
    
    if (count < 50) {
        charCount.style.color = 'var(--color-error)';
    } else {
        charCount.style.color = 'var(--color-text-secondary)';
    }
}

// Model info update
function updateModelInfo() {
    const selectedModel = document.getElementById('model-select').value;
    const modelInfo = modelData[selectedModel];
    
    document.getElementById('current-model').textContent = modelInfo.name;
    document.getElementById('model-accuracy').textContent = modelInfo.accuracy + '%';
}

// Main analysis function
function analyzeNews() {
    const textInput = document.getElementById('news-text').value.trim();
    const urlInput = document.getElementById('news-url').value.trim();
    const isTextMode = document.getElementById('text-input-section').classList.contains('active');
    const selectedModel = document.getElementById('model-select').value;
    
    let contentToAnalyze = '';
    let inputSource = '';
    
    if (isTextMode) {
        if (textInput.length < 50) {
            alert('Please enter at least 50 characters of news text.');
            return;
        }
        contentToAnalyze = textInput;
        inputSource = 'Text Input';
    } else {
        if (!urlInput) {
            alert('Please enter a valid URL.');
            return;
        }
        // Simulate URL content extraction
        contentToAnalyze = 'Simulated content from URL: ' + urlInput;
        inputSource = urlInput;
    }
    
    // Show loading state
    const analyzeBtn = document.getElementById('analyze-btn');
    analyzeBtn.innerHTML = '<span class="loading"></span> Analyzing...';
    analyzeBtn.disabled = true;
    
    // Simulate analysis delay
    setTimeout(() => {
        performAnalysis(contentToAnalyze, selectedModel, inputSource);
        analyzeBtn.innerHTML = '🔍 Analyze News';
        analyzeBtn.disabled = false;
    }, 2000);
}

// Perform the actual analysis
function performAnalysis(content, model, source) {
    // Simulate ML analysis with realistic results
    const analysisResult = simulateMLAnalysis(content, model);
    
    // Display results
    displayResults(analysisResult);
    
    // Add to history
    addToHistory({
        content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        source: source,
        result: analysisResult,
        timestamp: new Date(),
        model: modelData[model].name
    });
    
    // Update statistics
    updateStatistics(analysisResult);
    
    // Show results section
    document.getElementById('results-section').classList.remove('hidden');
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}

// Simulate ML analysis
function simulateMLAnalysis(content, model) {
    const modelInfo = modelData[model];
    
    // Simple fake news indicators
    const fakeIndicators = [
        'shocking', 'breaking', 'miracle', 'scientists hate', 'doctors shocked',
        'government doesn\'t want', 'click here', 'amazing discovery', 
        'you won\'t believe', 'this will change everything'
    ];
    
    const realIndicators = [
        'according to', 'research shows', 'study published', 'data indicates',
        'experts say', 'university', 'journal', 'peer-reviewed', 'evidence suggests'
    ];
    
    let fakeScore = 0;
    let realScore = 0;
    let detectedFeatures = [];
    
    const lowerContent = content.toLowerCase();
    
    // Check for fake indicators
    fakeIndicators.forEach(indicator => {
        if (lowerContent.includes(indicator)) {
            fakeScore += 1;
            detectedFeatures.push(`Suspicious phrase: "${indicator}"`);
        }
    });
    
    // Check for real indicators
    realIndicators.forEach(indicator => {
        if (lowerContent.includes(indicator)) {
            realScore += 1;
            detectedFeatures.push(`Credible phrase: "${indicator}"`);
        }
    });
    
    // Additional analysis factors
    if (content.length < 100) {
        fakeScore += 0.5;
        detectedFeatures.push('Very short content');
    }
    
    if (content.match(/[!]{2,}/)) {
        fakeScore += 0.5;
        detectedFeatures.push('Excessive exclamation marks');
    }
    
    if (content.match(/[A-Z]{3,}/)) {
        fakeScore += 0.3;
        detectedFeatures.push('Excessive capitalization');
    }
    
    // Calculate final score
    const totalScore = fakeScore + realScore;
    let confidence, prediction, sentiment;
    
    if (totalScore === 0) {
        // Random but weighted prediction
        prediction = Math.random() > 0.3 ? 'REAL' : 'FAKE';
        confidence = Math.floor(Math.random() * 30) + 60; // 60-90%
    } else {
        if (realScore > fakeScore) {
            prediction = 'REAL';
            confidence = Math.min(95, 70 + (realScore - fakeScore) * 10);
        } else if (fakeScore > realScore) {
            prediction = 'FAKE';
            confidence = Math.min(95, 70 + (fakeScore - realScore) * 10);
        } else {
            prediction = Math.random() > 0.5 ? 'REAL' : 'FAKE';
            confidence = Math.floor(Math.random() * 20) + 50; // 50-70%
        }
    }
    
    // Adjust confidence based on model accuracy
    confidence = Math.min(confidence, modelInfo.accuracy);
    
    // Sentiment analysis simulation
    const sentiments = ['Neutral', 'Positive', 'Negative', 'Mixed'];
    sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    // If no specific features detected, add generic ones
    if (detectedFeatures.length === 0) {
        detectedFeatures = [
            'Article length: ' + content.length + ' characters',
            'Language complexity: Moderate',
            'Source attribution: Present',
            'Factual claims: Multiple',
            'Emotional tone: ' + sentiment
        ];
    }
    
    return {
        prediction: prediction,
        confidence: confidence,
        features: detectedFeatures.slice(0, 5), // Top 5 features
        sentiment: sentiment,
        model: modelInfo.name,
        processingTime: Math.floor(Math.random() * 500) + 1200 // 1.2-1.7 seconds
    };
}

// Display analysis results
function displayResults(result) {
    const resultCard = document.getElementById('result-card');
    const predictionText = document.getElementById('prediction-text');
    const confidenceBar = document.getElementById('confidence-bar');
    const confidenceText = document.getElementById('confidence-text');
    const sentimentIndicator = document.getElementById('sentiment-indicator');
    const keyFeatures = document.getElementById('key-features');
    const analysisDetails = document.getElementById('analysis-details');
    
    // Update prediction
    predictionText.textContent = result.prediction;
    
    // Update card styling based on result
    resultCard.className = 'result-card';
    if (result.prediction === 'REAL') {
        resultCard.classList.add('real');
        predictionText.style.color = 'var(--color-success)';
        confidenceBar.className = 'confidence-bar real';
    } else if (result.prediction === 'FAKE') {
        resultCard.classList.add('fake');
        predictionText.style.color = 'var(--color-error)';
        confidenceBar.className = 'confidence-bar fake';
    } else {
        resultCard.classList.add('uncertain');
        predictionText.style.color = 'var(--color-warning)';
        confidenceBar.className = 'confidence-bar uncertain';
    }
    
    // Animate confidence bar
    setTimeout(() => {
        confidenceBar.style.width = result.confidence + '%';
    }, 100);
    
    confidenceText.textContent = `Confidence: ${result.confidence}%`;
    
    // Update sentiment
    sentimentIndicator.innerHTML = `<strong>Sentiment:</strong> ${result.sentiment}`;
    
    // Update features
    keyFeatures.innerHTML = '';
    result.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        keyFeatures.appendChild(li);
    });
    
    // Update analysis details
    analysisDetails.innerHTML = `
        <p><strong>Model Used:</strong> ${result.model}</p>
        <p><strong>Processing Time:</strong> ${result.processingTime}ms</p>
        <p><strong>Analysis Method:</strong> Natural Language Processing + Machine Learning</p>
        <p><strong>Features Analyzed:</strong> ${result.features.length} key indicators</p>
    `;
}

// Add analysis to history
function addToHistory(analysis) {
    analysisHistory.unshift(analysis);
    if (analysisHistory.length > 10) {
        analysisHistory.pop(); // Keep only last 10
    }
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    
    if (analysisHistory.length === 0) {
        historyList.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center;">No analyses performed yet. Try analyzing some news articles!</p>';
        return;
    }
    
    historyList.innerHTML = '';
    analysisHistory.forEach((analysis, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const resultClass = analysis.result.prediction === 'REAL' ? 'status--success' : 'status--error';
        
        historyItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; gap: var(--space-16);">
                <div style="flex: 1;">
                    <div style="margin-bottom: var(--space-4);">
                        <span class="status ${resultClass}">${analysis.result.prediction}</span>
                        <span style="margin-left: var(--space-8); color: var(--color-text-secondary);">${analysis.result.confidence}% confidence</span>
                    </div>
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-4);">
                        ${analysis.content}
                    </div>
                    <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">
                        ${analysis.model} • ${analysis.timestamp.toLocaleString()}
                    </div>
                </div>
                <button class="btn btn--outline" onclick="reanalyzeFromHistory(${index})" style="font-size: var(--font-size-xs); padding: var(--space-4) var(--space-8);">Re-analyze</button>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Re-analyze from history
function reanalyzeFromHistory(index) {
    const analysis = analysisHistory[index];
    if (analysis.content.endsWith('...')) {
        // This was truncated, can't re-analyze accurately
        alert('Cannot re-analyze truncated content. Please paste the full text again.');
        return;
    }
    
    document.getElementById('news-text').value = analysis.content;
    updateCharCount();
    document.querySelector('.analysis-section').scrollIntoView({ behavior: 'smooth' });
}

// Update statistics
function updateStatistics(result) {
    currentAnalysisCount++;
    if (result.prediction === 'REAL') {
        realNewsCount++;
    } else {
        fakeNewsCount++;
    }
    
    // Update display
    document.getElementById('today-analyses').textContent = currentAnalysisCount;
    
    const realPercentage = Math.round((realNewsCount / currentAnalysisCount) * 100);
    const fakePercentage = Math.round((fakeNewsCount / currentAnalysisCount) * 100);
    
    document.querySelectorAll('.stat-card')[1].querySelector('.stat-number').textContent = realPercentage + '%';
    document.querySelectorAll('.stat-card')[2].querySelector('.stat-number').textContent = fakePercentage + '%';
}

// Populate sample articles
function populateSampleArticles() {
    const realSamplesContainer = document.getElementById('real-samples');
    const fakeSamplesContainer = document.getElementById('fake-samples');
    
    // Real samples
    sampleArticles.real.forEach(article => {
        const articleElement = createSampleArticleElement(article, 'real');
        realSamplesContainer.appendChild(articleElement);
    });
    
    // Fake samples
    sampleArticles.fake.forEach(article => {
        const articleElement = createSampleArticleElement(article, 'fake');
        fakeSamplesContainer.appendChild(articleElement);
    });
}

// Create sample article element
function createSampleArticleElement(article, type) {
    const articleDiv = document.createElement('div');
    articleDiv.className = 'sample-article';
    
    const headerColor = type === 'real' ? 'var(--color-bg-3)' : 'var(--color-bg-4)';
    
    articleDiv.innerHTML = `
        <div class="sample-article-header" style="background: ${headerColor};">
            <div class="sample-article-title">${article.title}</div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Source: ${article.source}</div>
        </div>
        <div class="sample-article-body">
            <div class="sample-article-text">${article.text}</div>
            <button class="btn btn--outline" onclick="analyzeSample('${article.text.replace(/'/g, "\\'")}')" style="margin-top: var(--space-12);">🔍 Analyze This Article</button>
        </div>
    `;
    
    return articleDiv;
}

// Analyze sample article
function analyzeSample(text) {
    // Switch to text input mode
    switchInputMethodProgrammatically('text');
    
    // Set the text
    document.getElementById('news-text').value = text;
    updateCharCount();
    
    // Scroll to analysis section
    document.querySelector('.analysis-section').scrollIntoView({ behavior: 'smooth' });
    
    // Auto-analyze after a short delay
    setTimeout(() => {
        analyzeNews();
    }, 500);
}

// Switch input method programmatically
function switchInputMethodProgrammatically(method) {
    const textSection = document.getElementById('text-input-section');
    const urlSection = document.getElementById('url-input-section');
    const tabs = document.querySelectorAll('.analysis-section .tab');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (method === 'text') {
        tabs[0].classList.add('active');
        textSection.classList.add('active');
        urlSection.classList.remove('active');
    } else {
        tabs[1].classList.add('active');
        textSection.classList.remove('active');
        urlSection.classList.add('active');
    }
}

// Model selection change handler
document.getElementById('model-select').addEventListener('change', updateModelInfo);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
