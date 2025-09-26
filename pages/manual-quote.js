import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useQuote } from '../src/context/QuoteContext';

// Dynamically import the component and set ssr to false
const ManualQuoteSevenStep = dynamic(() => import('../src/components/ManualQuoteSevenSteps'), {
  ssr: false,
});

export default function ManualQuotePage() {
  const { quoteDraft } = useQuote();

  return (
    <>
      <Head>
        <title>Get a Quote</title>
      </Head>
      <ManualQuoteSevenStep/>
    </>
  );
}
