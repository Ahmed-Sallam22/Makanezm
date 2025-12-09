export interface Marquee {
  id: string;
  text: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarqueeState {
  marquees: Marquee[];
  isLoading: boolean;
  error: string | null;
}
