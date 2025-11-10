/**
 * IP Lookup Service using ipapi.co (based on MaxMind GeoIP2/GeoLite2 database)
 * 
 * Alternative: To use MaxMind GeoIP2 API directly:
 * 1. Sign up at https://www.maxmind.com/en/geolite2/signup
 * 2. Get your API key
 * 3. Use endpoint: https://geoip.maxmind.com/geoip/v2.1/city/{ip}
 * 4. Add Authorization header with your API key
 */
export async function lookupIp(ip: string) {
  // ipapi.co uses MaxMind GeoIP2/GeoLite2 database
  const res = await fetch(`https://ipapi.co/${ip}/json/`)
  
  if (!res.ok) {
    throw new Error('Failed to lookup IP address')
  }
  
  const data = await res.json()

  if (data.error) {
    throw new Error(data.reason || 'Invalid IP address')
  }

  return {
    country: data.country_name,
    timezone: data.timezone,
    city: data.city,
    region: data.region,
    countryCode: data.country_code,
  }
}
