import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import type { ModalContentType } from '../types/modal';

type ModalCardProps = {
  modalContent: ModalContentType;
  handleClose: () => void;
};

export default function ModalCard({ modalContent, handleClose }: ModalCardProps): JSX.Element {
  return (
    <Modal show={modalContent !== null} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalContent?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>Location: {modalContent?.location.name}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
