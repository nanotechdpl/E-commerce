'use client'
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface props {
  activeTab: 'type' | 'draw' | 'upload'
  hash: string
}

const Signature: React.FC<props> = ({ activeTab, hash }) => {
  const [activeTabState, setActiveTabState] = useState<
    'type' | 'draw' | 'upload'
  >(activeTab || 'type')
  const [typedSignature, setTypedSignature] = useState('')
  const [uploadedSignature, setUploadedSignature] = useState<
    string | ArrayBuffer | null
  >(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleTypedSignatureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTypedSignature(e.target.value)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedSignature(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        canvas.onmousemove = (ev) => draw(ev)
      }
    }
  }

  const stopDrawing = () => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.onmousemove = null
    }
  }

  const draw = (e: MouseEvent) => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
      }
    }
  }

  useEffect(() => {
    if (canvasRef.current && hash) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const size = 200 // Set the canvas size
      const color = hashToColor(hash)

      canvas.width = size
      canvas.height = size

      // Fill the canvas with the generated color
      if (ctx) {
        ctx.fillStyle = color
        ctx.fillRect(0, 0, size, size)
      }
    }
  }, [hash])

  const hashToColor = (hash: string) => {
    // Convert hash to a RGB color code
    const r = parseInt(hash?.substring(0, 2), 16)
    const g = parseInt(hash?.substring(2, 4), 16)
    const b = parseInt(hash?.substring(4, 6), 16)
    return `rgb(${r},${g},${b})`
  }

  return (
    <div className='signature-section'>
      <div className='tab-buttons flex justify-center'>
        <button
          className={`border-2 border-blue-500 px-6 py-2 hover:text-white hover:bg-blue-500`}
          onClick={() => setActiveTabState('type')}
        >
          Type
        </button>
        <button
          className='border-2 border-blue-500 px-6 py-2 hover:text-white hover:bg-blue-500'
          onClick={() => setActiveTabState('draw')}
        >
          Draw
        </button>
        <button
          className='border-2 border-blue-500 px-5 py-2 hover:text-white hover:bg-blue-500'
          onClick={() => setActiveTabState('upload')}
        >
          Upload
        </button>
      </div>

      <div className='signature-input'>
        {activeTab === 'type' && (
          <input
            type='text'
            value={typedSignature}
            onChange={handleTypedSignatureChange}
            placeholder='Type your signature'
          />
        )}

        {activeTab === 'draw' && (
          <div>
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              className='border'
            ></canvas>
            <button
              className='flex justify-center text-center items-center'
              onClick={clearCanvas}
            >
              Clear
            </button>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className='bg-blue-300'>
            <input
              className='flex justify-center text-center'
              type='file'
              accept='image/*'
              onChange={handleFileUpload}
            />
            {uploadedSignature && (
              <div className='relative w-full h-25'>
                <Image
                  src={uploadedSignature as string}
                  alt='Uploaded signature'
                  layout='fill'
                  objectFit='contain'
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Signature
