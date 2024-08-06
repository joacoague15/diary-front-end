import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

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

    const handleImage = (name) => {
        if (name === "lucia")
            return <img src="/lucia.webp" alt="lucia" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: 20 }} className="mr-3"/>
        else if (name === "mateo")
            return <img src="/mateo.webp" alt="mateo" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: 20 }} className="profile-image mr-3"/>
        else if (name === "mariana")
            return <img src="/mariana.webp" alt="mateo" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: 20 }} className="profile-image mr-3"/>
    }

    const capitalizeFirstLetter = (name) => {
        if (!name) return "";
        return name.charAt(0).toUpperCase() + name.slice(1);
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
                      {ragResponse && <p className="mt-3" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{ragResponse}</p>}
                      <div className="mt-3">
                          {chatCompletionResponse && chatCompletionResponse.map((response, index) => (
                              <div key={index} className="d-flex align-items-start mb-3">
                                  {handleImage(response.name)}
                                  <div className="ml-3" >
                                      <h5 className="mb-1">{capitalizeFirstLetter(response.name)}</h5>
                                      <p className="mb-0">{response.message}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </Col>
              </Row>
            </Container>
        </div>
    );
}

export default App;
