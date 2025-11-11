import { describe, it, expect } from 'vitest'
import { isValidIp } from './list-validation'

describe('isValidIp', () => {
  describe('valid IP addresses', () => {
    it('should return true for valid IPv4 address 192.168.1.1', () => {
      expect(isValidIp('192.168.1.1')).toBe(true)
    })

    it('should return true for valid IPv4 address 8.8.8.8', () => {
      expect(isValidIp('8.8.8.8')).toBe(true)
    })

    it('should return true for valid IPv4 address 0.0.0.0', () => {
      expect(isValidIp('0.0.0.0')).toBe(true)
    })

    it('should return true for valid IPv4 address 255.255.255.255', () => {
      expect(isValidIp('255.255.255.255')).toBe(true)
    })

    it('should return true for valid IPv4 address 10.0.0.1', () => {
      expect(isValidIp('10.0.0.1')).toBe(true)
    })

    it('should return true for valid IPv4 address 172.16.0.1', () => {
      expect(isValidIp('172.16.0.1')).toBe(true)
    })
  })

  describe('invalid IP addresses', () => {
    it('should return false for empty string', () => {
      expect(isValidIp('')).toBe(false)
    })

    it('should return false for null', () => {
      expect(isValidIp(null as any)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isValidIp(undefined as any)).toBe(false)
    })

    it('should return false for non-string value', () => {
      expect(isValidIp(123 as any)).toBe(false)
    })

    it('should return false for IP with invalid format', () => {
      expect(isValidIp('192.168.1')).toBe(false)
    })

    it('should return false for IP with too many octets', () => {
      expect(isValidIp('192.168.1.1.1')).toBe(false)
    })

    it('should return false for IP with octet > 255', () => {
      expect(isValidIp('192.168.1.256')).toBe(false)
    })

    it('should return false for IP with octet > 255 (300)', () => {
      expect(isValidIp('192.168.1.300')).toBe(false)
    })

    it('should return false for IP with negative octet', () => {
      expect(isValidIp('192.168.-1.1')).toBe(false)
    })

    it('should return false for IP with letters', () => {
      expect(isValidIp('192.168.1.a')).toBe(false)
    })

    it('should return false for IP with special characters', () => {
      expect(isValidIp('192.168.1.1!')).toBe(false)
    })

    it('should return false for IP with spaces', () => {
      expect(isValidIp('192.168.1.1 ')).toBe(false)
    })

    it('should return false for IP with leading zeros that exceed 255', () => {
      expect(isValidIp('192.168.001.256')).toBe(false)
    })

    it('should return false for completely invalid format', () => {
      expect(isValidIp('not-an-ip')).toBe(false)
    })

    it('should return false for IPv6 address', () => {
      expect(isValidIp('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should return true for IP with single digit octets', () => {
      expect(isValidIp('1.2.3.4')).toBe(true)
    })

    it('should return true for IP with double digit octets', () => {
      expect(isValidIp('12.34.56.78')).toBe(true)
    })

    it('should return true for IP with triple digit octets', () => {
      expect(isValidIp('123.234.212.199')).toBe(true)
    })

    it('should return false for IP with 4-digit octet', () => {
      expect(isValidIp('1234.168.1.1')).toBe(false)
    })
  })
})
