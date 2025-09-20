import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import the component and set ssr to false
const ManualQuoteSevenStep = dynamic(() => import('../src/components/ManualQuoteSevenSteps'), {
  ssr: false,
});

export default function ManualQuotePage() {
  return (
    <>
      <Head>
        <title>Get a Quote</title>
      </Head>
      <ManualQuoteSevenStep />
    </>
  );
}
