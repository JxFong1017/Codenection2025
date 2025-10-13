
import { collection, query, where, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../lib/firebase";

import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { useT } from "../src/utils/i18n";
import Link from "next/link";
import PolicyDetail from "../src/components/PolicyDetail.js";

export default function AllRecords() {
  const t = useT();

  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for latest, 'asc' for oldest
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, fetch their data
            const policiesQuery = query(
                collection(db, "policies"),
                where("user_email", "==", user.email),
                where("status", "==", "completed")
            );

            const unsubscribeSnapshot = onSnapshot(policiesQuery, (querySnapshot) => {
                const userPolicies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRecords(userPolicies);
            });

            // Important: Return the snapshot listener's unsubscribe function
            // to be called when the auth state changes or component unmounts.
            return () => unsubscribeSnapshot();

        } else {
            // User is signed out, clear data and redirect
            setRecords([]);
            router.push("/");
        }
    });

    // Cleanup the auth listener on component unmount
    return () => unsubscribe();
}, [router]); // Dependency on router


  useEffect(() => {
    if (!firebaseUser) return;

    const policiesQuery = query(
      collection(db, "policies"),
      where("user_email", "==", firebaseUser.email),
      where("status", "==", "completed")
    );

    const unsubscribe = onSnapshot(policiesQuery, (querySnapshot) => {
      const userPolicies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(userPolicies);
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  const displayedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date(0);
        const dateB = b.createdAt?.toDate() || new Date(0);
        if (sortOrder === 'asc') {
            return dateA - dateB;
        }
        return dateB - dateA;
    });
  }, [records, sortOrder]);

  return (
    <>
      <Head>
        <title>All Car Records - CGS Insurance</title>
        <meta name="description" content="All your car insurance records" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/dashboard">
                  <h1 className="text-2xl font-extrabold text-blue-900">CGS</h1>
                </Link>
              </div>
              <div className="flex items-center">
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-900">
                  {t("Back to Home Page")}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">
                {t("My Car Records")}
              </h3>
              <div className="flex items-center gap-4">
                <div>
                  <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="desc">Latest to Oldest</option>
                    <option value="asc">Oldest to Latest</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayedRecords.length > 0 ? (
                displayedRecords.map((record) => {
                  const submittedAt = record.submittedAt?.toDate();
                  const expiryDate = submittedAt ? new Date(new Date(submittedAt).setFullYear(submittedAt.getFullYear() + 1)) : null;
                  const daysLeft = expiryDate ? Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

                  return (
                    <div key={record.id} className="bg-[#BFE4ED] rounded-lg p-6 h-72 flex flex-col justify-between">
                      <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-extrabold text-4xl text-[#162679] p-2">
                                {record.plateNumber}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-2xl text-[#162679]">
                              {`${record.car_brand} ${record.vehicleModel} ${record.manufactured_year}`}
                            </div>
                          </div>
                          <div>
                            {daysLeft !== null && daysLeft > 30 && (
                              <div className="text-sm text-gray-600">
                                {t("insurance_active_until")} {expiryDate.toLocaleDateString()}
                              </div>
                            )}
                            {daysLeft !== null && daysLeft <= 30 && daysLeft > 0 && (
                              <div className="text-sm text-red-600 font-medium">
                                {`Insurance expires in ${daysLeft} days`}
                              </div>
                            )}
                            {daysLeft !== null && daysLeft <= 0 && (
                               <div className="text-sm text-red-700 font-bold">
                                Insurance has expired
                              </div>
                            )}
                          </div>
                        </div>
                      {(daysLeft !== null && daysLeft <= 30) ? (
                        <button onClick={() => router.push(`/confirm?quoteId=${record.id}`)} className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800">
                          {t("renew")}
                        </button>
                      ) : (
                        <button onClick={() => setSelectedRecord(record)} className="w-full bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                          {t("view")}
                        </button>
                      )}
                    </div>
                  )
                })
              ) : (
                <p className="col-span-3 text-center text-gray-500">
                  You have no completed car records yet.
                </p>
              )}
            </div>
            {selectedRecord && <PolicyDetail policy={selectedRecord} onClose={() => setSelectedRecord(null)} t={t} />}
          </div>
        </main>
      </div>
    </>
  );
}
