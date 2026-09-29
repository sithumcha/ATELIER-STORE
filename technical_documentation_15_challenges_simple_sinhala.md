# ATELIER-STORE - ප්‍රධාන තාක්ෂණික අභියෝග 15 (සරල සිංහලෙන්)

> **ව්‍යාපෘතිය:** ATELIER-STORE (MERN E-Commerce Platform)  
> **අරමුණ:** Technical Viva, Code Audit සහ Presentation සඳහා සරල ලේඛනය  

---

## 1. MongoDB ObjectId සහ Custom String ID එකිනෙක ගැටීම
* **ගැටලුව (Problem):** පරණ Seed/Mock දත්ත වල `"p1"`, `"p2"` වැනි Custom String IDs තිබූ අතර, MongoDB මගින් අලුතින් සාදන ලද දත්ත වලට 24-character ObjectIds ලැබුණි. Product ID එකෙන් API එක හරහා Search කරද්දී `CastError: Cast to ObjectId failed` Error එක පැමිණ Crash විය.
* **විසඳුම (Solution):** ID එක 24-character Hexadecimal string එකක්දැයි Regex (`/^[0-9a-fA-F]{24}$/`) මගින් පරික්ෂා කර, නිවැරදි නම් `findById()` ද, නැතහොත් `findOne({ id })` ද භාවිත කරන ලදී.
* 📁 **File:** [`server/routes/productRoutes.js`](file:///d:/Intern/server/routes/productRoutes.js#L22-L27)

```javascript
if (id.match(/^[0-9a-fA-F]{24}$/)) {
  product = await Product.findById(id);
}
if (!product) {
  product = await Product.findOne({ id: id });
}
```

---

## 2. මිල ගණන් වල "LKR", "$" සහ කොමා පැවතීම (String Price Parsing)
* **ගැටලුව (Problem):** Admin forms හෝ Seed files හරහා එකතු කළ මිල ගණන් වල `"LKR 42,000"` හෝ `"$45.00"` ලෙස Text/String තිබූ නිසා MongoDB හි Sort, Filter කිරීමට නොහැකි විය.
* **විසඳුම (Solution):** Backend එකෙන් Regex (`/[^0-9.]/g`) යොදා අකුරු සහ සංකේත ඉවත් කර, පිරිසිදු අංකයක් (Number/Float) ලෙස පමණක් Database හි Save වන ලෙස සකසන ලදී.
* 📁 **File:** [`server/routes/productRoutes.js`](file:///d:/Intern/server/routes/productRoutes.js#L41-L45)

```javascript
const numericPrice = typeof rawPrice === 'number' 
  ? rawPrice 
  : parseFloat(String(rawPrice || 42000).replace(/[^0-9.]/g, '')) || 42000;
```

---

## 3. CORS Policy Blocking Error එක
* **ගැටලුව (Problem):** Frontend එක `localhost:5173` (Vite) හිද Backend එක `localhost:5001` (Express) හිද ධාවනය වූ නිසා Cross-Origin HTTP Requests Browser එකෙන් Block කරන ලදී.
* **විසඳුම (Solution):** Express Backend එකට `cors` middleware එක (`app.use(cors())`) ඇතුළත් කර Access-Control-Allow-Origin Headers සක්‍රීය කරන ලදී.
* 📁 **File:** [`server/server.js`](file:///d:/Intern/server/server.js#L25)

```javascript
import cors from 'cors';
app.use(cors());
```

---

## 4. Upload කළ පින්තූර පෙනෙන්නේ නැතිවීම (404 Static Path Error)
* **ගැටලුව (Problem):** Upload කළ පින්තූර Server එකේ `uploads/` ෆෝල්ඩරයේ තිබුණද, Frontend එකෙන් `http://localhost:5001/uploads/image.jpg` ලෙස Call කළ විට 404 Not Found ආවේය.
* **විසඳුම (Solution):** Express වල `express.static()` මගින් `uploads/` ෆෝල්ඩරය Public Static Directory එකක් ලෙස Expose කරන ලදී.
* 📁 **File:** [`server/server.js`](file:///d:/Intern/server/server.js#L29)

```javascript
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
```

---

## 5. විශාල පින්තූර Upload කිරීමේදී Error එක (413 Payload Too Large)
* **ගැටලුව (Problem):** 1MB ට වඩා වැඩි High-resolution Photos එකතු කිරීමේදී Express මගින් Request එක Reject විය.
* **විසඳුම (Solution):** Express body-parser limit එක `10MB` දක්වා වැඩි කර, Multer upload limit එකද `10MB` ලෙස සකසන ලදී.
* 📁 **Files:** [`server/server.js`](file:///d:/Intern/server/server.js#L24-L26) | [`server/middleware/uploadMiddleware.js`](file:///d:/Intern/server/middleware/uploadMiddleware.js#L9)

```javascript
// server.js
app.use(express.json({ limit: '10mb' }));

// uploadMiddleware.js
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
```

---

## 6. Browser Back / Forward ඔස්ට එකම View එකේ නතරවීම
* **ගැටලුව (Problem):** React Router නොමැතිව Tabs මාරු කළ නිසා, Browser එකේ Back (⬅️) ඔබන විට URL එක වෙනස් වුවත් Active View එක වෙනස් නොවීම.
* **විසඳුම (Solution):** `useEffect` එකක් ඇතුළත Global `popstate` event listener එකක් තබා, Browser URL එක වෙනස් වෙද්දී Active Tab State එක Auto-sync වන සේ සකසන ලදී.
* 📁 **File:** [`client/src/App.jsx`](file:///d:/Intern/client/src/App.jsx#L112-L121)

```javascript
useEffect(() => {
  const handlePopState = () => {
    const route = getTabFromPath(window.location.pathname);
    setActiveTabState(route.tab);
  };
  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, []);
```

---

## 7. Page Refresh කළ විට Cart එක සහ Login එක නැතිවීම
* **ගැටලුව (Problem):** Browser Page එක Refresh කළ සැනින් React State Clear වී User Logout වීම සහ Cart එකේ බඩු මකී යාම.
* **විසඳුම (Solution):** `LocalStorage` භාවිත කර User session එක සේව් කර තබාගත් අතර, එක එක පරිශීලකයාට වෙන් වෙන්ව `atelierstore_cart_<email>` ලෙස Storage Keys සකසන ලදී.
* 📁 **File:** [`client/src/App.jsx`](file:///d:/Intern/client/src/App.jsx#L129-L132)

```javascript
const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem('atelierstore_user');
  return savedUser ? JSON.parse(savedUser) : null;
});
```

---

## 8. "Buy Now" ඔබන විට Cart එකේ අනෙකුත් Items මිශ්‍ර වීම
* **ගැටලුව (Problem):** "Buy Now" ක්ලික් කළ විට දැනට Cart එකේ ඇති භාණ්ඩ වෙනස් නොකර හෝ මිශ්‍ර නොකර, එම අදාළ Item එක පමණක් Checkout එකට ගෙන යාමට අවශ්‍ය වීම.
* **විසඳුම (Solution):** වෙනම `directCheckoutItem` ලෙස State එකක් හදා, Direct Checkout යද්දී Cart එකට බාධා නොවන ලෙස එක Item එකක් පමණක් යැව්වා.
* 📁 **File:** [`client/src/App.jsx`](file:///d:/Intern/client/src/App.jsx#L85-L99)

---

## 9. Node.js හි ES6 Modules (`import`/`export`) Error එක
* **ගැටලුව (Problem):** Backend Node.js වල `import`/`export` යොදාගැනීමේදී `SyntaxError: Cannot use import statement outside a module` Error එක පැමිණීම.
* **විසඳුම (Solution):** Server හි `package.json` ගොනුවට `"type": "module"` එකතු කර, සියලු Local Imports වලට `.js` extension එක භාවිත කරන ලදී.
* 📁 **File:** [`server/package.json`](file:///d:/Intern/server/package.json#L6)

```json
{
  "type": "module"
}
```

---

## 10. Terminals දෙකක් නොමැතිව Frontend & Backend එකවර Run කිරීම
* **ගැටලුව (Problem):** Development වලදී Server එක සහ Client එක ධාවනයට වෙන වෙනම Terminals 2ක් පාවිච්චි කිරීමට සිදු වීම.
* **විසඳුම (Solution):** Root `package.json` එකට `concurrently` package එක යොදාගෙන, තනි `npm run dev` Command එකෙන් දෙකම එකවර Start වන ලෙස සකසන ලදී.
* 📁 **File:** [`package.json`](file:///d:/Intern/package.json#L7-L13)

```json
"scripts": {
  "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\""
}
```

---

## 11. Image නොවන වෙනත් Files (PDF, EXE) Upload වීම වැළැක්වීම
* **ගැටලුව (Problem):** Upload කරන ගොනු අතරට පින්තූර නොවන වෙනත් අනවශ්‍ය Files එකතු විය හැකි වීම.
* **විසඳුම (Solution):** Multer middleware එකේ `checkFileTypes` Function එකෙන් File extension එක සහ MIME-type එක දෙකම පින්තූර (`JPG, PNG, WEBP, GIF, SVG`) ද කියා සත්‍යාපනය කළා.
* 📁 **File:** [`server/middleware/uploadMiddleware.js`](file:///d:/Intern/server/middleware/uploadMiddleware.js#L31-L40)

---

## 12. Database Connection බිඳ වැටුණොත් Node App එක Crash වීම
* **ගැටලුව (Problem):** MongoDB Connection String එක වැරදි වූ විට හෝ DB Offline වූ විට Node Server එක Unhandled Rejection එකක් දී අඩාල වීම.
* **විසඳුම (Solution):** `mongoose.connect` කොටස `async try-catch` බ්ලොක් එකකින් ආවරණය කර, Connection බිඳ වැටුණොත් `process.exit(1)` මගින් ආරක්ෂිතව Process එක Terminate වන සේ හැදුවා.
* 📁 **File:** [`server/config/db.js`](file:///d:/Intern/server/config/db.js#L5-L13)

```javascript
try {
  await mongoose.connect(process.env.MONGO_URI);
} catch (error) {
  process.exit(1);
}
```

---

## 13. ගණන් හදද්දී දශම ස්ථාන වැරදීම (Floating-Point Precision)
* **ගැටලුව (Problem):** Discounts, Tax ගණනය කිරීමේදී JavaScript ගණිතමය ගැටලු නිසා `Rs. 4200.0000000000005` වැනි දිගු දශම අගයන් පැමිණීම.
* **විසඳුම (Solution):** Checkout ගණනය කිරීම් වලදී `Math.round()` භාවිත කර අගයන් නිවැරදි පූර්ණ සංඛ්‍යා ලෙස ලබා ගන්නා ලදී.
* 📁 **File:** [`client/src/pages/CheckoutPage.jsx`](file:///d:/Intern/client/src/pages/CheckoutPage.jsx#L68-L77)

---

## 14. Backend API එක Offline වුණොත් Web App එක හිස් වීම
* **ගැටලුව (Problem):** Backend Server එක හෝ Database එක ඩවුන් වුවහොත් Front-end UI එක හිස් වී හෝ Crash වී පෙනීම.
* **විසඳුම (Solution):** API Fetching සඳහා `try-catch-finally` යොදාගත් අතර, API එක Offline වුවහොත් පෙන්වීම සඳහා Pre-curated Fallback Products Array එකක් සූදානම් කර තිබුණි.
* 📁 **File:** [`client/src/admin/AdminProducts.jsx`](file:///d:/Intern/client/src/admin/AdminProducts.jsx#L14-L43)

---

## 15. Product එකක් Delete කළ විට UI එකෙන් ක්ෂණිකව අයින් නොවීම
* **ගැටලුව (Problem):** Admin විසින් Product එකක් Delete කළ විට Database එකෙන් මැකුණද, Page Refresh කරන තෙක් UI එකෙහි පෙනෙමින් පැවතීම.
* **විසඳුම (Solution):** Delete API Request එක සාර්ථක වූ වහාම Optimistic State Update එකක් (`setProducts(prev => prev.filter(...))`) සිදු කර ක්ෂණිකව UI එකෙන් ඉවත් කරන ලදී.
* 📁 **File:** [`client/src/admin/AdminProducts.jsx`](file:///d:/Intern/client/src/admin/AdminProducts.jsx#L51-L59)
