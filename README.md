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
- **Car Plate Number**: Auto-space, auto-uppercase, data validation for maximum length of 10 characters
- **Car Brand**: Data validation & error detection & auto-correction
- **Car Model**: Searchable dropdown that filters by the selected brand
- **Manufacturing Year**: Dropdown with valid years for the selected brand and model

### Core System Features
- **User Authentication**: Google OAuth sign-in with secure session management
- **User Dashboard**: Personalized landing page with quick access to features
- **User Profile Management**: Comprehensive profile settings and preferences
- **Real-time Validation**: Instant feedback with smart error correction
- **Debounced Input**: Prevents excessive validation calls with intelligent debouncing
- **Visual Feedback**: Clear validation indicators (✓ green, ✗ red, ⚠ yellow with suggestions)

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

### Malaysian Market Specific
- **State-based Plate Validation**: Supports all 16 Malaysian states with correct regex patterns
- **Local Vehicle Database**: Comprehensive database of Malaysian vehicles (Proton, Perodua, Honda, Toyota, etc.)
- **Common Typo Detection**: Handles Malaysian-specific character substitution patterns

## 🛠️ Technology Stack

- **Frontend**: React 19 with Next.js 15
- **Styling**: Tailwind CSS 4
- **Build Tool**: Next.js (with Turbopack for development)
- **Authentication**: NextAuth.js with Google OAuth
- **Validation**: Custom validation logic with regex patterns
- **State Management**: React Hooks (useState, useEffect)
- **Performance**: Custom debouncing hooks for optimal UX

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
│   └── signin.js               # Google sign-in page
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
5. **Profile** (`/profile`) → User settings and preferences

## 📋 Usage Examples

### Plate Number Validation
- **Input**: `BKV9429` (no space)
- **Suggestion**: "Did you mean: BKV 9429?"
- **Result**: Auto-formats to correct Malaysian standard

### Typo Correction
- **Input**: `BOV 9429` (where 'O' is likely '0')
- **Suggestion**: "Did you mean: B0V 9429?"
- **Result**: Detects common character substitutions

### Make/Model Filtering
- **Select Make**: "Proton"
- **Available Models**: Saga, Persona, X70, Iriz, Exora
- **Dynamic Filtering**: Only shows models for the selected make

### Year Validation
- **Model**: 2023 Honda Civic
- **Input Year**: 1980
- **Warning**: "Year 1980 seems unlikely for Civic (expected around 2023)"

## 🔧 Validation Rules

### Plate Number Format
- **Selangor**: `B[A-Z]{2} [0-9]{4}` (e.g., BKV 9429)
- **Kuala Lumpur**: `W[A-Z]{2} [0-9]{4}` (e.g., WXY 4567)
- **Johor**: `J[A-Z]{2} [0-9]{4}` (e.g., JKL 1234)

### Year Validation
- **Range**: 1990 to Current Year + 1
- **Model-specific**: ±5 years tolerance from expected model year

### Engine Capacity
- **Range**: 600cc to 8000cc
- **Model-specific**: 30% tolerance from expected engine CC

## 🎯 Success Criteria Met

✅ **Typing BKV9429 (no space) suggests the correct format BKV 9429**  
✅ **Typing BKV 9429 and selecting "Selangor" is marked as valid**  
✅ **Typing BOV 9429 (where 'O' is likely a mistake for '0') suggests "Did you mean B0V 9429?"**  
✅ **Selecting "Proton" for make only shows Proton models**  
✅ **Entering a year like 1980 for a 2023 model triggers a warning**  
✅ **User authentication with Google OAuth**  
✅ **Protected routes and user dashboard**  
✅ **Comprehensive user profile management**  

## 🔮 Future Enhancements

- **Advanced AI Integration**: Enhanced machine learning for smarter error detection
- **Mobile App Development**: Native mobile applications for iOS and Android
- **API Integration**: Connect with insurance company APIs for real-time data
- **Advanced Analytics**: Comprehensive user behavior and validation pattern tracking
- **Blockchain Integration**: Secure and immutable insurance record management
- **Voice Input Support**: Voice-activated form filling for accessibility
- **Integration with Government Databases**: Real-time vehicle registration verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for the Malaysian automotive community**  
**Industry Collaboration with BJAK - Smart Vehicle Data Validation & Error Detection**
