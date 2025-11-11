import type { ListItemModel } from '@list-types'
import {IpLookupItemStatusType} from "./ip-lookup-item-status.type";

export interface IpLookupItemModel extends ListItemModel {
  status?: IpLookupItemStatusType
  error?: string
  country?: string
  countryCode?: string
  timezone?: string
  localTime?: string
}
