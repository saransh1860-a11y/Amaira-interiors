import { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  LogIn,
  Calendar,
  Phone,
  User as UserIcon,
  Filter,
  ShieldAlert,
  Mail
} from 'lucide-react';

interface Consultation {
  id: string;
  name: string;
  phone: string;
  service: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: any;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'consultations' | 'messages'>('consultations');
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Simple check if user is the primary admin from config/rules
        const isPrimaryAdmin = user.email === 'saransh1860@gmail.com';
        
        if (isPrimaryAdmin) {
          setIsAdmin(true);
        } else {
          // Check if user exists in the admins collection
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            setIsAdmin(adminDoc.exists());
          } catch (error) {
            console.error("Admin check failed", error);
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    // Listen to Consultations
    const qC = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
    const unsubscribeC = onSnapshot(qC, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Consultation[];
        setConsultations(data);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'consultations');
      }
    );

    // Listen to Messages
    const qM = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const unsubscribeM = onSnapshot(qM, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(data);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'contacts');
      }
    );

    return () => {
      unsubscribeC();
      unsubscribeM();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.hash = '';
  };

  const updateStatus = async (id: string, newStatus: Consultation['status']) => {
    try {
      await updateDoc(doc(db, 'consultations', id), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `consultations/${id}`);
    }
  };

  const filteredConsultations = filter === 'all' 
    ? consultations 
    : consultations.filter(c => c.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-luxury-ink/40 uppercase tracking-widest text-[10px]">Authorizing...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[40px] shadow-2xl border border-luxury-ink/5 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-luxury-ink rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl transform -rotate-12">
            <ShieldAlert className="w-10 h-10 text-luxury-gold" />
          </div>
          <h2 className="text-3xl font-serif mb-4">Restricted Access</h2>
          <p className="text-luxury-ink/60 mb-10 leading-relaxed">
            This portal is only accessible to authorized design administrators of Vashishth Design Studio.
          </p>
          
          {user ? (
            <div className="space-y-6">
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs flex items-center gap-3">
                <XCircle className="w-5 h-5" />
                <span>Account <strong>{user.email}</strong> is not authorized.</span>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full bg-luxury-ink text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black transition-all"
              >
                Try Different Account
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="w-full bg-luxury-ink text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center justify-center gap-3 group"
            >
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Sign in with Google
            </button>
          )}
          
          <button 
            onClick={() => window.location.hash = ''} 
            className="mt-8 text-[10px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity"
          >
            ← Return to Website
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg">
      {/* Sidebar/Header */}
      <header className="bg-luxury-ink text-white p-6 sticky top-0 z-30 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-luxury-gold rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-serif">Admin Portal</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Verified Session</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user?.displayName}</p>
              <p className="text-[10px] opacity-60">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              title="Return Home"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-serif mb-2">{activeTab === 'consultations' ? 'Consultations' : 'Messages'}</h2>
            <p className="text-luxury-ink/60">Manage your website inquiries and bookings.</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('consultations')}
              className={`px-6 py-3 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all ${
                activeTab === 'consultations' ? 'bg-luxury-ink text-white shadow-xl' : 'bg-white text-luxury-ink/40 hover:bg-luxury-bg border border-luxury-ink/5'
              }`}
            >
              Consultations ({consultations.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all ${
                activeTab === 'messages' ? 'bg-luxury-ink text-white shadow-xl' : 'bg-white text-luxury-ink/40 hover:bg-luxury-bg border border-luxury-ink/5'
              }`}
            >
              Contact Messages ({messages.length})
            </button>
          </div>
        </div>

        {activeTab === 'consultations' ? (
          <>
            <div className="flex items-center gap-3 bg-white p-1 rounded-2xl shadow-sm border border-luxury-ink/5 w-fit mb-8 overflow-x-auto no-scrollbar">
              {(['all', 'pending', 'contacted', 'completed', 'cancelled'] as const).map((stat) => (
                <button
                  key={stat}
                  onClick={() => setFilter(stat)}
                  className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                    filter === stat 
                      ? 'bg-luxury-gold text-white shadow-md' 
                      : 'text-luxury-ink/40 hover:text-luxury-ink hover:bg-luxury-bg'
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>

            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {filteredConsultations.map((c) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={c.id}
                    className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-luxury-ink/5 hover:shadow-xl transition-shadow group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-luxury-bg rounded-full flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-colors">
                            <UserIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-serif">{c.name}</h3>
                            <p className="text-xs uppercase tracking-widest text-luxury-ink/40">{c.service}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div className="flex items-center gap-3 text-luxury-ink/70 bg-luxury-bg/50 px-4 py-2 rounded-xl">
                            <Phone className="w-4 h-4 text-luxury-gold" />
                            <span className="font-mono">{c.phone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-luxury-ink/70 bg-luxury-bg/50 px-4 py-2 rounded-xl">
                            <Calendar className="w-4 h-4 text-luxury-gold" />
                            <span>{c.createdAt?.toDate().toLocaleString() || 'Just now'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 lg:border-l lg:border-luxury-ink/5 lg:pl-10">
                        <button
                          onClick={() => updateStatus(c.id, 'pending')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                            c.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                          }`}
                        >
                          <Clock className="w-3 h-3" /> Pending
                        </button>
                        <button
                          onClick={() => updateStatus(c.id, 'contacted')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                            c.status === 'contacted' ? 'bg-blue-500 text-white' : 'bg-blue-5 text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          <Phone className="w-3 h-3" /> Contacted
                        </button>
                        <button
                          onClick={() => updateStatus(c.id, 'completed')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                            c.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" /> Done
                        </button>
                        <button
                          onClick={() => updateStatus(c.id, 'cancelled')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                            c.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          <XCircle className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {filteredConsultations.length === 0 && (
                  <div className="py-24 text-center">
                    <h3 className="text-2xl font-serif text-luxury-ink/40">No consultations found</h3>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {messages.map((m) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={m.id}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-luxury-ink/5"
                >
                   <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-12 h-12 bg-luxury-ink/5 rounded-2xl flex items-center justify-center text-luxury-ink">
                            <Mail className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-serif">{m.name}</h3>
                            <p className="text-xs uppercase tracking-widest text-luxury-ink/40">{m.email}</p>
                          </div>
                        </div>
                        <p className="text-luxury-ink/80 leading-relaxed bg-luxury-bg/30 p-6 rounded-2xl italic">
                          "{m.message}"
                        </p>
                        <div className="flex gap-10 pt-4 text-xs font-medium text-luxury-ink/40">
                             <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3" /> {m.phone}
                             </div>
                             <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> {m.createdAt?.toDate().toLocaleString()}
                             </div>
                        </div>
                      </div>
                   </div>
                </motion.div>
              ))}
              {messages.length === 0 && (
                <div className="py-24 text-center">
                  <h3 className="text-2xl font-serif text-luxury-ink/40">No messages yet</h3>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      <footer className="py-12 bg-white border-t border-luxury-ink/5 mt-24">
        <div className="container mx-auto px-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">Vashishth Design Studio • Private Admin Panel</p>
        </div>
      </footer>
    </div>
  );
}
