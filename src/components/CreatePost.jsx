import './css/CreatePost.css';
import { useState } from 'react';
import { supabase } from './supabaseClient'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import generateUid from './GenerateUid';

const CreatePost = () => {
  const [confession, setConfession] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting confession:', confession);

      const response = await supabase
        .from('confession')
        .insert([{ 
          content: confession,
          uid: generateUid('confession_')
        }]);

      console.log('Full Supabase response:', response);

      if (response.error) {
        console.error('Supabase error:', JSON.stringify(response.error));
        throw response.error;
      }

      console.log('Confession added successfully:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Caught error:', error);
      console.error('Error type:', typeof error);
      console.error('Error stringify:', JSON.stringify(error));
      console.error('Error properties:', Object.getOwnPropertyNames(error));
      alert(`Error submitting confession: ${error.message || error.toString() || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create Confession</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          placeholder="Enter your confession here..."
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Confession'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
