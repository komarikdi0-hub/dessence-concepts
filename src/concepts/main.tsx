import { StrictMode, useState, useRef, useEffect, useLayoutEffect, useMemo, type CSSProperties, type ReactNode } from 'react';
import { Trash2, Share2, Plus } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import './reset.css';

/* ═══════════════════════════════════════════════════════
   dEssence — "Clean Air" Concept
   Apple purity · Vercel confidence · Content-first
   ═══════════════════════════════════════════════════════ */

const sans = '"IBM Plex Sans", system-ui, sans-serif';
const serif = '"IBM Plex Serif", Georgia, serif';

const bg = '#F5F5F7';
const white = '#FFFFFF';
const black = '#1D1D1F';
const gray1 = '#86868B';
const gray2 = '#AEAEB2';
const gray3 = '#D2D2D7';
const gray4 = '#E8E8ED';
const gray5 = '#F5F5F7';
const accent = '#0071E3';

// ── Data ──

interface Card {
  id: string;
  type: 'link' | 'photo' | 'text' | 'video' | 'product' | 'document' | 'gallery';
  title: string;
  desc?: string;
  source?: string;
  image?: string;
  images?: string[];
  price?: string;
  author?: string;
  time: string;
  labels?: string[];
  aiAnalysis?: string;
}

const CARDS: Card[] = [
  { id:'50', type:'gallery', title:'Tokyo — Shimokitazawa & Yanaka', time:'2d ago', images:[
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&h=400&fit=crop',
  ], labels:['travel','tokyo','japan'], aiAnalysis:'4 shots from the non-touristy side of Tokyo. Shimokitazawa for vintage shopping, Yanaka for old-town atmosphere.' },

  { id:'51', type:'gallery', title:'Dinner at Vini e Fritti', time:'5d ago', images:[
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&h=400&fit=crop',
  ], labels:['food','restaurant','milan'], aiAnalysis:'3 shots from the Milan dinner. Ambience, truffle pasta, and the dessert board.' },

  { id:'52', type:'gallery', title:'New wardrobe pieces — spring haul', time:'1w ago', images:[
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=440&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop',
  ], labels:['fashion','spring','wardrobe'], aiAnalysis:'5 new pieces: linen shirt, ecru coat, two dresses, and a blazer. Building the neutral palette.' },

  { id:'25', type:'photo',    title:'', time:'30m ago', image:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop', labels:['food'], aiAnalysis:'Meal photo saved from Instagram. Looks like a brunch spread.' },
  { id:'36', type:'document', title:'Budget 2025.xlsx', source:'Google Sheets', time:'45m ago', labels:['finance','budget','work'], aiAnalysis:'Monthly budget tracker. March overspent on dining out by $240.' },
  { id:'32', type:'document', title:'Q1 2025 Marketing Report.pdf', source:'Google Drive', time:'1h ago', labels:['work','marketing','report'], aiAnalysis:'Q1 summary with campaign performance. Conversion up 12%, email open rate at 34%.' },
  { id:'40', type:'document', title:'contacts_export_march.csv', source:'CRM export', time:'1h ago', labels:['work','contacts','data'], aiAnalysis:'847 contacts exported from HubSpot.' },
  { id:'38', type:'document', title:'Q2 Product Roadmap.pptx', source:'Google Drive', time:'2h ago', labels:['work','product','strategy'], aiAnalysis:'14-slide deck. Three key initiatives: onboarding redesign, API launch, mobile app.' },
  { id:'30', type:'video',    title:'Gordon Ramsay — Perfect Scrambled Eggs', source:'youtube.com', time:'2h ago', image:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&h=400&fit=crop', labels:['recipe','cooking','eggs','technique'], aiAnalysis:'3-minute technique: low heat, remove early, crème fraîche to finish. Saved to try Sunday.' },
  { id:'33', type:'document', title:'Italy Trip — Packing List.docx', source:'Notion export', time:'2h ago', labels:['travel','packing','italy'], aiAnalysis:'10-day list: linen clothes, walking shoes, adapter flagged as essentials.' },
  { id:'23', type:'product',  title:'Nike Air Force 1 \'07 — White', source:'nike.com', price:'$115', time:'3h ago', image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop', labels:['sneakers','nike','classic'], aiAnalysis:'Triple white colorway. Classic everyday sneaker, going with the linen look.' },
  { id:'1',  type:'text',    title:'"That COS cashmere sweater is the best thing I\'ve bought all year. Get the oatmeal color, trust me."', author:'Sarah', time:'3h ago',  labels:['fashion advice','cashmere','cos','friend rec'], aiAnalysis:'Friend recommendation for COS cashmere sweater in oatmeal. Sarah rates it as best purchase of the year.' },
  { id:'2',  type:'link',    title:'One-Pot Creamy Tomato Pasta', source:'minimalistbaker.com', time:'4h ago',  image:'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop', labels:['recipe','pasta','30 min','vegetarian'], aiAnalysis:'Creamy tomato base, one pot, feeds 4–6. Ready in 30 minutes.' },
  { id:'6',  type:'link',    title:'10 Days in Italy — Rome → Florence → Amalfi', source:'ricksteves.com', time:'5h ago',  image:'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=600&h=360&fit=crop', labels:['travel','italy','itinerary','summer'], aiAnalysis:'Day-by-day guide with restaurant picks. Best itinerary I\'ve found for a first Italy trip.' },
  { id:'7',  type:'text',    title:'"The best interface is no interface. The best design dissolves into behavior." — Golden Krishna', time:'7h ago',  labels:['design','ux','quote'], aiAnalysis:'Core principle for the upcoming product presentation. Slide-worthy quote.' },
  { id:'8',  type:'text',    title:'Wine pairing cheatsheet: Lamb → Barolo. Pasta → Chianti. White fish → Sancerre. Cheese board → Grüner Veltliner.', time:'8h ago',  labels:['wine','food pairing','reference'], aiAnalysis:'Personal quick-reference for dinner parties. Saved after the Nobu visit.' },
  { id:'9',  type:'photo',   title:'Billie Eilish — Hit Me Hard and Soft Tour, Paris', time:'1d ago',  image:'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=480&fit=crop', labels:['concert','billie eilish','paris','2025'], aiAnalysis:'Live show at Accor Arena Paris. Minimal staging, all-white aesthetic. Best production I\'ve seen.' },
  { id:'10', type:'link',    title:'Billie Eilish — Hit Me Hard and Soft (Review)', source:'pitchfork.com', time:'1d ago',  labels:['music','review','billie eilish','album'], aiAnalysis:'Pitchfork 9.1 — her most mature work yet. Co-written with Finneas, deeply personal.' },
  { id:'11', type:'text',    title:'Podcast from Alex: "Diary of a CEO" with James Clear. About building systems, not goals. Life-changing framing.', author:'Alex', time:'1d ago',  labels:['podcast','productivity','james clear'], aiAnalysis:'Alex marked this as essential. Atomic Habits angle: identity-based habits beat outcome goals.' },
  { id:'12', type:'link',    title:'Best Chocolate Chip Cookies — Brown Butter Method', source:'bonappetit.com', time:'2d ago',  image:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop', labels:['recipe','baking','cookies','weekend'], aiAnalysis:'Key: brown butter + 36-hour rest + sea salt finish. Worth the effort every time.' },
  { id:'13', type:'text',    title:'"People ignore design that ignores people." — Frank Chimero. Saving for the deck next Thursday.', time:'2d ago',  labels:['design','quote','presentation'], aiAnalysis:'Human-centered design principle. Perfectly frames the UX section of the Q2 deck.' },
  { id:'14', type:'photo',   title:'Arctic Monkeys — The Car Tour, London O2', time:'2d ago',  image:'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=480&fit=crop', labels:['concert','arctic monkeys','london','2025'], aiAnalysis:'Alex Turner in a three-piece suit. Orchestral arrangements, no opener. Proper concert.' },
  { id:'15', type:'text',    title:'Risotto technique: toast the rice 3 min dry, add wine cold, ladle warm stock one at a time, stir constantly for 18 min. Finish with butter off heat.', time:'3d ago',  labels:['cooking','technique','risotto','italian'], aiAnalysis:'Perfected this after 4 attempts. The cold wine step and butter finish make all the difference.' },
  { id:'16', type:'link',    title:'The Perfect Roast Chicken', source:'nytcooking.com', time:'3d ago',  image:'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop', labels:['recipe','chicken','dinner','classic'], aiAnalysis:'Dry-brine 24h in advance, high heat 450°F, rest 10 min. The only chicken recipe needed.' },
  { id:'17', type:'text',    title:'"Simplicity is the ultimate sophistication." Reminding myself of this every time I open the slide deck.', time:'3d ago',  labels:['quote','design','work'], aiAnalysis:'Da Vinci quote. Personal mantra when designs get overengineered.' },
  { id:'18', type:'product', title:'Zara Oversized Wool Coat — Ecru', source:'zara.com', price:'$169', time:'4d ago',  image:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=440&fit=crop', labels:['fashion','outerwear','winter'], aiAnalysis:'Dropped shoulder, oversized fit. Ecru is the most versatile neutral this season.' },
  { id:'19', type:'text',    title:'Restaurant note: Eataly truffle pasta — ask for terrace seating, go Tuesday or Wednesday, avoid weekends. Jake went three times.', author:'Jake', time:'4d ago',  labels:['restaurant','milan','tip','food'], aiAnalysis:'Jake\'s insider notes on Eataly. Truffle pasta specifically flagged. Terrace worth requesting.' },
  { id:'20', type:'photo',   title:'Radiohead — OK Computer 25th Anniversary, Amsterdam', time:'5d ago',  image:'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=480&fit=crop', labels:['concert','radiohead','amsterdam','iconic'], aiAnalysis:'Full OK Computer playthrough. Thom Yorke said it was the last time they\'d play it complete.' },
  { id:'21', type:'link',    title:'How to Plan a Dinner Party Without Stress', source:'seriouseats.com', time:'5d ago',  labels:['cooking','entertaining','guide'], aiAnalysis:'Two-day prep timeline, menu planning, make-ahead dishes. Read before the dinner party on Friday.' },
  { id:'22', type:'text',    title:'Books to read this month: 1. Piranesi (Clarke). 2. Tomorrow and Tomorrow (Zevin). 3. Demon Copperhead (Kingsolver). Ask Emma about #3.', time:'6d ago',  labels:['books','reading list','fiction'], aiAnalysis:'Curated reading list. Emma specifically recommended Kingsolver — needs follow-up.' },
  { id:'24', type:'text',    title:'"Do one thing every day that scares you." Three weeks in — this is working. Logged: cold swim Mon, presented to board Wed, called Dad Thu.', time:'1w ago',  labels:['personal','growth','habit tracking'], aiAnalysis:'Personal challenge log. Three activities tracked across the week. Positive progress noted.' },

  // Photo-only
  { id:'26', type:'photo', title:'', time:'1d ago',  image:'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=500&fit=crop', labels:['travel'], aiAnalysis:'Travel landscape, possibly Alps or Dolomites region.' },
  { id:'27', type:'photo', title:'', time:'3d ago',  image:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=500&fit=crop', labels:['fashion'], aiAnalysis:'Fashion screenshot saved for outfit reference.' },
  { id:'28', type:'photo', title:'', time:'5d ago',  image:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop', labels:['restaurant'], aiAnalysis:'Restaurant interior, warm lighting, Mediterranean style.' },
  { id:'29', type:'photo', title:'', time:'1w ago',  image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop', labels:['inspiration'], aiAnalysis:'Portrait saved as mood board reference.' },

  // Video
  { id:'31', type:'video', title:'Tokyo Travel Guide 2025 — Hidden Neighborhoods', source:'youtube.com', time:'4d ago', image:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop', labels:['travel','tokyo','japan','guide'], aiAnalysis:'Covers Shimokitazawa, Yanaka, and Koenji — the non-touristy areas. Timestamps saved.' },

  // Documents
  { id:'34', type:'document', title:'Apartment Lease Renewal 2025.pdf',   source:'Email attachment',time:'2d ago', labels:['home','legal','important'],      aiAnalysis:'Rent increase 4.5%, new subletting clause. Review before signing.' },
  { id:'35', type:'document', title:'Sourdough Starter Guide.pdf',        source:'Downloaded',     time:'1w ago',  labels:['recipe','baking','sourdough'],   aiAnalysis:'Day-by-day feeding schedule, hydration ratios, troubleshooting guide.' },
  { id:'37', type:'document', title:'Campaign Results — April.xlsx',      source:'Google Drive',   time:'2h ago',  labels:['work','marketing','data'],       aiAnalysis:'Ad performance spreadsheet. Best performing channel: Instagram Stories at 4.2% CTR.' },
  { id:'39', type:'document', title:'Design Presentation — Concept 2.pptx', source:'Figma export', time:'1d ago', labels:['design','work','presentation'],  aiAnalysis:'Visual concept deck for stakeholder review. 8 screens, two color variants.' },
  { id:'41', type:'document', title:'recipes_collection.csv',             source:'Exported',       time:'5d ago',  labels:['recipes','collection','data'],   aiAnalysis:'Spreadsheet of 62 saved recipes with source URLs, cook time, and rating.' },
];

interface Msg {
  id: string;
  role: 'user' | 'ai';
  text?: string;
  image?: string;
  items?: string[];
  action?: string;
  related?: Array<{ id: string; title: string; type: string; time: string }>;
  poll?: { question: string; options: string[]; selected?: number };
  attachment?: { name: string; ext: string; size: string };
  buttons?: string[];
}
const MSGS: Msg[] = [
  { id:'1', role:'user', text:'Hey, remind me — what was that Italian restaurant Jake recommended?' },
  { id:'2', role:'ai', text:"Jake mentioned Eataly in your conversation last Thursday. He specifically recommended the truffle pasta and said to ask for a table on the terrace.", buttons:['Open Jake\'s note', 'Add to Italy trip plan', 'Set reminder'] },
  { id:'3', role:'user', text:'What should I cook for dinner? Having 6 friends over.' },
  { id:'4', role:'ai', text:"I'd suggest the One-Pot Creamy Tomato Pasta from Minimalist Baker — it serves 6 and is ready in 30 minutes. Your Bon Appétit cookie recipe would make a great dessert.", related:[
    { id:'2',  title:'One-Pot Creamy Tomato Pasta', type:'link', time:'4h ago' },
    { id:'12', title:'Best Chocolate Chip Cookies — Brown Butter Method', type:'link', time:'2d ago' },
  ]},
  { id:'5', role:'ai', poll:{ question:'Should I help you plan the full dinner menu?', options:['Yes — starters, main, dessert', 'Just the main course', 'No thanks, I\'m good'], selected:0 } },
  { id:'6', role:'user', text:'Yes please. And what wine goes with the pasta?' },
  { id:'7', role:'ai', text:"From your tasting notes — Chianti or Pinot Grigio works beautifully with tomato. A Vermentino would feel especially nice for a dinner party.", items:[
    'Starter — bruschetta or burrata (30 min prep)',
    'Main — one-pot tomato pasta, scaled for 6',
    'Wine — Chianti or Vermentino',
    'Dessert — brown butter cookies (bake day before)',
  ], buttons:['Save this menu', 'Make shopping list', 'Add to calendar'] },
  { id:'8', role:'user', attachment:{ name:'kitchen_inspo.jpg', ext:'JPEG', size:'3.1 MB' }, text:'This is the vibe I\'m going for' },
  { id:'9', role:'ai', text:"Love it — warm candlelight, minimal table setting, let the food be the centerpiece. You actually have a saved note that says exactly that: \"Less is more for dinner parties.\" Feels very on-brand for you." },
  { id:'10', role:'user', text:'Perfect. Remind me to get flowers tomorrow morning.' },
  { id:'11', role:'ai', action:'Reminder set — tomorrow 9:00 AM: Pick up flowers for dinner party ✓' },
  { id:'12', role:'ai', poll:{ question:'Anything else I can help prep before Friday?', options:['Check if I have all ingredients', 'Draft a music playlist', 'Nothing, I\'m all set'] } },
];

// ── Quiz data ──

interface QuizQ { question: string; options: string[] }
const MEMORY_QUIZ: QuizQ[] = [
  { question: 'How should I categorize this?', options: ['Fashion & Style', 'Seasonal / Event', 'Wishlist Item', 'Personal Reference'] },
  { question: 'How important is this memory to you?', options: ['Very important — highlight it', 'Good to have', 'Just browsing'] },
  { question: 'Any specific timeframe?', options: ['Planning to use soon', 'This season', 'Future reference', 'No specific plan'] },
];

// ── Trait data ──

interface Trait {
  id: string;
  content: string;
  type: string;
  scope: string;
  confidence: number;
  importance: string;
  accessCount: number;
  domain: string;
  date: string;
}

const TRAITS: Trait[] = [
  { id:'t1', content:'Doesn\'t like Eminem songs', type:'Preference', scope:'Music', confidence:0.92, importance:'Medium', accessCount:3, domain:'Entertainment', date:'Mar 15, 2026' },
  { id:'t2', content:'Loves cooking carbonara', type:'Interest', scope:'Food', confidence:0.95, importance:'High', accessCount:7, domain:'Cooking', date:'Mar 10, 2026' },
  { id:'t3', content:'Prefers minimalist fashion', type:'Preference', scope:'Fashion', confidence:0.88, importance:'Medium', accessCount:5, domain:'Style', date:'Mar 8, 2026' },
  { id:'t4', content:'Plans trip to Italy this summer', type:'Intent', scope:'Travel', confidence:0.78, importance:'High', accessCount:4, domain:'Travel', date:'Mar 5, 2026' },
  { id:'t5', content:'Enjoys sourdough baking', type:'Interest', scope:'Food', confidence:0.90, importance:'Low', accessCount:2, domain:'Cooking', date:'Feb 28, 2026' },
  { id:'t6', content:'Listens to Khruangbin while cooking', type:'Behavior', scope:'Music', confidence:0.85, importance:'Low', accessCount:1, domain:'Entertainment', date:'Feb 20, 2026' },
  { id:'t7', content:'Interested in UX design philosophy', type:'Interest', scope:'Work', confidence:0.82, importance:'Medium', accessCount:3, domain:'Design', date:'Feb 15, 2026' },
  { id:'t8', content:'Prefers white sneakers (Nike, NB)', type:'Preference', scope:'Fashion', confidence:0.91, importance:'Medium', accessCount:6, domain:'Style', date:'Feb 10, 2026' },
];

// ── Animation hook ──

function useAnimatedMount(open: boolean, exitMs = 160) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (open) {
      setMounted(true);
      // Double rAF: first rAF fires before paint (schedules second),
      // second rAF fires after browser paints the "from" (enterPos) state.
      // Without this, mount + setVisible happen in the same frame → no CSS transition.
      let id2: number;
      const id = requestAnimationFrame(() => { id2 = requestAnimationFrame(() => setVisible(true)); });
      return () => { cancelAnimationFrame(id); cancelAnimationFrame(id2); };
    } else {
      const id = requestAnimationFrame(() => setVisible(false));
      const t = setTimeout(() => setMounted(false), exitMs);
      return () => { cancelAnimationFrame(id); clearTimeout(t); };
    }
  }, [open, exitMs]);

  return { mounted, visible };
}

// ── Card Detail Overlay ──

const TYPE_LABELS: Record<string, string> = {
  link: 'Link', photo: 'Photo', text: 'Note', video: 'Video', product: 'Product', document: 'Document', gallery: 'Gallery',
};

function GallerySlider({ images, onOpenLightbox }: { images: string[]; onOpenLightbox: (idx: number, rect: DOMRect | null) => void }) {
  const [idx, setIdx] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${gray4}`, position: 'relative' }}>
      <img
        ref={imgRef}
        src={images[idx]}
        alt=""
        onClick={() => onOpenLightbox(idx, imgRef.current?.getBoundingClientRect() ?? null)}
        style={{ width: '100%', display: 'block', maxHeight: 220, objectFit: 'cover', cursor: 'zoom-in', transition: 'opacity 0.18s ease' }}
      />
      {images.length > 1 && (
        <>
          {idx > 0 && (
            <button onClick={() => setIdx(i => i - 1)} style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', width:32, height:32, borderRadius:16, border:'none', background:'rgba(0,0,0,0.35)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}
          {idx < images.length - 1 && (
            <button onClick={() => setIdx(i => i + 1)} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', width:32, height:32, borderRadius:16, border:'none', background:'rgba(0,0,0,0.35)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          )}
          <div style={{ position:'absolute', bottom:8, left:0, right:0, display:'flex', justifyContent:'center', gap:5 }}>
            {images.map((_, i) => (
              <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 14 : 6, height:6, borderRadius:3, background: i === idx ? 'white' : 'rgba(255,255,255,0.5)', transition:'width 0.25s ease, background 0.2s ease', cursor:'pointer' }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CardDetailPage({ card, onBack, onOpenLightbox, onAskAbout }: { card: Card; onBack: () => void; onOpenLightbox?: (images: string[], idx: number, rect: DOMRect | null) => void; onAskAbout?: (card: Card) => void }) {
  const [tldr, setTldr] = useState(card.aiAnalysis || '');
  const [labels, setLabels] = useState<string[]>(card.labels || []);
  const [notes, setNotes] = useState('');
  const [addingLabel, setAddingLabel] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const labelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTldr(card.aiAnalysis || '');
    setLabels(card.labels || []);
    setNotes('');
    setAddingLabel(false);
    setNewLabel('');
  }, [card.id]);

  useEffect(() => {
    if (addingLabel) labelInputRef.current?.focus();
  }, [addingLabel]);

  function commitLabel() {
    const t = newLabel.trim();
    if (t && !labels.includes(t)) setLabels(ls => [...ls, t]);
    setNewLabel('');
    setAddingLabel(false);
  }

  const isQuote = card.type === 'text' && card.title.startsWith('"');
  const isClipboardName = (s?: string) => !s || /clipboard|image\.(png|jpg)/i.test(s);
  const showSource = card.source && !isClipboardName(card.source);

  const sectionLabel: CSSProperties = {
    fontSize: 10, fontWeight: 600, fontFamily: sans, color: gray2,
    letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 8, display: 'block',
  };
  const textareaBase: CSSProperties = {
    width: '100%', resize: 'none' as const, border: `1px solid ${gray4}`, borderRadius: 8,
    padding: '10px 12px', fontSize: 13, lineHeight: '1.65', fontFamily: sans,
    color: black, background: white, outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{
      height: '100vh', width: '100%',
      background: white,
      display: 'flex', flexDirection: 'column',
      fontFamily: sans, color: black,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: `1px solid ${gray4}`, flexShrink: 0,
      }}>
        <span style={{ flex: 1, fontSize: 11, fontWeight: 600, fontFamily: sans, color: gray2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {TYPE_LABELS[card.type]}{showSource ? ` · ${card.source}` : ''}{card.time ? ` · ${card.time}` : ''}
        </span>
        <Btn size="sm" icon={<Share2 size={11} />}>Share</Btn>
        <Btn size="sm" color="#FF3B30" icon={<Trash2 size={11} />}>Delete</Btn>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, border: `1px solid ${gray4}`, background: 'transparent', cursor: 'pointer', borderRadius: 8, color: gray1, transition: 'background 0.15s, color 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = bg; (e.currentTarget as HTMLElement).style.color = black; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = gray1; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Scrollable body — centered column */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 20px 48px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Preview */}
        {card.type === 'gallery' && card.images?.length ? (
          <GallerySlider images={card.images} onOpenLightbox={(idx, rect) => onOpenLightbox?.(card.images!, idx, rect)} />
        ) : card.image ? (
          <div
            onClick={e => onOpenLightbox?.([card.image!], 0, (e.currentTarget as HTMLElement).getBoundingClientRect())}
            style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${gray4}`, cursor: 'zoom-in' }}
          >
            <img src={card.image} alt="" style={{ width: '100%', display: 'block', maxHeight: 220, objectFit: 'cover' }} />
          </div>
        ) : card.type === 'document' ? (
          <div style={{ background: bg, borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, background: white, border: `1px solid ${gray4}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gray1} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, fontFamily: sans, color: black, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.title}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, fontFamily: sans, color: gray1 }}>
                {card.title.split('.').pop()?.toUpperCase()}{card.source ? ` · ${card.source}` : ''}
              </p>
            </div>
          </div>
        ) : card.title ? (
          <div style={{ background: bg, borderRadius: 10, padding: '16px 18px' }}>
            <p style={{ fontSize: isQuote ? 15 : 13, lineHeight: 1.7, fontFamily: isQuote ? serif : sans, fontStyle: isQuote ? 'italic' : 'normal', color: black, margin: 0 }}>
              {card.title}
            </p>
            {card.price && <p style={{ fontSize: 15, fontWeight: 700, fontFamily: sans, color: black, margin: '10px 0 0' }}>{card.price}</p>}
          </div>
        ) : null}

        {/* TLDR */}
        <div>
          <span style={sectionLabel}>TLDR</span>
          <textarea
            value={tldr}
            onChange={e => setTldr(e.target.value)}
            placeholder="Add a summary..."
            rows={3}
            style={{ ...textareaBase, minHeight: 72 }}
          />
        </div>

        {/* Labels */}
        <div>
          <span style={sectionLabel}>Labels</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {labels.map(l => (
              <LabelChip key={l} label={l} onRemove={() => setLabels(ls => ls.filter(x => x !== l))} />
            ))}
            {addingLabel ? (
              <input
                ref={labelInputRef}
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commitLabel(); if (e.key === 'Escape') { setAddingLabel(false); setNewLabel(''); } }}
                onBlur={commitLabel}
                placeholder="Label name"
                style={{ fontSize: 12, fontWeight: 500, fontFamily: sans, padding: '5px 12px', borderRadius: 20, border: `1px solid ${accent}`, outline: 'none', color: black, width: 120 }}
              />
            ) : (
              <button
                onClick={() => setAddingLabel(true)}
                style={{ fontSize: 12, fontWeight: 600, fontFamily: sans, padding: '5px 12px', borderRadius: 20, border: 'none', background: accent, cursor: 'pointer', color: white, transition: 'all 0.15s' }}
              >
                + Add label
              </button>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <span style={sectionLabel}>Notes</span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Your thoughts..."
            rows={3}
            style={{ ...textareaBase, minHeight: 80 }}
          />
        </div>

        {/* Ask about this */}
        {onAskAbout && (
          <button
            onClick={() => onAskAbout(card)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '12px 16px', borderRadius: 10,
              border: `1px solid ${accent}`, background: `rgba(0,113,227,0.05)`,
              cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: sans, color: accent,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `rgba(0,113,227,0.12)`)}
            onMouseLeave={e => (e.currentTarget.style.background = `rgba(0,113,227,0.05)`)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
            Ask about this
          </button>
        )}

      </div>
      </div>
    </div>
  );
}

// ── Unified button kit ──

function Btn({ children, color, filled, active, size = 'md', onClick, icon }: {
  children: ReactNode; color?: string; filled?: boolean; active?: boolean; size?: 'sm' | 'md' | 'lg'; onClick?: () => void; icon?: ReactNode;
}) {
  const [h, setH] = useState(false);
  const on = filled || active;
  const textColor = on ? white : (color || black);
  const bgColor = on ? (h ? '#004FA3' : '#005BBE') : (h ? gray5 : 'transparent');
  const border = on ? 'none' : `1.5px solid ${h ? gray3 : gray4}`;
  const pad = size === 'sm' ? '5px 12px' : size === 'lg' ? '10px 20px' : '7px 14px';
  const fs = size === 'sm' ? 11 : size === 'lg' ? 13 : 12;
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ fontSize: fs, fontWeight: 600, fontFamily: sans, padding: pad, borderRadius: 9999, border, background: bgColor, color: textColor, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' as const, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {icon}
      {children}
    </button>
  );
}

function IconBtn({ children, size = 32, style: extraStyle, onClick }: {
  children: ReactNode; size?: number; style?: CSSProperties; onClick?: () => void;
}) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: size, height: size, borderRadius: 9999, border: 'none', background: h ? gray4 : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0, ...extraStyle }}>
      {children}
    </button>
  );
}

// ── Card component ──

function MemoryCard({ card, onOpen, isSelected }: {
  card: Card;
  onOpen: () => void;
  isSelected?: boolean;
}) {
  const [h, setH] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasImg = !!card.image || card.type === 'gallery';
  const isQuote = card.type === 'text' && card.title.startsWith('"');

  const [currIdx, setCurrIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const currIdxRef = useRef(0);
  const currImgRef = useRef<HTMLImageElement>(null);
  const nextImgRef = useRef<HTMLImageElement>(null);

  // Interval — fires every 8s with per-card stagger
  useEffect(() => {
    if (card.type !== 'gallery' || !card.images?.length) return;
    let intervalId: ReturnType<typeof setInterval>;
    const offset = (parseInt(card.id) || 0) * 1700 % 5000;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        const prev = currIdxRef.current;
        const next = (prev + 1) % card.images!.length;
        currIdxRef.current = next;
        setNextIdx(next);
      }, 8000);
    }, offset);
    return () => { clearTimeout(timeoutId); clearInterval(intervalId); };
  }, [card.type, card.images, card.id]);

  // Animation — runs after React mounts the nextImg into the DOM
  useEffect(() => {
    if (nextIdx === null || !currImgRef.current || !nextImgRef.current) return;
    const curr = currImgRef.current;
    const next = nextImgRef.current;
    const captured = nextIdx;

    // Set initial positions without transition
    curr.style.transition = 'none';
    next.style.transition = 'none';
    curr.style.transform = 'translateX(0)';
    next.style.transform = 'translateX(100%)';

    // Force reflow so browser registers initial positions
    void next.offsetWidth;

    // Animate both simultaneously
    const ease = 'transform 0.52s cubic-bezier(0.4, 0, 0.2, 1)';
    curr.style.transition = ease;
    next.style.transition = ease;
    curr.style.transform = 'translateX(-100%)';
    next.style.transform = 'translateX(0)';

    const timer = setTimeout(() => {
      // Snap curr back (hidden behind next) before src switches
      curr.style.transition = 'none';
      curr.style.transform = 'translateX(0)';
      setCurrIdx(captured);
      setNextIdx(null);
    }, 540);

    return () => clearTimeout(timer);
  }, [nextIdx]);

  return (
    <div
      ref={ref}
      onClick={onOpen}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: white,
        borderRadius: 10,
        border: `1.5px solid ${isSelected ? accent : (h ? gray3 : gray4)}`,
        boxShadow: isSelected ? `0 0 0 3px rgba(0,113,227,0.12)` : 'none',
        overflow: 'hidden',
        marginBottom: 10,
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.3s ease',
        transform: h ? 'translateY(-1px)' : 'none',
      }}
    >
      {hasImg && (
        <div style={{ position: 'relative', overflow: 'hidden', height: card.type === 'gallery' ? 120 : undefined }}>
          {card.type === 'gallery' ? (
            // Wrapper owns hover scale; imgs own translateX via refs (React never touches their transform)
            <div style={{
              position: 'absolute', inset: 0, overflow: 'hidden',
              transform: h ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.6s ease',
            }}>
              <img
                ref={currImgRef}
                src={card.images?.[currIdx] || ''} alt={card.title} draggable={false}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
              {nextIdx !== null && (
                <img
                  ref={nextImgRef}
                  src={card.images?.[nextIdx] || ''} alt="" draggable={false}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
                />
              )}
            </div>
          ) : (
            <img
              src={card.image} alt={card.title} draggable={false}
              style={{
                width: '100%', display: 'block', objectFit: 'cover',
                height: card.type === 'photo' ? 120 : card.type === 'video' ? 110 : 100,
                transition: 'transform 0.6s ease',
                transform: h ? 'scale(1.03)' : 'scale(1)',
              }}
            />
          )}
          {card.type === 'video' && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.15)' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.92)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill={black}><polygon points="6 3 20 12 6 21 6 3"/></svg>
              </div>
            </div>
          )}
          {card.type === 'gallery' && card.images && card.images.length > 1 && (
            <div style={{ position:'absolute', bottom:6, left:0, right:0, display:'flex', justifyContent:'center', gap:4 }}>
              {card.images.map((_, i) => (
                <div key={i} style={{ width: i === currIdx ? 12 : 5, height:5, borderRadius:3, background: i === currIdx ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)', transition:'width 0.3s ease, background 0.3s ease' }} />
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: hasImg ? '8px 10px 10px' : '14px 12px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: hasImg ? 4 : 6 }}>
          <span style={{ fontSize:9, fontWeight:600, fontFamily:sans, color:gray1, letterSpacing:'0.04em', textTransform:'uppercase' }}>
            {card.type === 'text' ? 'Note' : card.type.charAt(0).toUpperCase() + card.type.slice(1)}
          </span>
          <span style={{ fontSize:9, fontFamily:sans, color:gray2 }}>{card.time}</span>
        </div>

        <p style={{
          margin: 0,
          fontSize: isQuote ? 12 : 11,
          lineHeight: isQuote ? 1.5 : 1.45,
          fontFamily: isQuote ? serif : sans,
          fontStyle: isQuote ? 'italic' : 'normal',
          fontWeight: isQuote ? 400 : 600,
          color: black,
          letterSpacing: isQuote ? '0' : '-0.01em',
          display: '-webkit-box',
          WebkitLineClamp: hasImg ? 2 : 4,
          WebkitBoxOrient: 'vertical' as CSSProperties['WebkitBoxOrient'],
          overflow: 'hidden',
        }}>
          {card.title}
        </p>

        {card.desc && !hasImg && (
          <p style={{ margin:'4px 0 0', fontSize:10, lineHeight:1.5, fontFamily:sans, color:gray1, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' as CSSProperties['WebkitBoxOrient'], overflow:'hidden' }}>
            {card.desc}
          </p>
        )}

        {(card.source || card.author || card.price) && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:6 }}>
            <span style={{ fontSize:9, fontFamily:sans, color:gray2, fontWeight:500 }}>
              {card.source || (card.author && `from ${card.author}`) || ''}
            </span>
            {card.price && (
              <span style={{ fontSize:11, fontWeight:600, fontFamily:sans, color:black }}>{card.price}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Chat bubble ──

function PollOption({ label, selected, answered }: { label: string; selected: boolean; answered: boolean }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        padding: '9px 14px', borderRadius: 9999, cursor: answered ? 'default' : 'pointer',
        border: `1.5px solid ${selected ? `rgba(0,113,227,0.35)` : h && !answered ? gray3 : gray4}`,
        background: selected ? `rgba(0,113,227,0.07)` : h && !answered ? bg : white,
        color: selected ? accent : black,
        fontSize: 13, fontFamily: sans, fontWeight: 500, lineHeight: 1.4,
        transition: 'all 0.15s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      }}
    >
      {label}
      {selected && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      )}
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const u = msg.role === 'user';

  if (msg.action) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', marginBottom:20 }}>
        <span style={{ fontSize:10, fontWeight:600, fontFamily:sans, color:gray2, marginBottom:5, letterSpacing:'0.02em' }}>dEssence</span>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`rgba(0,113,227,0.07)`, border:`1px solid rgba(0,113,227,0.2)`, borderRadius:9999, padding:'10px 16px', fontSize:13, fontFamily:sans, fontWeight:500, color:accent }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {msg.action}
        </div>
      </div>
    );
  }

  const answered = msg.poll?.selected !== undefined;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems: u ? 'flex-end' : 'flex-start', marginBottom:20 }}>
      <span style={{ fontSize:10, fontWeight:600, fontFamily:sans, color:gray2, marginBottom:5, letterSpacing:'0.02em' }}>
        {u ? 'You' : 'dEssence'}
      </span>
      {u ? (
        <div style={{ maxWidth:'86%', background:bg, borderRadius:'12px 12px 4px 12px', overflow:'hidden' }}>
          {msg.attachment && (
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px' }}>
              <div style={{ width:36, height:36, borderRadius:8, background:white, border:`1px solid ${gray4}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={gray1} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <p style={{ margin:0, fontSize:12, fontWeight:600, fontFamily:sans, color:black }}>{msg.attachment.name}</p>
                <p style={{ margin:0, fontSize:11, fontFamily:sans, color:gray1 }}>{msg.attachment.ext} · {msg.attachment.size}</p>
              </div>
            </div>
          )}
          {msg.image && <img src={msg.image} alt="" style={{ width:'100%', display:'block', maxHeight:180, objectFit:'cover' }} />}
          {msg.text && <div style={{ padding:'11px 16px', fontSize:13, fontFamily:sans, fontWeight:400, color:black, lineHeight:1.7 }}>{msg.text}</div>}
        </div>
      ) : (
        <div style={{ maxWidth:'92%', fontSize:13, lineHeight:1.75, fontFamily:serif, fontWeight:400, color:black }}>
          {msg.text && <p style={{ margin:0, whiteSpace:'pre-wrap' as const }}>{msg.text}</p>}
          {msg.items && (
            <div style={{ marginTop: msg.text ? 10 : 0, display:'flex', flexDirection:'column', gap:4 }}>
              {msg.items.map((item, i) => (
                <div key={i} style={{ display:'flex', gap:10 }}>
                  <span style={{ color:gray3, flexShrink:0, fontFamily:sans, marginTop:1 }}>—</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
          {msg.related && (
            <div style={{ marginTop: msg.text ? 12 : 0, display:'flex', flexDirection:'column', gap:8 }}>
              {msg.related.map(r => (
                <div key={r.id} style={{ border:`1px solid ${gray4}`, borderRadius:10, padding:'10px 14px', background:white }}>
                  <span style={{ fontSize:9, fontWeight:600, fontFamily:sans, color:gray1, textTransform:'uppercase' as const, letterSpacing:'0.05em' }}>
                    {TYPE_LABELS[r.type] || r.type} · {r.time}
                  </span>
                  <p style={{ margin:'4px 0 0', fontSize:12, fontFamily:sans, fontWeight:500, color:black, lineHeight:1.5 }}>{r.title}</p>
                </div>
              ))}
            </div>
          )}
          {msg.poll && (
            <div style={{ marginTop: msg.text ? 14 : 0, display:'flex', flexDirection:'column', gap:8 }}>
              <p style={{ margin:'0 0 4px', fontSize:13, fontFamily:sans, fontWeight:600, color:black }}>{msg.poll.question}</p>
              {msg.poll.options.map((opt, i) => (
                <PollOption key={i} label={opt} selected={msg.poll!.selected === i} answered={answered} />
              ))}
            </div>
          )}
          {msg.buttons && (
            <div style={{ marginTop:14, display:'flex', gap:8, flexWrap:'wrap' as const }}>
              {msg.buttons.map((btn, i) => (
                <Btn key={i}>{btn}</Btn>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}



// ── Menu button ──

function MenuButton({ label, icon, onClick }: { label: string; icon: ReactNode; onClick: () => void }) {
  const [h, setH] = useState(false);
  const isLogout = label === 'Log Out';
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 12px',
        border:'none', borderRadius:9999, background: h ? bg : 'transparent',
        cursor:'pointer', fontSize:13, fontFamily:sans,
        color: isLogout ? '{accent}' : black,
        fontWeight:500, textAlign:'left', transition:'background 0.15s',
      }}
    >
      <span style={{ color: isLogout ? '{accent}' : gray1, display:'flex' }}>{icon}</span>
      {label}
    </button>
  );
}

// ── Search field ──

function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      flex: '1 1 240px', maxWidth: 280, display: 'flex', alignItems: 'center', gap: 8,
      border: `1px solid ${focused ? accent : gray4}`,
      borderRadius: 8, padding: '8px 12px',
      transition: 'border-color 0.2s',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={focused ? accent : gray2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s', flexShrink: 0 }}>
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder="Search traits..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, fontFamily: sans, color: black, background: 'transparent' }}
      />
    </div>
  );
}

// ── Profile Traits View ──

function ProfileTraitsView({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Traits');
  const [viewMode, setViewMode] = useState<'table'|'cards'>('table');
  const [filterOpen, setFilterOpen] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const filterAnim = useAnimatedMount(filterOpen, 150);

  const filters = ['All Traits', 'Preference', 'Interest', 'Intent', 'Behavior'];

  const filtered = TRAITS.filter(t => {
    const matchSearch = !search || t.content.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All Traits' || t.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:white }}>
      <div style={{ padding:'24px 32px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <button
            onClick={onBack}
            onMouseEnter={() => setBackHover(true)} onMouseLeave={() => setBackHover(false)}
            style={{
              width:32, height:32, borderRadius:9999, border:'none',
              background: backHover ? gray4 : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', transition:'background 0.15s', flexShrink:0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={black} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          </button>
          <span style={{ fontSize:20, fontWeight:600, fontFamily:sans, color:black }}>Profile Traits</span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          {/* Search */}
          <SearchField value={search} onChange={setSearch} />

          {/* Filter dropdown */}
          <div style={{ position:'relative' }}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{
                display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:8,
                border:`1px solid ${gray4}`, background:white, cursor:'pointer',
                fontSize:13, fontFamily:sans, color:black, fontWeight:500,
              }}
            >
              {filter}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={gray2} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            {filterAnim.mounted && (
              <>
                <div style={{ position:'fixed', inset:0, zIndex:9 }} onClick={() => setFilterOpen(false)} />
                <div style={{
                  position:'absolute', top:'calc(100% + 4px)', left:0, zIndex:10,
                  background:white, border:`1px solid ${gray4}`, borderRadius:10, padding:4,
                  minWidth:160, boxShadow:'0 4px 20px rgba(0,0,0,0.08)',
                  opacity: filterAnim.visible ? 1 : 0,
                  transform: filterAnim.visible ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.97)',
                  transition:'opacity 0.15s ease, transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}>
                  {filters.map(f => (
                    <button key={f} onClick={() => { setFilter(f); setFilterOpen(false); }} style={{
                      display:'block', width:'100%', textAlign:'left', padding:'8px 12px', borderRadius:7,
                      border:'none', background: filter === f ? bg : 'transparent',
                      fontSize:13, fontFamily:sans, color: filter === f ? black : gray1,
                      fontWeight: filter === f ? 600 : 400, cursor:'pointer',
                    }}>
                      {f}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ flex:1 }} />

          {/* View toggle */}
          <div style={{ display:'flex', border:`1px solid ${gray4}`, borderRadius:8, overflow:'hidden' }}>
            {(['table','cards'] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                padding:'7px 14px', border:'none', cursor:'pointer',
                background: viewMode === mode ? black : white,
                color: viewMode === mode ? white : gray1,
                fontSize:12, fontWeight:600, fontFamily:sans,
                display:'flex', alignItems:'center', gap:5,
                transition:'all 0.15s',
              }}>
                {mode === 'table' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>
                )}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 32px 32px' }}>
        {viewMode === 'table' ? (
          <div style={{ border:`1px solid ${gray4}`, borderRadius:10, overflow:'hidden' }}>
            <div style={{
              display:'grid', gridTemplateColumns:'2.5fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 60px',
              background:bg, borderBottom:`1px solid ${gray4}`, padding:'10px 16px',
            }}>
              {['Content','Type','Scope','Confidence','Importance','Access Count','Domain','Date','Actions'].map(h => (
                <span key={h} style={{ fontSize:11, fontWeight:600, fontFamily:sans, color:gray1 }}>{h}</span>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div style={{ padding:48, textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>&#128450;</div>
                <div style={{ fontSize:13, fontFamily:sans, color:gray2 }}>No data</div>
              </div>
            ) : filtered.map((t, i) => (
              <div key={t.id} style={{
                display:'grid', gridTemplateColumns:'2.5fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 60px',
                padding:'12px 16px', alignItems:'center',
                borderBottom: i < filtered.length - 1 ? `1px solid ${gray4}` : 'none',
                background: i % 2 === 0 ? white : `${bg}80`,
              }}>
                <span style={{ fontSize:12, fontFamily:sans, color:black, fontWeight:500 }}>{t.content}</span>
                <span style={{ fontSize:11, fontFamily:sans, color:gray1 }}>{t.type}</span>
                <span style={{ fontSize:11, fontFamily:sans, color:gray1 }}>{t.scope}</span>
                <span style={{ fontSize:11, fontFamily:sans, color:gray1 }}>{Math.round(t.confidence * 100)}%</span>
                <span style={{
                  fontSize:10, fontFamily:sans, fontWeight:600,
                  color: t.importance === 'High' ? accent : t.importance === 'Medium' ? black : gray1,
                }}>{t.importance}</span>
                <span style={{ fontSize:11, fontFamily:sans, color:gray1 }}>{t.accessCount}</span>
                <span style={{ fontSize:11, fontFamily:sans, color:gray1 }}>{t.domain}</span>
                <span style={{ fontSize:11, fontFamily:sans, color:gray2 }}>{t.date}</span>
                <div style={{ display:'flex', gap:4 }}>
                  <button style={{ width:24, height:24, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={gray2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button style={{ width:24, height:24, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={gray2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:12 }}>
            {filtered.map(t => (
              <div key={t.id} style={{ background:white, border:`1px solid ${gray4}`, borderRadius:10, padding:18 }}>
                <p style={{ fontSize:13, fontWeight:600, fontFamily:sans, color:black, margin:'0 0 8px' }}>{t.content}</p>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                  <span style={{ fontSize:10, fontFamily:sans, padding:'3px 8px', borderRadius:4, background:bg, color:gray1, fontWeight:500 }}>{t.type}</span>
                  <span style={{ fontSize:10, fontFamily:sans, padding:'3px 8px', borderRadius:4, background:bg, color:gray1, fontWeight:500 }}>{t.scope}</span>
                  <span style={{ fontSize:10, fontFamily:sans, padding:'3px 8px', borderRadius:4, background:bg, color:gray1, fontWeight:500 }}>{t.domain}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, fontFamily:sans, color:gray2 }}>
                  <span>Confidence: {Math.round(t.confidence * 100)}%</span>
                  <span>{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Settings Modal ──

function SettingsModal({ open, onClose, showSimilarity, onToggle }: { open: boolean; onClose: () => void; showSimilarity: boolean; onToggle: () => void }) {
  const { mounted, visible } = useAnimatedMount(open, 200);
  if (!mounted) return null;
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center',
      background: visible ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0)',
      transition:'background 0.2s ease',
    }} onClick={onClose}>
      <div style={{
        background:white, borderRadius:14, padding:28, width:480, maxWidth:'90%',
        boxShadow:'0 8px 40px rgba(0,0,0,0.12)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(6px)',
        transition:'opacity 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <span style={{ fontSize:18, fontWeight:600, fontFamily:sans, color:black }}>Settings</span>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:9999, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={gray1} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, padding:'16px 0', borderTop:`1px solid ${gray4}` }}>
          <div>
            <div style={{ fontSize:14, fontWeight:600, fontFamily:sans, color:black, marginBottom:4 }}>Show Similarity Scores</div>
            <div style={{ fontSize:12, fontFamily:sans, color:gray1, lineHeight:1.5 }}>Display similarity percentages on pinboard items when viewing context for chat topic</div>
          </div>
          <button onClick={onToggle} style={{
            width:44, height:24, borderRadius:12, border:'none', padding:2,
            background: showSimilarity ? accent : gray3,
            cursor:'pointer', transition:'background 0.2s', flexShrink:0,
          }}>
            <div style={{
              width:20, height:20, borderRadius:10, background:white,
              transition:'transform 0.2s',
              transform: showSimilarity ? 'translateX(20px)' : 'translateX(0)',
              boxShadow:'0 1px 3px rgba(0,0,0,0.15)',
            }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Quiz components ──


function ChatQuiz({ step, answers, done, onAnswer, onBack }: { step: number; answers: string[]; done: boolean; onAnswer: (o: string) => void; onBack: () => void }) {
  const q = MEMORY_QUIZ[step];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 20 }}>
      <span style={{ fontSize: 10, fontWeight: 600, fontFamily: sans, color: gray2, marginBottom: 5, letterSpacing: '0.02em' }}>dEssence</span>
      <div style={{ width: '100%' }}>

        {/* Answered questions — gray summary */}
        {answers.length > 0 && (
          <div style={{
            background: bg, borderRadius: 10, border: `1px solid ${gray4}`,
            padding: '10px 14px', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {answers.map((ans, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, fontFamily: sans, color: gray2, flex: 1, lineHeight: 1.4 }}>
                  {MEMORY_QUIZ[i].question}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 600, fontFamily: sans, color: gray1,
                  background: white, border: `1px solid ${gray4}`,
                  padding: '3px 10px', borderRadius: 6, whiteSpace: 'nowrap',
                }}>
                  {ans}
                </span>
              </div>
            ))}
          </div>
        )}

        {done ? (
          /* Completed — thank you */
          <p style={{ fontSize: 13, lineHeight: 1.7, fontFamily: serif, color: black, margin: 0 }}>
            Thanks for clarifying! I'll save this with your preferences in mind.
          </p>
        ) : (
          /* Active question */
          <>
            <p style={{ fontSize: 13, lineHeight: 1.7, fontFamily: serif, color: black, margin: '0 0 14px' }}>{q.question}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {q.options.map(o => <Btn key={o} size="lg" filled onClick={() => onAnswer(o)}>{o}</Btn>)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
              <span style={{ fontSize: 10, fontFamily: sans, color: gray2 }}>
                Question {step + 1} of {MEMORY_QUIZ.length}
              </span>
              {answers.length > 0 && (
                <button onClick={onBack}
                  onMouseEnter={e => (e.currentTarget.style.color = black)}
                  onMouseLeave={e => (e.currentTarget.style.color = gray1)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 11, fontWeight: 500, fontFamily: sans, color: gray1,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.15s',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
                  </svg>
                  Back
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Lightbox ──

function Lightbox({ images, index, sourceRect, visible, onClose, onPrev, onNext }: {
  images: string[];
  index: number;
  sourceRect: DOMRect | null;
  visible: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const hasOpenedRef = useRef(false);
  useEffect(() => { if (visible) hasOpenedRef.current = true; }, [visible]);

  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const pad = 48;
  const openPos = { top: pad, left: pad, width: vw - pad * 2, height: vh - pad * 2, borderRadius: 0, opacity: 1 };
  const enterPos = sourceRect
    ? { top: sourceRect.top, left: sourceRect.left, width: sourceRect.width, height: sourceRect.height, borderRadius: 10, opacity: 0 }
    : openPos;
  const exitPos = sourceRect
    ? { top: sourceRect.top, left: sourceRect.left, width: sourceRect.width, height: sourceRect.height, borderRadius: 10, opacity: 0 }
    : { ...openPos, opacity: 0 };

  const EASE_OPEN = 'cubic-bezier(0.2, 0, 0, 1)';
  const EASE_CLOSE = 'cubic-bezier(0.4, 0, 0.8, 0.6)';
  const dur = visible ? '0.28s' : '0.22s';
  const ease = visible ? EASE_OPEN : EASE_CLOSE;
  const opT = visible ? 'opacity 0.22s ease' : 'opacity 0.1s ease 0.18s';
  const TRANSITION = `top ${dur} ${ease}, left ${dur} ${ease}, width ${dur} ${ease}, height ${dur} ${ease}, border-radius ${dur} ${ease}, ${opT}`;

  const pos = visible ? openPos : (hasOpenedRef.current ? exitPos : enterPos);

  // keyboard navigation
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, onPrev, onNext]);

  const hasMultiple = images.length > 1;

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 98,
        background: visible ? 'rgba(0,0,0,0.92)' : 'rgba(0,0,0,0)',
        transition: visible ? 'background 0.24s ease' : 'background 0.26s ease',
        cursor: 'zoom-out',
      }} onClick={onClose} />

      {/* Image */}
      <img
        src={images[index] || ''}
        alt=""
        style={{
          position: 'fixed',
          top: pos.top, left: pos.left, width: pos.width, height: pos.height,
          opacity: pos.opacity,
          borderRadius: pos.borderRadius,
          objectFit: 'contain',
          zIndex: 99,
          pointerEvents: 'none',
          transition: TRANSITION,
        }}
      />

      {/* Nav arrows */}
      {hasMultiple && visible && (
        <>
          {/* Prev */}
          {index > 0 && (
            <button onClick={(e) => { e.stopPropagation(); onPrev?.(); }} style={{
              position:'fixed', left: 20, top:'50%', transform:'translateY(-50%)',
              zIndex:100, width:44, height:44, borderRadius:22, border:'none',
              background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)',
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white',
              transition:'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}
          {/* Next */}
          {index < images.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); onNext?.(); }} style={{
              position:'fixed', right: 20, top:'50%', transform:'translateY(-50%)',
              zIndex:100, width:44, height:44, borderRadius:22, border:'none',
              background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)',
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white',
              transition:'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          )}
          {/* Counter */}
          <div style={{
            position:'fixed', bottom: 28, left:'50%', transform:'translateX(-50%)',
            zIndex:100, fontSize:12, fontFamily:'"IBM Plex Sans", sans-serif', fontWeight:500,
            color:'rgba(255,255,255,0.6)', pointerEvents:'none',
          }}>
            {index + 1} / {images.length}
          </div>
        </>
      )}

      {/* Close button */}
      {visible && (
        <button onClick={onClose} style={{
          position:'fixed', top:20, right:20, zIndex:100,
          width:36, height:36, borderRadius:18, border:'none',
          background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white',
          transition:'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
        </button>
      )}
    </>
  );
}

// ── App ──

// panel animation phase: 'visible' | 'hiding' | 'showing'
type Phase = 'visible' | 'hiding' | 'showing';

const PINNED_TAGS = ['work', 'travel', 'recipe', 'design', 'food', 'restaurant', 'fashion'];
const ALL_TAGS = Array.from(new Set(CARDS.flatMap(c => c.labels ?? []))).sort();

function App() {
  const [input, setInput] = useState('');
  const [cycles, setCycles] = useState(3);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tagSearch, setTagSearch] = useState('');
  const [tagSearchOpen, setTagSearchOpen] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [phase, setPhase] = useState<Phase>('visible');
  const [currentView, setCurrentView] = useState<'pinboard'|'traits'|'card'>('pinboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showSimilarity, setShowSimilarity] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const menuAnim = useAnimatedMount(menuOpen, 150);
  const [chatContextCard, setChatContextCard] = useState<Card | null>(null);
  const sidebarAnim = useAnimatedMount(selectedCard !== null, 260);
  const [chatWidth, setChatWidth] = useState(570);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startW: 0 });
  const [quizActive, setQuizActive] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [chatFocused, setChatFocused] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [displayMsgs, setDisplayMsgs] = useState<Msg[]>([]);

  const [, setLbImages] = useState<string[]>([]);
  const [, setLbIndex] = useState(0);
  const [, setLbSourceRect] = useState<DOMRect | null>(null);
  const [lbOpen, setLbOpen] = useState(false);
  const lbAnim = useAnimatedMount(lbOpen, 320);
  // persist during close animation
  const [lbDisplayImages, setLbDisplayImages] = useState<string[]>([]);
  const [lbDisplayRect, setLbDisplayRect] = useState<DOMRect | null>(null);
  const [lbDisplayIndex, setLbDisplayIndex] = useState(0);

  function openLightbox(images: string[], idx: number, rect: DOMRect | null) {
    setLbImages(images); setLbDisplayImages(images);
    setLbIndex(idx); setLbDisplayIndex(idx);
    setLbSourceRect(rect); setLbDisplayRect(rect);
    setLbOpen(true);
  }
  function closeLightbox() { setLbOpen(false); }
  useEffect(() => { if (!lbOpen && !lbAnim.mounted) { setLbDisplayImages([]); } }, [lbOpen, lbAnim.mounted]);

  const [isDragging, setIsDragging] = useState(false);
  const ddCounter = useRef(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [voiceBars, setVoiceBars] = useState<number[]>(Array(18).fill(4));
  const voiceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voiceAutoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 600) {
        setCycles((c) => c + 2);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const newW = dragRef.current.startW - (e.clientX - dragRef.current.startX);
      const maxW = Math.floor(window.innerWidth * 0.5);
      setChatWidth(Math.max(340, Math.min(maxW, newW)));
    };
    const onUp = () => setDragging(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragging]);

  useEffect(() => {
    const onDragEnter = (e: DragEvent) => { e.preventDefault(); ddCounter.current++; if (ddCounter.current === 1) setIsDragging(true); };
    const onDragLeave = () => { ddCounter.current--; if (ddCounter.current === 0) setIsDragging(false); };
    const onDragOver = (e: DragEvent) => e.preventDefault();
    const onDrop = (e: DragEvent) => {
      e.preventDefault(); ddCounter.current = 0; setIsDragging(false);
      const userMsg: Msg = { id: `drop-${Date.now()}`, role: 'user', text: '📎 I dropped a file to save' };
      setChatStarted(true);
      setDisplayMsgs([userMsg]);
      setQuizActive(false);
      MSGS.forEach((msg, i) => {
        setTimeout(() => {
          setDisplayMsgs(prev => [...prev, { ...msg, id: `h${msg.id}` }]);
          if (i === MSGS.length - 1) {
            setTimeout(() => {
              setQuizActive(true); setQuizStep(0); setQuizAnswers([]); setQuizDone(false);
              setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
            }, 400);
          }
        }, 300 + i * 140);
      });
    };
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  function startChat(userText: string) {
    setChatStarted(true);
    const userMsg: Msg = { id: `u${Date.now()}`, role: 'user', text: userText };
    setDisplayMsgs([userMsg]);
    setQuizActive(false);
    // Load history first, then show quiz
    MSGS.forEach((msg, i) => {
      setTimeout(() => {
        setDisplayMsgs(prev => [...prev, { ...msg, id: `h${msg.id}` }]);
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (i === MSGS.length - 1) {
          setTimeout(() => {
            setQuizActive(true);
            setQuizStep(0);
            setQuizAnswers([]);
            setQuizDone(false);
            setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
          }, 400);
        }
      }, 300 + i * 140);
    });
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    startChat(text);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setChatStarted(true);
      const userMsg: Msg = { id: `u${Date.now()}`, role: 'user', image: dataUrl, text: 'Save this photo' };
      setDisplayMsgs(prev => [...prev, userMsg]);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const aiMsg: Msg = { id: `ai${Date.now()}`, role: 'ai', text: "Got it — saved to your memory. I'll associate this with your recent saves. Looks like it could be travel or food related. Want me to add a label?" };
        setDisplayMsgs(prev => [...prev, aiMsg]);
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 900);
    };
    reader.readAsDataURL(file);
  }

  function startRecording() {
    setIsRecording(true);
    let t = 0;
    voiceIntervalRef.current = setInterval(() => {
      t += 0.08;
      setVoiceBars(Array.from({ length: 18 }, (_, i) => {
        const wave = Math.sin(t * 4 + i * 0.6) * 0.5 + 0.5;
        return 3 + wave * 18 + Math.random() * 8;
      }));
    }, 80);
    voiceAutoStopRef.current = setTimeout(stopRecording, 3000);
  }

  function stopRecording() {
    if (voiceAutoStopRef.current) clearTimeout(voiceAutoStopRef.current);
    setIsRecording(false);
    setIsProcessingVoice(true);
    if (voiceIntervalRef.current) clearInterval(voiceIntervalRef.current);
    setVoiceBars(Array(18).fill(4));
    setTimeout(() => {
      setIsProcessingVoice(false);
      setInput("What restaurants did I save from my Milan trip?");
      setTimeout(() => chatInputRef.current?.focus(), 50);
    }, 1500);
  }

  function answerQuiz(option: string) {
    const newAnswers = [...quizAnswers, option];
    setQuizAnswers(newAnswers);
    if (newAnswers.length < MEMORY_QUIZ.length) {
      setQuizStep(newAnswers.length);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } else {
      setQuizDone(true);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  function backQuiz() {
    if (quizDone) {
      setQuizDone(false);
    } else {
      setQuizStep(s => s - 1);
      setQuizAnswers(a => a.slice(0, -1));
    }
  }

  const pinboardCols = chatWidth > window.innerWidth * 0.4 ? 3 : 4;

  function openCard(card: Card) {
    setSelectedCard(card);
  }
  function closeCard() {
    setSelectedCard(null);
  }

  function openTraits() {
    setSelectedCard(null);
    setPhase('hiding');
    setTimeout(() => {
      setCurrentView('traits');
      setPhase('showing');
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('visible')));
    }, 200);
  }

  function closeTraits() {
    setPhase('hiding');
    setTimeout(() => {
      setCurrentView('pinboard');
      setPhase('showing');
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('visible')));
    }, 200);
  }

  const isSubPage = currentView === 'traits';

  const panelStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    opacity: phase === 'visible' ? 1 : 0,
    transform: phase === 'visible'
      ? 'scale(1) translateY(0px)'
      : phase === 'hiding'
        ? (isSubPage ? 'scale(0.985) translateY(-6px)' : 'scale(1.015) translateY(6px)')
        : (isSubPage ? 'scale(0.985) translateY(8px)' : 'scale(1.015) translateY(-8px)'),
    transition: phase === 'showing'
      ? 'opacity 0.24s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)'
      : 'opacity 0.18s ease, transform 0.18s ease',
  };

  const visibleCards = useMemo(() =>
    activeTag ? CARDS.filter(c => c.labels?.includes(activeTag)) : CARDS,
  [activeTag]);

  const columns = useMemo(() => {
    const cards = visibleCards;
    if (!cards.length) return Array.from({ length: pinboardCols }, () => [] as { key: string; card: Card }[]);
    const step = Math.max(1, Math.floor(cards.length / pinboardCols));
    return Array.from({ length: pinboardCols }, (_, ci) => {
      const offset = (ci * step) % cards.length;
      const items: { key: string; card: Card }[] = [];
      for (let c = 0; c < cycles; c++) {
        for (let i = 0; i < cards.length; i++) {
          items.push({ key: `${activeTag ?? 'all'}-c${ci}-r${c}-i${i}`, card: cards[(i + offset) % cards.length] });
        }
      }
      return items;
    });
  }, [cycles, pinboardCols, visibleCards, activeTag]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <div style={{
        height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        fontFamily:sans, color:black, background:bg, padding:40, textAlign:'center',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={gray2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
        <h2 style={{ fontSize:20, fontWeight:600, margin:'20px 0 8px', color:black }}>Desktop Only</h2>
        <p style={{ fontSize:14, color:gray1, lineHeight:1.6, maxWidth:320 }}>
          dEssence is designed for desktop experience. Please open on a screen wider than 900px.
        </p>
      </div>
    );
  }

  return (
    <div style={{ height:'100vh', display:'flex', overflow:'hidden', fontFamily:sans, color:black, position:'relative' }}>
    <style>{`@keyframes voice-spin { to { transform: rotate(360deg); } }`}</style>

      <>
      {/* ═══ LEFT: Pinboard / Traits ═══ */}
      <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {currentView === 'traits' ? (
          <div style={panelStyle}>
            <ProfileTraitsView onBack={closeTraits} />
          </div>
        ) : (
          <div style={{ ...panelStyle, display: 'flex', flexDirection: 'column', background: bg, overflow: 'hidden' }}>
            {/* Tag filter bar */}
            <div style={{ padding: '10px 20px', borderBottom: `1px solid ${gray4}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: sans, color: black, flexShrink: 0 }}>Tags:</span>
              {/* scrollable chips */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none' as CSSProperties['scrollbarWidth'], flex: 1, marginLeft: 8 }}>
                <Btn size="sm" active={!activeTag} onClick={() => setActiveTag(null)}>All</Btn>
                {PINNED_TAGS.map(tag => (
                  <Btn key={tag} size="sm" active={activeTag === tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}>{tag}</Btn>
                ))}
              </div>
              {/* + button lives outside overflow so dropdown is never clipped */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {tagSearchOpen ? (
                  <input
                    ref={tagInputRef}
                    value={tagSearch}
                    onChange={e => setTagSearch(e.target.value)}
                    onBlur={() => { setTimeout(() => { setTagSearchOpen(false); setTagSearch(''); }, 150); }}
                    placeholder="Search tags…"
                    style={{ fontSize: 11, fontWeight: 500, fontFamily: sans, padding: '5px 12px', borderRadius: 9999, border: `1.5px solid ${accent}`, outline: 'none', color: black, width: 120, background: bg }}
                  />
                ) : (
                  <button
                    onClick={() => { setTagSearchOpen(true); setTimeout(() => tagInputRef.current?.focus(), 0); }}
                    style={{ width: 26, height: 26, borderRadius: 9999, border: `1.5px solid ${gray4}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gray1 }}
                  ><Plus size={13} strokeWidth={2} /></button>
                )}
                {tagSearchOpen && tagSearch.trim() && (() => {
                  const q = tagSearch.toLowerCase();
                  const matches = ALL_TAGS.filter(t => t.toLowerCase().includes(q) && !PINNED_TAGS.includes(t)).slice(0, 8);
                  return matches.length > 0 ? (
                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: white, border: `1px solid ${gray4}`, borderRadius: 12, padding: 6, zIndex: 200, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', minWidth: 200 }}>
                      {matches.map(t => (
                        <button key={t} onMouseDown={() => { setActiveTag(t); setTagSearchOpen(false); setTagSearch(''); }}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontFamily: sans, fontWeight: 500, color: black, borderRadius: 8 }}
                        >{t}</button>
                      ))}
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
            {/* Masonry */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', scrollbarGutter: 'stable' as CSSProperties['scrollbarGutter'] }}>
              <div style={{ display:'flex', gap:10 }}>
                {columns.map((col, ci) => (
                  <div key={ci} style={{ flex:'1 1 0%', minWidth:0 }}>
                    {col.map(({ key, card }) => (
                      <MemoryCard
                        key={key}
                        card={card}
                        onOpen={() => openCard(card)}
                        isSelected={selectedCard?.id === card.id}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ Resize Handle ═══ */}
      <div
        onMouseDown={(e) => {
          dragRef.current = { startX: e.clientX, startW: chatWidth };
          setDragging(true);
        }}
        style={{
          width: 6, flexShrink:0, cursor:'col-resize',
          background: dragging ? accent : 'transparent',
          transition: dragging ? 'none' : 'background 0.2s',
          position:'relative', zIndex:10,
        }}
        onMouseEnter={(e) => { if (!dragging) e.currentTarget.style.background = gray4; }}
        onMouseLeave={(e) => { if (!dragging) e.currentTarget.style.background = 'transparent'; }}
      />

      {/* ═══ RIGHT: Chat on white ═══ */}
      <div style={{
        width: chatWidth, flexShrink:0,
        background: white,
        display:'flex', flexDirection:'column',
      }}>

        <div style={{ padding:'24px 28px 0' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            {/* User avatar (replaced logo) */}
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <img src="/avatar.jpeg" alt="avatar" style={{ width:28, height:28, borderRadius:8, objectFit:'cover' }} />
              <span style={{ fontSize:14, fontWeight:600, letterSpacing:'-0.02em' }}>Kostiantyn Halynskyi</span>
            </div>
            {/* Burger menu (replaced avatar) */}
            <div style={{ position:'relative' }}>
              <IconBtn style={{ color: black }} onClick={() => setMenuOpen(!menuOpen)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={black} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>
                </svg>
              </IconBtn>
              {menuAnim.mounted && (
                <>
                  <div style={{ position:'fixed', inset:0, zIndex:49 }} onClick={() => setMenuOpen(false)} />
                  <div style={{
                    position:'absolute', top:'calc(100% + 8px)', right:0, zIndex:50,
                    background:white, border:`1px solid ${gray4}`, borderRadius:12, padding:6,
                    minWidth:200, boxShadow:'0 4px 24px rgba(0,0,0,0.1)',
                    opacity: menuAnim.visible ? 1 : 0,
                    transform: menuAnim.visible ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.97)',
                    transition:'opacity 0.15s ease, transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}>
                    <MenuButton label="Profile" onClick={() => setMenuOpen(false)}
                      icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
                    <MenuButton label="Switch Profile" onClick={() => setMenuOpen(false)}
                      icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/></svg>} />
                    <MenuButton label="Profile Traits" onClick={() => { openTraits(); setMenuOpen(false); }}
                      icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>} />
                    <MenuButton label="Settings" onClick={() => { setSettingsOpen(true); setMenuOpen(false); }}
                      icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>} />
                    <div style={{ height:1, background:gray4, margin:'4px 0' }} />
                    <MenuButton label="Log Out" onClick={() => setMenuOpen(false)}
                      icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {!chatStarted ? (
          /* ── Empty state ── */
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 28px 24px' }}>
                <p style={{ fontSize:20, fontWeight:600, lineHeight:1.4, fontFamily:sans, color:black, textAlign:'center', maxWidth:300, margin:'0 0 8px' }}>
                  Hi! I'll learn your preferences based on the content you save.
                </p>
                <p style={{ fontSize:13, lineHeight:1.5, fontFamily:sans, color:gray1, textAlign:'center', margin:'0 0 24px' }}>
                  Try one of these to get started:
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:8, width:'100%' }}>
                  {['I want to save something', 'Personalize my experience', 'Where do I start?'].map(s => (
                    <StarterBtn key={s} label={s} onClick={() => startChat(s)} />
                  ))}
                </div>
              </div>
        ) : (
          /* ── Active chat ── */
          <div style={{ flex:1, minHeight:0, position:'relative' }}>
            <div style={{ height:'100%', overflowY:'auto', padding:'20px 28px 80px' }}>
              {displayMsgs.map((m) => <Bubble key={m.id} msg={m} />)}
              {quizActive && <ChatQuiz step={quizStep} answers={quizAnswers} done={quizDone} onAnswer={answerQuiz} onBack={backQuiz} />}
              <div ref={chatEndRef} />
            </div>
            {/* Gradient + chips overlay */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, pointerEvents:'none' }}>
              <div style={{ height:60, background:`linear-gradient(to bottom, rgba(255,255,255,0), ${white})` }} />
              <div style={{ background:white, padding:'0 24px 10px', display:'flex', gap:8, flexWrap:'wrap', pointerEvents:'auto' }}>
                {['Show saved recipes', 'Italy travel plan', 'Products under $200'].map((s) => (
                  <Btn key={s} size="lg" color={gray1} onClick={() => startChat(s)}>{s}</Btn>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Context chip — shows which card is being discussed */}
        {chatContextCard && (
          <div style={{ padding: '0 20px 6px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: 'rgba(0,113,227,0.06)', borderRadius: 10, border: '1px solid rgba(0,113,227,0.16)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              <span style={{ fontSize: 11, fontWeight: 600, color: accent, fontFamily: sans, flexShrink: 0 }}>Context:</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: black, fontFamily: sans, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chatContextCard.title}</span>
              <button onClick={() => setChatContextCard(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', color: gray2, flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        )}

        <div style={{ padding:'10px 20px 24px' }}>
          <div
            onClick={() => chatInputRef.current?.focus()}
            style={{
              display:'flex', alignItems:'center',
              background:bg, borderRadius:18,
              padding:'14px 14px', cursor:'text',
            }}
          >
            {/* Hidden file input */}
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />

            {/* Left icon buttons */}
            <IconBtn size={40} onClick={() => photoInputRef.current?.click()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={gray1} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </IconBtn>
            <IconBtn size={40}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={gray1} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </IconBtn>

            {/* Input or voice wave */}
            {isRecording ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 3, padding: '0 6px', height: 28 }}>
                {voiceBars.map((h, i) => (
                  <div key={i} style={{ width: 3, borderRadius: 99, background: gray1, height: Math.round(h), transition: 'height 0.08s ease', flexShrink: 0 }} />
                ))}
              </div>
            ) : isProcessingVoice ? (
              <div style={{ flex: 1, padding: '0 6px' }}>
                <span style={{ fontSize: 15, color: gray2, fontFamily: sans, fontWeight: 500 }}>Transcribing…</span>
              </div>
            ) : (
              <input
                ref={chatInputRef}
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                onFocus={() => setChatFocused(true)}
                onBlur={() => setChatFocused(false)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                style={{ flex:1, border:'none', outline:'none', fontSize:15, fontFamily:sans, color:black, fontWeight:500, background:'transparent', padding:'0 6px' }}
              />
            )}

            {/* Mic / Stop / Spinner */}
            <IconBtn
              size={40}
              onClick={isRecording ? stopRecording : (isProcessingVoice ? undefined : startRecording)}
              style={{ color: isRecording ? '#C0392B' : gray1, transition: 'color 0.15s' }}
            >
              {isProcessingVoice ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={gray2} strokeWidth={2.5} strokeLinecap="round" style={{ animation: 'voice-spin 0.75s linear infinite', transformOrigin: '50% 50%' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : isRecording ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#C0392B" stroke="none"><rect x="3" y="3" width="18" height="18" rx="3" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              )}
            </IconBtn>
            <IconBtn size={40} onClick={handleSend} style={{ color: input.trim() ? black : chatFocused ? accent : gray1, transition:'color 0.2s' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
            </IconBtn>
          </div>
        </div>
      </div>

      </>

      {/* ═══ Detail Sidebar ═══ */}
      {sidebarAnim.mounted && selectedCard && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: chatWidth + 6,
          height: '100vh',
          zIndex: 50,
          transform: sidebarAnim.visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
        }}>
          <CardDetailPage
            card={selectedCard}
            onBack={closeCard}
            onOpenLightbox={openLightbox}
            onAskAbout={(card) => {
              setChatContextCard(card);
              closeCard();
              setTimeout(() => chatInputRef.current?.focus(), 100);
            }}
          />
        </div>
      )}

      {/* Lightbox */}
      {lbAnim.mounted && lbDisplayImages.length > 0 && (
        <Lightbox
          images={lbDisplayImages}
          index={lbDisplayIndex}
          sourceRect={lbDisplayRect}
          visible={lbAnim.visible}
          onClose={closeLightbox}
          onPrev={() => setLbDisplayIndex(i => Math.max(0, i - 1))}
          onNext={() => setLbDisplayIndex(i => Math.min(lbDisplayImages.length - 1, i + 1))}
        />
      )}

      {/* ═══ Settings Modal ═══ */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        showSimilarity={showSimilarity}
        onToggle={() => setShowSimilarity(v => !v)}
      />

      {/* ═══ Drag & Drop Overlay ═══ */}
      {isDragging && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(245, 245, 247, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', inset: 12, borderRadius: 18,
            border: `2px dashed ${accent}`,
          }} />
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" x2="12" y1="3" y2="15"/>
          </svg>
          <p style={{ fontSize: 18, fontWeight: 600, fontFamily: sans, color: accent, margin: '16px 0 6px' }}>Drop to save to dEssence</p>
          <p style={{ fontSize: 13, fontFamily: sans, color: gray1 }}>Release to upload and analyze</p>
        </div>
      )}
    </div>
  );
}

// ── Label chip with hover + full × click area ──

function LabelChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  const [h, setH] = useState(false);
  const [hx, setHx] = useState(false);
  return (
    <span
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, fontFamily: sans, padding: '5px 6px 5px 12px', borderRadius: 20, border: `1px solid ${h ? gray3 : gray4}`, color: gray1, background: h ? bg : 'transparent', transition: 'border-color 0.15s, background 0.15s' }}
    >
      {label}
      <button
        onClick={onRemove}
        onMouseEnter={() => setHx(true)} onMouseLeave={() => setHx(false)}
        style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', background: hx ? gray3 : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: hx ? black : gray2, flexShrink: 0, transition: 'background 0.12s, color 0.12s' }}
      >
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
      </button>
    </span>
  );
}

// ── Small components ──


function StarterBtn({ label, onClick }: { label: string; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: '100%', textAlign: 'left',
        fontSize: 13, fontWeight: 500, fontFamily: sans,
        padding: '10px 16px', borderRadius: 12,
        border: `1px solid ${h ? gray3 : gray4}`,
        background: 'transparent',
        color: gray1, cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      {label}
    </button>
  );
}


// ── Mount ──
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
