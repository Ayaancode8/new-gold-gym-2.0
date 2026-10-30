"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useDragControls, useIsPresent, useMotionValue, useReducedMotion } from "motion/react";
import { contact, destinations, formatPrice, memberships, photos, reviews, whatsappUrl, type Destination, type Membership, type MemberReview, type PhotoId } from "@/data/gym";
import { motionTokens, springs } from "@/lib/motion";
import styles from "./public-website.module.css";

type Overlay = { type: "contact" } | { type: "plan"; plan: Membership } | { type: "photo"; photoId: PhotoId };
type Section = Destination | "about" | "contact";

function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => { window.removeEventListener("hashchange", callback); window.removeEventListener("popstate", callback); };
}
function getHash() { return window.location.hash.slice(1); }
function subscribeDesktop(callback: () => void) {
  const query = window.matchMedia("(min-width: 1024px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function getDesktop() { return window.matchMedia("(min-width: 1024px)").matches; }
function serverHash() { return ""; }
function serverDesktop() { return false; }

function Icon({ name, className = "" }: { name: Destination | "chat"; className?: string }) {
  const mask = `url(/icons/${name}.svg)`;
  return <span aria-hidden="true" className={`${styles.icon} ${className}`} style={{ maskImage: mask, WebkitMaskImage: mask }} />;
}

function Arrow() {
  return <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

function CloseIcon() {
  return <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m6 6 12 12M6 18 18 6" /></svg>;
}

function Brand({ desktop = false }: { desktop?: boolean }) {
  return <Image quality={90} src="/brand/logo.svg" alt="New Gold Gym 2.0" width={desktop ? 184 : 156} height={desktop ? 56 : 48} priority className={styles.brand} />;
}

function Price({ plan, className = "" }: { plan: Membership; className?: string }) {
  return <span className={`${styles.price} ${className}`}><span className={styles.currency}>PKR</span> <span className={styles.amount}>{formatPrice(plan.monthlyPrice)}</span> <span className={styles.perMonth}>/ month</span></span>;
}

function Rating({ value }: { value: number }) {
  return <div className={styles.rating}><span className={styles.stars} role="img" aria-label={`${value} out of 5 stars`}>{Array.from({ length: 5 }, (_, i) => <svg key={i} aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" className={i < value ? styles.starFilled : styles.starEmpty}><path fill="currentColor" d="m12 2.5 2.8 6.1 6.7.8-5 4.6 1.4 6.6-5.9-3.3-5.9 3.3 1.4-6.6-5-4.6 6.7-.8Z" /></svg>)}</span><span aria-hidden="true">{value}/5</span></div>;
}

function Review({ review, compact = false }: { review: MemberReview; compact?: boolean }) {
  return <article className={`${styles.reviewCard} ${compact ? styles.ratingOnly : ""}`} aria-label={`Review by ${review.name}`}><Rating value={review.rating} /><p className={styles.reviewQuote}>{review.quote ?? "Rating only."}</p><p className={styles.reviewAuthor}>{review.name}</p></article>;
}

function WhatsAppLink({ plan, className = "" }: { plan?: Membership; className?: string }) {
  return <a href={whatsappUrl(plan)} target="_blank" rel="noopener noreferrer" className={`${styles.primaryButton} ${className}`}>Enquire on WhatsApp<Arrow /></a>;
}

function MobilePane({ destination, children }: { destination: Destination; children: ReactNode }) {
  const present = useIsPresent();
  const reduce = useReducedMotion();
  return <motion.section data-mobile-pane={destination} className={styles.mobilePane} aria-labelledby={`title-${destination}`} aria-hidden={!present} inert={!present} style={{ position: present ? "relative" : "absolute", top: 0, width: "100%" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : motionTokens.tabFade }}>{children}</motion.section>;
}

function MobileIntro({ destination, title, subtitle }: { destination: Destination; title: string; subtitle: string }) {
  return <div className={styles.mobileIntro}><h1 id={`title-${destination}`} tabIndex={-1} className={styles.mobileHeading}>{title}</h1><p className={styles.mobileSubtitle}>{subtitle}</p></div>;
}

export function PublicWebsite() {
  const hash = useSyncExternalStore(subscribeHash, getHash, serverHash);
  const desktop = useSyncExternalStore(subscribeDesktop, getDesktop, serverDesktop);
  const destination: Destination = destinations.find(item => item.id === hash)?.id ?? "discover";
  const [overlay, setOverlay] = useState<Overlay | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (desktop && hash && hash !== "discover") {
        const section = document.getElementById(hash || "discover");
        if (section) section.scrollIntoView({ behavior: "instant" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, desktop]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, section: Section) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setOverlay(null);
    if (window.location.hash !== `#${section}`) {
      window.history.pushState(null, "", `#${section}`);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else if (desktop && section !== "discover") {
      document.getElementById(section)?.scrollIntoView({ behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    if (!desktop) requestAnimationFrame(() => document.getElementById(`title-${section}`)?.focus({ preventScroll: true }));
  }

  const link = (section: Section, label: string, className?: string) => <a className={className} href={`#${section}`} onClick={event => navigate(event, section)}>{label}</a>;
  const openContact = () => setOverlay({ type: "contact" });
  const openPhoto = (photoId: PhotoId) => setOverlay({ type: "photo", photoId });
  const openPlan = (plan: Membership) => setOverlay({ type: "plan", plan });

  let mobileContent: ReactNode;
  switch (destination) {
    case "gym": mobileContent = <>
      <MobileIntro destination="gym" title="Inside New Gold." subtitle="Tap a photo for a closer look." />
      <div className={styles.mobileContents}>
        <button className={styles.featuredPhoto} onClick={() => openPhoto("floor")} aria-label="View complete photo of the training floor"><Image quality={90} src={photos[0].src} alt={photos[0].alt} width={1672} height={941} sizes="(max-width: 640px) calc(100vw - 40px), 600px" priority /><span>The training floor</span></button>
        <div className={styles.thumbnails}>{photos.map(photo => <button key={photo.id} onClick={() => openPhoto(photo.id)} aria-label={`View complete photo: ${photo.label}`}><Image quality={90} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 640px) 28vw, 189px" /><span>{photo.label}</span></button>)}</div>
        <div className={styles.gymAbout}><h2>Built for your routine.</h2><p>Free weights, benches and strength machines. Train independently or choose trainer support.</p></div>
        <button className={`${styles.textAction} ${styles.gymContact}`} onClick={openContact}><span>Ask about the gym</span><Arrow /></button>
      </div>
    </>; break;
    case "plans": mobileContent = <>
      <MobileIntro destination="plans" title="Find your plan." subtitle="Monthly memberships. Your choice of support." />
      <div className={styles.mobilePlans}><p className={styles.admissionBanner}>One-time admission: PKR {formatPrice(contact.admissionFee)}</p><div className={styles.planList}>{memberships.map(plan => <button className={styles.mobilePlan} key={plan.id} onClick={() => openPlan(plan)}><span className={styles.planName}>{plan.name}</span><Price plan={plan} /><span className={styles.planSummary}>{plan.summary}</span><span className={styles.planArrow}><Arrow /></span></button>)}</div><p className={styles.planHelper}>Tap a plan to see details and enquire.</p></div>
    </>; break;
    case "reviews": mobileContent = <>
      <MobileIntro destination="reviews" title="Member reviews." subtitle="From people who train here." />
      <div className={styles.mobileReviews}>{reviews.slice(0, 2).map(review => <Review key={review.name} review={review} />)}<div className={styles.shortReviews}>{reviews.slice(2).map(review => <Review key={review.name} review={review} compact />)}</div></div>
    </>; break;
    default: mobileContent = <>
      <MobileIntro destination="discover" title="Train with purpose." subtitle="Explore your gym. Find your plan." />
      <div className={styles.mobileContents}><Image quality={90} className={styles.mobileHero} src="/images/hero.webp" alt="New Gold Gym artwork with strength athletes and the words Today painful, Tomorrow powerful." width={1774} height={887} sizes="(max-width: 640px) calc(100vw - 40px), 600px" priority />
        <a className={styles.primaryButton} href="#plans" onClick={event => navigate(event, "plans")}>Explore memberships<Arrow /></a>
        <div className={styles.discoverGymHeading}><h2>A look inside</h2>{link("gym", "See gym", styles.smallLink)}</div>
        <a className={styles.gymPreview} href="#gym" onClick={event => navigate(event, "gym")}><Image quality={90} src={photos[0].src} alt={photos[0].alt} width={1672} height={941} sizes="(max-width: 640px) calc(100vw - 40px), 600px" /><span>Your space to put in the work.</span></a>
        <button className={`${styles.textAction} ${styles.discoverContact}`} onClick={openContact}><span>Questions? Get in touch</span><Arrow /></button>
      </div>
    </>;
  }

  return <>
    <a href="#main-content" className={styles.skipLink}>Skip to content</a>
    <header className={styles.mobileHeader}><a href="#discover" onClick={event => navigate(event, "discover")} aria-label="New Gold Gym 2.0 home"><Brand /></a><button className={styles.contactShortcut} onClick={openContact} aria-label="Contact New Gold Gym"><Icon name="chat" /></button></header>
    <header className={styles.desktopHeader}><div className={styles.container}><a href="#discover" onClick={event => navigate(event, "discover")} aria-label="New Gold Gym 2.0 home"><Brand desktop /></a><nav aria-label="Main navigation">{link("about", "About")}{link("gym", "Inside the Gym")}{link("plans", "Memberships")}{link("reviews", "Reviews")}{link("contact", "Contact")}</nav><button className={styles.primaryButton} onClick={openContact}>Enquire on WhatsApp<Arrow /></button></div></header>
    <main id="main-content" tabIndex={-1}>
      <div className={styles.mobileMain}><div className={styles.mobileStage}><AnimatePresence initial={false}>{<MobilePane key={destination} destination={destination}>{mobileContent}</MobilePane>}</AnimatePresence></div></div>
      <div className={styles.desktopMain}>
        <section id="discover" className={styles.desktopHero}><div className={`${styles.container} ${styles.heroGrid}`}><div className={styles.heroCopy}><h1>TRAIN WITH<br />PURPOSE.</h1><p>Explore your gym. Find your routine.<br />Choose the right support for you.</p>{link("plans", "View memberships", styles.secondaryButton)}<button className={styles.primaryButton} onClick={openContact}>Enquire on WhatsApp<Arrow /></button></div><figure className={styles.heroArtwork}><Image quality={90} src="/images/hero.webp" alt="New Gold Gym strength training artwork. Today painful, Tomorrow powerful." width={1774} height={887} sizes="(min-width: 1440px) 752px, 55vw" priority /><figcaption>New Gold Gym 2.0. A new chapter in your training.</figcaption></figure></div></section>
        <section id="about" className={styles.desktopAbout}><div className={`${styles.container} ${styles.aboutGrid}`}><h2>A PLACE TO PUT<br />IN THE WORK.</h2><div><p>Take a look around New Gold Gym 2.0. From free weights and benches to strength machines, explore the space before you choose a plan.</p><p className={styles.features}>Free weights <span>/</span> Strength machines <span>/</span> Trainer options</p></div></div></section>
        <section id="gym" className={styles.desktopGallery}><div className={styles.container}><div className={styles.galleryHeading}><h2>INSIDE NEW GOLD.</h2><p>See the space you’ll train in.</p></div><div className={styles.galleryGrid}><div className={styles.galleryLeft}>{photos.slice(0, 2).map(photo => <figure key={photo.id}><button onClick={() => openPhoto(photo.id)} aria-label={`View complete photo: ${photo.caption}`}><Image quality={90} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(min-width: 1440px) 800px, 58vw" /></button><figcaption>{photo.caption}</figcaption></figure>)}</div><figure className={styles.galleryWeights}><button onClick={() => openPhoto("weights")} aria-label="View complete photo: Free weights"><Image quality={90} src={photos[2].src} alt={photos[2].alt} width={805} height={1953} sizes="(min-width: 1440px) 456px, 33vw" /></button><figcaption>{photos[2].caption}</figcaption></figure></div></div></section>
        <section id="plans" className={styles.desktopMemberships}><div className={styles.container}><h2>YOUR ROUTINE. YOUR PLAN.</h2><p className={styles.membershipIntro}>Train independently or choose trainer support. All prices are monthly.</p><p className={styles.desktopAdmission}>One-time admission fee: PKR {formatPrice(contact.admissionFee)}</p><div className={styles.desktopPlanGrid}>{memberships.map(plan => <article key={plan.id} className={styles.desktopPlan}><h3>{plan.name}</h3><Price plan={plan} /><p>{plan.description}</p><button className={styles.primaryButton} onClick={() => openPlan(plan)}>Enquire about this plan<Arrow /></button></article>)}</div></div></section>
        <section id="reviews" className={styles.desktopReviews}><div className={styles.container}><div className={styles.reviewsHeading}><h2>FROM THE PEOPLE<br />WHO TRAIN HERE.</h2><p>Four member perspectives, in their own words.</p></div><div className={styles.desktopReviewGrid}>{reviews.map(review => <Review key={review.name} review={review} />)}</div></div></section>
        <section id="contact" className={styles.desktopContact}><div className={`${styles.container} ${styles.contactGrid}`}><div><h2>MAKE YOUR<br />NEXT MOVE.</h2><p>Ask about a plan or find out more about the gym.</p><button className={styles.primaryButton} onClick={openContact}>Enquire on WhatsApp<Arrow /></button></div><div className={styles.contactDetails}><h3>Visit the gym</h3><p>{contact.address}</p><h3>Opening hours</h3><p>{contact.hours}</p><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={styles.contactNumber}>WhatsApp: {contact.phone}</a></div></div></section>
      </div>
    </main>
    <footer className={styles.desktopFooter}><div className={styles.container}><div className={styles.footerTop}><a href="#discover" onClick={event => navigate(event, "discover")} aria-label="New Gold Gym 2.0 home"><Brand desktop /></a><nav aria-label="Footer navigation">{link("about", "About")}{link("gym", "Inside the Gym")}{link("plans", "Memberships")}{link("reviews", "Reviews")}{link("contact", "Contact")}</nav></div><div className={styles.footerBottom}><p>© 2026 New Gold Gym 2.0</p><p>Build strength. Keep showing up.</p></div></div></footer>
    <nav className={styles.bottomNav} aria-label="Explore New Gold Gym"><div>{destinations.map(item => <a key={item.id} href={`#${item.id}`} aria-current={destination === item.id ? "page" : undefined} onClick={event => navigate(event, item.id)}><span className={styles.tabIcon}><Icon name={item.id} /></span><span>{item.label}</span></a>)}</div></nav>
    <AnimatePresence>{overlay && <WebsiteOverlay key={overlay.type === "photo" ? `photo-${overlay.photoId}` : overlay.type === "plan" ? overlay.plan.id : "contact"} overlay={overlay} desktop={desktop} onClose={() => setOverlay(null)} />}</AnimatePresence>
  </>;
}

function WebsiteOverlay({ overlay, desktop, onClose }: { overlay: Overlay; desktop: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const dismiss = useRef<HTMLButtonElement>(null);
  const drag = useDragControls();
  const y = useMotionValue(0);
  const reduce = useReducedMotion();
  const present = useIsPresent();
  const photo = overlay.type === "photo" ? photos.find(item => item.id === overlay.photoId) : undefined;
  const plan = overlay.type === "plan" ? overlay.plan : undefined;
  const title = photo?.caption ?? plan?.name ?? "Get in touch.";

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousGutter = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    const element = dialog.current;
    element?.showModal();
    dismiss.current?.focus({ preventScroll: true });
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousGutter;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return <dialog ref={dialog} className={`${styles.dialog} ${photo ? styles.photoDialog : ""}`} aria-labelledby="overlay-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={closeOnBackdrop} onKeyDown={event => {
    if (event.key !== "Tab") return;
    const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]')].filter(element => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }}>
    {photo ? <motion.div className={styles.photoViewer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? motionTokens.reducedFade : motionTokens.dialogFade }} inert={!present}><div className={styles.viewerHeader}><h2 id="overlay-title">{title}</h2><button ref={dismiss} className={styles.closeButton} aria-label="Close photo viewer" onClick={onClose}><CloseIcon /></button></div><div className={styles.viewerImage}><Image quality={90} src={photo.src} alt={photo.alt} fill sizes="(min-width: 1200px) 1120px, 100vw" style={{ objectFit: "contain" }} priority /></div><p className={styles.viewerCaption}>{photo.label}</p></motion.div>
      : <motion.section className={styles.sheet} style={{ y }} initial={{ y: desktop || reduce ? 0 : "100%", opacity: desktop ? 0 : 1 }} animate={{ y: 0, opacity: 1 }} exit={{ y: desktop || reduce ? 0 : "100%", opacity: desktop || reduce ? 0 : 1 }} transition={reduce ? { duration: motionTokens.reducedFade } : springs.sheet} drag={!desktop && !reduce ? "y" : false} dragControls={drag} dragListener={false} dragConstraints={{ top: 0 }} dragElastic={{ top: 0.08, bottom: 1 }} dragMomentum={false} onDragEnd={(_, info) => { if (info.offset.y > motionTokens.dismissDistance || (info.offset.y > 10 && info.velocity.y > motionTokens.dismissVelocity)) onClose(); else animate(y, 0, { ...springs.release, velocity: info.velocity.y }); }} inert={!present}>
        <div className={styles.dragHandle} data-testid="sheet-drag-handle" aria-hidden="true" onPointerDown={event => { if (!desktop && !reduce) drag.start(event); }}><span /></div>
        <div className={`${styles.sheetContent} ${!plan ? styles.contactSheet : ""}`}><div className={styles.sheetTitleRow}><h2 id="overlay-title">{title}</h2><button ref={dismiss} className={styles.closeButton} onClick={onClose} aria-label="Close enquiry"><CloseIcon /></button></div>
          {plan ? <><Price plan={plan} className={styles.sheetPrice} /><p className={styles.sheetDescription}>{plan.description}</p><p className={styles.sheetAdmission}>One-time admission fee: PKR {formatPrice(contact.admissionFee)}</p><hr className={styles.sheetRule} /><p className={styles.sheetPhone}>WhatsApp: {contact.phone}</p></> : <><a className={styles.sheetContactPhone} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{contact.phone}</a><div className={styles.sheetContactDetails}><h3>Visit the gym</h3><p>{contact.address}</p><h3>Opening hours</h3><p>{contact.hours}</p></div></>}
          <div className={styles.sheetActions}><WhatsAppLink plan={plan} /><button className={styles.doneButton} onClick={onClose}>Done</button></div>
        </div>
      </motion.section>}
  </dialog>;
}
