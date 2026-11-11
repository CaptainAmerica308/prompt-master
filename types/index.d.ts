declare module 'claude-code' {
  interface PluginState {
    'prompt-master': {
      /** True while a rewrite request is in flight (drives the button label). */
      isBusy: boolean
    }
  }
}
