import './App.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import DisplayData from './DisplayData';

const App = () => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'http://localhost:4000/',
  });

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <DisplayData />
      </div>
    </ApolloProvider>
  );
};

export default App;
