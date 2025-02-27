import React from 'react';
import { render } from '@testing-library/react';
import FormField from '../formField';

// Define mock functions we can use in our tests
const mockInput = jest.fn(props => <input data-testid="mocked-input" {...props} />);
const mockLabel = jest.fn(props => <label data-testid="mocked-label" {...props}>{props.children}</label>);
const mockCn = jest.fn((...args) => args.filter(Boolean).join(' '));

// Mock each module BEFORE importing FormField
jest.mock('../../../../components/ui/input.tsx', () => ({
  Input: mockInput
}));

jest.mock('../../../../components/ui/label.tsx', () => ({
  Label: mockLabel
}));

jest.mock('../../../../lib/utils.ts', () => ({
  cn: mockCn
}));

describe('FormField Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockInput.mockClear();
    mockLabel.mockClear();
    mockCn.mockClear();
  });

  it('passes correct props to Input and Label', () => {
    const handleChange = jest.fn();
    
    render(
      <FormField
        label="Full Name"
        type="text"
        value="John Doe"
        onChange={handleChange}
        placeholder="Enter your name"
        error="Name is required"
        required={true}
        className="custom-class"
      />
    );
    
    // Check that mockLabel was called with correct props
    expect(mockLabel).toHaveBeenCalledTimes(1);
    expect(mockLabel.mock.calls[0][0]).toMatchObject({
      className: expect.stringContaining('text-sm font-medium')
    });
    
    // Check that mockInput was called with correct props
    expect(mockInput).toHaveBeenCalledTimes(1);
    expect(mockInput.mock.calls[0][0]).toMatchObject({
      type: 'text',
      value: 'John Doe',
      onChange: handleChange,
      placeholder: 'Enter your name',
      className: expect.stringContaining('custom-class')
    });
  });
});