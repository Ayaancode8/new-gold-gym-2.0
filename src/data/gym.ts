export type Destination = "discover" | "gym" | "plans" | "reviews";
export type PlanId = "basic" | "trainer-basic" | "trainer-advanced";
export type PhotoId = "floor" | "machines" | "weights";

export interface Membership {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  summary: string;
  description: string;
}

export interface MemberReview {
  name: string;
  rating: number;
  quote?: string;
}

export const contact = {
  name: "New Gold Gym 2.0",
  phone: "+92 333 1267175",
  whatsappNumber: "923331267175",
  address: "Address to be confirmed",
  hours: "Contact us for current timings.",
  admissionFee: 1000,
} as const;

export const memberships: readonly Membership[] = [
  { id: "basic", name: "Basic", monthlyPrice: 1500, summary: "Gym access · No trainer", description: "Gym access without a trainer. Come at a time that suits you." },
  { id: "trainer-basic", name: "Trainer Basic", monthlyPrice: 5000, summary: "Gym access + basic trainer support", description: "Gym access with basic trainer support." },
  { id: "trainer-advanced", name: "Trainer Advanced", monthlyPrice: 10000, summary: "Gym access + advanced trainer support", description: "Gym access with advanced trainer support." },
];

export const reviews: readonly MemberReview[] = [
  { name: "Ayaan Afridi", rating: 5, quote: "Good environment and professional trainers....new gold gym is much more better than the old one really satisfied do join 👍🏻 …" },
  { name: "T.A Bhatti", rating: 3, quote: "Well equipped, Properly managed but very crowded in evening hours" },
  { name: "Niaz Ahmed", rating: 5 },
  { name: "Kabir Khan", rating: 4 },
];

export const photos = [
  { id: "floor", src: "/images/gym-floor.webp", width: 1672, height: 941, label: "Gym floor", caption: "The training floor", alt: "The New Gold Gym training floor with red flooring, benches, mirrors and strength equipment." },
  { id: "machines", src: "/images/gym-machines.webp", width: 1673, height: 940, label: "Machines", caption: "Strength machines & dumbbells", alt: "Strength machines, a bench and a rack of dumbbells inside New Gold Gym." },
  { id: "weights", src: "/images/gym-weights.webp", width: 805, height: 1953, label: "Free weights", caption: "Free weights, ready for your next set", alt: "A complete view of New Gold Gym’s upright rack of barbells and coloured weight plates." },
] as const;

export const destinations: readonly { id: Destination; label: string }[] = [
  { id: "discover", label: "Discover" },
  { id: "gym", label: "Gym" },
  { id: "plans", label: "Plans" },
  { id: "reviews", label: "Reviews" },
];

export function formatPrice(value: number): string {
  return value.toLocaleString("en-PK");
}

export function whatsappUrl(plan?: Membership): string {
  const message = plan
    ? `Hi New Gold Gym 2.0! I'm interested in the ${plan.name} membership at PKR ${formatPrice(plan.monthlyPrice)} per month, plus the one-time PKR ${formatPrice(contact.admissionFee)} admission fee. Could you share more details?`
    : "Hi New Gold Gym 2.0! I'd like to know more about the gym, memberships and current opening hours.";
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
