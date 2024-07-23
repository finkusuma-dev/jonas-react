import styled from 'styled-components';
import PropTypes from 'prop-types';
import { HiXMark } from 'react-icons/hi2';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';
import { cloneElement } from 'react';

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const StyledButton = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

Modal.propTypes = {
  children: PropTypes.any,
  onClose: PropTypes.func,
};

export const ModalContext = createContext();

function Modal({ children }) {
  const [modalOpen, openModal] = useState('');
  const closeModal = () => openModal('');

  return (
    <ModalContext.Provider value={{ modalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

Open.propTypes = {
  children: PropTypes.any,
  name: PropTypes.string,
};

function Open({ children, name }) {
  const { openModal } = useContext(ModalContext);
  return (
    <div>{cloneElement(children, { onClick: () => openModal(name) })}</div>
  );
}

Window.propTypes = {
  children: PropTypes.any,
  name: PropTypes.string,
};

function Window({ children, name }) {
  const { modalOpen, closeModal } = useContext(ModalContext);

  return name === modalOpen
    ? createPortal(
        <Overlay>
          <StyledModal>
            <StyledButton onClick={closeModal}>
              <HiXMark />
            </StyledButton>
            <div>
              {cloneElement(children, {
                onCloseModal: () => closeModal(),
              })}
            </div>
          </StyledModal>
        </Overlay>,
        document.body
      )
    : null;
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
