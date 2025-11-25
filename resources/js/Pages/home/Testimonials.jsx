import React from 'react'

export default function Testimonials() {
  return (
    <>
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        
        <div className="text-center mb-8">
          <h2 className="fading text-white text-3xl lg:text-4xl font-bold mb-2">This is what is said.</h2>
          <p className='fading text-gray-500 mb-8'>See what we’ve built and how we’ve helped businesses just like yours crush it online.</p>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {[
             { 
                name: "Raj K.", 
                location: "Delhi", 
                message: "Very professional and quick. I didn’t expect such fast results, but they delivered!" 
               },
               { 
                  name: "Sarah M.", 
                  location: "Mumbai", 
                  message: "I was honestly surprised by how smooth everything went. The interface is clean and simple. Support was always available whenever I needed help. Truly a great experience!" 
               },
            { 
               name: "Priya S.", 
               location: "Bangalore", 
               message: "Loved using the platform! Easy to understand, easy to navigate. The whole process felt effortless. Highly recommended for anyone looking for a reliable service." 
            },
            { 
               name: "Amit P.", 
               location: "Pune", 
               message: "Super convenient and user-friendly. Everything worked exactly as described." 
            },
            { 
               name: "Neha G.", 
               location: "Hyderabad", 
               message: "The experience was fantastic from start to finish. Clear steps, helpful prompts, and a very clean design. I got exactly what I needed without any confusion." 
            },
            { 
               name: "Vikram R.", 
               location: "Chennai", 
               message: "Very reliable service. I’ve already recommended it to my friends and colleagues." 
            },

            // New with mixed lengths
            { 
               name: "Karan J.", 
               location: "Ahmedabad", 
               message: "I had a great time using this platform. It's rare to find something this smooth. Everything just works!" 
            },
            { 
               name: "Meera L.", 
               location: "Kolkata", 
               message: "Amazing customer support! They guided me patiently step by step. The entire process became so easy because of their clarity. Extremely happy with the experience." 
            },
            { 
               name: "Rohit T.", 
               location: "Jaipur", 
               message: "Fast and efficient. Loved the simplicity!" 
            },
            { 
               name: "Ananya P.", 
               location: "Surat", 
               message: "One of the best online experiences I’ve had. The layout is easy, the steps are clear, and the response time is amazing. Definitely coming back!" 
            }
          ].map((testimonial, index) => (
               <div key={index} className='fading relative p-[1px] mb-4  rounded-[19px] overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800'>
                  <div  className="break-inside-avoid bg-dark rounded-[19px]  p-6 hover:border-cyan-500/30 transition-colors">
                     <p className="text-gray-300 mb-4">"{testimonial?.message}"</p>
                     <div className="text-sm">
                        <div className="font-semibold text-main text-[17px]">{testimonial.name}</div>
                     </div>
                  </div>
               </div>

          ))}
        </div>
      </section>
    </>
  )
}
