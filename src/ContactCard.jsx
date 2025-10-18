import { useState } from "react";

export default function ContactCard() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY, // use the env var here correctly
        name: formData.name || "Anonymous",
        email: formData.email || "noemail@example.com",
        message: formData.message || "No message provided",
        topic: formData.topic || "Contact Form Submission",
        phone: formData.phone || "",
      }),
    })

    const result = await response.json()
    if (result.success) {
      alert("Message sent successfully!")
      setFormData({ name: "", email: "", phone: "", topic: "", message: "" })
    } else {
      console.error(result)
      alert("Failed to send message. Please try again.")
    }
  } catch (err) {
    console.error(err)
    alert("An error occurred. Please try again.")
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <div className="max-w-2xl mx-auto p-6 mt-3 md:p-10 bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)] rounded-xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <label className="block font-semibold text-white mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-red-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold text-white mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@email.com"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-red-500"
              required
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <label className="block font-semibold text-white mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91xxxxxxxxxx"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-red-500"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold text-white mb-1">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="How can we help you?"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-red-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-white mb-1">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-2 bg-red-600 hover:bg-red-900 text-white font-semibold rounded transition"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}
