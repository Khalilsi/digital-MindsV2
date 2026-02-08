import React from 'react'
import QuestionCard from './QuestionCard'
import CrButton from '../CrButton'
import { Droppable, Draggable } from '@hello-pangea/dnd'

export default function QuestionList({ questions = [], onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-white">Questions</h3>
        <CrButton color="blue" size="sm" onClick={onAdd}>+ Add Question</CrButton>
      </div>

      <Droppable droppableId="questions">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-3">
            {questions.length === 0 ? (
              <div className="p-4 bg-white/5 rounded text-white/70">No questions yet — add one</div>
            ) : (
              questions.map((q, i) => (
                <Draggable key={q.id} draggableId={q.id.toString()} index={i}>
                  {(prov, snapshot) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className={`${snapshot.isDragging ? 'ring-2 ring-offset-2 ring-indigo-400' : ''}`}
                    >
                      <QuestionCard q={q} index={i} onEdit={onEdit} onDelete={onDelete} />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}