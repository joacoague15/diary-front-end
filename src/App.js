import {useEffect, useState} from "react";
import axios from "axios";

function App() {
    const [scrapUrl, setScrapUrl] = useState("");
    const [ragResponse, setRagResponse] = useState("");
    const [chatCompletionResponse, setChatCompletionResponse] = useState([]);


    const handleAnalyze = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/rag', {
                params: { web_path: scrapUrl }
            });
            setRagResponse(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        if (ragResponse !== "")
            handleChatsCompletion();
    }, [ragResponse]);

    const handleChatsCompletion = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/chat-completion', {
                params: { news_information: ragResponse }
            });
            setChatCompletionResponse(response.data)
        } catch (error) {
            console.error("Error fetching data", error);
        }
    }
  return (
      <div className="App">
          <h1>Hello</h1>
          <input
              type="text"
              value={scrapUrl}
              onChange={(e) => setScrapUrl(e.target.value)}
              placeholder="Enter link to scrap"
          />
          <button onClick={handleAnalyze}>Analyze</button>
          {ragResponse && <p>{ragResponse}</p>}
          <div>
              {chatCompletionResponse && chatCompletionResponse.map((response, index) => (
                  <p key={index}>{response}</p>
              ))}
          </div>
      </div>
  );
}

export default App;
