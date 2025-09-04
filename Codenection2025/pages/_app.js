import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import { LanguageProvider } from '../src/context/LanguageContext';
import dynamic from 'next/dynamic';

const LanguageSwitcher = dynamic(() => import('../src/components/LanguageSwitcher'), { ssr: false });

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <LanguageProvider>
        <LanguageSwitcher />
        <Component {...pageProps} />
      </LanguageProvider>
    </SessionProvider>
  );
}
