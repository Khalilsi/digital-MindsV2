import React, { useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

export default function RichTextEditor({ value, onChange, placeholder }) {
  const modules = {
    toolbar: '#quill-toolbar', // reference custom toolbar container
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'align',
    'link', 'image', 'code-block'
  ]

  const { quill, quillRef } = useQuill({ modules, formats, placeholder })

  const initializedRef = React.useRef(false)

  useEffect(() => {
    if (!quill) return

    // set initial content only once when editor is created
    if (!initializedRef.current) {
      if (value) quill.root.innerHTML = value
      initializedRef.current = true
    } else {
      // update only when external value changed and editor is NOT focused
      const current = quill.root.innerHTML
      if (value != null && value !== current && !quill.hasFocus()) {
        const sel = quill.getSelection()
        quill.root.innerHTML = value
        if (sel) quill.setSelection(sel.index, sel.length)
      }
    }

    const handler = () => onChange(quill.root.innerHTML)
    quill.on('text-change', handler)
    return () => quill.off('text-change', handler)
  }, [quill, value, onChange])
  return (
    <div>
      {/* custom toolbar - modify markup / classes to change header UI */}
      <div id="quill-toolbar" className="ql-toolbar ql-snow  bg-white/70  p-2">

        
        <button className="ql-bold ml-1" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        

        <select className="ql-color ml-3" />
        <select className="ql-background" />

        <button className="ql-list ml-3" value="ordered" />
        <button className="ql-list" value="bullet" />

        <button className="ql-link ml-3" />
        <button className="ql-image" />
        <button className="ql-code-block" />
      </div>

      <div ref={quillRef} className="bg-white/100 text-black " />
    </div>
  )
}