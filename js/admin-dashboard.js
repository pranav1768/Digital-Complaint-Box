/* ============================================
   ADMIN DASHBOARD SCRIPT
   Digital Complaint Management System
   ============================================ */

// Global Variables
let allComplaints = [];
let currentComplaint = null;
let unsubscribeListener = null;

// ============================================
// INITIALIZE DASHBOARD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthentication();
    
    // Setup real-time listener
    setupRealtimeListener();
});

// ============================================
// CHECK AUTHENTICATION
// ============================================
function checkAuthentication() {
    auth.onAuthStateChanged(user => {
        if (!user) {
            // User not logged in, redirect to login
            window.location.href = 'login.html';
        } else {
            // User is logged in, display admin info
            displayAdminInfo(user);
        }
    });
}

// ============================================
// DISPLAY ADMIN INFO
// ============================================
function displayAdminInfo(user) {
    const adminEmail = user.email || 'Admin';
    const adminName = user.displayName || 'Administrator';
    
    document.getElementById('adminEmail').textContent = adminEmail;
    document.getElementById('adminName').textContent = adminName;
}

// ============================================
// SETUP REAL-TIME LISTENER
// ============================================
function setupRealtimeListener() {
    // Listen to complaints collection in real-time
    unsubscribeListener = db.collection('complaints')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            allComplaints = [];
            
            snapshot.forEach(doc => {
                allComplaints.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            console.log('Loaded complaints:', allComplaints.length);
            
            // Update dashboard
            updateDashboard();
            
        }, error => {
            console.error('Error loading complaints:', error);
            showErrorMessage('Error loading complaints. Please refresh the page.');
        });
}

// ============================================
// UPDATE DASHBOARD
// ============================================
function updateDashboard() {
    // Update statistics
    updateStatistics();
    
    // Update high priority badge
    updateHighPriorityBadge();
    
    // Render complaints table
    renderComplaintsTable(allComplaints);
}

// ============================================
// UPDATE STATISTICS
// ============================================
function updateStatistics() {
    const total = allComplaints.length;
    const pending = allComplaints.filter(c => c.status === 'Pending').length;
    const inProgress = allComplaints.filter(c => c.status === 'In Progress').length;
    const resolved = allComplaints.filter(c => c.status === 'Resolved').length;
    
    document.getElementById('totalComplaintsCount').textContent = total;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('inProgressCount').textContent = inProgress;
    document.getElementById('resolvedCount').textContent = resolved;
}

// ============================================
// UPDATE HIGH PRIORITY BADGE
// ============================================
function updateHighPriorityBadge() {
    const highPriority = allComplaints.filter(c => 
        c.priority === 'High' && c.status !== 'Resolved'
    ).length;
    
    document.getElementById('highPriorityBadge').textContent = highPriority;
}

// ============================================
// RENDER COMPLAINTS TABLE
// ============================================
function renderComplaintsTable(complaints) {
    const tbody = document.getElementById('complaintsTableBody');
    
    if (complaints.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 3rem; color: #9ca3af;">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    No complaints found
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = complaints.map(complaint => `
        <tr>
            <td>
                <span class="complaint-id">${complaint.complaintId}</span>
            </td>
            <td>${complaint.userName}</td>
            <td>${complaint.category}</td>
            <td>
                <span class="priority-tag priority-${complaint.priority.toLowerCase()}">
                    <i class="fas fa-flag"></i> ${complaint.priority}
                </span>
            </td>
            <td>
                <span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">
                    ${complaint.status}
                </span>
            </td>
            <td>${formatDate(complaint.createdAt)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-info btn-sm" onclick="viewComplaint('${complaint.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ============================================
// FORMAT DATE
// ============================================
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// ============================================
// APPLY FILTERS
// ============================================
function applyFilters() {
    const priorityFilter = document.getElementById('priorityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filtered = [...allComplaints];
    
    if (priorityFilter) {
        filtered = filtered.filter(c => c.priority === priorityFilter);
    }
    
    if (statusFilter) {
        filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    if (categoryFilter) {
        filtered = filtered.filter(c => c.category === categoryFilter);
    }
    
    renderComplaintsTable(filtered);
}

// ============================================
// CLEAR FILTERS
// ============================================
function clearFilters() {
    document.getElementById('priorityFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    
    renderComplaintsTable(allComplaints);
}

// ============================================
// VIEW COMPLAINT DETAILS
// ============================================
function viewComplaint(complaintId) {
    const complaint = allComplaints.find(c => c.id === complaintId);
    
    if (!complaint) {
        alert('Complaint not found');
        return;
    }
    
    currentComplaint = complaint;
    
    // Build modal content
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <!-- Complaint Information -->
        <div class="modal-section">
            <h3><i class="fas fa-info-circle"></i> Complaint Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Complaint ID</span>
                    <span class="info-value" style="font-family: monospace; color: #2563eb; font-weight: 600;">${complaint.complaintId}</span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Name</span>
                    <span class="info-value">${complaint.userName}</span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${complaint.userEmail}</span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Category</span>
                    <span class="info-value">${complaint.category}</span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Priority</span>
                    <span class="priority-tag priority-${complaint.priority.toLowerCase()}">
                        <i class="fas fa-flag"></i> ${complaint.priority}
                    </span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">
                        ${complaint.status}
                    </span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Submitted</span>
                    <span class="info-value">${formatDateFull(complaint.createdAt)}</span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Anonymous</span>
                    <span class="info-value">${complaint.isAnonymous ? 'Yes' : 'No'}</span>
                </div>
            </div>
        </div>
        
        <!-- Description -->
        <div class="modal-section">
            <h3><i class="fas fa-file-alt"></i> Description</h3>
            <p style="color: #4b5563; line-height: 1.8; white-space: pre-wrap;">${complaint.description}</p>
        </div>
        
        <!-- File Attachment -->
        ${complaint.fileUrl ? `
        <div class="modal-section">
            <h3><i class="fas fa-paperclip"></i> Attachment</h3>
            <div class="file-preview-modal">
                <img src="${complaint.fileUrl}" alt="Attachment" style="max-width: 100%; max-height: 400px;">
                <br><br>
                <a href="${complaint.fileUrl}" target="_blank" class="btn btn-secondary btn-sm">
                    <i class="fas fa-download"></i> Download
                </a>
            </div>
        </div>
        ` : ''}
        
        <!-- Update Status -->
        <div class="modal-section">
            <h3><i class="fas fa-tasks"></i> Update Status</h3>
            <form class="status-update-form" onsubmit="updateStatus(event)">
                <select id="statusUpdate" class="form-select" required>
                    <option value="Pending" ${complaint.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                </select>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Update Status
                </button>
            </form>
        </div>
        
        <!-- Admin Reply -->
        <div class="modal-section">
            <h3><i class="fas fa-reply"></i> Admin Reply</h3>
            <form class="reply-form" onsubmit="submitReply(event)">
                <textarea 
                    id="adminReply" 
                    class="form-textarea" 
                    rows="4" 
                    placeholder="Enter your reply to the user..."
                    required
                >${complaint.adminReply || ''}</textarea>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i> Send Reply
                </button>
            </form>
        </div>
    `;
    
    // Show modal
    document.getElementById('complaintModal').classList.add('show');
}

// ============================================
// FORMAT DATE (FULL)
// ============================================
function formatDateFull(timestamp) {
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
// UPDATE STATUS
// ============================================
async function updateStatus(e) {
    e.preventDefault();
    
    if (!currentComplaint) return;
    
    const newStatus = document.getElementById('statusUpdate').value;
    
    try {
        // Update in Firestore
        await db.collection('complaints').doc(currentComplaint.id).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Status updated successfully');
        
        alert('Status updated successfully!');
        
        // The real-time listener will automatically update the UI
        
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status. Please try again.');
    }
}

// ============================================
// SUBMIT ADMIN REPLY
// ============================================
async function submitReply(e) {
    e.preventDefault();
    
    if (!currentComplaint) return;
    
    const reply = document.getElementById('adminReply').value.trim();
    
    if (!reply) {
        alert('Please enter a reply');
        return;
    }
    
    try {
        // Update in Firestore
        await db.collection('complaints').doc(currentComplaint.id).update({
            adminReply: reply,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Reply submitted successfully');
        
        alert('Reply submitted successfully!');
        
        // The real-time listener will automatically update the UI
        
    } catch (error) {
        console.error('Error submitting reply:', error);
        alert('Error submitting reply. Please try again.');
    }
}

// ============================================
// CLOSE MODAL
// ============================================
function closeModal() {
    document.getElementById('complaintModal').classList.remove('show');
    currentComplaint = null;
}

// ============================================
// REFRESH DATA
// ============================================
function refreshData() {
    console.log('Refreshing data...');
    // The real-time listener will automatically refresh the data
    alert('Data refreshed!');
}

// ============================================
// LOGOUT
// ============================================
async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            // Unsubscribe from real-time listener
            if (unsubscribeListener) {
                unsubscribeListener();
            }
            
            // Sign out
            await auth.signOut();
            
            console.log('Logged out successfully');
            
            // Redirect to login page
            window.location.href = 'login.html';
            
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Error logging out. Please try again.');
        }
    }
}

// ============================================
// SHOW SECTION
// ============================================
function showSection(section) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    event.target.closest('.nav-item').classList.add('active');
    
    // Show appropriate section
    if (section === 'dashboard') {
        renderComplaintsTable(allComplaints);
    } else if (section === 'complaints') {
        renderComplaintsTable(allComplaints);
    } else if (section === 'high-priority') {
        const highPriority = allComplaints.filter(c => c.priority === 'High');
        renderComplaintsTable(highPriority);
    }
}

// ============================================
// SHOW ERROR MESSAGE
// ============================================
function showErrorMessage(message) {
    alert(message);
}

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================
window.addEventListener('beforeunload', () => {
    if (unsubscribeListener) {
        unsubscribeListener();
    }
});