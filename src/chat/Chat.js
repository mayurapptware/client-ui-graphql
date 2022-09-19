import React, { useEffect, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useMutation,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { Container, Row, Col, FormInput, Button } from "shards-react";
import './Chat.css';
import JSONPretty from 'react-json-pretty';


const link = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link,
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  subscription {
    messages {
      id 
      content
      user
      mentions
      emoticons
      links {
        url
        title
      }
    }
  }
`;

const POST_MESSAGE = gql`
  mutation($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;

const Chat = () => {
  const [state, stateSet] = React.useState({
    user: "Mayur",
    content: "",
  });
  const [postMessage] = useMutation(POST_MESSAGE);

  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
    }
    stateSet({
      ...state,
      content: "",
    });
   
      setTimeout(()=>{
        console.log(document.getElementById('messages-container').scrollHeight)
    document.getElementById('messages-container').scrollTop = document.getElementById('messages-container').scrollHeight + 100;
    
      }, 100)
  };
  return (
    <Container>
      <header></header>
      <div style ={{
        display: 'flex',
        justifyContent: 'space-between'
    }}>
      <div style ={{
        width: '30%',
        overflowY: 'scroll',
        height: '600px'
    }}>
      <JsonObject/>
      </div>
      <div id="messages-container"  style ={{
        width: '-webkit-fill-available',
        overflowY: 'scroll',
        height: '600px'
    }}>
      <Messages user={state.user} />
      </div>
      </div>
      <footer>
      <Row>
        <Col xs={2} style={{ padding: 0 }}>
          <FormInput
            label="User"
            value={state.user}
            onChange={(evt) =>
              stateSet({
                ...state,
                user: evt.target.value,
              })
            }
          />
        </Col>
        <Col xs={8}>
          <FormInput
            label="Content"
            value={state.content}
            onChange={(evt) =>
              stateSet({
                ...state,
                content: evt.target.value,
              })
            }
            onKeyUp={(evt) => {
              if (evt.keyCode === 13) {
                onSend();
              }
            }}
          />
        </Col>
        <Col xs={2} style={{ padding: 0 }}>
          <Button onClick={() => onSend()} style={{ width: "100%" }}>
            Send
          </Button>
        </Col>
      </Row>
      </footer>
    </Container>
  );
};

const JsonObject = () => {
  const { data } = useSubscription(GET_MESSAGES);
  console.log(data);
  if (!data) {
    return null;
  }

  return (
    <>
    <div>
    <JSONPretty id="json-pretty" data={JSON.stringify(data.messages[data.messages.length -1])}></JSONPretty>
    </div>
    </>
  );
}

const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);

  if (!data) {
    return null;
  }

   
  return (
    
    <div>
      
      {
      data.messages.map(({ id, user: messageUser, content, mentions, emoticons, links: Any }) => (
        
        <div
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
            paddingBottom: "1em",
          }}
        >
          {user !== messageUser && (
            <div
              style={{
                height: 50,
                width: 50,
                marginRight: "0.5em",
                border: "2px solid #e5e6ea",
                borderRadius: 25,
                textAlign: "center",
                fontSize: "18pt",
                paddingTop: 5,
              }}
            >
              {messageUser.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div
            style={{
              background: user === messageUser ? "blue" : "#e5e6ea",
              color: user === messageUser ? "white" : "black",
              padding: "1em",
              borderRadius: "1em",
              maxWidth: "60%",
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </div>
  );
};



export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
