import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTicket, getComments, getActivity, addComment, transitionStatus, resolveTicket, escalateTicket, assignTicket } from '../../api/tickets';
import { useAuth } from '../../auth/AuthContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorState';
import { StatusBadge, PriorityBadge, SlaBadge } from '../../components/Badges';
import { Modal } from '../../components/Modal';
import { format } from 'date-fns';
import { Clock, MessageSquare, Activity as ActivityIcon } from 'lucide-react';

export const StaffTicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ticketId = Number(id);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [comment, setComment] = useState('');
  const [commentType, setCommentType] = useState<'PUBLIC' | 'INTERNAL'>('PUBLIC');
  
  // Modals state
  const [activeModal, setActiveModal] = useState<'NONE' | 'PENDING' | 'RESOLVE' | 'ESCALATE'>('NONE');
  const [modalText, setModalText] = useState('');

  const { data: ticket, isLoading: isLoadingTicket, isError: isErrorTicket } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => getTicket(ticketId)
  });

  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ['comments', ticketId],
    queryFn: () => getComments(ticketId)
  });

  const { data: activities = [], isLoading: isLoadingActivities } = useQuery({
    queryKey: ['activities', ticketId],
    queryFn: () => getActivity(ticketId)
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
    queryClient.invalidateQueries({ queryKey: ['activities', ticketId] });
    setActiveModal('NONE');
    setModalText('');
  };

  const actionMutation = useMutation({
    mutationFn: async ({ action, payload }: { action: string, payload?: any }) => {
      switch (action) {
        case 'ASSIGN': return assignTicket(ticketId, user!.id);
        case 'START': return transitionStatus(ticketId, 'IN_PROGRESS');
        case 'PENDING': return transitionStatus(ticketId, 'PENDING_STUDENT', payload);
        case 'RESOLVE': return resolveTicket(ticketId, payload);
        case 'ESCALATE': return escalateTicket(ticketId, payload);
        case 'RESUME': return transitionStatus(ticketId, 'IN_PROGRESS');
        case 'REOPEN': return transitionStatus(ticketId, 'NEW');
      }
    },
    onSuccess: invalidateAll
  });

  const commentMutation = useMutation({
    mutationFn: () => addComment(ticketId, { content: comment, type: commentType }),
    onSuccess: () => {
      setComment('');
      setCommentType('PUBLIC');
      invalidateAll();
    }
  });

  if (isLoadingTicket || isLoadingComments || isLoadingActivities) return <LoadingSpinner />;
  if (isErrorTicket || !ticket) return <ErrorState message="Could not load ticket." />;

  const isPending = actionMutation.isPending || commentMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-800">Actions</h2>
        <div className="flex flex-wrap gap-2">
          {!ticket.assignedStaff && (
            <button onClick={() => actionMutation.mutate({ action: 'ASSIGN' })} disabled={isPending} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50">Assign to Me</button>
          )}
          {ticket.status === 'ASSIGNED' && (
            <button onClick={() => actionMutation.mutate({ action: 'START' })} disabled={isPending} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">Start Work</button>
          )}
          {ticket.status === 'IN_PROGRESS' && (
            <>
              <button onClick={() => setActiveModal('PENDING')} disabled={isPending} className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-medium hover:bg-amber-600 disabled:opacity-50">Request Info</button>
              <button onClick={() => setActiveModal('ESCALATE')} disabled={isPending} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50">Escalate</button>
              <button onClick={() => setActiveModal('RESOLVE')} disabled={isPending} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50">Resolve</button>
            </>
          )}
          {ticket.status === 'PENDING_STUDENT' && (
            <button onClick={() => actionMutation.mutate({ action: 'RESUME' })} disabled={isPending} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">Resume Work</button>
          )}
          {ticket.status === 'RESOLVED' && (
             <button onClick={() => actionMutation.mutate({ action: 'REOPEN' })} disabled={isPending} className="px-4 py-2 bg-slate-600 text-white rounded-md text-sm font-medium hover:bg-slate-700 disabled:opacity-50">Reopen</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-1">Ticket {ticket.ticketNumber}</div>
                  <h1 className="text-2xl font-bold text-slate-800">{ticket.title}</h1>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-slate-50 p-4 rounded-md mb-6">
                <div>
                  <div className="text-slate-500 mb-1">Student</div>
                  <div className="font-medium text-slate-900">{ticket.student.name}</div>
                  <div className="text-xs text-slate-500">{ticket.student.email}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Category</div>
                  <div className="font-medium text-slate-900">{ticket.category.name}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Assigned To</div>
                  <div className="font-medium text-slate-900">{ticket.assignedStaff?.name || 'Unassigned'}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1 flex items-center gap-1"><Clock className="w-4 h-4"/> SLA</div>
                  <div className="font-medium text-slate-900 flex flex-col gap-1">
                    <SlaBadge status={ticket.slaStatus} />
                    <span className="text-xs">{format(new Date(ticket.slaDeadline), 'MMM d, HH:mm')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-2">Description</h3>
                <div className="text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-md border border-slate-100">
                  {ticket.description}
                </div>
              </div>
              
              {ticket.resolutionNote && (
                <div className="mt-4 bg-green-50 p-4 rounded-md border border-green-200">
                  <h3 className="text-sm font-semibold text-green-900 mb-1">Resolution Note</h3>
                  <div className="text-green-800 text-sm whitespace-pre-wrap">{ticket.resolutionNote}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-slate-400" />
              Conversation
            </h2>
            
            <div className="space-y-4 mb-6">
              {comments.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No comments yet.</p>
              ) : (
                comments.map(c => (
                  <div key={c.id} className={`flex flex-col ${c.author.role === 'STUDENT' ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-800">{c.author.name}</span>
                      <span className="text-xs text-slate-500">{format(new Date(c.createdAt), 'MMM d, HH:mm')}</span>
                      {c.type === 'INTERNAL' && <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">INTERNAL</span>}
                    </div>
                    <div className={`p-3 rounded-lg max-w-[85%] text-sm ${c.type === 'INTERNAL' ? 'bg-amber-100 text-amber-900 border border-amber-200' : (c.author.role === 'STUDENT' ? 'bg-blue-50 text-slate-800 rounded-tl-none border border-blue-100' : 'bg-slate-100 text-slate-800 rounded-tr-none')}`}>
                      {c.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {ticket.status !== 'CLOSED' && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="radio" value="PUBLIC" checked={commentType === 'PUBLIC'} onChange={() => setCommentType('PUBLIC')} className="text-blue-600" />
                    Public Reply
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="radio" value="INTERNAL" checked={commentType === 'INTERNAL'} onChange={() => setCommentType('INTERNAL')} className="text-amber-500" />
                    Internal Note
                  </label>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder={commentType === 'PUBLIC' ? "Type a reply to the student..." : "Type an internal note for staff..."}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 sm:text-sm ${commentType === 'INTERNAL' ? 'bg-amber-50 border-amber-300 focus:ring-amber-500 focus:border-amber-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}`}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => commentMutation.mutate()}
                    disabled={comment.trim().length === 0 || isPending}
                    className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-900 disabled:opacity-50"
                  >
                    Add {commentType === 'INTERNAL' ? 'Note' : 'Reply'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-slate-400" />
              Activity Timeline
            </h2>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No activity.</p>
              ) : (
                activities.map(activity => (
                  <div key={activity.id} className="text-sm border-l-2 border-slate-200 pl-3 pb-2">
                    <div className="font-semibold text-slate-800 flex justify-between">
                      {activity.activityType}
                      <span className="text-xs font-normal text-slate-500">{format(new Date(activity.createdAt), 'MMM d, HH:mm')}</span>
                    </div>
                    <div className="text-slate-600 mt-0.5">{activity.description}</div>
                    <div className="text-xs text-slate-400 mt-1">by {activity.actor.name}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={activeModal !== 'NONE'} onClose={() => setActiveModal('NONE')} title={activeModal === 'PENDING' ? 'Request Info' : activeModal === 'RESOLVE' ? 'Resolve Ticket' : 'Escalate Ticket'}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {activeModal === 'PENDING' && "Please provide the reason you are waiting on the student. They will see this message."}
            {activeModal === 'RESOLVE' && "Please provide a resolution note summarizing how the issue was fixed. The student will see this."}
            {activeModal === 'ESCALATE' && "Please provide the reason for escalating this ticket."}
          </p>
          <textarea
            value={modalText}
            onChange={(e) => setModalText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Type here..."
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setActiveModal('NONE')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200">Cancel</button>
            <button 
              onClick={() => actionMutation.mutate({ action: activeModal, payload: modalText })}
              disabled={modalText.trim().length === 0 || isPending}
              className={`px-4 py-2 text-white rounded-md text-sm font-medium disabled:opacity-50 ${activeModal === 'RESOLVE' ? 'bg-green-600 hover:bg-green-700' : activeModal === 'ESCALATE' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
