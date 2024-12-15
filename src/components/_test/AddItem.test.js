// src/components/__tests__/AddItem.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';

import AddItem from '../AddItem';

// Mock axios
jest.mock('axios');

describe('AddItem Component', () => {
  test('renders AddItem form correctly', () => {
    render(<AddItem setItems={jest.fn()} />);

    // Check if the inputs are present
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/Add/i)).toBeInTheDocument();
  });

  test('adds an item correctly', async () => {
    const mockSetItems = jest.fn();

    // Mock the axios post request to return a fake item
    axios.post.mockResolvedValue({
      data: { _id: '1', name: 'Test Item', description: 'Test Description' },
    });

    render(<AddItem setItems={mockSetItems} />);

    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Test Description' } });

    fireEvent.click(screen.getByText(/Add/i));

    // Wait for the item to be added
    await waitFor(() => expect(mockSetItems).toHaveBeenCalledWith([
      { _id: '1', name: 'Test Item', description: 'Test Description' },
    ]));

    // Check that the input fields are cleared after adding an item
    expect(screen.getByPlaceholderText(/name/i).value).toBe('');
    expect(screen.getByPlaceholderText(/description/i).value).toBe('');
  });
});
