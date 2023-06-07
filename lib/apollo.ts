import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://lief-pomodoro.vercel.app/api/graphql",
  cache: new InMemoryCache(),
});

export default apolloClient;
