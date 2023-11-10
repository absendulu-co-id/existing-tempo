export enum QuickPanelActionsType {
  TOGGLE_QUICK_PANEL = "[QUICK PANEL] TOGGLE QUICK PANEL",
}

interface QuickPanelToggle {
  type: QuickPanelActionsType.TOGGLE_QUICK_PANEL;
  TOGGLE_QUICK_PANEL: string;
}

export type QuickPanelActions = QuickPanelToggle;

export function toggleQuickPanel() {
  return {
    type: QuickPanelActionsType.TOGGLE_QUICK_PANEL,
  };
}
