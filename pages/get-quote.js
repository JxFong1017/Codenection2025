import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DecisionPopup from '../src/components/DecisionPopup';

export default function GetQuoteDecision() {
  const { status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      setIsOpen(true);
    }
  }, [status, router]);

  const handleDecision = (decision) => {
    setIsOpen(false);
    if (decision === 'manual') {
      router.replace('/manual-quote');
    } else if (decision === 'image') {
      router.replace('/vehicle-validation-form?mode=image');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    router.replace('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Get Quote - Choose Input Method</title>
      </Head>
      <div className="min-h-screen bg-black">
        <DecisionPopup isOpen={isOpen} onClose={handleClose} onDecision={handleDecision} />
      </div>
    </>
  );
}
