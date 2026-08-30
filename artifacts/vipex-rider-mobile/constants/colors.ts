/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#171815',
    tint: '#FFD60A',
    background: '#F6F6F2',
    foreground: '#171815',
    card: '#FFFFFF',
    cardForeground: '#171815',
    primary: '#FFD60A',
    primaryForeground: '#171815',
    secondary: '#E8E9E3',
    secondaryForeground: '#171815',
    muted: '#E8E9E3',
    mutedForeground: '#747770',
    accent: '#FFF2A6',
    accentForeground: '#5E4B00',
    destructive: '#B64238',
    destructiveForeground: '#FFFFFF',
    border: '#D9DAD3',
    input: '#D9DAD3',
    ink: '#171815',
    charcoal: '#1D1F1B',
    success: '#2E985B',
    yellowSoft: '#FFF8CF',
    map: '#E7E9E3',
    white: '#FFFFFF',
  },

  radius: 16,
};

export default colors;
