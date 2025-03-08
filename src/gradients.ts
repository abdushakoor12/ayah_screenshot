export interface GradientModel {
  start: string;
  end: string;
}

export const gradientColors: GradientModel[] = [
  // Warm gradients
  { start: '#ff512f', end: '#dd2476' },  // Red to pink (sunrise)
  { start: '#fdc830', end: '#f37335' },  // Yellow to orange (citrusPeel)
  { start: '#e53935', end: '#e35d5b' },  // Dark red to light red (passion)
  { start: '#ffb347', end: '#ffcc33' },  // Peach to light yellow (peach)
  { start: '#ffb7c5', end: '#ff6b6b' },  // Light pink to dark pink (cherryBlossom)
  { start: '#FF8C00', end: '#FF0080' },  // Orange to pink (sunset)
  { start: '#FF416C', end: '#FF4B2B' },  // Pink to orange (love)
  
  // Cool gradients
  { start: '#2b5876', end: '#4e4376' },  // Dark blue to purple (oceanBlue)
  { start: '#2193b0', end: '#6dd5ed' },  // Blue to light blue (coolBlues)
  { start: '#02aab0', end: '#00cdac' },  // Teal to light green (greenBeach)
  { start: '#00f260', end: '#0575e6' },  // Green to blue (neonGlow)
  { start: '#141e30', end: '#243b55' },  // Dark blue tones (royal)
  { start: '#4568DC', end: '#B06AB3' },  // Blue to purple (moonlight)
  { start: '#0F2027', end: '#203A43' },  // Dark teal tones (deepOcean)
  
  // Earth tones
  { start: '#cc2b5e', end: '#753a88' },  // Pink to purple (purpleLove)
  { start: '#2c3e50', end: '#fd746c' },  // Dark blue to orange-red (dusk)
  { start: '#f1f2b5', end: '#135058' },  // Light yellow to dark teal (freshTurbos)
  { start: '#3ca55c', end: '#b5ac49' },  // Green to lime (lemonTwist)
  { start: '#e6dada', end: '#274046' },  // Light gray to dark green (winter)
  { start: '#8A2387', end: '#E94057' },  // Purple to red (sunset)
  
  // Elegant gradients
  { start: '#000428', end: '#004e92' },  // Dark blue tones (midnight)
  { start: '#434343', end: '#000000' },  // Gray to black (noir)
  { start: '#5D4157', end: '#A8CABA' },  // Purple to mint (dustyGrass)
  { start: '#1A2980', end: '#26D0CE' },  // Dark blue to teal (deepBlue)
  { start: '#603813', end: '#b29f94' },  // Brown tones (desert)
  { start: '#16222A', end: '#3A6073' },  // Dark blue tones (steel)
  
  // Light gradients
  { start: '#FFFFFF', end: '#ECE9E6' },  // White to light gray (clean)
  { start: '#F3F9A7', end: '#CAC531' },  // Light yellow tones (lemon)
  { start: '#E0EAFC', end: '#CFDEF3' },  // Light blue tones (sky)
  { start: '#F5F7FA', end: '#C3CFE2' },  // White to light blue (clouds)
  { start: '#E6DADA', end: '#274046' },  // Light gray to dark teal (winter)
];