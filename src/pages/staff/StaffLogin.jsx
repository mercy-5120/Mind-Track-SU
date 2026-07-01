import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStaff } from '../../api/staffApi';
import StaffBrand from '../../components/StaffBrand';

const loginStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
    background: linear-gradient(135deg, #2A2A72 0%, #4A8B6B 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loginContainer {
    width: 100%;
    max-width: 500px;
    padding: 20px;
  }

  .authCard {
    background: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .authHeader {
    text-align: center;
    margin-bottom: 30px;
  }

  .authLogo {
    height: 60px;
    margin-bottom: 20px;
  }

  .authHeader h1 {
    font-size: 1.8rem;
    color: #2A2A72;
    margin-bottom: 8px;
  }

  .authHeader p {
    color: #555;
    font-size: 0.95rem;
  }

  .formGroup {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
  }

  .formGroup label {
    font-weight: 600;
    color: #2D2D34;
    margin-bottom: 8px;
    font-size: 0.95rem;
  }

  .formGroup input {
    padding: 12px 16px;
    border: 1px solid #ddd8d0;
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: inherit;
  }

  .formGroup input:focus {
    outline: none;
    border-color: #2A2A72;
    box-shadow: 0 0 0 3px rgba(42, 42, 114, 0.1);
  }

  .forgotLink {
    color: #2A2A72;
    text-decoration: none;
    font-size: 0.9rem;
    margin-bottom: 20px;
    text-align: right;
  }

  .forgotLink:hover {
    text-decoration: underline;
  }

  .submitBtn {
    width: 100%;
    padding: 14px;
    background: #2A2A72;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.95rem;
    transition: background 0.3s;
  }

  .submitBtn:hover {
    background: #1f1f5a;
  }

  .authDivider {
    margin: 24px 0;
    text-align: center;
    color: #999;
    position: relative;
  }

  .authDivider span {
    background: white;
    padding: 0 12px;
    position: relative;
    z-index: 1;
  }

  .authDivider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #ddd;
  }

  .authLinks {
    text-align: center;
    font-size: 0.95rem;
    color: #555;
  }

  .authLinks a {
    color: #2A2A72;
    text-decoration: none;
    font-weight: 600;
  }

  .authLinks a:hover {
    text-decoration: underline;
  }
`;

export default function StaffLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const staff = await loginStaff(formData.email);
      const role = staff?.role || (formData.email.toLowerCase().includes('peer') ? 'peer_counsellor' : 'sumc_counsellor');
      const id = staff?.staff_id ?? (role === 'peer_counsellor' ? 2 : 1);
      const name = staff?.name ?? (role === 'peer_counsellor' ? 'Alex Kim' : 'Jane Doe');

      sessionStorage.setItem('staffRole', role);
      sessionStorage.setItem('staffEmail', formData.email);
      sessionStorage.setItem('staffName', name);
      sessionStorage.setItem('staffId', id);

      if (role === 'peer_counsellor') {
        navigate('/staff/peer-dashboard');
      } else {
        navigate('/staff/dashboard');
      }
    } catch (error) {
      const role = formData.email.toLowerCase().includes('peer') ? 'peer_counsellor' : 'sumc_counsellor';
      const id = role === 'peer_counsellor' ? 2 : 1;
      const name = role === 'peer_counsellor' ? 'Alex Kim' : 'Jane Doe';

      setErrorMessage('Staff login service unavailable. Using offline fallback view.');
      sessionStorage.setItem('staffRole', role);
      sessionStorage.setItem('staffEmail', formData.email);
      sessionStorage.setItem('staffName', name);
      sessionStorage.setItem('staffId', id);
      navigate(role === 'peer_counsellor' ? '/staff/peer-dashboard' : '/staff/dashboard');
    }
  };

  return (
    <>
      <style>{loginStyles}</style>
      <div className="loginContainer">
        <div className="authCard">
          <div className="authHeader">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <StaffBrand compact={false} showLabel />
            </div>
            <h1>Staff Login</h1>
            <p>Access your staff dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="authForm">
            <div className="formGroup">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="staff@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <a href="/forgot-password" className="forgotLink">Forgot password?</a>

            <button type="submit" className="submitBtn">
              Log In as Staff
            </button>
            {errorMessage ? <p style={{ color: '#B34B4B', marginTop: '14px' }}>{errorMessage}</p> : null}
          </form>

          <div className="authDivider">
            <span>or</span>
          </div>

          <div className="authLinks">
            <p>
              Are you a student?
              <a href="/login"> Student login</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
