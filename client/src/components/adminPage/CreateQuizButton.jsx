import React from 'react'
import CrButton from '../CrButton'

export default function CreateQuizButton({ onClick }) {
  return (
    <CrButton onClick={onClick} color='blue' className="text-black px-4 py-2">
      + Create
    </CrButton>
  )
}