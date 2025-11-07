import type { Meta, StoryObj } from '@storybook/react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Header 1</TableHead>
          <TableHead>Header 2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Cell 1.1</TableCell>
          <TableCell>Cell 1.2</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Cell 2.1</TableCell>
          <TableCell>Cell 2.2</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
