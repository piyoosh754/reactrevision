import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const bubbleStyles = {
  container: { display: "flex", flexDirection: "column", gap: "12px", width: "900px", margin: "40px" },
  row: { display: "flex", alignItems: "flex-end", gap: "10px" },
  botBubble: {
    maxWidth: "70%",
    backgroundColor: "#e8f1ff",
    padding: "12px 16px",
    borderRadius: "18px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    fontSize: "16px",
  },
  userBubble: {
    maxWidth: "30%",
    marginLeft: "auto",
    backgroundColor: "#0f6b83",
    color: "white",
    padding: "10px 14px",
    borderRadius: "18px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    fontSize: "15px",
    textAlign: "right",
  },
  actionsRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "6px" },
  optionBtn: { borderRadius: "8px", padding: "10px 16px", boxShadow: "0 2px 4px rgba(0,0,0,0.12)" },
};

function App() {
  const [messages, setMessages] = useState([
    { id: 1, role: "bot", text: "Welcome to Indian e-Visa Support Centre, Please choose your preferred language" },
  ]);

  // UI control states
  const [languageSelected, setLanguageSelected] = useState(null); // 'English' etc
  const [mobileInput, setMobileInput] = useState("");
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showEVisaIdInput, setShowEVisaIdInput] = useState(false);
  const [evisaInput, setEvisaInput] = useState("");
  const [nameStored, setNameStored] = useState("VAANI");

  const pushMessage = (role, text) => {
    setMessages((m) => [...m, { id: Date.now() + Math.random(), role, text }]);
  };

  const handleLanguageClick = (lang) => {
    setLanguageSelected(lang);
    pushMessage("user", lang);
    setTimeout(() => {
      pushMessage("bot", "Please enter your valid mobile number to continue");
      setShowMobileInput(true);
      setShowOptions(false);
      setShowEVisaIdInput(false);
    }, 200);
  };

  const submitMobile = () => {
    const pattern = /^\d{10}$/;
    if (!pattern.test(mobileInput)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    pushMessage("user", mobileInput);
    setShowMobileInput(false);
    setMobileInput("");
    setTimeout(() => {
      pushMessage("bot", `My name is ${nameStored}, and I am the virtual assistant to help regarding e-Visa related queries.`);
      setTimeout(() => {
        pushMessage("bot", "Please choose from below option :");
        setShowOptions(true);
      }, 220);
    }, 200);
  };

  const handleOptionClick = (optionText) => {
    pushMessage("user", optionText);

    if (optionText === "e-Visa Application Status") {
      setShowOptions(false);
      setTimeout(() => {
        pushMessage("bot", "e-Visa Application Status");
        setTimeout(() => {
          pushMessage("bot", "Enter your 12-digit eVisa Application ID starting with I");
          setShowEVisaIdInput(true);
        }, 150);
      }, 200);
    } else {
      setShowOptions(false);
      setTimeout(() => {
        pushMessage("bot", `You selected '${optionText}'. We'll help you with that shortly.`);
        setTimeout(() => setShowOptions(true), 300);
      }, 200);
    }
  };

  const submitEVisaId = () => {
    pushMessage("user", evisaInput);
    const pattern = /^I\d{11}$/; 
    setEvisaInput("");
    setShowEVisaIdInput(false);

    setTimeout(() => {
      if (pattern.test(messages.length ? evisaInput : "")) {
        const lastUser = messages.slice().reverse().find((m) => m.role === "user");
        const last = (function () {
          const arr = [...messages, { role: "user", text: evisaInput }]; // fallback
          return arr[arr.length - 1];
        })();
      }

      const all = [...messages, { id: Date.now() + 1, role: "user", text: evisaInput }]; 
      setTimeout(() => {
        const latestMessages = [...messages]; 
      }, 0);

    }, 250);
  };

  const submitEVisaId_fixed = () => {
    const val = evisaInput.trim();
    if (!val) {
      alert("Please enter eVisa ID");
      return;
    }
    pushMessage("user", val);
    setShowEVisaIdInput(false);
    setEvisaInput("");

    const pattern = /^I\d{11}$/;
    setTimeout(() => {
      if (pattern.test(val)) {
        pushMessage("bot", `Your eVisa Application ID ${val} is valid`);
      } else {
        pushMessage("bot", "Please enter a valid 12-digit eVisa Application ID starting with I");
        setTimeout(() => setShowEVisaIdInput(true), 200);
      }
      setTimeout(() => setShowOptions(true), 300);
    }, 250);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={bubbleStyles.container}>
        {messages.map((m) => (
          <div key={m.id} style={bubbleStyles.row}>
            {m.role === "bot" ? (
              <>
                <div style={bubbleStyles.botBubble}>{m.text}</div>
              </>
            ) : (
              <>
                <div style={bubbleStyles.userBubble}>{m.text}</div>
              </>
            )}
          </div>
        ))}

        {!languageSelected && (
          <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
            {["English", "French", "Russian", "Spanish", "Arabic"].map((lang) => (
              <button
                key={lang}
                className="btn btn-info"
                style={{ ...bubbleStyles.optionBtn }}
                onClick={() => handleLanguageClick(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        )}

        {showMobileInput && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px" }}>
            <input
              className="form-control"
              style={{ maxWidth: "300px" }}
              placeholder="Mobile Number (10 digits)"
              value={mobileInput}
              onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, ""))} // digits only
              onKeyDown={(e) => {
                if (e.key === "Enter") submitMobile();
              }}
            />
            <button
              className="btn btn-success"
              style={{ width: 44, height: 44, borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={submitMobile}
            >
              ➔
            </button>
          </div>
        )}

        {showOptions && (
          <div style={bubbleStyles.actionsRow}>
            {[
              "e-Visa Application Status",
              "Issues in Granted ETA",
              "e-Visa Categories",
              "e-Visa Eligibility",
              "Applying e-Visa",
              "e-Visa Application Processing Fees",
              "e-Visa Payment Related Issues",
            ].map((opt) => (
              <button
                key={opt}
                className="btn btn-primary"
                style={{ ...bubbleStyles.optionBtn, backgroundColor: "#0f6b83", borderColor: "#0f6b83" }}
                onClick={() => handleOptionClick(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {showEVisaIdInput && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px" }}>
            <input
              className="form-control"
              style={{ maxWidth: "460px" }}
              placeholder="Enter 12-digit eVisa Application ID starting with I"
              value={evisaInput}
              onChange={(e) => setEvisaInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitEVisaId_fixed();
              }}
            />
            <button
              className="btn btn-success"
              style={{ width: 44, height: 44, borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={submitEVisaId_fixed}
            >
              ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
