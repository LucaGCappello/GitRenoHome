'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Feedback {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading feedback...</div>;
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-8 text-slate-600">
        No feedback yet. Be the first to share your experience!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg">{feedback.name}</h3>
              <p className="text-sm text-slate-500">{formatDate(feedback.created_at)}</p>
            </div>
            <div className="flex text-yellow-500 text-xl">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>{i < feedback.rating ? '★' : '☆'}</span>
              ))}
            </div>
          </div>
          <p className="text-slate-700">{feedback.comment}</p>
        </div>
      ))}
    </div>
  );
}
