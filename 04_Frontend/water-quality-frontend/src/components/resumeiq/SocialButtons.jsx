import { useEffect, useCallback, useState } from "react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1095651319432-8bciubb89jokk3089ud622eh9rsiloc0.apps.googleusercontent.com";

const SocialButtons = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);

  const handleGoogleToken = useCallback(async (idToken) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (res.ok) {
        if (onSuccess) onSuccess(data);
      } else {
        if (onError) onError(data.message || "Google authentication failed.");
      }
    } catch (err) {
      console.error("Google auth backend error:", err);
      if (onError) onError("Network error. Cannot reach authorization server.");
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  // Dynamically load Google GSI script if not already present
  useEffect(() => {
    const loadGsiScript = () => {
      if (window.google?.accounts?.id) {
        setGsiReady(true);
        return;
      }

      const existingScript = document.getElementById("google-gsi-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-gsi-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => setGsiReady(true);
        document.head.appendChild(script);
      }
    };

    loadGsiScript();

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        setGsiReady(true);
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Callback Ref: Renders Google's official button as soon as DOM element & script are ready
  const containerRef = useCallback((node) => {
    if (node && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.credential) {
              handleGoogleToken(response.credential);
            }
          },
        });

        node.innerHTML = "";
        window.google.accounts.id.renderButton(node, {
          theme: "outline",
          size: "large",
          width: "350",
          text: "continue_with",
          shape: "rectangular"
        });
      } catch (e) {
        console.error("GSI render error:", e);
      }
    }
  }, [handleGoogleToken]);

  const handleCustomGoogleClick = () => {
    if (window.google?.accounts?.oauth2) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "email profile openid",
        callback: async (tokenResponse) => {
          if (tokenResponse.access_token) {
            setLoading(true);
            try {
              const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const info = await res.json();
              if (onSuccess) {
                onSuccess({
                  username: info.name || info.email.split("@")[0],
                  email: info.email,
                  profilePicture: info.picture
                });
              }
            } catch (err) {
              if (onError) onError("Google profile fetch failed.");
            } finally {
              setLoading(false);
            }
          }
        }
      });
      client.requestAccessToken();
    } else if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      if (onError) onError("Loading Google services... Please try again.");
    }
  };

  return (
    <div className="w-full my-3 flex flex-col items-center justify-center">
      {/* Official Google GSI Rendered Button Container */}
      <div ref={containerRef} className="w-full flex justify-center items-center min-h-[44px]"></div>

      {/* Fallback Custom Google Button until GSI renders */}
      {!gsiReady && (
        <button
          type="button"
          onClick={handleCustomGoogleClick}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 py-3 px-4 font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.8 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
            <path fill="#FBBC05" d="M5.3 14.7c-.3-.8-.4-1.7-.4-2.7s.1-1.9.4-2.7L1.6 6.4C.6 8.4 0 10.1 0 12s.6 3.6 1.6 5.6l3.7-2.9z" />
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
          </svg>
          <span>Continue with Google</span>
        </button>
      )}

      {loading && <p className="text-xs font-bold text-cyan-400 mt-2">Authenticating with Google...</p>}
    </div>
  );
};

export default SocialButtons;
