export interface Memory {
  id: string;
  type: 'image' | 'quote' | 'link' | 'note';
  content: string;
  source?: string;
  image?: string;
  timestamp: string;
  category?: string;
}

export interface Citation {
  memoryId: string;
  label: string;
  type: Memory['type'];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  typing?: boolean;
}

export const mockMemories: Memory[] = [
  { id: 'm1', type: 'quote', content: '"The best interface is no interface. The best design dissolves into behavior."', source: 'Golden Krishna', timestamp: '2h ago' },
  { id: 'm2', type: 'image', content: 'Apartment in Shibuya — 2BR, ¥180k/mo', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=260&fit=crop', timestamp: '3h ago' },
  { id: 'm3', type: 'link', content: 'Tailwind CSS v4 — New engine, faster builds', source: 'tailwindcss.com', timestamp: '5h ago' },
  { id: 'm4', type: 'quote', content: '"Creatine post-workout shows 12% better retention than pre-workout in 8-week trials."', source: 'PubMed Meta-analysis', timestamp: '1d ago' },
  { id: 'm5', type: 'image', content: 'UI reference — command palette pattern', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=260&fit=crop', timestamp: '1d ago' },
  { id: 'm6', type: 'note', content: 'User interview insight: people want to save and forget. They trust the system to remind them when relevant.', timestamp: '2d ago' },
  { id: 'm7', type: 'link', content: 'Flight TYO → OSA — ¥10,800 Peach Aviation', source: 'google.com/flights', timestamp: '2d ago' },
  { id: 'm8', type: 'quote', content: '"Simplicity is the ultimate sophistication."', source: 'Leonardo da Vinci', timestamp: '3d ago' },
  { id: 'm9', type: 'image', content: 'Tokyo street at night — travel mood', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=260&fit=crop', timestamp: '4d ago' },
  { id: 'm10', type: 'link', content: 'NVIDIA Q4 Earnings — Revenue $39.3B (+78% YoY)', source: 'seekingalpha.com', timestamp: '4d ago' },
  { id: 'm11', type: 'image', content: 'Minimal workspace setup inspiration', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop', timestamp: '5d ago' },
  { id: 'm12', type: 'quote', content: '"People ignore design that ignores people."', source: 'Frank Chimero', timestamp: '5d ago' },
  { id: 'm13', type: 'note', content: 'Competitor gap: no one offers transparent preference tracking. Users have no idea why the AI suggests what it suggests.', timestamp: '5d ago' },
  { id: 'm14', type: 'image', content: 'Kyoto temple garden — trip research', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=280&fit=crop', timestamp: '6d ago' },
  { id: 'm15', type: 'link', content: 'React 19 — What\'s new in the latest release', source: 'react.dev', timestamp: '6d ago' },
  { id: 'm16', type: 'quote', content: '"Good design is as little design as possible."', source: 'Dieter Rams', timestamp: '1w ago' },
  { id: 'm17', type: 'note', content: 'Potential feature: auto-tag saved items based on content analysis. Low priority but interesting.', timestamp: '1w ago' },
  { id: 'm18', type: 'image', content: 'Data visualization — dashboard reference', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop', timestamp: '1w ago' },
  { id: 'm19', type: 'link', content: 'Supabase Edge Functions — serverless at the edge', source: 'supabase.com', timestamp: '1w ago' },
  { id: 'm20', type: 'quote', content: '"The details are not the details. They make the design."', source: 'Charles Eames', timestamp: '1w ago' },
  { id: 'm21', type: 'image', content: 'Ramen shop in Shinjuku — must visit', image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&fit=crop', timestamp: '8d ago' },
  { id: 'm22', type: 'note', content: 'Protein timing matters less than total daily intake. Focus on hitting 1.6g/kg minimum.', timestamp: '9d ago' },
  { id: 'm23', type: 'link', content: 'Linear — Issue tracking built for speed', source: 'linear.app', timestamp: '9d ago' },
  { id: 'm24', type: 'image', content: 'Brutalist web design reference', image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=260&fit=crop', timestamp: '10d ago' },
  { id: 'm25', type: 'quote', content: '"Make it work, make it right, make it fast."', source: 'Kent Beck', timestamp: '10d ago' },
  { id: 'm26', type: 'note', content: 'Interesting pattern: users bookmark 10x more than they revisit. The act of saving IS the value for many.', timestamp: '11d ago' },
  { id: 'm27', type: 'link', content: 'Figma Dev Mode — bridge design to code', source: 'figma.com', timestamp: '12d ago' },
  { id: 'm28', type: 'image', content: 'Shibuya crossing — location scouting', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop', timestamp: '12d ago' },
];

export const mockChat: ChatMessage[] = [];
