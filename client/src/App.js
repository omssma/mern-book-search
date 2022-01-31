import { setContext } from '@apollo/client/link/context';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink, ApolloLink, from } from '@apollo/client';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { onError } from 'apollo-link-error';
// import { ApolloLink } from 'apollo-link';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// apollo-link-error
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('graphQLErrors', graphQLErrors);
  }
  if (networkError) {
    console.log('networkError', networkError);
  }
});

const httpLink = createHttpLink({
  uri: '/graphql',
});

//apollo-link-error
const link = ApolloLink.from([errorLink, httpLink]);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: from ([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
  
});



function App() {
  return (
    <ApolloProvider client={client}>
        <Router>
          <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
          </>
        </Router> 
    </ApolloProvider>

  );
}

export default App;
