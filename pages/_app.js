import { SessionProvider } from 'next-auth/react';
import FirebaseSessionProvider from '../src/components/FirebaseSessionProvider';
import '../styles/globals.css';
import { LanguageProvider } from '../src/context/LanguageContext';
import { QuoteProvider } from '../src/context/QuoteContext';
import dynamic from 'next/dynamic';

const LanguageSwitcher = dynamic(() => import('../src/components/LanguageSwitcher.jsx'), { ssr: false });
const ChatAssistant = dynamic(() => import('../src/components/ChatAssistant.jsx'), { ssr: false });

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <FirebaseSessionProvider>
      <LanguageProvider>
        <QuoteProvider>
          <LanguageSwitcher />
          <Component {...pageProps} />
          <ChatAssistant />
        </QuoteProvider>
      </LanguageProvider>
      </FirebaseSessionProvider>
    </SessionProvider>
  );
}

export default MyApp;
