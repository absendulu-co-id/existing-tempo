import { MessageStateOptions } from "app/store/reducers/fuse/message.reducer";

export const HIDE_MESSAGE = "[MESSAGE] CLOSE";
export const SHOW_MESSAGE = "[MESSAGE] SHOW";

export function hideMessage() {
  return {
    type: HIDE_MESSAGE,
  };
}

export function showMessage(options: MessageStateOptions) {
  return {
    type: SHOW_MESSAGE,
    options,
  };
}
