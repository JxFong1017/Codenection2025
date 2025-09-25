import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Head from 'next/head';
import { useT } from '../src/utils/i18n';
import Link from 'next/link';

export default function Profile() {
  const t = useT();
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, 'users', session.user.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setName(userData.name);
          setPhone(userData.phone);
          setEmail(userData.email);
        } else {
          console.log('No such document!');
        }
      };
      fetchUserData();
    }
  }, [session]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    if (session) {
      const userDocRef = doc(db, 'users', session.user.email);
      try {
        await updateDoc(userDocRef, {
          name: name,
          phone: phone,
        });
        setMessage('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating document: ', error);
        setMessage('Error updating profile.');
      }
    }
  };

  return (
    <>
      <Head>
        <title>{t('Profile')} - CGS Insurance</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('Profile')}</h1>
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
              {t('Back to Dashboard')}
            </Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-8 rounded-lg shadow">
            <form onSubmit={handleUpdate}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t('Name')}
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    {t('Phone')}
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('Email')}
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
                      value={email}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('Update Profile')}
                </button>
              </div>
            </form>
            {message && (
              <p className="mt-4 text-sm text-center" style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>
                {t(message)}
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
