import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Badge } from '@/components/ui/badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'New', variant: 'default' },
}

export const Secondary: Story = {
  args: { children: 'Draft', variant: 'secondary' },
}

export const Outline: Story = {
  args: { children: 'Beta', variant: 'outline' },
}

export const Destructive: Story = {
  args: { children: 'Critical', variant: 'destructive' },
}

export const StatusApproved: Story = {
  render: () =>
    React.createElement(
      Badge,
      {
        variant: 'outline',
        className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      },
      'Approved',
    ),
}

export const StatusPending: Story = {
  render: () =>
    React.createElement(
      Badge,
      {
        variant: 'outline',
        className: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      },
      'Pending',
    ),
}

export const StatusRejected: Story = {
  render: () =>
    React.createElement(
      Badge,
      {
        variant: 'outline',
        className: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
      },
      'Rejected',
    ),
}

export const StatusDraft: Story = {
  render: () =>
    React.createElement(
      Badge,
      {
        variant: 'outline',
        className: 'border-slate-600/50 bg-slate-800/50 text-slate-400',
      },
      'Draft',
    ),
}

export const StatusSubmitted: Story = {
  render: () =>
    React.createElement(
      Badge,
      {
        variant: 'outline',
        className: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
      },
      'Submitted',
    ),
}

export const EyebrowLabel: Story = {
  render: () =>
    React.createElement(
      Badge,
      {
        variant: 'outline',
        className: 'gap-2 border-sky-800 bg-sky-500/10 text-sky-400',
      },
      React.createElement('span', {
        className: 'h-1.5 w-1.5 rounded-full bg-sky-400',
      }),
      'Now in Beta',
    ),
}
