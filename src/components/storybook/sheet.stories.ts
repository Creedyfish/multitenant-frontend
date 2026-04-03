import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Menu } from 'lucide-react'

const meta = {
  title: 'UI/Sheet',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  component: Sheet,
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () =>
    React.createElement(
      Sheet,
      {},
      React.createElement(
        SheetTrigger,
        { asChild: true },
        React.createElement(Button, { variant: 'outline' }, 'Open sheet'),
      ),
      React.createElement(
        SheetContent,
        { className: 'border-border bg-card' },
        React.createElement(
          SheetHeader,
          {},
          React.createElement(SheetTitle, {}, 'Sheet title'),
          React.createElement(
            SheetDescription,
            { className: 'text-muted-foreground' },
            'This is a description for the sheet content.',
          ),
        ),
        React.createElement(
          'div',
          { className: 'py-4' },
          React.createElement(
            'p',
            { className: 'text-sm text-muted-foreground' },
            'Sheet body content goes here.',
          ),
        ),
        React.createElement(
          SheetFooter,
          {},
          React.createElement(
            SheetClose,
            { asChild: true },
            React.createElement(Button, { variant: 'outline' }, 'Close'),
          ),
        ),
      ),
    ),
}

export const FromLeft: Story = {
  render: () =>
    React.createElement(
      Sheet,
      {},
      React.createElement(
        SheetTrigger,
        { asChild: true },
        React.createElement(Button, { variant: 'outline' }, 'Open left'),
      ),
      React.createElement(
        SheetContent,
        { side: 'left', className: 'border-border bg-card' },
        React.createElement(
          SheetHeader,
          {},
          React.createElement(SheetTitle, {}, 'Left sheet'),
        ),
        React.createElement(
          'p',
          { className: 'mt-4 text-sm text-muted-foreground' },
          'Slides in from the left.',
        ),
      ),
    ),
}

export const MobileNav: Story = {
  render: () =>
    React.createElement(
      Sheet,
      {},
      React.createElement(
        SheetTrigger,
        { asChild: true },
        React.createElement(
          Button,
          {
            variant: 'ghost',
            size: 'icon',
            className: 'text-muted-foreground',
          },
          React.createElement(Menu, { size: 20 }),
        ),
      ),
      React.createElement(
        SheetContent,
        { side: 'right', className: 'w-72 border-slate-800 bg-slate-950 px-0' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-2 px-6 pb-5 pt-2' },
          React.createElement(
            'div',
            {
              className:
                'flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500',
            },
            React.createElement(
              'span',
              { className: 'text-xs font-black text-white' },
              'LC',
            ),
          ),
          React.createElement(
            'span',
            { className: 'text-sm font-bold text-slate-100' },
            'LogistiCore',
          ),
        ),
        React.createElement(Separator, { className: 'bg-slate-800' }),
        React.createElement(
          'nav',
          { className: 'flex flex-col gap-1 px-3 pt-4' },
          ...['Features', 'How it works', 'Pricing'].map((item) =>
            React.createElement(
              'a',
              {
                key: item,
                href: '#',
                className:
                  'rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 no-underline transition-colors hover:bg-slate-800 hover:text-slate-100',
              },
              item,
            ),
          ),
        ),
        React.createElement(Separator, { className: 'mx-3 mt-5 bg-slate-800' }),
        React.createElement(
          'div',
          { className: 'flex flex-col gap-2 px-6 pt-5' },
          React.createElement(
            Button,
            {
              variant: 'outline',
              className:
                'w-full border-slate-700 bg-transparent text-slate-300',
            },
            'Sign in',
          ),
          React.createElement(
            Button,
            { className: 'w-full bg-sky-500 text-white hover:bg-sky-400' },
            'Get started free',
          ),
        ),
      ),
    ),
}
