/**
 * Converts the wind direction to text representation
 * @param degree 
 */
export function windDirectionDegreeToText(degree: number): string {
  const val = Math.floor((degree / 45) + 0.5);
  const arr = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return arr[(val % 8)];
}