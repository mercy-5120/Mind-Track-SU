# MindTrackSU - React Staff Portal

## Overview
The staff pages of MindTrackSU have been converted from static HTML to a modern React application with the following features:

- **Component-based architecture**: Reusable and maintainable components
- **React Router**: Client-side routing for seamless navigation
- **Responsive design**: Mobile-friendly interface with sidebar navigation
- **Multiple staff dashboards**: SUMC Counsellor and Peer Counsellor dashboards
- **Key features**:
  - Dashboard with statistics and quick actions
  - High-risk alerts management
  - Session scheduling
  - Referrals management
  - Resources library
  - Account settings
  - Alert details view

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Navigation sidebar
│   └── Layout.jsx           # Main layout wrapper
├── pages/
│   └── staff/
│       ├── SUMCDashboard.jsx
│       ├── PeerDashboard.jsx
│       ├── HighRiskAlerts.jsx
│       ├── ScheduleSessions.jsx
│       ├── Referrals.jsx
│       ├── Resources.jsx
│       ├── Settings.jsx
│       ├── AlertDetails.jsx
│       └── StaffLogin.jsx
├── styles/
│   ├── global.css           # Global styles
│   ├── variables.css        # CSS variables (colors, etc.)
│   ├── Sidebar.module.css
│   ├── Layout.module.css
│   ├── Dashboard.module.css
│   └── Button.module.css
├── App.jsx                  # Main app with routes
└── index.js                 # Entry point
public/
├── index.html               # HTML template
└── Logo.png                 # (existing)
```

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm start
```
The app will run at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```
This creates an optimized production build in the `build/` directory.

## Configuration

The React app is configured in `package.json` with the following dependencies:
- **React 18.2**: Core framework
- **React Router DOM 6.14**: Client-side routing
- **Axios 1.4**: HTTP client for API calls
- **Chart.js 3.9 & react-chartjs-2 4.3**: Data visualization

## Features

### Dashboard Pages
- **SUMC Counsellor Dashboard**: Displays assessments, high-risk alerts, referrals, and sessions
- **Peer Counsellor Dashboard**: Customized view for peer support staff

### Key Components
- **Sidebar Navigation**: Active route highlighting, responsive mobile menu
- **Stats Cards**: Interactive cards linking to detailed views
- **Alerts Table**: Responsive table with risk levels and status badges
- **Quick Actions**: Button group for common tasks

### Styling
- CSS Modules for component-scoped styles
- CSS variables for consistent theming
- Responsive design with mobile breakpoints

## Usage

### Accessing Different Pages
- Dashboard: `/staff/dashboard`
- Peer Dashboard: `/staff/peer-dashboard`
- High-Risk Alerts: `/staff/high-risk-alerts`
- Schedule Sessions: `/staff/schedule-sessions`
- Referrals: `/staff/referrals`
- Resources: `/staff/resources`
- Settings: `/staff/settings`
- Alert Details: `/staff/alert-details?id=ALERT_ID`
- Staff Login: `/staff/login`

### Adding New Features
1. Create a new component in `src/pages/staff/` or `src/components/`
2. Use the `Layout` component for consistent styling
3. Add the route in `src/App.jsx`
4. Create corresponding CSS module in `src/styles/`

## Backend Integration

The Express backend (`index.js`) is configured to:
1. Serve static assets from the `public/` directory
2. Serve the React production build from the `build/` directory
3. Implement SPA (Single Page Application) fallback for React Router
4. Support API routes (ready for backend implementation)

## Environment Variables

Create a `.env` file in the root directory for environment-specific settings:
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

## Migration Notes

### What Changed
- ✅ Converted HTML pages to React components
- ✅ Replaced inline CSS with CSS modules
- ✅ Implemented React Router instead of file-based navigation
- ✅ Added state management for forms and dynamic data
- ✅ Improved responsive design with Flexbox/Grid

### Backward Compatibility
- Old HTML files remain in `pages/` directory but are no longer served
- All styling and layouts are preserved in React components
- Navigation structure remains the same

## Development Tips

### Hot Reload
The React development server supports hot module reloading. Changes to components will automatically refresh in the browser.

### Debugging
- Use React Developer Tools browser extension
- Open DevTools console for error messages
- Check Network tab for API calls (when implemented)

### Performance
- Components are optimized with React.memo and useCallback
- CSS is scoped to prevent conflicts
- Production build is minified and optimized

## Future Enhancements

- Add state management (Redux/Zustand) for global state
- Implement API integration for real data
- Add authentication context
- Create form validation utilities
- Add unit and integration tests
- Implement dark mode
- Add accessibility features (ARIA labels, keyboard navigation)

## Support

For issues or questions about the React conversion, please refer to:
- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [CSS Modules Guide](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)

## License

MindTrackSU © 2026 Strathmore University
