import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import type { SupportTicket, TicketComment } from '@/types/firebaseSchema'

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'open' | 'in_progress' | 'resolved' | 'all'>('open')

  // Fetch tickets from Firestore
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual Firestore query
        // const q = query(
        //   collection(firebaseDb, 'support_tickets'),
        //   where('companyId', '==', user?.profile?.companyId),
        //   orderBy('createdAt', 'desc')
        // )
        // const snapshot = await getDocs(q)
        // setTickets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SupportTicket)))
        setLoading(false)
      } catch (err) {
        console.error('Error fetching tickets:', err)
        setLoading(false)
      }
    }

    if (user?.profile?.companyId) {
      fetchTickets()
    }
  }, [user?.profile?.companyId])

  const filteredTickets = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter)

  const handleAddComment = async () => {
    if (!selectedTicket || !newComment.trim()) return

    try {
      const comment: TicketComment = {
        id: `comment-${Date.now()}`,
        text: newComment,
        authorId: user?.uid || '',
        createdAt: new Date().toISOString(),
      }

      // TODO: Update ticket with new comment
      // await updateDoc(doc(firebaseDb, 'support_tickets', selectedTicket.id), {
      //   comments: [...(selectedTicket.comments || []), comment],
      // })

      setSelectedTicket({
        ...selectedTicket,
        comments: [...(selectedTicket.comments || []), comment],
      })
      setNewComment('')
    } catch (err) {
      console.error('Error adding comment:', err)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/30'
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-500/10 text-red-400'
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-400'
      case 'resolved':
        return 'bg-green-500/10 text-green-400'
      default:
        return 'bg-slate-500/10 text-slate-400'
    }
  }

  if (!user?.profile || user.profile.role !== 'admin' && user.profile.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Access Denied</h1>
          <p className="text-slate-400">Only administrators can access this page</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Manage user support tickets and issues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Support Tickets</h2>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {(['open', 'in_progress', 'resolved', 'all'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Tickets */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-slate-400">Loading...</div>
              ) : filteredTickets.length === 0 ? (
                <div className="p-6 text-center text-slate-400">No tickets found</div>
              ) : (
                <div className="divide-y divide-slate-700">
                  {filteredTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`w-full p-4 text-left transition-colors hover:bg-slate-800 ${
                        selectedTicket?.id === ticket.id ? 'bg-slate-800' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-white truncate">{ticket.subject}</h3>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">#{ticket.ticketNumber}</p>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <Card className="h-full flex flex-col">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{selectedTicket.subject}</h2>
                    <p className="text-slate-400">#{selectedTicket.ticketNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Created</p>
                    <p className="text-white font-medium">
                      {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Type</p>
                    <p className="text-white font-medium">{selectedTicket.type}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Ticket Description */}
                <div>
                  <h3 className="font-medium text-white mb-2">Description</h3>
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>

                {/* Related Entity */}
                {selectedTicket.relatedEntity && (
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Related {selectedTicket.relatedEntity}</p>
                    <p className="text-white font-medium">{selectedTicket.relatedEntityId}</p>
                  </div>
                )}

                {/* Comments */}
                <div>
                  <h3 className="font-medium text-white mb-3">Comments</h3>
                  <div className="space-y-3">
                    {selectedTicket.comments?.map((comment) => (
                      <div key={comment.id} className="p-3 bg-slate-800 rounded-lg">
                        <p className="text-xs text-slate-400 mb-1">{comment.authorId}</p>
                        <p className="text-slate-300">{comment.text}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add Comment */}
              <div className="p-6 border-t border-slate-700 space-y-3">
                <label className="block text-sm font-medium text-slate-200">Add Comment</label>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type your response here..."
                  rows={3}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddComment}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add Comment
                  </Button>
                  <select
                    onChange={(e) => {
                      // TODO: Update ticket status
                      // await updateDoc(doc(firebaseDb, 'support_tickets', selectedTicket.id), {
                      //   status: e.target.value,
                      // })
                    }}
                    defaultValue={selectedTicket.status}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl text-slate-700 mb-4">📋</div>
                <p className="text-slate-400">Select a ticket to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
