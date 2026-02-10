import React, { useRef, useEffect, useState } from 'react'
import { List as VirtualList } from 'react-window'
import CrButton from '../CrButton'

export default function AssignedQuizzesList({ assignments = [], onUnassign }) {

  const list = Array.isArray(assignments) ? assignments : []
  const containerRef = useRef(null)
  const [listWidth, setListWidth] = useState(0)

  useEffect(() => {
    function measure() {
      if (containerRef.current) setListWidth(containerRef.current.clientWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  if (!list.length) {
    return <div className="p-4 bg-white/6 rounded text-white/70">No assigned quizzes.</div>
  }

  const ITEM_HEIGHT = 72
  const MAX_LIST_HEIGHT = 480
  const useVirtual = list.length > 10 && typeof VirtualList === 'function' && listWidth > 0
  const listHeight = Math.min(MAX_LIST_HEIGHT, list.length * ITEM_HEIGHT)

  return (
    <div ref={containerRef} className="p-4 bg-white/5 rounded border border-white/6">
      <h3 className="text-lg font-semibold mb-3">Assigned quizzes</h3>

      {useVirtual ? (
        <div className="rounded bg-white/6 overflow-hidden">
          <VirtualList
            height={listHeight}
            itemCount={list.length}
            itemSize={ITEM_HEIGHT}
            width={listWidth}
          >
            {({ index, style }) => {
              const a = list[index]
              return (
                <div
                  style={style}
                  role="listitem"
                  className="flex items-center justify-between p-3 border-b border-white/6 bg-transparent"
                >
                  <div className="truncate">
                    <div className="text-white">{a.title || '(untitled)'}</div>
                    <div className="text-xs text-white/60">Assigned: {a.assignedAt || 'just now'}</div>
                  </div>

                  <CrButton color="red" size="sm" onClick={() => onUnassign && onUnassign(a.id)}>
                    Unassign
                  </CrButton>
                </div>
              )
            }}
          </VirtualList>
        </div>
      ) : (
        <ul className="space-y-2 max-h-[480px] overflow-auto">
          {list.map((a) => (
            <li key={a.id} className="flex items-center justify-between bg-white/6 p-3 rounded">
              <div>
                <div className="text-white truncate">{a.title || '(untitled)'}</div>
                <div className="text-xs text-white/60">Assigned: {a.assignedAt || 'just now'}</div>
              </div>
              <CrButton color="red" size="sm" onClick={() => onUnassign && onUnassign(a.id)}>
                Unassign
              </CrButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}