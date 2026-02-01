// ===================================
// Global Variables and State
// ===================================

let currentContent = {
    blog: '',
    twitter: [],
    linkedin: ''
};

let isEditing = {
    blog: false,
    twitter: false,
    linkedin: false
};

// ===================================
// DOM Elements
// ===================================

const elements = {
    // Input Section
    videoUrl: document.getElementById('videoUrl'),
    submitBtn: document.getElementById('submitBtn'),
    errorMessage: document.getElementById('errorMessage'),
    exampleBtns: document.querySelectorAll('.example-btn'),
    
    // Sections
    inputSection: document.getElementById('inputSection'),
    processingSection: document.getElementById('processingSection'),
    resultsSection: document.getElementById('resultsSection'),
    
    // Processing
    processingTitle: document.getElementById('processingTitle'),
    processingMessage: document.getElementById('processingMessage'),
    progressBar: document.getElementById('progressBar'),
    progressText: document.getElementById('progressText'),
    cancelBtn: document.getElementById('cancelBtn'),
    
    // Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    blogPanel: document.getElementById('blogPanel'),
    twitterPanel: document.getElementById('twitterPanel'),
    linkedinPanel: document.getElementById('linkedinPanel'),
    
    // Content Areas
    blogContent: document.getElementById('blogContent'),
    twitterContent: document.getElementById('twitterContent'),
    linkedinContent: document.getElementById('linkedinContent'),
    
    // Metadata
    blogWordCount: document.getElementById('blogWordCount'),
    blogReadTime: document.getElementById('blogReadTime'),
    linkedinWordCount: document.getElementById('linkedinWordCount'),
    twitterCount: document.getElementById('twitterCount'),
    
    // Action Buttons
    editBlogBtn: document.getElementById('editBlogBtn'),
    copyBlogBtn: document.getElementById('copyBlogBtn'),
    downloadBlogBtn: document.getElementById('downloadBlogBtn'),
    
    editTwitterBtn: document.getElementById('editTwitterBtn'),
    copyTwitterBtn: document.getElementById('copyTwitterBtn'),
    downloadTwitterBtn: document.getElementById('downloadTwitterBtn'),
    
    editLinkedinBtn: document.getElementById('editLinkedinBtn'),
    copyLinkedinBtn: document.getElementById('copyLinkedinBtn'),
    downloadLinkedinBtn: document.getElementById('downloadLinkedinBtn'),
    
    newVideoBtn: document.getElementById('newVideoBtn'),
    
    // Toast
    toast: document.getElementById('toast')
};

// ===================================
// Event Listeners
// ===================================

// Submit button click
elements.submitBtn.addEventListener('click', handleSubmit);

// Enter key in input field
elements.videoUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSubmit();
    }
});

// Example buttons
elements.exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.videoUrl.value = btn.dataset.url;
        hideError();
    });
});

// Cancel button
elements.cancelBtn.addEventListener('click', cancelProcessing);

// Tab switching
elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
    });
});

// Blog actions
elements.editBlogBtn.addEventListener('click', () => toggleEdit('blog'));
elements.copyBlogBtn.addEventListener('click', () => copyContent('blog'));
elements.downloadBlogBtn.addEventListener('click', () => downloadContent('blog'));

// Twitter actions
elements.editTwitterBtn.addEventListener('click', () => toggleEdit('twitter'));
elements.copyTwitterBtn.addEventListener('click', () => copyContent('twitter'));
elements.downloadTwitterBtn.addEventListener('click', () => downloadContent('twitter'));

// LinkedIn actions
elements.editLinkedinBtn.addEventListener('click', () => toggleEdit('linkedin'));
elements.copyLinkedinBtn.addEventListener('click', () => copyContent('linkedin'));
elements.downloadLinkedinBtn.addEventListener('click', () => downloadContent('linkedin'));

// New video button
elements.newVideoBtn.addEventListener('click', resetToInput);

// ===================================
// URL Validation
// ===================================

function validateYouTubeUrl(url) {
    // Regular expression for YouTube URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
    return youtubeRegex.test(url);
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.add('show');
}

function hideError() {
    elements.errorMessage.classList.remove('show');
}

// ===================================
// Main Submit Handler
// ===================================

async function handleSubmit() {
    const url = elements.videoUrl.value.trim();
    
    // Hide any previous errors
    hideError();
    
    // Validate URL
    if (!url) {
        showError('Please enter a YouTube video URL');
        return;
    }
    
    if (!validateYouTubeUrl(url)) {
        showError('Invalid YouTube URL format. Please enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=...)');
        return;
    }
    
    // Start processing
    await processVideo(url);
}

// ===================================
// Processing Simulation
// ===================================

let processingInterval;
let currentProgress = 0;

async function processVideo(url) {
    // Hide input, show processing
    elements.inputSection.classList.add('hidden');
    elements.processingSection.classList.remove('hidden');
    
    // Reset progress
    currentProgress = 0;
    updateProgress(0, 'Validating YouTube URL...');
    
    // Simulate processing steps
    const steps = [
        { progress: 15, message: 'Validating YouTube URL...', duration: 800 },
        { progress: 30, message: 'Extracting audio from video...', duration: 1500 },
        { progress: 50, message: 'Transcribing audio using AWS Transcribe...', duration: 2000 },
        { progress: 70, message: 'Generating blog post with AI...', duration: 1800 },
        { progress: 85, message: 'Creating Twitter thread...', duration: 1200 },
        { progress: 95, message: 'Generating LinkedIn summary...', duration: 1000 },
        { progress: 100, message: 'Finalizing content...', duration: 500 }
    ];
    
    for (const step of steps) {
        await animateProgress(step.progress, step.message, step.duration);
    }
    
    // Generate mock content
    generateMockContent(url);
    
    // Show results
    setTimeout(() => {
        elements.processingSection.classList.add('hidden');
        elements.resultsSection.classList.remove('hidden');
        showToast('Content generated successfully!', 'success');
    }, 500);
}

function animateProgress(targetProgress, message, duration) {
    return new Promise((resolve) => {
        elements.processingMessage.textContent = message;
        
        const startProgress = currentProgress;
        const progressDiff = targetProgress - startProgress;
        const steps = 30;
        const stepDuration = duration / steps;
        const progressStep = progressDiff / steps;
        
        let step = 0;
        processingInterval = setInterval(() => {
            step++;
            currentProgress = startProgress + (progressStep * step);
            updateProgress(currentProgress);
            
            if (step >= steps) {
                clearInterval(processingInterval);
                currentProgress = targetProgress;
                updateProgress(targetProgress);
                resolve();
            }
        }, stepDuration);
    });
}

function updateProgress(progress, message) {
    elements.progressBar.style.width = progress + '%';
    elements.progressText.textContent = Math.round(progress) + '%';
    if (message) {
        elements.processingMessage.textContent = message;
    }
}

function cancelProcessing() {
    clearInterval(processingInterval);
    resetToInput();
    showToast('Processing cancelled', 'error');
}

// ===================================
// Mock Content Generation
// ===================================

function generateMockContent(url) {
    // Extract video ID for mock purposes
    const videoId = url.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] || 'sample';
    
    // Generate Blog Post
    currentContent.blog = generateBlogPost(videoId);
    elements.blogContent.innerHTML = currentContent.blog;
    
    // Generate Twitter Thread
    currentContent.twitter = generateTwitterThread(videoId);
    renderTwitterThread(currentContent.twitter);
    
    // Generate LinkedIn Summary
    currentContent.linkedin = generateLinkedInSummary(videoId);
    elements.linkedinContent.innerHTML = currentContent.linkedin;
    
    // Update metadata
    updateMetadata();
}

function generateBlogPost(videoId) {
    return `
        <h1>Unlocking the Power of Video Content: A Comprehensive Guide</h1>
        
        <p><strong>Meta Description:</strong> Discover how to transform your video content into engaging multi-platform formats with AI-powered tools. Learn the strategies that top content creators use to maximize reach.</p>
        
        <h2>Introduction</h2>
        <p>In today's digital landscape, video content has become the cornerstone of effective communication. Whether you're an educator, marketer, or content creator, understanding how to repurpose your video content across multiple platforms is essential for maximizing your reach and impact.</p>
        
        <h2>The Power of Multi-Platform Content</h2>
        <p>Creating content for different platforms doesn't mean starting from scratch each time. By leveraging AI-powered tools and strategic content transformation, you can efficiently adapt your core message to suit various audience preferences and platform requirements.</p>
        
        <p>Key benefits include:</p>
        <ul>
            <li>Increased audience reach across different demographics</li>
            <li>Improved SEO through consistent content distribution</li>
            <li>Enhanced engagement through platform-optimized formatting</li>
            <li>Time and resource efficiency in content creation</li>
        </ul>
        
        <h2>Best Practices for Content Transformation</h2>
        <p>When transforming video content into written formats, it's crucial to maintain the core message while adapting the tone and structure for each platform. Blog posts should be comprehensive and SEO-optimized, Twitter threads should be concise and engaging, and LinkedIn summaries should be professional and value-focused.</p>
        
        <h2>Conclusion</h2>
        <p>The future of content creation lies in smart, efficient repurposing strategies. By embracing AI-powered tools and understanding platform-specific requirements, you can amplify your message and connect with audiences wherever they are.</p>
        
        <p><strong>SEO Keywords:</strong> video content, content transformation, multi-platform marketing, AI content generation, content repurposing, digital marketing strategy</p>
    `;
}

function generateTwitterThread(videoId) {
    return [
        {
            content: "🚀 Want to maximize your content reach? Here's how to transform ONE video into content for EVERY platform. A thread 🧵",
            hashtags: "#ContentMarketing #DigitalStrategy"
        },
        {
            content: "1/ Video content is powerful, but most creators are leaving opportunities on the table by not repurposing it effectively across platforms.",
            hashtags: ""
        },
        {
            content: "2/ The secret? AI-powered content transformation. Turn your video transcript into blog posts, social threads, and professional summaries in minutes.",
            hashtags: "#AI #ContentCreation"
        },
        {
            content: "3/ Here's why this matters: Different audiences prefer different formats. Your YouTube viewers might love video, but LinkedIn connections want quick, professional insights.",
            hashtags: ""
        },
        {
            content: "4/ Best practices:\n✅ Keep core message consistent\n✅ Adapt tone for each platform\n✅ Optimize for SEO on blogs\n✅ Stay concise on Twitter\n✅ Be professional on LinkedIn",
            hashtags: ""
        },
        {
            content: "5/ The result? More reach, better engagement, and efficient use of your time and resources. Work smarter, not harder.",
            hashtags: "#Productivity #MarketingTips"
        },
        {
            content: "6/ Ready to amplify your content? Start by identifying your best-performing videos and transform them into multi-platform content gold. 💎",
            hashtags: "#ContentStrategy #GrowthHacking"
        }
    ];
}

function generateLinkedInSummary(videoId) {
    return `
        <h2>Transforming Video Content for Maximum Professional Impact</h2>
        
        <p>In today's competitive digital landscape, content creators and marketers face a critical challenge: how to maximize the ROI of their video content while maintaining a consistent brand presence across multiple platforms.</p>
        
        <p><strong>Key Insights:</strong></p>
        
        <p>🎯 <strong>Strategic Repurposing:</strong> The most successful content strategies don't just create once and post once. They create once and distribute strategically across platforms, adapting the format and tone to match audience expectations.</p>
        
        <p>💡 <strong>AI-Powered Efficiency:</strong> Modern AI tools have revolutionized content transformation, reducing the time required to repurpose content from hours to minutes while maintaining quality and message consistency.</p>
        
        <p>📈 <strong>Measurable Results:</strong> Organizations implementing multi-platform content strategies report up to 300% increase in content reach and significantly improved engagement metrics across all channels.</p>
        
        <p><strong>The Path Forward:</strong></p>
        
        <p>As we move into an increasingly video-first digital ecosystem, the ability to efficiently transform and distribute content will separate leaders from followers. The question isn't whether to repurpose your content—it's how quickly you can implement these strategies to stay competitive.</p>
        
        <p><strong>What's your content transformation strategy? Let's discuss in the comments. 👇</strong></p>
        
        <p>#DigitalMarketing #ContentStrategy #AI #ProfessionalDevelopment #MarketingInnovation</p>
    `;
}

function renderTwitterThread(tweets) {
    elements.twitterContent.innerHTML = '';
    
    tweets.forEach((tweet, index) => {
        const tweetElement = document.createElement('div');
        tweetElement.className = 'tweet';
        tweetElement.setAttribute('data-index', index);
        
        const charCount = tweet.content.length + tweet.hashtags.length + (tweet.hashtags ? 1 : 0);
        
        tweetElement.innerHTML = `
            <div class="tweet-header">
                <span class="tweet-number">Tweet ${index + 1}/${tweets.length}</span>
                <span class="tweet-char-count">${charCount}/280</span>
            </div>
            <div class="tweet-content">${tweet.content}</div>
            ${tweet.hashtags ? `<div class="tweet-hashtags">${tweet.hashtags}</div>` : ''}
        `;
        
        elements.twitterContent.appendChild(tweetElement);
    });
}

function updateMetadata() {
    // Blog metadata
    const blogText = elements.blogContent.textContent;
    const blogWords = blogText.trim().split(/\s+/).length;
    const blogReadTime = Math.ceil(blogWords / 200); // Average reading speed: 200 words/min
    
    elements.blogWordCount.textContent = `Word Count: ${blogWords}`;
    elements.blogReadTime.textContent = `Read Time: ${blogReadTime} min`;
    
    // LinkedIn metadata
    const linkedinText = elements.linkedinContent.textContent;
    const linkedinWords = linkedinText.trim().split(/\s+/).length;
    elements.linkedinWordCount.textContent = `Word Count: ${linkedinWords}`;
    
    // Twitter metadata
    elements.twitterCount.textContent = `Total Tweets: ${currentContent.twitter.length}`;
}

// ===================================
// Tab Switching
// ===================================

function switchTab(tabName) {
    // Update tab buttons
    elements.tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update panels
    elements.blogPanel.classList.remove('active');
    elements.twitterPanel.classList.remove('active');
    elements.linkedinPanel.classList.remove('active');
    
    if (tabName === 'blog') {
        elements.blogPanel.classList.add('active');
    } else if (tabName === 'twitter') {
        elements.twitterPanel.classList.add('active');
    } else if (tabName === 'linkedin') {
        elements.linkedinPanel.classList.add('active');
    }
}

// ===================================
// Edit Functionality
// ===================================

function toggleEdit(contentType) {
    if (contentType === 'blog') {
        isEditing.blog = !isEditing.blog;
        elements.blogContent.contentEditable = isEditing.blog;
        if (isEditing.blog) {
            elements.editBlogBtn.style.background = 'var(--primary-color)';
            elements.editBlogBtn.style.color = 'white';
            showToast('Editing enabled. Click again to save changes.', 'success');
        } else {
            elements.editBlogBtn.style.background = '';
            elements.editBlogBtn.style.color = '';
            currentContent.blog = elements.blogContent.innerHTML;
            updateMetadata();
            showToast('Changes saved!', 'success');
        }
    } else if (contentType === 'twitter') {
        isEditing.twitter = !isEditing.twitter;
        const tweets = elements.twitterContent.querySelectorAll('.tweet');
        tweets.forEach(tweet => {
            tweet.contentEditable = isEditing.twitter;
        });
        if (isEditing.twitter) {
            elements.editTwitterBtn.style.background = 'var(--primary-color)';
            elements.editTwitterBtn.style.color = 'white';
            showToast('Editing enabled. Click again to save changes.', 'success');
        } else {
            elements.editTwitterBtn.style.background = '';
            elements.editTwitterBtn.style.color = '';
            // Save edited tweets
            tweets.forEach((tweet, index) => {
                const content = tweet.querySelector('.tweet-content').textContent;
                const hashtags = tweet.querySelector('.tweet-hashtags')?.textContent || '';
                currentContent.twitter[index] = { content, hashtags };
            });
            showToast('Changes saved!', 'success');
        }
    } else if (contentType === 'linkedin') {
        isEditing.linkedin = !isEditing.linkedin;
        elements.linkedinContent.contentEditable = isEditing.linkedin;
        if (isEditing.linkedin) {
            elements.editLinkedinBtn.style.background = 'var(--primary-color)';
            elements.editLinkedinBtn.style.color = 'white';
            showToast('Editing enabled. Click again to save changes.', 'success');
        } else {
            elements.editLinkedinBtn.style.background = '';
            elements.editLinkedinBtn.style.color = '';
            currentContent.linkedin = elements.linkedinContent.innerHTML;
            updateMetadata();
            showToast('Changes saved!', 'success');
        }
    }
}

// ===================================
// Copy to Clipboard
// ===================================

async function copyContent(contentType) {
    let textToCopy = '';
    
    if (contentType === 'blog') {
        textToCopy = elements.blogContent.textContent;
    } else if (contentType === 'twitter') {
        textToCopy = currentContent.twitter.map((tweet, index) => {
            return `${index + 1}. ${tweet.content}${tweet.hashtags ? ' ' + tweet.hashtags : ''}`;
        }).join('\n\n');
    } else if (contentType === 'linkedin') {
        textToCopy = elements.linkedinContent.textContent;
    }
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        showToast('Content copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Content copied to clipboard!', 'success');
        } catch (err) {
            showToast('Failed to copy content', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// ===================================
// Download Content
// ===================================

function downloadContent(contentType) {
    let content = '';
    let filename = '';
    
    if (contentType === 'blog') {
        content = elements.blogContent.textContent;
        filename = 'blog-post.txt';
    } else if (contentType === 'twitter') {
        content = currentContent.twitter.map((tweet, index) => {
            return `Tweet ${index + 1}:\n${tweet.content}${tweet.hashtags ? '\n' + tweet.hashtags : ''}\n`;
        }).join('\n');
        filename = 'twitter-thread.txt';
    } else if (contentType === 'linkedin') {
        content = elements.linkedinContent.textContent;
        filename = 'linkedin-summary.txt';
    }
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Content downloaded!', 'success');
}

// ===================================
// Toast Notifications
// ===================================

function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    
    // Trigger reflow to restart animation
    void elements.toast.offsetWidth;
    
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ===================================
// Reset to Input
// ===================================

function resetToInput() {
    // Hide results, show input
    elements.resultsSection.classList.add('hidden');
    elements.processingSection.classList.add('hidden');
    elements.inputSection.classList.remove('hidden');
    
    // Clear input
    elements.videoUrl.value = '';
    hideError();
    
    // Reset editing states
    if (isEditing.blog) toggleEdit('blog');
    if (isEditing.twitter) toggleEdit('twitter');
    if (isEditing.linkedin) toggleEdit('linkedin');
    
    // Reset to blog tab
    switchTab('blog');
}

// ===================================
// Initialize
// ===================================

// Focus on input when page loads
window.addEventListener('load', () => {
    elements.videoUrl.focus();
});
