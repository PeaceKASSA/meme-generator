import { useState, useRef, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBtpUTjzFeiFl0NwODK9o0qRZDlj-tNIn8",
  authDomain: "meme-2026-simple.firebaseapp.com",
  projectId: "meme-2026-simple",
  storageBucket: "meme-2026-simple.firebasestorage.app",
  messagingSenderId: "67917291376",
  appId: "1:67917291376:web:ac39b8fc8da959f7eb39b5",
  measurementId: "G-V5YW5FM9K6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('editor');
  const [image, setImage] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(50);
  const [textColor, setTextColor] = useState('#ffffff');
  const [memes, setMemes] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auth anonyme
  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, (u) => u && setUser(u));
  }, []);

  // Fonction pour charger les mèmes
  const loadMemes = async () => {
    if (!user) return;

    setLoadingGallery(true);
    try {
      const q = query(
        collection(db, 'memes'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const loaded = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMemes(loaded);
    } catch (err) {
      console.error("Erreur chargement mèmes :", err);
    } finally {
      setLoadingGallery(false);
    }
  };

  // Charge au démarrage quand user est prêt
  useEffect(() => {
    if (user) loadMemes();
  }, [user]);

  // Dessin sur le canvas
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(4, fontSize / 10);
    ctx.textAlign = 'center';

    if (topText) {
      const y = fontSize + 20;
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, y);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, y);
    }

    if (bottomText) {
      const y = canvas.height - 30;
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, y);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, y);
    }
  };

  useEffect(() => { draw(); }, [image, topText, bottomText, fontSize, textColor]);

  // Upload + resize
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const MAX = 800;
      if (width > MAX) {
        height = Math.round((height * MAX) / width);
        width = MAX;
      }

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const resized = new Image();
      resized.src = tempCanvas.toDataURL('image/jpeg', 0.92);
      resized.onload = () => setImage(resized);
    };
    img.src = URL.createObjectURL(file);
  };

  // Télécharger
  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'mon-meme.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.92);
    link.click();
  };

  // Sauvegarder
  const saveToGallery = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !user) {
      alert("Canvas ou user manquant !");
      return;
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const base64String = dataUrl.split(',')[1];

    try {
      const formData = new FormData();
      formData.append('image', base64String);
      formData.append('key', '2c75e40545d8826ba8a078e926680d3d');

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Upload ImgBB échoué');
      }

      const url = result.data.url;

      // Sauvegarde URL dans Firestore
      await addDoc(collection(db, 'memes'), {
        url,
        uid: user.uid,
        createdAt: new Date(),
      });

      // Recharge la galerie IMMÉDIATEMENT
      await loadMemes();

      alert('✅ Mème sauvegardé !');

    } catch (err) {
      console.error("Erreur :", err);
      alert('Erreur : ' + (err.message || "Vérifie la console"));
    }
  };

  // Partager
  const share = (url, platform) => {
    const text = encodeURIComponent("Regarde ce mème que je viens de créer ! 😂");
    let link = '';
    if (platform === 'twitter') link = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    if (platform === 'facebook') link = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    if (platform === 'whatsapp') link = `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`;
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">😂 Meme Generator</h1>

        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setMode('editor')} className={`px-6 py-3 rounded-xl font-medium ${mode === 'editor' ? 'bg-yellow-500 text-black' : 'bg-gray-800'}`}>
            Créer un mème
          </button>
          <button onClick={() => { setMode('gallery'); loadMemes(); }} className={`px-6 py-3 rounded-xl font-medium ${mode === 'gallery' ? 'bg-yellow-500 text-black' : 'bg-gray-800'}`}>
            Ma galerie ({memes.length})
          </button>
        </div>

        {/* EDITOR */}
        {mode === 'editor' && (
          <div className="space-y-8">
            {!image ? (
              <div className="border-2 border-dashed border-gray-700 rounded-3xl h-96 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition" onClick={() => fileInputRef.current.click()}>
                <p className="text-2xl mb-2">📤 Clique ou dépose une image</p>
                <p className="text-gray-500">JPG, PNG, GIF (max 800px recommandé)</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <canvas ref={canvasRef} className="max-w-full border border-gray-700 rounded-2xl shadow-2xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-1">Texte du haut</label>
                    <input type="text" value={topText} onChange={e => setTopText(e.target.value)} placeholder="TOP TEXT" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Texte du bas</label>
                    <input type="text" value={bottomText} onChange={e => setBottomText(e.target.value)} placeholder="BOTTOM TEXT" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-lg" />
                  </div>
                </div>

                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Taille du texte</label>
                    <input type="range" min="20" max="120" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full" />
                    <div className="text-center text-sm text-gray-400">{fontSize}px</div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Couleur</label>
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-12 h-12 rounded-xl overflow-hidden" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={downloadMeme} className="flex-1 bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400">⬇️ Télécharger</button>
                  <button onClick={saveToGallery} className="flex-1 bg-yellow-500 text-black py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400">💾 Sauvegarder</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* GALLERY */}
        {mode === 'gallery' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loadingGallery ? (
              <p className="col-span-full text-center py-20 text-yellow-400">Chargement de tes mèmes...</p>
            ) : memes.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-20">Aucun mème encore… Crée-en un !</p>
            ) : (
              memes.map(meme => (
                <div key={meme.id} className="bg-gray-900 rounded-3xl overflow-hidden">
                  <img src={meme.url} alt="meme" className="w-full" />
                  <div className="p-4 flex gap-3">
                    <a href={meme.url} download className="flex-1 bg-white text-black py-3 rounded-2xl text-center font-medium">⬇️</a>
                    <button onClick={() => share(meme.url, 'twitter')} className="flex-1 bg-[#1DA1F2] py-3 rounded-2xl">𝕏</button>
                    <button onClick={() => share(meme.url, 'facebook')} className="flex-1 bg-[#1877F2] py-3 rounded-2xl">f</button>
                    <button onClick={() => share(meme.url, 'whatsapp')} className="flex-1 bg-[#25D366] py-3 rounded-2xl">WhatsApp</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}