document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    lucide.createIcons();

    // Get DOM elements
    const loadingState = document.getElementById('loadingState');
    const resultsContent = document.getElementById('resultsContent');
    const disclaimer = document.getElementById('disclaimer');
    const resultImage = document.getElementById('resultImage');
    const imageInfo = document.getElementById('imageInfo');
    const mainResult = document.getElementById('mainResult');
    const statusIcon = document.getElementById('statusIcon');
    const resultLabel = document.getElementById('resultLabel');
    const confidenceValue = document.getElementById('confidenceValue');
    const progressFill = document.getElementById('progressFill');
    const resultDescription = document.getElementById('resultDescription');
    const recommendationsList = document.getElementById('recommendationsList');
    const downloadBtn = document.getElementById('downloadBtn');

    // Check if we have uploaded file data
    const fileData = JSON.parse(sessionStorage.getItem('uploadedFile') || 'null');

    if (!fileData) {
        // Redirect back to upload page if no file data
        window.location.href = 'index.html';
        return;
    }

    // Set up the image
    resultImage.src = fileData.dataUrl;
    const fileSize = (fileData.size / 1024 / 1024).toFixed(2);
    imageInfo.textContent = `${fileData.name} • ${fileSize} MB`;

    // Mock prediction results
    const mockResults = [
        {
            label: "Gigi Sehat",
            confidence: 94.7,
            description: "Gigi menunjukkan kondisi yang sehat dengan struktur normal dan tidak ada tanda-tanda kerusakan yang signifikan.",
            recommendations: [
                "Lanjutkan rutinitas kebersihan mulut yang baik",
                "Gunakan pasta gigi berfluoride",
                "Kunjungi dokter gigi secara rutin setiap 6 bulan",
                "Batasi konsumsi makanan dan minuman manis"
            ]
        },
        {
            label: "Karies Gigi",
            confidence: 87.3,
            description: "Terdeteksi adanya karies atau lubang pada gigi yang memerlukan perawatan segera dari dokter gigi.",
            recommendations: [
                "Segera konsultasi dengan dokter gigi",
                "Hindari makanan dan minuman yang terlalu manis",
                "Gunakan obat kumur antibakteri",
                "Pertimbangkan perawatan fluoride tambahan"
            ]
        },
        {
            label: "Gingivitis",
            confidence: 91.2,
            description: "Menunjukkan tanda-tanda peradangan pada gusi yang dapat berkembang menjadi periodontitis jika tidak ditangani.",
            recommendations: [
                "Konsultasi dengan dokter gigi atau periodontist",
                "Tingkatkan kebersihan mulut dengan flossing rutin",
                "Gunakan obat kumur antiseptik",
                "Hindari merokok dan konsumsi alkohol berlebihan"
            ]
        }
    ];

    // Simulate prediction processing
    setTimeout(() => {
        loadingState.style.display = 'none';

        const result = mockResults[Math.floor(Math.random() * mockResults.length)];

        // Determine status based on confidence
        let statusClass, iconName;
        if (result.confidence >= 90) {
            statusClass = 'success';
            iconName = 'check-circle';
        } else if (result.confidence >= 70) {
            statusClass = 'warning';
            iconName = 'alert-circle';
        } else {
            statusClass = 'error';
            iconName = 'alert-circle';
        }

        // Update result UI
        mainResult.className = `main-result-card ${statusClass}`;
        statusIcon.setAttribute('data-lucide', iconName);
        statusIcon.className = `status-icon ${statusClass}`;
        resultLabel.textContent = result.label;
        confidenceValue.textContent = `${result.confidence}%`;
        confidenceValue.className = `confidence-value ${statusClass}`;
        progressFill.className = `progress-fill ${statusClass}`;
        progressFill.style.width = `${result.confidence}%`;
        resultDescription.textContent = result.description;

        // List recommendations
        recommendationsList.innerHTML = '';
        result.recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${recommendation}</span>`;
            recommendationsList.appendChild(li);
        });

        resultsContent.style.display = 'grid';
        disclaimer.style.display = 'block';

        // Refresh Lucide icons
        lucide.createIcons();

        // Enable download button
        downloadBtn.addEventListener('click', () => {
            html2canvas(resultsContent).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jspdf.jsPDF('p', 'mm', 'a4');

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pageWidth;
                const imgHeight = canvas.height * imgWidth / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
                pdf.save('hasil-klasifikasi-gigi.pdf');
            });
        });
    }, 1500);

    // Clean session
    window.addEventListener('beforeunload', () => {
        sessionStorage.removeItem('uploadedFile');
    });
});
