# React Conversion - Quick Start Guide

## ✅ Conversion Complete!

Your staff pages have been successfully converted from HTML to React. Here's what was done:

## 📁 What's New

### React App Structure
```
src/
├── components/        # Reusable React components
├── pages/
│   └── staff/        # All staff page components
├── styles/           # CSS modules organized by component
├── App.jsx           # Main app with routing
└── index.js          # Entry point

public/
├── index.html        # React template
└── (images go here)
```

### Pages Converted to React Components
- ✅ Staff Login (`/staff/login`)
- ✅ SUMC Dashboard (`/staff/dashboard`)
- ✅ Peer Counsellor Dashboard (`/staff/peer-dashboard`)
- ✅ High-Risk Alerts (`/staff/high-risk-alerts`)
- ✅ Schedule Sessions (`/staff/schedule-sessions`)
- ✅ Referrals (`/staff/referrals`)
- ✅ Resources (`/staff/resources`)
- ✅ Settings (`/staff/settings`)
- ✅ Alert Details (`/staff/alert-details`)

## 🚀 Getting Started

### Step 1: Install Dependencies
Open terminal in project root and run:
```bash
npm install
```
This installs React, React Router, and other dependencies.

### Step 2: Start Development Server
```bash
npm start
```
App opens at `http://localhost:3000`

### Step 3: Build for Production
```bash
npm run build
```
Creates optimized production build in `build/` folder.

### Step 4: Update Backend
The `index.js` file has been updated to:
- Serve React from the build directory in production
- Serve static assets properly
- Handle SPA routing (all routes point to React)

## 🎨 Key Features

### Component Architecture
- **Sidebar**: Reusable navigation with active route highlighting
- **Layout**: Wrapper component for consistent header/footer
- **Pages**: Each staff page is now a React component
- **Styling**: CSS modules for scoped styles and no conflicts

### Responsive Design
- Mobile hamburger menu
- Tablet and desktop layouts
- Breakpoints at 480px, 768px, and 992px

### Navigation
- React Router for client-side routing
- No page reloads
- Browser history support

## 🔧 Development Tips

### Adding a New Page
1. Create component in `src/pages/staff/NewPage.jsx`
2. Import `Layout` component for consistent styling
3. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/staff/new-page" element={<NewPage />} />
   ```
4. Update Sidebar navigation links if needed

### Styling
- Use CSS modules (`.module.css`) for component styles
- CSS variables available in `src/styles/variables.css`
- Global styles in `src/styles/global.css`

### State Management
Currently using React hooks (useState). For complex state, consider:
- Redux
- Zustand
- Context API

## 📝 Important Notes

### Old HTML Files
The original HTML files remain in `pages/` directory but are NOT served anymore. The React app handles all routing.

### Environment Variables
Create `.env` file for API configuration:
```
REACT_APP_API_URL=http://localhost:3000/api
```

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- React 18.2+ features supported

## 🔗 Next Steps

### 1. Connect to Backend API
Update components to use `axios` for API calls:
```jsx
import axios from 'axios';

// Fetch data
const [data, setData] = useState(null);
useEffect(() => {
  axios.get('/api/alerts').then(res => setData(res.data));
}, []);
```

### 2. Add Authentication
Implement login flow and protected routes:
```jsx
// Protect routes that need authentication
<PrivateRoute path="/staff/dashboard" element={<Dashboard />} />
```

### 3. Replace Mock Data
Replace useState data with real data from backend

### 4. Add Form Validation
Use libraries like `react-hook-form` or `formik`

## 📚 Resources

- [React Documentation](https://react.dev)
- [React Router Guide](https://reactrouter.com)
- [Create React App Docs](https://create-react-app.dev)

## ❓ Troubleshooting

### npm install fails
```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm start
```

### Build fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 File Structure Summary

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app with routes |
| `src/index.js` | React entry point |
| `src/components/Sidebar.jsx` | Navigation |
| `src/components/Layout.jsx` | Main layout wrapper |
| `src/pages/staff/*` | Page components |
| `src/styles/*` | Component styles |
| `package.json` | Dependencies |
| `public/index.html` | React template |
| `index.js` | Express backend |

---

**Happy coding!** 🎉 Your React staff portal is ready to go!
