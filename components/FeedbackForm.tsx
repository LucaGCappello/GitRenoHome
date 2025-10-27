'use client';

import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

export default function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const { error } = await supabase.from('feedback').insert({
        name: formData.get('name') as string,
        rating: parseInt(formData.get('rating') as string),
        comment: formData.get('comment') as string,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Thank you for your feedback!' });
      form.reset();
      setRating(5);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Share Your Experience</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-semibold mb-2">
          Your Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-semibold mb-2">
          Rating *
        </label>
        <div className="flex gap-2 items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-3xl focus:outline-none"
            >
              {star <= rating ? '★' : '☆'}
            </button>
          ))}
          <span className="ml-2 text-slate-600">({rating} star{rating !== 1 ? 's' : ''})</span>
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-semibold mb-2">
          Your Feedback *
        </label>
        <textarea
          id="comment"
          name="comment"
          required
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        ></textarea>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
