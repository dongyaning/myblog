'use client'

import React, { memo } from 'react'
import { useState } from 'react'

import { Button } from '../ui/button'

const Counter = memo(() => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Button variant={'outline'} onClick={() => setCount(count + 1)}>
        点击计数: {count}
      </Button>
    </div>
  )
})

Counter.displayName = 'Counter'

export default Counter
