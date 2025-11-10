/**
 * Validates if a string is a valid IPv4 address
 * @param ip - The IP address string to validate
 * @returns true if valid IPv4, false otherwise
 */
export function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false

  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  const match = ip.match(ipv4Regex)

  if (!match) return false

  // Check each octet is between 0-255
  for (let i = 1; i <= 4; i++) {
    const octet = parseInt(match[i], 10)
    if (octet < 0 || octet > 255) return false
  }

  return true
}
