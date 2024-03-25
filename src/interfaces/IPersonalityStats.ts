export default interface IPersonalityStats {
  // Personality traits
  intraverted_extraverted: number; // [0-100]
  intuitive_observant: number; // [0-100]
  thinking_feeling: number; // [0-100]
  judging_prospecting: number; // [0-100]
  assertive_turbulent: number; // [0-100]
  // Soft skills
  communication: number; // [0-100]
  teamwork: number; // [0-100]
  adaptability: number; // [0-100]
  time_management: number; // [0-100]
  creativity: number; // [0-100]
  leadership: number; // [0-100]
  autonomy: number; // [0-100]
  reactivity: number; // [0-100]
  stress_management: number; // [0-100]
}
