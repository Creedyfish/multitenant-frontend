import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () =>
    React.createElement(
      RadioGroup,
      { defaultValue: 'manager' },
      React.createElement(
        'div',
        { className: 'flex items-center gap-2' },
        React.createElement(RadioGroupItem, { value: 'admin', id: 'admin' }),
        React.createElement(Label, { htmlFor: 'admin' }, 'Admin'),
      ),
      React.createElement(
        'div',
        { className: 'flex items-center gap-2' },
        React.createElement(RadioGroupItem, {
          value: 'manager',
          id: 'manager',
        }),
        React.createElement(Label, { htmlFor: 'manager' }, 'Manager'),
      ),
      React.createElement(
        'div',
        { className: 'flex items-center gap-2' },
        React.createElement(RadioGroupItem, { value: 'staff', id: 'staff' }),
        React.createElement(Label, { htmlFor: 'staff' }, 'Staff'),
      ),
    ),
}

export const UserRoles: Story = {
  render: () => {
    const roles = [
      {
        value: 'admin',
        label: 'Admin',
        description: 'Full access, user management',
      },
      {
        value: 'manager',
        label: 'Manager',
        description: 'CRUD, PR approval, reports',
      },
      {
        value: 'staff',
        label: 'Staff',
        description: 'Read access, submit PRs',
      },
    ]
    return React.createElement(
      'div',
      {
        className: 'w-72 space-y-2 rounded-xl border border-border bg-card p-5',
      },
      React.createElement(
        'p',
        { className: 'mb-4 text-sm font-semibold text-foreground' },
        'Assign role',
      ),
      React.createElement(
        RadioGroup,
        { defaultValue: 'staff' },
        ...roles.map((role) =>
          React.createElement(
            'div',
            {
              key: role.value,
              className:
                'flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/50',
            },
            React.createElement(RadioGroupItem, {
              value: role.value,
              id: role.value,
              className: 'mt-0.5',
            }),
            React.createElement(
              'div',
              {},
              React.createElement(
                Label,
                {
                  htmlFor: role.value,
                  className:
                    'cursor-pointer text-sm font-medium text-foreground',
                },
                role.label,
              ),
              React.createElement(
                'p',
                { className: 'text-xs text-muted-foreground' },
                role.description,
              ),
            ),
          ),
        ),
      ),
    )
  },
}

export const Disabled: Story = {
  render: () =>
    React.createElement(
      RadioGroup,
      { defaultValue: 'manager', disabled: true },
      React.createElement(
        'div',
        { className: 'flex items-center gap-2' },
        React.createElement(RadioGroupItem, { value: 'admin', id: 'd-admin' }),
        React.createElement(Label, { htmlFor: 'd-admin' }, 'Admin'),
      ),
      React.createElement(
        'div',
        { className: 'flex items-center gap-2' },
        React.createElement(RadioGroupItem, {
          value: 'manager',
          id: 'd-manager',
        }),
        React.createElement(Label, { htmlFor: 'd-manager' }, 'Manager'),
      ),
    ),
}
