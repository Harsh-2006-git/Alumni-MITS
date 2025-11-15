import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Building,
  Users,
  BookOpen,
  Send,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

export default function ContactPage({ isDarkMode, toggleTheme }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const contactInfo = {
    main: [
      {
        icon: Phone,
        label: "Phone",
        value: "0751-240-9354",
        link: "tel:07512409354",
      },
      {
        icon: Mail,
        label: "Email",
        value: "director@mitsgwalior.in",
        link: "mailto:director@mitsgwalior.in",
      },
      {
        icon: MapPin,
        label: "Address",
        value: "Gola ka Mandir, Gwalior - 474005, Madhya Pradesh, India",
        link: "https://maps.google.com/?q=Madhav+Institute+of+Technology+and+Science+Gwalior",
      },
    ],
    departments: [
      {
        department: "Admissions Office",
        phone: "+91 9343250503",
      },
      {
        department: "Student Services",
        phone: "+91 9343250503",
      },
      {
        department: "Registrar",
        phone: "+91 6267473144",
      },
    ],
    emails: [
      {
        department: "General Inquiries",
        email: "counsellordrsapna@mitsgwalior.in",
      },
      {
        department: "Admissions",
        email: "registrar@mitsgwalior.in",
      },
      {
        department: "Academic Affairs",
        email: "registrar@mitsgwalior.in",
      },
    ],
    hours: [
      { day: "Monday - Friday", time: "8:00 AM - 6:00 PM" },
      { day: "Saturday", time: "9:00 AM - 1:00 PM" },
      { day: "Sunday", time: "Closed" },
    ],
    websites: [
      {
        name: "Main Website",
        url: "web.mitsgwalior.in",
        link: "https://web.mitsgwalior.in",
      },
      {
        name: "Student Portal IMS (MITS Institute)",
        url: "portal.college.mits",
        link: "https://portal.college.mits",
      },
      {
        name: "Student Portal IUMS (MITS-DU)",
        url: "portal.college.mits",
        link: "https://portal.college.mits",
      },
    ],
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="container mx-auto px-8 lg:px-12 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Send className="w-8 h-8 text-cyan-400" />
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <Send className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-xl lg:text-2xl mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
            Get in Touch with MITS
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div
            className={`rounded-3xl p-8 lg:p-12 border-2 shadow-2xl transition-all ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 backdrop-blur-sm border-blue-600/20"
                : "bg-gradient-to-br from-white to-blue-100/80 backdrop-blur-sm border-blue-200 shadow-xl"
            }`}
          >
            <div className="flex items-center gap-3 mb-8">
              <Building className="w-8 h-8 text-cyan-400" />
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Main Campus
              </h2>
            </div>
            <p
              className={`text-lg mb-8 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Our flagship campus is conveniently located in the heart of the
              city, offering state-of-the-art facilities in a modern academic
              environment.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Contact Information */}
              <div className="space-y-8">
                {/* Main Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <Phone className="w-6 h-6" />
                    Contact Information
                  </h3>
                  {contactInfo.main.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={index}
                        href={item.link}
                        className={`flex items-start gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                          isDarkMode
                            ? "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700"
                            : "bg-white hover:bg-gray-50 border border-gray-200 shadow"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-full ${
                            isDarkMode ? "bg-cyan-500/20" : "bg-cyan-100"
                          }`}
                        >
                          <Icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-cyan-400">
                            {item.label}
                          </p>
                          <p
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {item.value}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>

                {/* Department Contacts */}
                <div>
                  <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Department Contacts
                  </h3>
                  <div
                    className={`p-6 rounded-xl ${
                      isDarkMode
                        ? "bg-slate-800/50 border border-slate-700"
                        : "bg-white border border-gray-200 shadow"
                    }`}
                  >
                    {contactInfo.departments.map((dept, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b last:border-b-0"
                        style={{
                          borderColor: isDarkMode
                            ? "rgba(100, 116, 139, 0.3)"
                            : "rgba(229, 231, 235, 1)",
                        }}
                      >
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {dept.department}
                        </span>
                        <a
                          href={`tel:${dept.phone.replace(/\D/g, "")}`}
                          className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          {dept.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Contacts */}
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <Mail className="w-6 h-6" />
                    Email Contacts
                  </h3>
                  <div
                    className={`p-6 rounded-xl ${
                      isDarkMode
                        ? "bg-slate-800/50 border border-slate-700"
                        : "bg-white border border-gray-200 shadow"
                    }`}
                  >
                    {contactInfo.emails.map((email, index) => (
                      <div
                        key={index}
                        className="py-3 border-b last:border-b-0"
                        style={{
                          borderColor: isDarkMode
                            ? "rgba(100, 116, 139, 0.3)"
                            : "rgba(229, 231, 235, 1)",
                        }}
                      >
                        <p
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {email.department}:
                        </p>
                        <a
                          href={`mailto:${email.email}`}
                          className="text-purple-400 hover:text-purple-300 font-semibold break-all"
                        >
                          {email.email}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Map and Additional Info */}
              <div className="space-y-8">
                {/* Map */}
                <div>
                  <h3 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    Campus Location
                  </h3>
                  <div
                    className={`rounded-xl overflow-hidden border-2 ${
                      isDarkMode ? "border-slate-700" : "border-gray-200"
                    }`}
                  >
                    {/* Google Maps Embed */}
                    <div className="w-full h-64">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.126265347955!2d78.20456327588724!3d26.230225377047315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c14c64938e5f%3A0x87b3d6a725f7b077!2sMadhav%20Institute%20of%20Technology%20%26%20Science%2C%20Gwalior!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="MITS Gwalior Campus Location"
                        className="transition-all duration-300 hover:shadow-lg"
                      ></iframe>
                    </div>

                    {/* Location Info Overlay */}
                    <div
                      className={`p-4 ${
                        isDarkMode ? "bg-slate-800" : "bg-white"
                      } border-t ${
                        isDarkMode ? "border-slate-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <div>
                          <p
                            className={`font-semibold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Madhav Institute of Technology and Science
                          </p>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Gola ka Mandir, Gwalior - 474005, Madhya Pradesh,
                            India
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3 mt-4">
                    <a
                      href="https://www.google.com/maps/place/Madhav+Institute+of+Technology+%26+Science,+Gwalior/@26.232364,78.21004,15z/data=!4m14!1m7!3m6!1s0x3976c14c64938e5f:0x87b3d6a725f7b077!2sMadhav+Institute+of+Technology+%26+Science,+Gwalior!8m2!3d26.2302254!4d78.207152!16s%2Fm%2F02qxs_p!3m5!1s0x3976c14c64938e5f:0x87b3d6a725f7b077!8m2!3d26.2302254!4d78.207152!16s%2Fm%2F02qxs_p?hl=en&entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center py-2 px-4 rounded-lg transition-all hover:scale-105 ${
                        isDarkMode
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                          : "bg-emerald-100 text-emerald-600 border border-emerald-200 hover:bg-emerald-200"
                      }`}
                    >
                      Open in Maps
                    </a>
                    <a
                      href="https://www.google.com/maps/dir//Madhav+Institute+of+Technology+%26+Science,+Gwalior/@26.2302254,78.207152,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3976c14c64938e5f:0x87b3d6a725f7b077!2m2!1d78.207152!2d26.2302254?hl=en&entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center py-2 px-4 rounded-lg transition-all hover:scale-105 ${
                        isDarkMode
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                          : "bg-blue-100 text-blue-600 border border-blue-200 hover:bg-blue-200"
                      }`}
                    >
                      Get Directions
                    </a>
                  </div>
                </div>

                {/* Office Hours */}
                <div>
                  <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    Office Hours
                  </h3>
                  <div
                    className={`p-6 rounded-xl ${
                      isDarkMode
                        ? "bg-slate-800/50 border border-slate-700"
                        : "bg-white border border-gray-200 shadow"
                    }`}
                  >
                    {contactInfo.hours.map((hour, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b last:border-b-0"
                        style={{
                          borderColor: isDarkMode
                            ? "rgba(100, 116, 139, 0.3)"
                            : "rgba(229, 231, 235, 1)",
                        }}
                      >
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {hour.day}
                        </span>
                        <span
                          className={`font-semibold ${
                            hour.time === "Closed"
                              ? "text-red-400"
                              : "text-amber-400"
                          }`}
                        >
                          {hour.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Online Resources */}
                <div>
                  <h3 className="text-2xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
                    <Globe className="w-6 h-6" />
                    Online Resources
                  </h3>
                  <div
                    className={`p-6 rounded-xl ${
                      isDarkMode
                        ? "bg-slate-800/50 border border-slate-700"
                        : "bg-white border border-gray-200 shadow"
                    }`}
                  >
                    {contactInfo.websites.map((site, index) => (
                      <div
                        key={index}
                        className="py-3 border-b last:border-b-0"
                        style={{
                          borderColor: isDarkMode
                            ? "rgba(100, 116, 139, 0.3)"
                            : "rgba(229, 231, 235, 1)",
                        }}
                      >
                        <p
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {site.name}:
                        </p>
                        <a
                          href={site.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 font-semibold break-all"
                        >
                          {site.url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
