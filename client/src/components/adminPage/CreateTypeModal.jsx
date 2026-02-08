import React from 'react'
import CrButton from '../../components/CrButton'
import Modal from '../../components/Modal'

export default function CreateTypeModal({ open, onClose, onSelect }) {
  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Choose quiz type"
      footer={
        <>
          <CrButton onClick={() => onSelect('classic')} color="blue">Classic Quiz</CrButton>
          <CrButton onClick={() => onSelect('problem')} color="gold">Problem (Coding)</CrButton>
          <CrButton onClick={onClose} color="red">Cancel</CrButton>
        </>
      }
    >
      <p className="text-sm text-white/80">Pick Classic for Q&A or Problem for coding/algorithm tasks.</p>
    </Modal>
  )
}