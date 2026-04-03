import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Eye, EyeOff } from 'lucide-react'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) =>
      React.createElement(
        'div',
        { className: 'w-72' },
        React.createElement(Story),
      ),
  ],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Enter value…' },
}

export const Email: Story = {
  args: { type: 'email', placeholder: 'you@example.com' },
}

export const WithValue: Story = {
  args: { value: 'john@logisticore.io', readOnly: true },
}

export const Disabled: Story = {
  args: { placeholder: 'Not editable', disabled: true },
}

export const WithSearchIcon: Story = {
  render: () =>
    React.createElement(
      'div',
      { className: 'relative w-72' },
      React.createElement(Search, {
        size: 14,
        className:
          'text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2',
      }),
      React.createElement(Input, {
        placeholder: 'Search products…',
        className: 'pl-8',
      }),
    ),
}

export const Password: Story = {
  render: () => {
    function PasswordInput() {
      const [show, setShow] = useState(false)
      return React.createElement(
        'div',
        { className: 'relative w-72' },
        React.createElement(Input, {
          type: show ? 'text' : 'password',
          placeholder: 'Password',
          className: 'pr-9',
        }),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: () => setShow((s) => !s),
            className:
              'text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2',
          },
          show
            ? React.createElement(EyeOff, { size: 14 })
            : React.createElement(Eye, { size: 14 }),
        ),
      )
    }
    return React.createElement(PasswordInput)
  },
}
