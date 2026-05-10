export const getCurrentSeason = () => {
  const month = new Date().getMonth(); // 0-11
  
  // Mapping based on common Nepal/Himalayan agricultural cycles
  if (month >= 2 && month <= 4) return "Spring";     // March, April, May
  if (month === 5) return "Summer";                  // June
  if (month >= 6 && month <= 8) return "Monsoon";    // July, August, September
  if (month >= 9 && month <= 10) return "Autumn";     // October, November
  return "Winter";                                   // December, January, February
};

export const getSeasonIcon = (season) => {
  switch (season) {
    case "Spring": return "faLeaf";
    case "Summer": return "faSun";
    case "Monsoon": return "faCloudRain";
    case "Autumn": return "faWind";
    case "Winter": return "faSnowflake";
    default: return "faCloudSun";
  }
};
