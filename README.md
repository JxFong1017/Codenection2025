# Smart Vehicle Data Validation & Error Detection System (MVP)

A real-time, client-side form validation system for vehicle details that detects and corrects common user input errors, specifically designed for the Malaysian market.

## 🚗 Features

### Tier 1 (MVP) Features
- **User Authentication**: Google OAuth sign-in with secure session management
- **User Dashboard**: Personalized landing page with quick access to features
- **User Profile Management**: Comprehensive profile settings and preferences
- **Real-time Plate Number Validation**: Validates Malaysian state plate number formats with instant feedback
- **Smart Error Correction**: Suggests corrections for common typos (e.g., 'O' vs '0', 'I' vs '1')
- **Dynamic Make/Model Filtering**: Cascading dropdowns that filter models based on selected make
- **Year Validation**: Checks if the year is plausible for the selected vehicle model
- **Engine Capacity Validation**: Validates engine CC against expected ranges for the model
- **Debounced Input**: Prevents excessive validation calls with intelligent debouncing
- **Visual Feedback**: Clear validation indicators (✓ green, ✗ red, ⚠ yellow with suggestions)

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

- **Vehicle Preview Card**: Visual representation of entered vehicle data
- **AI-powered Suggestions**: TensorFlow.js integration for smarter error detection
- **Advanced Fuzzy Search**: Enhanced search with fuse.js for better make/model matching
- **Data Export**: Export validation results and vehicle data
- **Mobile Optimization**: Enhanced mobile experience with touch-friendly UI
- **User Analytics**: Track validation patterns and user behavior
- **Team Collaboration**: Share validation results with team members

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


For questions or support, please open an issue in the repository.

---

**Built with ❤️ for the Malaysian automotive community**
