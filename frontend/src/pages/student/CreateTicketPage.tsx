import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../api/tickets';
import { getCategories } from '../../api/categories';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const createTicketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  categoryId: z.number().min(1, 'Category is required'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description is too long'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

type CreateTicketInputs = z.infer<typeof createTicketSchema>;

export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: categories = [], isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (data) => {
      navigate(`/student/tickets/${data.id}`);
    }
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateTicketInputs>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      priority: 'LOW'
    }
  });

  const onSubmit = (data: CreateTicketInputs) => {
    mutation.mutate(data);
  };

  if (isLoadingCats) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Create New Ticket</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {mutation.isError && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              Failed to create ticket. Please try again.
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input
              id="title"
              {...register('title')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Brief summary of the issue"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
              <select
                id="categoryId"
                {...register('categoryId', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value={0} disabled>Select a category...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Requested Priority</label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="LOW">Low - General query, no urgency</option>
                <option value="MEDIUM">Medium - Needs attention</option>
                <option value="HIGH">High - Important functionality blocked</option>
                <option value="CRITICAL">Critical - Complete system failure</option>
              </select>
              {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              id="description"
              {...register('description')}
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Provide detailed information about your issue..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mr-3 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting || mutation.isPending ? 'Submitting...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
