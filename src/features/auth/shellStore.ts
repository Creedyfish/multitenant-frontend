import { Store } from '@tanstack/react-store'

interface ShellState {
  sidebarCollapsed: boolean
}

export const shellStore = new Store<ShellState>({
  sidebarCollapsed: false,
})

export const toggleSidebar = () => {
  shellStore.setState((s) => ({ ...s, sidebarCollapsed: !s.sidebarCollapsed }))
}

export const setSidebarCollapsed = (collapsed: boolean) => {
  shellStore.setState((s) => ({ ...s, sidebarCollapsed: collapsed }))
}
