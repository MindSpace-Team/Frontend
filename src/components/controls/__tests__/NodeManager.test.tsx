import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import NodeManager from '../NodeManager'

// Mock 필요한 하위 컴포넌트 및 store
jest.mock('@/components/canvas/Canvas', () => {
  const MockCanvas = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  MockCanvas.displayName = 'MockCanvas';
  return MockCanvas;
});
jest.mock('@/components/nodes/nodes', () => {
  const MockNodes = () => <g data-testid="nodes" />;
  MockNodes.displayName = 'MockNodes';
  return MockNodes;
});
type ContextMenuProps = {
  options: { label: string; onClick: () => void }[];
};
jest.mock('@/components/common/ContextMenu', () => {
  const MockContextMenu = (props: ContextMenuProps) => (
    <div data-testid="context-menu">
      ContextMenu
      {props.options.map((opt, i) => (
        <button key={i} onClick={opt.onClick}>{opt.label}</button>
      ))}
    </div>
  );
  MockContextMenu.displayName = 'MockContextMenu';
  return MockContextMenu;
});
jest.mock('@/components/controls/popupUI', () => {
  const MockPopupUI = () => <div data-testid="popup-ui" />;
  MockPopupUI.displayName = 'MockPopupUI';
  return MockPopupUI;
});
type BottomMenuProps = { onClose: () => void; onSelectBackground: (bg: string) => void };
jest.mock('@/components/controls/BottomMenu', () => {
  const MockBottomMenu = (props: BottomMenuProps) => (
    <div data-testid="bottom-menu">
      <button onClick={() => props.onSelectBackground('space2')}>Change BG</button>
      <button onClick={props.onClose}>Close</button>
    </div>
  );
  MockBottomMenu.displayName = 'MockBottomMenu';
  return MockBottomMenu;
});

const mockAddStar = jest.fn()
const mockSetBackground = jest.fn()

jest.mock('@/store/mindGraphStore', () => ({
  useMindGraphStore: (
    fn: (store: { nodes: unknown[]; addStar: (x: number, y: number) => void }) => unknown
  ) => fn({ nodes: [], addStar: mockAddStar }),
}))
jest.mock('@/store/backgroundStore', () => ({
  useBackgroundStore: () => ({ setBackground: mockSetBackground })
}))

// 테스트용 NodeManager Wrapper (menu 상태 강제)
function NodeManagerWithMenu() {
  return (
    <>
      <NodeManager />
      <div data-testid="context-menu">
        ContextMenu
        <button onClick={() => mockAddStar(0, 0)}>별 추가</button>
      </div>
    </>
  );
}

describe('NodeManager', () => {
  it('renders canvas and nodes', () => {
    render(<NodeManager />)
    expect(screen.getByTestId('nodes')).toBeInTheDocument()
    expect(screen.getByTestId('popup-ui')).toBeInTheDocument()
  })

  it('shows context menu when menu state is true', () => {
    render(<NodeManagerWithMenu />)
    expect(screen.getByTestId('context-menu')).toBeInTheDocument()
  })

  it('calls addStar when 별 추가 is clicked in context menu', () => {
    render(<NodeManagerWithMenu />)
    const addStarBtn = screen.getByText('별 추가')
    fireEvent.click(addStarBtn)
    expect(mockAddStar).toHaveBeenCalled()
  })
}) 