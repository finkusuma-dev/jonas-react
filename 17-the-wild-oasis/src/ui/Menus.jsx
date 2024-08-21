import { createContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useState } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import { createPortal } from 'react-dom';
import { HiEllipsisVertical } from 'react-icons/hi2';

const StyledMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenuContext = createContext();

Menus.propTypes = {
  children: PropTypes.any,
  buttonList: PropTypes.array,
};

function Menus({ children, buttonList }) {
  const [id, setId] = useState(false);
  const [position, setPosition] = useState(null);

  const close = () => setId(false);

  return (
    <MenuContext.Provider
      value={{ buttonList, id, setId, close, position, setPosition }}
    >
      {children}
    </MenuContext.Provider>
  );
}

Menu.propTypes = {
  children: PropTypes.any,
};

function Menu({ children }) {
  return <StyledMenu>{children}</StyledMenu>;
}

Toggle.propTypes = {
  id: PropTypes.number,
  onClick: PropTypes.func,
};

function Toggle({ id: toggleId, onClick }) {
  const { id, setId, close, setPosition } = useContext(MenuContext);

  return (
    <StyledToggle
      onClick={(e) => {
        e.stopPropagation();
        // console.log('toggle click');
        // console.log('toggle', e.target.offsetTop)
        onClick && onClick(id === toggleId);
        if (id && id === toggleId) {
          close();
        } else {
          // console.log('set id', toggleId);
          setId(toggleId);
          const rect = e.target.closest('button').getBoundingClientRect();
          // console.log(
          //   'toggle rect',
          //   rect,
          //   'window.innerWidth',
          //   window.innerHeight,
          //   'window.innerWidth - rect.x',
          //   window.innerWidth - rect.x
          // );
          setPosition({
            x: window.innerWidth - rect.width - rect.x,
            y:
              rect.height + rect.y + 8 + 130 > window.innerHeight
                ? window.innerHeight - 130
                : rect.height + rect.y + 8,
          });
          // setPosition({ x: e.target.offsetWidth, y: e.target.offsetTop });
        }
      }}
    >
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

List.propTypes = {
  children: PropTypes.any,
  id: PropTypes.number,
};
function List({ children, id: toggleId }) {
  const { id, close, position } = useContext(MenuContext);
  const ref = useClickOutside(() => {
    close();
  }, false);

  if (id && position && id === toggleId)
    return createPortal(
      <StyledList position={position} ref={ref}>
        {/* <div>Menu {id.cabin.id}</div> */}
        {children}
      </StyledList>,
      document.body
    );
}

Button.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  icon: PropTypes.object,
};

function Button({ children, icon, onClick }) {
  const { close } = useContext(MenuContext);

  return (
    <li>
      <StyledButton
        onClick={() => {
          onClick();
          close();
        }}
      >
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
