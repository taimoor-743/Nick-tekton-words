'use client'

import { useState, useEffect, useRef } from 'react'
import Button from './Button'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export default function NewCopyForm() {
  const [businessDetails, setBusinessDetails] = useState('')
  const [websiteStructure, setWebsiteStructure] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [outputLink, setOutputLink] = useState('')
  const [error, setError] = useState('')
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleGenerate = async () => {
    if (!businessDetails.trim() || !websiteStructure.trim()) return

    setIsGenerating(true)
    setError('')
    setHasResult(false)
    setOutputLink('')

    try {
      // Generate UUID
      const requestId = uuidv4()
      setCurrentRequestId(requestId)

      // Insert into Supabase
      const { error: insertError } = await supabase
        .from('requests')
        .insert({
          id: requestId,
          business_details: businessDetails.trim(),
          website_structure: websiteStructure.trim(),
          status: 'pending'
        })

      if (insertError) {
        throw new Error('Failed to create request')
      }

      // Call n8n webhook
      const webhookUrl = 'https://n8n.srv833939.hstgr.cloud/webhook-test/5370bc4e-6508-4bed-b370-57fd35575f78'
      const callbackUrl = 'https://words.tektongrowth.com/api/callback'
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: requestId,
          businessDetails: businessDetails.trim(),
          websiteStructure: websiteStructure.trim(),
          callbackUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send request to n8n')
      }

      // Start polling
      startPolling(requestId)

    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsGenerating(false)
      setCurrentRequestId(null)
    }
  }

  const startPolling = (requestId: string) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('status, output_link, error_message')
          .eq('id', requestId)
          .single()

        if (error) {
          console.error('Polling error:', error)
          return
        }

        if (data.status === 'ready' && data.output_link) {
          setOutputLink(data.output_link)
          setHasResult(true)
          setIsGenerating(false)
          setCurrentRequestId(null)
          stopPolling()
        } else if (data.status === 'error') {
          setError(data.error_message || 'Generation failed')
          setIsGenerating(false)
          setCurrentRequestId(null)
          stopPolling()
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 2000)
  }

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  const handleReset = () => {
    setBusinessDetails('')
    setWebsiteStructure('')
    setIsGenerating(false)
    setHasResult(false)
    setOutputLink('')
    setError('')
    setCurrentRequestId(null)
    stopPolling()
  }

  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [])

  const isFormValid = businessDetails.trim() && websiteStructure.trim()

  return (
    <div className="max-w-4xl space-y-8">
      {/* Form */}
      <div className="space-y-6">
        <div>
          <label htmlFor="business-details" className="block text-sm font-medium text-zinc-700 mb-2">
            Business Details
          </label>
          <textarea
            id="business-details"
            value={businessDetails}
            onChange={(e) => setBusinessDetails(e.target.value)}
            placeholder="Describe your business, target audience, tone of voice, and any specific requirements..."
            className="w-full h-48 px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label htmlFor="website-structure" className="block text-sm font-medium text-zinc-700 mb-2">
            Website Structure / Pages
          </label>
          <textarea
            id="website-structure"
            value={websiteStructure}
            onChange={(e) => setWebsiteStructure(e.target.value)}
            placeholder="List the pages you need copy for (e.g., Home, About, Services, Contact) and any specific content requirements..."
            className="w-full h-48 px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid}
            loading={isGenerating}
            size="lg"
          >
            {isGenerating ? 'Generating copy...' : 'Generate Copy'}
          </Button>
          
          {hasResult && (
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
            >
              Generate New
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="border border-red-200 rounded-xl p-6 bg-red-50">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-2">Please check your n8n workflow logs for more details.</p>
        </div>
      )}

      {/* Output Section */}
      {hasResult && outputLink && (
        <div className="border border-zinc-200 rounded-xl p-6 bg-zinc-50">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Generated Copy</h3>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-zinc-600">Your copy has been generated successfully!</p>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(outputLink)
                  // You could add a toast notification here
                }}
                variant="secondary"
                size="sm"
              >
                Copy Link
              </Button>
            </div>
            <a 
              href={outputLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-600 hover:text-cyan-800 text-sm mt-2 inline-block"
            >
              View Generated Copy →
            </a>
          </div>
        </div>
      )}

      {/* Callback URL Display */}
      <div className="border border-zinc-200 rounded-xl p-6 bg-zinc-50">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Callback URL</h3>
        <p className="text-sm text-zinc-600 mb-2">Use this URL in your n8n workflow:</p>
        <div className="bg-white border border-zinc-200 rounded-lg p-3">
          <code className="text-sm text-zinc-800">
            {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/callback
          </code>
        </div>
      </div>
    </div>
  )
}
