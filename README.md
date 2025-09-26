# Smart Vehicle Data Validation & Error Detection System

**Track:** Industry Collaboration (Smart Vehicle Data Validation & Error Detection by BJAK)

A comprehensive real-time vehicle data validation and error detection system that prevents incorrect vehicle details during car insurance purchases and renewals, specifically designed for the Malaysian market.

## 🎯 Problem Statement
When buying or renewing car insurance online, users often enter incorrect vehicle details such as:
- Car plate number
- Brand
- Model  
- Manufacturing year

This causes:
- ❌ Delayed policy approvals
- ❌ Wrong premium pricing
- ❌ Risk of invalid or rejected insurance coverage

## 💡 Solution

### Core Validation Features
- **Car Plate Number**: Auto-space, auto-uppercase, validation for maximum length of 10 characters, and restriction for symbols, error detection for restricted characters such as "I" and "O"
- **Car Brand**: Data validation with searchable dropdown, error detection, and auto-filled by fuzzy search 
- **Car Model**: Data validation with searchable dropdown that filters by the selected brand, error detection, and auto-filled by fuzzy search
- **Manufacturing Year**: Data validation with dropdown for valid years for the selected brand and model
- **NRIC**: Validation for the format of NRIC in Malaysia
- **Postcode**: Validation for maximum length of 5 digits
  
### Core System Features
- **User Authentication**: Google OAuth sign-in with secure session management
- **User Dashboard**: Personalized landing page with quick access to features
- **Real-time Validation**: Instant feedback with smart error correction
- **Debounced Input**: Prevents excessive validation calls with intelligent debouncing
- **Visual Feedback**: Clear validation indicators (⚠ red with suggestions)

## 🚀 Extra Features
- **Gmail Account Data Protection**: Secure handling of user email data
- **Multilingual Support**: Multi-language interface for diverse users
- **Auto Fill by Uploading Geran**: Automatic form population from vehicle registration documents
- **Duplicate Insurance Check**: Prevents duplicate insurance applications
- **AI Chatbot**: Intelligent assistant for user queries and support
- **Insurance Estimation Preview**: Real-time premium calculation preview
- **Quotation Generator & Delivery via Email**: Automated quote generation and email delivery
- **Reminder System**: Automated reminders for policy renewals
- **Recent Quotes and Car Records**: Historical data management and tracking
- **Auto fill by quotation made**: Renew car insurance form is autofilled by the quotation user made and it is editable

## 🔮 Future Enhancements
- **Get Permission for JPJ database**: Get user's NCD for premium calculation and data validation for car plate number and car owner's NRIC
- **Advanced AI Integration**: Enhanced machine learning for smarter error detection
- **Mobile App Development**: Native mobile applications for iOS and Android
- **API Integration**: Connect with insurance company APIs for real-time data
- **Advanced Analytics**: Comprehensive user behavior and validation pattern tracking
- **Blockchain Integration**: Secure and immutable insurance record management
- **Voice Input Support**: Voice-activated form filling for accessibility
- **Integration with Government Databases**: Real-time vehicle registration verification

## User guide
### Policy Workflow: Quote, Management, and Renewal
1.  **Get a Quote:** After generating a quote, we **email** the details to you. The quote is automatically saved in your **Recent Quotes** section.
2.  **Activate/Renew:** To proceed, click **"Renew Now"** from your Recent Quotes, the vehicle details and personal information is auto-filled from the quotation you have made but it is editable. Upon making a successful payment, the policy becomes active, and a confirmation including payment details is sent to your **Gmail** and stored in your **My Car Records**.
3.  **Renewal Reminder:** The system monitors your policy expiry. When your policy is **expiring soon**, a reminder is sent, and a prompt will appear in **My Car Records** asking you to **"Renew Now."**
4.  **Final Renewal:** You can click the **"Renew Now"** button directly in My Car Records which has stored all your car details to quickly make the payment and complete the renewal process.
  
## 🛠️ Technology Stack
- **Frontend**: React 19 with Next.js 15
- **Styling**: Tailwind CSS 4
- **Build Tool**: Next.js (with Turbopack for development)
- **Authentication**: NextAuth.js with Google OAuth
- **Validation**: Custom validation logic with regex patterns
- **State Management**: React Hooks (useState, useEffect)
- **Performance**: Custom debouncing hooks for optimal UX
- **Backend**: Firestore, Google Cloud Service
- **Sending email**: Brevo
- **AI chatbox**: Gemini

### Malaysian Market Specific
- **State-based Plate Validation**: Supports all 16 Malaysian states with correct regex patterns
- **Local Vehicle Database**: Comprehensive database of Malaysian vehicles (Proton, Perodua, Honda, Toyota, etc.)
- **Common Typo Detection**: Handles Malaysian-specific character substitution patterns
  
## 📁 Project Structure

```
src/
├── components/
│   ├── CarBrandInput.jsx        # Car brand selection component
│   ├── ChatAssistant.jsx        # AI chat assistant component
│   ├── ContactHelp.jsx          # Contact and help component
│   ├── DecisionPopup.jsx        # Decision confirmation popup
│   ├── GeranImageUpload.jsx     # Vehicle registration document upload
│   ├── LanguageSwitcher.jsx     # Multi-language support component
│   ├── PlateValidationPopup.jsx # Plate number validation popup
│   └── VehicleForm.jsx          # Main vehicle form component
├── context/
│   ├── LanguageContext.js       # Language state management
│   └── QuoteContext.js          # Insurance quote state management
├── data/
│   ├── insuranceDatabase.js     # Insurance company and policy data
│   └── vehicleDatabase.js       # Vehicle database and metadata
├── hooks/
│   └── useDebounce.js           # Custom debouncing hooks
└── utils/
    ├── i18n.js                  # Internationalization utilities
    └── validationLogic.js       # Core validation functions

pages/
├── _app.js                      # App wrapper with NextAuth
├── _document.js                 # Custom document structure
├── index.js                     # Landing page with auth redirect
├── api/
│   ├── auth/
│   │   └── [...nextauth].js     # NextAuth.js API routes
│   └── hello.js                 # API test endpoint
├── auth/
│   └── signin.js                # Google sign-in page
├── confirm.js                   # Confirmation page
├── dashboard.js                 # User dashboard
├── get-quote.js                 # Insurance quote generation
├── insurance-form.js            # Insurance application form
├── manual-quote.js              # Manual quote entry
├── profile.js                   # User profile management
├── vehicle-form.js              # Vehicle validation form
└── vehicle-validation-form.js   # Advanced vehicle validation

public/
├── images/                      # Static images and assets
│   ├── car-picture-*.jpg        # Vehicle images
│   ├── *.png                    # UI icons and illustrations
│   └── *.svg                    # Vector graphics
└── favicon.ico                  # Site favicon

styles/
└── globals.css                  # Global CSS styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Console account for OAuth

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
   - Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret

4. Create environment variables:
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` and add your Google OAuth credentials:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NEXTAUTH_SECRET=your_random_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Authentication Flow
1. **Landing Page** (`/`) → Redirects to sign-in if not authenticated
2. **Sign In** (`/auth/signin`) → Google OAuth authentication
3. **Dashboard** (`/dashboard`) → Main user landing page with quick actions
4. **Vehicle Form** (`/vehicle-form`) → Vehicle validation interface

## 📋 Usage Examples
### Plate Number Validation
- **Input**: `BKV9429` (no space)
- **Suggestion**: "BKV 9429"
- **Result**: Auto-formats to correct Malaysian standard

### Brand/Model Filtering
- **Select Brand**: "Proton"
- **Available Models**: Saga, Persona, X70, Iriz, Exora
- **Dynamic Filtering**: Only shows models for the selected brand

## 🎯 Success Criteria Met
✅ **Typing BKV9429 (no space) suggests the correct format BKV 9429**  
✅ **Selecting "Proton" for make only shows Proton models**  
✅ **User authentication with Google OAuth**  
✅ **Protected routes and user dashboard**  
✅ **Comprehensive user profile management**  

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 Reference
1. Presentation Slides: https://www.canva.com/design/DAGxzTY_CyE/LDaR0Q85nIvLTkAKIm6dxQ/edit?utm_content=DAGxzTY_CyE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

2. Youtube Link: https://youtu.be/iHL23TGzBM0?si=_Gyi-CKGK4GXV42H

## 🆘 Support
For questions or support, please open an issue in the repository.
**Built with ❤️ for the Malaysian automotive community**  
**Industry Collaboration with BJAK - Smart Vehicle Data Validation & Error Detection**
