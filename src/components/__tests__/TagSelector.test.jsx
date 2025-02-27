import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TagSelector from '../TagSelector';

describe('TagSelector Component', () => {
  const mockTags = ['自驾', '财经', 'NBA'];
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all tags correctly', () => {
    const { getByText } = render(
      <TagSelector selectedTags={[]} onChange={mockOnChange} />
    );

    // 验证所有标签都被渲染
    TAGS.forEach(tag => {
      expect(getByText(tag)).toBeInTheDocument();
    });
  });

  it('shows selected tags as checked', () => {
    const selectedTags = ['NBA', '财经'];
    const { container } = render(
      <TagSelector selectedTags={selectedTags} onChange={mockOnChange} />
    );

    // 验证选中的标签状态
    selectedTags.forEach(tag => {
      const tagElement = container.querySelector(`[class*="ant-tag-checkable-checked"]`);
      expect(tagElement).toHaveTextContent(tag);
    });
  });

  it('calls onChange when tag is clicked', () => {
    const { getByText } = render(
      <TagSelector selectedTags={[]} onChange={mockOnChange} />
    );

    // 点击标签
    fireEvent.click(getByText('NBA'));

    // 验证回调函数被调用
    expect(mockOnChange).toHaveBeenCalledWith(['NBA']);
  });

  it('removes tag when clicked again', () => {
    const { getByText } = render(
      <TagSelector selectedTags={['NBA']} onChange={mockOnChange} />
    );

    // 再次点击已选中的标签
    fireEvent.click(getByText('NBA'));

    // 验证回调函数被调用，移除标签
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });
}); 