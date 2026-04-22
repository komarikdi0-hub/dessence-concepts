import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { mockMemories, mockChat, type Memory, type ChatMessage, type Citation } from './data/mock';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface MemoryGroup {
  id: string;
  title: string;
  icon: string;
  gradient: string;
  items: Memory[];
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

function IconSend(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
}

function IconLink(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
}

function IconQuote(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.71 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.085 0-2.158-.45-2.917-1.179zM14.583 17.321C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.71 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.085 0-2.158-.45-2.917-1.179z"/></svg>;
}

function IconX(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>;
}

function IconPaperclip(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>;
}

function IconPlay(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z"/></svg>;
}

function IconChevron(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 15l-6-6-6 6"/></svg>;
}

function IconGrid(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
}

/* ═══════════════════════════════════════════
   Karaoke Demo Data
   ═══════════════════════════════════════════ */

const SINGER_MEMORIES: Memory[] = [
  { id: 'singer-1', type: 'note', content: 'Adele — powerhouse vocals, soul & pop ballads. Best for emotional songs.', timestamp: 'just now' },
  { id: 'singer-2', type: 'note', content: 'Frank Sinatra — jazz standards, smooth classics. Timeless elegance.', timestamp: 'just now' },
  { id: 'singer-3', type: 'note', content: 'Queen — epic rock anthems, Freddie Mercury. Crowd always joins in.', timestamp: 'just now' },
  { id: 'singer-4', type: 'note', content: 'Whitney Houston — powerful R&B ballads. Legendary vocal range.', timestamp: 'just now' },
  { id: 'singer-5', type: 'note', content: 'The Weeknd — modern R&B/pop, 80s synth vibes. Great energy.', timestamp: 'just now' },
];

const KARAOKE_GROUPS: MemoryGroup[] = [
  {
    id: 'karaoke-bar',
    title: 'Karaoke Bar Hits',
    icon: '🎤',
    gradient: 'linear-gradient(135deg, #3489FF, #6C5CE7)',
    items: [
      { id: 'k1', type: 'note', content: 'Someone Like You — Adele\nEmotional, easy range, crowd always sings along', timestamp: 'just now' },
      { id: 'k2', type: 'note', content: 'Bohemian Rhapsody — Queen\nEpic performance, everyone joins at the opera part', timestamp: 'just now' },
      { id: 'k3', type: 'note', content: 'My Way — Frank Sinatra\nThe ultimate closing song, timeless classic', timestamp: 'just now' },
      { id: 'k4', type: 'note', content: 'I Will Always Love You — Whitney Houston\nBig finish, show off your range', timestamp: 'just now' },
      { id: 'k5', type: 'image', content: 'Karaoke night vibes', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=200&fit=crop', timestamp: 'just now' },
      { id: 'k6', type: 'quote', content: '"Karaoke isn\'t about singing well — it\'s about singing fearlessly."', timestamp: 'just now' },
    ],
  },
  {
    id: 'rock-classics',
    title: 'Rock Classics',
    icon: '🎸',
    gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    items: [
      { id: 'k7', type: 'note', content: 'We Will Rock You — Queen\nStomping beat, the crowd does the work', timestamp: 'just now' },
      { id: 'k8', type: 'note', content: 'Don\'t Stop Me Now — Queen\nPure energy, feel-good anthem', timestamp: 'just now' },
      { id: 'k9', type: 'note', content: 'Blinding Lights — The Weeknd\n80s synth vibes, easy melody to nail', timestamp: 'just now' },
      { id: 'k10', type: 'image', content: 'Live rock energy', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', timestamp: 'just now' },
    ],
  },
  {
    id: 'ballads',
    title: 'Ballads & Slow Songs',
    icon: '🎹',
    gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    items: [
      { id: 'k11', type: 'note', content: 'Rolling in the Deep — Adele\nPowerful, dramatic, incredible build-up', timestamp: 'just now' },
      { id: 'k12', type: 'note', content: 'Fly Me to the Moon — Frank Sinatra\nSmooth jazz, romantic mood setter', timestamp: 'just now' },
      { id: 'k13', type: 'note', content: 'I Have Nothing — Whitney Houston\nEmotional powerhouse, goosebump moment', timestamp: 'just now' },
      { id: 'k14', type: 'note', content: 'After Hours — The Weeknd\nDark R&B ballad, moody late-night vibe', timestamp: 'just now' },
      { id: 'k15', type: 'image', content: 'Late night piano bar mood', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=200&fit=crop', timestamp: 'just now' },
    ],
  },
  {
    id: 'duets',
    title: 'Duets & Group Songs',
    icon: '👥',
    gradient: 'linear-gradient(135deg, #00b894, #00cec9)',
    items: [
      { id: 'k16', type: 'note', content: 'Under Pressure — Queen & David Bowie\nIconic bassline, great back-and-forth', timestamp: 'just now' },
      { id: 'k17', type: 'note', content: 'Save Your Tears — The Weeknd & Ariana Grande\nModern pop duet, catchy chorus', timestamp: 'just now' },
      { id: 'k18', type: 'note', content: 'Somebody to Love — Queen\nStarts solo, builds to full group harmony', timestamp: 'just now' },
      { id: 'k19', type: 'quote', content: '"The best duets are when you forget you\'re performing and just feel the music together."', timestamp: 'just now' },
    ],
  },
];

/* ═══════════════════════════════════════════
   Memory Card
   ═══════════════════════════════════════════ */

function MemoryCard({ memory, onRemove }: { memory: Memory; onRemove: (id: string) => void }) {
  return (
    <div className="group relative mb-3.5">
      <div className={cn(
        'scroll-edge rounded-[14px] overflow-hidden transition-all duration-200',
        memory.type === 'image' ? '' : 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5',
      )}>
        {memory.type === 'image' && memory.image && (
          <div className="px-3 pt-3 pb-2 bg-white/50 rounded-[14px]">
            <img src={memory.image} alt={memory.content} className="w-full block rounded-[10px] shadow-sm object-cover" draggable={false} />
            <p className="text-[12px] text-black/50 mt-2 px-1 font-medium">{memory.content}</p>
          </div>
        )}

        {memory.type === 'quote' && (
          <div className="p-5">
            <IconQuote className="w-4 h-4 text-accent/40 mb-2" />
            <p className="text-[13px] text-black/80 leading-relaxed italic font-medium">{memory.content}</p>
            {memory.source && <p className="text-[11px] text-black/40 mt-2 font-medium">— {memory.source}</p>}
          </div>
        )}

        {memory.type === 'link' && (
          <div className="p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-accent/10 flex items-center justify-center shrink-0">
              <IconLink className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-[13px] text-black/80 leading-snug font-medium">{memory.content}</p>
              {memory.source && <p className="text-[12px] text-accent mt-1.5 font-medium">{memory.source}</p>}
            </div>
          </div>
        )}

        {memory.type === 'note' && (
          <div className="p-4">
            <p className="text-[13px] text-black/70 leading-relaxed whitespace-pre-line">{memory.content}</p>
          </div>
        )}
      </div>

      <button
        onClick={() => onRemove(memory.id)}
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-black/15 shadow-md flex items-center justify-center cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all duration-150 z-10 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"
      >
        <IconX className="w-3 h-3 text-black/40" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Drop Overlay
   ═══════════════════════════════════════════ */

function DropOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-4 z-30 bg-accent/[0.06] border-2 border-dashed border-accent/30 rounded-[20px] flex items-center justify-center pointer-events-none"
        >
          <p className="text-[15px] font-semibold text-accent/70">Drop to save</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   Masonry Layout (infinite scroll)
   ═══════════════════════════════════════════ */

const COLS = 4;

function Masonry({ items, onRemove, scrollRef }: { items: Memory[]; onRemove: (id: string) => void; scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const [cycles, setCycles] = useState(3);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timer: number;
    const onScroll = () => {
      el.classList.add('is-scrolling');
      clearTimeout(timer);
      timer = window.setTimeout(() => el.classList.remove('is-scrolling'), 200);
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 800) {
        setCycles((c) => c + 2);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); clearTimeout(timer); };
  }, [scrollRef]);

  const columns = useMemo(() => {
    const step = Math.floor(items.length / COLS);
    return Array.from({ length: COLS }, (_, ci) => {
      const offset = ci * step;
      const cards: { key: string; memory: Memory }[] = [];
      for (let c = 0; c < cycles; c++) {
        for (let i = 0; i < items.length; i++) {
          cards.push({ key: `c${ci}-r${c}-i${i}`, memory: items[(i + offset) % items.length] });
        }
      }
      return cards;
    });
  }, [items, cycles]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '14px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      {columns.map((col, ci) => (
        <div key={ci} style={{ flex: '1 1 0%', minWidth: 0 }}>
          {col.map(({ key, memory }) => (
            <MemoryCard key={key} memory={memory} onRemove={onRemove} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Grouped Pinboard (categorized view)
   ═══════════════════════════════════════════ */

function GroupedPinboard({ groups, onRemove, onBack }: { groups: MemoryGroup[]; onRemove: (id: string) => void; onBack: () => void }) {
  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {groups.map((group, gi) => {
        // Distribute items across 4 columns
        const cols: Memory[][] = [[], [], [], []];
        group.items.forEach((item, i) => cols[i % 4].push(item));
        return (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            {/* Simple gray label */}
            <p data-group-header className="text-[13px] font-medium text-black/30 mb-3">{group.title}</p>

            {/* Same 4-column flex masonry layout */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '14px', width: '100%' }}>
              {cols.map((col, ci) => (
                <div key={ci} style={{ flex: '1 1 0%', minWidth: 0 }}>
                  {col.map((item) => (
                    <MemoryCard key={item.id} memory={item} onRemove={onRemove} />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Back button at bottom */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onBack}
        className="mt-2 px-4 py-2 rounded-full bg-white border border-black/10 text-[13px] font-medium text-black/50 hover:text-black/70 hover:border-black/20 transition-all cursor-pointer shadow-sm flex items-center gap-2"
      >
        <IconGrid className="w-3.5 h-3.5" />
        Show all memories
      </motion.button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Clarification Bar
   ═══════════════════════════════════════════ */

const CATEGORIES = [
  { id: 'link', label: 'Link', icon: '🔗' },
  { id: 'quote', label: 'Quote', icon: '💬' },
  { id: 'note', label: 'Note', icon: '📝' },
  { id: 'image', label: 'Image', icon: '🖼' },
  { id: 'article', label: 'Article', icon: '📄' },
  { id: 'listing', label: 'Listing', icon: '🏠' },
];

function ClarificationBar({ onSelect, resolved }: { onSelect: (cat: string) => void; resolved: string | null }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="px-5 py-3.5 bg-accent/[0.04] border-b border-accent/10">
        <p className="text-[12px] text-accent/70 font-semibold mb-2.5">
          {resolved
            ? `Categorized as ${CATEGORIES.find((c) => c.id === resolved)?.label || resolved}`
            : 'While I save and analyze your memory, what type of content is this?'}
        </p>
        {!resolved && (
          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          >
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                onClick={() => onSelect(cat.id)}
                data-category={cat.id}
                className="px-3.5 py-2 rounded-[10px] bg-accent/10 text-[12px] font-semibold text-accent border border-accent/20 hover:bg-accent/20 hover:border-accent/40 transition-all cursor-pointer"
              >
                {cat.icon} {cat.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Citation Chip
   ═══════════════════════════════════════════ */

function CitationChip({ citation }: { citation: Citation }) {
  const icon = citation.type === 'link' ? '🔗' : citation.type === 'image' ? '🖼' : citation.type === 'quote' ? '💬' : '📝';
  return (
    <span className="citation-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-accent/[0.06] border border-accent/15 text-[12px] text-accent font-medium cursor-default hover:bg-accent/10 transition-colors">
      <span>{icon}</span>
      <span className="truncate max-w-[200px]">{citation.label}</span>
    </span>
  );
}

/* ═══════════════════════════════════════════
   Typing Indicator
   ═══════════════════════════════════════════ */

function TypingDots() {
  return (
    <div className="max-w-[85%]">
      <div className="bg-[#f0f0f3] rounded-[14px] rounded-bl-[4px] px-4 py-3 inline-flex gap-1.5 items-center">
        {[0, 0.15, 0.3].map((d) => (
          <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-black/25" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: d }} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Chat Message
   ═══════════════════════════════════════════ */

function Message({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-accent text-white rounded-[14px] rounded-br-[4px] px-4 py-2.5">
          <p className="text-[14px] leading-relaxed font-medium">{msg.content}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-[85%]">
      <div className="bg-[#f0f0f3] rounded-[14px] rounded-bl-[4px] px-4 py-3">
        <p className="text-[14px] text-black/75 leading-[1.65] whitespace-pre-line">{msg.content}</p>
        {msg.citations && msg.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {msg.citations.map((c, i) => <CitationChip key={i} citation={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Demo Cursor
   ═══════════════════════════════════════════ */

function DemoCursor({ x, y, clicking, visible }: { x: number; y: number; clicking: boolean; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed z-[100] pointer-events-none"
          animate={{ left: x - 14, top: y - 14 }}
          initial={{ opacity: 0, scale: 0.4, left: x - 14, top: y - 14 }}
          exit={{ opacity: 0, scale: 0.4 }}
          transition={{ type: 'spring', stiffness: 110, damping: 18 }}
        >
          <div
            className={cn('w-7 h-7 rounded-full border-2 border-accent shadow-[0_0_20px_rgba(52,137,255,0.3)]', clicking ? 'bg-accent/50 scale-[0.8]' : 'bg-accent/20')}
            style={{ transition: 'background 0.15s, transform 0.15s' }}
          />
          <AnimatePresence>
            {clicking && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-accent/40"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   AI Response Logic
   ═══════════════════════════════════════════ */

function getAIResponse(query: string, memories: Memory[]): { content: string; citations: Citation[] } {
  const q = query.toLowerCase();

  if (q.includes('apartment') || q.includes('shibuya') || q.includes('квартир') || q.includes('listing')) {
    return {
      content: 'I found 1 apartment listing in your memory:\n\nA 2BR in Shibuya for ¥180,000/month. South-facing, renovated 2024, 15 min walk to station.\n\nBased on your notes, you were interested in pet-friendly places in the ¥150–200k range.',
      citations: [{ memoryId: 'm2', label: 'Apartment in Shibuya — 2BR, ¥180k/mo', type: 'image' }],
    };
  }

  if (q.includes('quote') || q.includes('цитат')) {
    const quotes = memories.filter((m) => m.type === 'quote').slice(0, 3);
    return {
      content: `You have ${quotes.length} quotes saved. Here are the most recent ones:`,
      citations: quotes.map((m) => ({ memoryId: m.id, label: m.content.slice(0, 50) + '...', type: 'quote' as const })),
    };
  }

  if (q.includes('flight') || q.includes('travel') || q.includes('tokyo') || q.includes('japan') || q.includes('рейс')) {
    return {
      content: 'I found several travel-related saves:\n\nYou have a flight saved (TYO → OSA, ¥10,800) and multiple Tokyo location photos.',
      citations: [
        { memoryId: 'm7', label: 'Flight TYO → OSA — ¥10,800', type: 'link' },
        { memoryId: 'm9', label: 'Tokyo street at night', type: 'image' },
      ],
    };
  }

  if (q.includes('tech') || q.includes('link') || q.includes('ссылк')) {
    const links = memories.filter((m) => m.type === 'link').slice(0, 3);
    return {
      content: `You have ${links.length} tech links saved:`,
      citations: links.map((m) => ({ memoryId: m.id, label: m.content.slice(0, 50), type: 'link' as const })),
    };
  }

  const sample = memories.slice(0, 2);
  return {
    content: `I looked through your ${memories.length} saved items. Here's what seems most relevant:`,
    citations: sample.map((m) => ({ memoryId: m.id, label: m.content.slice(0, 50), type: m.type })),
  };
}

/* ═══════════════════════════════════════════
   Main App
   ═══════════════════════════════════════════ */

import { Analytics } from '@vercel/analytics/react';

export default function App() {
  /* ── Signature ── */
  useEffect(() => {
    console.log(
      '%c 3mpq Studio Development | Kostiantyn Halynksyi VI/UX Engineer ',
      'background: #3489FF; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
    );
  }, []);

  /* ── State ── */
  const [memories, setMemories] = useState(mockMemories);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChat);
  const [input, setInput] = useState('');
  const [draggingOver, setDraggingOver] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [clarify, setClarify] = useState<{ active: boolean; memoryId: string; resolved: string | null } | null>(null);

  // Pinboard mode
  const [pinboardMode, setPinboardMode] = useState<'masonry' | 'grouped'>('masonry');
  const [groups, setGroups] = useState<MemoryGroup[]>([]);

  // Demo cursor
  const [demoActive, setDemoActive] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorClicking, setCursorClicking] = useState(false);
  const demoAbort = useRef(false);

  /* ── Refs ── */
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const pinboardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  /* ── Auto-scroll chat ── */
  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  /* ── Smart Send ── */
  const handleSend = useCallback((text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    if (!text) setInput('');

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: msg, timestamp: 'now' };
    setMessages((prev) => [...prev, userMsg]);
    setChatOpen(true);

    const urlMatch = msg.match(/https?:\/\/\S+/);
    if (urlMatch) {
      const url = urlMatch[0];
      let hostname = 'link';
      try { hostname = new URL(url).hostname; } catch {}
      const newId = `m-${Date.now()}`;
      setMemories((prev) => [{ id: newId, type: 'link', content: url.length > 55 ? url.slice(0, 55) + '...' : url, source: hostname, timestamp: 'just now' }, ...prev]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: `Saved to your memory! I've stored this link from ${hostname}.`, timestamp: 'now' }]);
        setClarify({ active: true, memoryId: newId, resolved: null });
      }, 900);
      return;
    }

    const isQuestion = /^(what|how|when|where|find|show|which|do i|did i|have i|list|search|compare|summar)/i.test(msg) || msg.endsWith('?');
    if (isQuestion) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const resp = getAIResponse(msg, memories);
        setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: resp.content, citations: resp.citations, timestamp: 'now' }]);
      }, 1200);
      return;
    }

    const newId = `m-${Date.now()}`;
    const isQuoteLike = msg.includes('"') || msg.includes('\u201c') || msg.length < 120;
    setMemories((prev) => [{
      id: newId,
      type: isQuoteLike ? 'quote' : 'note',
      content: isQuoteLike ? `\u201c${msg.replace(/^["\u201c\u201d]|["\u201c\u201d]$/g, '').trim()}\u201d` : msg,
      timestamp: 'just now',
    }, ...prev]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: 'Saved to your memory! I\'ll index this for future recall.', timestamp: 'now' }]);
      setClarify({ active: true, memoryId: newId, resolved: null });
    }, 900);
  }, [input, memories]);

  /* ── Clarification ── */
  const handleClarify = useCallback((category: string) => {
    if (!clarify) return;
    setClarify((prev) => prev ? { ...prev, resolved: category } : null);
    const label = CATEGORIES.find((c) => c.id === category)?.label || category;
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: `Tagged as ${label}. I'll use this to better organize and recall your saves.`, timestamp: 'now' }]);
      setTimeout(() => setClarify(null), 600);
    }, 600);
  }, [clarify]);

  const handleRemove = useCallback((id: string) => { setMemories((prev) => prev.filter((m) => m.id !== id)); }, []);

  /* ── Drag & Drop ── */
  const handleDragEnter = useCallback((e: React.DragEvent) => { e.preventDefault(); dragCounter.current++; setDraggingOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); dragCounter.current--; if (dragCounter.current === 0) setDraggingOver(false); }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDraggingOver(false);
    const text = e.dataTransfer.getData('text/plain');
    if (e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          const newId = `m-${Date.now()}-${Math.random()}`;
          setMemories((prev) => [{ id: newId, type: 'image', content: file.name, image: url, timestamp: 'just now' }, ...prev]);
          setChatOpen(true);
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: `Saved image "${file.name}" to your memory.`, timestamp: 'now' }]);
            setClarify({ active: true, memoryId: newId, resolved: null });
          }, 900);
        }
      });
      return;
    }
    if (text && text.trim()) handleSend(text.trim());
  }, [handleSend]);

  /* ═══════════════════════════════════════
     Demo Cursor Flow — Karaoke Scenario
     ═══════════════════════════════════════ */

  const startDemo = useCallback(async () => {
    if (demoActive) { demoAbort.current = true; setDemoActive(false); setPinboardMode('masonry'); return; }

    demoAbort.current = false;
    setDemoActive(true);
    setMessages([]);
    setClarify(null);
    setChatOpen(false);
    setInput('');
    setPinboardMode('masonry');
    setGroups([]);

    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const aborted = () => demoAbort.current;
    const moveTo = (selector: string) => {
      const el = document.querySelector(selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setCursorPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    };
    const click = async () => { setCursorClicking(true); await wait(220); setCursorClicking(false); await wait(100); };
    const typeDemo = async (text: string) => {
      for (let i = 0; i <= text.length; i++) {
        if (aborted()) return;
        setInput(text.slice(0, i));
        await wait(32);
      }
    };

    // ── Start
    setCursorPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    await wait(600);
    if (aborted()) { setDemoActive(false); return; }

    // ── 1. Expand chat
    moveTo('[data-demo="input"]');
    await wait(700);
    if (aborted()) { setDemoActive(false); return; }
    await click();
    setChatOpen(true);
    await wait(400);

    // ── 2. Type singer list
    moveTo('[data-demo="input"]');
    await wait(200);
    if (aborted()) { setDemoActive(false); return; }
    await typeDemo('Remember: Adele, Sinatra, Queen, Whitney, Weeknd');
    await wait(350);
    if (aborted()) { setDemoActive(false); return; }

    // ── 3. Send
    moveTo('[data-demo="send"]');
    await wait(400);
    await click();
    setInput('');
    setMessages((prev) => [...prev, { id: 'demo-u1', role: 'user', content: 'Remember: Adele, Sinatra, Queen, Whitney, Weeknd', timestamp: 'now' }]);

    // Add singer cards to pinboard
    setMemories((prev) => [...SINGER_MEMORIES, ...prev]);
    setIsTyping(true);
    await wait(1100);
    if (aborted()) { setDemoActive(false); setIsTyping(false); return; }
    setIsTyping(false);
    setMessages((prev) => [...prev, {
      id: 'demo-a1', role: 'assistant',
      content: 'Saved 5 artists to your memory! I\'ve created individual notes for each: Adele, Frank Sinatra, Queen, Whitney Houston, and The Weeknd.',
      citations: [
        { memoryId: 'singer-1', label: 'Adele — soul & pop ballads', type: 'note' },
        { memoryId: 'singer-3', label: 'Queen — epic rock anthems', type: 'note' },
        { memoryId: 'singer-4', label: 'Whitney Houston — R&B ballads', type: 'note' },
      ],
      timestamp: 'now',
    }]);
    setClarify({ active: true, memoryId: 'singer-1', resolved: null });
    await wait(1000);
    if (aborted()) { setDemoActive(false); return; }

    // ── 4. Click category "Note"
    moveTo('[data-category="note"]');
    await wait(600);
    if (aborted()) { setDemoActive(false); return; }
    await click();
    setClarify((prev) => prev ? { ...prev, resolved: 'note' } : null);
    await wait(400);
    setIsTyping(true);
    await wait(500);
    setIsTyping(false);
    setMessages((prev) => [...prev, { id: 'demo-a2', role: 'assistant', content: 'Tagged as Notes. I\'ll remember your music preferences for future recommendations.', timestamp: 'now' }]);
    setTimeout(() => setClarify(null), 400);
    await wait(1100);
    if (aborted()) { setDemoActive(false); return; }

    // ── 5. Type karaoke question
    moveTo('[data-demo="input"]');
    await wait(400);
    if (aborted()) { setDemoActive(false); return; }
    await typeDemo('What songs can I sing at karaoke?');
    await wait(350);
    if (aborted()) { setDemoActive(false); return; }

    // ── 6. Send question
    moveTo('[data-demo="send"]');
    await wait(400);
    await click();
    setInput('');
    setMessages((prev) => [...prev, { id: 'demo-u2', role: 'user', content: 'What songs can I sing at karaoke?', timestamp: 'now' }]);
    setIsTyping(true);
    await wait(1500);
    if (aborted()) { setDemoActive(false); setIsTyping(false); return; }
    setIsTyping(false);

    // AI response with categories
    setMessages((prev) => [...prev, {
      id: 'demo-a3', role: 'assistant',
      content: 'Based on your favorite artists, here\'s your karaoke repertoire organized by vibe:\n\n🎤 Karaoke Bar Hits — crowd-pleasers everyone knows\n🎸 Rock Classics — for when the energy picks up\n🎹 Ballads — emotional showstoppers\n👥 Duets — grab a partner\n\nI\'ve organized your memory board by category.',
      citations: [
        { memoryId: 'singer-1', label: 'Adele', type: 'note' },
        { memoryId: 'singer-3', label: 'Queen', type: 'note' },
        { memoryId: 'singer-2', label: 'Frank Sinatra', type: 'note' },
        { memoryId: 'singer-4', label: 'Whitney Houston', type: 'note' },
        { memoryId: 'singer-5', label: 'The Weeknd', type: 'note' },
      ],
      timestamp: 'now',
    }]);

    // ── 7. Switch pinboard to grouped mode
    await wait(600);
    if (aborted()) { setDemoActive(false); return; }
    setPinboardMode('grouped');
    setGroups(KARAOKE_GROUPS);
    if (pinboardRef.current) pinboardRef.current.scrollTop = 0;
    await wait(2000);
    if (aborted()) { setDemoActive(false); return; }

    // ── 8. Cursor explores the groups
    const groupHeaders = document.querySelectorAll('[data-group-header]');
    for (let i = 0; i < Math.min(groupHeaders.length, 3); i++) {
      if (aborted()) { setDemoActive(false); return; }
      const rect = groupHeaders[i].getBoundingClientRect();
      setCursorPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      await wait(900);
    }

    await wait(800);
    setDemoActive(false);
  }, [demoActive]);

  /* ═══════════════════════════════════════
     Render
     ═══════════════════════════════════════ */

  return (
    <div
      className="h-full flex flex-col relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* ─── Pinboard ─── */}
      <div ref={pinboardRef} className="flex-1 pinboard-scroll px-6 pt-6 pb-[240px]">
        <AnimatePresence mode="wait">
          {pinboardMode === 'masonry' ? (
            <motion.div
              key="masonry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {memories.length > 0 ? (
                <Masonry items={memories} onRemove={handleRemove} scrollRef={pinboardRef} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-[16px] text-black/30 font-medium mb-1">Your memory is empty</p>
                    <p className="text-[13px] text-black/20">Drag text, images, or links anywhere here</p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grouped"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GroupedPinboard
                groups={groups}
                onRemove={handleRemove}
                onBack={() => { setPinboardMode('masonry'); setGroups([]); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Bottom fade gradient ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-[240px] pointer-events-none z-10 bg-gradient-to-t from-white via-white/80 to-transparent" />

      {/* ─── Chat Panel ─── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[720px] z-20">
        <div className="mx-4 mb-5 bg-white border border-black/[0.08] rounded-[20px] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_16px_80px_rgba(0,0,0,0.22),0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">

          <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 pt-3 pb-1">
                  <span className="text-[11px] font-semibold text-black/25 uppercase tracking-wider">Memory Chat</span>
                  <button onClick={() => setChatOpen(false)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/[0.04] transition-colors cursor-pointer">
                    <IconChevron className="w-3.5 h-3.5 text-black/30 rotate-180" />
                  </button>
                </div>

                <AnimatePresence>
                  {clarify?.active && <ClarificationBar onSelect={handleClarify} resolved={clarify.resolved} />}
                </AnimatePresence>

                <div ref={chatScrollRef} className="max-h-[340px] overflow-y-auto px-5 pb-3 pt-2">
                  {messages.length === 0 && !isTyping ? (
                    <div className="py-6 text-center">
                      <p className="text-[13px] text-black/25 mb-3">Ask anything about what you've saved</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['What apartments did I save?', 'Summarize my quotes', 'Show travel plans'].map((q) => (
                          <button key={q} onClick={() => { setInput(q); inputRef.current?.focus(); }} className="px-3 py-1.5 rounded-full border border-black/10 text-[12px] text-black/45 font-medium hover:text-black/65 hover:border-black/20 transition-colors cursor-pointer">
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
                          <Message msg={msg} />
                        </motion.div>
                      ))}
                      {isTyping && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><TypingDots /></motion.div>}
                    </div>
                  )}
                </div>

                <div className="border-t border-black/[0.04]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Input Bar ─── */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 text-black/25 hover:text-black/45 hover:bg-black/[0.03] transition-colors cursor-pointer">
                <IconPaperclip className="w-4 h-4" />
              </button>

              <input
                ref={inputRef}
                data-demo="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setChatOpen(true)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                placeholder="Ask your memory..."
                className="flex-1 h-[40px] bg-[#f0f0f2] rounded-[10px] px-4 text-[14px] text-black/85 placeholder:text-black/25 font-medium outline-none focus:bg-[#e8e8ec] transition-colors border-0"
              />

              <button
                data-demo="play"
                onClick={startDemo}
                className={cn(
                  'w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 transition-colors cursor-pointer',
                  demoActive ? 'bg-accent/10 text-accent' : 'text-black/25 hover:text-black/45 hover:bg-black/[0.03]',
                )}
                title="Watch demo"
              >
                {demoActive ? <IconX className="w-3.5 h-3.5" /> : <IconPlay className="w-4 h-4" />}
              </button>

              <motion.button
                data-demo="send"
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className={cn(
                  'w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 cursor-pointer transition-colors',
                  input.trim() ? 'bg-accent text-white' : 'bg-[#f0f0f2] text-black/20',
                )}
              >
                <IconSend className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <DropOverlay visible={draggingOver} />
      <DemoCursor x={cursorPos.x} y={cursorPos.y} clicking={cursorClicking} visible={demoActive} />
      <Analytics />
    </div>
  );
}
