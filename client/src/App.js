import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnswer("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chat`, {
        question,
      });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  return (
    <div className="app-wrapper">
      <div className="card">
        <h1 className="brand">
          GELLANI&nbsp;<span className="ai">AI</span> 🤖
        </h1>

        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything…"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Ask"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {answer && (
          <div className="answer-box">
            <h3>Response</h3>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
