declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

import * as Bs from 'bootstrap'

declare global {
  const bootstrap: typeof Bs
}

declare module '*.txt' {
  const content: string
  export default content
}

declare module '*.md' {
  const content: string
  export default content
}
