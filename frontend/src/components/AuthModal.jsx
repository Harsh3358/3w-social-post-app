import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";


function AuthModal({ mode, onClose, onSuccess }) {
  return (
    <div className="overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>
        {mode === "login" ? (
          <LoginCard onSuccess={onSuccess} />
        ) : (
          <RegisterCard onSuccess={onSuccess} />
        )}
      </div>
    </div>
  );
}

export default AuthModal;

