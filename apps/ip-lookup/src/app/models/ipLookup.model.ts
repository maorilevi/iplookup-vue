import type { ListItemModel } from '@list-types'

export interface IpLookupItemModel extends ListItemModel {
  status?: 'idle' | 'searching' | 'success' | 'error'
  error?: string
  country?: string
  countryCode?: string
  timezone?: string
  localTime?: string
}
