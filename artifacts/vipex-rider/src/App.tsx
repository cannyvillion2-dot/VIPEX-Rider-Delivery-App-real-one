import { type ChangeEvent, type ReactNode, useEffect, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import {
  ArrowLeft, ArrowRight, Bike, Bell, Box, Check, ChevronRight, CircleHelp,
  Clock3, Crosshair, Download, House, LockKeyhole, LogIn, LogOut, MapPin,
  Menu, Navigation, Phone, Plus, Radio, ShieldCheck, Signal, Star, UserRound,
  WalletCards, X, Zap,
} from 'lucide-react';

type Notice = { tone: 'dark' | 'yellow' | 'green'; text: string } | null;

const logo = '/vipex-logo.jpeg';

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={`brand-mark ${compact ? 'brand-mark-compact' : ''}`} data-testid="link-brand-home">
      <img src={logo} alt="VIPEX Parcel Delivery" data-testid="img-vipex-logo" />
      {!compact && <span>RIDER</span>}
    </Link>
  );
}

function useNotice() {
  const [notice, setNotice] = useState<Notice>(null);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);
  return { notice, setNotice };
}

function NoticeBanner({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  if (!notice) return null;
  return (
    <div className={`notice-banner notice-${notice.tone} slide-in`} role="status" data-testid="status-feedback">
      <span>{notice.text}</span>
      <button onClick={onClose} aria-label="Dismiss notification" data-testid="button-dismiss-feedback"><X size={16} /></button>
    </div>
  );
}

function BottomNav({ path }: { path: string }) {
  const items = [
    { href: '/', label: 'Home', icon: House },
    { href: '/analytics', label: 'Analytics', icon: Signal },
    { href: '/profile', label: 'Profile', icon: UserRound },
  ];
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? path === '/' : path.startsWith(href);
        return (
          <Link key={href} href={href} className={`nav-item ${active ? 'nav-item-active' : ''}`} data-testid={`link-nav-${label.toLowerCase()}`}>
            <Icon size={20} strokeWidth={active ? 2.7 : 1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function AppFrame({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { notice, setNotice } = useNotice();
  return (
    <div className="screen-shell">
      <NoticeBanner notice={notice} onClose={() => setNotice(null)} />
      <main className="app-main">{children}</main>
      <BottomNav path={location} />
    </div>
  );
}

function TopBar({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: React.ReactNode }) {
  return (
    <header className="topbar">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  );
}

function StatusSwitch({ online, onChange }: { online: boolean; onChange: () => void }) {
  return (
    <button className={`status-switch ${online ? 'is-online' : ''}`} onClick={onChange} data-testid="button-toggle-online">
      <span className="status-dot" />
      <span>{online ? 'Online' : 'Offline'}</span>
      <span className="switch-track"><span /></span>
    </button>
  );
}

function MapCard() {
  return (
    <div className="map-card" data-testid="card-live-route">
      <div className="map-grid" />
      <div className="map-road road-one" />
      <div className="map-road road-two" />
      <div className="map-road road-three" />
      <div className="map-road road-four" />
      <div className="route-line" />
      <div className="map-pin pickup"><span><Box size={14} /></span><b>Pickup</b></div>
      <div className="map-pin dropoff"><span><MapPin size={14} /></span><b>Drop-off</b></div>
      <div className="rider-location"><span><Bike size={15} /></span></div>
      <div className="map-label"><Crosshair size={14} /> LIVE ROUTE</div>
      <div className="distance-chip"><Navigation size={13} /> 3.8 km left</div>
    </div>
  );
}

function Home() {
  const [online, setOnline] = useState(true);
  const [delivered, setDelivered] = useState(false);
  const { notice, setNotice } = useNotice();
  const [showAssignment, setShowAssignment] = useState(false);

  const toggleOnline = () => {
    setOnline((value) => !value);
    setNotice({ tone: online ? 'dark' : 'green', text: online ? 'You are now offline.' : 'You are live and ready for orders.' });
  };

  return (
    <div className="page-content">
      <NoticeBanner notice={notice} onClose={() => setNotice(null)} />
      <div className="home-head fade-up">
        <div className="rider-greeting">
          <div className="avatar avatar-yellow">KA</div>
          <div><div className="eyebrow">TUESDAY, 18 JUNE</div><h1>Good morning, Kwame</h1></div>
        </div>
        <button className="icon-button" aria-label="Notifications" onClick={() => setNotice({ tone: 'yellow', text: 'No new notifications.' })} data-testid="button-notifications"><Bell size={20} /></button>
      </div>
      <div className="online-row fade-up delay-1">
        <StatusSwitch online={online} onChange={toggleOnline} />
        <span className="small-muted">{online ? 'Taking deliveries in Accra' : 'Go online to receive jobs'}</span>
      </div>

      <section className="earnings-strip fade-up delay-1" data-testid="card-today-earnings">
        <div><span className="section-kicker">TODAY'S EARNINGS</span><strong>GH₵ 186.50</strong></div>
        <div className="strip-divider" />
        <div><span className="section-kicker">DELIVERIES</span><strong>06 <small>/ 10</small></strong></div>
        <div className="trend"><ArrowRight size={16} /></div>
      </section>

      <section className="section-block fade-up delay-2">
        <div className="section-heading"><div><span className="section-kicker">ACTIVE RUN</span><h2>{delivered ? 'Run completed' : 'Order #VP-4821'}</h2></div><span className={`live-pill ${delivered ? 'complete-pill' : ''}`}><span />{delivered ? 'DONE' : 'IN TRANSIT'}</span></div>
        {!delivered ? (
          <>
            <MapCard />
            <div className="delivery-route">
              <div className="route-stop"><span className="stop-marker marker-pickup"><Box size={14} /></span><div><span className="stop-label">PICK UP</span><strong>VIPEX Hub · Osu</strong></div><span className="route-time">09:40</span></div>
              <div className="route-connector"><span /></div>
              <div className="route-stop"><span className="stop-marker marker-drop"><MapPin size={14} /></span><div><span className="stop-label">DELIVER TO</span><strong>12 Nii Nortei Nyanchi St.</strong></div><span className="route-time">10:05</span></div>
            </div>
            <div className="action-row">
              <button className="btn btn-primary pressable" onClick={() => { setDelivered(true); setNotice({ tone: 'green', text: 'Order #VP-4821 marked as delivered.' }); }} data-testid="button-mark-delivered"><Check size={17} /> Mark delivered</button>
              <button className="btn btn-icon-secondary pressable" aria-label="Get support" onClick={() => setNotice({ tone: 'yellow', text: 'Support is on the way. Call centre: 030 255 0190.' })} data-testid="button-support"><CircleHelp size={19} /></button>
            </div>
          </>
        ) : (
          <div className="completed-state"><div className="completed-icon"><Check size={28} /></div><strong>Nice run, Kwame.</strong><p>GH₵ 32.00 added to today's earnings.</p><button className="btn btn-dark pressable" onClick={() => setShowAssignment(true)} data-testid="button-new-assignment"><Plus size={17} /> Find next assignment</button></div>
        )}
      </section>

      <section className="section-block quick-actions fade-up delay-3">
        <div className="section-heading"><div><span className="section-kicker">ON THE ROAD</span><h2>Quick actions</h2></div></div>
        <div className="quick-grid">
          <button className="quick-card pressable" onClick={() => setShowAssignment(true)} data-testid="button-quick-assignment"><span className="quick-icon yellow-icon"><Zap size={19} /></span><strong>New assignment</strong><small>See nearby jobs</small></button>
          <button className="quick-card pressable" onClick={() => setNotice({ tone: 'yellow', text: 'Your delivery history is up to date.' })} data-testid="button-delivery-history"><span className="quick-icon charcoal-icon"><Clock3 size={19} /></span><strong>Delivery history</strong><small>Last 30 days</small></button>
        </div>
      </section>

      {showAssignment && <AssignmentSheet onClose={() => setShowAssignment(false)} onAccept={() => { setShowAssignment(false); setNotice({ tone: 'green', text: 'New assignment accepted.' }); }} />}
    </div>
  );
}

function AssignmentSheet({ onClose, onAccept }: { onClose: () => void; onAccept: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet slide-in" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" data-testid="dialog-new-assignment">
        <div className="sheet-handle" /><div className="sheet-heading"><div><span className="section-kicker">AVAILABLE NOW</span><h2>One nearby job</h2></div><button className="icon-button" onClick={onClose} aria-label="Close assignment" data-testid="button-close-assignment"><X size={19} /></button></div>
        <div className="assignment-offer"><div className="offer-top"><span className="offer-tag">FAST TURNAROUND</span><strong>GH₵ 28.50</strong></div><h3>Airport Residential → Cantonments</h3><div className="offer-meta"><span><MapPin size={14} /> 4.2 km</span><span><Clock3 size={14} /> 26 min</span><span><Box size={14} /> Small parcel</span></div></div>
        <button className="btn btn-primary btn-full pressable" onClick={onAccept} data-testid="button-accept-assignment">Accept assignment <ArrowRight size={17} /></button>
      </div>
    </div>
  );
}

function Analytics() {
  const { notice, setNotice } = useNotice();
  return (
    <div className="page-content">
      <NoticeBanner notice={notice} onClose={() => setNotice(null)} />
      <TopBar title="Your numbers" eyebrow="PERFORMANCE / JUNE" action={<button className="icon-button" aria-label="Download report" onClick={() => setNotice({ tone: 'yellow', text: 'Your June report is being prepared.' })} data-testid="button-download-report"><Download size={19} /></button>} />
      <section className="hero-stat fade-up" data-testid="card-total-earnings"><span className="section-kicker">JUNE EARNINGS</span><strong>GH₵ 2,486.50</strong><span className="positive-change"><ArrowRight size={14} /> 12.4% from May</span><div className="bar-chart">{[42,58,48,70,55,78,66,89,73,96,82,100].map((height, index) => <span key={index} style={{ height: `${height}%` }} className={index === 11 ? 'bar-current' : ''} />)}</div><div className="chart-labels"><span>01 Jun</span><span>Today</span></div></section>
      <div className="metric-grid fade-up delay-1">
        <div className="metric-card"><span className="metric-icon"><Box size={17} /></span><strong>74</strong><span>Deliveries</span><small>+8 this week</small></div>
        <div className="metric-card"><span className="metric-icon star-icon"><Star size={17} fill="currentColor" /></span><strong>4.92</strong><span>Rating</span><small>Top 10% of riders</small></div>
      </div>
      <section className="section-block fade-up delay-2"><div className="section-heading"><div><span className="section-kicker">THIS WEEK</span><h2>Delivery rhythm</h2></div><button className="text-button" onClick={() => setNotice({ tone: 'yellow', text: 'Showing the current week.' })} data-testid="button-change-period">This week <ChevronRight size={15} /></button></div><div className="week-list">{[['Mon','14','GH₵ 198.00','8'],['Tue','15','GH₵ 245.50','11'],['Wed','16','GH₵ 176.00','6'],['Thu','17','GH₵ 221.00','9'],['Fri','18','GH₵ 186.50','6']].map(([day,date,amount,count]) => <div className="week-row" key={day}><div className="day-cell"><strong>{day}</strong><span>{date} Jun</span></div><div className="week-bar"><span style={{ width: `${Number(count) * 8}%` }} /></div><div className="week-amount"><strong>{amount}</strong><span>{count} jobs</span></div></div>)}</div></section>
      <section className="insight-card fade-up delay-3"><div className="insight-icon"><Zap size={18} /></div><div><span className="section-kicker">RIDER INSIGHT</span><p>Late mornings are your strongest window. You average <strong>GH₵ 31 more</strong> between 9 and 11 AM.</p></div></section>
    </div>
  );
}

function Profile() {
  const [online, setOnline] = useState(true);
  const { notice, setNotice } = useNotice();
  const [, setLocation] = useLocation();
  return (
    <div className="page-content">
      <NoticeBanner notice={notice} onClose={() => setNotice(null)} />
      <TopBar title="Your profile" eyebrow="RIDER ACCOUNT" action={<button className="icon-button" aria-label="More options" onClick={() => setNotice({ tone: 'yellow', text: 'Profile options are up to date.' })} data-testid="button-profile-options"><Menu size={20} /></button>} />
      <section className="profile-hero fade-up"><div className="avatar avatar-large">KA</div><div><h2>Kwame Asante</h2><p>VIPEX rider since March 2024</p><span className="verified"><ShieldCheck size={14} /> Verified rider</span></div></section>
      <section className="profile-status-card fade-up delay-1"><div><span className="section-kicker">AVAILABILITY</span><h3>{online ? 'Ready for the road' : 'Taking a break'}</h3><p>{online ? 'Customers can see you nearby.' : 'You will not receive new assignments.'}</p></div><StatusSwitch online={online} onChange={() => { setOnline((value) => !value); setNotice({ tone: online ? 'dark' : 'green', text: online ? 'You are now offline.' : 'You are back online.' }); }} /></section>
      <section className="detail-card fade-up delay-2"><div className="detail-row"><span className="detail-label"><Phone size={17} /> Phone</span><strong>+233 24 781 3092</strong></div><div className="detail-row"><span className="detail-label"><Bike size={17} /> Vehicle</span><strong>Honda Wave · AS 4821-23</strong></div><div className="detail-row"><span className="detail-label"><MapPin size={17} /> Base zone</span><strong>Osu, Accra</strong></div></section>
      <section className="profile-links fade-up delay-3"><button className="profile-link" onClick={() => setLocation('/subscription')} data-testid="button-manage-subscription"><span className="link-leading yellow-icon"><WalletCards size={18} /></span><span><strong>Rider activation</strong><small>Active until 30 Jun 2024</small></span><ChevronRight size={17} /></button><button className="profile-link" onClick={() => setNotice({ tone: 'yellow', text: 'Help centre is available 07:00–22:00.' })} data-testid="button-help-centre"><span className="link-leading charcoal-icon"><CircleHelp size={18} /></span><span><strong>Help centre</strong><small>Get help from VIPEX support</small></span><ChevronRight size={17} /></button></section>
      <button className="logout-button pressable" onClick={() => setLocation('/login')} data-testid="button-logout"><LogOut size={17} /> Log out</button>
      <div className="profile-brand"><BrandMark compact /><span>v1.0.4 · Built for the road</span></div>
    </div>
  );
}

function AuthLayout({ children, eyebrow, title, back = false }: { children: ReactNode; eyebrow: string; title: ReactNode; back?: boolean }) {
  const [, setLocation] = useLocation();
  return <div className="auth-page"><div className="auth-top">{back ? <button className="icon-button" onClick={() => setLocation('/login')} aria-label="Back to login" data-testid="button-back-login"><ArrowLeft size={19} /></button> : <span /> }<BrandMark /><span className="auth-help"><CircleHelp size={17} /></span></div><div className="auth-content"><span className="section-kicker">{eyebrow}</span><h1>{title}</h1>{children}</div><div className="auth-footer">VIPEX PARCEL DELIVERY <span>·</span> ACCRA</div></div>;
}

function Login() {
  const [, setLocation] = useLocation();
  const { notice, setNotice } = useNotice();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  return <AuthLayout eyebrow="RIDER PORTAL" title={<>Back on the<br /><em>road.</em></>}><NoticeBanner notice={notice} onClose={() => setNotice(null)} /><p className="auth-intro">Sign in to manage your deliveries, earnings, and route.</p><form className="auth-form" onSubmit={(event) => { event.preventDefault(); if (!phone || !password) { setNotice({ tone: 'yellow', text: 'Enter your phone number and password.' }); return; } setLocation('/'); }}><label>Phone number<div className="input-wrap"><Phone size={17} /><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+233 24 000 0000" type="tel" data-testid="input-login-phone" /></div></label><label>Password<div className="input-wrap"><LockKeyhole size={17} /><input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" type="password" data-testid="input-login-password" /></div></label><button className="text-button forgot" type="button" onClick={() => setNotice({ tone: 'yellow', text: 'We will send a reset link to your phone.' })} data-testid="button-forgot-password">Forgot password?</button><button className="btn btn-primary btn-full pressable" type="submit" data-testid="button-login">Log in <LogIn size={17} /></button></form><div className="auth-switch">New to VIPEX? <Link href="/signup" data-testid="link-signup">Create rider account <ArrowRight size={15} /></Link></div></AuthLayout>;
}

function Signup() {
  const [, setLocation] = useLocation();
  const { notice, setNotice } = useNotice();
  const [form, setForm] = useState({ name: '', phone: '', city: '', password: '' });
  const update = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: event.target.value });
  return <AuthLayout back eyebrow="JOIN THE FLEET" title={<>Make a living<br /><em>moving.</em></>}><NoticeBanner notice={notice} onClose={() => setNotice(null)} /><p className="auth-intro">Create your rider account. It takes less than two minutes.</p><form className="auth-form signup-form" onSubmit={(event) => { event.preventDefault(); if (Object.values(form).some((value) => !value)) { setNotice({ tone: 'yellow', text: 'Complete all fields to continue.' }); return; } setLocation('/pending'); }}><label>Full name<input value={form.name} onChange={update('name')} placeholder="Kwame Asante" data-testid="input-signup-name" /></label><label>Phone number<input value={form.phone} onChange={update('phone')} placeholder="+233 24 000 0000" type="tel" data-testid="input-signup-phone" /></label><div className="form-split"><label>Base city<input value={form.city} onChange={update('city')} placeholder="Accra" data-testid="input-signup-city" /></label><label>Password<input value={form.password} onChange={update('password')} placeholder="8+ characters" type="password" data-testid="input-signup-password" /></label></div><button className="btn btn-primary btn-full pressable" type="submit" data-testid="button-create-account">Submit application <ArrowRight size={17} /></button></form><div className="auth-switch">Already a rider? <Link href="/login" data-testid="link-login">Log in <ArrowRight size={15} /></Link></div></AuthLayout>;
}

function Pending() {
  const [, setLocation] = useLocation();
  return <div className="state-page"><BrandMark /><div className="state-visual pending-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="state-icon"><Clock3 size={33} /></div></div><span className="section-kicker">APPLICATION RECEIVED</span><h1>We’re checking<br /><em>your details.</em></h1><p>Our team is reviewing your rider application. We’ll send a text when you’re cleared to ride.</p><div className="progress-steps"><div className="progress-step done"><span><Check size={13} /></span><div><strong>Application submitted</strong><small>Just now</small></div></div><div className="progress-line" /><div className="progress-step"><span>2</span><div><strong>Team review</strong><small>Usually within 24 hours</small></div></div><div className="progress-line" /><div className="progress-step"><span>3</span><div><strong>Start delivering</strong><small>Activate your rider plan</small></div></div></div><button className="btn btn-dark btn-full pressable" onClick={() => setLocation('/subscription')} data-testid="button-view-activation">View activation plan <ArrowRight size={17} /></button><button className="ghost-link" onClick={() => setLocation('/login')} data-testid="button-pending-login">Back to sign in</button></div>;
}

function Subscription() {
  const [, setLocation] = useLocation();
  const { notice, setNotice } = useNotice();
  const [activated, setActivated] = useState(false);
  return <div className="subscription-page"><div className="auth-top"><button className="icon-button" onClick={() => setLocation('/')} aria-label="Back home" data-testid="button-back-home"><ArrowLeft size={19} /></button><BrandMark /><span className="auth-help"><CircleHelp size={17} /></span></div><div className="subscription-copy"><span className="section-kicker">RIDER ACTIVATION</span><h1>Get your<br /><em>wheels moving.</em></h1><p>One simple plan. Everything you need to earn with VIPEX.</p></div><NoticeBanner notice={notice} onClose={() => setNotice(null)} /><section className="plan-card fade-up"><div className="plan-top"><span className="offer-tag">MOST POPULAR</span><div className="plan-price"><small>GH₵</small><strong>20</strong><span>/ month</span></div></div><h2>VIPEX Rider plan</h2><p>Unlock your rider account and start receiving paid delivery assignments across Accra.</p><div className="plan-features"><span><Check size={15} /> Access to nearby assignments</span><span><Check size={15} /> In-app earnings tracking</span><span><Check size={15} /> Rider support on every route</span></div><button className={`btn ${activated ? 'btn-success' : 'btn-primary'} btn-full pressable`} onClick={() => { setActivated(true); setNotice({ tone: 'green', text: 'Activation complete. Welcome to the VIPEX fleet.' }); }} disabled={activated} data-testid="button-activate-plan">{activated ? <><Check size={17} /> Plan active</> : <>Activate for GH₵ 20 <ArrowRight size={17} /></>}</button></section><div className="payment-note"><LockKeyhole size={14} /> Secure mobile money payment <span>·</span> MTN, Vodafone, AirtelTigo</div><button className="ghost-link" onClick={() => setLocation('/')} data-testid="button-skip-subscription">I’ll do this later</button></div>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/analytics" component={Analytics} /><Route path="/profile" component={Profile} /><Route path="/login" component={Login} /><Route path="/signup" component={Signup} /><Route path="/pending" component={Pending} /><Route path="/subscription" component={Subscription} /><Route><div className="state-page"><BrandMark /><h1>Page not found.</h1><Link href="/" className="btn btn-dark" data-testid="link-not-found-home">Back home</Link></div></Route></Switch>;
}

export default function App() {
  const [location] = useLocation();
  const authRoute = ['/login', '/signup', '/pending', '/subscription'].includes(location);
  return authRoute ? <Router /> : <AppFrame><Router /></AppFrame>;
}