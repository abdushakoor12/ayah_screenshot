export interface GradientModel {
  start: string;
  end: string;
}

export const gradientColors: GradientModel[] = [
  { start: '#ff512f', end: '#dd2476' },  // Red to pink (sunrise)
  { start: '#2b5876', end: '#4e4376' },  // Dark blue to purple (oceanBlue)
  { start: '#cc2b5e', end: '#753a88' },  // Pink to purple (purpleLove)
  { start: '#fdc830', end: '#f37335' },  // Yellow to orange (citrusPeel)
  { start: '#2193b0', end: '#6dd5ed' },  // Blue to light blue (coolBlues)
  { start: '#e53935', end: '#e35d5b' },  // Dark red to light red (passion)
  { start: '#02aab0', end: '#00cdac' },  // Teal to light green (greenBeach)
  { start: '#2c3e50', end: '#fd746c' },  // Dark blue to orange-red (dusk)
  { start: '#f1f2b5', end: '#135058' },  // Light yellow to dark teal (freshTurbos)
  { start: '#00f260', end: '#0575e6' },  // Green to blue (neonGlow)
  { start: '#141e30', end: '#243b55' },  // Dark blue tones (royal)
  { start: '#ffb347', end: '#ffcc33' },  // Peach to light yellow (peach)
  { start: '#ffb7c5', end: '#ff6b6b' },  // Light pink to dark pink (cherryBlossom)
  { start: '#3ca55c', end: '#b5ac49' },  // Green to lime (lemonTwist)
  { start: '#e6dada', end: '#274046' },  // Light gray to dark green (winter)
];