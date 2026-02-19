/* ============================================
   MAIN JAVASCRIPT - USER PANEL
   Digital Complaint Management System
   ============================================ */

// Global Variables
let selectedFile = null;
let complaintStats = {
    total: 0,
    resolved: 0
};

// ============================================
// INITIALIZE APP
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    
    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    // Load statistics
    loadComplaintStats();
    
    // Setup event listeners
    setupEventListeners();
});

// ============================================
// SETUP EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Form submission
    const complaintForm = document.getElementById('complaintForm');
    complaintForm.addEventListener('submit', handleComplaintSubmit);
    
    // File upload
    const fileUpload = document.getElementById('fileUpload');
    fileUpload.addEventListener('change', handleFileSelect);
    
    // Character counter for description
    const description = document.getElementById('description');
    description.addEventListener('input', updateCharCount);
    
    // Tracking form
    const trackingForm = document.getElementById('trackingForm');
    trackingForm.addEventListener('submit', handleTrackingSubmit);
    
    // Anonymous checkbox
    const anonymousCheckbox = document.getElementById('anonymous');
    anonymousCheckbox.addEventListener('change', handleAnonymousToggle);
}

// ============================================
// LOAD COMPLAINT STATISTICS
// ============================================
async function loadComplaintStats() {
    try {
        // Get total complaints count
        const complaintsSnapshot = await db.collection('complaints').get();
        const totalCount = complaintsSnapshot.size;
        
        // Get resolved complaints count
        const resolvedSnapshot = await db.collection('complaints')
            .where('status', '==', 'Resolved')
            .get();
        const resolvedCount = resolvedSnapshot.size;
        
        // Update display
        document.getElementById('totalComplaints').textContent = totalCount;
        document.getElementById('resolvedComplaints').textContent = resolvedCount;
        
        complaintStats.total = totalCount;
        complaintStats.resolved = resolvedCount;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ============================================
// HANDLE COMPLAINT SUBMISSION
// ============================================
async function handleComplaintSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const userName = document.getElementById('userName').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    const category = document.getElementById('category').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;
    const description = document.getElementById('description').value.trim();
    const isAnonymous = document.getElementById('anonymous').checked;
    
    // Validate form
    if (!userName || !userEmail || !category || !priority || !description) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        // Generate unique complaint ID
        const complaintId = generateComplaintId();
        
        // Upload file if selected
        let fileUrl = null;
        if (selectedFile) {
            fileUrl = await uploadFile(selectedFile, complaintId);
        }
        
        // Prepare complaint data
        const complaintData = {
            complaintId: complaintId,
            userName: isAnonymous ? 'Anonymous' : userName,
            userEmail: isAnonymous ? 'anonymous@system.com' : userEmail,
            category: category,
            priority: priority,
            description: description,
            isAnonymous: isAnonymous,
            fileUrl: fileUrl,
            status: 'Pending',
            adminReply: '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Save to Firestore
        await db.collection('complaints').doc(complaintId).set(complaintData);
        
        console.log('Complaint submitted successfully:', complaintId);
        
        // Send email if priority is High
        if (priority === 'High' && !isAnonymous) {
            await sendEmailNotification(complaintData);
        }
        
        // Show success message
        showSuccessMessage(complaintId);
        
        // Update statistics
        loadComplaintStats();
        
    } catch (error) {
        console.error('Error submitting complaint:', error);
        alert('Error submitting complaint. Please try again.');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// ============================================
// GENERATE UNIQUE COMPLAINT ID
// ============================================
function generateComplaintId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `CMP-${timestamp}-${random}`;
}

// ============================================
// UPLOAD FILE TO FIREBASE STORAGE
// ============================================
async function uploadFile(file, complaintId) {
    try {
        // Create storage reference
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`complaints/${complaintId}/${file.name}`);
        
        // Upload file
        const snapshot = await fileRef.put(file);
        
        // Get download URL
        const downloadUrl = await snapshot.ref.getDownloadURL();
        
        console.log('File uploaded successfully:', downloadUrl);
        return downloadUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

// ============================================
// SEND EMAIL NOTIFICATION (HIGH PRIORITY)
// ============================================
async function sendEmailNotification(complaintData) {
    try {
        // Prepare email parameters
        const templateParams = {
            to_email: ADMIN_EMAIL,
            complaint_id: complaintData.complaintId,
            user_name: complaintData.userName,
            user_email: complaintData.userEmail,
            category: complaintData.category,
            priority: complaintData.priority,
            description: complaintData.description,
            date: new Date().toLocaleString()
        };
        
        // Send email using EmailJS
        await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );
        
        console.log('Email notification sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error - complaint is already submitted
    }
}

// ============================================
// SHOW SUCCESS MESSAGE
// ============================================
function showSuccessMessage(complaintId) {
    // Hide form
    document.getElementById('complaintForm').style.display = 'none';
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    document.getElementById('complaintId').textContent = complaintId;
    successMessage.classList.add('show');
}

// ============================================
// RESET FORM
// ============================================
function resetForm() {
    // Reset form fields
    document.getElementById('complaintForm').reset();
    
    // Clear file preview
    document.getElementById('filePreview').innerHTML = '';
    selectedFile = null;
    
    // Hide success message
    document.getElementById('successMessage').classList.remove('show');
    
    // Show form
    document.getElementById('complaintForm').style.display = 'block';
    
    // Reset submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    
    // Reset character counter
    document.getElementById('charCount').textContent = '0';
}

// ============================================
// HANDLE FILE SELECT
// ============================================
function handleFileSelect(e) {
    const file = e.target.files[0];
    
    if (file) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            e.target.value = '';
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Only image files are allowed');
            e.target.value = '';
            return;
        }
        
        selectedFile = file;
        
        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('filePreview');
            preview.innerHTML = `
                <div style="position: relative; display: inline-block;">
                    <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
                    <button onclick="removeFile()" style="position: absolute; top: 10px; right: 10px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 18px;">×</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }
}

// ============================================
// REMOVE SELECTED FILE
// ============================================
function removeFile() {
    selectedFile = null;
    document.getElementById('fileUpload').value = '';
    document.getElementById('filePreview').innerHTML = '';
}

// ============================================
// UPDATE CHARACTER COUNT
// ============================================
function updateCharCount(e) {
    const count = e.target.value.length;
    const maxCount = 1000;
    
    document.getElementById('charCount').textContent = count;
    
    // Limit characters
    if (count > maxCount) {
        e.target.value = e.target.value.substring(0, maxCount);
        document.getElementById('charCount').textContent = maxCount;
    }
}

// ============================================
// HANDLE ANONYMOUS TOGGLE
// ============================================
function handleAnonymousToggle(e) {
    const nameField = document.getElementById('userName');
    const emailField = document.getElementById('userEmail');
    
    if (e.target.checked) {
        nameField.value = 'Anonymous';
        emailField.value = 'anonymous@system.com';
        nameField.disabled = true;
        emailField.disabled = true;
    } else {
        nameField.value = '';
        emailField.value = '';
        nameField.disabled = false;
        emailField.disabled = false;
    }
}

// ============================================
// SHOW TRACKING SECTION
// ============================================
function showTrackingSection() {
    document.getElementById('submit-section').style.display = 'none';
    document.getElementById('track-section').style.display = 'block';
}

// ============================================
// HANDLE TRACKING SUBMIT
// ============================================
async function handleTrackingSubmit(e) {
    e.preventDefault();
    
    const trackingId = document.getElementById('trackingId').value.trim();
    
    if (!trackingId) {
        alert('Please enter a complaint ID');
        return;
    }
    
    try {
        // Fetch complaint from Firestore
        const doc = await db.collection('complaints').doc(trackingId).get();
        
        if (!doc.exists) {
            document.getElementById('trackingResults').innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #ef4444;">
                    <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.125rem; font-weight: 600;">Complaint not found</p>
                    <p style="color: #6b7280;">Please check the ID and try again</p>
                </div>
            `;
            return;
        }
        
        const complaint = doc.data();
        
        // Display complaint details
        displayComplaintDetails(complaint);
        
    } catch (error) {
        console.error('Error tracking complaint:', error);
        alert('Error tracking complaint. Please try again.');
    }
}

// ============================================
// DISPLAY COMPLAINT DETAILS
// ============================================
function displayComplaintDetails(complaint) {
    const statusClass = complaint.status.toLowerCase().replace(' ', '-');
    const priorityClass = complaint.priority.toLowerCase();
    
    const html = `
        <div class="tracking-card">
            <div class="tracking-header">
                <div>
                    <div class="complaint-id-display">${complaint.complaintId}</div>
                    <p style="color: #6b7280; margin-top: 0.25rem;">Submitted on ${formatDate(complaint.createdAt)}</p>
                </div>
                <span class="status-badge status-${statusClass}">${complaint.status}</span>
            </div>
            
            <div class="tracking-details">
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${complaint.userName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Category:</span>
                    <span class="detail-value">${complaint.category}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Priority:</span>
                    <span class="priority-tag priority-${priorityClass}">
                        <i class="fas fa-flag"></i> ${complaint.priority}
                    </span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${complaint.description}</span>
                </div>
                
                ${complaint.fileUrl ? `
                <div class="detail-row">
                    <span class="detail-label">Attachment:</span>
                    <a href="${complaint.fileUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">View File</a>
                </div>
                ` : ''}
                
                ${complaint.adminReply ? `
                <div class="admin-reply-section">
                    <h4><i class="fas fa-comment-dots"></i> Admin Reply</h4>
                    <p style="color: #4b5563; line-height: 1.6;">${complaint.adminReply}</p>
                </div>
                ` : '<div class="admin-reply-section"><p style="color: #9ca3af;">No admin reply yet</p></div>'}
            </div>
        </div>
    `;
    
    document.getElementById('trackingResults').innerHTML = html;
}

// ============================================
// FORMAT DATE
// ============================================
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Show notification
function showNotification(message, type = 'success') {
    // You can implement a toast notification here
    console.log(`${type}: ${message}`);
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
