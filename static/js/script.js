const form = document.getElementById('predictionForm');
const loading = document.getElementById('loading');
const resultSection = document.getElementById('resultSection');
const errorMessage = document.getElementById('errorMessage');
const predictBtn = document.getElementById('predictBtn');

// API endpoint - uses relative URL
const API_ENDPOINT = '/predict';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.remove('show');

    // Gather form data
    const formData = {
        nitrogen: parseFloat(document.getElementById('nitrogen').value),
        phosphorus: parseFloat(document.getElementById('phosphorus').value),
        potassium: parseFloat(document.getElementById('potassium').value),
        temperature: parseFloat(document.getElementById('temperature').value),
        humidity: parseFloat(document.getElementById('humidity').value),
        ph: parseFloat(document.getElementById('ph').value),
        rainfall: parseFloat(document.getElementById('rainfall').value)
    };

    // Validate inputs
    if (!validateInputs(formData)) {
        return;
    }

    try {
        showLoading(true);
        predictBtn.disabled = true;

        // Call your backend API
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Display results
        displayResults(data);
        resultSection.classList.add('show');

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to get prediction. Please try again.');
    } finally {
        showLoading(false);
        predictBtn.disabled = false;
    }
});

function validateInputs(data) {
    const errors = [];

    if (data.nitrogen < 0) errors.push('Nitrogen must be non-negative');
    if (data.phosphorus < 0) errors.push('Phosphorus must be non-negative');
    if (data.potassium < 0) errors.push('Potassium must be non-negative');
    if (data.temperature < -50 || data.temperature > 60) errors.push('Temperature must be between -50°C and 60°C');
    if (data.humidity < 0 || data.humidity > 100) errors.push('Humidity must be between 0% and 100%');
    if (data.ph < 0 || data.ph > 14) errors.push('pH must be between 0 and 14');
    if (data.rainfall < 0) errors.push('Rainfall must be non-negative');

    if (errors.length > 0) {
        showError(errors.join('\n'));
        return false;
    }

    return true;
}

function displayResults(data) {
    // data should contain: crop (string) and confidence (0-1)
    const cropName = document.getElementById('cropName');
    const confidence = document.getElementById('confidence');
    const confidenceFill = document.getElementById('confidenceFill');

    cropName.textContent = data.crop || 'Unknown Crop';
    confidence.textContent = Math.round(data.confidence * 100) || 0;

    // Animate confidence bar
    setTimeout(() => {
        confidenceFill.style.width = (data.confidence * 100) + '%';
    }, 100);
}

function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    resultSection.classList.remove('show');
}

// Demo mode - uncomment for testing without backend
function setupDemoMode() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'd' && e.ctrlKey) {
            e.preventDefault();
            // Fill with sample data
            document.getElementById('nitrogen').value = 45;
            document.getElementById('phosphorus').value = 38;
            document.getElementById('potassium').value = 42;
            document.getElementById('temperature').value = 25.5;
            document.getElementById('humidity').value = 65;
            document.getElementById('ph').value = 6.8;
            document.getElementById('rainfall').value = 150;
            console.log('Demo data loaded. Press Ctrl+D again or click Predict');
        }
    });
}

// Initialize demo mode (optional)
// setupDemoMode();
