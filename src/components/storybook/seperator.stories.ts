import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Separator } from '@/components/ui/separator'

const meta = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () =>
    React.createElement(
      'div',
      { className: 'w-72 space-y-4' },
      React.createElement(
        'p',
        { className: 'text-sm text-muted-foreground' },
        'Section above',
      ),
      React.createElement(Separator),
      React.createElement(
        'p',
        { className: 'text-sm text-muted-foreground' },
        'Section below',
      ),
    ),
}

export const Vertical: Story = {
  render: () =>
    React.createElement(
      'div',
      { className: 'flex h-8 items-center gap-4' },
      React.createElement(
        'span',
        { className: 'text-sm text-muted-foreground' },
        'Features',
      ),
      React.createElement(Separator, { orientation: 'vertical' }),
      React.createElement(
        'span',
        { className: 'text-sm text-muted-foreground' },
        'How it works',
      ),
      React.createElement(Separator, { orientation: 'vertical' }),
      React.createElement(
        'span',
        { className: 'text-sm text-muted-foreground' },
        'Pricing',
      ),
    ),
}

export const InFooter: Story = {
  render: () =>
    React.createElement(
      'div',
      {
        className: 'w-80 space-y-4 rounded-xl border border-border bg-card p-6',
      },
      React.createElement(
        'p',
        { className: 'text-sm font-semibold text-foreground' },
        'LogistiCore',
      ),
      React.createElement(Separator, { className: 'bg-border' }),
      React.createElement(
        'p',
        { className: 'text-xs text-muted-foreground' },
        '© 2026 All rights reserved.',
      ),
    ),
}
