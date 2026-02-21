# 🎓 Digital Complaint Management System
### College Project - Full Stack Web Application

---

## 📌 What is This?

A professional complaint management system where:
- **Users** can submit complaints with priority levels and file attachments
- **Admins** can manage, respond to, and track all complaints in real-time
- **Email alerts** are sent automatically for high-priority issues

**Built with:** HTML, CSS, JavaScript, Firebase

---

## 🎯 Perfect For

- College web development projects
- Final year capstone projects
- Internship applications
- Portfolio projects
- Learning full-stack development

---

## ✨ Features

### User Side:
- Submit complaints with name, email, category
- Choose priority: Low, Medium, High
- Upload image proof (max 5MB)
- Submit anonymously (optional)
- Track complaint status with unique ID
- See admin replies

### Admin Side:
- Secure login with email/password
- Real-time dashboard
- View all complaints
- Update status (Pending → In Progress → Resolved)
- Reply to complaints
- View uploaded files
- Filter by priority/status/category

---

## 🚀 Quick Setup (15 Minutes)

### Step 1: Get the Files
Download this project and extract it to a folder.

### Step 2: Create Firebase Project (FREE)

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click "Go to Console" → "Add Project"
3. Name it (e.g., "my-complaint-system")
4. Disable Google Analytics (not needed)
5. Click "Create project"

### Step 3: Enable Firebase Features

**Enable Authentication:**
- Click "Authentication" → "Get started"
- Click "Email/Password" → Toggle ON
- Click "Save"

**Create Database:**
- Click "Firestore Database" → "Create database"
- Choose "Test mode" → Next
- Select your location → Enable

**Enable Storage:**
- Click "Storage" → "Get started"
- Choose "Test mode" → Done

### Step 4: Get Your Firebase Config

1. Click the ⚙️ icon (Project Settings)
2. Scroll down to "Your apps"
3. Click the `</>` icon (Web)
4. Register app (name: "complaint-app")
5. Copy the `firebaseConfig` object (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:..."
};
```

### Step 5: Update Config File

1. Open `js/firebase-config.js`
2. Replace the placeholder values with YOUR values from above
3. Save the file

### Step 6: Setup EmailJS (FREE - Optional)

1. Go to [emailjs.com](https://www.emailjs.com)
2. Sign up (free - 200 emails/month)
3. Add email service (Gmail works best)
4. Create email template (copy from SETUP_GUIDE.md)
5. Get: Service ID, Template ID, Public Key
6. Add them to `js/firebase-config.js`

**Skip this if you don't want emails** - everything else will still work!

### Step 7: Create Admin Account

1. Go back to Firebase Console
2. Click "Authentication" → "Users"
3. Click "Add user"
4. Email: `admin@example.com` (or your email)
5. Password: Make a strong one!
6. Click "Add user"

**SAVE YOUR PASSWORD!**

### Step 8: Run the Project

**Option A: Using VS Code**
1. Install "Live Server" extension
2. Right-click `index.html`
3. Click "Open with Live Server"

**Option B: Direct**
1. Just double-click `index.html`
2. Opens in your browser

---

## 🎮 How to Use

### Testing User Panel:
1. Fill out the complaint form
2. Choose a priority (click Low/Medium/High)
3. Upload an image (optional)
4. Click "Submit Complaint"
5. Save the Complaint ID shown
6. Click "Track Complaint" and enter the ID

### Testing Admin Panel:
1. Click "Admin" button in navigation
2. Login with your admin email/password
3. View the dashboard
4. Click "View" on any complaint
5. Update status or add a reply

---

## 📁 Project Structure

```
complaint-management-system/
├── index.html           ← User page (main)
├── admin/
│   ├── login.html       ← Admin login
│   └── dashboard.html   ← Admin dashboard
├── css/
│   ├── style.css        ← Main styles
│   └── admin.css        ← Admin styles
└── js/
    ├── firebase-config.js  ← Your credentials go here
    ├── main.js             ← User functionality
    ├── admin-login.js      ← Login logic
    └── admin-dashboard.js  ← Dashboard logic
```

---

## 🎨 Customize It

### Change Colors:
Open `css/style.css` and edit the top section:
```css
:root {
    --primary-color: #2563eb;  /* Change this to your color! */
}
```

### Change App Name:
Search and replace "ComplaintHub" with your name in all HTML files.

### Add Categories:
In `index.html`, find the category dropdown and add:
```html
<option value="Your Category">Your Category</option>
```

---

## 🐛 Common Issues & Fixes

**❌ "Firebase is not defined"**
- Make sure Firebase CDN scripts load BEFORE your custom scripts in HTML

**❌ Can't login as admin**
- Check you created the user in Firebase Console → Authentication
- Verify email/password are correct

**❌ "Permission denied" error**
- Copy security rules from `firestore.rules` to Firebase Console

**❌ Priority buttons disappear when clicked**
- You're using old CSS! Use the updated `style.css` file

**❌ File upload fails**
- Check file size (must be under 5MB)
- Check file type (must be image)

**❌ Page is blank**
- Press F12 to open console and check for errors
- Make sure all files are in correct folders

---

## 📊 What You'll Learn

By working with this project:
- ✅ HTML5 form handling
- ✅ CSS animations and responsive design
- ✅ JavaScript ES6+ (async/await, promises)
- ✅ Firebase integration (database, auth, storage)
- ✅ Real-time data updates
- ✅ File upload functionality
- ✅ Email integration
- ✅ Admin authentication
- ✅ Security rules

---

## 🎯 Project Presentation Tips

When presenting to professors or during interviews:

**What to say:**
1. "Built a full-stack complaint management system"
2. "Implemented secure admin authentication"
3. "Used Firebase for real-time database and storage"
4. "Added email notifications for high-priority complaints"
5. "Responsive design works on mobile and desktop"

**What to show:**
1. Submit a complaint (show the form)
2. Track it (show tracking feature)
3. Login as admin (show authentication)
4. Update status (show real-time updates)
5. Show mobile view

---

## 📝 For Your Resume

**Project Description:**
> Developed a full-stack complaint management system using HTML, CSS, JavaScript, and Firebase. Implemented user authentication, real-time database, file storage, and automated email notifications. Features include a user portal for complaint submission and tracking, and an admin dashboard for complaint management with role-based access control.

**Technical Skills:**
- Frontend Development (HTML5, CSS3, JavaScript ES6+)
- Backend Services (Firebase Firestore, Authentication, Storage)
- Real-time Database Operations
- Email Integration (EmailJS)
- Responsive Web Design
- Security Implementation

---

## 🌐 Deploy It (Make it Live!)

### Deploy to Firebase Hosting (Recommended - FREE)

```bash
# Install Firebase tools
npm install -g firebase-tools

# Login
firebase login

# In your project folder
firebase init hosting

# Deploy
firebase deploy
```

Your site will be live at: `https://your-project.web.app`

### Or Deploy to Netlify (Easiest)
1. Go to [netlify.com](https://www.netlify.com)
2. Drag and drop your project folder
3. Done! Live in 30 seconds

---

## 💡 Tips for College Projects

1. **Test Everything** - Make sure all features work before presenting
2. **Add Comments** - Code is already commented, but add more if needed
3. **Practice Demo** - Know how to show each feature quickly
4. **Have Backup** - Keep screenshots in case internet fails during demo
5. **Know Your Code** - Be ready to explain how it works
6. **Customize It** - Change colors/name to make it unique

---

## 🤔 Need Help?

**Check these files:**
- `SETUP_GUIDE.md` - Detailed setup instructions
- `CODE_EXPLANATION.md` - How the code works
- `TROUBLESHOOTING.md` - Fix common problems

**Still stuck?**
- Open browser console (F12) to see errors
- Check Firebase Console for database/auth issues
- Google the error message

---

## 📚 Documentation Files

- **README.md** (this file) - Quick start guide
- **QUICK_START.md** - 15-minute setup
- **SETUP_GUIDE.md** - Complete setup with details
- **CODE_EXPLANATION.md** - Code breakdown
- **TROUBLESHOOTING.md** - Solutions to problems

---

## ⚠️ Important Notes

**Before Submitting:**
- ✅ Test all features work
- ✅ Remove any test data from database
- ✅ Change admin credentials to something secure
- ✅ Make sure Firebase config is correct
- ✅ Test on different browsers

**For Live Deployment:**
- ⚠️ Update Firebase security rules (from test mode)
- ⚠️ Use environment variables for config (don't hardcode)
- ⚠️ Enable proper authentication rules
- ⚠️ Monitor Firebase usage quotas

---

## 🎓 Grading Rubric Coverage

| Criteria | ✅ Covered |
|----------|-----------|
| User Interface | Modern, responsive design |
| Functionality | All features working |
| Database | Firebase Firestore with real-time |
| Authentication | Secure admin login |
| File Upload | Firebase Storage integration |
| Code Quality | Clean, commented code |
| Documentation | Complete guides included |
| Innovation | Email notifications, tracking system |

---

## 🚀 Next Level Features (Extra Credit!)

Want to impress even more? Add:
- [ ] Charts/analytics dashboard
- [ ] Export complaints to PDF/Excel
- [ ] SMS notifications (Twilio)
- [ ] Search functionality
- [ ] User accounts (not just anonymous)
- [ ] Dark mode toggle
- [ ] Multiple languages

---

## 📄 License

Free to use for college projects, portfolio, and learning!

---

## 🙏 Credits

Built as an educational project for students learning full-stack development.

---

**Good luck with your project! 🎉**

**Questions?** Check the documentation files or Google it - that's how developers learn! 💻

---

**Made with ❤️ for college students**

**Last Updated:** February 2026