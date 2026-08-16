import AqualyticaAuth from "../../components/auth/AqualyticaAuth";

const AuthPage = ({ onComplete }) => {
  return (
    <div className="w-full h-screen">
      <AqualyticaAuth onComplete={onComplete} />
    </div>
  );
};

export default AuthPage;
