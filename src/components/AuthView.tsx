import React, { useState } from 'react';
import { Account } from '../types';

interface AuthModalViewProps {
  onLogin: (id: string, pass: string) => { success: boolean; message: string; account?: Account };
  onRegister: (name: string, id: string, pass: string) => { success: boolean; message: string; account?: Account };
  onClose: () => void;
}

export const AuthModalView: React.FC<AuthModalViewProps> = ({
  onLogin,
  onRegister,
  onClose,
}) => {
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Login form
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regId, setRegId] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPass2, setRegPass2] = useState('');
  const [regError, setRegError] = useState('');

  const handleQuickLogin = (id: string, pass: string) => {
    setLoginId(id);
    setLoginPass(pass);
    const res = onLogin(id, pass);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      onClose();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginId.trim() || !loginPass) {
      setLoginError('Vui lòng nhập mã đăng nhập và mật khẩu.');
      return;
    }
    const res = onLogin(loginId.trim(), loginPass);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regName.trim() || !regId.trim() || !regPass) {
      setRegError('Vui lòng điền đầy đủ các thông tin.');
      return;
    }
    if (regPass.length < 6) {
      setRegError('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }
    if (regPass !== regPass2) {
      setRegError('Mật khẩu xác nhận không khớp.');
      return;
    }

    const res = onRegister(regName.trim(), regId.trim(), regPass);
    if (!res.success) {
      setRegError(res.message);
    } else {
      onClose();
    }
  };

  return (
    <div className="view-container" id="view-auth">
      <div className="auth-wrap">
        <div className="subtabs justify-center mb-5">
          <button
            className={`subtab-btn ${authTab === 'login' ? 'active' : ''}`}
            onClick={() => setAuthTab('login')}
          >
            Đăng nhập
          </button>
          <button
            className={`subtab-btn ${authTab === 'register' ? 'active' : ''}`}
            onClick={() => setAuthTab('register')}
          >
            Đăng ký tài khoản
          </button>
        </div>

        {authTab === 'login' ? (
          <div className="auth-box" id="authPanel-login">
            <h2 className="text-xl font-bold font-display mb-1">
              Đăng nhập hệ thống
            </h2>
            <p className="text-xs text-gray-600 mb-4">
              Dùng mã sinh viên hoặc số điện thoại và mật khẩu đã đăng ký.
            </p>

            <div className="auth-hint mb-4">
              <div className="font-semibold mb-1">🚀 Đăng nhập nhanh 1-chạm (Tài khoản mẫu):</div>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  type="button"
                  className="mini-btn text-xs bg-white"
                  onClick={() => handleQuickLogin('SV001', '123456')}
                >
                  🎓 Sinh viên (SV001)
                </button>
                <button
                  type="button"
                  className="mini-btn text-xs bg-white"
                  onClick={() => handleQuickLogin('NV001', '123456')}
                >
                  🍳 Bếp (NV001)
                </button>
                <button
                  type="button"
                  className="mini-btn primary text-xs"
                  onClick={() => handleQuickLogin('ADMIN01', 'admin123')}
                >
                  🛠️ Quản trị (ADMIN01)
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="field-label">Mã sinh viên / Số điện thoại</div>
              <input
                className="field-input"
                id="loginId"
                placeholder="VD: SV001 hoặc 09xxxxxxxx"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />

              <div className="field-label">Mật khẩu</div>
              <input
                className="field-input"
                type="password"
                id="loginPass"
                placeholder="Nhập mật khẩu"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />

              {loginError && (
                <div className="error-text show">{loginError}</div>
              )}

              <button
                type="submit"
                className="full-btn mt-5"
                id="loginBtn"
              >
                Đăng nhập
              </button>
            </form>

            <div className="auth-switch">
              Chưa có tài khoản?{' '}
              <button onClick={() => setAuthTab('register')}>
                Đăng ký ngay
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-box" id="authPanel-register">
            <h2 className="text-xl font-bold font-display mb-1">
              Đăng ký tài khoản
            </h2>
            <p className="text-xs text-gray-600 mb-4">
              Dành cho sinh viên & khách hàng căng tin.
            </p>

            <form onSubmit={handleRegisterSubmit}>
              <div className="field-label">Họ và tên</div>
              <input
                className="field-input"
                id="regName"
                placeholder="Nguyễn Văn A"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />

              <div className="field-label">Mã sinh viên / Số điện thoại</div>
              <input
                className="field-input"
                id="regId"
                placeholder="VD: SV002 hoặc 09xxxxxxxx"
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
              />

              <div className="field-label">Mật khẩu</div>
              <input
                className="field-input"
                type="password"
                id="regPass"
                placeholder="Tối thiểu 6 ký tự"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
              />

              <div className="field-label">Xác nhận mật khẩu</div>
              <input
                className="field-input"
                type="password"
                id="regPass2"
                placeholder="Nhập lại mật khẩu"
                value={regPass2}
                onChange={(e) => setRegPass2(e.target.value)}
              />

              {regError && (
                <div className="error-text show">{regError}</div>
              )}

              <button
                type="submit"
                className="full-btn mt-5"
                id="registerBtn"
              >
                Đăng ký tài khoản
              </button>
            </form>

            <div className="auth-switch">
              Đã có tài khoản?{' '}
              <button onClick={() => setAuthTab('login')}>
                Đăng nhập tại đây
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
