import React, { useState } from "react";
import "../styles.css";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    message: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRating = (star) => {
    setFormData({ ...formData, rating: star });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.email.trim()) {
      newErrors.email = "Email required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (formData.rating === 0) newErrors.rating = "Rating required";

    if (formData.file && formData.file.size > 2 * 1024 * 1024) {
      newErrors.file = "File size must be < 2MB";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      // simulate API call
      await new Promise((res) => setTimeout(res, 1000));
      const isSuccess = Math.random() > 0.3; // 70% chance success
      if (isSuccess) {
        setSubmitted(true);
        setToast({ type: "success", message: "Feedback submitted!" });
      } else {
        setToast({ type: "error", message: "Failed to submit feedback!" });
      }
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      rating: 0,
      message: "",
      file: null,
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="form-container">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {submitted ? (
        <div className="success-msg">
          🎉 Thank you for your feedback, {formData.name}!
          <br />
          <button onClick={resetForm} className="reset-btn">
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${formData.rating >= star ? "selected" : ""}`}
                onClick={() => handleRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          {errors.rating && <p className="error-text">{errors.rating}</p>}

          <textarea
            name="message"
            placeholder="Your Feedback"
            value={formData.message}
            onChange={handleChange}
            maxLength={500}
          />
          <p className="char-counter">{formData.message.length}/500</p>

          <input type="file" name="file" onChange={handleChange} />
          {errors.file && <p className="error-text">{errors.file}</p>}

          <button type="submit" disabled={formData.rating === 0 || loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
