declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

import * as Bs from 'bootstrap'

declare global {
  const bootstrap: typeof Bs
}
