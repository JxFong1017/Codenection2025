import Head from 'next/head';
import VehicleForm from '../src/components/VehicleForm';

export default function Home() {
  return (
    <>
      <Head>
        <title>Smart Vehicle Data Validation - Malaysian Market</title>
        <meta name="description" content="Real-time vehicle data validation and error detection system for Malaysian vehicles" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <VehicleForm />
        </div>
      </main>
    </>
  );
}
