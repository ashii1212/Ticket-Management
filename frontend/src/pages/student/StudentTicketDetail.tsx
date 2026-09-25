import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTicket, getComments, getActivity, addComment } from '../../api/tickets';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorState';
import { StatusBadge, PriorityBadge, SlaBadge } from '../../components/Badges';
import { format } from 'date-fns';
import { AlertTriangle, Clock, MessageSquare, Activity as ActivityIcon } from 'lucide-react';

export const StudentTicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ticketId = Number(id);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

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

  const commentMutation = useMutation({
    mutationFn: (content: string) => addComment(ticketId, { content, type: 'PUBLIC' }),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] }); // in case status changes
    }
  });

  if (isLoadingTicket || isLoadingComments || isLoadingActivities) return <LoadingSpinner />;
  if (isErrorTicket || !ticket) return <ErrorState message="Could not load ticket details." />;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length >= 10) {
      commentMutation.mutate(comment);
    }
  };

  const isClosed = ticket.status === 'CLOSED';
  const publicComments = comments.filter(c => c.type === 'PUBLIC');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {ticket.status === 'PENDING_STUDENT' && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">Action Required — Please respond to continue your request</h3>
            <p className="mt-1 text-sm text-amber-700">
              Staff has requested more information. Please reply below to resume work on your ticket.
              {ticket.pendingReason && <span className="block mt-2 font-medium">Reason: {ticket.pendingReason}</span>}
            </p>
          </div>
        </div>
      )}

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
              <div className="text-slate-500 mb-1">Category</div>
              <div className="font-medium text-slate-900">{ticket.category.name}</div>
            </div>
            <div>
              <div className="text-slate-500 mb-1">Created</div>
              <div className="font-medium text-slate-900">{format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}</div>
            </div>
            <div>
              <div className="text-slate-500 mb-1">Assigned To</div>
              <div className="font-medium text-slate-900">{ticket.assignedStaff?.name || 'Unassigned'}</div>
            </div>
            <div>
              <div className="text-slate-500 mb-1 flex items-center gap-1"><Clock className="w-4 h-4"/> SLA Deadline</div>
              <div className="font-medium text-slate-900 flex items-center gap-2">
                {format(new Date(ticket.slaDeadline), 'MMM d, HH:mm')}
                <SlaBadge status={ticket.slaStatus} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Description</h3>
            <div className="text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-md border border-slate-100">
              {ticket.description}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-400" />
          Conversation
        </h2>
        
        <div className="space-y-6 mb-6">
          {publicComments.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No comments yet.</p>
          ) : (
            publicComments.map(c => (
              <div key={c.id} className={`flex flex-col ${c.author.role === 'STUDENT' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-800">{c.author.name}</span>
                  <span className="text-xs text-slate-500">{format(new Date(c.createdAt), 'MMM d, HH:mm')}</span>
                </div>
                <div className={`p-3 rounded-lg max-w-[85%] text-sm ${c.author.role === 'STUDENT' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                  {c.content}
                </div>
              </div>
            ))
          )}
        </div>

        {!isClosed && (
          <form onSubmit={handleSubmitComment} className="mt-4 pt-4 border-t border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Add a reply</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Type your message here..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              minLength={10}
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={comment.trim().length < 10 || commentMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {commentMutation.isPending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <ActivityIcon className="w-5 h-5 text-slate-400" />
          Activity Timeline
        </h2>
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {activities.length === 0 ? (
             <p className="text-sm text-slate-500 italic pl-6">No recent activity.</p>
          ) : (
            activities.map((activity, i) => (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-white p-3 rounded border border-slate-200 shadow-sm ml-4 md:ml-0 md:group-odd:mr-0 md:group-even:ml-0">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-800 text-xs">{activity.activityType}</div>
                    <time className="text-[10px] font-medium text-slate-500">{format(new Date(activity.createdAt), 'MMM d, HH:mm')}</time>
                  </div>
                  <div className="text-slate-600 text-xs">{activity.description}</div>
                  <div className="text-slate-400 text-[10px] mt-1">by {activity.actor.name}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
