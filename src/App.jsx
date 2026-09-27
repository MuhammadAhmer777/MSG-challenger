import { useEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
  ['home', 'Home'],
  ['directory', 'Market Directory'],
  ['seasonal', 'Seasonal Recommendations'],
  ['produce', 'Produce Guide'],
  ['bookmarks', 'Bookmarks'],
  ['about', 'About'],
  ['contact', 'Contact'],
];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const CATEGORIES = ['Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Leafy Greens', 'Root Vegetables', 'Organic', 'Grains', 'Other'];
const MARKET_FALLBACK_IMAGE = 'https://images.pexels.com/photos/7702140/pexels-photo-7702140.jpeg?auto=compress&cs=tinysrgb&w=1200';
const VISIT_KEY = 'ff_total_visits_v2';

function readSession(key, fallback) {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getRoute() {
  const [page = 'home', id] = window.location.hash.slice(1).split('/');
  return { page: NAV_ITEMS.some(([name]) => name === page) || page === 'market' ? page : 'home', id };
}

function marketIsOpen(market, now = new Date()) {
  if (!market.days.includes(now.toLocaleDateString('en-US', { weekday: 'long' }))) return false;
  const hours = market.hours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!hours) return false;
  const toMinutes = (hour, minute, meridiem) => (Number(hour) % 12 + (meridiem.toUpperCase() === 'PM' ? 12 : 0)) * 60 + Number(minute);
  const current = now.getHours() * 60 + now.getMinutes();
  return current >= toMinutes(hours[1], hours[2], hours[3]) && current <= toMinutes(hours[4], hours[5], hours[6]);
}

function Brand({ footer = false }) {
  return <div className={`brand${footer ? ' footer-brand' : ''}`}>
    <span className="brand-mark" aria-hidden="true">🌿</span>
    <span><strong>FreshFind</strong><small>{footer ? 'Fresh All Along' : 'Freshness at Your Doorstep'}</small></span>
  </div>;
}

function MarketCard({ market, saved, onBookmark, onNote }) {
  return <article className="market-card">
    <div className="card-image">
      <img src={market.image || MARKET_FALLBACK_IMAGE} alt={`Fresh produce at ${market.name}`} loading="lazy" onError={(event) => { event.currentTarget.src = MARKET_FALLBACK_IMAGE; }} />
      <span className="pill">{market.area}</span>
      <button className={`heart${saved ? ' saved' : ''}`} onClick={() => onBookmark('market', market.id)} aria-label={`${saved ? 'Remove' : 'Save'} ${market.name}`}>{saved ? '★' : '☆'}</button>
    </div>
    <div className="card-body">
      <h3>{market.name}</h3>
      <div className="meta"><span className="ui-icon">●</span> {market.address}<br /><span className="ui-icon">▣</span> {market.days.join(' • ')}<br /><span className="ui-icon">◷</span> {market.hours}<br /><span className={marketIsOpen(market) ? 'open-now' : 'closed-now'}>{marketIsOpen(market) ? '● Open now' : '○ Currently closed'}</span></div>
      <div className="chips">{market.produce.slice(0, 4).map((item) => <span className="chip" key={item}>{item}</span>)}</div>
      <div className="card-actions"><a className="small-btn primaryish" href={`#market/${market.id}`}>View details →</a><button className="small-btn" onClick={() => onNote('market', market.id)}>Add note</button></div>
    </div>
  </article>;
}

function ProduceCard({ item, saved, onBookmark, onShare }) {
  return <article className="produce-card">
    <div className="card-image">
      <img src={item.image || MARKET_FALLBACK_IMAGE} alt={item.name} loading="lazy" onError={(event) => { event.currentTarget.src = MARKET_FALLBACK_IMAGE; }} />
      <span className="pill">{item.category}</span>
      <button className={`heart${saved ? ' saved' : ''}`} onClick={() => onBookmark('produce', item.id)} aria-label={`${saved ? 'Remove' : 'Save'} ${item.name}`}>{saved ? '★' : '☆'}</button>
    </div>
    <div className="card-body">
      <h3>{item.name}</h3>
      <div className="meta"><strong>Season:</strong> {item.season}<br />{item.description}</div>
      <div className="chips">{item.markets.slice(0, 2).map((market) => <span className="chip" key={market}>{market}</span>)}</div>
      <div className="card-actions"><a className="small-btn primaryish" href={`#produce/${item.id}`}>View details →</a><button className="small-btn" onClick={() => onShare(item.name, item.description, `#produce/${item.id}`)}>Share</button></div>
    </div>
  </article>;
}

function App() {
  const [markets, setMarkets] = useState([]);
  const [produce, setProduce] = useState([]);
  const [chatbotRules, setChatbotRules] = useState([]);
  const [route, setRoute] = useState(getRoute);
  const [bookmarks, setBookmarks] = useState(() => readSession('ff_bookmarks', []));
  const [notes, setNotes] = useState(() => readSession('ff_notes', {}));
  const [toastMessage, setToastMessage] = useState('');
  const [clock, setClock] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [directoryQuery, setDirectoryQuery] = useState('');
  const [headerQuery, setHeaderQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [dayFilter, setDayFilter] = useState('');
  const [marketProduceFilter, setMarketProduceFilter] = useState('');
  const [marketSort, setMarketSort] = useState('name');
  const [produceQuery, setProduceQuery] = useState('');
  const [produceCategory, setProduceCategory] = useState('');
  const [produceSeason, setProduceSeason] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [geoMessage, setGeoMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modal, setModal] = useState('');
  const [noteTarget, setNoteTarget] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [shareData, setShareData] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([{ user: false, text: 'Hi! Ask me about markets, produce, hours or bookmarks.' }]);
  const visitRecorded = useRef(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const handleRoute = () => {
      setRoute(getRoute());
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([fetch('data/markets.json'), fetch('data/produce.json'), fetch('data/chatbot.json')])
      .then(async ([marketResponse, produceResponse, chatbotResponse]) => {
        if (!marketResponse.ok || !produceResponse.ok || !chatbotResponse.ok) throw new Error('Data unavailable');
        const [marketData, produceData, chatbotData] = await Promise.all([marketResponse.json(), produceResponse.json(), chatbotResponse.json()]);
        if (active) {
          setMarkets(marketData);
          setProduce(produceData);
          setChatbotRules(chatbotData);
        }
      })
      .catch(() => { if (active) showToast('Market data could not be loaded. Start the app with npm run dev.'); })
      .finally(() => { if (active) setVisitorCount((Number(localStorage.getItem(VISIT_KEY)) || 0) + 1); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!visitorCount) return;
    localStorage.setItem(VISIT_KEY, String(visitorCount));
  }, [visitorCount]);

  useEffect(() => {
    if (visitRecorded.current) return;
    visitRecorded.current = true;
    setClock(new Date());
    const interval = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (markets.length < 2) return undefined;
    const interval = window.setInterval(() => setFeaturedIndex((index) => (index + 1) % Math.min(markets.length, 3)), 10000);
    return () => window.clearInterval(interval);
  }, [markets.length]);

  useEffect(() => { sessionStorage.setItem('ff_bookmarks', JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { sessionStorage.setItem('ff_notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, chatOpen]);

  function showToast(message) {
    setToastMessage(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToastMessage(''), 2500);
  }

  function isSaved(type, id) {
    return bookmarks.some((bookmark) => bookmark.type === type && bookmark.id === id);
  }

  function toggleBookmark(type, id) {
    const saved = isSaved(type, id);
    setBookmarks((current) => saved
      ? current.filter((bookmark) => !(bookmark.type === type && bookmark.id === id))
      : [...current, { type, id, added: new Date().toISOString() }]);
    showToast(saved ? 'Removed from bookmarks' : 'Saved to bookmarks');
  }

  function openNote(type, id) {
    const collection = type === 'market' ? markets : produce;
    const item = collection.find((entry) => entry.id === id);
    setNoteTarget({ type, id, name: item?.name || 'bookmark' });
    setNoteDraft(notes[`${type}:${id}`] || '');
    setModal('notes');
  }

  function saveNote(event) {
    event.preventDefault();
    if (!noteTarget) return;
    setNotes((current) => ({ ...current, [`${noteTarget.type}:${noteTarget.id}`]: noteDraft.trim() }));
    setModal('');
    showToast('Session note saved');
  }

  function shareItem(title, text, hash = window.location.hash) {
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    setShareData({ title, text, url, message: `${title}\n${text}\n${url}` });
    setModal('share');
  }

  async function copyShare() {
    if (!shareData) return;
    try {
      await navigator.clipboard.writeText(shareData.message);
    } catch {
      const field = document.createElement('textarea');
      field.value = shareData.message;
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    showToast('Share text copied to clipboard');
  }

  function exportBookmarks() {
    const content = bookmarks.map((bookmark) => {
      const item = bookmark.type === 'market' ? markets.find((market) => market.id === bookmark.id) : produce.find((entry) => entry.id === bookmark.id);
      if (!item) return '';
      const detail = bookmark.type === 'market' ? item.address : item.season;
      return `${bookmark.type.toUpperCase()}: ${item.name}\n${detail}\nNote: ${notes[`${bookmark.type}:${bookmark.id}`] || '—'}\n`;
    }).filter(Boolean).join('\n');
    const blob = new Blob([`FreshFind Bookmarks\n===================\n\n${content || 'No bookmarks saved.'}`], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'freshfind-bookmarks.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Bookmarks exported');
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setGeoMessage('Geolocation is not supported by this browser.');
      return;
    }
    setGeoMessage('Requesting browser location…');
    navigator.geolocation.getCurrentPosition((position) => {
      const nextLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
      setUserLocation(nextLocation);
      setGeoMessage('Live browser location detected. Nearby and open markets can now be highlighted.');
      showToast('Location detected — proximity sorting is ready');
    }, () => setGeoMessage('Location permission was not granted. You can still use area search.'), { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 });
  }

  function distanceSquared(market) {
    if (!userLocation) return 0;
    return ((market.lat || 24.86) - userLocation.lat) ** 2 + ((market.lng || 67.01) - userLocation.lng) ** 2;
  }

  function searchMarkets(event) {
    event?.preventDefault();
    setDirectoryQuery(headerQuery.trim());
    window.location.hash = '#directory';
  }

  function searchFromHome(event) {
    event.preventDefault();
    window.location.hash = '#directory';
  }

  function submitChat(event, question = chatInput) {
    event?.preventDefault();
    const query = question.trim();
    if (!query) return;
    const match = chatbotRules.find((rule) => rule.keywords.some((keyword) => query.toLowerCase().includes(keyword)));
    const answer = match?.answer || 'I can help with market locations, operating hours, produce, seasons and bookmarks. Try asking “Find a market” or “What produce is available?”';
    const lower = query.toLowerCase();
    const link = lower.includes('market') || lower.includes('find') || lower.includes('location')
      ? { label: 'Market Directory', href: '#directory' }
      : lower.includes('produce') || lower.includes('fruit') || lower.includes('vegetable')
        ? { label: 'Produce Guide', href: '#produce' }
        : null;
    setChatMessages((current) => [...current, { user: true, text: query }, { user: false, text: answer, link }]);
    setChatInput('');
  }

  const timeText = clock.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateText = clock.toLocaleDateString('en-PK', { day: '2-digit', month: 'long', year: 'numeric' });
  const filteredMarkets = [...markets].filter((market) => {
    const queryMatch = !directoryQuery || `${market.name} ${market.area} ${market.produce.join(' ')}`.toLowerCase().includes(directoryQuery.toLowerCase());
    return queryMatch && (!areaFilter || market.area === areaFilter) && (!dayFilter || market.days.includes(dayFilter)) && (!marketProduceFilter || market.produce.includes(marketProduceFilter));
  }).sort((a, b) => marketSort === 'proximity' && userLocation
    ? distanceSquared(a) - distanceSquared(b)
    : marketSort === 'name' ? a.name.localeCompare(b.name) : WEEKDAYS.indexOf(a.nextOpen) - WEEKDAYS.indexOf(b.nextOpen));
  const filteredProduce = produce.filter((item) => {
    const queryMatch = !produceQuery || `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(produceQuery.toLowerCase());
    return queryMatch && (!produceCategory || item.category === produceCategory) && (!produceSeason || item.season === produceSeason);
  });

  const marketForRoute = markets.find((market) => market.id === route.id);
  const produceForRoute = produce.find((item) => item.id === route.id);
  const featuredMarket = markets.length ? markets[featuredIndex % Math.min(markets.length, 3)] : null;
  const nearestMarket = userLocation ? [...markets].sort((a, b) => distanceSquared(a) - distanceSquared(b))[0] : null;
  const nearbyOpenCount = nearestMarket
    ? markets.filter((market) => marketIsOpen(market) && distanceSquared(market) < distanceSquared(nearestMarket) * 4 + 0.01).length
    : 0;
  const renderMarket = (market) => <MarketCard key={market.id} market={market} saved={isSaved('market', market.id)} onBookmark={toggleBookmark} onNote={openNote} />;
  const renderProduce = (item) => <ProduceCard key={item.id} item={item} saved={isSaved('produce', item.id)} onBookmark={toggleBookmark} onShare={shareItem} />;

  function renderMarketDetail(market) {
    const products = market.produce.map((name) => produce.find((item) => item.name === name)).filter(Boolean);
    return <>
      <div className="breadcrumb"><a href="#home">Home</a> / <a href="#directory">Market Directory</a> / {market.name}</div>
      <section className="detail">
        <div className="detail-card">
          <img className="detail-photo" src={market.image || MARKET_FALLBACK_IMAGE} alt={`Fresh produce at ${market.name}`} onError={(event) => { event.currentTarget.src = MARKET_FALLBACK_IMAGE; }} />
          <span className="eyebrow" style={{ marginTop: 20 }}>Market detail</span><h1>{market.name}</h1><p className="meta">{market.description}</p>
          <div className="notice"><span className="ui-icon">◷</span> <strong>Current status:</strong> {marketIsOpen(market) ? 'Open now' : 'Currently closed'}</div>
          <h3>Weekly Schedule</h3><div className="table-wrap"><table className="schedule-table"><thead><tr><th>Day</th><th>Status</th><th>Hours</th></tr></thead><tbody>{WEEKDAYS.map((day) => <tr key={day}><td>{day}</td><td>{market.days.includes(day) ? 'Open' : 'Closed'}</td><td>{market.days.includes(day) ? market.hours : '—'}</td></tr>)}</tbody></table></div>
          <h3>Typical Produce</h3><div className="produce-mini-grid">{products.map((item) => <a className="mini-produce" href={`#produce/${item.id}`} key={item.id}><img src={item.image || MARKET_FALLBACK_IMAGE} alt="" /><span>{item.name}</span></a>)}</div>
          <div className="card-actions"><button className="primary" onClick={() => toggleBookmark('market', market.id)}>{isSaved('market', market.id) ? '★ Saved' : '☆ Bookmark Market'}</button><button className="small-btn" onClick={() => openNote('market', market.id)}>Add session note</button><button className="small-btn" onClick={() => shareItem(market.name, market.description, `#market/${market.id}`)}>Share</button></div>
        </div>
        <aside className="detail-card"><h3>Visit this market</h3><p className="meta">{market.address}</p><p className="meta">{market.days.join(' • ')} · {market.hours}</p><iframe className="map" title={`Map of ${market.name}`} loading="lazy" src={`https://www.google.com/maps?q=${market.lat},${market.lng}&output=embed`} /></aside>
      </section>
    </>;
  }

  function renderProduceDetail(item) {
    const matchingMarkets = item.markets.map((name) => markets.find((market) => market.name === name)).filter(Boolean);
    return <>
      <div className="breadcrumb"><a href="#home">Home</a> / <a href="#produce">Produce Guide</a> / {item.name}</div>
      <section className="detail"><div className="detail-card">
        <img className="detail-photo" src={item.image || MARKET_FALLBACK_IMAGE} alt={item.name} onError={(event) => { event.currentTarget.src = MARKET_FALLBACK_IMAGE; }} />
        <span className="eyebrow" style={{ marginTop: 20 }}>Produce detail</span><h1>{item.name}</h1><p className="meta">{item.description}</p>
        <div className="notice">🌿 <strong>Category:</strong> {item.category} &nbsp; • &nbsp; <strong>Season:</strong> {item.season}</div>
        <h3>Markets where you can usually find it</h3><div className="chips">{matchingMarkets.map((market) => <a className="chip" href={`#market/${market.id}`} key={market.id}>{market.name} →</a>)}</div>
        <div className="card-actions"><button className="primary" onClick={() => toggleBookmark('produce', item.id)}>{isSaved('produce', item.id) ? '★ Saved' : '☆ Bookmark Produce'}</button><button className="small-btn" onClick={() => shareItem(item.name, item.description, `#produce/${item.id}`)}>Share</button><a className="small-btn" href="#produce">Back to Produce Guide</a></div>
      </div><aside className="detail-card"><h3>FreshFind Guide</h3><p className="meta">Explore this item’s category, season and markets where it is usually available.</p></aside></section>
    </>;
  }

  function renderPage() {
    if (route.page === 'market' && marketForRoute) return renderMarketDetail(marketForRoute);
    if (route.page === 'produce' && route.id && produceForRoute) return renderProduceDetail(produceForRoute);
    if (route.page === 'home') {
      const picks = produce.slice(0, 4);
      const openCount = markets.filter((market) => marketIsOpen(market)).length;
      return <>
        <section className="hero"><div className="hero-copy"><span className="eyebrow">Fresh All Along</span><h1>Nature’s Freshness <em>Right to Your Home</em></h1><p>Discover nearby farmers markets, check their schedules, and explore seasonal fruits, vegetables and herbs — all in one simple place.</p>
          <form className="search-box" onSubmit={searchFromHome}><input value={directoryQuery} onChange={(event) => setDirectoryQuery(event.target.value)} placeholder="Search markets, areas, vegetables..." aria-label="Find a market" /><button className="primary">Find a Market →</button></form>
          <div className="hero-stats"><div className="stat"><strong><span className="ui-icon">✦</span> {markets.length}</strong><span>Market Listings</span></div><div className="stat"><strong><span className="ui-icon">◆</span> {produce.length}</strong><span>Produce Guides</span></div><div className="stat"><strong><span className="ui-icon">◷</span> {timeText}</strong><span>Live Local Time</span></div><div className="stat"><strong><span className="ui-icon">●</span> {visitorCount.toLocaleString()}</strong><span>Visits Recorded</span></div></div>
        </div></section>
        <section className="section"><div className="section-head"><div><span className="eyebrow">Featured showcase</span><h2>{featuredMarket?.name || 'Featured Market'}</h2><p>{featuredMarket?.description || 'Discover a nearby farmers market.'}</p></div><a className="text-link" href="#directory">Browse all markets →</a></div><div className="featured-strip">{featuredMarket && renderMarket(featuredMarket)}</div></section>
        <section className="section location-section"><div className="location-card"><div><span className="eyebrow">Right now</span><h2>Nearby Market Status</h2><p className="meta">{userLocation ? `Nearest listed market: ${nearestMarket?.name || 'Not available'}. ${nearbyOpenCount ? `${nearbyOpenCount} nearby market${nearbyOpenCount === 1 ? ' is' : 's are'} open right now.` : 'No nearby listed market is currently open.'}` : `${openCount ? `${openCount} market${openCount === 1 ? ' is' : 's are'} open right now.` : 'No listed market is open right now.'} Allow location to find nearby markets.`}</p></div><button className="primary" onClick={locateUser}>Use My Location</button></div></section>
        <section className="section"><div className="section-head"><div><span className="eyebrow">This week</span><h2>Seasonal Picks</h2><p>Fresh ideas for your next market visit.</p></div><a className="text-link" href="#seasonal">See seasonal produce →</a></div><div className="produce-grid">{picks.map(renderProduce)}</div></section>
      </>;
    }
    if (route.page === 'directory') return <>
      <section className="directory-hero"><span className="eyebrow">Market discovery</span><h1>Market Directory</h1><p className="meta">Browse farmer markets loaded from the project's static JSON dataset.</p><div className="toolbar">
        <input className="control" value={directoryQuery} onChange={(event) => setDirectoryQuery(event.target.value)} placeholder="Search market, area or produce..." />
        <select className="control" value={areaFilter} onChange={(event) => setAreaFilter(event.target.value)}><option value="">All areas</option>{[...new Set(markets.map((market) => market.area))].sort().map((area) => <option key={area}>{area}</option>)}</select>
        <select className="control" value={dayFilter} onChange={(event) => setDayFilter(event.target.value)}><option value="">Any day</option>{WEEKDAYS.map((day) => <option key={day}>{day}</option>)}</select>
        <select className="control" value={marketProduceFilter} onChange={(event) => setMarketProduceFilter(event.target.value)}><option value="">Any produce</option>{[...new Set(produce.map((item) => item.name))].sort().map((name) => <option key={name}>{name}</option>)}</select>
      </div></section>
      <section className="section"><div className="section-head"><div><span className="results-count">{filteredMarkets.length} market{filteredMarkets.length === 1 ? '' : 's'} found</span></div><select className="control" value={marketSort} onChange={(event) => setMarketSort(event.target.value)}><option value="name">Sort alphabetically</option><option value="proximity">Sort by proximity</option><option value="next">Sort by next open day</option></select></div><div className="cards">{filteredMarkets.length ? filteredMarkets.map(renderMarket) : <div className="empty">No markets match these filters. Try another area, day or produce item.</div>}</div></section>
    </>;
    if (route.page === 'seasonal') {
      const picks = produce.filter((item) => item.season.toLowerCase() !== 'year-round');
      return <><section className="page-banner"><span className="eyebrow">Seasonal discovery</span><h1>Seasonal Recommendations</h1><p className="meta">Explore recommended fresh produce and discover markets where you can usually find it.</p></section><section className="section"><div className="section-head"><div><span className="eyebrow">Fresh this week</span><h2>Recommended Seasonal Produce</h2><p>Plan your market visit around fresh, seasonal choices.</p></div><a className="text-link" href="#directory">Find a Market →</a></div><div className="produce-grid">{(picks.length ? picks : produce).map(renderProduce)}</div></section></>;
    }
    if (route.page === 'produce') return <><section className="page-banner"><span className="eyebrow">Fresh produce library</span><h1>Produce Guide</h1><p className="meta">Browse fruits, vegetables, herbs and other produce, then check seasons and related markets.</p><div className="toolbar"><input className="control" value={produceQuery} onChange={(event) => setProduceQuery(event.target.value)} placeholder="Search produce..." /><select className="control" value={produceCategory} onChange={(event) => setProduceCategory(event.target.value)}><option value="">All Categories</option>{[...new Set([...CATEGORIES, ...produce.map((item) => item.category)])].map((category) => <option key={category}>{category}</option>)}</select><select className="control" value={produceSeason} onChange={(event) => setProduceSeason(event.target.value)}><option value="">All Seasons</option>{[...new Set(produce.map((item) => item.season))].sort().map((season) => <option key={season}>{season}</option>)}</select></div><div className="category-chips">{CATEGORIES.map((category) => <button className="category-filter" type="button" key={category} onClick={() => setProduceCategory(category)}>{category}</button>)}</div></section><section className="section"><div className="produce-grid">{filteredProduce.length ? filteredProduce.map(renderProduce) : <div className="empty">No produce found for this filter.</div>}</div></section></>;
    if (route.page === 'bookmarks') {
      const savedItems = bookmarks.map((bookmark) => ({ ...bookmark, item: bookmark.type === 'market' ? markets.find((market) => market.id === bookmark.id) : produce.find((item) => item.id === bookmark.id) })).filter((entry) => entry.item);
      return <><section className="page-banner"><span className="eyebrow">Your saved picks</span><h1>Bookmarks</h1><p className="meta">Favorites and notes are stored in this browser session only. Nothing is sent to a server.</p><div className="card-actions"><button className="primary" onClick={exportBookmarks}>Export Bookmarks</button><button className="small-btn" onClick={() => shareItem('My FreshFind picks', 'I saved fresh market and produce recommendations in FreshFind.')}>Share Recommendations</button></div></section><section className="section">{savedItems.length ? <div className="bookmarks-grid">{savedItems.map(({ type, id, item }) => <div className="bookmark-row" key={`${type}:${id}`}><img src={item.image || MARKET_FALLBACK_IMAGE} alt={item.name} /><div style={{ flex: 1 }}><strong>{item.name}</strong><div className="meta">{type === 'market' ? item.area : item.category}</div><div className="meta">{notes[`${type}:${id}`] || 'No note added yet.'}</div></div><button className="small-btn" onClick={() => openNote(type, id)}>Note</button><button className="heart saved" onClick={() => toggleBookmark(type, id)} aria-label={`Remove ${item.name} from bookmarks`}>★</button></div>)}</div> : <div className="empty"><h3>No bookmarks yet</h3><p>Use the star button on a market or produce card to save it here.</p><a className="primary" href="#directory">Explore markets</a></div>}</section></>;
    }
    if (route.page === 'about') return <><section className="page-banner"><span className="eyebrow">About the platform</span><h1>FreshFind</h1><p className="meta">A responsive portal designed to help residents discover nearby farmers markets, understand schedules and explore seasonal produce.</p><div className="about-stats"><div className="about-stat"><strong><span className="ui-icon">●</span> {visitorCount.toLocaleString()}</strong><span>Visits Recorded</span></div><div className="about-stat"><strong><span className="ui-icon">◷</span> {timeText}</strong><span>Real-Time Local Clock</span></div></div><p className="meta">{dateText}</p></section><section className="section"><div className="feature-grid"><div className="feature-card"><div className="feature-icon">●</div><h3>Market Discovery</h3><p>Find farmers markets by area, day and produce type, with hours and location information.</p></div><div className="feature-card"><div className="feature-icon">◆</div><h3>Seasonal Produce</h3><p>Browse produce by category and season, and see where each item is usually available.</p></div><div className="feature-card"><div className="feature-icon">✦</div><h3>FreshFind Guide</h3><p>Get quick answers to common questions about markets, produce and operating hours.</p></div><div className="feature-card"><div className="feature-icon">▣</div><h3>Responsive Experience</h3><p>Use FreshFind on desktop, tablet or mobile with accessible navigation and clear controls.</p></div></div></section></>;
    if (route.page === 'contact') return <><section className="page-banner"><span className="eyebrow">Get in touch</span><h1>Contact Us</h1><p className="meta">Static contact information and a map are provided for the project demo.</p></section><section className="section"><div className="contact-grid"><div className="contact-card"><h2>FreshFind Team</h2><div className="contact-item"><strong>📧 Email</strong><br /><span className="meta">muhammadahmer881@gmail.com</span></div><div className="contact-item"><strong>☎ Phone</strong><br /><span className="meta">03122514038</span></div><div className="contact-item"><strong>Location</strong><br /><span className="meta">Shahrah-e-Faisal, Karachi</span></div><button className="primary" style={{ marginTop: 18 }} onClick={locateUser}>Use My Location</button><p className="meta" style={{ marginTop: 12 }}>{geoMessage}</p></div><iframe className="map" title="FreshFind contact location map" src={userLocation ? `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&output=embed` : 'https://www.google.com/maps?q=Shahrah-e-Faisal,Karachi&output=embed'} loading="lazy" /></div></section></>;
    return null;
  }

  return <>
    <a className="skip-link" href="#app">Skip to main content</a>
    <div className={`toast${toastMessage ? ' show' : ''}`} role="status">{toastMessage}</div>
    <header className="site-header">
      <a className="brand" href="#home" aria-label="FreshFind Home"><span className="brand-mark" aria-hidden="true">🌿</span><span><strong>FreshFind</strong><small>Freshness at Your Doorstep</small></span></a>
      <button className="menu-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Toggle menu"><span aria-hidden="true">☰</span></button>
      <nav className={mobileMenuOpen ? 'open' : ''} aria-label="Main navigation">{NAV_ITEMS.map(([page, label]) => <a href={`#${page}`} className={route.page === page || (route.page === 'market' && page === 'directory') ? 'active' : ''} key={page}>{label}</a>)}</nav>
      <div className="header-actions"><form className="nav-search" onSubmit={searchMarkets}><input value={headerQuery} onChange={(event) => setHeaderQuery(event.target.value)} type="search" placeholder="Search market..." aria-label="Search markets" /><button title="Search" aria-label="Search"><span className="ff-search-icon" aria-hidden="true" /></button></form><button className="signup-btn" onClick={() => setModal('signup')}>Sign up</button><button className="login-btn" onClick={() => setModal('login')}>Log in</button></div>
    </header>

    <main id="app">{renderPage()}</main>

    <footer className="footer"><div><Brand footer /><p>Discover local markets, seasonal produce and fresh possibilities.</p></div><div><h4>Explore</h4><a href="#directory">Markets</a><a href="#seasonal">Seasonal Recommendations</a><a href="#produce">Produce Guide</a><a href="#bookmarks">Bookmarks</a></div><div><h4>Project</h4><a href="#about">About</a><a href="#contact">Contact</a><span className="footer-note">FreshFind • Karachi farmers market discovery • Seasonal produce guide.</span></div></footer>

    <div className="chatbot"><button className="chat-launcher" onClick={() => setChatOpen((open) => !open)} aria-label="Open FreshFind Guide"><span className="ff-chat-icon" aria-hidden="true" /></button><section className={`chat-panel${chatOpen ? ' open' : ''}`} aria-label="FreshFind Guide"><div className="chat-head"><div><strong>FreshFind Guide</strong><small>Quick answers • Offline rules</small></div><button onClick={() => setChatOpen(false)} aria-label="Close chat">×</button></div><div className="chat-messages">{chatMessages.map((message, index) => <div className={message.user ? 'user-msg' : 'bot-msg'} key={`${index}-${message.text}`}>{message.text}{message.link && <> Open <a href={message.link.href}>{message.link.label}</a>.</>}</div>)}<div ref={chatEndRef} /></div><div className="quick-replies"><button onClick={() => submitChat(null, 'Find a market')}>Find a market</button><button onClick={() => submitChat(null, 'What produce is available?')}>Produce</button><button onClick={() => submitChat(null, 'What are the market hours?')}>Hours</button></div><form onSubmit={submitChat}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} autoComplete="off" placeholder="Type your question..." /><button>Send</button></form></section></div>

    {modal && <div className="modal open" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(''); }}><div className="modal-card"><button className="modal-close" onClick={() => setModal('')} aria-label="Close">×</button>
      {modal === 'notes' && <form onSubmit={saveNote}><span className="eyebrow">Session note</span><h2>Note for {noteTarget?.name}</h2><textarea rows="6" value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Write a reminder for this bookmark..." /><button className="primary full">Save Note</button></form>}
      {modal === 'signup' && <><span className="eyebrow">Demo account</span><h2>Create a FreshFind Demo Account</h2><p>This signup is for demonstration only. No credentials are stored.</p><form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); if (data.get('password') !== data.get('confirm')) { showToast('Passwords do not match'); return; } event.currentTarget.reset(); setModal(''); showToast('Account created successfully'); }}><input name="name" required placeholder="Full name" /><input name="email" required type="email" placeholder="Email" /><input name="password" required type="password" minLength="6" placeholder="Password" /><input name="confirm" required type="password" minLength="6" placeholder="Confirm password" /><label className="check-row"><input required type="checkbox" /> I agree to the demo account terms.</label><button className="primary full">Create Account</button></form></>}
      {modal === 'login' && <><span className="eyebrow">Demo account</span><h2>Welcome to FreshFind</h2><p>This is a dummy login interface. No credentials are stored.</p><form onSubmit={(event) => { event.preventDefault(); setModal(''); showToast('Demo login successful'); }}><input required type="email" placeholder="Email" /><input required type="password" placeholder="Password" /><button className="primary full">Continue</button></form></>}
      {modal === 'share' && shareData && <><span className="eyebrow">Share FreshFind</span><h2>Share: {shareData.title}</h2><div className="share-preview">{shareData.message}</div><div className="share-options"><button className="share-option" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareData.message)}`, '_blank', 'noopener,noreferrer')}>WhatsApp</button><button className="share-option" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank', 'noopener,noreferrer')}>Facebook</button><button className="share-option" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareData.title}\n${shareData.text}`)}&url=${encodeURIComponent(shareData.url)}`, '_blank', 'noopener,noreferrer')}>X / Twitter</button><a className="share-option" href={`mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.message)}`}>Email</a><button className="share-option share-copy" onClick={copyShare}>Copy Link &amp; Text</button></div></>}
    </div></div>}
  </>;
}

export default App;