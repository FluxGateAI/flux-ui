import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

describe('DropdownMenu', () => {
  it('opens on trigger click and fires onSelect', async () => {
    const onSelect = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>First</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    await userEvent.click(screen.getByText('menu'))
    const item = await screen.findByText('First')
    await userEvent.click(item)
    expect(onSelect).toHaveBeenCalled()
  })
})
