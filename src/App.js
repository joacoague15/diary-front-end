import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();
    const [scrapUrl, setScrapUrl] = useState("");
    const [ragResponse, setRagResponse] = useState("");
    const [chatCompletionResponse, setChatCompletionResponse] = useState([]);
    const [loadingRag, setLoadingRag] = useState(false);
    const [loadingChats, setLoadingChats] = useState(false);
    const [newChatMessage, setNewChatMessage] = useState('');


    const handleAnalyze = async () => {
        setLoadingRag(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/rag', {
                params: { web_path: scrapUrl }
            });
            setRagResponse(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoadingRag(false);
        }
    };

    useEffect(() => {
        if (ragResponse !== "")
            handleChatsCompletion().then(r => console.log(r));
    }, [ragResponse]);

    const handleChatsCompletion = useCallback(async () => {
        setLoadingChats(true);
        try {
            const chatHistory = chatCompletionResponse
                .map(response => `${response.name}: ${response.message}`)
                .join(' ');
            const response = await axios.get('http://127.0.0.1:8000/chat-completion', {
                params: { news_information: ragResponse, chat_history: chatHistory }
            });
            setChatCompletionResponse(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoadingChats(false);
        }
    }, [ragResponse, chatCompletionResponse]);

    const profileImgComponent = (imgSource, profileName) => {
        return (
            <button onClick={() => navigate(`/character-system-role/${profileName}`)} style={{background: 'none', border: 'none', padding: 0}}>
                <img src={imgSource} alt={imgSource}
                     style={{width: '50px', height: '50px', borderRadius: '50%', marginRight: 20}}/>
            </button>
        )
    }

    const handleImage = (name) => {
        if (name === "lucia") {
            return profileImgComponent("/lucia.webp", "lucia")
        } else if (name === "mateo") {
            return profileImgComponent("/mateo.webp", "mateo")
        } else if (name === "mariana") {
            return profileImgComponent("/mariana.webp", "mariana")
        } else if (name === "usuario") {
            return profileImgComponent("/user.webp", "mariana")
        }
    }

    const capitalizeFirstLetter = (name) => {
        if (!name) return "";
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const handleCharacterResponses = async (chatMessage) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/character-responses', {
                params: { news_information: ragResponse, prompt_to_answer: chatMessage }
            });
            const newMessages = response.data.map(item => ({ name: item.name, message: item.message }));
            setChatCompletionResponse(prevState => [
                ...prevState,
                ...newMessages
            ]);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    }

    // Somewhere here It's deleting my chat that I already added in array
    // Also, new Lucia response is not being rendered as part of chat list
    const handleNewChatMessage = () => {
        setChatCompletionResponse(prevState => [
            ...prevState,
            { name: 'usuario', message: newChatMessage }
        ]);
        handleCharacterResponses(newChatMessage).then(r => console.log(r));
        setNewChatMessage('');
    };

    return (
        <div className="App">
            <Container className="mt-5">
              <Row className="justify-content-center">
                  <Col md={8}>
                      <Form>
                          <Form.Group controlId="scrapUrl">
                              <Form.Control
                                  size="lg"
                                  type="text"
                                  value={scrapUrl}
                                  onChange={(e) => setScrapUrl(e.target.value)}
                                  placeholder="Link completo para scrapear"
                                  style={{fontSize: '2rem', textAlign: "center"}}
                              />
                          </Form.Group>
                          <div className="d-flex justify-content-center">
                              <Button variant="primary" onClick={handleAnalyze} className="mt-3">
                                  Analizar
                              </Button>
                          </div>
                      </Form>
                      {loadingRag ? (
                          <div className="d-flex justify-content-center mt-3">
                              <Spinner animation="border" role="status">
                                  <span className="sr-only"></span>
                              </Spinner>
                          </div>
                      ) : (
                          ragResponse && <p className="mt-3" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{ragResponse}</p>
                      )}
                      <div className="mt-3">
                          {loadingChats ? (
                              <div className="d-flex justify-content-center mt-3">
                                  <Spinner animation="border" role="status">
                                      <span className="sr-only"></span>
                                  </Spinner>
                              </div>
                          ) : (
                              chatCompletionResponse && chatCompletionResponse.map((response, index) => (
                                  <div key={index} className="d-flex align-items-start mb-3">
                                      {handleImage(response.name)}
                                      <div className="ml-3">
                                          <h5 className="mb-1">{capitalizeFirstLetter(response.name)}</h5>
                                          <p className="mb-0">{response.message}</p>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                      {chatCompletionResponse.length > 0 && <Form.Group controlId="newChatMessage" className="mt-3">
                          <Form.Control
                              size="lg"
                              type="text"
                              value={newChatMessage}
                              onChange={(e) => setNewChatMessage(e.target.value)}
                              placeholder="Escribir nuevo mensaje"
                              style={{ fontSize: '1.5rem' }}
                          />
                          <div className="d-flex justify-content-center">
                              <Button variant="primary" onClick={handleNewChatMessage} className="mt-3">
                                  Enviar
                              </Button>
                          </div>
                      </Form.Group>}
                  </Col>
              </Row>
            </Container>
        </div>
    );
}

export default App;
