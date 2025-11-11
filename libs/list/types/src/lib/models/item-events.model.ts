import {ItemBlurEventType} from "../types/item-blur-event.type";
import {ItemChangeEventType} from "../types/item-change-event.type";
import {ItemDeleteEventType} from "../types/item-delete-event.type";

export interface ItemEvents {
  itemChange: ItemChangeEventType;
  itemBlur: ItemBlurEventType;
  itemDelete: ItemDeleteEventType

}
