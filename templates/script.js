document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Get DOM elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const previewSection = document.getElementById('previewSection');
    const previewImage = document.getElementById('previewImage');
    const fileInfo = document.getElementById('fileInfo');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const uploadForm = document.getElementById('uploadForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');

    let selectedFile = null;

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropZone.classList.add('drag-active');
    }

    function unhighlight() {
        dropZone.classList.remove('drag-active');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    }

    // File selection
    selectFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    function handleFileSelect(file) {
        if (file && file.type.startsWith('image/')) {
            selectedFile = file;
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                
                // Show preview section
                dropZone.style.display = 'none';
                previewSection.style.display = 'block';
                
                // Update file info
                const fileSize = (file.size / 1024 / 1024).toFixed(2);
                fileInfo.innerHTML = `
                    <i data-lucide="image" style="width: 1rem; height: 1rem; display: inline; margin-right: 0.25rem;"></i>
                    ${file.name} (${fileSize} MB)
                `;
                
                // Reinitialize icons
                lucide.createIcons();
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file (JPG, PNG, JPEG)');
        }
    }

    // Remove file
    removeFileBtn.addEventListener('click', () => {
        selectedFile = null;
        previewImage.src = '';
        fileInput.value = '';
        
        // Hide preview section and show drop zone
        previewSection.style.display = 'none';
        dropZone.style.display = 'block';
    });

    // Form submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            alert('Please select an image file first');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        loadingSpinner.style.display = 'flex';

        // Simulate upload and processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Store file data in sessionStorage for result page
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileData = {
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type,
                dataUrl: e.target.result
            };
            
            sessionStorage.setItem('uploadedFile', JSON.stringify(fileData));
            
            // Redirect to result page
            window.location.href = 'result.html';
        };
        reader.readAsDataURL(selectedFile);
    });
});