import type {ListItemModel} from "./list-item.model";

export interface ListModel {
  items: ListItemModel[]
  virtualScroll?: boolean
  itemHeight?: number
  visibleCount?: number
  emptyMessage?: string
}
