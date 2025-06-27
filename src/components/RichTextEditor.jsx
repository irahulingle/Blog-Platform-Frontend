import React, { useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const RichTextEditor = ({ value, onChange }) => {
  const [editorData, setEditorData] = useState(value || '')

  const handleEditorChange = (event, editor) => {
    const data = editor.getData()
    setEditorData(data)
    if (onChange) onChange(data)
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-md">
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        config={{
          placeholder: "Start writing your blog...",
        }}
        onReady={editor => {
          console.log('Editor is ready to use!', editor)
        }}
        onChange={handleEditorChange}
        onBlur={(event, editor) => {
          console.log('Editor blurred.', editor)
        }}
        onFocus={(event, editor) => {
          console.log('Editor focused.', editor)
        }}
      />
    </div>
  )
}

export default RichTextEditor
