import { describe, it, expect, beforeEach, vi } from 'vitest'
import { lookupIp } from './ipLookup.service'

describe('lookupIp', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('successful lookup', () => {
    it('should return IP location data for valid IP', async () => {
      const mockResponse = {
        country_name: 'United States',
        country_code: 'US',
        timezone: 'America/New_York',
        city: 'New York',
        region: 'New York',
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      )

      const result = await lookupIp('8.8.8.8')

      expect(result).toEqual({
        country: 'United States',
        countryCode: 'US',
        timezone: 'America/New_York',
        city: 'New York',
        region: 'New York',
      })

      expect(fetch).toHaveBeenCalledWith('https://ipapi.co/8.8.8.8/json/')
    })

    it('should return correct data for different IP', async () => {
      const mockResponse = {
        country_name: 'Israel',
        country_code: 'IL',
        timezone: 'Asia/Jerusalem',
        city: 'Tel Aviv',
        region: 'Tel Aviv',
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      )

      const result = await lookupIp('1.2.3.4')

      expect(result).toEqual({
        country: 'Israel',
        countryCode: 'IL',
        timezone: 'Asia/Jerusalem',
        city: 'Tel Aviv',
        region: 'Tel Aviv',
      })
    })
  })

  describe('error handling', () => {
    it('should throw error when fetch fails', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      )

      await expect(lookupIp('invalid')).rejects.toThrow('Failed to lookup IP address')
    })

    it('should throw error when API returns error response', async () => {
      const mockErrorResponse = {
        error: true,
        reason: 'Invalid IP address',
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockErrorResponse),
        } as Response)
      )

      await expect(lookupIp('999.999.999.999')).rejects.toThrow('Invalid IP address')
    })

    it('should throw generic error when API returns error without reason', async () => {
      const mockErrorResponse = {
        error: true,
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockErrorResponse),
        } as Response)
      )

      await expect(lookupIp('invalid')).rejects.toThrow('Invalid IP address')
    })

    it('should throw error when network request fails', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

      await expect(lookupIp('8.8.8.8')).rejects.toThrow('Network error')
    })
  })

  describe('API endpoint', () => {
    it('should call correct API endpoint with IP parameter', async () => {
      const mockResponse = {
        country_name: 'Test Country',
        country_code: 'TC',
        timezone: 'Test/Timezone',
        city: 'Test City',
        region: 'Test Region',
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      )

      await lookupIp('192.168.1.1')

      expect(fetch).toHaveBeenCalledWith('https://ipapi.co/192.168.1.1/json/')
    })
  })
})
