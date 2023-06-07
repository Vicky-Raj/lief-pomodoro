import type { AppProps } from "next/app";
import "../styles/globals.css";
import Layout from "@/components/Layout";
import { TimerProvider } from "@/contexts/TimerContext";
import { FilterProvider } from "@/contexts/FilterContext";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../../lib/apollo";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <TimerProvider>
          <FilterProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </FilterProvider>
        </TimerProvider>
      </UserProvider>
    </ApolloProvider>
  );
}
